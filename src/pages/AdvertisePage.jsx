import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Megaphone,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Check,
  Send,
  MapPin,
  Building2,
  BookOpen,
  Store,
  LogIn,
  CreditCard,
  Loader2,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { calculateAdCampaignCost, formatNaira } from '../lib/pricing';
import {
  fetchAdPackages,
  fetchAdPlacements,
  fetchMyAdvertiser,
  saveAdvertiser,
  submitAdvertiserVerification,
  bookAdCampaign,
  fetchMyAdCampaigns,
} from '../lib/advertising';
import { isPaystackConfigured } from '../lib/paystack';

const ADVERTISER_CATEGORIES = [
  {
    id: 'physical_centre',
    label: 'Physical Tuition Centre',
    shortDesc: 'Verified in-person classroom venues only (no external online classes)',
    icon: Building2,
  },
  {
    id: 'textbook_author',
    label: 'Textbook Author',
    shortDesc: 'Authors promoting original accounting, ICAN, ATSWA & finance textbooks',
    icon: BookOpen,
  },
  {
    id: 'textbook_vendor',
    label: 'Textbook Vendor / Bookshop',
    shortDesc: 'Verified bookstores & vendors selling genuine accounting textbooks',
    icon: Store,
  },
];

const QUICK_DURATIONS = [1, 2, 4, 8, 12];

const VERIFICATION_TYPES = [
  {
    key: 'venue',
    label: 'Physical Venue Verification',
    hint: 'Registered business / lease proof for your physical lecture venue',
    forCategory: 'physical_centre',
  },
  {
    key: 'isbn',
    label: 'ISBN / Publisher Verification',
    hint: 'ISBN or publisher documentation for the authored textbook(s)',
    forCategory: 'textbook_author',
  },
  {
    key: 'antipiracy',
    label: 'Anti-Piracy Stock Verification',
    hint: 'Evidence that stocked textbooks are genuine publisher editions',
    forCategory: 'textbook_vendor',
  },
];

export default function AdvertisePage() {
  const { user, settings, handleSignIn } = usePlatform();
  const toast = useToast();
  const navigate = useNavigate();

  const weeklyRate = settings.adWeeklyRate || 10000;
  const [advertiserType, setAdvertiserType] = useState('physical_centre');
  const [weeks, setWeeks] = useState(1);
  const [selectedPlacementIds, setSelectedPlacementIds] = useState(['featured-dir']);
  const [policyConfirmed, setPolicyConfirmed] = useState(true);
  const [packages, setPackages] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [myAdvertiser, setMyAdvertiser] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(null);

  const [campaign, setCampaign] = useState({
    entityName: '',
    streetOrCoverage: '',
    centreCostImplication: '',
    isbnOrPublisher: '',
    contactEmail: '',
    contactPhone: '',
    cityState: 'Lagos',
    headline: '',
    notes: '',
  });
  const [verificationDetails, setVerificationDetails] = useState('');

  const isAuthenticated = Boolean(user);
  const activePackage = useMemo(
    () => packages.find((p) => p.price_ngn === weeklyRate) || packages[0] || null,
    [packages, weeklyRate]
  );

  const selectedCategory =
    ADVERTISER_CATEGORIES.find((c) => c.id === advertiserType) || ADVERTISER_CATEGORIES[0];

  // Load packages, placements and the caller's advertiser profile.
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [pkgs, pls] = await Promise.all([fetchAdPackages(), fetchAdPlacements()]);
        if (!active) return;
        setPackages(pkgs);
        setPlacements(pls.length ? pls : []);
      } catch (err) {
        // Fall back to static placements if the RPC isn't reachable yet.
        setPlacements([]);
      }
      if (active) setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadAdvertiser() {
      if (!isAuthenticated) {
        if (active) setLoading(false);
        return;
      }
      try {
        const res = await fetchMyAdvertiser();
        if (!active) return;
        setMyAdvertiser(res?.advertiser || null);
        setVerification(res?.verification || null);
        if (res?.advertiser) {
          setAdvertiserType(res.advertiser.category || 'physical_centre');
          setCampaign((c) => ({
            ...c,
            entityName: res.advertiser.centre_name || c.entityName,
            address: res.advertiser.address || c.streetOrCoverage,
            isbnOrPublisher: res.advertiser.isbn_or_publisher || c.isbnOrPublisher,
          }));
        }
      } catch (err) {
        // no-op
      }
      if (active) setLoading(false);
    }
    loadAdvertiser();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const placementCount = selectedPlacementIds.length;
  const cost = useMemo(
    () => calculateAdCampaignCost(weeks, activePackage?.price_ngn || weeklyRate, placementCount),
    [weeks, weeklyRate, activePackage, placementCount]
  );

  const togglePlacement = (id) => {
    setSelectedPlacementIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 9) {
        toast.warning('Maximum 9 slots', 'You can select up to 9 sponsored placement slots.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedVerificationType =
    VERIFICATION_TYPES.find((v) => v.forCategory === advertiserType) || VERIFICATION_TYPES[0];

  const buildAdvertiserPayload = () => ({
    id: myAdvertiser?.id,
    centre_name: campaign.entityName.trim(),
    category: advertiserType,
    address: campaign.streetOrCoverage.trim(),
    contact_details: [campaign.contactEmail.trim(), campaign.contactPhone.trim()].filter(Boolean).join(' · '),
    website: '',
    business_description: campaign.centreCostImplication || campaign.isbnOrPublisher || '',
    areas_of_specialisation: [],
    programmes_offered: [],
    credentials: campaign.centreCostImplication || '',
    isbn_or_publisher: campaign.isbnOrPublisher.trim(),
  });

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning('Sign in required', 'Sign in to your VALENCE account to apply to advertise.');
      return;
    }
    if (!policyConfirmed) {
      toast.warning('Compliance Confirmation Required', 'Please tick the VALENCE advertising compliance declaration.');
      return;
    }
    setSubmitting(true);
    try {
      const saved = await saveAdvertiser(buildAdvertiserPayload());
      const verificationRes = await submitAdvertiserVerification({
        verificationType: selectedVerificationType.label,
        details: verificationDetails.trim() || `${selectedCategory.label} — ${campaign.headline || campaign.entityName}`,
      });
      setMyAdvertiser({ ...myAdvertiser, ...buildAdvertiserPayload(), id: saved.advertiser_id });
      setVerification({ status: 'pending' });
      toast.success(
        'Application Submitted',
        `${selectedCategory.label} profile saved and submitted for VALENCE verification (ref ${saved.advertiser_id?.slice(0, 8)}). You can book ads once verified.`
      );
    } catch (err) {
      toast.error('Could not submit application', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBook = async () => {
    if (!myAdvertiser || myAdvertiser.verification_status !== 'verified') {
      toast.warning('Verification required', 'Your advertiser profile must be verified before booking a campaign.');
      return;
    }
    if (!campaign.entityName.trim() || !campaign.headline.trim()) {
      toast.warning('Missing details', 'Provide your entity name and a campaign headline.');
      return;
    }
    if (placementCount < 1) {
      toast.warning('Select a placement', 'Choose at least one sponsored placement slot.');
      return;
    }
    setBooking(true);
    setBooked(null);
    try {
      const result = await bookAdCampaign({
        campaign: {
          advertiserId: myAdvertiser.id,
          packageId: activePackage?.id,
          campaignName: campaign.headline.trim(),
          copyText: campaign.notes.trim(),
          contactLink: campaign.contactEmail.trim() || null,
          placements: selectedPlacementIds,
          weeks,
        },
        email: user?.email || campaign.contactEmail || '',
        name: campaign.entityName,
      });
      setBooked(result);
      if (result.fallback) {
        toast.info(
          'Campaign booked',
          'Paystack checkout is not configured — your campaign is saved and pending payment from your Advertiser Hub.'
        );
      } else {
        toast.success(
          'Campaign Active 🎉',
          `${formatNaira(result.payment.amount_ngn)} paid via Paystack. Your sponsored ads are now live across ${placementCount} placement(s).`
        );
        const refreshed = await fetchMyAdCampaigns().catch(() => []);
        if (Array.isArray(refreshed) && refreshed.length) {
          setMyAdvertiser((a) => (a ? { ...a, campaign_count: refreshed.length } : a));
        }
      }
    } catch (err) {
      toast.error('Booking failed', err.message);
    } finally {
      setBooking(false);
    }
  };

  const verificationStatus = myAdvertiser?.verification_status || verification?.status || 'none';
  const isVerified = verificationStatus === 'verified';

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Hero */}
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">VALENCE ADVERTISE · 100% IN-APP</Badge>
              <Badge variant="neutral">Physical Centres · Textbook Authors · Book Vendors</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              Advertise Physical Centres, Author Textbooks &amp; Bookshops for{' '}
              <span className="text-[#16C784]">{formatNaira(weeklyRate)}/Week</span>
            </h1>
            <p className="text-sm sm:text-base text-[#9AA4B2]">
              Reach ATSWA, ICAN and university accounting students nationwide, open to verified{' '}
              <strong className="text-white">physical (in-person) tuition centres</strong>,{' '}
              <strong className="text-white">accounting textbook authors</strong>, and{' '}
              <strong className="text-white">verified textbook vendors</strong>. External online tuition is never advertised (all online tuition is taken directly in-app with VALENCE-verified tutors).
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#campaign-builder" className="v-btn-primary text-xs">
                <Megaphone className="h-4 w-4" /> Book In-App Ad ({formatNaira(weeklyRate)}/wk)
              </a>
              <Link to="/partners" className="v-btn-secondary text-xs">
                Browse Verified Partners <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
              </Link>
              <Link to="/tuition-centres" className="v-btn-secondary text-xs">
                Browse Centres, Authors &amp; Vendors
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 v-glass-card p-6 sm:p-7 border-[#16C784]/35 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16C784]">
                Official In-App Ad Rate
              </span>
              <Badge variant="verified">Paystack Verified</Badge>
            </div>
            <div className="rounded-2xl bg-[#0B0E11] border border-[#16C784]/30 p-5 text-center space-y-1">
              <p className="font-display text-4xl sm:text-5xl font-bold text-[#16C784] tabular-nums-display">
                {formatNaira(weeklyRate)}
              </p>
              <p className="text-xs font-semibold text-white">
                Per Week · Centres, Textbook Authors &amp; Vendors
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-[#C2C9D4]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                <span><strong>Physical Tuition Centres:</strong> Verified bricks-and-mortar in-person lecture venues only</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                <span><strong>Textbook Authors:</strong> Promote original accounting, IFRS, tax, audit &amp; syllabus books you sell</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                <span><strong>Textbook Authors &amp; Vendors:</strong> Built-in in-app student enquiries plus optional in-app Paystack checkout so students stay inside VALENCE</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Campaign Builder + Governance */}
      <section id="campaign-builder" className="py-14 sm:py-18">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Sign-in gate */}
            {!isAuthenticated && (
              <div className="v-card p-6 sm:p-7 border-[#F59E0B]/40 space-y-4">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <LogIn className="h-5 w-5" />
                  <h2 className="font-display text-lg font-bold text-white">Sign in to apply &amp; book</h2>
                </div>
                <p className="text-xs text-[#9AA4B2]">
                  Advertising applications, Paystack billing and live analytics all run through your secure VALENCE account. Create an Advertiser account or sign in to continue.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/signin?portal=advertiser')}
                  className="v-btn-primary text-xs"
                >
                  <LogIn className="h-4 w-4" /> Go to Advertiser Sign-in
                </button>
              </div>
            )}

            {/* Verification status banner */}
            {isAuthenticated && myAdvertiser && (
              <div
                className={`v-card p-5 space-y-2 ${
                  isVerified
                    ? 'border-[#16C784]/40'
                    : verificationStatus === 'rejected'
                    ? 'border-[#EA3943]/40'
                    : 'border-[#F59E0B]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isVerified ? (
                      <ShieldCheck className="h-5 w-5 text-[#16C784]" />
                    ) : (
                      <ShieldAlert className={`h-5 w-5 ${verificationStatus === 'rejected' ? 'text-[#EA3943]' : 'text-[#F59E0B]'}`} />
                    )}
                    <span className="font-display text-sm font-bold text-white">
                      {myAdvertiser.centre_name || 'Your advertiser profile'}
                    </span>
                  </div>
                  <Badge variant={isVerified ? 'verified' : verificationStatus === 'rejected' ? 'red' : 'neutral'}>
                    {isVerified ? 'Verified' : verificationStatus === 'rejected' ? 'Rejected' : 'Pending review'}
                  </Badge>
                </div>
                <p className="text-xs text-[#9AA4B2]">
                  {isVerified
                    ? 'Your profile is verified — you can book campaigns below and pay via Paystack.'
                    : verificationStatus === 'rejected'
                    ? 'Your verification was rejected. Update your details and resubmit for review.'
                    : 'Submit your application below. VALENCE admins verify physical venues, ISBNs and anti-piracy evidence before ads go live.'}
                </p>
                {isVerified && (
                  <Link to="/portal/advertiser" className="v-btn-secondary text-xs">
                    Open Advertiser Hub <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={isVerified ? handleBook : handleApply} className="v-card p-6 sm:p-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {isVerified ? 'In-App Campaign Booking' : 'Advertiser Application &amp; Campaign Builder'}
                  </h2>
                  <p className="text-xs text-[#9AA4B2] mt-0.5">
                    {isVerified
                      ? 'Choose duration &amp; placements, then complete payment to activate.'
                      : 'Select your category, submit your details and verification evidence.'}
                  </p>
                </div>
                <Badge variant="green">{formatNaira(weeklyRate)} / Week</Badge>
              </div>

              {/* Step 1: Category */}
              <div className="space-y-2">
                <span className="v-label">Advertiser Category (Choose One)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {ADVERTISER_CATEGORIES.map((cat) => {
                    const CIcon = cat.icon;
                    const active = advertiserType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAdvertiserType(cat.id)}
                        className={`rounded-xl border p-3.5 text-left transition-all space-y-1.5 ${
                          active
                            ? 'bg-[#16C784]/[0.12] border-[#16C784] text-white'
                            : 'bg-[#0B0E11] border-white/[0.08] text-[#C2C9D4] hover:border-white/[0.2]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <CIcon className="h-4 w-4 text-[#16C784]" />
                          {active && <Check className="h-3.5 w-3.5 text-[#16C784]" />}
                        </div>
                        <p className="font-display text-xs font-bold text-white">{cat.label}</p>
                        <p className="text-[10.5px] leading-snug text-[#9AA4B2]">{cat.shortDesc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Duration */}
              <div className="space-y-2">
                <label className="v-label flex items-center gap-1.5" htmlFor="ad-weeks">
                  <Calendar className="h-3.5 w-3.5 text-[#16C784]" /> Campaign Duration (Weeks)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {QUICK_DURATIONS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWeeks(w)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-display font-bold border transition-colors ${
                        weeks === w
                          ? 'bg-[#16C784] text-[#06130D] border-[#16C784]'
                          : 'bg-[#0B0E11] text-[#C2C9D4] border-white/[0.08] hover:border-white/[0.2]'
                      }`}
                    >
                      {w} {w === 1 ? 'Week' : 'Weeks'} · {formatNaira(w * (activePackage?.price_ngn || weeklyRate))}
                    </button>
                  ))}
                  <input
                    id="ad-weeks"
                    type="number"
                    min="1"
                    max="52"
                    value={weeks}
                    onChange={(e) => setWeeks(Math.max(1, Math.min(52, Number(e.target.value) || 1)))}
                    className="v-input w-24 text-xs py-2"
                  />
                </div>
              </div>

              {/* Step 3: Placements (multi-select) */}
              <div className="space-y-2">
                <span className="v-label">Sponsored Placement Slots (select 1–9)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {placements.map((pl) => {
                    const active = selectedPlacementIds.includes(pl.id);
                    return (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => togglePlacement(pl.id)}
                        className={`rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                          active
                            ? 'bg-[#16C784]/[0.12] border-[#16C784]/50 text-white'
                            : 'bg-[#0B0E11] border-white/[0.07] text-[#C2C9D4] hover:border-white/[0.18]'
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-medium">{pl.label}</span>
                          {active && <Check className="h-3.5 w-3.5 text-[#16C784] shrink-0" />}
                        </span>
                        <span className="text-[10.5px] text-[#9AA4B2]">{pl.location}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10.5px] text-[#667085]">
                  Selected {placementCount} of 9 slot(s). Total = weeks × slots × {formatNaira(activePackage?.price_ngn || weeklyRate)}/week.
                </p>
              </div>

              {/* Category-adaptive details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="v-label" htmlFor="ad-entity">
                    {advertiserType === 'physical_centre'
                      ? 'Physical Tuition Centre Name'
                      : advertiserType === 'textbook_author'
                      ? 'Author Full Name & Credentials'
                      : 'Textbook Vendor / Bookshop Name'}
                  </label>
                  <input
                    id="ad-entity"
                    type="text"
                    required
                    value={campaign.entityName}
                    onChange={(e) => setCampaign({ ...campaign, entityName: e.target.value })}
                    placeholder="Registered centre, author or bookshop name"
                    className="v-input text-xs"
                  />
                </div>
                <div>
                  <label className="v-label" htmlFor="ad-city">City &amp; State</label>
                  <input
                    id="ad-city"
                    type="text"
                    required
                    value={campaign.cityState}
                    onChange={(e) => setCampaign({ ...campaign, cityState: e.target.value })}
                    placeholder="e.g. Yaba, Lagos"
                    className="v-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="v-label flex items-center gap-1.5" htmlFor="ad-addr">
                  <MapPin className="h-3.5 w-3.5 text-[#16C784]" />
                  {advertiserType === 'physical_centre'
                    ? 'Full Physical Lecture Venue Address (Required)'
                    : advertiserType === 'textbook_author'
                    ? 'Textbook Title(s), Edition & Price'
                    : 'Bookshop Address & Nationwide Delivery Coverage'}
                </label>
                <input
                  id="ad-addr"
                  type="text"
                  required
                  value={campaign.streetOrCoverage}
                  onChange={(e) => setCampaign({ ...campaign, streetOrCoverage: e.target.value })}
                  placeholder={
                    advertiserType === 'physical_centre'
                      ? 'Street number, building, bus-stop / landmark, LGA & State'
                      : advertiserType === 'textbook_author'
                      ? 'e.g. Mastering IFRS Group Accounts (4th Ed., 2026) (₦14,000)'
                      : 'e.g. 24 Herbert Macaulay Way, Yaba, Lagos · Nationwide courier'
                  }
                  className="v-input text-xs"
                />
              </div>

              {advertiserType === 'physical_centre' ? (
                <div>
                  <label className="v-label" htmlFor="ad-centre-cost">
                    Centre Tuition Cost Implication (Per Level / Per Course &amp; Discounts)
                  </label>
                  <textarea
                    id="ad-centre-cost"
                    rows={2}
                    value={campaign.centreCostImplication}
                    onChange={(e) => setCampaign({ ...campaign, centreCostImplication: e.target.value })}
                    placeholder="Physical tuition fee breakdown per level/course, registration fee & multi-paper discounts"
                    className="v-input text-xs resize-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="v-label" htmlFor="ad-isbn">
                    {advertiserType === 'textbook_author'
                      ? 'ISBN / Publisher & Syllabuses Covered'
                      : 'Featured Textbooks, Authors & Publishers Stocked'}
                  </label>
                  <input
                    id="ad-isbn"
                    type="text"
                    required
                    value={campaign.isbnOrPublisher}
                    onChange={(e) => setCampaign({ ...campaign, isbnOrPublisher: e.target.value })}
                    placeholder={
                      advertiserType === 'textbook_author'
                        ? 'e.g. ISBN 978-... · Covers ICAN FR, SBR & University Financial Reporting'
                        : 'e.g. IFRS, Taxation, Costing, IPSAS, Auditing & ATSWA/ICAN textbooks'
                    }
                    className="v-input text-xs"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="v-label" htmlFor="ad-email">Contact Email</label>
                  <input
                    id="ad-email"
                    type="email"
                    value={campaign.contactEmail}
                    onChange={(e) => setCampaign({ ...campaign, contactEmail: e.target.value })}
                    placeholder="you@example.com"
                    className="v-input text-xs"
                  />
                </div>
                <div>
                  <label className="v-label" htmlFor="ad-phone">Contact Phone</label>
                  <input
                    id="ad-phone"
                    type="tel"
                    value={campaign.contactPhone}
                    onChange={(e) => setCampaign({ ...campaign, contactPhone: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className="v-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="v-label" htmlFor="ad-headline">Campaign Headline</label>
                <input
                  id="ad-headline"
                  type="text"
                  required
                  value={campaign.headline}
                  onChange={(e) => setCampaign({ ...campaign, headline: e.target.value })}
                  placeholder={
                    advertiserType === 'physical_centre'
                      ? 'e.g. May 2027 ICAN Skills & Pro Physical Weekend Classes, Yaba'
                      : advertiserType === 'textbook_author'
                      ? 'e.g. New 2026 Edition: Nigerian Taxation & Finance Act Worked Manual'
                      : 'e.g. Original ICAN, ATSWA & University Accounting Textbooks · Fast Delivery'
                  }
                  className="v-input text-xs"
                />
              </div>

              <div>
                <label className="v-label" htmlFor="ad-notes">Additional Notes (Optional)</label>
                <textarea
                  id="ad-notes"
                  rows={2}
                  value={campaign.notes}
                  onChange={(e) => setCampaign({ ...campaign, notes: e.target.value })}
                  placeholder="Preferred start date, subject list, bulk student discount or enquiry details..."
                  className="v-input text-xs resize-none"
                />
              </div>

              {/* Verification evidence (for non-verified advertisers) */}
              {!isVerified && (
                <div>
                  <label className="v-label" htmlFor="ad-verif">
                    {selectedVerificationType.label} — Details / Evidence
                  </label>
                  <textarea
                    id="ad-verif"
                    rows={2}
                    value={verificationDetails}
                    onChange={(e) => setVerificationDetails(e.target.value)}
                    placeholder={selectedVerificationType.hint}
                    className="v-input text-xs resize-none"
                  />
                </div>
              )}

              {/* Compliance declaration */}
              <label className="flex items-start gap-2.5 rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3.5 text-xs text-[#C2C9D4] cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyConfirmed}
                  onChange={(e) => setPolicyConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#16C784] rounded shrink-0"
                />
                <span>
                  {advertiserType === 'physical_centre' ? (
                    <>
                      We confirm our centre operates a verifiable <strong className="text-white">physical lecture venue</strong> and promotes <strong className="text-white">in-person tuition only</strong> (no external online classes).
                    </>
                  ) : advertiserType === 'textbook_author' ? (
                    <>
                      I confirm I am the legitimate <strong className="text-white">author / copyright holder</strong> (or authorised representative) of the advertised textbook(s).
                    </>
                  ) : (
                    <>
                      We confirm we supply <strong className="text-white">100% genuine, original publisher/author editions only</strong> (strict zero-piracy policy).
                    </>
                  )}
                </span>
              </label>

              {/* Live cost summary */}
              <div className="rounded-2xl bg-[#0B0E11] border border-[#16C784]/30 p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  <p className="text-[#9AA4B2]">
                    {selectedCategory.label} · {cost.weeks} {cost.weeks === 1 ? 'week' : 'weeks'} × {placementCount} slot(s) × {formatNaira(cost.weeklyRate)}/week
                  </p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Server-verified Paystack checkout inside VALENCE
                  </p>
                </div>
                <span className="tabular-nums-display font-display text-2xl font-bold text-[#16C784]">
                  {formatNaira(cost.totalAmount)}
                </span>
              </div>

              {/* Booked confirmation */}
              {booked && (
                <div className="rounded-xl bg-[#16C784]/10 border border-[#16C784]/35 p-4 text-xs text-[#E5E9F0] space-y-1">
                  <p className="font-bold text-[#16C784] flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Campaign Active
                  </p>
                  <p className="text-[#C2C9D4]">
                    {formatNaira(booked.payment.amount_ngn)} · reference {booked.payment.reference} ·{' '}
                    {booked.server_verified ? 'Paystack-verified' : 'payment pending'}. View live analytics in your{' '}
                    <Link to="/portal/advertiser" className="text-[#16C784] underline font-semibold">Advertiser Hub</Link>.
                  </p>
                </div>
              )}

              <button type="submit" disabled={submitting || booking} className="v-btn-primary w-full py-3">
                {booking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing Paystack Payment…
                  </>
                ) : submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting Application…
                  </>
                ) : isVerified ? (
                  <>
                    <CreditCard className="h-4 w-4" /> Pay &amp; Activate Campaign ({formatNaira(cost.totalAmount)})
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit {selectedCategory.label} Application
                  </>
                )}
              </button>
              {isVerified && !isPaystackConfigured() && (
                <p className="-mt-2 text-[10.5px] text-[#F59E0B]">
                  Paystack is not configured — the campaign will be saved as pending payment. Complete payment from your Advertiser Hub.
                </p>
              )}
            </form>
          </div>

          {/* Right: governance + analytics */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
            <div className="v-card p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#16C784]">
                <BarChart3 className="h-5 w-5" />
                <h2 className="font-display text-xl font-bold text-white">
                  VALENCE ADVERTISE Rules &amp; Analytics
                </h2>
              </div>
              <ul className="space-y-2.5 text-xs text-[#9AA4B2]">
                {[
                  'Open to 3 verified groups: (1) Physical Tuition Centres, (2) Accounting Textbook Authors, and (3) Verified Textbook Vendors / Bookshops.',
                  'External online tuition is never advertised; all online tuition runs strictly inside VALENCE with VALENCE-verified tutors.',
                  'Physical centres submit verified per-level/per-course cost implication revealed to students who unlock cost implications.',
                  'Authors & vendors get built-in in-app student enquiries plus optional in-app Paystack checkout.',
                  'Strict anti-piracy protection: authors & vendors must supply genuine, copyright-compliant editions only.',
                  `Transparent flat rate of ${formatNaira(weeklyRate)} per week (admin-editable), paid via server-verified Paystack checkout.`,
                  '100% in-app workflow with clear Sponsored badges and live impressions, clicks & CTR analytics.',
                  'Teach online instead? Apply as an in-app VALENCE-verified tutor via the Tutor Portal.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="v-card p-5 flex items-start gap-3 text-xs text-[#9AA4B2]">
              <ShieldCheck className="h-5 w-5 text-[#16C784] shrink-0 mt-0.5" />
              <p>
                Already verified? Sign in to the{' '}
                <Link to="/portal/advertiser" className="text-[#16C784] font-semibold hover:underline">
                  VALENCE Advertiser Hub
                </Link>{' '}
                to extend running weeks, update creatives, view live CTR or download Paystack invoices. Review our{' '}
                <Link to="/legal/advertising" className="text-[#16C784] hover:underline">
                  Advertising &amp; Anti-Piracy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
