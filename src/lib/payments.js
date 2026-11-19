/**
 * VALENCE Paystack Payment Engine + Tuition & Live Class Access (Phase 8)
 *
 * Server-verified payment flows for the ₦3,000 per-level tuition unlock,
 * tuition enrolment (gated by the unlock), and Google Meet access control
 * for live classes. All server logic runs in Postgres RPCs (SECURITY DEFINER)
 * — the client only orchestrates the Paystack checkout and retries.
 */

import { supabase } from './supabase';
import { openPaystackCheckout, generatePaymentReference } from './paystack';

/* ---------------- Level unlock (₦3,000, server-verified) ---------------- */

/**
 * Resolve a level reference (DB uuid or code like 'ats-1' / 'foundation')
 * to the authoritative DB level row.
 */
export async function resolveExaminationLevel(levelRef) {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabase.rpc('resolve_examination_level', {
    p_level_ref: levelRef,
  });
  if (error) throw new Error(error.message || 'Unable to resolve the examination level.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Create a level-unlock payment transaction server-side.
 * Returns { transaction_id, reference, amount_ngn, currency, status }.
 */
export async function createLevelUnlockPayment(levelId) {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabase.rpc('create_level_unlock_payment', {
    p_level_id: levelId,
  });
  if (error) throw new Error(error.message || 'Unable to create the unlock payment.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Confirm a completed Paystack level-unlock payment.
 * Two-phase: the RPC schedules the Paystack verification (pg_net job) and
 * returns { status: 'verifying' }; this helper retries until the job result
 * is picked up and the level is unlocked (or a hard error returns).
 */
export async function confirmLevelUnlockPayment({ transactionId, reference, amountNgn }) {
  const maxAttempts = 10;
  const delayMs = 2500;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { data, error } = await supabase.rpc('verify_level_unlock_payment', {
      p_transaction_id: transactionId,
      p_reference: reference,
      p_amount: Number(amountNgn),
    });
    if (error) {
      const detail =
        error.message ||
        (error.details ? JSON.stringify(error.details) : 'Unable to verify the payment.');
      throw new Error(detail);
    }
    if (data?.error) throw new Error(data.error);
    if (data?.status === 'verifying') {
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw new Error('Paystack verification is taking longer than expected. Please retry.');
    }
    return data;
  }
  throw new Error('Unable to verify the payment.');
}

/**
 * Full unlock flow: resolve the level, create the server transaction, open
 * the Paystack embed checkout, and confirm the payment server-side.
 * Returns the final result.
 */
export async function unlockLevelWithPaystack({ levelRef, email, name, onStatus }) {
  onStatus?.('resolving');
  const level = await resolveExaminationLevel(levelRef);
  const levelId = level.level_id;
  const payment = await createLevelUnlockPayment(levelId);
  onStatus?.('checkout', payment);
  await new Promise((resolve) =>
    openPaystackCheckout({
      email,
      name,
      amountNgn: payment.amount_ngn,
      reference: payment.reference,
      onSuccess: async (response) => {
        const ref = response?.reference || payment.reference;
        onStatus?.('verifying');
        try {
          const result = await confirmLevelUnlockPayment({
            transactionId: payment.transaction_id,
            reference: ref,
            amountNgn: payment.amount_ngn,
          });
          onStatus?.('unlocked', result);
        } catch (err) {
          onStatus?.('error', err.message);
          throw err;
        }
      },
      onClose: () => onStatus?.('closed'),
    }).then(resolve).catch(resolve)
  );
}

/* ---------------- Tuition enrolment ---------------- */

export async function enrollTuition(levelId, courseIds = []) {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabase.rpc('enroll_tuition', {
    p_level_id: levelId,
    p_course_ids: courseIds,
  });
  if (error) throw new Error(error.message || 'Unable to enrol for tuition.');
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function fetchMyTuitionEnrolments() {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('fetch_my_tuition_enrolments');
  if (error) throw new Error(error.message || 'Unable to load tuition enrolments.');
  if (Array.isArray(data)) return data;
  if (data?.error) throw new Error(data.error);
  return [];
}

/* ---------------- Live classes (Google Meet access control) ---------------- */

export async function listLiveClassSessions(levelId) {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('list_live_class_sessions', {
    p_level_id: levelId,
  });
  if (error) throw new Error(error.message || 'Unable to load live classes.');
  if (Array.isArray(data)) return data;
  if (data?.error) throw new Error(data.error);
  return [];
}

/**
 * Get the Google Meet URL for a session. Server-side access control:
 * enrolled students (with an active tuition enrolment for the level), the
 * assigned tutor, or admins only.
 */
export async function getLiveClassMeetUrl(sessionId) {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabase.rpc('get_live_class_meet_url', {
    p_session_id: sessionId,
  });
  if (error) throw new Error(error.message || 'Unable to access the live class.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/* ---------------- Payment receipts ---------------- */

export async function fetchMyPaymentReceipts() {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('fetch_my_payment_receipts');
  if (error) throw new Error(error.message || 'Unable to load receipts.');
  if (Array.isArray(data)) return data;
  if (data?.error) throw new Error(data.error);
  return [];
}
