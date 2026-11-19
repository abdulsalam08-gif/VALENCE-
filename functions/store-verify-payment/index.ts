/**
 * VALENCE Phase 5 — Store Payment Verification & Receipt Edge Function
 *
 * Called by the client after a Paystack embed checkout success callback.
 * - Validates the order belongs to the caller and the reported amount matches
 *   the order total exactly (server-authoritative totals).
 * - When PAYSTACK_SECRET_KEY is configured, verifies the transaction against
 *   Paystack's API server-side; otherwise the client success callback is
 *   accepted and recorded with server_verified = false.
 * - Records the payment, marks the order paid and generates a receipt.
 *
 * Runs with the service role — the only path that can write payments and
 * receipts under RLS.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

    const token = req.headers.get('Authorization')?.replace('Bearer ', '') || '';
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      return jsonResponse({ error: 'Unauthorized. Please sign in to confirm your payment.' }, 401);
    }
    const userId = authData.user.id;

    const body = await req.json();
    const { order_id, paystack_reference, amount_ngn } = body || {};
    if (!order_id || !paystack_reference) {
      return jsonResponse({ error: 'Missing order id or payment reference.' }, 400);
    }

    const { data: profileRow } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    if (!profileRow) return jsonResponse({ error: 'Profile not found for this account.' }, 400);

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, profile_id, total_ngn, status, paystack_reference, paid_at')
      .eq('id', order_id)
      .maybeSingle();
    if (orderErr) return jsonResponse({ error: orderErr.message }, 400);
    if (!order) return jsonResponse({ error: 'Order not found.' }, 404);
    if (order.profile_id !== profileRow.id) {
      return jsonResponse({ error: 'This order does not belong to your account.' }, 403);
    }
    if (order.status === 'paid') {
      return jsonResponse({ error: 'This order is already paid.' }, 400);
    }
    if (Number(amount_ngn) !== Number(order.total_ngn)) {
      return jsonResponse(
        { error: 'The reported payment amount does not match the order total.' },
        400
      );
    }

    // Server-side verification against Paystack when a secret key is configured
    const secretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    let serverVerified = false;
    if (secretKey) {
      try {
        const res = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(paystack_reference)}`,
          { headers: { Authorization: `Bearer ${secretKey}` } }
        );
        const data = await res.json();
        const txStatus = data?.data?.status || null;
        serverVerified = data?.status === 'success' && txStatus === 'success';
        if (!serverVerified) {
          return jsonResponse(
            { error: `Paystack verification failed (transaction status: ${txStatus || 'unknown'}).` },
            402
          );
        }
      } catch (err) {
        return jsonResponse({ error: `Paystack verification error: ${err.message}` }, 502);
      }
    }

    const nowIso = new Date().toISOString();

    // 1. Record the payment
    const { data: payment, error: payErr } = await supabase
      .from('payments')
      .insert({
        profile_id: profileRow.id,
        amount_ngn: order.total_ngn,
        currency: 'NGN',
        payment_type: 'store_order',
        paystack_reference: paystack_reference,
        status: 'succeeded',
        payload: {
          order_id: order_id,
          order_total_ngn: order.total_ngn,
          server_verified: serverVerified,
          verification_mode: serverVerified ? 'paystack_api' : 'client_callback',
        },
        verified_at: serverVerified ? nowIso : null,
      })
      .select(
        'id, profile_id, amount_ngn, currency, payment_type, paystack_reference, status, created_at'
      )
      .single();
    if (payErr) return jsonResponse({ error: payErr.message }, 400);

    // 2. Mark the order paid
    const { error: updErr } = await supabase
      .from('orders')
      .update({ status: 'paid', paystack_reference: paystack_reference, paid_at: nowIso })
      .eq('id', order_id);
    if (updErr) return jsonResponse({ error: updErr.message }, 400);

    // 3. Generate the receipt
    const d = new Date();
    const stamp = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(
      d.getUTCDate()
    ).padStart(2, '0')}`;
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const receiptNumber = `VLR-${stamp}-${rand}`;

    const { data: receipt, error: rcErr } = await supabase
      .from('receipts')
      .insert({
        payment_id: payment.id,
        order_id: order_id,
        receipt_number: receiptNumber,
        amount_ngn: order.total_ngn,
        receipt_url: null,
      })
      .select('id, payment_id, order_id, receipt_number, amount_ngn, receipt_url, created_at')
      .single();
    if (rcErr) return jsonResponse({ error: rcErr.message }, 400);

    return jsonResponse({
      payment_id: payment.id,
      receipt_number: receipt.receipt_number,
      receipt_url: receipt.receipt_url,
      amount_ngn: receipt.amount_ngn,
      order_id: order_id,
      status: 'paid',
      paystack_reference: paystack_reference,
      server_verified: serverVerified,
    });
  } catch (err) {
    return jsonResponse({ error: err.message || 'Unexpected server error' }, 500);
  }
});
