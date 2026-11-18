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
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { calculateAdCampaignCost, formatNaira } from '../lib/pricing';

const AD_PLACEMENTS = [
  { id: 'home-banner', label: 'Homepage Promotional Banner' },
  { id: 'ican-sponsored', label: 'Sponsored ICAN Physical Centre Listing' },
  { id: 'atswa-sponsored', label: 'Sponsored ATSWA Physical Centre Listing' },
  { id: 'student-dash', label: 'Student Dashboard Placement' },
  { id: 'connect-post', label: 'Sponsored VALENCE CONNECT Post' },
  { id: 'featured-centre', label: 'Featured Physical Tuition Centre Card' },
  { id: 'learn-slot', label: 'Learning Section Placement' },
  { id: 'revision-workshop', label: 'In-Person Revision Workshop Promotion' },
  { id: 'pro-training', label: 'Physical Professional Training Announcement' },
];

const QUICK_DURATIONS = [1, 2, 4, 8, 12];

export default function AdvertisePage() {
  const { settings, submitInAppTicket } = usePlatform();
  const toast = useToast();

  const weeklyRate = settings.adWeeklyRate || 10000;
  const [weeks, setWeeks] = useState(1);
  const [selectedPlacementId, setSelectedPlacementId] = useState('featured-centre');
  const [physicalOnlyConfirmed, setPhysicalOnlyConfirmed] = useState(true);
  const [campaign, setCampaign] = useState({
    centreName: '',
    streetAddress: '',
    contactEmail: '',
    contactPhone: '',
    cityState: 'Lagos',
    classSchedule: 'Weekday & Weekend Physical Classes',
    targetAudience: 'ATSWA & ICAN Candidates (All Levels)',
    headline: '',
    notes: '',
  });
  const [submittedRef, setSubmittedRef] = useState(null);

  const cost = useMemo(
    () => calculateAdCampaignCost(weeks, weeklyRate, 1),
    [weeks, weeklyRate]
  );

  const selectedPlacement =
    AD_PLACEMENTS.find((p) => p.id === selectedPlacementId) || AD_PLACEMENTS[0];

  const handleCampaignSubmit = (e) => {
    e.preventDefault();
    if (!physicalOnlyConfirmed) {
      toast.warning(
        'Physical Centre Confirmation Required',
        'VALENCE ADVERTISE exclusively promotes verified physical (in-person) tuition centres.'
      );
      return;
    }
    const record = submitInAppTicket('advertise', {
      ...campaign,
      mode: 'Physical Tuition Only',
      placement: selectedPlacement.label,
      weeks: cost.weeks,
      weeklyRate: cost.weeklyRate,
      totalAmount: cost.totalAmount,
    });
    setSubmittedRef(record.id);
    toast.success(
      `Physical Centre Campaign Logged (${record.id})`,
      `${cost.weeks} week(s) × ${formatNaira(cost.weeklyRate)} = ${formatNaira(cost.totalAmount)} · Pending Admin physical-venue verification & Paystack billing.`
    );
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Hero — Strictly Physical Tuition Centres @ ₦10,000 / Week */}
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">VALENCE ADVERTISE · PHYSICAL CENTRES ONLY</Badge>
              <Badge variant="neutral">100% In-App · Paystack Verified</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              Advertise Your Physical Tuition Centre for{' '}
              <span className="text-[#16C784]">{formatNaira(weeklyRate)}/Week</span>
            </h1>
            <p className="text-sm sm:text-base text-[#9AA4B2]">
              VALENCE exclusively lists and promotes verified{' '}
              <strong className="text-white">physical (in-person) accounting tuition centres</strong>{' '}
              across Nigeria — so candidates can find trusted lecture venues in their city. All online tuition on VALENCE is delivered strictly in-app by tutors verified directly by VALENCE.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#campaign-builder" className="v-btn-primary text-xs">
                <Megaphone className="h-4 w-4" /> Book Physical Centre Ad ({formatNaira(weeklyRate)}/wk)
              </a>
              <Link to="/portal/advertiser?mode=register" className="v-btn-secondary text-xs">
                Advertiser Portal Login / Signup <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
              </Link>
              <Link to="/portal/tutor?mode=register" className="v-btn-secondary text-xs">
                Teach Online? Apply as a Verified Tutor →
              </Link>
            </div>
          </div>

          {/* Transparent Weekly Rate Card */}
          <div className="lg:col-span-5 v-glass-card p-6 sm:p-7 border-[#16C784]/35 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16C784]">
                Physical Tuition Centre Ad Rate
              </span>
              <Badge variant="verified">In-Person Only</Badge>
            </div>
            <div className="rounded-2xl bg-[#0B0E11] border border-[#16C784]/30 p-5 text-center space-y-1">
              <p className="font-display text-4xl sm:text-5xl font-bold text-[#16C784] tabular-nums-display">
                {formatNaira(weeklyRate)}
              </p>
              <p className="text-xs font-semibold text-white">
                Per Week · Verified Physical Tuition Centres Only
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-[#C2C9D4]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                <span>Strictly for bricks-and-mortar / in-person tutorial centres with verified physical lecture addresses</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                <span>100% in-app booking, creative upload, Paystack billing ({formatNaira(weeklyRate)}/wk) & live CTR analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                <span>External online classes are not advertised — online tuition runs exclusively in-app via VALENCE-verified tutors</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive In-App Campaign Builder & Physical Centre Application */}
      <section id="campaign-builder" className="py-14 sm:py-18">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleCampaignSubmit} className="lg:col-span-7 v-card p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  In-App Physical Tuition Centre Ad Booking
                </h2>
                <p className="text-xs text-[#9AA4B2] mt-0.5">
                  Submit your physical lecture centre details & weekly campaign directly inside VALENCE — verified by Admin and activated via Paystack.
                </p>
              </div>
              <Badge variant="green">{formatNaira(weeklyRate)} / Week</Badge>
            </div>

            {submittedRef && (
              <div className="rounded-xl bg-[#16C784]/10 border border-[#16C784]/35 p-4 text-xs text-[#E5E9F0] space-y-1">
                <p className="font-bold text-[#16C784]">
                  Campaign Reference {submittedRef} Submitted In-App
                </p>
                <p className="text-[#C2C9D4]">
                  Total: <strong>{formatNaira(cost.totalAmount)}</strong> ({cost.weeks}{' '}
                  {cost.weeks === 1 ? 'week' : 'weeks'} on {selectedPlacement.label} · Physical Tuition Only). Continue in your{' '}
                  <Link to="/portal/advertiser" className="text-[#16C784] underline font-semibold">
                    Advertiser Portal
                  </Link>{' '}
                  for physical-address verification, Paystack payment and live analytics.
                </p>
              </div>
            )}

            {/* Duration Selector */}
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

            {/* Placement Slot Selector */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="v-label" htmlFor="ad-centre">Physical Tuition Centre Name</label>
                <input
                  id="ad-centre"
                  type="text"
                  required
                  value={campaign.centreName}
                  onChange={(e) => setCampaign({ ...campaign, centreName: e.target.value })}
                  placeholder="e.g. Prime Ledger School of Accountancy"
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
              <label className="v-label flex items-center gap-1.5" htmlFor="ad-address">
                <MapPin className="h-3.5 w-3.5 text-[#16C784]" /> Full Physical Lecture Venue Address (Required)
              </label>
              <input
                id="ad-address"
                type="text"
                required
                value={campaign.streetAddress}
                onChange={(e) => setCampaign({ ...campaign, streetAddress: e.target.value })}
                placeholder="Street number, building, bus-stop / landmark, LGA & State"
                className="v-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="v-label" htmlFor="ad-email">Official Centre Email</label>
                <input
                  id="ad-email"
                  type="email"
                  required
                  value={campaign.contactEmail}
                  onChange={(e) => setCampaign({ ...campaign, contactEmail: e.target.value })}
                  placeholder="admissions@yourcentre.ng"
                  className="v-input text-xs"
                />
              </div>
              <div>
                <label className="v-label" htmlFor="ad-phone">Centre Contact Phone</label>
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
                <label className="v-label" htmlFor="ad-sched">In-Person Class Schedule</label>
                <select
                  id="ad-sched"
                  value={campaign.classSchedule}
                  onChange={(e) => setCampaign({ ...campaign, classSchedule: e.target.value })}
                  className="v-input text-xs"
                >
                  <option>Weekday &amp; Weekend Physical Classes</option>
                  <option>Weekend Intensive Physical Classes</option>
                  <option>Weekday Daytime / Evening Physical Classes</option>
                </select>
              </div>
              <div>
                <label className="v-label" htmlFor="ad-target">Target Candidate Audience</label>
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
              <label className="v-label" htmlFor="ad-headline">Campaign Headline (Physical Classes Only)</label>
              <input
                id="ad-headline"
                type="text"
                required
                value={campaign.headline}
                onChange={(e) => setCampaign({ ...campaign, headline: e.target.value })}
                placeholder="e.g. May 2027 ICAN Skills & Professional Physical Weekend Lectures — Yaba"
                className="v-input text-xs"
              />
            </div>

            <div>
              <label className="v-label" htmlFor="ad-notes">
                Papers Taught &amp; Facility Notes (Optional)
              </label>
              <textarea
                id="ad-notes"
                rows={2}
                value={campaign.notes}
                onChange={(e) => setCampaign({ ...campaign, notes: e.target.value })}
                placeholder="List physical papers taught, classroom capacity, preferred start week or enquiry..."
                className="v-input text-xs resize-none"
              />
            </div>

            {/* Mandatory Physical-Only Policy Confirmation */}
            <label className="flex items-start gap-2.5 rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3.5 text-xs text-[#C2C9D4] cursor-pointer">
              <input
                type="checkbox"
                checked={physicalOnlyConfirmed}
                onChange={(e) => setPhysicalOnlyConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#16C784] rounded shrink-0"
              />
              <span>
                We confirm that our centre operates a verifiable <strong className="text-white">physical lecture venue</strong> and this advertisement promotes <strong className="text-white">in-person physical tuition only</strong> (no external online classes).
              </span>
            </label>

            {/* Live Cost Summary Bar */}
            <div className="rounded-2xl bg-[#0B0E11] border border-[#16C784]/30 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs">
                <p className="text-[#9AA4B2]">
                  {selectedPlacement.label} · {cost.weeks} {cost.weeks === 1 ? 'week' : 'weeks'} ×{' '}
                  {formatNaira(cost.weeklyRate)}/week
                </p>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Admin physical-venue verification + server-verified Paystack checkout inside VALENCE
                </p>
              </div>
              <span className="tabular-nums-display font-display text-2xl font-bold text-[#16C784]">
                {formatNaira(cost.totalAmount)}
              </span>
            </div>

            <button type="submit" className="v-btn-primary w-full py-3">
              <Send className="h-4 w-4" /> Submit Physical Centre Ad ({formatNaira(cost.totalAmount)})
            </button>
          </form>

          {/* Governance, Policy & Analytics */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
            <div className="v-card p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#16C784]">
                <BarChart3 className="h-5 w-5" />
                <h2 className="font-display text-xl font-bold text-white">
                  Physical-Only Advertising Rules
                </h2>
              </div>
              <ul className="space-y-2.5 text-xs text-[#9AA4B2]">
                {[
                  'Strictly for verified physical (in-person) accounting tuition centres with real Nigerian lecture addresses.',
                  'External online tuition ads are rejected — all online tuition runs natively inside VALENCE by VALENCE-verified tutors (AAT for ATSWA; AAT + ACA for ICAN).',
                  `Flat rate of ${formatNaira(weeklyRate)} per week (configurable anytime via the Admin Portal) with server-verified Paystack billing.`,
                  '100% in-app onboarding, creative review, Sponsored labelling, live impressions, clicks & CTR tracking.',
                  'False claims of official ICAN, ATSWA or VALENCE accreditation are strictly prohibited.',
                  'Student private records are never shared and unsolicited direct messages are blocked.',
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
                Already a verified physical tuition centre? Sign in to the{' '}
                <Link to="/portal/advertiser" className="text-[#16C784] font-semibold hover:underline">
                  Physical Centre Advertiser Portal
                </Link>{' '}
                to extend running weeks, swap approved banners or download Paystack invoices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
