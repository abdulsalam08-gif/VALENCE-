import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  ZoomIn,
  X,
  BookOpen,
  HelpCircle,
  Send,
  Layers,
  CreditCard,
  Loader2,
  Receipt,
  Clock,
  Package,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { formatNaira } from '../lib/pricing';
import { openPaystackCheckout, generatePaymentReference, isPaystackConfigured } from '../lib/paystack';
import { createStoreOrder, confirmStorePayment, fetchStoreOrders } from '../lib/storeOrders';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Materials (45)' },
  { id: 'ican_study_pack', label: 'ICAN Study Packs (15)' },
  { id: 'ican_past_question', label: 'ICAN Past Questions · Per Course (15)' },
  { id: 'atswa_past_question', label: 'ATSWA Past Questions · Per Course (12)' },
  { id: 'atswa_study_pack', label: 'ATSWA Study Packs (3)' },
];

const LEVEL_PQ_BUNDLES = [
  { level: 'ATS 1', category: 'atswa_past_question', label: 'All 4 ATS 1 PQs (9% Off)' },
  { level: 'ATS 2', category: 'atswa_past_question', label: 'All 4 ATS 2 PQs (9% Off)' },
  { level: 'ATS 3', category: 'atswa_past_question', label: 'All 4 ATS 3 PQs (9% Off)' },
  { level: 'Foundation', category: 'ican_past_question', label: 'All 4 Foundation PQs (6% Off)' },
  { level: 'Skills', category: 'ican_past_question', label: 'All 6 Skills PQs (6% Off)' },
  { level: 'Professional', category: 'ican_past_question', label: 'All 5 Pro PQs (6% Off)' },
];

const COLOUR_LEGEND = [
  { label: 'ATS 1 PQ', colour: 'Blue Cover (₦5,500/course)', hex: '#2563EB' },
  { label: 'ATS 2 PQ', colour: 'Orange Cover (₦5,500/course)', hex: '#EA580C' },
  { label: 'ATS 3 PQ', colour: 'Dark Green Cover (₦5,500/course)', hex: '#15803D' },
  { label: 'ICAN PQ', colour: 'Sealed Green Pathfinder (₦9,000/course)', hex: '#16A34A' },
  { label: 'ICAN Study Pack', colour: 'White & Blue Study Text (Per Course)', hex: '#3B82F6' },
];

export default function StorePage() {
  const [searchParams] = useSearchParams();
  const {
    user,
    profile,
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
    inAppTickets,
    submitInAppTicket,
  } = usePlatform();
  const toast = useToast();

  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [previewProduct, setPreviewProduct] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(searchParams.get('enquiry') === 'open');
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    email: '',
    topic: 'Material Availability & Edition Check',
    materialOrCourse: '',
    zoneId: deliveryZones[0]?.id || '',
    message: '',
  });
  const [lastEnquiryRef, setLastEnquiryRef] = useState(null);

  // Phase 5: server-verified checkout state
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ address: '', notes: '' });
  const [checkoutPhase, setCheckoutPhase] = useState('details'); // details | paying | processing | done
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Stable signature of the cart + zone so a pending order can be reused on retry
  const cartSignature = useMemo(
    () =>
      cart
        .map((i) => `${i.dbId || i.id}x${i.quantity}`)
        .join(',') + `|${selectedZoneId}`,
    [cart, selectedZoneId]
  );

  useEffect(() => {
    if (searchParams.get('enquiry') === 'open') setEnquiryOpen(true);
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const storeTickets = useMemo(
    () => inAppTickets.filter((t) => t.type === 'store'),
    [inAppTickets]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (levelFilter !== 'ALL' && p.level !== levelFilter) return false;
      if (availabilityFilter === 'AVAILABLE' && p.isAvailable === false) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.courseCode && p.courseCode.toLowerCase().includes(q)) ||
          (p.courseTitle && p.courseTitle.toLowerCase().includes(q)) ||
          p.level.toLowerCase().includes(q) ||
          (p.colourBadge && p.colourBadge.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, activeCategory, levelFilter, availabilityFilter, search]);

  const cartHasPastQuestions = useMemo(
    () => cart.some((i) => i.category.endsWith('past_question')),
    [cart]
  );
  const cartHasStudyPacks = useMemo(
    () => cart.some((i) => i.category.endsWith('study_pack')),
    [cart]
  );

  const openRestockEnquiry = (prod) => {
    setEnquiryForm((prev) => ({
      ...prev,
      topic: 'Study Pack Availability & Restock Alert',
      materialOrCourse: prod.title,
    }));
    setEnquiryOpen(true);
  };

  const getItemQty = (id) => cart.find((i) => i.id === id)?.quantity || 0;

  const handleAddLevelPqs = (bundle) => {
    const levelPqs = products.filter(
      (p) => p.category === bundle.category && p.level === bundle.level
    );
    let added = 0;
    levelPqs.forEach((p) => {
      if (getItemQty(p.id) === 0) {
        addToCart(p, 1);
        added += 1;
      }
    });
    if (added > 0) {
      toast.success(
        `Added ${added} ${bundle.level} Course Past Question${added > 1 ? 's' : ''}`,
        'Automatic multi-course discount applied in your cart. Remove any course you are exempted from.'
      );
    } else {
      toast.info(
        'Already in Cart',
        `All ${levelPqs.length} ${bundle.level} course past questions are already in your cart.`
      );
    }
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    const zone = deliveryZones.find((z) => z.id === enquiryForm.zoneId);
    const ticket = submitInAppTicket('store', {
      ...enquiryForm,
      zoneName: zone ? `${zone.name} (${zone.isFree ? 'FREE' : formatNaira(zone.fee)})` : '',
    });
    setLastEnquiryRef(ticket.id);
    toast.success(
      `In-App Enquiry Submitted (${ticket.id})`,
      'Logged directly on VALENCE for Store Manager response inside your Student Portal.'
    );
    setEnquiryForm((prev) => ({ ...prev, materialOrCourse: '', message: '' }));
  };

  // Phase 5: real server-verified Paystack checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning(
        'Your cart is empty',
        'Select one individual course or all courses applicable to you.'
      );
      return;
    }
    if (!user) {
      toast.info('Please sign in to checkout', 'Your cart stays saved on this device.');
      navigate('/portal');
      return;
    }
    if (!isPaystackConfigured()) {
      toast.error(
        'Payment gateway not configured',
        'Paystack checkout becomes available once the payment key is configured.'
      );
      return;
    }
    setCheckoutForm({ address: '', notes: '' });
    setActiveOrder(null);
    setReceipt(null);
    setCheckoutPhase('details');
    setCheckoutOpen(true);
  };

  const createOrderForCheckout = async () => {
    setCheckoutBusy(true);
    setCheckoutPhase('creating');
    try {
      const items = cart.map((i) => ({
        dbId: i.dbId || i.id,
        quantity: i.quantity,
        title: i.title,
        category: i.category,
        courseCode: i.courseCode,
      }));
      const order = await createStoreOrder({
        items,
        zoneId: selectedZone.dbId || selectedZoneId,
        address: checkoutForm.address,
        notes: checkoutForm.notes,
      });
      setActiveOrder({ ...order, _signature: cartSignature });
      return order;
    } catch (err) {
      setCheckoutPhase('details');
      toast.error('Order could not be created', err.message);
      throw err;
    } finally {
      setCheckoutBusy(false);
    }
  };

  const handlePayWithPaystack = async () => {
    try {
      const order =
        activeOrder && activeOrder._signature === cartSignature
          ? activeOrder
          : await createOrderForCheckout();
      setCheckoutBusy(true);
      setCheckoutPhase('paying');
      const reference = generatePaymentReference();
      await openPaystackCheckout({
        email: user.email,
        name: profile?.full_name || profile?.display_name || user.email,
        amountNgn: order.total_ngn,
        reference,
        onSuccess: async (response) => {
          setCheckoutPhase('processing');
          try {
            const txReference = response?.reference || reference;
            const result = await confirmStorePayment({
              orderId: order.order_id,
              reference: txReference,
              amountNgn: order.total_ngn,
            });
            setReceipt({ ...result, items: order.items, zoneName: selectedZone.name });
            setCheckoutPhase('done');
            clearCart();
          } catch (err) {
            setCheckoutPhase('paying');
            toast.error('Payment confirmation failed', err.message);
          }
        },
        onClose: () => {
          setCheckoutBusy(false);
          if (checkoutPhase !== 'processing') setCheckoutPhase('paying');
        },
      });
    } catch (err) {
      setCheckoutBusy(false);
      setCheckoutPhase('details');
      toast.error('Paystack checkout failed to open', err.message);
    }
  };

  const handleViewOrders = async () => {
    setOrdersOpen(true);
    setOrdersLoading(true);
    try {
      const orders = await fetchStoreOrders();
      setMyOrders(orders);
    } catch (err) {
      toast.error('Could not load your orders', err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Header, Per-Course Pricing Rules & In-App Enquiry Action */}
      <section className="bg-grid-fintech py-12 sm:py-16">
        <div className="v-container space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="green">VALENCE MARKETPLACE</Badge>
                <Badge variant="neutral">Per-Course Selection · Paystack Checkout</Badge>
                <Badge variant="neutral">In-App Delivery & Material Desk</Badge>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
                Study Packs & Per-Course Past Questions
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA4B2]">
                Order <strong className="text-white">just one individual course</strong> or{' '}
                <strong className="text-white">every course applicable to you</strong>. Multi-course discounts trigger automatically at checkout, and all study material & delivery enquiries are handled right here on the app.
              </p>
            </div>

            <button
              type="button"
              onClick={handleViewOrders}
              className="v-btn-secondary text-xs self-start shrink-0"
            >
              <Package className="h-4 w-4 text-[#16C784]" />
              My Orders & Receipts
            </button>
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="v-btn-secondary text-xs self-start shrink-0"
            >
              <HelpCircle className="h-4 w-4 text-[#16C784]" />
              In-App Material & Delivery Enquiry
              {storeTickets.length > 0 && (
                <span className="ml-1 rounded-full bg-[#16C784] px-2 py-0.5 text-[10px] font-bold text-[#06130D]">
                  {storeTickets.length}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {[
              {
                title: 'ICAN Study Packs (15 Courses)',
                price: '₦10,000 to ₦15,500 / course',
                rule: '7% off 2+ distinct courses · Delivered when available',
                thumb: '/materials/ican-sp-fr.jpg',
                cat: 'ican_study_pack',
              },
              {
                title: 'ICAN Pathfinder PQs (15 Courses)',
                price: '₦9,000 / course',
                rule: '6% off 2+ · Same-day Lagos, 1-day outside Lagos',
                thumb: '/materials/ican-pq-fr.jpg',
                cat: 'ican_past_question',
              },
              {
                title: 'ATSWA Insight PQs (12 Courses)',
                price: '₦5,500 / course',
                rule: '9% off 2+ · Same-day Lagos, 1-day outside Lagos',
                thumb: '/materials/atswa-pq-ats2-fa.jpg',
                cat: 'atswa_past_question',
              },
              {
                title: 'ATSWA Study Packs (ATS 1 to 3)',
                price: '₦9,500 / pack',
                rule: '5% off 2+ packs · Delivered when available',
                thumb: null,
                cat: 'atswa_study_pack',
              },
            ].map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => setActiveCategory(card.cat)}
                className="v-card-hover p-3.5 flex items-center gap-3 text-left"
              >
                {card.thumb ? (
                  <img
                    src={card.thumb}
                    alt={card.title}
                    loading="lazy"
                    className="h-16 w-12 shrink-0 rounded-lg object-cover border border-white/[0.1]"
                  />
                ) : (
                  <div className="h-16 w-12 shrink-0 rounded-lg bg-[#0B0E11] border border-white/[0.1] flex items-center justify-center text-[#16C784]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 space-y-0.5">
                  <p className="text-[11px] font-semibold text-[#C2C9D4] truncate">{card.title}</p>
                  <p className="tabular-nums-display text-sm font-bold text-white">{card.price}</p>
                  <p className="text-[10.5px] text-[#16C784] leading-snug">{card.rule}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Delivery Timeline & Live Study Pack Availability Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="rounded-xl bg-[#11161C] border border-[#16C784]/30 p-3.5 flex items-start gap-2.5">
              <Truck className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
              <p className="text-[#C2C9D4] leading-relaxed">
                <strong className="text-white">All Past Questions Delivery:</strong>{' '}
                <strong className="text-[#16C784]">Same-day delivery within Lagos</strong> (FREE to LASU, Ojo, UNILAG, YABATECH, FCE &amp; Yaba) and{' '}
                <strong className="text-[#16C784]">1-day (next-day) delivery outside Lagos</strong> nationwide.
              </p>
            </div>
            <div className="rounded-xl bg-[#11161C] border border-white/[0.1] p-3.5 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
              <p className="text-[#C2C9D4] leading-relaxed">
                <strong className="text-white">Study Packs Availability &amp; Delivery:</strong> Every Study Pack displays a live{' '}
                <strong className="text-[#16C784]">Available / Unavailable</strong> badge updated directly by Admin, and Study Packs are delivered when available.
              </p>
            </div>
          </div>

          {/* Official Cover Colour Guide */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <span className="text-[#667085] font-semibold uppercase tracking-wider mr-1">
              Cover Key:
            </span>
            {COLOUR_LEGEND.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#11161C] border border-white/[0.08] px-2.5 py-1 text-[#D5DBE3]"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <strong className="text-white">{c.label}:</strong>
                <span className="text-[#9AA4B2]">{c.colour}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue + Live Per-Course Cart */}
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

            {/* Quick Multi-Course Past Question Selector (buy 1 below, or add whole level in 1 click) */}
            {(activeCategory === 'all' ||
              activeCategory === 'ican_past_question' ||
              activeCategory === 'atswa_past_question') && (
              <div className="rounded-2xl bg-[#11161C] border border-white/[0.08] p-3.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-semibold text-white inline-flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#16C784]" />
                    Past Questions: Pick Individual Courses Below, or Add a Full Level Set:
                  </span>
                  <span className="text-[#9AA4B2]">
                    Remove any exempted course right inside the cart
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LEVEL_PQ_BUNDLES.filter(
                    (b) => activeCategory === 'all' || b.category === activeCategory
                  ).map((b) => (
                    <button
                      key={`${b.category}-${b.level}`}
                      type="button"
                      onClick={() => handleAddLevelPqs(b)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#0B0E11] border border-[#16C784]/30 hover:border-[#16C784] px-2.5 py-1.5 text-[11px] font-semibold text-[#16C784] transition-colors"
                    >
                      <Plus className="h-3 w-3" /> {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search + Level Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by course or code (FR, PM, SBR, CS, CBL, BAPS, ECO, AUD, TAX)..."
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
                <option value="ATS 1">ATS 1 (4 Courses · Blue)</option>
                <option value="ATS 2">ATS 2 (4 Courses · Orange)</option>
                <option value="ATS 3">ATS 3 (4 Courses · Dark Green)</option>
                <option value="Foundation">ICAN Foundation (4 Courses)</option>
                <option value="Skills">ICAN Skills (6 Courses)</option>
                <option value="Professional">ICAN Professional (5 Courses)</option>
              </select>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                aria-label="Filter by availability"
                className="v-input sm:w-44 text-xs"
              >
                <option value="ALL">All Stock Statuses</option>
                <option value="AVAILABLE">Available Now Only</option>
              </select>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="v-card p-10 text-center text-sm text-[#9AA4B2]">
                No store material matches your filter. Reset category or search term.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredProducts.map((prod) => {
                  const qty = getItemQty(prod.id);
                  const isPq = prod.category.endsWith('past_question');
                  return (
                    <div
                      key={prod.id}
                      className="v-card-hover overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {prod.imageUrl ? (
                          <button
                            type="button"
                            onClick={() => setPreviewProduct(prod)}
                            className="group relative w-full h-60 bg-[#080A0D] overflow-hidden border-b border-white/[0.06] text-left focus:outline-none"
                            aria-label={`Preview cover photo for ${prod.title}`}
                          >
                            <img
                              src={prod.imageUrl}
                              alt={`${prod.title}, ${prod.colourBadge}`}
                              loading="lazy"
                              className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/70 to-transparent" />

                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0E11]/90 backdrop-blur-md border border-white/[0.14] px-2.5 py-1 text-[10.5px] font-semibold text-white">
                                <span
                                  className="h-2 w-2 rounded-full shrink-0"
                                  style={{ backgroundColor: prod.accentHex || '#16C784' }}
                                />
                                {prod.colourBadge}
                              </span>
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0B0E11]/80 backdrop-blur-md border border-white/[0.12] text-[#C2C9D4] group-hover:text-[#16C784] transition-colors">
                                <ZoomIn className="h-3.5 w-3.5" />
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                              <Badge variant={isPq ? 'green' : 'neutral'}>
                                {prod.programme} · {prod.level} · {isPq ? 'Past Questions' : 'Study Pack'}
                              </Badge>
                              {prod.courseCode && (
                                <span className="rounded-lg bg-[#16C784] px-2.5 py-0.5 font-display text-xs font-bold text-[#06130D] shadow shrink-0">
                                  {prod.courseCode}
                                </span>
                              )}
                            </div>
                          </button>
                        ) : (
                          /* Clean plain card header for ATSWA Study Packs (no image until real photos provided) */
                          <div className="px-5 pt-5 flex items-center justify-between gap-2">
                            <Badge variant="neutral">
                              {prod.programme} · {prod.level}
                            </Badge>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0E11] border border-white/[0.1] px-2.5 py-1 text-[10.5px] font-semibold text-[#D5DBE3]">
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: prod.accentHex || '#16C784' }}
                              />
                              Study Pack
                            </span>
                          </div>
                        )}

                        <div className="p-5 pb-3 space-y-2">
                          {/* Live Admin-Updated Availability & Delivery Timeline Row */}
                          {isPq ? (
                            <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#16C784]/15 border border-[#16C784]/35 px-2.5 py-0.5 font-semibold text-[#16C784]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#16C784]" />
                                Available Now
                              </span>
                              <span className="text-[#C2C9D4]">
                                Same-day Lagos · 1-day outside Lagos
                              </span>
                            </div>
                          ) : prod.isAvailable !== false ? (
                            <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#16C784]/15 border border-[#16C784]/35 px-2.5 py-0.5 font-semibold text-[#16C784]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#16C784]" />
                                {prod.availabilityNote || 'Available · Admin Updated'}
                              </span>
                              <span className="text-[#9AA4B2]">Delivered when available</span>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#EA3943]/15 border border-[#EA3943]/35 px-2.5 py-0.5 font-semibold text-[#EA3943]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#EA3943]" />
                                {prod.availabilityNote || 'Currently Unavailable · Admin Updated'}
                              </span>
                              <span className="text-[#9AA4B2]">Delivered once restocked</span>
                            </div>
                          )}

                          <h3 className="font-display text-base font-bold text-white leading-snug">
                            {prod.title}
                          </h3>
                          <p className="text-xs text-[#9AA4B2] leading-relaxed">
                            {prod.description}
                          </p>
                          <p className="text-[11px] font-medium text-[#16C784] inline-flex items-center gap-1">
                            <Tag className="h-3 w-3" /> {prod.discountHint}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5">
                        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5">
                          <div>
                            <span className="tabular-nums-display text-lg font-bold text-white">
                              {formatNaira(prod.price)}
                            </span>
                            <span className="block text-[10px] text-[#667085]">
                              {prod.courseCode
                                ? `Per course (${prod.courseCode})`
                                : `Per study pack (${prod.level})`}
                            </span>
                          </div>
                          {prod.isAvailable === false ? (
                            <button
                              type="button"
                              onClick={() => openRestockEnquiry(prod)}
                              className="v-btn-secondary text-xs py-2 px-3"
                            >
                              <HelpCircle className="h-3.5 w-3.5 text-[#EA3943]" /> Notify When Available
                            </button>
                          ) : qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(prod, 1);
                                toast.success(
                                  isPq ? 'Added Past Question to Cart' : 'Added Study Pack to Cart',
                                  prod.title
                                );
                              }}
                              className="v-btn-primary text-xs py-2 px-3.5"
                            >
                              <Plus className="h-3.5 w-3.5" /> {isPq ? 'Add Course' : 'Add Pack'}
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Live Course-by-Course Shopping Cart, Automatic Discounts, Delivery & In-App Help */}
          <aside className="lg:col-span-4 v-card p-6 space-y-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white inline-flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#16C784]" /> Checkout Cart ({cartSummary.totalQuantity})
              </h2>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-[#EA3943] hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-6 text-center space-y-2">
                <p className="text-xs font-medium text-[#C2C9D4]">No courses selected yet.</p>
                <p className="text-[11px] text-[#667085]">
                  Buy a single course past question (₦5,500 ATSWA · ₦9,000 ICAN) or combine 2+ courses to unlock automatic 9%, 6%, 5% & 7% discounts.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-2.5 rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3 text-xs"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-12 w-9 shrink-0 rounded-md object-cover border border-white/[0.1]"
                      />
                    ) : (
                      <div className="h-12 w-9 shrink-0 rounded-md bg-[#161D26] border border-white/[0.1] flex items-center justify-center text-[#16C784]">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-[#16C784]">
                          {item.programme} {item.level}
                          {item.courseCode ? ` · ${item.courseCode}` : ''}
                        </span>
                        <span className="text-[10px] text-[#667085]">
                          ({item.category.endsWith('past_question') ? 'Past Q.' : 'Study Pack'})
                        </span>
                      </div>
                      <p className="font-semibold text-white leading-snug">
                        {item.courseTitle || item.title}
                      </p>
                      <p className="tabular-nums-display text-[#9AA4B2]">
                        {formatNaira(item.price)} × {item.quantity} ={' '}
                        <span className="text-white font-semibold">
                          {formatNaira(item.price * item.quantity)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
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
                        aria-label="Remove course"
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
                <Truck className="h-3.5 w-3.5 text-[#16C784]" /> Delivery Zone (Admin-Updated)
              </label>
              <select
                id="delivery-zone"
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="v-input text-xs"
              >
                {deliveryZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}: {z.isFree ? 'FREE (₦0)' : formatNaira(z.fee)}
                  </option>
                ))}
              </select>
              <div className="mt-2 rounded-xl bg-[#0B0E11] border border-white/[0.07] p-3 space-y-1 text-[11px]">
                <p className="text-[#C2C9D4]">
                  <strong className="text-[#16C784]">Past Questions ETA:</strong>{' '}
                  {selectedZone.pqEta ||
                    (selectedZone.regionType === 'lagos'
                      ? 'Same-day delivery'
                      : '1-day (next-day) delivery')}
                  {cartHasPastQuestions ? ' (in your cart)' : ''}
                </p>
                <p className="text-[#9AA4B2]">
                  <strong className="text-white">Study Packs ETA:</strong> Delivered when available (live stock updated by Admin)
                  {cartHasStudyPacks ? ' · In your cart' : ''}
                </p>
                <p className="text-[10.5px] text-[#667085]">
                  Free delivery hubs: LASU, Ojo, UNILAG, YABATECH, FCE &amp; Yaba
                </p>
              </div>
            </div>

            {/* Automatic Discounts & Totals */}
            <div className="space-y-2 border-t border-white/[0.08] pt-4 text-xs">
              <div className="flex justify-between text-[#9AA4B2]">
                <span>Courses Subtotal ({cartSummary.totalQuantity})</span>
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

            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="v-btn-secondary w-full py-2.5 text-xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#16C784]" />
              Ask About Materials or Delivery In-App
            </button>

            <p className="text-[10.5px] text-center text-[#667085]">
              All orders verify server-side via Paystack; see our{' '}
              <Link to="/legal/refunds" className="text-[#16C784] hover:underline">
                Refund &amp; Delivery Policy
              </Link>
              .
            </p>
          </aside>
        </div>
      </section>

      {/* Phase 5: Secure Paystack Checkout, Order Confirmation & Receipt */}
      {checkoutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="store-checkout-title"
          onClick={() => {
            if (checkoutPhase !== 'paying' && checkoutPhase !== 'processing') {
              setCheckoutOpen(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-t-3xl sm:rounded-2xl bg-[#11161C] border border-[#16C784]/25 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-fade-up"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="green">VALENCE MARKETPLACE · SECURE CHECKOUT</Badge>
                <h3
                  id="store-checkout-title"
                  className="mt-1.5 font-display text-xl font-bold text-white"
                >
                  {checkoutPhase === 'done'
                    ? 'Payment Confirmed'
                    : 'Checkout with Paystack'}
                </h3>
                <p className="text-xs text-[#9AA4B2] mt-0.5">
                  {checkoutPhase === 'done'
                    ? 'Your order is recorded server-side and a receipt has been generated.'
                    : 'Order totals are recomputed & verified on the server before payment opens.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                disabled={checkoutPhase === 'paying' || checkoutPhase === 'processing'}
                aria-label="Close checkout"
                className="rounded-lg p-1.5 text-[#9AA4B2] hover:text-white hover:bg-white/[0.06] disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {checkoutPhase === 'done' && receipt ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#16C784]/10 border border-[#16C784]/40 p-5 text-center">
                  <CheckCircle2 className="h-10 w-10 text-[#16C784] mx-auto" />
                  <p className="mt-2 font-display text-lg font-bold text-white">
                    Payment Successful
                  </p>
                  <p className="text-sm text-[#16C784] font-semibold">
                    {formatNaira(receipt.amount_ngn)} paid via Paystack
                  </p>
                </div>
                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Receipt Number</span>
                    <span className="font-display font-bold text-[#16C784]">
                      {receipt.receipt_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Order ID</span>
                    <span className="font-mono text-[11px] text-white break-all text-right">
                      {receipt.order_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Paystack Reference</span>
                    <span className="font-mono text-[11px] text-white break-all text-right">
                      {receipt.paystack_reference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Delivery Zone</span>
                    <span className="text-white text-right">{receipt.zoneName}</span>
                  </div>
                  {receipt.server_verified ? (
                    <div className="flex items-center gap-1.5 text-[#16C784]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Server-verified against Paystack
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#9AA4B2]">
                      <Clock className="h-3.5 w-3.5" />
                      Confirmed via checkout callback (add PAYSTACK_SECRET_KEY for API verification)
                    </div>
                  )}
                </div>
                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-1.5 text-xs">
                  <p className="font-semibold text-white inline-flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5 text-[#16C784]" /> Your Items
                  </p>
                  {(receipt.items || []).map((it) => (
                    <div key={it.product_id} className="flex justify-between gap-3">
                      <span className="text-[#C2C9D4] truncate">
                        {it.name} × {it.quantity}
                      </span>
                      <span className="tabular-nums-display text-white shrink-0">
                        {formatNaira(it.line_total_ngn)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleViewOrders}
                    className="v-btn-secondary text-xs"
                  >
                    View My Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutOpen(false);
                      setReceipt(null);
                      setActiveOrder(null);
                      setCheckoutPhase('details');
                      toast.success('Order Confirmed', `Receipt ${receipt.receipt_number} saved to your account.`);
                    }}
                    className="v-btn-primary text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Server-verified order summary */}
                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-2 text-xs">
                  <p className="font-semibold text-white inline-flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-[#16C784]" /> Order Summary
                  </p>
                  {(activeOrder ? activeOrder.items : cart).map((it) => (
                    <div key={it.product_id || it.id} className="flex justify-between gap-3">
                      <span className="text-[#C2C9D4] truncate">
                        {it.name || it.title} × {it.quantity}
                      </span>
                      <span className="tabular-nums-display text-white shrink-0">
                        {formatNaira((it.line_total_ngn ?? it.price ?? 0) * (it.quantity || 1))}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-white/[0.08] pt-2 space-y-1">
                    {activeOrder && activeOrder.discount_ngn > 0 && (
                      <div className="flex justify-between text-[#16C784]">
                        <span>Automatic discounts</span>
                        <span className="tabular-nums-display">
                          −{formatNaira(activeOrder.discount_ngn)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#9AA4B2]">
                      <span>Delivery Fee · {selectedZone.name}</span>
                      <span className="tabular-nums-display text-white">
                        {formatNaira(activeOrder ? activeOrder.delivery_fee_ngn : cartSummary.deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-white/[0.08] pt-2">
                      <span className="text-sm font-bold text-white">Payable Total</span>
                      <span className="tabular-nums-display text-xl font-bold text-[#16C784]">
                        {formatNaira(activeOrder ? activeOrder.total_ngn : cartSummary.finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {checkoutPhase === 'details' && (
                  <div className="space-y-3">
                    <div>
                      <label className="v-label" htmlFor="checkout-address">
                        Delivery Address / Pickup Point
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        value={checkoutForm.address}
                        onChange={(e) =>
                          setCheckoutForm({ ...checkoutForm, address: e.target.value })
                        }
                        placeholder="Street address, landmark or pickup hub"
                        className="v-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="v-label" htmlFor="checkout-notes">
                        Delivery Notes (optional)
                      </label>
                      <textarea
                        id="checkout-notes"
                        rows={2}
                        value={checkoutForm.notes}
                        onChange={(e) =>
                          setCheckoutForm({ ...checkoutForm, notes: e.target.value })
                        }
                        placeholder="e.g. Leave at gate, call on arrival..."
                        className="v-input text-xs resize-none"
                      />
                    </div>
                  </div>
                )}

                {checkoutPhase === 'creating' && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-[#9AA4B2]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#16C784]" />
                    Creating your server-verified order...
                  </div>
                )}

                {checkoutPhase === 'paying' && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-[#9AA4B2]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#16C784]" />
                    Secure Paystack checkout is opening — complete your payment there...
                  </div>
                )}

                {checkoutPhase === 'processing' && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-[#9AA4B2]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#16C784]" />
                    Confirming your payment & generating receipt server-side...
                  </div>
                )}

                {checkoutPhase !== 'creating' && checkoutPhase !== 'paying' && (
                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(false)}
                      className="v-btn-secondary text-xs"
                    >
                      {activeOrder ? 'Cancel Payment' : 'Close'}
                    </button>
                    <button
                      type="button"
                      onClick={handlePayWithPaystack}
                      disabled={checkoutBusy}
                      className="v-btn-primary text-xs"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {activeOrder
                        ? `Pay ${formatNaira(activeOrder.total_ngn)} with Paystack`
                        : 'Continue to Paystack'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Phase 5: My Orders Modal */}
      {ordersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="my-orders-title"
          onClick={() => setOrdersOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-t-3xl sm:rounded-2xl bg-[#11161C] border border-white/[0.1] p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-fade-up"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="green">ORDER CENTRE</Badge>
                <h3 id="my-orders-title" className="mt-1.5 font-display text-xl font-bold text-white">
                  My Store Orders
                </h3>
                <p className="text-xs text-[#9AA4B2] mt-0.5">
                  Every order & receipt is recorded server-side in your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrdersOpen(false)}
                aria-label="Close orders"
                className="rounded-lg p-1.5 text-[#9AA4B2] hover:text-white hover:bg-white/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-[#9AA4B2]">
                <Loader2 className="h-4 w-4 animate-spin text-[#16C784]" />
                Loading your orders...
              </div>
            ) : myOrders.length === 0 ? (
              <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-6 text-center text-xs text-[#9AA4B2]">
                No store orders yet. Order past questions or study packs from the catalogue.
              </div>
            ) : (
              <div className="space-y-3">
                {myOrders.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold ${{
                          pending: 'border-[#F59E0B]/40 text-[#F59E0B]',
                          paid: 'border-[#16C784]/40 text-[#16C784]',
                        }[o.status] || 'border-white/15 text-[#9AA4B2]'}`}
                      >
                        {o.status === 'paid' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {o.status === 'paid' ? 'PAID' : 'PENDING PAYMENT'}
                      </span>
                      <span className="tabular-nums-display font-bold text-white">
                        {formatNaira(o.total_ngn)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#9AA4B2]">
                      <span>
                        Placed:{' '}
                        {o.created_at
                          ? new Date(o.created_at).toLocaleDateString('en-NG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </span>
                      {o.paystack_reference && (
                        <span className="font-mono">Ref: {o.paystack_reference}</span>
                      )}
                    </div>
                    {Array.isArray(o.order_items) && o.order_items.length > 0 && (
                      <div className="border-t border-white/[0.06] pt-2 space-y-0.5">
                        {o.order_items.map((it) => (
                          <div key={it.id} className="flex justify-between gap-3">
                            <span className="text-[#C2C9D4]">Item × {it.quantity}</span>
                            <span className="tabular-nums-display text-[#9AA4B2] shrink-0">
                              {formatNaira(it.line_total_ngn)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end">
              <button type="button" onClick={() => setOrdersOpen(false)} className="v-btn-secondary text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Study Materials & Delivery Enquiry Modal */}
      {enquiryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="store-enq-title"
          onClick={() => setEnquiryOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-t-3xl sm:rounded-2xl bg-[#11161C] border border-white/[0.1] p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-fade-up"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="green">IN-APP STORE & DELIVERY DESK</Badge>
                <h3 id="store-enq-title" className="mt-1.5 font-display text-xl font-bold text-white">
                  Study Materials & Delivery Enquiry
                </h3>
                <p className="text-xs text-[#9AA4B2] mt-0.5">
                  Check stock, syllabus editions, pickup hubs or nationwide dispatch times directly on VALENCE (managed & updated via the Admin Store Portal).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnquiryOpen(false)}
                aria-label="Close enquiry modal"
                className="rounded-lg p-1.5 text-[#9AA4B2] hover:text-white hover:bg-white/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {lastEnquiryRef && (
              <div className="rounded-xl bg-[#16C784]/10 border border-[#16C784]/35 p-3.5 text-xs text-[#E5E9F0]">
                <strong className="text-[#16C784]">Ticket {lastEnquiryRef} received in-app.</strong>{' '}
                Store administrators respond directly inside your VALENCE account notifications & order centre.
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="v-label" htmlFor="se-name">Full Name</label>
                  <input
                    id="se-name"
                    type="text"
                    required
                    value={enquiryForm.fullName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                    placeholder="Your full name"
                    className="v-input text-xs"
                  />
                </div>
                <div>
                  <label className="v-label" htmlFor="se-email">Email Address</label>
                  <input
                    id="se-email"
                    type="email"
                    required
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="v-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="v-label" htmlFor="se-topic">Enquiry Type</label>
                  <select
                    id="se-topic"
                    value={enquiryForm.topic}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, topic: e.target.value })}
                    className="v-input text-xs"
                  >
                    <option>Material Availability & Edition Check</option>
                    <option>Study Pack Availability & Restock Alert</option>
                    <option>Same-Day Lagos / 1-Day Outside Lagos PQ Delivery</option>
                    <option>Campus Free-Delivery Hub Arrangement</option>
                    <option>Per-Course Past Question Selection Help</option>
                    <option>Existing Order Tracking Update</option>
                  </select>
                </div>
                <div>
                  <label className="v-label" htmlFor="se-zone">Delivery Location</label>
                  <select
                    id="se-zone"
                    value={enquiryForm.zoneId}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, zoneId: e.target.value })}
                    className="v-input text-xs"
                  >
                    {deliveryZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({z.isFree ? 'FREE' : formatNaira(z.fee)} · {z.eta})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="v-label" htmlFor="se-course">Course(s) / Material(s)</label>
                <input
                  id="se-course"
                  type="text"
                  required
                  value={enquiryForm.materialOrCourse}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, materialOrCourse: e.target.value })
                  }
                  placeholder="e.g. FR & TAX Pathfinder Past Questions, ATS 2 BAPS/FA, SBR Study Pack..."
                  className="v-input text-xs"
                />
              </div>

              <div>
                <label className="v-label" htmlFor="se-msg">Your Question / Delivery Note</label>
                <textarea
                  id="se-msg"
                  rows={3}
                  required
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  placeholder="Specify preferred pickup point, landmark or material question..."
                  className="v-input text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setEnquiryOpen(false)}
                  className="v-btn-secondary text-xs"
                >
                  Close
                </button>
                <button type="submit" className="v-btn-primary text-xs">
                  <Send className="h-3.5 w-3.5" /> Submit In-App Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Cover Lightbox Modal */}
      {previewProduct && previewProduct.imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previewProduct.title}
          onClick={() => setPreviewProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="v-card max-w-2xl w-full overflow-hidden grid grid-cols-1 sm:grid-cols-12 animate-fade-up"
          >
            <div className="sm:col-span-6 bg-[#080A0D] flex items-center justify-center p-4">
              <img
                src={previewProduct.imageUrl}
                alt={previewProduct.title}
                className="max-h-96 w-full rounded-xl object-contain"
              />
            </div>
            <div className="sm:col-span-6 p-6 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="green">
                    {previewProduct.programme} · {previewProduct.level}
                    {previewProduct.courseCode ? ` · ${previewProduct.courseCode}` : ''}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setPreviewProduct(null)}
                    aria-label="Close preview"
                    className="rounded-lg p-1 text-[#9AA4B2] hover:text-white hover:bg-white/[0.06]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2C9D4]">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: previewProduct.accentHex || '#16C784' }}
                  />
                  {previewProduct.colourBadge}
                </span>
                <h3 className="font-display text-lg font-bold text-white leading-snug">
                  {previewProduct.title}
                </h3>
                <p className="text-xs text-[#9AA4B2] leading-relaxed">
                  {previewProduct.description}
                </p>
                <p className="text-xs font-semibold text-[#16C784]">
                  {previewProduct.discountHint}
                </p>
                <div className="rounded-lg bg-[#0B0E11] border border-white/[0.08] px-3 py-2 text-[11px] space-y-0.5">
                  <p
                    className={`font-semibold ${
                      previewProduct.isAvailable === false ? 'text-[#EA3943]' : 'text-[#16C784]'
                    }`}
                  >
                    {previewProduct.isStudyPack
                      ? previewProduct.isAvailable === false
                        ? 'Status: Currently Unavailable (Admin Updated)'
                        : 'Status: Available Now (Admin Updated)'
                      : 'Status: Available Now · Ready for Dispatch'}
                  </p>
                  <p className="text-[#9AA4B2]">
                    {previewProduct.isStudyPack
                      ? 'Delivery: Delivered when available'
                      : 'Delivery: Same-day within Lagos · 1-day outside Lagos'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/[0.08] pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#9AA4B2]">Price</span>
                  <span className="tabular-nums-display text-2xl font-bold text-white">
                    {formatNaira(previewProduct.price)}
                  </span>
                </div>
                {previewProduct.isAvailable === false ? (
                  <button
                    type="button"
                    onClick={() => {
                      const target = previewProduct;
                      setPreviewProduct(null);
                      openRestockEnquiry(target);
                    }}
                    className="v-btn-secondary w-full py-2.5 text-xs"
                  >
                    <HelpCircle className="h-4 w-4 text-[#EA3943]" /> Notify Me When Available
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(previewProduct, 1);
                      toast.success('Added to Cart', previewProduct.title);
                      setPreviewProduct(null);
                    }}
                    className="v-btn-primary w-full py-2.5 text-xs"
                  >
                    <Plus className="h-4 w-4" /> Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
