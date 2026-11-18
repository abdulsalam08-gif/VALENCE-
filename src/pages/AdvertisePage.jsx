import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { calculateAdCampaignCost, formatNaira } from '../lib/pricing';

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

const AD_PLACEMENTS = [
  { id: 'home-banner', label: 'Homepage Promotional Banner' },
  { id: 'store-spotlight', label: 'Study Materials & Bookstore Spotlight' },
  { id: 'ican-sponsored', label: 'Sponsored ICAN Programme Placement' },
  { id: 'atswa-sponsored', label: 'Sponsored ATSWA Programme Placement' },
  { id: 'student-dash', label: 'Student Dashboard Placement' },
  { id: 'connect-post', label: 'Sponsored VALENCE CONNECT Post' },
  { id: 'featured-dir', label: 'Featured Directory Card (Centre / Author / Vendor)' },
  { id: 'learn-slot', label: 'Learning & Syllabus Section Placement' },
  { id: 'book-launch', label: 'New Textbook Launch / Physical Workshop Card' },
];

const QUICK_DURATIONS = [1, 2, 4, 8, 12];

export default function AdvertisePage() {
  const { settings, submitInAppTicket } = usePlatform();
  const toast = useToast();

  const weeklyRate = settings.adWeeklyRate || 10000;
  const [advertiserType, setAdvertiserType] = useState('physical_centre');
  const [weeks, setWeeks] = useState(1);
  const [selectedPlacementId, setSelectedPlacementId] = useState('featured-dir');
  const [policyConfirmed, setPolicyConfirmed] = useState(true);
  const [campaign, setCampaign] = useState({
    entityName: '',
    streetOrCoverage: '',
    bookTitlesOrSchedule: '',
    isbnOrPublisher: '',
    contactEmail: '',
    contactPhone: '',
    cityState: 'Lagos',
    targetAudience: 'ATSWA & ICAN Candidates (All Levels)',
    headline: '',
    notes: '',
  });
  const [submittedRef, setSubmittedRef] = useState(null);

  const cost = useMemo(
    () => calculateAdCampaignCost(weeks, weeklyRate, 1),
    [weeks, weeklyRate]
  );

  const selectedCategory =
    ADVERTISER_CATEGORIES.find((c) => c.id === advertiserType) || ADVERTISER_CATEGORIES[0];
  const selectedPlacement =
    AD_PLACEMENTS.find((p) => p.id === selectedPlacementId) || AD_PLACEMENTS[0];

  const handleCampaignSubmit = (e) => {
    e.preventDefault();
    if (!policyConfirmed) {
      toast.warning(
        'Compliance Confirmation Required',
        'Please tick the VALENCE advertising compliance declaration before submitting.'
      );
      return;
    }
    const record = submitInAppTicket('advertise', {
      ...campaign,
      advertiserCategory: selectedCategory.label,
      placement: selectedPlacement.label,
      weeks: cost.weeks,
      weeklyRate: cost.weeklyRate,
      totalAmount: cost.totalAmount,
    });
    setSubmittedRef(record.id);
    toast.success(
      `${selectedCategory.label} Ad Logged (${record.id})`,
      `${cost.weeks} week(s) × ${formatNaira(cost.weeklyRate)} = ${formatNaira(cost.totalAmount)} · Pending Admin verification & Paystack checkout.`
    );
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Hero, Physical Tuition Centres, Textbook Authors & Textbook Vendors @ ₦10,000/Week */}
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
              <Link to="/portal/advertiser?mode=register" className="v-btn-secondary text-xs">
                Advertiser Portal Login / Signup <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
              </Link>
              <Link to="/tuition-centres" className="v-btn-secondary text-xs">
                Browse Centres, Authors &amp; Vendors
              </Link>
            </div>
          </div>

          {/* Transparent Weekly Rate Card */}
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
                <span><strong>Textbook Vendors:</strong> Verified bookshops &amp; distributors selling authentic accounting titles</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive In-App Campaign Builder */}
      <section id="campaign-builder" className="py-14 sm:py-18">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleCampaignSubmit} className="lg:col-span-7 v-card p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  In-App Campaign Booking &amp; Advertiser Application
                </h2>
                <p className="text-xs text-[#9AA4B2] mt-0.5">
                  Select your advertiser category, choose duration &amp; placement, and submit directly on VALENCE.
                </p>
              </div>
              <Badge variant="green">{formatNaira(weeklyRate)} / Week</Badge>
            </div>

            {submittedRef && (
              <div className="rounded-xl bg-[#16C784]/10 border border-[#16C784]/35 p-4 text-xs text-[#E5E9F0] space-y-1">
                <p className="font-bold text-[#16C784]">
                  Campaign Reference {submittedRef} Submitted In-App ({selectedCategory.label})
                </p>
                <p className="text-[#C2C9D4]">
                  Total: <strong>{formatNaira(cost.totalAmount)}</strong> ({cost.weeks}{' '}
                  {cost.weeks === 1 ? 'week' : 'weeks'} on {selectedPlacement.label}). Continue in your{' '}
                  <Link to="/portal/advertiser" className="text-[#16C784] underline font-semibold">
                    Advertiser Portal
                  </Link>{' '}
                  for Admin review, Paystack billing and live analytics.
                </p>
              </div>
            )}

            {/* Step 1: 3-Category Advertiser Selector */}
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
                          ? 'bg-[#16C784]/12 border-[#16C784] text-white'
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

            {/* Step 2: Duration Selector */}
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
                    {w} {w === 1 ? 'Week' : 'Weeks'} · {formatNaira(w * weeklyRate)}
                  </button>
                ))}
                <input
                  id="ad-weeks"
                  type="number"
                  min="1"
                  max="52"
                  value={weeks}
                  onChange={(e) => setWeeks(Math.max(1, Math.min(52, Number(e.target.value) || 1)))}
                  aria-label="Custom number of weeks"
                  className="v-input w-24 text-xs py-2"
                />
              </div>
            </div>

            {/* Step 3: Placement Slot Selector */}
            <div className="space-y-2">
              <span className="v-label">Choose Approved Placement Slot (9 Available)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {AD_PLACEMENTS.map((pl, idx) => {
                  const active = selectedPlacementId === pl.id;
                  return (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => setSelectedPlacementId(pl.id)}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                        active
                          ? 'bg-[#16C784]/12 border-[#16C784]/50 text-white'
                          : 'bg-[#0B0E11] border-white/[0.07] text-[#C2C9D4] hover:border-white/[0.18]'
                      }`}
                    >
                      <span className="font-medium">
                        {idx + 1}. {pl.label}
                      </span>
                      {active && <Check className="h-3.5 w-3.5 text-[#16C784] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category-Adaptive Details */}
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
                  placeholder={
                    advertiserType === 'physical_centre'
                      ? 'e.g. Prime Ledger School of Accountancy'
                      : advertiserType === 'textbook_author'
                      ? 'e.g. Dr. Kunle Adeyemi, FCA'
                      : 'e.g. Scholar’s Ledger Academic Bookshop'
                  }
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
                  placeholder="e.g. Yaba, Lagos / Wuse II, Abuja"
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
                    : 'e.g. 24 Herbert Macaulay Way, Yaba, Lagos · Nationwide courier dispatch'
                }
                className="v-input text-xs"
              />
            </div>

            {advertiserType !== 'physical_centre' && (
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
                      ? 'e.g. ISBN 978-978-... · Covers ICAN FR, SBR & University Financial Reporting'
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
                  required
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
                  required
                  value={campaign.contactPhone}
                  onChange={(e) => setCampaign({ ...campaign, contactPhone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="v-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="v-label" htmlFor="ad-extra">
                  {advertiserType === 'physical_centre'
                    ? 'In-Person Class Schedule'
                    : 'Fulfilment / How Students Purchase'}
                </label>
                <select
                  id="ad-extra"
                  value={campaign.bookTitlesOrSchedule}
                  onChange={(e) =>
                    setCampaign({ ...campaign, bookTitlesOrSchedule: e.target.value })
                  }
                  className="v-input text-xs"
                >
                  {advertiserType === 'physical_centre' ? (
                    <>
                      <option>Weekday &amp; Weekend Physical Classes</option>
                      <option>Weekend Intensive Physical Classes</option>
                      <option>Weekday Daytime / Evening Physical Classes</option>
                    </>
                  ) : (
                    <>
                      <option>Physical Walk-In &amp; Nationwide Delivery</option>
                      <option>Direct Author / Publisher Dispatch Nationwide</option>
                      <option>Campus Bookshops &amp; Courier Delivery</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="v-label" htmlFor="ad-target">Target Student Audience</label>
                <select
                  id="ad-target"
                  value={campaign.targetAudience}
                  onChange={(e) => setCampaign({ ...campaign, targetAudience: e.target.value })}
                  className="v-input text-xs"
                >
                  <option>ATSWA &amp; ICAN Candidates (All Levels)</option>
                  <option>ATSWA Candidates (ATS 1 – ATS 3)</option>
                  <option>ICAN Foundation Level Candidates</option>
                  <option>ICAN Skills Level Candidates</option>
                  <option>ICAN Professional Level Candidates</option>
                  <option>University &amp; Polytechnic Accounting Students</option>
                </select>
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
                placeholder="Share preferred campaign start date, subject list, bulk student discount or enquiry..."
                className="v-input text-xs resize-none"
              />
            </div>

            {/* Category-Specific Compliance Declaration */}
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

            {/* Live Cost Summary Bar */}
            <div className="rounded-2xl bg-[#0B0E11] border border-[#16C784]/30 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs">
                <p className="text-[#9AA4B2]">
                  {selectedCategory.label} · {cost.weeks} {cost.weeks === 1 ? 'week' : 'weeks'} ×{' '}
                  {formatNaira(cost.weeklyRate)}/week
                </p>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  {selectedPlacement.label} · Server-verified Paystack checkout inside VALENCE
                </p>
              </div>
              <span className="tabular-nums-display font-display text-2xl font-bold text-[#16C784]">
                {formatNaira(cost.totalAmount)}
              </span>
            </div>

            <button type="submit" className="v-btn-primary w-full py-3">
              <Send className="h-4 w-4" /> Submit {selectedCategory.label} Ad ({formatNaira(cost.totalAmount)})
            </button>
          </form>

          {/* Governance, Who Can Advertise & Analytics */}
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
                  'External online tuition is never advertised; all online tuition runs strictly inside VALENCE with VALENCE-verified tutors (AAT for ATSWA; AAT + ACA for ICAN).',
                  'Strict anti-piracy protection: textbook authors & vendors must supply genuine, copyright-compliant editions only.',
                  `Transparent flat rate of ${formatNaira(weeklyRate)} per week (admin-editable via the Admin Portal) paid via server-verified Paystack checkout.`,
                  '100% in-app workflow with clear Sponsored / Advertisement badges and live impressions, clicks & CTR analytics.',
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
                Already verified as a physical centre, textbook author or book vendor? Sign in to the{' '}
                <Link to="/portal/advertiser" className="text-[#16C784] font-semibold hover:underline">
                  VALENCE Advertiser Portal
                </Link>{' '}
                to extend running weeks, update creatives or download Paystack invoices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
