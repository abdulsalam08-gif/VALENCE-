/**
 * VALENCE Store Orders (Phase 5)
 *
 * Client-side helpers for the per-course bookstore ordering flow.
 * Order creation and payment recording happen server-side via Supabase
 * Postgres RPC functions (create_store_order / verify_store_payment), which
 * are SECURITY DEFINER and the only path that can write orders, order_items,
 * payments and receipts under RLS. All prices and discount rules are
 * recomputed server-side; the client cannot forge totals.
 */

import { supabase } from './supabase';

/**
 * Create a server-verified pending order from the cart.
 * The RPC validates every product against the products/product_prices
 * tables, recomputes the 9%/5%/6%/7% discount rules + delivery fee
 * server-side, and inserts the order + order_items.
 *
 * @param {object} opts
 * @param {Array<{dbId: string, quantity: number}>} opts.items
 * @param {string} opts.zoneId   Delivery zone id (DB uuid from delivery_zones)
 * @param {string} opts.address  Delivery address / pickup instructions
 * @param {string} opts.notes    Optional delivery notes
 * @returns {Promise<{order_id: string, subtotal_ngn: number, discount_ngn: number, delivery_fee_ngn: number, total_ngn: number, currency: string, items: Array}>}
 */
export async function createStoreOrder({ items, zoneId, address, notes }) {
  const { data, error } = await supabase.rpc('create_store_order', {
    p_items: items.map((i) => ({
      product_id: i.dbId,
      quantity: i.quantity,
    })),
    p_zone_id: zoneId,
    p_address: address || '',
  });
  if (error) {
    const detail =
      error.message ||
      (error.details ? JSON.stringify(error.details) : 'Unable to create the order.');
    throw new Error(detail);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Confirm a completed Paystack payment and generate the receipt.
 * Records the payment + receipt server-side and marks the order paid.
 *
 * Server-side Paystack verification runs asynchronously: the RPC first
 * schedules a Paystack API verification (pg_net job) and returns
 * { status: 'verifying' }; this helper retries until the job result is
 * picked up and the order is finally confirmed (or a hard error returns).
 *
 * @param {object} opts
 * @param {string} opts.orderId   Order uuid returned by createStoreOrder
 * @param {string} opts.reference Paystack transaction reference
 * @param {number} opts.amountNgn Order grand total (server cross-checks it)
 * @returns {Promise<{payment_id: string, receipt_number: string, amount_ngn: number, order_id: string, server_verified: boolean}>}
 */
export async function confirmStorePayment({ orderId, reference, amountNgn }) {
  const maxAttempts = 10;
  const delayMs = 3000;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { data, error } = await supabase.rpc('verify_store_payment', {
      p_order_id: orderId,
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
      throw new Error(
        'Paystack verification is taking longer than expected. Please retry from My Orders & Receipts.'
      );
    }
    return data;
  }
  throw new Error('Unable to verify the payment.');
}

/** Fetch a user's own store orders (for order centre / receipt re-view). */
export async function fetchStoreOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total_ngn, paystack_reference, paid_at, created_at, order_items(product_id, quantity, unit_price_ngn, line_total_ngn)')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message || 'Unable to load your orders.');
  return data || [];
}
