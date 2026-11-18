import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Scale, ShieldCheck, CreditCard, Megaphone, Mail, Clock } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

const LEGAL_TABS = [
  { id: 'terms', label: 'Terms of Service', icon: Scale },
  { id: 'privacy', label: 'Privacy Policy (NDPA)', icon: ShieldCheck },
  { id: 'refunds', label: 'Payments, Refunds & Delivery', icon: CreditCard },
  { id: 'advertising', label: 'Advertising & Anti-Piracy Policy', icon: Megaphone },
];

export default function LegalPage() {
  const { section } = useParams();
  const navigate = useNavigate();
  const { settings } = usePlatform();

  const initial = LEGAL_TABS.some((t) => t.id === section) ? section : 'terms';
  const [active, setActive] = useState(initial);

  useEffect(() => {
    if (section && LEGAL_TABS.some((t) => t.id === section)) {
      setActive(section);
    }
  }, [section]);

  const selectTab = (id) => {
    setActive(id);
    navigate(`/legal/${id}`, { replace: true });
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-16">
        <div className="v-container space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="green">LEGAL, COMPLIANCE &amp; PAYSTACK POLICIES</Badge>
            <Badge variant="neutral">Nigeria Data Protection Act (NDPA) Aligned</Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            VALENCE Terms, Privacy, Refund &amp; Advertising Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#9AA4B2]">
            Effective across all VALENCE web and Progressive Web App services in the Federal Republic of Nigeria. Policies are maintained via the VALENCE Admin Portal and reviewed regularly for regulatory and Paystack merchant compliance.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {LEGAL_TABS.map((tab) => {
              const TIcon = tab.icon;
              const isSelected = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-display font-bold border transition-all ${
                    isSelected
                      ? 'bg-[#16C784] text-[#06130D] border-[#16C784]'
                      : 'bg-[#11161C] text-[#C2C9D4] border-white/[0.08] hover:text-white'
                  }`}
                >
                  <TIcon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="v-container max-w-4xl space-y-6">
          {active === 'terms' && (
            <article className="v-card p-6 sm:p-8 space-y-5 text-xs sm:text-sm leading-relaxed text-[#C2C9D4]">
              <h2 className="font-display text-2xl font-bold text-white">1. Terms of Service</h2>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  1.1 Platform Independence &amp; Scope
                </h3>
                <p>
                  VALENCE ({settings.tagline}) is an independent educational technology, networking, inter-school academic competition, bookstore, and partner directory platform operating in Nigeria. VALENCE is not the Institute of Chartered Accountants of Nigeria (ICAN) or ATSWA; official examination registration, exemption approval, syllabus regulation, and charter conferment rest solely with ICAN.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  1.2 Free Membership &amp; In-App Online Tuition
                </h3>
                <p>
                  Creating a student, university, polytechnic, college, general learner, or professional account on VALENCE is free. All online ATSWA and ICAN tuition offered on VALENCE is delivered strictly inside the platform by tutors manually verified by VALENCE (holding a minimum verified AAT certificate for ATSWA subjects, and both verified AAT and ACA certificates for ICAN subjects, alongside passing VALENCE&apos;s timed qualification assessment).
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  1.3 Examination Schedules, Exemption Estimates &amp; AI Tools
                </h3>
                <p>
                  Diet dates, timetables, 7-day registration cutoffs, and 30-day provisional result countdowns are maintained by the VALENCE Central Examination Authority and updated whenever the Institute revises official dates. Exemption guide outputs and AI study explanations are educational aids and do not replace official ICAN confirmations.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  1.4 National Inter-School Challenge &amp; ₦50,000 Merit Cash Reward
                </h3>
                <p>
                  The VALENCE National Inter-School Challenge and examination divisions (featuring questions drawn from accounting and related disciplines including finance, auditing, taxation, economics, business law, quantitative methods, and management) enforce timed submission rules, anti-malpractice verification, and moderator review. The ₦50,000 post-competition cash reward is disbursed to verified winning learners after official results and any appeals review close. Impersonation, collusion, or plagiarism leads to immediate disqualification.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  1.5 Community Conduct &amp; Communications Safety
                </h3>
                <p>
                  Users on VALENCE CONNECT, discussion forums, direct messaging, and WebRTC voice/video calls must uphold respectful professional conduct. Harassment, exam leakage, spam, unsolicited cold solicitation, and impersonation of verified professionals or institutions result in account suspension under the laws of the Federal Republic of Nigeria.
                </p>
              </div>
            </article>
          )}

          {active === 'privacy' && (
            <article className="v-card p-6 sm:p-8 space-y-5 text-xs sm:text-sm leading-relaxed text-[#C2C9D4]">
              <h2 className="font-display text-2xl font-bold text-white">
                2. Privacy Policy (Nigeria Data Protection Act Aligned)
              </h2>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  2.1 Information We Collect
                </h3>
                <p>
                  We collect account registration details (name, email address, phone number, institution, and learner/professional category), study progress, order and delivery addresses, Paystack transaction references (VALENCE never stores raw debit/credit card numbers), community content, and verification documents voluntarily submitted for ATSWA guidance, tutor approval, professional badges, or advertiser verification.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  2.2 Private Storage &amp; Row-Level Security
                </h3>
                <p>
                  Sensitive academic and professional credentials (such as AAT/ACA certificates, O&apos;Level/ND documents, and verification IDs) are stored in private, access-controlled cloud buckets protected by strict Row-Level Security (RLS) and viewable only by the submitting user and authorised verification administrators.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  2.3 Zero Sale of Student Data to Advertisers
                </h3>
                <p>
                  VALENCE never sells, rents, or exposes private student contact lists to external physical tuition centres, textbook authors, or textbook vendors. Advertisers receive aggregated campaign metrics (impressions, clicks, and CTR) and only see individual student details when a student voluntarily submits an in-app enquiry or optional in-app textbook order.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  2.4 Your NDPA Rights
                </h3>
                <p>
                  Under the Nigeria Data Protection Act (NDPA), you may request access to, correction of, export of, or deletion of your personal data, update profile and messaging privacy controls in your portal settings, or contact our Data &amp; Support Desk 24/7 at{' '}
                  <a href={`mailto:${settings.email}`} className="text-[#16C784] underline">
                    {settings.email}
                  </a>
                  .
                </p>
              </div>
            </article>
          )}

          {active === 'refunds' && (
            <article className="v-card p-6 sm:p-8 space-y-5 text-xs sm:text-sm leading-relaxed text-[#C2C9D4]">
              <h2 className="font-display text-2xl font-bold text-white">
                3. Payments, Refunds &amp; Delivery Policy
              </h2>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  3.1 Exclusive Paystack Online Checkout
                </h3>
                <p>
                  All online payments on VALENCE (tuition application level unlocks, online tuition, per-course past questions, study packs, optional advertised textbook orders, and ₦10,000/week advertising campaigns) are processed in Nigerian Naira (NGN) exclusively through Paystack and verified server-side before entitlements are activated.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  3.2 ₦3,000 Per-Level Tuition Application Unlock
                </h3>
                <p>
                  The one-time ₦3,000 fee applies strictly when unlocking tuition cost implications and applying for tuition for a specific ATSWA or ICAN level. Unlocking reveals VALENCE&apos;s verified in-app online tuition breakdown alongside the physical tuition cost implications set directly by verified physical tuition centres advertising on VALENCE (so physical tuition cost implications reflect each advertising centre&apos;s published fee structure), plus official examination and subscription breakdowns. Once unlocked, a level stays permanently unlocked for your account (never charged twice). Because digital access is delivered immediately upon verification, completed level unlocks are non-refundable except in verified duplicate-debit errors, which are refunded within 5 to 7 business days.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  3.3 Online Tuition Refunds
                </h3>
                <p>
                  Enrolled online tuition candidates who request cancellation before live diet classes begin (or within 48 hours of payment prior to attending live classes or downloading restricted materials) are eligible for a refund less statutory payment processing charges, or a full credit transfer to the next examination diet.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  3.4 Study Materials Store, Per-Course Orders &amp; Delivery
                </h3>
                <p>
                  Past questions are sold per individual course (ATSWA ₦5,500/course with automatic 9% off 2+; ICAN ₦9,000/course with automatic 6% off 2+) and are delivered the <strong>same day within Lagos</strong> (including free campus delivery to LASU, Ojo, UNILAG, YABATECH, FCE, and Yaba) and within <strong>1 day (next day) outside Lagos</strong> across Nigeria. Study Packs (ATSWA ₦9,500/pack, 5% off 2+; ICAN ₦10,000 to ₦15,500/course, 7% off 2+ distinct courses) display a live availability indicator updated directly by VALENCE administrators and are delivered when available. If a delivered material is damaged in transit or differs from the course code ordered, report it via the In-App Store &amp; Delivery Desk within 72 hours of receipt for a free replacement or full refund.
                </p>
              </div>
            </article>
          )}

          {active === 'advertising' && (
            <article className="v-card p-6 sm:p-8 space-y-5 text-xs sm:text-sm leading-relaxed text-[#C2C9D4]">
              <h2 className="font-display text-2xl font-bold text-white">
                4. Advertising, Author/Vendor Sales &amp; Anti-Piracy Policy
              </h2>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  4.1 Eligible Advertisers (₦10,000/Week In-App)
                </h3>
                <p>
                  VALENCE ADVERTISE accepts campaigns strictly from three verified groups at ₦10,000 per week (configurable via the Admin Portal): (a) verified physical (in-person) accounting tuition centres with confirmed Nigerian classroom addresses, (b) legitimate accounting textbook authors selling original publications, and (c) verified textbook vendors and bookshops selling genuine editions. External online tuition providers are not eligible, as all online tuition on VALENCE is taught in-app by VALENCE-verified tutors.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  4.2 In-App Enquiries &amp; Optional In-App Paystack Checkout
                </h3>
                <p>
                  Verified textbook authors and textbook vendors advertising at ₦10,000/week receive built-in in-app student enquiry handling and may opt in to in-app Paystack checkout so students can inspect, enquire about, and order genuine textbooks safely without leaving VALENCE.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-[#16C784]">
                  4.3 Zero-Piracy, Truthful Claims &amp; Sponsored Labelling
                </h3>
                <p>
                  Every paid placement displays a clear Sponsored or Advertisement label. Photocopied, pirated, or unlicensed textbooks, misleading pass-rate promises, and false claims of ICAN, ATSWA, or VALENCE accreditation are strictly prohibited and result in immediate campaign removal without refund if violated after activation. Campaigns declined during pre-launch Admin review receive a full refund or free creative revision.
                </p>
              </div>
            </article>
          )}

          {/* Support Footer Card */}
          <div className="v-glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-display text-sm font-bold text-white">
                Questions about compliance, privacy, refunds or advertising?
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[#9AA4B2]">
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-1.5 text-[#16C784] hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" /> {settings.email}
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#16C784]" /> Operating hours: {settings.operatingHours}
                </span>
              </div>
            </div>
            <Link to="/contact" className="v-btn-secondary text-xs shrink-0">
              Contact Support Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
