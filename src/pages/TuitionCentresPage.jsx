import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  BookOpen,
  Store,
  MapPin,
  Search,
  Megaphone,
  ShieldAlert,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MessageSquare,
  X,
  Send,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { formatNaira } from '../lib/pricing';

export default function TuitionCentresPage() {
  const { tuitionCentres, textbookAdvertisers, settings, submitInAppTicket } = usePlatform();
  const toast = useToast();

  const [directoryTab, setDirectoryTab] = useState('centres');
  const [search, setSearch] = useState('');
  const [progFilter, setProgFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [enquiryTarget, setEnquiryTarget] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({
    studentName: '',
    studentEmail: '',
    quantity: 1,
    deliveryLocation: '',
    message: '',
  });

  const activeList = directoryTab === 'centres' ? tuitionCentres : textbookAdvertisers;
  const weeklyRate = settings.adWeeklyRate || 10000;

  const availableStates = useMemo(
    () => Array.from(new Set(activeList.map((c) => c.state))).sort(),
    [activeList]
  );

  const filtered = useMemo(() => {
    return activeList.filter((c) => {
      if (progFilter !== 'ALL' && !c.programmes.some((p) => p.includes(progFilter))) return false;
      if (stateFilter !== 'ALL' && c.state !== stateFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.title && c.title.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q) ||
          c.subjects.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeList, search, progFilter, stateFilter]);

  const handlePartnerEnquiry = (e) => {
    e.preventDefault();
    if (!enquiryTarget) return;
    const ticket = submitInAppTicket('book-enq', {
      partnerId: enquiryTarget.id,
      partnerName: enquiryTarget.name,
      partnerType: enquiryTarget.type || 'Physical Tuition Centre',
      bookTitle: enquiryTarget.title || null,
      ...enquiryForm,
    });
    toast.success(
      `In-App Enquiry Sent (${ticket.id})`,
      `Delivered to ${enquiryTarget.name} inside VALENCE. You will receive the reply in your Student Portal.`
    );
    setEnquiryTarget(null);
    setEnquiryForm({
      studentName: '',
      studentEmail: '',
      quantity: 1,
      deliveryLocation: '',
      message: '',
    });
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">VERIFIED PARTNER DIRECTORY</Badge>
              <Badge variant="neutral">Physical Tuition Centres · Textbook Authors · Book Vendors</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
              Physical Tuition Centres, Textbook Authors &amp; Book Vendors
            </h1>
            <p className="text-sm text-[#9AA4B2]">
              Every listing here is a real, Admin-verified partner: <strong className="text-white">physical (in-person) tuition centres</strong> (whose verified per-level/per-course fees drive the physical tuition cost implication students unlock with the one-time ₦3,000 level fee),{' '}
              <strong className="text-white">accounting textbook authors</strong>, and{' '}
              <strong className="text-white">verified textbook vendors</strong> (with in-app student enquiries and optional Paystack checkout). All online tuition runs strictly in-app with VALENCE-verified tutors.
            </p>
          </div>
          <Link to="/advertise" className="v-btn-primary text-xs self-start shrink-0">
            <Megaphone className="h-4 w-4" /> Advertise In-App ({formatNaira(weeklyRate)}/Wk)
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="v-container space-y-6">
          {/* Directory Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-2xl bg-[#11161C] border border-white/[0.08] p-1.5 gap-1">
              <button
                type="button"
                onClick={() => {
                  setDirectoryTab('centres');
                  setStateFilter('ALL');
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-display font-bold transition-all ${
                  directoryTab === 'centres'
                    ? 'bg-[#E0A82E] text-[#06130D]'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                Physical Tuition Centres
                {tuitionCentres.length > 0 ? ` (${tuitionCentres.length})` : ''}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDirectoryTab('textbooks');
                  setStateFilter('ALL');
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-display font-bold transition-all ${
                  directoryTab === 'textbooks'
                    ? 'bg-[#E0A82E] text-[#06130D]'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Textbook Authors &amp; Vendors
                {textbookAdvertisers.length > 0 ? ` (${textbookAdvertisers.length})` : ''}
              </button>
            </div>

            <Link
              to="/programmes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E0A82E] hover:underline"
            >
              <GraduationCap className="h-4 w-4" />
              Want Online Classes? Join In-App Verified Tutors <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {activeList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    directoryTab === 'centres'
                      ? 'Search physical centre, city or paper...'
                      : 'Search author, bookshop or textbook subject...'
                  }
                  className="v-input pl-10 text-xs"
                />
              </div>
              <select
                value={progFilter}
                onChange={(e) => setProgFilter(e.target.value)}
                aria-label="Filter by programme"
                className="v-input text-xs"
              >
                <option value="ALL">All Programmes &amp; Levels</option>
                <option value="ATSWA">ATSWA</option>
                <option value="ICAN Foundation">ICAN Foundation</option>
                <option value="ICAN Skills">ICAN Skills</option>
                <option value="ICAN Professional">ICAN Professional</option>
                <option value="University">University &amp; Polytechnic</option>
              </select>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                aria-label="Filter by state"
                className="v-input text-xs"
              >
                <option value="ALL">All States</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="rounded-xl bg-[#11161C] border border-white/[0.07] p-3.5 flex items-start gap-2.5 text-xs text-[#9AA4B2]">
            <ShieldAlert className="h-4 w-4 text-[#E0A82E] shrink-0 mt-0.5" />
            <p>
              Zero placeholder listings: only real, Admin-verified partners appear here. Paid campaigns display <strong className="text-[#EA3943]">Sponsored</strong> or <strong className="text-[#EA3943]">Advertisement</strong> badges and comply with our{' '}
              <Link to="/legal/advertising" className="text-[#E0A82E] hover:underline">
                Advertising &amp; Anti-Piracy Policy
              </Link>
              .
            </p>
          </div>

          {activeList.length === 0 ? (
            /* Clean Verified Partner Onboarding Panel (Zero Fake Placeholder Cards) */
            <div className="v-card p-7 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="green">VERIFIED ONBOARDING OPEN</Badge>
                <Badge variant="neutral">{formatNaira(weeklyRate)} / Week · 100% In-App</Badge>
              </div>
              {directoryTab === 'centres' ? (
                <div className="space-y-3 max-w-2xl">
                  <h2 className="font-display text-2xl font-bold text-white">
                    Verified Physical Tuition Centre Slots Are Now Open Nationwide
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9AA4B2] leading-relaxed">
                    Operate a physical (in-person) ATSWA, ICAN, or accounting tutorial centre anywhere in Nigeria? Verify your lecture venue and publish your per-level/per-course tuition cost implication inside VALENCE at {formatNaira(weeklyRate)}/week. When students unlock a level&apos;s cost implication (₦3,000 one-time), your centre&apos;s exact verified fee structure and multi-paper discounts are displayed directly for comparison and in-app enquiry.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-w-2xl">
                  <h2 className="font-display text-2xl font-bold text-white">
                    Showcase Your Accounting Textbooks or Bookshop Directly Inside VALENCE
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9AA4B2] leading-relaxed">
                    Verified accounting textbook authors and genuine textbook vendors can advertise directly in-app at {formatNaira(weeklyRate)}/week. Every verified listing comes with built-in <strong className="text-white">in-app student enquiries</strong> plus <strong className="text-[#E0A82E]">optional in-app Paystack checkout</strong> so students can discover, ask questions, and order genuine editions without leaving VALENCE.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-4 space-y-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#E0A82E]" />
                  <p className="font-display font-bold text-white">Admin Verification</p>
                  <p className="text-[#9AA4B2]">
                    Physical venue confirmation for centres; copyright &amp; zero-piracy checks for authors and vendors.
                  </p>
                </div>
                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-4 space-y-1.5">
                  <MessageSquare className="h-4 w-4 text-[#E0A82E]" />
                  <p className="font-display font-bold text-white">In-App Student Enquiries</p>
                  <p className="text-[#9AA4B2]">
                    Students message and enquire directly inside VALENCE while you respond from your Advertiser Portal.
                  </p>
                </div>
                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-4 space-y-1.5">
                  <CreditCard className="h-4 w-4 text-[#E0A82E]" />
                  <p className="font-display font-bold text-white">Optional In-App Checkout</p>
                  <p className="text-[#9AA4B2]">
                    Textbook authors and vendors can opt in to Paystack checkout right on their VALENCE listing, or browse our{' '}
                    <Link to="/store" className="text-[#E0A82E] underline">
                      Study Store
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/advertise" className="v-btn-primary text-xs">
                  <Megaphone className="h-4 w-4" /> Apply &amp; Book In-App ({formatNaira(weeklyRate)}/Wk)
                </Link>
                <Link to="/portal/advertiser?mode=register" className="v-btn-secondary text-xs">
                  Create Advertiser Account <ArrowRight className="h-3.5 w-3.5 text-[#E0A82E]" />
                </Link>
                <Link to="/store" className="v-btn-secondary text-xs">
                  Visit VALENCE Study Materials Store
                </Link>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="v-card p-10 text-center text-sm text-[#9AA4B2]">
              No verified listing matches your current filter. Reset filters or try another keyword.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((item) => {
                const ItemIcon =
                  directoryTab === 'centres'
                    ? Building2
                    : item.type === 'Textbook Author'
                    ? BookOpen
                    : Store;
                return (
                  <div key={item.id} className="v-card-hover p-6 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.verified && (
                            <Badge variant="verified">
                              {directoryTab === 'centres'
                                ? 'Verified Physical Centre'
                                : `Verified ${item.type}`}
                            </Badge>
                          )}
                          {item.schedule && <Badge variant="neutral">{item.schedule}</Badge>}
                        </div>
                        {item.sponsored && <Badge variant="sponsored">{item.adLabel}</Badge>}
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B0E11] border border-white/[0.08] text-[#E0A82E]">
                          <ItemIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="font-display text-lg font-bold text-white">{item.name}</h2>
                          {item.title && (
                            <p className="text-xs font-semibold text-[#E0A82E] mt-0.5 leading-snug">
                              {item.title}
                            </p>
                          )}
                          <p className="text-xs text-[#9AA4B2] inline-flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-[#E0A82E]" /> {item.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-[#9AA4B2]">{item.description}</p>
                      {directoryTab === 'centres' && (
                        <div className="rounded-xl bg-[#0B0E11] border border-[#E0A82E]/25 p-3 flex items-center justify-between gap-2 text-[11px]">
                          <span className="text-[#C2C9D4]">
                            Centre Cost Implication (set directly by {item.name})
                          </span>
                          <Link
                            to="/portal/student?apply=tuition"
                            className="font-display font-bold text-[#E0A82E] hover:underline shrink-0"
                          >
                            Unlock (₦3,000) →
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-white/[0.06] pt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setEnquiryTarget(item)}
                        className="v-btn-secondary text-xs py-2 px-3"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-[#E0A82E]" /> Enquire In-App
                      </button>
                      {item.inAppCheckoutEnabled && item.price && (
                        <button
                          type="button"
                          onClick={() =>
                            toast.info(
                              `Paystack Checkout: ${formatNaira(item.price)}`,
                              'Server-verified partner textbook checkout connects in Phase 8 & Phase 15.'
                            )
                          }
                          className="v-btn-primary text-xs py-2 px-3"
                        >
                          <CreditCard className="h-3.5 w-3.5" /> Buy In-App ({formatNaira(item.price)})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* In-App Partner / Author / Vendor Enquiry Modal */}
      {enquiryTarget && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setEnquiryTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handlePartnerEnquiry}
            className="v-card max-w-lg w-full p-6 space-y-4 animate-fade-up"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant="green">IN-APP PARTNER ENQUIRY</Badge>
                <h3 className="mt-1 font-display text-lg font-bold text-white">
                  {enquiryTarget.name}
                </h3>
                {enquiryTarget.title && (
                  <p className="text-xs text-[#E0A82E]">{enquiryTarget.title}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setEnquiryTarget(null)}
                aria-label="Close modal"
                className="rounded-lg p-1 text-[#9AA4B2] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={enquiryForm.studentName}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, studentName: e.target.value })}
                placeholder="Your full name"
                className="v-input text-xs"
              />
              <input
                type="email"
                required
                value={enquiryForm.studentEmail}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, studentEmail: e.target.value })}
                placeholder="you@example.com"
                className="v-input text-xs"
              />
            </div>
            <input
              type="text"
              required
              value={enquiryForm.deliveryLocation}
              onChange={(e) => setEnquiryForm({ ...enquiryForm, deliveryLocation: e.target.value })}
              placeholder="Your campus / city & state"
              className="v-input text-xs"
            />
            <textarea
              rows={3}
              required
              value={enquiryForm.message}
              onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
              placeholder="Ask about availability, edition, delivery, or class schedule..."
              className="v-input text-xs resize-none"
            />
            <button type="submit" className="v-btn-primary w-full text-xs py-2.5">
              <Send className="h-3.5 w-3.5" /> Send In-App Enquiry
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
