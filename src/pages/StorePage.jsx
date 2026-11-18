import React, { useMemo, useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { formatNaira } from '../lib/pricing';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Materials (24)' },
  { id: 'ican_study_pack', label: 'ICAN Study Packs (15)' },
  { id: 'ican_past_question', label: 'ICAN Past Questions' },
  { id: 'atswa_study_pack', label: 'ATSWA Study Packs' },
  { id: 'atswa_past_question', label: 'ATSWA Past Questions' },
];

export default function StorePage() {
  const {
    products,
    deliveryZones,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    selectedZoneId,
    setSelectedZoneId,
    selectedZone,
    cartSummary,
  } = usePlatform();
  const toast = useToast();

  const [activeCategory, setActiveCategory] = useState('all');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (levelFilter !== 'ALL' && p.level !== levelFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.courseCode && p.courseCode.toLowerCase().includes(q)) ||
          p.level.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, activeCategory, levelFilter, search]);

  const getItemQty = (id) => cart.find((i) => i.id === id)?.quantity || 0;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning('Your cart is empty', 'Add study packs or past questions first.');
      return;
    }
    toast.info(
      `Order Total: ${formatNaira(cartSummary.finalTotal)}`,
      'Live server-verified Paystack checkout & order tracking connect in Phase 8 & Phase 13.'
    );
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Header & Discount Rules Banner */}
      <section className="bg-grid-fintech py-12 sm:py-16">
        <div className="v-container space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="green">VALENCE MARKETPLACE</Badge>
            <Badge variant="neutral">Paystack Exclusive Checkout</Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            Study Packs, Past Questions & Textbooks
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {[
              { title: 'ICAN Study Packs', price: '₦10,000 – ₦15,500', rule: '7% off 2+ distinct courses across Foundation, Skills & Pro' },
              { title: 'ICAN Past Questions', price: '₦9,000 / copy', rule: 'Automatic 6% off on 2 or more copies' },
              { title: 'ATSWA Study Packs', price: '₦9,500 / pack', rule: 'Automatic 5% off on 2 or more packs' },
              { title: 'ATSWA Past Questions', price: '₦5,500 / copy', rule: 'Automatic 9% off on 2 or more copies' },
            ].map((card) => (
              <div key={card.title} className="v-card p-4 space-y-1">
                <p className="text-xs font-semibold text-[#9AA4B2]">{card.title}</p>
                <p className="tabular-nums-display text-base font-bold text-white">{card.price}</p>
                <p className="text-[11px] text-[#16C784]">{card.rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue + Live Cart */}
      <section className="py-12 sm:py-16">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Catalogue */}
          <div className="lg:col-span-8 space-y-5">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveCategory(t.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors ${
                    activeCategory === t.id
                      ? 'bg-[#16C784] text-[#06130D] border-[#16C784]'
                      : 'bg-[#11161C] text-[#9AA4B2] border-white/[0.08] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search + Level Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search FM, FR, SBR, CS, CBL, ATS 1..."
                  className="v-input pl-10 text-xs"
                />
              </div>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                aria-label="Filter by examination level"
                className="v-input sm:w-48 text-xs"
              >
                <option value="ALL">All Levels</option>
                <option value="ATS 1">ATS 1</option>
                <option value="ATS 2">ATS 2</option>
                <option value="ATS 3">ATS 3</option>
                <option value="Foundation">ICAN Foundation</option>
                <option value="Skills">ICAN Skills</option>
                <option value="Professional">ICAN Professional</option>
              </select>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="v-card p-10 text-center text-sm text-[#9AA4B2]">
                No store material matches your filter. Reset category or search term.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((prod) => {
                  const qty = getItemQty(prod.id);
                  return (
                    <div key={prod.id} className="v-card-hover p-5 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="neutral">
                            {prod.programme} · {prod.level}
                          </Badge>
                          {prod.courseCode && (
                            <span className="font-display text-xs font-bold text-[#16C784]">
                              {prod.courseCode}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-base font-bold text-white leading-snug">
                          {prod.title}
                        </h3>
                        <p className="text-xs text-[#9AA4B2] leading-relaxed">{prod.description}</p>
                        <p className="text-[11px] font-medium text-[#16C784] inline-flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {prod.discountHint}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5">
                        <span className="tabular-nums-display text-lg font-bold text-white">
                          {formatNaira(prod.price)}
                        </span>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(prod, 1);
                              toast.success('Added to Cart', prod.title);
                            }}
                            className="v-btn-primary text-xs py-2 px-3.5"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add to Cart
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-2 rounded-xl bg-[#0B0E11] border border-[#16C784]/40 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(prod.id, qty - 1)}
                              aria-label="Decrease quantity"
                              className="h-6 w-6 rounded-lg bg-[#161D26] flex items-center justify-center text-white hover:bg-[#1C2530]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="tabular-nums-display text-xs font-bold text-[#16C784] w-5 text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(prod.id, qty + 1)}
                              aria-label="Increase quantity"
                              className="h-6 w-6 rounded-lg bg-[#16C784] flex items-center justify-center text-[#06130D]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Live Shopping Cart, Automatic Discount & Free Delivery Engine */}
          <aside className="lg:col-span-4 v-card p-6 space-y-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white inline-flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#16C784]" /> Shopping Cart ({cartSummary.totalQuantity})
              </h2>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-[#EA3943] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-6 text-center space-y-2">
                <p className="text-xs font-medium text-[#C2C9D4]">Your cart is currently empty.</p>
                <p className="text-[11px] text-[#667085]">
                  Tip: Mix any 2+ different ICAN study packs (even Foundation + Skills + Professional) to trigger the automatic 7% discount.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-2 rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{item.title}</p>
                      <p className="tabular-nums-display text-[#9AA4B2] mt-0.5">
                        {formatNaira(item.price)} × {item.quantity} ={' '}
                        <span className="text-white font-semibold">
                          {formatNaira(item.price * item.quantity)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        className="h-6 w-6 rounded bg-[#161D26] flex items-center justify-center text-[#C2C9D4]"
                        aria-label="Reduce item quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        className="h-6 w-6 rounded bg-[#161D26] flex items-center justify-center text-[#C2C9D4]"
                        aria-label="Increase item quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 rounded bg-[#EA3943]/15 flex items-center justify-center text-[#EA3943]"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Delivery Zone Selector */}
            <div>
              <label className="v-label flex items-center gap-1.5" htmlFor="delivery-zone">
                <Truck className="h-3.5 w-3.5 text-[#16C784]" /> Delivery Location
              </label>
              <select
                id="delivery-zone"
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="v-input text-xs"
              >
                {deliveryZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} — {z.isFree ? 'FREE (₦0)' : formatNaira(z.fee)}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-[#667085]">
                Free hubs: LASU, Ojo, UNILAG, YABATECH, FCE, Yaba · Est. {selectedZone.eta}
              </p>
            </div>

            {/* Automatic Discounts & Totals */}
            <div className="space-y-2 border-t border-white/[0.08] pt-4 text-xs">
              <div className="flex justify-between text-[#9AA4B2]">
                <span>Subtotal</span>
                <span className="tabular-nums-display text-white">
                  {formatNaira(cartSummary.rawSubtotal)}
                </span>
              </div>

              {cartSummary.appliedDiscounts.map((d) => (
                <div key={d.id} className="flex justify-between gap-2 text-[#16C784]">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> {d.label}
                  </span>
                  <span className="tabular-nums-display font-semibold shrink-0">
                    −{formatNaira(d.amount)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between text-[#9AA4B2]">
                <span>Delivery Fee</span>
                <span
                  className={`tabular-nums-display font-semibold ${
                    cartSummary.deliveryFee === 0 ? 'text-[#16C784]' : 'text-white'
                  }`}
                >
                  {cart.length === 0
                    ? '₦0'
                    : cartSummary.deliveryFee === 0
                    ? 'FREE (₦0)'
                    : formatNaira(cartSummary.deliveryFee)}
                </span>
              </div>

              <div className="border-t border-white/[0.08] pt-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-white">Final Total</span>
                <span className="tabular-nums-display text-2xl font-bold text-[#16C784]">
                  {formatNaira(cartSummary.finalTotal)}
                </span>
              </div>
            </div>

            <button type="button" onClick={handleCheckout} className="v-btn-primary w-full py-3">
              <ShieldCheck className="h-4 w-4" /> Checkout with Paystack
            </button>
            <p className="text-[10.5px] text-center text-[#667085]">
              Orders are marked Paid strictly after server-side Paystack verification. WhatsApp is never used for store checkout.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
