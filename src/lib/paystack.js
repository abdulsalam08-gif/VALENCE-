/**
 * VALENCE Paystack Checkout Helper (Phase 5)
 *
 * Loads the official Paystack inline.js SDK once and opens a secure embed
 * checkout for a given amount (in NGN; converted to kobo for Paystack).
 *
 * The public key is exposed to the frontend via VITE_PAYSTACK_PUBLIC_KEY
 * (public keys are safe for client-side use). Payment success is confirmed
 * against the server via the store-verify-payment Edge Function.
 */

const SDK_URL = 'https://js.paystack.co/v1/inline.js';

let sdkPromise = null;

export function getPaystackPublicKey() {
  return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
}

export function isPaystackConfigured() {
  return Boolean(getPaystackPublicKey());
}

function loadSdk() {
  if (typeof window !== 'undefined' && window.Paystack) {
    return Promise.resolve(window.Paystack);
  }
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('paystack-inline-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Paystack));
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load the Paystack SDK'))
      );
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-inline-js';
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve(window.Paystack);
    script.onerror = () => reject(new Error('Failed to load the Paystack SDK'));
    document.body.appendChild(script);
  });
  return sdkPromise;
}

/**
 * Open the Paystack embed checkout.
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
  const Paystack = await loadSdk();
  const amountKobo = Math.round(Number(amountNgn) * 100);
  if (!amountKobo || amountKobo <= 0) {
    throw new Error('Invalid order amount for Paystack checkout.');
  }
  const handler = Paystack.embedCheckout({
    key: getPaystackPublicKey(),
    email,
    amount: amountKobo,
    reference,
    ...(name ? { name } : {}),
    onSuccess: (response) => {
      if (typeof onSuccess === 'function') onSuccess(response);
    },
    onClose: () => {
      if (typeof onClose === 'function') onClose();
    },
  });
  handler.open();
}

/** Generate a short, unique, Paystack-safe payment reference. */
export function generatePaymentReference() {
  const ts = Date.now().toString(36).slice(-8).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VL${ts}${rand}`.slice(0, 30);
}
