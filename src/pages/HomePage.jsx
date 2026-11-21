import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Trophy,
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
  Banknote,
} from 'lucide-react';
import { useAuth, useCart, usePublicData, useUi } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import CountdownTimer from '../components/ui/CountdownTimer';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import { formatNaira } from '../lib/pricing';
import { getSessionLifecycle } from '../lib/examSchedule';

const PILLAR_ICONS = {
  learn: BookOpen,
  compete: Trophy,
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
  const { isHydrating, settings, sessions, atswaLevels, icanLevels, products, pillars, tuitionCentres, tutors, opportunities, events, announcements, testimonials, statistics, faqs, candidateFaqs, competitionDivisions, tertiaryDisciplines, generalLearnerTracks, universityCounts } = usePublicData();
  const { addToCart } = useCart();
  const { openWhatsAppModal } = useUi();
  const toast = useToast();

  // Sessions 0 (ATSWA Mar 2027), 1 (ICAN May 2027), 2 (ICAN Nov 2026 - live 30-day result countdown!)
  const heroSessions = sessions.slice(0, 3);
  const [activeSessionIdx, setActiveSessionIdx] = useState(0);
  const [faqTab, setFaqTab] = useState('candidate');
  const [openFaq, setOpenFaq] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [announcementFilter, setAnnouncementFilter] = useState('all');

  const activeSession = heroSessions[activeSessionIdx] || heroSessions[0];
  const lifecycle = getSessionLifecycle(activeSession);

  const featuredProducts = useMemo(
    () =>
      [
        products.find((p) => p.id === 'prod-ican-sp-fr'),
        products.find((p) => p.id === 'prod-ican-pq-sbr'),
        products.find((p) => p.id === 'prod-atswa-pq-ats1-baps'),
        products.find((p) => p.id === 'prod-atswa-pq-ats2-fa'),
      ].filter(Boolean),
    [products]
  );

  const visibleAnnouncements = useMemo(
    () =>
      announcements.filter((a) => {
        if (announcementFilter === 'official') return a.isOfficial;
        if (announcementFilter === 'community') return !a.isOfficial;
        return true;
      }),
    [announcements, announcementFilter]
  );

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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 h-[420px] w-[780px] rounded-full bg-[#16C784]/[0.12] blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-[260px] w-[380px] rounded-full bg-[#16C784]/[0.06] blur-[110px]"
        />

        <div className="v-container relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 animate-fade-up">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-[#11161C] border border-[#16C784]/25 px-3.5 py-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-[#16C784] animate-pulse-soft" />
                <span className="font-display font-bold tracking-wider text-[#F4F6F9]">VALENCE</span>
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

              {/* Free Signup + ₦500k Podium Pool Callout Strip */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#11161C] border border-white/[0.08] px-3 py-1.5 text-[#D5DBE3]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784]" />
                  Free Account · ₦3,000 only for tuition application
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#16C784]/10 border border-[#16C784]/30 px-3 py-1.5 text-[#16C784] font-semibold">
                  <Banknote className="h-3.5 w-3.5" />
                  ₦500,000 Competition Podium Prize Pool
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/portal/student" className="v-btn-primary px-6 py-3">
                  <GraduationCap className="h-4 w-4" />
                  Student Portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium text-[#9AA4B2]">
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

            {/* Right Interactive Central Diet & 30-Day Result Release Command Card */}
            <div className="lg:col-span-5">
              <div className="v-glass-card p-5 sm:p-6 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img src="/valence-mark-sm.png" alt="" className="h-6 w-6 object-contain" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9AA4B2]">
                      Central Diet & Result Clock
                    </span>
                  </div>
                  <Badge variant={lifecycle.badgeVariant}>{lifecycle.badgeLabel}</Badge>
                </div>

                {/* 3-Mode Diet Switcher: ATSWA Mar 27 | ICAN May 27 | Nov 26 Results (30-Day Countdown) */}
                <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#0B0E11] p-1 border border-white/[0.07]">
                  {[
                    { label: 'ATSWA Mar ’27', idx: 0 },
                    { label: 'ICAN May ’27', idx: 1 },
                    { label: 'Nov ’26 Results', idx: 2 },
                  ].map((tab) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setActiveSessionIdx(tab.idx)}
                      className={`rounded-lg px-2 py-2 text-[11px] font-semibold transition-all ${
                        activeSessionIdx === tab.idx
                          ? 'bg-[#16C784] text-[#06130D] shadow-glow-sm'
                          : 'text-[#9AA4B2] hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    {activeSession.label}
                  </h2>
                  <p className="text-[11px] text-[#16C784] font-medium mt-0.5 mb-2.5">
                    {lifecycle.countdownLabel}
                  </p>
                  {lifecycle.countdownTarget && (
                    <CountdownTimer targetDate={lifecycle.countdownTarget} />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-xl bg-[#0B0E11]/90 border border-white/[0.06] p-3">
                    <span className="text-[#667085] block text-[10.5px]">
                      Exam Days ({activeSession.durationDays} Days)
                    </span>
                    <span className="mt-0.5 block font-semibold text-[#F4F6F9] text-[11.5px]">
                      {activeSession.examWindow}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11]/90 border border-white/[0.06] p-3">
                    <span className="text-[#667085] block text-[10.5px]">
                      Reg. Closes (1 Wk Prior)
                    </span>
                    <span className="mt-0.5 block font-semibold text-[#EA3943] text-[11.5px]">
                      {activeSession.registrationCloseFormatted}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11]/90 border border-white/[0.06] p-3">
                    <span className="text-[#667085] block text-[10.5px]">
                      Result Target (+30 Days)
                    </span>
                    <span className="mt-0.5 block font-semibold text-[#EA3943] text-[11.5px]">
                      {activeSession.expectedResultFormatted}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11]/90 border border-white/[0.06] p-3">
                    <span className="text-[#667085] block text-[10.5px]">
                      Tuition Cost Unlock
                    </span>
                    <span className="mt-0.5 block tabular-nums-display font-bold text-white text-[11.5px]">
                      ₦3,000 <span className="font-normal text-[#9AA4B2]">(optional)</span>
                    </span>
                  </div>
                </div>

                <Link
                  to={
                    lifecycle.phase === 'awaiting_results'
                      ? '/programmes#timetables'
                      : activeSession.programme === 'ATSWA'
                      ? '/programmes/atswa'
                      : '/programmes/ican'
                  }
                  className="v-btn-primary w-full"
                >
                  {lifecycle.phase === 'awaiting_results'
                    ? 'View Official Diet Timetables & Result Tracker'
                    : `Explore ${activeSession.programme} Timetable & Tuition`}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="text-[10.5px] leading-relaxed text-center text-[#667085]">
                  Dates & result windows are posted and updated by the Central Examination Authority whenever the Institute revises the official schedule.
                </p>
              </div>
            </div>
          </div>

          {/* 17. STATISTICS & ACHIEVEMENTS BAR */}
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

      {/* 2. ABOUT VALENCE & SEVEN PILLARS */}
      <section id="about-valence" className="py-16 sm:py-22">
        <div className="v-container space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                ABOUT VALENCE
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Seven Integrated Pillars. One Independent Accounting Ecosystem.
              </h2>
              <p className="text-sm sm:text-base text-[#9AA4B2]">
                Guided by <span className="italic text-[#F4F6F9]">{settings.tagline}</span>, VALENCE unites professional exam tuition, intelligent AI assistance, academic networking, ₦500,000 podium competitions, verified tuition-centre discovery, study packs and finance careers across Nigeria.
              </p>
            </div>
            <Link to="/about" className="v-btn-secondary self-start lg:self-auto shrink-0">
              Explore VALENCE Charter <ArrowRight className="h-4 w-4" />
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
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/[0.12] border border-[#16C784]/25 text-[#16C784]">
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
                  Track chapter progress, study hours, live in-app video classes, official Central Examination Authority timetables, 7-day registration cutoffs and 30-day post-exam result countdowns in one cockpit.
                </p>
              </div>

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
                  <p className="mt-2 font-display text-lg font-bold text-white">In-App Video</p>
                  <p className="text-[11px] text-[#667085]">Enrolled access only</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#C2C9D4]">
                {[
                  'Syllabus reading & chapter completion tracker',
                  'Daily & weekly study-hour target telemetry',
                  'Timed practice questions & full mock exams',
                  'Official exam timetables & 30-day result timer',
                  'Authorised PDF textbook & YouTube video library',
                  'Class attendance, assignments & deadline alerts',
                ].map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2 rounded-xl bg-[#11161C] border border-white/[0.06] px-3.5 py-2.5"
                  >
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
                Supports ATSWA, ICAN Foundation, Skills & Professional, university accounting and financial literacy, structured the exact way professional markers award scores.
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="green">May & November Diets · 3 Exam Days (1st Tue–Thu)</Badge>
                <Badge variant="neutral">Reg. Closes 1 Week Before Exam</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                ICAN Professional Examination Programmes
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Explore Foundation, Skills and Professional syllabuses and timetables freely. Students pay the one-time{' '}
                <strong className="text-[#16C784]">₦3,000 registration</strong> per level only when ready to apply for tuition and unlock full cost implications (in-app online tuition with 25% off 3+ papers, plus the verified physical tuition cost implications set by tuition centres advertising on VALENCE).
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/programmes/ican/exemptions" className="v-btn-secondary text-xs">
                <Scale className="h-4 w-4 text-[#16C784]" />
                Exemption Guidance
              </Link>
              <Link to="/programmes/ican" className="v-btn-primary text-xs">
                Apply for ICAN Tuition <ArrowRight className="h-4 w-4" />
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
                      {level.courses.length} Papers · 3-Day Diet
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
                  <div className="flex items-center justify-between text-xs rounded-xl bg-[#0B0E11] border border-white/[0.06] px-3 py-2">
                    <span className="text-[#9AA4B2] inline-flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-[#16C784]" /> Tuition Cost Implication
                    </span>
                    <span className="text-[11px] font-semibold text-[#16C784]">₦3,000 Unlock</span>
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
                          level: `ICAN ${level.shortName} Level`,
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="green">March & September Diets · 2 Exam Days (2nd-to-Last Tue & Wed)</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                ATSWA Programme (ATS 1, ATS 2 & ATS 3)
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Next sitting: <strong className="text-white">Tue 23 & Wed 24 March 2027</strong> (registration closes Tue 16 March 2027). ATSWA document checklist & registration guidance run directly inside VALENCE; pay the one-time{' '}
                <strong className="text-[#16C784]">₦3,000 registration</strong> per level only when applying for tuition to unlock your full cost implication and 25% multi-course tuition discount (2+ courses).
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
                ATSWA Courses & Tuition <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {atswaLevels.map((lvl) => (
              <div key={lvl.id} className="v-card-hover p-6 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="green">{lvl.code}</Badge>
                    <span className="text-xs text-[#9AA4B2]">4 Papers · 2-Day Exam</span>
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

                <Link
                  to="/programmes/atswa"
                  className="rounded-xl bg-[#0B0E11] border border-white/[0.07] hover:border-[#16C784]/40 p-3.5 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="text-[#C2C9D4] inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#16C784]" /> Apply for Tuition & Cost Implication
                  </span>
                  <span className="tabular-nums-display font-bold text-[#16C784]">₦3,000 →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NIGERIAN UNIVERSITIES, POLYTECHNICS & GENERAL LEARNERS */}
      <section className="py-16 sm:py-22">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 v-card p-6 sm:p-8 space-y-5">
            <Badge variant="green">
              {universityCounts.total}+ Nigerian Universities Embedded ({universityCounts.federal} Federal · {universityCounts.state} State · {universityCounts.private} Private)
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Every University, Polytechnic & College in Nigeria Connected
            </h2>
            <p className="text-sm text-[#9AA4B2]">
              Select your exact Nigerian university during registration to join campus study groups, compete for the <strong className="text-[#16C784]">₦250,000 / ₦150,000 / ₦100,000 podium prize pool</strong> (only 4 students can compete in each school), access practice questions, AI tutoring, ACA/FCA mentorship and internship opportunities, even if you are not yet writing ICAN or ATSWA.
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
              Access Governance: Tertiary student accounts are free to join; restricted ICAN/ATSWA tuition classrooms remain reserved for students who unlock and enrol in those examination levels.
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
              Browse All {universityCounts.total} Universities & Tracks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 15. ANNOUNCEMENTS */}
      <section className="py-16 sm:py-22 bg-[#0D1116]">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                ANNOUNCEMENTS
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Where Every Member Shares Photos & Publishes Updates
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                All registered members can upload profile & gallery pictures and publish community announcements, while official exam dates, timetables and policy notices remain strictly managed by VALENCE administrators.
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
                  ann.isOfficial
                    ? 'border-[#16C784]/40 bg-gradient-to-b from-[#16C784]/[0.06] to-[#11161C]'
                    : ''
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
                        ? 'text-[#16C784] bg-[#16C784]/[0.12]'
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
        </div>
      </section>

      {/* 8. VALENCE NATIONAL INTER-SCHOOL CHALLENGE + PODIUM PRIZE POOL */}
      <section className="py-16 sm:py-22 relative overflow-hidden">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="live">National Flagship Tournament</Badge>
                <Badge variant="green">₦500,000 Podium Pool Every Competition</Badge>
                <Badge variant="neutral">Only 4 Competitors Per School</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                VALENCE National Inter-School Challenge
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Uniting candidates across {universityCounts.total} Nigerian universities, polytechnics, colleges and ICAN/ATSWA divisions, featuring rigorous questions across <strong className="text-white">accounting and related fields</strong> (finance, taxation, auditing, economics, business law, costing &amp; management). Strictly only 4 students can compete in each school, and top podium winners earn verified{' '}
                <strong className="text-[#16C784]">₦100,000 (1st), ₦70,000 (2nd) &amp; ₦50,000 (3rd)</strong> prizes · displayed on their school profiles as Top VALENCE Students · after every competition closes.
              </p>
            </div>
            <Link to="/competitions" className="v-btn-primary self-start lg:self-auto shrink-0">
              <Trophy className="h-4 w-4" />
              Register & Compete for the Podium
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitionDivisions.map((div, idx) => (
              <div key={div.id} className="v-card-hover p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="tabular-nums-display text-xs font-bold text-[#16C784]">
                    DIVISION 0{idx + 1}
                  </span>
                  <Badge variant="green">{div.reward}</Badge>
                </div>
                <h3 className="font-display text-base font-bold text-white">{div.name}</h3>
                <p className="text-xs font-medium text-[#C2C9D4]">{div.level}</p>
                <p className="text-[11px] leading-relaxed text-[#9AA4B2] border-t border-white/[0.06] pt-2.5">
                  {div.format}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FEATURED VERIFIED TUTORS */}
      <section className="py-16 sm:py-22 bg-[#0D1116]">
        <div className="v-container space-y-12">
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
                  ATSWA tutors hold verified AAT+; ICAN tutors hold BOTH compulsory AAT & ACA certificates + pass our timed 20-question assessment.
                </p>
              </div>
              <Link to="/portal/tutor" className="v-btn-secondary text-xs self-start">
                Tutor Requirements <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {tutors.length === 0 ? (
              <div className="v-card p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <Badge variant="green">FACULTY ONBOARDING OPEN</Badge>
                  <h4 className="font-display text-lg font-bold text-white">
                    Join VALENCE&apos;s Verified In-App Accounting Faculty
                  </h4>
                  <p className="text-xs text-[#9AA4B2] leading-relaxed">
                    Only real, manually verified tutors appear here. ATSWA tutors upload at least an AAT certificate; ICAN tutors upload both AAT and ACA certificates to private storage and complete our 20-question, 45-minute qualifying test before teaching live in-app classes.
                  </p>
                </div>
                <Link to="/portal/tutor?mode=register" className="v-btn-primary text-xs shrink-0 self-start lg:self-center">
                  Apply as a Verified Tutor <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </section>

      {/* 11. VALENCE MARKETPLACE */}
      <section className="py-16 sm:py-22">
        <div className="v-container space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="green">Per-Course Past Questions & Study Packs</Badge>
                <Badge variant="neutral">Free Delivery: LASU · Ojo · UNILAG · YABATECH · FCE · Yaba</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                VALENCE Marketplace: Study Packs & Per-Course Past Questions
              </h2>
              <p className="text-sm text-[#9AA4B2]">
                Buy a single course or all courses applicable to you: ATSWA past questions (₦5,500/course · 9% off 2+), ICAN Pathfinder past questions (₦9,000/course · 6% off 2+), ATSWA study packs (₦9,500 · 5% off 2+), and all 15 ICAN study packs (₦10,000–₦15,500 · 7% off 2+ distinct courses), with in-app material & delivery enquiries.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 self-start lg:self-auto shrink-0">
              <Link to="/store?enquiry=open" className="v-btn-secondary text-xs">
                In-App Delivery Enquiry
              </Link>
              <Link to="/store" className="v-btn-primary">
                <ShoppingBag className="h-4 w-4" />
                Browse All 45 Materials
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="v-card-hover overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <Link
                    to="/store"
                    className="group relative block h-60 w-full bg-[#080A0D] overflow-hidden border-b border-white/[0.06]"
                  >
                    <img
                      src={prod.imageUrl}
                      alt={`${prod.title}, ${prod.colourBadge}`}
                      loading="lazy"
                      className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/15 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#0B0E11]/85 backdrop-blur-md border border-white/[0.14] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: prod.accentHex || '#16C784' }}
                      />
                      {prod.colourBadge}
                    </span>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <Badge variant="neutral">
                        {prod.programme} · {prod.level}
                      </Badge>
                      {prod.courseCode && (
                        <span className="rounded-md bg-[#16C784] px-2 py-0.5 font-display text-[11px] font-bold text-[#06130D]">
                          {prod.courseCode}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-5 pb-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10.5px]">
                      <span className="font-semibold text-[#16C784]">{prod.discountHint}</span>
                      <span
                        className={`font-semibold ${
                          prod.isAvailable === false ? 'text-[#EA3943]' : 'text-[#C2C9D4]'
                        }`}
                      >
                        {prod.isStudyPack
                          ? prod.isAvailable === false
                            ? 'Unavailable'
                            : 'Available · Ships when ready'
                          : 'Same-day Lagos · 1-day outside'}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white leading-snug">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-[#9AA4B2] line-clamp-2">{prod.description}</p>
                  </div>
                </div>
                <div className="px-5 pb-5">
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
                PHYSICAL CENTRES, TEXTBOOK AUTHORS &amp; BOOK VENDORS · VALENCE ADVERTISE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Physical Tuition Centres, Author Textbooks &amp; Verified Book Vendors
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA4B2]">
                Verified <strong className="text-white">physical (in-person) tuition centres</strong>,{' '}
                <strong className="text-white">accounting textbook authors</strong> and{' '}
                <strong className="text-white">verified textbook vendors</strong> advertise in-app at{' '}
                <strong className="text-[#16C784]">₦10,000/week</strong> (all online tuition is taken directly in-app with VALENCE-verified tutors). Paid slots carry clear <strong className="text-[#EA3943]">Sponsored</strong> badges.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link to="/tuition-centres" className="v-btn-secondary text-xs">
                Centres &amp; Textbook Vendors
              </Link>
              <Link to="/advertise" className="v-btn-primary text-xs">
                <Megaphone className="h-3.5 w-3.5" /> Advertise In-App (₦10k/wk)
              </Link>
            </div>
          </div>

          {tuitionCentres.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  badge: 'Physical Centres · Custom Cost Schedule',
                  title: 'Verified Physical Tuition Centres',
                  desc: 'List your in-person classroom venue by city and state at ₦10,000/week and publish your verified tuition cost implication so students who unlock a level see your exact rates directly.',
                },
                {
                  badge: 'In-App Enquiry + Checkout',
                  title: 'Accounting Textbook Authors',
                  desc: 'Promote original ICAN, ATSWA, IFRS, tax, costing, and audit textbooks you publish at ₦10,000/week, with built-in in-app student enquiries and optional Paystack checkout.',
                },
                {
                  badge: 'Genuine Editions Only',
                  title: 'Verified Textbook Vendors & Bookshops',
                  desc: 'Showcase authentic accounting textbooks to candidates nationwide at ₦10,000/week, backed by in-app buyer enquiries, optional Paystack checkout, and zero-piracy protection.',
                },
              ].map((slot) => (
                <div key={slot.title} className="v-card-hover p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-2.5">
                    <Badge variant="green">{slot.badge}</Badge>
                    <h3 className="font-display text-lg font-bold text-white">{slot.title}</h3>
                    <p className="text-xs leading-relaxed text-[#9AA4B2]">{slot.desc}</p>
                  </div>
                  <Link
                    to="/advertise"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#16C784] hover:underline pt-2 border-t border-white/[0.06]"
                  >
                    Apply In-App (₦10,000/Week) <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tuitionCentres.map((centre) => (
                <div key={centre.id} className="v-card-hover p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {centre.verified && <Badge variant="verified">Verified Physical Centre</Badge>}
                        <Badge variant="neutral">{centre.schedule || centre.mode}</Badge>
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
          )}
        </div>
      </section>

      {/* 12 & 14. LATEST OPPORTUNITIES + UPCOMING CLASSES & EVENTS */}
      <section className="py-16 sm:py-22">
        <div className="v-container grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              {opportunities.length === 0 ? (
                <div className="v-card p-6 space-y-3">
                  <Badge variant="green">VERIFIED BOARD ONLY</Badge>
                  <h3 className="font-display text-base font-bold text-white">
                    Scholarships, Internships &amp; Graduate Audit Openings Publish Here Live
                  </h3>
                  <p className="text-xs leading-relaxed text-[#9AA4B2]">
                    Every scholarship, undergraduate internship, NYSC placement, workshop, and graduate accounting role is reviewed by VALENCE administrators before publication, with instant in-app alerts for members.
                  </p>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <Link to="/opportunities" className="v-btn-secondary text-xs py-2 px-3">
                      Explore Categories
                    </Link>
                  </div>
                </div>
              ) : (
                opportunities.map((opp) => (
                  <Link key={opp.id} to="/opportunities" className="v-card-hover p-4 block space-y-2">
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
                ))
              )}
            </div>
          </div>

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
                Diet timetables →
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

      {/* 16. PLATFORM STANDARDS & GUARANTEES */}
      <section className="py-16 sm:py-20 bg-[#0D1116]">
        <div className="v-container space-y-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
              THE VALENCE STANDARD
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              Built on Transparency, Verification &amp; Trust
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((item) => (
              <div key={item.id} className="v-card p-6 flex flex-col justify-between gap-5">
                <p className="text-sm leading-relaxed text-[#D5DBE3]">{item.quote}</p>
                <div className="border-t border-white/[0.06] pt-3.5">
                  <p className="font-display text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-[#16C784]">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 18. FAQ, PROSPECTIVE ICAN CANDIDATE GUIDE (10 FAQS) & PLATFORM FAQS */}
      <section id="faq" className="py-16 sm:py-22">
        <div className="v-container max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
              Prospective ICAN Candidate Guide & Platform FAQs
            </h2>
            <div className="inline-flex flex-wrap justify-center rounded-2xl bg-[#11161C] border border-white/[0.08] p-1.5 gap-1">
              <button
                type="button"
                onClick={() => {
                  setFaqTab('candidate');
                  setOpenFaq(0);
                }}
                className={`rounded-xl px-4 py-2 text-xs font-display font-bold transition-all ${
                  faqTab === 'candidate'
                    ? 'bg-[#16C784] text-[#06130D] shadow-glow-sm'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                ICAN Programme: 10 Candidate FAQs
              </button>
              <button
                type="button"
                onClick={() => {
                  setFaqTab('platform');
                  setOpenFaq(0);
                }}
                className={`rounded-xl px-4 py-2 text-xs font-display font-bold transition-all ${
                  faqTab === 'platform'
                    ? 'bg-[#16C784] text-[#06130D] shadow-glow-sm'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                VALENCE Platform, Schedules & Rewards ({faqs.length})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(faqTab === 'candidate' ? candidateFaqs : faqs).map((item, idx) => {
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
                      {item.num ? `${item.num}. ${item.q}` : item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#16C784] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-[#9AA4B2] border-t border-white/[0.05] pt-3 space-y-2.5">
                      <p>{item.a}</p>
                      {item.bullets && (
                        <ul className="space-y-1.5 text-[#D5DBE3]">
                          {item.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-xs sm:text-sm">
                              <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.links && (
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {item.links.map((lnk) => (
                            <a
                              key={lnk.url}
                              href={lnk.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B0E11] border border-[#16C784]/35 hover:border-[#16C784] px-3.5 py-2 text-xs font-semibold text-[#16C784] transition-colors"
                            >
                              {lnk.label} <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ))}
                        </div>
                      )}
                      {item.tagline && (
                        <p className="font-display text-sm sm:text-base font-bold italic text-[#16C784] pt-1">
                          {item.tagline}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link to="/programmes/ican/guide" className="v-btn-secondary text-xs">
              Open Full Candidate Guide Page <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
            </Link>
            <Link to="/programmes/ican/exemptions" className="v-btn-secondary text-xs">
              Check My Starting Level & Exemptions
            </Link>
          </div>
        </div>
      </section>

      {/* 19. CONTACT & CTA */}
      <section className="py-16 sm:py-20 bg-[#0D1116]">
        <div className="v-container">
          <div className="rounded-3xl bg-gradient-to-br from-[#131B23] via-[#11161C] to-[#0B0E11] border border-[#16C784]/25 p-7 sm:p-12 shadow-glow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <p className="font-display text-xs italic text-[#16C784]">{settings.tagline}</p>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                  Join VALENCE Free Today
                </h2>
                <p className="text-sm text-[#9AA4B2] max-w-xl">
                  Connect with peers across {universityCounts.total}+ Nigerian universities, prepare for ATSWA March 2027 or ICAN May 2027, compete for the ₦500,000 podium prize pool, or unlock tuition whenever you’re ready.
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
                  Create Free VALENCE Account <ArrowRight className="h-4 w-4" />
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
