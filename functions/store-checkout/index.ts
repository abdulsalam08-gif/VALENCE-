/**
 * VALENCE Phase 5 — Store Checkout Edge Function
 *
 * Validates a cart against the products / product_prices / delivery_zones
 * tables, recomputes the automatic discount rules (9% ATSWA PQ, 5% ATSWA
 * study pack, 6% ICAN PQ, 7% ICAN multi-course study pack) and the delivery
 * fee server-side, then creates the order + order_items rows.
 *
 * Runs with the service role, so it is the only path that can write orders
 * and order_items under RLS. Client cannot forge prices: every unit price is
 * read from product_prices and every rule is recomputed here.
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
      return jsonResponse({ error: 'Unauthorized. Please sign in to checkout.' }, 401);
    }
    const userId = authData.user.id;

    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const zoneId = body?.delivery_zone_id;
    const address = String(body?.delivery_address || '').slice(0, 500);
    const notes = String(body?.delivery_notes || '').slice(0, 500);

    if (items.length === 0) return jsonResponse({ error: 'Your cart is empty.' }, 400);
    if (!zoneId) return jsonResponse({ error: 'Please select a delivery zone.' }, 400);

    // 1. Resolve profile_id from the authenticated user
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    if (!profileRow) {
      return jsonResponse({ error: 'Profile not found for this account.' }, 400);
    }

    // 2. Validate every cart item against products + product_prices
    const productIds = items.map((i) => i.product_id).filter(Boolean);
    const { data: productRows } = await supabase
      .from('products')
      .select('id, name, product_type, is_available')
      .in('id', productIds);
    const productMap = new Map((productRows || []).map((p) => [p.id, p]));

    const { data: priceRows } = await supabase
      .from('product_prices')
      .select('product_id, price_ngn')
      .in('product_id', productIds);
    const priceMap = new Map((priceRows || []).map((p) => [p.product_id, p.price_ngn]));

    for (const item of items) {
      const prod = productMap.get(item.product_id);
      if (!prod) return jsonResponse({ error: 'An item in your cart no longer exists.' }, 400);
      if (!prod.is_available) {
        return jsonResponse({ error: `${prod.name} is currently unavailable.` }, 400);
      }
      const qty = Math.floor(Number(item.quantity));
      if (!qty || qty < 1 || qty > 50) {
        return jsonResponse({ error: `Invalid quantity for ${prod.name}.` }, 400);
      }
    }

    // 3. Line items + raw subtotal (server-authoritative prices)
    const orderItems = [];
    let rawSubtotal = 0;
    for (const item of items) {
      const prod = productMap.get(item.product_id);
      const unit = priceMap.get(item.product_id) ?? 0;
      const qty = Math.floor(Number(item.quantity));
      const line = unit * qty;
      rawSubtotal += line;
      orderItems.push({
        product_id: prod.id,
        name: prod.name,
        quantity: qty,
        unit_price_ngn: unit,
        line_total_ngn: line,
      });
    }

    // 4. Automatic discount rules (mirror of src/lib/pricing.js calculateStoreCart)
    const categoryOf = (row) => {
      const name = String(row.name);
      if (row.product_type === 'past_question') {
        return name.includes('ATSWA') ? 'atswa_past_question' : 'ican_past_question';
      }
      return name.includes('ATSWA') ? 'atswa_study_pack' : 'ican_study_pack';
    };
    const lineCat = orderItems.map((l) => categoryOf(productMap.get(l.product_id)));
    const sumOfCat = (cat) =>
      orderItems
        .filter((_, idx) => lineCat[idx] === cat)
        .reduce((s, l) => s + l.line_total_ngn, 0);
    const qtyOfCat = (cat) =>
      orderItems
        .filter((_, idx) => lineCat[idx] === cat)
        .reduce((s, l) => s + l.quantity, 0);

    let totalDiscount = 0;
    const appliedDiscounts = [];
    const RULE_RATES = {
      atswa_past_question: { rate: 0.09, min: 2 },
      atswa_study_pack: { rate: 0.05, min: 2 },
      ican_past_question: { rate: 0.06, min: 2 },
    };
    for (const cat of Object.keys(RULE_RATES)) {
      const rule = RULE_RATES[cat];
      const sub = sumOfCat(cat);
      if (qtyOfCat(cat) >= rule.min && sub > 0) {
        const amt = Math.round(sub * rule.rate);
        totalDiscount += amt;
        appliedDiscounts.push({
          id: cat,
          label: `${cat.replace(/_/g, ' ')} (${Math.round(rule.rate * 100)}% off)`,
          amount: amt,
        });
      }
    }
    // ICAN study packs: 7% off when 2+ DISTINCT course codes across levels
    const distinctCodes = new Set();
    orderItems
      .filter((_, idx) => lineCat[idx] === 'ican_study_pack')
      .forEach((line) => {
        const m = String(productMap.get(line.product_id).name).match(/\(([A-Z][A-Z/&]*)\)/);
        if (m) distinctCodes.add(m[1]);
      });
    if (distinctCodes.size >= 2 && sumOfCat('ican_study_pack') > 0) {
      const amt = Math.round(sumOfCat('ican_study_pack') * 0.07);
      totalDiscount += amt;
      appliedDiscounts.push({
        id: 'ican_study_pack',
        label: `ICAN Multi-Course Study Pack (7% off ${distinctCodes.size} distinct courses)`,
        amount: amt,
      });
    }

    // 5. Delivery zone fee
    const { data: zoneRow } = await supabase
      .from('delivery_zones')
      .select('id, name, fee_ngn, is_free')
      .eq('id', zoneId)
      .maybeSingle();
    if (!zoneRow) return jsonResponse({ error: 'Invalid delivery zone.' }, 400);
    const deliveryFee = zoneRow.fee_ngn ?? 0;

    const subtotalAfterDiscount = Math.max(0, rawSubtotal - totalDiscount);
    const total = subtotalAfterDiscount + deliveryFee;

    // 6. Create the order, then its items
    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert({
        profile_id: profileRow.id,
        subtotal_ngn: subtotalAfterDiscount,
        delivery_fee_ngn: deliveryFee,
        total_ngn: total,
        delivery_zone_id: zoneId,
        delivery_address: address,
        status: 'pending',
      })
      .select(
        'id, profile_id, subtotal_ngn, delivery_fee_ngn, total_ngn, delivery_zone_id, delivery_address, status, created_at'
      )
      .single();
    if (orderError) return jsonResponse({ error: orderError.message }, 400);

    const { error: itemsError } = await supabase.from('order_items').insert(
      orderItems.map((l) => ({
        order_id: orderRow.id,
        product_id: l.product_id,
        quantity: l.quantity,
        unit_price_ngn: l.unit_price_ngn,
        line_total_ngn: l.line_total_ngn,
      }))
    );
    if (itemsError) return jsonResponse({ error: itemsError.message }, 400);

    return jsonResponse({
      order_id: orderRow.id,
      status: orderRow.status,
      subtotal_ngn: orderRow.subtotal_ngn,
      discount_ngn: totalDiscount,
      delivery_fee_ngn: deliveryFee,
      total_ngn: total,
      currency: 'NGN',
      applied_discounts: appliedDiscounts,
      items: orderItems,
    });
  } catch (err) {
    return jsonResponse({ error: err.message || 'Unexpected server error' }, 500);
  }
});
