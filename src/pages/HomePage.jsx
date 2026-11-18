import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Users,
  Trophy,
  Briefcase,
  ShoppingBag,
  Megaphone,
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Award,
  MessageCircle,
  ExternalLink,
  Heart,
  MessageSquare,
  Bookmark,
  MapPin,
  Clock,
  Scale,
  Plus,
  Video,
  Flame,
  TrendingUp,
  Lock,
  Building2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import CountdownTimer from '../components/ui/CountdownTimer';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import { formatNaira } from '../lib/pricing';

const PILLAR_ICONS = {
  learn: BookOpen,
  connect: Users,
  compete: Trophy,
  professional: Briefcase,
  marketplace: ShoppingBag,
  advertise: Megaphone,
  opportunities: Sparkles,
};

const AI_TUTOR_STEPS = [
  { step: '01', label: 'Interpret the Question', detail: 'Unpacks examiner verbs, reporting dates & mark allocation.' },
  { step: '02', label: 'Identify Relevant Topic', detail: 'Maps straight to the exact ATSWA or ICAN 2026 syllabus unit.' },
  { step: '03', label: 'Explain Principles / Standards', detail: 'Cites applicable IFRS, IAS, IPSAS, CAMA or Finance Act rules.' },
  { step: '04', label: 'Step-by-Step Calculations', detail: 'Structured W1, W2, W3 examination schedules & ledgers.' },
  { step: '05', label: 'Present Final Answer', detail: 'Clean statement layout ready for real examination booklets.' },
  { step: '06', label: 'Examination Presentation', detail: 'Shows marker-friendly formatting, headings & time split.' },
  { step: '07', label: 'Common Mistakes Alert', detail: 'Flags frequent candidate traps that cost easy marks.' },
];

export default function HomePage() {
  const {
    isHydrating,
    settings,
    sessions,
    atswaLevels,
    icanLevels,
    products,
    pillars,
    tuitionCentres,
    tutors,
    opportunities,
    events,
    announcements,
    testimonials,
    statistics,
    faqs,
    competitionDivisions,
    tertiaryDisciplines,
    generalLearnerTracks,
    professionalQualifications,
    addToCart,
    openWhatsAppModal,
  } = usePlatform();
  const toast = useToast();

  const [activeSessionIdx, setActiveSessionIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [announcementFilter, setAnnouncementFilter] = useState('all');

  const activeSession = sessions[activeSessionIdx] || sessions[0];

  // Curated 4 store spotlight products spanning ATSWA & ICAN
  const featuredProducts = [
    products.find((p) => p.courseCode === 'FR'),
    products.find((p) => p.courseCode === 'SBR'),
    products.find((p) => p.id === 'prod-ican-pq-skl'),
    products.find((p) => p.id === 'prod-atswa-sp-1'),
  ].filter(Boolean);

  const visibleAnnouncements = announcements.filter((a) => {
    if (announcementFilter === 'official') return a.isOfficial;
    if (announcementFilter === 'community') return !a.isOfficial;
    return true;
  });

  const handleBookmark = (ann) => {
    const exists = bookmarkedIds.includes(ann.id);
    setBookmarkedIds((prev) => (exists ? prev.filter((x) => x !== ann.id) : [...prev, ann.id]));
    toast.info(
      exists ? 'Removed Bookmark' : 'Announcement Saved',
      exists
        ? `"${ann.title.slice(0, 44)}..." removed from reading list.`
        : 'Sign in when Phase 2 Auth activates to sync bookmarks across devices.'
    );
  };

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    toast.success('Added to VALENCE Cart', `${product.title} (${formatNaira(product.price)})`);
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-grid-fintech pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Ambient fintech radial glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 h-[420px] w-[780px] rounded-full bg-[#16C784]/12 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-[260px] w-[380px] rounded-full bg-[#16C784]/6 blur-[110px]"
        />

        <div className="v-container relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-6 animate-fade-up">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-[#11161C] border border-[#16C784]/25 px-3.5 py-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-[#16C784] animate-pulse-soft" />
                <span className="font-semibold text-[#F4F6F9]">{settings.operatorName}</span>
                <span className="text-white/20">•</span>
                <span className="italic text-[#16C784]">{settings.tagline}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold leading-[1.08] tracking-tight text-white">
                Your Learning. Your Connections.{' '}
                <span className="text-[#16C784]">Your Competition.</span> Your Professional Future.
              </h1>

              <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#9AA4B2] max-w-2xl">
                {settings.heroSubcopy}
              </p>

              {/* Primary CTA Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/portal/student" className="v-btn-primary px-6 py-3">
                  <GraduationCap className="h-4 w-4" />
                  Student Portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/portal/professional" className="v-btn-secondary px-5 py-3">
                  <Briefcase className="h-4 w-4 text-[#16C784]" />
                  Professional Portal
                </Link>
                <Link to="/connect" className="v-btn-secondary px-5 py-3">
                  <Users className="h-4 w-4 text-[#16C784]" />
                  Join VALENCE Connect
                </Link>
              </div>

              {/* Secondary Prominent Portal Pill Row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-medium text-[#9AA4B2]">
                <Link
                  to="/competitions"
                  className="inline-flex items-center gap-1.5 hover:text-[#16C784] transition-colors"
                >
                  <Trophy className="h-3.5 w-3.5 text-[#16C784]" />
                  Register for Competitions
                </Link>
                <Link
                  to="/portal/tutor"
                  className="inline-flex items-center gap-1.5 hover:text-[#16C784] transition-colors"
                >
                  <Award className="h-3.5 w-3.5 text-[#16C784]" />
                  Apply as a Tutor
                </Link>
                <Link
                  to="/advertise"
                  className="inline-flex items-center gap-1.5 hover:text-[#16C784] transition-colors"
                >
                  <Megaphone className="h-3.5 w-3.5 text-[#16C784]" />
                  Advertise Your Tuition Centre
                </Link>
              </div>
            </div>

            {/* Right Interactive Examination Diet & Ecosystem Command Card */}
            <div className="lg:col-span-5">
              <div className="v-glass-card p-5 sm:p-6 space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img src="/valence-mark-sm.png" alt="" className="h-6 w-6 object-contain" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA4B2]">
                      Live Diet Calendar
                    </span>
                  </div>
                  <Badge variant="green">Registration Open</Badge>
                </div>

                {/* Diet Switcher — Strictly separates ATSWA (March/Sept) & ICAN (May/Nov) */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#0B0E11] p-1 border border-white/[0.07]">
                  {sessions.slice(0, 2).map((sess, idx) => (
                    <button
                      key={sess.id}
                      type="button"
                      onClick={() => setActiveSessionIdx(idx)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                        activeSessionIdx === idx
                          ? 'bg-[#16C784] text-[#06130D] shadow-glow-sm'
                          : 'text-[#9AA4B2] hover:text-white'
                      }`}
                    >
                      {sess.programme} · {sess.diet} {sess.year}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-2.5">
                    <h2 className="font-display text-lg font-bold text-white">
                      {activeSession.label}
                    </h2>
                    <span className="text-xs text-[#9AA4B2]">{activeSession.examWindow}</span>
                  </div>
                  <CountdownTimer targetDate={activeSession.examStartDate} />
                </div>

                {/* Key Session Milestones */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-xl bg-[#0B0E11]/90 border border-white/[0.06] p-3">
                    <span className="text-[#667085] block text-[11px]">Lectures Commence</span>
                    <span className="mt-0.5 block font-semibold text-[#F4F6F9]">
                      {activeSession.tuitionCommencement}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11]/90 border border-white/[0.06] p-3">
                    <span className="text-[#667085] block text-[11px]">Registration Closes</span>
                    <span className="mt-0.5 block font-semibold text-[#EA3943]">
                      {activeSession.registrationClose}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11]/90 border border-white/[0.06] p-3">
                    <span className="text-[#667085] block text-[11px]">One-Time Level Unlock</span>
                    <span className="mt-0.5 block tabular-nums-display font-bold text-[#16C784]">
                      ₦3,000 <span className="text-[10px] font-normal text-[#9AA4B2]">/ level</span>
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11]/90 border border-white/[0.06] p-3">
                    <span className="text-[#667085] block text-[11px]">Tuition Discount</span>
                    <span className="mt-0.5 block tabular-nums-display font-bold text-[#16C784]">
                      25% OFF{' '}
                      <span className="text-[10px] font-normal text-[#9AA4B2]">
                        {activeSession.programme === 'ATSWA' ? '(2+ courses)' : '(3+ courses)'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <Link
                    to={activeSession.programme === 'ATSWA' ? '/programmes/atswa' : '/programmes/ican'}
                    className="v-btn-primary w-full"
                  >
                    Calculate {activeSession.programme} Tuition & Enrol
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <p className="text-[11px] text-center text-[#667085]">
                  ATSWA diets: <span className="text-[#9AA4B2]">March & September</span> · ICAN diets:{' '}
                  <span className="text-[#9AA4B2]">May & November</span> · Checkout via{' '}
                  <span className="text-[#16C784] font-medium">Paystack</span>
                </p>
              </div>
            </div>
          </div>

          {/* 17. STATISTICS & ACHIEVEMENTS BAR (Animated Counters) */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {statistics.map((stat) => (
              <div key={stat.id} className="v-card p-4 hover:border-white/[0.14]">
                <div className="text-2xl sm:text-3xl font-bold text-[#16C784]">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-xs font-semibold text-[#F4F6F9]">{stat.label}</p>
                <p className="mt-0.5 text-[11px] text-[#667085] leading-snug">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ABOUT VALENCE & SEVEN ECOSYSTEM PILLARS */}
      <section id="about-valence" className="py-16 sm:py-22">
        <div className="v-container space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                About VALENCE · {settings.operatorName}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Seven Integrated Pillars. One Serious Accounting Institution.
              </h2>
              <p className="text-sm sm:text-base text-[#9AA4B2]">
                Guided by <span className="italic text-[#F4F6F9]">{settings.tagline}</span>, VALENCE unites professional exam tuition, intelligent AI assistance, academic networking, national tournaments, verified credentials, study resources and career mobility across Nigeria.
              </p>
            </div>
            <Link to="/about" className="v-btn-secondary self-start lg:self-auto shrink-0">
              Explore Our Charter <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isHydrating ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pillars.map((pillar, idx) => {
                const Icon = PILLAR_ICONS[pillar.id] || BookOpen;
                const spanWide = idx === 6 ? 'md:col-span-2 lg:col-span-3' : '';
                return (
                  <Link
                    key={pillar.id}
                    to={pillar.route}
                    className={`v-card-hover p-6 flex flex-col justify-between gap-4 group ${spanWide}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/12 border border-[#16C784]/25 text-[#16C784]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <Badge variant="neutral">{pillar.metric}</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#16C784]">
                          {pillar.code}
                        </p>
                        <h3 className="mt-1 font-display text-lg font-bold text-white group-hover:text-[#16C784] transition-colors">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-[#9AA4B2]">
                        {pillar.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F6F9] group-hover:text-[#16C784] transition-colors">
                      Enter {pillar.code} <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. VALENCE LEARN & AI ACCOUNTING TUTOR */}
      <section className="py-16 sm:py-22 bg-[#0D1116]">
        <div className="v-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                  VALENCE LEARN
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                  Built for Discipline, Measurable Readiness & First-Sitting Passes.
                </h2>
                <p className="text-sm sm:text-base text-[#9AA4B2]">
                  Every enrolled candidate receives a personalised learning cockpit combining live Google Meet classes, chapter completion telemetry, study-hour streaks, mock exams and digital resource access.
                </p>
              </div>

              {/* Sample Live Progress Telemetry Preview Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="v-card p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#9AA4B2]">
                    <Flame className="h-4 w-4 text-[#16C784]" /> Reading Streak
                  </div>
                  <p className="mt-2 tabular-nums-display text-2xl font-bold text-white">18 Days</p>
                  <p className="text-[11px] text-[#16C784]">+4.5 hrs this week</p>
                </div>
                <div className="v-card p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#9AA4B2]">
                    <TrendingUp className="h-4 w-4 text-[#16C784]" /> Readiness Index
                  </div>
                  <p className="mt-2 tabular-nums-display text-2xl font-bold text-[#16C784]">84%</p>
                  <p className="text-[11px] text-[#667085]">Educational indicator</p>
                </div>
                <div className="v-card p-4 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#9AA4B2]">
                    <Video className="h-4 w-4 text-[#16C784]" /> Live Classrooms
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-white">Google Meet</p>
                  <p className="text-[11px] text-[#667085]">Verified access only</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#C2C9D4]">
                {[
                  'Syllabus reading & chapter completion tracker',
                  'Daily & weekly study-hour target telemetry',
                  'Timed practice questions & full mock exams',
                  'Curated YouTube lecture playlists by topic',
                  'Authorised PDF textbook & resource library',
                  'Class attendance, assignments & diet reminders',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 rounded-xl bg-[#11161C] border border-white/[0.06] px-3.5 py-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/portal/student" className="v-btn-primary">
                  Open Student Portal <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/study-materials" className="v-btn-secondary">
                  Browse Study Materials
                </Link>
              </div>
            </div>

            {/* VALENCE AI Accounting Tutor 7-Step Framework */}
            <div className="lg:col-span-6 v-card p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Badge variant="green">VALENCE AI ACCOUNTING TUTOR</Badge>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">
                    7-Step Examination-Standard Workings
                  </h3>
                </div>
                <Sparkles className="h-6 w-6 text-[#16C784] shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-[#9AA4B2]">
                Supports ATSWA, ICAN Foundation, Skills & Professional, university accounting and financial literacy — structured the exact way professional examiners award marks.
              </p>
              <div className="space-y-2">
                {AI_TUTOR_STEPS.map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-3 rounded-xl bg-[#0B0E11] border border-white/[0.06] px-3.5 py-2.5"
                  >
                    <span className="tabular-nums-display text-xs font-bold text-[#16C784] bg-[#16C784]/10 border border-[#16C784]/25 rounded-lg px-2 py-0.5 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#F4F6F9]">{item.label}</p>
                      <p className="text-[11px] text-[#9AA4B2]">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/services#ai-tutor"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16C784] hover:underline"
              >
                See live IFRS working demonstration <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ICAN PROGRAMMES */}
      <section id="ican" className="py-16 sm:py-22">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="green">May & November Diets</Badge>
                <Badge variant="neutral">25% Off 3+ Courses</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                ICAN Professional Examination Programmes
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Online tuition is <strong className="text-white">₦40,000 per course</strong> with an automatic{' '}
                <strong className="text-[#16C784]">25% discount on 3+ courses</strong> (3 = ₦90k · 4 = ₦120k · 5 = ₦150k · 6 = ₦180k). One-time level unlock: <strong className="text-white">₦3,000</strong> per level.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/programmes/ican/exemptions" className="v-btn-secondary text-xs">
                <Scale className="h-4 w-4 text-[#16C784]" />
                Exemption Guidance
              </Link>
              <Link to="/programmes/ican" className="v-btn-primary text-xs">
                ICAN Tuition Calculator <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {icanLevels.map((level) => (
              <div key={level.id} className="v-card-hover p-6 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#16C784]">
                      {level.code}
                    </span>
                    <span className="text-xs text-[#9AA4B2] tabular-nums-display">
                      {level.courses.length} Courses
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{level.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#9AA4B2]">{level.tagline}</p>
                  </div>
                  <ul className="space-y-2 border-t border-white/[0.06] pt-3.5">
                    {level.courses.map((c) => (
                      <li key={c.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-[#D5DBE3]">{c.title}</span>
                        <span className="font-display text-[11px] font-semibold text-[#16C784] bg-[#16C784]/10 px-2 py-0.5 rounded-md shrink-0">
                          {c.code}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 border-t border-white/[0.06] pt-4">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-[#9AA4B2]">All {level.courses.length} courses (25% off)</span>
                    <span className="tabular-nums-display text-lg font-bold text-white">
                      {formatNaira(level.courses.length * 30000)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/programmes/ican/${level.slug}`}
                      className="v-btn-primary text-xs py-2 px-3"
                    >
                      View {level.shortName}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsAppModal({
                          category: 'ICAN Official Registration Fee Assistance',
                          level: `ICAN — ${level.shortName} Level`,
                        })
                      }
                      className="v-btn-secondary text-xs py-2 px-3"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-[#16C784]" />
                      Official Fees
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ATSWA PROGRAMMES */}
      <section id="atswa" className="py-16 sm:py-22 bg-[#0D1116]">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="green">March & September Diets · Next: March 2027</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                ATSWA Programme (ATS 1, ATS 2 & ATS 3)
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Accelerate to the AAT qualification with <strong className="text-white">₦20,000/course</strong> tuition, automatic{' '}
                <strong className="text-[#16C784]">25% discount on 2+ courses</strong> (capped at{' '}
                <strong className="text-white">₦60,000</strong> for all 4), and a one-time{' '}
                <strong className="text-white">₦3,000</strong> level unlock credited as tutorial registration.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={settings.officialLinks.atswaSoftCopy}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn-secondary text-xs"
              >
                ATSWA Soft-Copy Portal <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
              </a>
              <Link to="/programmes/atswa" className="v-btn-primary text-xs">
                Full ATSWA Breakdown <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {atswaLevels.map((lvl) => (
              <div key={lvl.id} className="v-card-hover p-6 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="green">{lvl.code}</Badge>
                    <span className="text-xs text-[#9AA4B2] inline-flex items-center gap-1">
                      <Lock className="h-3 w-3 text-[#16C784]" /> Unlock: ₦3,000 once
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{lvl.name}</h3>
                    <p className="mt-1 text-xs text-[#9AA4B2]">{lvl.summary}</p>
                  </div>
                  <ul className="space-y-2 border-t border-white/[0.06] pt-3.5">
                    {lvl.courses.map((c) => (
                      <li key={c.id} className="flex items-center justify-between text-xs">
                        <span className="text-[#D5DBE3]">{c.title}</span>
                        <span className="text-[11px] font-display font-semibold text-[#9AA4B2]">
                          {c.code}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">All 4 Courses Tuition (25% off)</span>
                    <span className="tabular-nums-display font-bold text-[#16C784]">₦60,000</span>
                  </div>
                  {lvl.officialFees.icanRegistration && (
                    <div className="flex justify-between">
                      <span className="text-[#667085]">ICAN Registration Fee</span>
                      <span className="tabular-nums-display text-[#C2C9D4]">
                        {formatNaira(lvl.officialFees.icanRegistration)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Full Exam · Annual Sub</span>
                    <span className="tabular-nums-display text-[#C2C9D4]">
                      {formatNaira(lvl.officialFees.fullExamFee)} · {formatNaira(lvl.officialFees.annualSubscription)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. UNIVERSITY, POLYTECHNIC & GENERAL ACCOUNTING LEARNING */}
      <section className="py-16 sm:py-22">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 v-card p-6 sm:p-8 space-y-5">
            <Badge variant="green">Universities · Polytechnics · Colleges</Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Open to Tertiary Accounting & Business Students Nationwide
            </h2>
            <p className="text-sm text-[#9AA4B2]">
              Even if you are not yet writing ICAN or ATSWA, register on VALENCE to access general accounting lessons, university study groups, inter-school tournaments, practice banks, AI tutor support, chartered accountant mentorship and internships.
            </p>
            <div className="flex flex-wrap gap-2">
              {tertiaryDisciplines.map((d) => (
                <span
                  key={d}
                  className="rounded-xl bg-[#0B0E11] border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-[#D5DBE3]"
                >
                  {d}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#667085] border-t border-white/[0.06] pt-3">
              Access Governance: Restricted paid ICAN and ATSWA classrooms/materials remain exclusive to verified enrolled exam candidates until unlocked.
            </p>
          </div>

          <div className="lg:col-span-5 v-card p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <Badge variant="neutral">General Accounting Learners</Badge>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Practical Financial & Business Accounting Literacy
              </h3>
              <div className="space-y-2.5">
                {generalLearnerTracks.map((track) => (
                  <div key={track.title} className="rounded-xl bg-[#0B0E11] border border-white/[0.06] px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-[#16C784]">{track.title}</p>
                    <p className="text-[11px] text-[#9AA4B2] mt-0.5">{track.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/programmes/tertiary" className="v-btn-secondary w-full">
              Explore Tertiary & General Tracks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7 & 15. VALENCE CONNECT & COMMUNITY / OFFICIAL ANNOUNCEMENTS */}
      <section className="py-16 sm:py-22 bg-[#0D1116]">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                VALENCE CONNECT & ANNOUNCEMENTS
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Where Every Member Connects, Shares Photos & Publishes Updates
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Every registered user can customise their profile & photo gallery, publish targeted community announcements, join study groups, message in real time and join voice/video study calls — while official platform notices remain strictly verified.
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-[#11161C] border border-white/[0.08] p-1 self-start">
              {[
                { id: 'all', label: 'All Feed' },
                { id: 'official', label: 'Official Notices' },
                { id: 'community', label: 'Community' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAnnouncementFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    announcementFilter === tab.id
                      ? 'bg-[#16C784] text-[#06130D]'
                      : 'text-[#9AA4B2] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visibleAnnouncements.map((ann) => (
              <article
                key={ann.id}
                className={`v-card p-6 flex flex-col justify-between gap-4 ${
                  ann.isOfficial ? 'border-[#16C784]/40 bg-gradient-to-b from-[#16C784]/[0.06] to-[#11161C]' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {ann.isOfficial ? (
                        <Badge variant="official">VALENCE OFFICIAL</Badge>
                      ) : (
                        <Badge variant="community">Community Announcement</Badge>
                      )}
                      <span className="text-[11px] text-[#667085]">{ann.audience}</span>
                    </div>
                    <span className="text-[11px] text-[#667085]">{ann.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        ann.isOfficial
                          ? 'bg-[#16C784]/20 text-[#16C784] border border-[#16C784]/40'
                          : 'bg-[#1B232D] text-[#F4F6F9] border border-white/[0.1]'
                      }`}
                    >
                      {ann.authorName
                        .split(' ')
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-white">{ann.authorName}</span>
                        {ann.verifiedBadge && <Badge variant="verified">{ann.verifiedBadge}</Badge>}
                      </div>
                      <p className="text-[11px] text-[#9AA4B2]">{ann.authorCategory}</p>
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#F4F6F9]">{ann.title}</h3>
                  <p className="text-xs leading-relaxed text-[#9AA4B2]">{ann.content}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#9AA4B2]">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1 tabular-nums-display">
                      <Heart className="h-3.5 w-3.5 text-[#16C784]" /> {ann.likes}
                    </span>
                    <span className="inline-flex items-center gap-1 tabular-nums-display">
                      <MessageSquare className="h-3.5 w-3.5" /> {ann.comments}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBookmark(ann)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors ${
                      bookmarkedIds.includes(ann.id)
                        ? 'text-[#16C784] bg-[#16C784]/12'
                        : 'hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {bookmarkedIds.includes(ann.id) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#11161C] border border-white/[0.08] p-5">
            <p className="text-xs sm:text-sm text-[#C2C9D4]">
              Plus <strong className="text-white">12 subject discussion forums</strong>, public & private study groups, realtime messaging, voice/video study calls and verified mentorship.
            </p>
            <Link to="/connect" className="v-btn-primary text-xs shrink-0">
              Join VALENCE Connect <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. VALENCE NATIONAL ACCOUNTING CHALLENGE (VALENCE COMPETE) */}
      <section className="py-16 sm:py-22 relative overflow-hidden">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="live">National Flagship Tournament</Badge>
                <Badge variant="neutral">5 Rounds · Verified Leaderboards</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                VALENCE National Accounting Challenge
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Nigeria’s inter-school accounting championship across universities, polytechnics, colleges and examination levels — complete with server-timed autosave exam engines, National League seasons, 1v1/2v2 Battle Arena, Campus Ambassadors and the Hall of Fame.
              </p>
            </div>
            <Link to="/competitions" className="v-btn-primary self-start lg:self-auto shrink-0">
              <Trophy className="h-4 w-4" />
              Register for Competitions
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitionDivisions.map((div, idx) => (
              <div key={div.id} className="v-card-hover p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="tabular-nums-display text-xs font-bold text-[#16C784]">
                    DIVISION 0{idx + 1}
                  </span>
                  <Trophy className="h-4 w-4 text-[#16C784]/80" />
                </div>
                <h3 className="font-display text-base font-bold text-white">{div.name}</h3>
                <p className="text-xs font-medium text-[#C2C9D4]">{div.level}</p>
                <p className="text-[11px] leading-relaxed text-[#9AA4B2] border-t border-white/[0.06] pt-2.5">
                  {div.format}
                </p>
              </div>
            ))}
          </div>

          {/* 5 Round Progression Bar */}
          <div className="v-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#667085] mb-3">
              Official 5-Stage Tournament Pathway
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                '1. Preliminary Round',
                '2. Institutional Qualifier',
                '3. Regional Qualifier',
                '4. National Semifinal',
                '5. Grand Finale',
              ].map((round, i) => (
                <div
                  key={round}
                  className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold border ${
                    i === 4
                      ? 'bg-[#16C784]/12 border-[#16C784]/35 text-[#16C784]'
                      : 'bg-[#0B0E11] border-white/[0.07] text-[#D5DBE3]'
                  }`}
                >
                  {round}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 & 13. VALENCE PROFESSIONAL & FEATURED VERIFIED TUTORS */}
      <section className="py-16 sm:py-22 bg-[#0D1116]">
        <div className="v-container space-y-12">
          {/* Professional Hub Banner */}
          <div className="v-card p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <Badge variant="verified">VALENCE PROFESSIONAL</Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Executive Home for Chartered Accountants & Finance Leaders
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Build a credential-verified professional profile, lead industry discussions, access CPD-related resources, mentor rising ICAN/ATSWA finalists, speak at webinars and explore senior advisory or verified tutoring roles. Only verified credentials earn official badges.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/portal/professional" className="v-btn-primary text-xs">
                  Enter Professional Portal <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/portal/tutor" className="v-btn-secondary text-xs">
                  Apply as a Verified Tutor
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
              {professionalQualifications.map((q) => (
                <div key={q.code} className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-3.5">
                  <span className="font-display text-base font-bold text-[#16C784]">{q.code}</span>
                  <p className="mt-0.5 text-[11px] text-[#9AA4B2] leading-snug">{q.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 13. Featured Verified Tutors */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                  VERIFIED FACULTY
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">
                  Featured VALENCE Tutors
                </h3>
                <p className="text-xs text-[#9AA4B2] mt-1">
                  Strict verification: ATSWA tutors hold verified AAT+; ICAN tutors hold BOTH compulsory AAT & ACA certificates + pass our 20-question timed assessment.
                </p>
              </div>
              <Link to="/portal/tutor" className="v-btn-secondary text-xs self-start">
                Tutor Requirements <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tutors.map((t) => (
                <div key={t.id} className="v-card-hover p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center font-display text-sm font-bold text-[#16C784]">
                        {t.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{t.name}</p>
                        <p className="text-[11px] text-[#16C784]">{t.tier}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {t.credentials.map((cred) => (
                        <Badge key={cred} variant="verified">
                          {cred}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-[#9AA4B2] leading-relaxed">{t.bio}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-3">
                    {t.courses.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-[#0B0E11] border border-white/[0.08] px-2 py-0.5 text-[10.5px] font-display font-semibold text-[#D5DBE3]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. VALENCE MARKETPLACE */}
      <section className="py-16 sm:py-22">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="green">7% Off 2+ Distinct ICAN Study Packs</Badge>
                <Badge variant="neutral">Free Delivery: LASU · Ojo · UNILAG · YABATECH · FCE · Yaba</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                VALENCE Marketplace — Study Packs & Past Questions
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                ATSWA past questions (₦5,500 · 9% off 2+), ATSWA study packs (₦9,500 · 5% off 2+), ICAN past questions (₦9,000 · 6% off 2+), and all 15 ICAN study packs (₦10,000–₦15,500 · 7% off 2+ distinct courses across levels).
              </p>
            </div>
            <Link to="/store" className="v-btn-primary self-start lg:self-auto shrink-0">
              <ShoppingBag className="h-4 w-4" />
              Browse All 24 Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="v-card-hover p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="neutral">{prod.programme} · {prod.level}</Badge>
                    <span className="text-[10.5px] font-semibold text-[#16C784]">{prod.discountHint}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white leading-snug">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-[#9AA4B2] line-clamp-3">{prod.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5">
                  <span className="tabular-nums-display text-lg font-bold text-white">
                    {formatNaira(prod.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(prod)}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#16C784]/15 border border-[#16C784]/35 px-3 py-1.5 text-xs font-semibold text-[#16C784] hover:bg-[#16C784] hover:text-[#06130D] transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FEATURED TUITION CENTRES & SPONSORED ADVERTISEMENTS */}
      <section className="py-16 sm:py-22 bg-[#0D1116]">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                TUITION CENTRES DIRECTORY & VALENCE ADVERTISE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Discover Verified Accounting Tuition Centres Across Nigeria
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA4B2]">
                Compare verified centres by programme, location and tuition mode. Paid promotional listings are transparently labelled <strong className="text-[#EA3943]">Sponsored</strong> or <strong className="text-[#EA3943]">Advertisement</strong> and do not constitute academic guarantees.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/tuition-centres" className="v-btn-secondary text-xs">
                Full Directory
              </Link>
              <Link to="/advertise" className="v-btn-primary text-xs">
                <Megaphone className="h-3.5 w-3.5" /> Advertise Your Centre
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tuitionCentres.map((centre) => (
              <div key={centre.id} className="v-card-hover p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {centre.verified && <Badge variant="verified">Verified Centre</Badge>}
                      <Badge variant="neutral">{centre.mode}</Badge>
                    </div>
                    {centre.sponsored && <Badge variant="sponsored">{centre.adLabel}</Badge>}
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B0E11] border border-white/[0.08] text-[#16C784]">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-white">{centre.name}</h3>
                      <p className="text-xs text-[#9AA4B2] inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#16C784]" /> {centre.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#9AA4B2] leading-relaxed">{centre.description}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {centre.programmes.map((p) => (
                      <span
                        key={p}
                        className="rounded-md bg-[#0B0E11] border border-white/[0.07] px-2 py-0.5 text-[10.5px] text-[#C2C9D4]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/tuition-centres"
                    className="text-xs font-semibold text-[#16C784] hover:underline"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 & 14. LATEST OPPORTUNITIES + UPCOMING CLASSES & EVENTS */}
      <section className="py-16 sm:py-22">
        <div className="v-container grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 12. Opportunities */}
          <div className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                  VALENCE OPPORTUNITIES
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-white">
                  Scholarships, Internships & Careers
                </h2>
              </div>
              <Link to="/opportunities" className="text-xs font-semibold text-[#16C784] hover:underline">
                See all →
              </Link>
            </div>
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <Link
                  key={opp.id}
                  to="/opportunities"
                  className="v-card-hover p-4 block space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="green">{opp.category}</Badge>
                    <Badge variant="red">Deadline: {opp.deadline}</Badge>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-[#C2C9D4]">{opp.organisation}</p>
                  <p className="text-[11.5px] text-[#9AA4B2] line-clamp-2">{opp.eligibility}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* 14. Upcoming Classes & Events */}
          <div className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                  ACADEMIC CALENDAR
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-white">
                  Upcoming Classes, Webinars & Events
                </h2>
              </div>
              <Link to="/programmes" className="text-xs font-semibold text-[#16C784] hover:underline">
                Full schedule →
              </Link>
            </div>
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="v-card p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="neutral">{ev.type}</Badge>
                    <span className="text-xs font-medium text-[#16C784] inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {ev.date}
                    </span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white">
                    {ev.title}
                  </h3>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#9AA4B2]">
                    <span>{ev.programme} · {ev.mode}</span>
                    <span className="text-[#C2C9D4] font-medium">{ev.access}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 16. TESTIMONIALS */}
      <section className="py-16 sm:py-20 bg-[#0D1116]">
        <div className="v-container space-y-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
              COMMUNITY VOICES
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              Trusted by Candidates, Mentors & Finalists
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((item) => (
              <div key={item.id} className="v-card p-6 flex flex-col justify-between gap-5">
                <p className="text-sm leading-relaxed text-[#D5DBE3]">“{item.quote}”</p>
                <div className="border-t border-white/[0.06] pt-3.5">
                  <p className="font-display text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-[#16C784]">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 18. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-16 sm:py-22">
        <div className="v-container max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
              Clear Rules, Transparent Pricing & Verified Governance
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="v-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-display text-sm sm:text-base font-semibold text-[#F4F6F9]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#16C784] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-[#9AA4B2] border-t border-white/[0.05] pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 19. CONTACT & FINAL INSTITUTIONAL CTA */}
      <section className="py-16 sm:py-20 bg-[#0D1116]">
        <div className="v-container">
          <div className="rounded-3xl bg-gradient-to-br from-[#131B23] via-[#11161C] to-[#0B0E11] border border-[#16C784]/25 p-7 sm:p-12 shadow-glow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <p className="font-display text-xs italic text-[#16C784]">{settings.tagline}</p>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                  Begin Your Journey on VALENCE Today
                </h2>
                <p className="text-sm text-[#9AA4B2] max-w-xl">
                  Operated by <strong className="text-white">{settings.operatorName}</strong>. Enrol for ATSWA March 2027 or ICAN May 2027, connect with chartered accountants, register your institution for the National Accounting Challenge, or reach our advisory desk.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-[#C2C9D4] pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4 text-[#16C784]" />
                    {settings.whatsappNumber}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#16C784]" />
                    Hours: {settings.operatingHours}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#16C784]" />
                    {settings.email}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link to="/portal/student" className="v-btn-primary py-3 w-full">
                  Create Your VALENCE Account <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Link to="/contact" className="v-btn-secondary py-2.5 text-xs">
                    Contact Desk
                  </Link>
                  <button
                    type="button"
                    onClick={() => openWhatsAppModal({ category: 'General Support Enquiry' })}
                    className="v-btn-secondary py-2.5 text-xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#16C784]" />
                    WhatsApp Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
