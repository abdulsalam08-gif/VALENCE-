/**
 * VALENCE Paystack Checkout Helper (Phase 5)
 *
 * Loads the official Paystack InlineJS v2 SDK once and opens a secure embed
 * checkout for a given amount (in NGN; converted to kobo for Paystack).
 *
 * The public key is exposed to the frontend via VITE_PAYSTACK_PUBLIC_KEY
 * (public keys are safe for client-side use). Payment success is confirmed
 * against the server via the store-verify-payment Edge Function.
 *
 * Uses the current InlineJS v2 API (https://js.paystack.co/v2/inline.js):
 *   new PaystackPop().newTransaction({ key, email, amount, reference, ... })
 * The legacy /v1/inline.js SDK (window.PaystackPop.setup + openIframe) is
 * deprecated, and `Paystack.embedCheckout` never existed — the old loader
 * resolved to an undefined `window.Paystack`, which made every checkout fail
 * with "Paystack checkout failed to open".
 */

const SDK_URL = 'https://js.paystack.co/v2/inline.js';

let sdkPromise = null;

export function getPaystackPublicKey() {
  return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
}

export function isPaystackConfigured() {
  return Boolean(getPaystackPublicKey());
}

function loadSdk() {
  if (typeof window !== 'undefined' && window.PaystackPop) {
    return Promise.resolve(window.PaystackPop);
  }
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('paystack-inline-js');
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.PaystackPop) resolve(window.PaystackPop);
        else reject(new Error('Paystack SDK loaded but the PaystackPop global is missing.'));
      });
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load the Paystack SDK'))
      );
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-inline-js';
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      if (window.PaystackPop) resolve(window.PaystackPop);
      else reject(new Error('Paystack SDK loaded but the PaystackPop global is missing.'));
    };
    script.onerror = () => reject(new Error('Failed to load the Paystack SDK'));
    document.body.appendChild(script);
  });
  return sdkPromise;
}

/**
 * Open the Paystack embed checkout using InlineJS v2.
 * @param {object} opts
 * @param {string} opts.email     Payer email (auth user email)
 * @param {string} opts.name      Payer name
 * @param {number} opts.amountNgn Order grand total in NGN
 * @param {string} opts.reference Unique payment reference
 * @param {function} opts.onSuccess Called with the Paystack success response
 * @param {function} opts.onClose  Called when the modal is closed without success
 */
export async function openPaystackCheckout({
  email,
  name = '',
  amountNgn,
  reference,
  onSuccess,
  onClose,
}) {
  if (!isPaystackConfigured()) {
    throw new Error('Paystack is not configured (missing VITE_PAYSTACK_PUBLIC_KEY).');
  }
  const PaystackPop = await loadSdk();
  const amountKobo = Math.round(Number(amountNgn) * 100);
  if (!amountKobo || amountKobo <= 0) {
    throw new Error('Invalid order amount for Paystack checkout.');
  }

  const popup = new PaystackPop();
  popup.newTransaction({
    key: getPaystackPublicKey(),
    email,
    amount: amountKobo,
    currency: 'NGN',
    reference,
    ...(name ? { name } : {}),
    onSuccess: (response) => {
      if (typeof onSuccess === 'function') onSuccess(response);
    },
    onCancel: () => {
      if (typeof onClose === 'function') onClose();
    },
    onError: (error) => {
      // Surface popup-level failures (invalid key, network, declined init)
      // by returning to the caller's close path so they can retry.
      console.error('Paystack checkout error:', error);
      if (typeof onClose === 'function') onClose();
    },
  });
}

/** Generate a short, unique, Paystack-safe payment reference. */
export function generatePaymentReference() {
  const ts = Date.now().toString(36).slice(-8).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VL${ts}${rand}`.slice(0, 30);
}
