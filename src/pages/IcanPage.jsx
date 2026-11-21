import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Check,
  Lock,
  Unlock,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Clock,
  HelpCircle,
  ChevronDown,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { useAuth, useCart, usePublicData, useUi } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import CountdownTimer from '../components/ui/CountdownTimer';
import UniversitySelect from '../components/ui/UniversitySelect';
import {
  calculateIcanTuition,
  evaluateIcanExemptions,
  formatNaira,
} from '../lib/pricing';
import { formatReadableDate, getSessionLifecycle } from '../lib/examSchedule';

export default function IcanPage() {
  const { levelSlug } = useParams();
  const navigate = useNavigate();
  const { isLevelUnlocked, handleUnlockLevel } = useAuth();
  const { icanLevels, allIcanCourses, exemptionRules, candidateFaqs, icanRegistrationProcess, completionTimelines, sessions, settings } = usePublicData();
  const { openWhatsAppModal } = useUi();
  const toast = useToast();
  const [unlocking, setUnlocking] = useState(false);

  const handleIcanUnlock = async () => {
    setUnlocking(true);
    const result = await handleUnlockLevel(`ican:${activeLevel.slug}`, 3000);
    setUnlocking(false);
    if (result.error) {
      toast.error('Unlock failed', result.error);
      return;
    }
    toast.success(
      `${activeLevel.shortName} Cost Implication Unlocked`,
      `₦3,000 unlocked. Full tuition cost implication is now visible above.`
    );
  };

  const icanSessions = useMemo(
    () => sessions.filter((s) => s.programme === 'ICAN'),
    [sessions]
  );

  const activeTab = ['foundation', 'skills', 'professional', 'exemptions', 'guide'].includes(
    levelSlug
  )
    ? levelSlug
    : 'foundation';

  const isLevelTab = ['foundation', 'skills', 'professional'].includes(activeTab);
  const activeLevel = icanLevels.find((l) => l.slug === activeTab) || icanLevels[0];
  const [selectedDietId, setSelectedDietId] = useState(icanSessions[0]?.id || 'ican-may-2027');
  const [selectedCourseIds, setSelectedCourseIds] = useState(() =>
    activeLevel.courses.slice(0, 3).map((c) => c.id)
  );
  const [expandAllFaqs, setExpandAllFaqs] = useState(true);
  const [openFaqNum, setOpenFaqNum] = useState(1);

  useEffect(() => {
    if (isLevelTab) {
      const lvl = icanLevels.find((l) => l.slug === activeTab) || icanLevels[0];
      setSelectedCourseIds(lvl.courses.slice(0, Math.min(3, lvl.courses.length)).map((c) => c.id));
    }
  }, [activeTab, isLevelTab, icanLevels]);

  const [exInput, setExInput] = useState({
    qualificationKey: 'bsc_hnd_accounting_accredited',
    institution: '',
    graduationYear: '2025',
    courseStudied: 'Accounting',
    professionalQualification: 'NONE',
    priorPassedCodes: [],
    supportingDocNote: '',
  });
  const [exResult, setExResult] = useState(null);

  const activeDiet = icanSessions.find((s) => s.id === selectedDietId) || icanSessions[0];
  const dietLifecycle = getSessionLifecycle(activeDiet);
  const unlocked = isLevelUnlocked(`ican:${activeLevel.slug}`);

  const tuitionCalc = useMemo(
    () => calculateIcanTuition(selectedCourseIds.length),
    [selectedCourseIds.length]
  );

  const toggleCourse = (id) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const togglePriorPaper = (code) => {
    setExInput((prev) => ({
      ...prev,
      priorPassedCodes: prev.priorPassedCodes.includes(code)
        ? prev.priorPassedCodes.filter((c) => c !== code)
        : [...prev.priorPassedCodes, code],
    }));
  };

  const runExemptionCheck = (e) => {
    e.preventDefault();
    const res = evaluateIcanExemptions(exInput, allIcanCourses, exemptionRules);
    setExResult(res);
    toast.success(
      `Recommended Start: ${res.startingLevel}`,
      res.isAtswaRoute
        ? `${res.atswaExemptedLevels.length} ATSWA level(s) exempted · ${res.estimatedDuration}`
        : `${res.potentialExemptions.length} potential exemptions · ${res.remainingCourses.length} remaining ICAN papers.`
    );
  };

  const whatsappEnquiryButtons = [
    { label: 'ICAN Registration Enquiry', category: 'ICAN Official Registration Fee Assistance' },
    { label: 'Examination Fee Enquiry', category: 'ICAN Official Examination Fee Assistance' },
    { label: 'Subscription & Dev. Levy Enquiry', category: 'ICAN Official Annual Subscription & Levy Assistance' },
    { label: 'Exemption Processing Enquiry', category: 'ICAN Official Exemption Processing Assistance' },
  ];

  const pageHeading =
    activeTab === 'exemptions'
      ? 'ICAN Exemption & Starting-Level Guide'
      : activeTab === 'guide'
      ? 'Prospective ICAN Candidate Guide: 10 FAQs'
      : activeLevel.name;

  const pageSubtitle =
    activeTab === 'exemptions'
      ? 'Find your exact entry stage across O’Level/ND (ATSWA), Non-Accredited, ICAN-Accredited and MCATI Accounting degrees, plus direct official ICAN accreditation & MCATI directory checks.'
      : activeTab === 'guide'
      ? 'Everything prospective candidates need to know about ACA eligibility, ATSWA vs Graduate entry routes, levels, Accredited & MCATI school checks, exam registration steps and completion timelines.'
      : `${activeLevel.tagline} Progression requires clearing all papers in a stage before advancing. Join VALENCE free, and pay the one-time ₦3,000 registration only if applying for tuition and unlocking your cost implication.`;

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="green">ICAN · MAY & NOVEMBER DIETS (3 EXAM DAYS)</Badge>
                <Badge variant="neutral">ACA Qualification · Central Authority Updated</Badge>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
                {pageHeading}
              </h1>
              <p className="text-sm sm:text-base text-[#9AA4B2]">{pageSubtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={settings.officialLinks.icanSyllabus2026}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn-secondary text-xs"
              >
                2026 Syllabus PDF <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
              </a>
              <a
                href={settings.officialLinks.icanAccreditedInstitutions}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn-secondary text-xs"
              >
                Accredited Schools <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
              </a>
              <a
                href={settings.officialLinks.icanMcatiInstitutions}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn-secondary text-xs"
              >
                MCATI List <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
              </a>
              <a
                href={settings.officialLinks.icanExamDockets}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn-secondary text-xs"
              >
                Exam Dockets <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
              </a>
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            {icanLevels.map((lvl) => (
              <button
                key={lvl.slug}
                type="button"
                onClick={() => navigate(`/programmes/ican/${lvl.slug}`)}
                className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-display font-bold transition-all border ${
                  activeTab === lvl.slug
                    ? 'bg-[#16C784] text-[#06130D] border-[#16C784] shadow-glow-sm'
                    : 'bg-[#11161C] text-[#C2C9D4] border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                {lvl.shortName} Level ({lvl.courses.length})
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate('/programmes/ican/exemptions')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-display font-bold transition-all border ${
                activeTab === 'exemptions'
                  ? 'bg-[#16C784] text-[#06130D] border-[#16C784] shadow-glow-sm'
                  : 'bg-[#11161C] text-[#C2C9D4] border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              <Scale className="h-4 w-4" />
              Exemption & Entry Tool
            </button>
            <button
              type="button"
              onClick={() => navigate('/programmes/ican/guide')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-display font-bold transition-all border ${
                activeTab === 'guide'
                  ? 'bg-[#16C784] text-[#06130D] border-[#16C784] shadow-glow-sm'
                  : 'bg-[#11161C] text-[#C2C9D4] border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              Candidate Guide (10 FAQs)
            </button>
          </div>
        </div>
      </section>

      {isLevelTab && (
        <section className="py-14 sm:py-18">
          <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left: Courses, 3-Day Timetable, Registration Process & WhatsApp Desk */}
            <div className="lg:col-span-7 space-y-6">
              <div className="v-card p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      {activeLevel.shortName} Level Syllabus Courses
                    </h2>
                    <p className="text-xs text-[#9AA4B2] mt-0.5">
                      Clear all papers in this stage to advance · Selecting 3+ papers qualifies for an automatic 25% online tuition discount upon unlocking.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCourseIds(
                        selectedCourseIds.length === activeLevel.courses.length
                          ? []
                          : activeLevel.courses.map((c) => c.id)
                      )
                    }
                    className="text-xs font-semibold text-[#16C784] hover:underline"
                  >
                    {selectedCourseIds.length === activeLevel.courses.length
                      ? 'Clear all'
                      : `Select all ${activeLevel.courses.length}`}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeLevel.courses.map((c, idx) => {
                    const checked = selectedCourseIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCourse(c.id)}
                        className={`w-full flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                          checked
                            ? 'bg-[#16C784]/[0.08] border-[#16C784]/45'
                            : 'bg-[#0B0E11] border-white/[0.07] hover:border-white/[0.16]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                              checked
                                ? 'bg-[#16C784] border-[#16C784] text-[#06130D]'
                                : 'border-white/20'
                            }`}
                          >
                            {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {idx + 1}. {c.title}{' '}
                              <span className="font-display text-xs text-[#16C784]">({c.code})</span>
                            </p>
                            <p className="text-[11px] text-[#9AA4B2]">
                              {c.topics} syllabus modules · Study Pack: {formatNaira(c.studyPackPrice)} · Past Question: ₦9,000/course (6% off 2+)
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] text-[#9AA4B2] inline-flex items-center gap-1">
                          {unlocked ? (
                            <span className="tabular-nums-display font-bold text-[#16C784]">
                              {formatNaira(tuitionCalc.effectivePerCourse)}
                            </span>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 text-[#16C784]" /> Tuition locked
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Central Examination Authority 3-Day ICAN Timetable & Result Schedule */}
              <div className="v-card p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-white">
                    {activeDiet.label}: 3-Day Schedule & Timetable
                  </h3>
                  <Badge variant={dietLifecycle.badgeVariant}>{dietLifecycle.badgeLabel}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3">
                    <span className="text-[10.5px] text-[#667085] block">3 Exam Days (Tue–Thu)</span>
                    <span className="font-semibold text-white">{activeDiet.examWindow}</span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3">
                    <span className="text-[10.5px] text-[#667085] block">Exam Reg. Closes (−1 Wk)</span>
                    <span className="font-semibold text-[#EA3943]">
                      {activeDiet.registrationCloseFormatted}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3">
                    <span className="text-[10.5px] text-[#667085] block">Result Target (+30 Days)</span>
                    <span className="font-semibold text-[#16C784]">
                      {activeDiet.expectedResultFormatted}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {activeDiet.timetable.map((slot) => (
                    <div
                      key={slot.dayLabel}
                      className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3 text-xs space-y-1"
                    >
                      <div className="flex justify-between font-semibold text-[#16C784]">
                        <span>{slot.dayLabel}</span>
                        <span>{formatReadableDate(activeDiet.examDays[slot.dateIndex], false)}</span>
                      </div>
                      <p className="text-[#D5DBE3]">Morning: {slot.morning}</p>
                      <p className="text-[#9AA4B2]">Afternoon: {slot.afternoon}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#667085]">
                  Published by VALENCE Central Examination Authority. Whenever ICAN revises exam dates, paper slots or the 30-day result release date, updates reflect automatically here and across candidate notifications.
                </p>
              </div>

              {/* Official ICAN Exam Registration Process (First-Time vs Returning) */}
              <div className="v-card p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-[#16C784]" /> ICAN Exam Registration Process
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate('/programmes/ican/guide')}
                    className="text-xs font-semibold text-[#16C784] hover:underline"
                  >
                    Read Full 10-FAQ Guide →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-4 space-y-2.5">
                    <p className="font-display font-bold text-[#16C784]">For First-Time Students</p>
                    <ol className="space-y-2 text-[#C2C9D4]">
                      {icanRegistrationProcess.firstTime.map((s) => (
                        <li key={s.step}>
                          <strong className="text-white">{s.step}. {s.title}:</strong>{' '}
                          <span className="text-[#9AA4B2]">{s.detail}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-4 flex flex-col justify-between gap-3">
                    <div className="space-y-2.5">
                      <p className="font-display font-bold text-white">For Returning Students</p>
                      <ol className="space-y-2 text-[#C2C9D4]">
                        {icanRegistrationProcess.returning.map((s) => (
                          <li key={s.step}>
                            <strong className="text-white">{s.step}. {s.title}:</strong>{' '}
                            <span className="text-[#9AA4B2]">{s.detail}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <p className="text-[11px] text-[#9AA4B2] border-t border-white/[0.06] pt-2.5">
                      Typical completion without carryovers:{' '}
                      <strong className="text-[#16C784]">~1.5 yrs</strong> from Foundation ·{' '}
                      <strong className="text-[#16C784]">~1 yr</strong> from Skills ·{' '}
                      <strong className="text-[#16C784]">~6–12 mos</strong> via MCATI.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official ICAN Fee & Exemption Assistance via WhatsApp */}
              <div className="v-card p-6 space-y-4">
                <Badge variant="neutral">24/7 WhatsApp Support · {settings.whatsappNumber}</Badge>
                <h3 className="font-display text-lg font-bold text-white">
                  Official ICAN Fee &amp; Exemption Assistance
                </h3>
                <p className="text-xs leading-relaxed text-[#9AA4B2]">
                  Official ICAN student registration, annual subscription, one-time development levy, exemption processing, and examination fee assistance are handled via prefilled WhatsApp support. All online tuition and level unlocks run strictly in-app via Paystack, while independent verified physical tuition centres are listed in our{' '}
                  <Link to="/tuition-centres" className="text-[#16C784] underline">
                    Partner Directory
                  </Link>
                  .
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {whatsappEnquiryButtons.map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={() =>
                        openWhatsAppModal({
                          category: btn.category,
                          level: `ICAN ${activeLevel.shortName} Level`,
                        })
                      }
                      className="flex items-center justify-between rounded-xl bg-[#0B0E11] border border-white/[0.09] hover:border-[#16C784]/45 px-4 py-3 text-xs font-semibold text-[#F4F6F9] transition-colors group"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-[#16C784]" />
                        {btn.label}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#667085] group-hover:text-[#16C784]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Diet Selector + Countdown + Gated ₦3,000 Tuition Cost Implication */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
              <div className="v-card p-6 space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-white">
                    Tuition Application & Cost Implication
                  </h3>
                  <Badge variant={unlocked ? 'green' : 'neutral'}>
                    {unlocked ? 'Unlocked' : 'Locked'}
                  </Badge>
                </div>

                <div>
                  <label className="v-label" htmlFor="ican-diet-select">
                    Select ICAN Diet (Exam or Result Countdown)
                  </label>
                  <select
                    id="ican-diet-select"
                    value={selectedDietId}
                    onChange={(e) => setSelectedDietId(e.target.value)}
                    className="v-input text-xs"
                  >
                    {icanSessions.map((s) => {
                      const lc = getSessionLifecycle(s);
                      return (
                        <option key={s.id} value={s.id}>
                          {s.label} · {lc.badgeLabel}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {dietLifecycle.countdownTarget && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-[#16C784] flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {dietLifecycle.countdownLabel}
                    </p>
                    <CountdownTimer targetDate={dietLifecycle.countdownTarget} compact />
                  </div>
                )}

                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Level</span>
                    <span className="font-semibold text-white">ICAN {activeLevel.shortName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Papers Selected</span>
                    <span className="font-semibold text-white">
                      {selectedCourseIds.length} of {activeLevel.courses.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Multi-Course Tuition Rule</span>
                    <span className="font-semibold text-[#16C784]">
                      {selectedCourseIds.length >= 3
                        ? '25% Discount Eligible (3+ papers)'
                        : 'Select 3+ papers for 25% off'}
                    </span>
                  </div>
                </div>

                {unlocked ? (
                  <div className="rounded-xl bg-[#0B0E11] border border-[#16C784]/35 p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#16C784] font-semibold">
                      <Unlock className="h-3.5 w-3.5" /> {activeLevel.shortName} Cost Implication
                    </div>
                    <div className="flex justify-between text-[#9AA4B2]">
                      <span>Gross Online Tuition</span>
                      <span className="tabular-nums-display text-white">
                        {formatNaira(tuitionCalc.grossTuition)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#16C784]">
                      <span>Multi-Course Discount (25%)</span>
                      <span className="tabular-nums-display font-semibold">
                        −{formatNaira(tuitionCalc.discountAmount)}
                      </span>
                    </div>
                    <div className="border-t border-white/[0.08] pt-2 flex justify-between text-sm font-bold text-white">
                      <span>Net Online Tuition</span>
                      <span className="tabular-nums-display text-[#16C784]">
                        {formatNaira(tuitionCalc.netTuition)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-gradient-to-b from-[#16C784]/[0.08] to-[#0B0E11] border border-[#16C784]/30 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16C784]">
                        <Lock className="h-4 w-4" /> Tuition Cost Implication Locked
                      </span>
                      <span className="tabular-nums-display text-xl font-bold text-white">₦3,000</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#C2C9D4]">
                      Students pay the one-time <strong>₦3,000</strong> fee only when applying for{' '}
                      <strong>ICAN {activeLevel.shortName}</strong> tuition and unlocking full cost implications: in-app online tuition (25% off 3+ papers) plus the exact physical tuition cost implications set by the verified tuition centres advertising on VALENCE.
                    </p>
                    <ul className="space-y-1 text-[11px] text-[#9AA4B2]">
                      <li>• Permanently recorded for {activeLevel.shortName} Level only (never charged twice)</li>
                      <li>• Physical centre cost implications depend directly on each verified advertising centre&apos;s published rates</li>
                      <li>• Separate per ICAN level; does not offset official ICAN registration, subscription or exam fees</li>
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleIcanUnlock}
                  disabled={unlocking}
                  className="v-btn-primary w-full py-3"
                >
                  {unlocking ? 'Processing...' : <>Apply for Tuition & View Cost (₦3,000) <ArrowRight className="h-4 w-4" /></>}
                </button>

                <p className="text-[11px] text-center text-[#667085] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#16C784]" />
                  Verified Paystack checkout only · Free to join VALENCE without tuition
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'exemptions' && (
        /* ICAN EXEMPTION & STARTING-LEVEL GUIDANCE TOOL */
        <section className="py-14 sm:py-18">
          <div className="v-container space-y-8">
            {/* Official ICAN Accreditation, MCATI & Exemption Verification Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={settings.officialLinks.icanWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="v-card-hover p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="green">Official Exemption Portal</Badge>
                  <ExternalLink className="h-4 w-4 text-[#16C784]" />
                </div>
                <h3 className="font-display text-sm font-bold text-white">
                  4-Step Official ICAN Exemption Check
                </h3>
                <p className="text-xs text-[#9AA4B2]">
                  Visit <strong className="text-white">icanig.org/ican</strong> → Students → Exemptions → Professional → Professional Exemption Guide.
                </p>
              </a>

              <a
                href={settings.officialLinks.icanAccreditedInstitutions}
                target="_blank"
                rel="noopener noreferrer"
                className="v-card-hover p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="verified">Skills Entry · Accounting</Badge>
                  <ExternalLink className="h-4 w-4 text-[#16C784]" />
                </div>
                <h3 className="font-display text-sm font-bold text-white">
                  Check ICAN-Accredited Institutions (PDF)
                </h3>
                <p className="text-xs text-[#9AA4B2]">
                  For Accounting graduates only: accredited graduates start at <strong className="text-[#16C784]">Skills Level</strong> (exempted from Foundation + AAF).
                </p>
              </a>

              <a
                href={settings.officialLinks.icanMcatiInstitutions}
                target="_blank"
                rel="noopener noreferrer"
                className="v-card-hover p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="verified">Professional Entry · MCATI</Badge>
                  <ExternalLink className="h-4 w-4 text-[#16C784]" />
                </div>
                <h3 className="font-display text-sm font-bold text-white">
                  Check MCATI Partner Institutions (PDF)
                </h3>
                <p className="text-xs text-[#9AA4B2]">
                  For Accounting graduates only: MCATI graduates start directly at <strong className="text-[#16C784]">Professional Level</strong>.
                </p>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form onSubmit={runExemptionCheck} className="lg:col-span-6 v-card p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-white">
                    Qualification & Starting-Level Check
                  </h2>
                  <Badge variant="green">Free Advisory Tool</Badge>
                </div>

                <div>
                  <label className="v-label" htmlFor="ex-qual">
                    Entry Route & Academic / Technical Qualification
                  </label>
                  <select
                    id="ex-qual"
                    value={exInput.qualificationKey}
                    onChange={(e) => setExInput({ ...exInput, qualificationKey: e.target.value })}
                    className="v-input text-xs"
                  >
                    {exemptionRules.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <UniversitySelect
                  id="ex-university"
                  label="Awarding Nigerian University / Polytechnic / Institution"
                  value={exInput.institution}
                  onChange={(val) => setExInput({ ...exInput, institution: val })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="v-label" htmlFor="ex-year">Graduation Year</label>
                    <input
                      id="ex-year"
                      type="number"
                      min="1980"
                      max="2032"
                      value={exInput.graduationYear}
                      onChange={(e) => setExInput({ ...exInput, graduationYear: e.target.value })}
                      className="v-input"
                    />
                  </div>
                  <div>
                    <label className="v-label" htmlFor="ex-course">Course Studied</label>
                    <input
                      id="ex-course"
                      type="text"
                      value={exInput.courseStudied}
                      onChange={(e) => setExInput({ ...exInput, courseStudied: e.target.value })}
                      placeholder="e.g. Accounting"
                      className="v-input"
                    />
                  </div>
                  <div>
                    <label className="v-label" htmlFor="ex-pro">Prof. Credential</label>
                    <select
                      id="ex-pro"
                      value={exInput.professionalQualification}
                      onChange={(e) =>
                        setExInput({ ...exInput, professionalQualification: e.target.value })
                      }
                      className="v-input"
                    >
                      <option value="NONE">None</option>
                      <option value="ACCA_AFFILIATE_MEMBER">ACCA</option>
                      <option value="CITN_ACTI">CITN (ACTI)</option>
                      <option value="CIMA_ACMA">CIMA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="v-label">Previous ICAN Examination History (Tick Passed Papers)</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allIcanCourses.map((c) => {
                      const active = exInput.priorPassedCodes.includes(c.code);
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => togglePriorPaper(c.code)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-display font-semibold border transition-colors ${
                            active
                              ? 'bg-[#16C784] text-[#06130D] border-[#16C784]'
                              : 'bg-[#0B0E11] text-[#9AA4B2] border-white/[0.08] hover:text-white'
                          }`}
                        >
                          {c.code}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="v-label" htmlFor="ex-docs">Supporting Documents Available</label>
                  <input
                    id="ex-docs"
                    type="text"
                    value={exInput.supportingDocNote}
                    onChange={(e) => setExInput({ ...exInput, supportingDocNote: e.target.value })}
                    placeholder="e.g. Official transcript, ND/AAT/BSc certificate, NYSC discharge"
                    className="v-input"
                  />
                </div>

                <button type="submit" className="v-btn-primary w-full py-3">
                  <Scale className="h-4 w-4" /> Check Starting Level & Potential Exemptions
                </button>
              </form>

              <div className="lg:col-span-6 space-y-5">
                {!exResult ? (
                  <div className="v-card p-7 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-[#16C784]/[0.12] border border-[#16C784]/25 flex items-center justify-center text-[#16C784] shrink-0">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">
                          Quick Starting-Level Summary
                        </h3>
                        <p className="text-xs text-[#9AA4B2]">
                          Run the form on the left for your full paper-by-paper breakdown.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {[
                        { q: "O'Level or ND (Non-Accounting)", start: 'Start from ATS 1 (~2.5 yrs)' },
                        { q: 'ND Banking & Finance', start: 'Start from ATS 2 (Exempt ATS 1)' },
                        { q: 'ND Accounting', start: 'Start from ATS 3 (Exempt ATS 1 & 2)' },
                        { q: 'B.Sc./HND Non-Accounting', start: 'Start from Foundation (~1.5 yrs)' },
                        { q: 'Accounting (Non-Accredited School)', start: 'Foundation (usually MA only)' },
                        { q: 'Accounting (ICAN-Accredited School)', start: 'Skills (Exempt Foundation + AAF · ~1 yr)' },
                        { q: 'Accounting (MCATI Partner School)', start: 'Direct to Professional Level' },
                      ].map((row) => (
                        <div
                          key={row.q}
                          className="rounded-xl bg-[#0B0E11] border border-white/[0.07] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2"
                        >
                          <span className="text-[#D5DBE3] font-medium">{row.q}</span>
                          <span className="font-display font-bold text-[#16C784]">{row.start}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-[#667085]">
                      ICAN holds sole authority for final exemption approvals. VALENCE never automatically removes a course from enrolment.
                    </p>
                  </div>
                ) : (
                  <div className="v-card p-6 sm:p-7 space-y-5 animate-fade-up">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="green">Exemption & Entry Output</Badge>
                      <span className="text-xs text-[#9AA4B2]">
                        {exInput.institution || 'Candidate Assessment'} ({exInput.graduationYear})
                      </span>
                    </div>

                    {/* Recommended Starting Level & Completion Estimate */}
                    <div className="rounded-2xl bg-[#16C784]/10 border border-[#16C784]/35 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10.5px] uppercase tracking-wider text-[#9AA4B2] block">
                          Recommended Starting Stage
                        </span>
                        <span className="font-display text-sm font-bold text-[#16C784]">
                          {exResult.startingLevel}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10.5px] uppercase tracking-wider text-[#9AA4B2] block">
                          Estimated Time (No Carryovers)
                        </span>
                        <span className="font-display text-sm font-bold text-white">
                          {exResult.estimatedDuration}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-white">
                        {exResult.ruleTitle}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#9AA4B2]">
                        {exResult.guidance}
                      </p>
                    </div>

                    {exResult.isAtswaRoute ? (
                      <div className="rounded-xl bg-[#0B0E11] border border-[#16C784]/25 p-4 space-y-2 text-xs">
                        <p className="font-bold text-[#16C784]">ATSWA Entry Pathway</p>
                        <p className="text-[#D5DBE3]">
                          {exResult.atswaExemptedLevels.length > 0
                            ? `Potential ATSWA Exemptions: ${exResult.atswaExemptedLevels.join(', ')}. Complete remaining ATSWA level(s) to earn your AAT certificate, then advance to ICAN Skills & Professional.`
                            : 'Commence at ATS 1 → ATS 2 → ATS 3 to earn your AAT certificate, then advance directly to ICAN Skills & Professional.'}
                        </p>
                        <Link
                          to="/programmes/atswa"
                          className="inline-flex items-center gap-1 font-semibold text-[#16C784] hover:underline pt-1"
                        >
                          Go to ATSWA Programme Page <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-[#0B0E11] border border-[#16C784]/25 p-4 space-y-2.5">
                          <p className="text-xs font-bold text-[#16C784]">
                            Potential Exemptions ({exResult.potentialExemptions.length})
                          </p>
                          {exResult.potentialExemptions.length === 0 ? (
                            <p className="text-xs text-[#9AA4B2]">
                              No standard automatic exemptions; commence from Foundation Level (all 4 courses).
                            </p>
                          ) : (
                            <ul className="space-y-1 text-xs text-[#D5DBE3]">
                              {exResult.potentialExemptions.map((c) => (
                                <li key={c.code} className="flex items-center justify-between gap-2">
                                  <span className="truncate">{c.title}</span>
                                  <span className="text-[#16C784] font-display font-semibold shrink-0">
                                    {c.code}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-2.5">
                          <p className="text-xs font-bold text-white">
                            Remaining Papers to Write ({exResult.remainingCourses.length})
                          </p>
                          <ul className="space-y-1 text-xs text-[#9AA4B2]">
                            {exResult.remainingCourses.map((c) => (
                              <li key={c.code} className="flex items-center justify-between gap-2">
                                <span className="text-[#D5DBE3] truncate">{c.title}</span>
                                <span className="text-[10.5px] text-[#9AA4B2] shrink-0">{c.level}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-white">Relevant Conditions:</p>
                      <ul className="space-y-1.5 text-xs text-[#9AA4B2]">
                        {exResult.conditions.map((cond) => (
                          <li key={cond} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                            <span>{cond}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-white">Recommended Next Steps:</p>
                      <ol className="space-y-1.5 text-xs text-[#9AA4B2] list-decimal list-inside">
                        {exResult.nextSteps.map((st) => (
                          <li key={st}>{st}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="rounded-xl bg-[#EA3943]/10 border border-[#EA3943]/30 p-3.5 flex items-start gap-2.5 text-xs text-[#F4F6F9]">
                      <AlertTriangle className="h-4 w-4 text-[#EA3943] shrink-0 mt-0.5" />
                      <p>{exResult.disclaimer}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'guide' && (
        /* PROSPECTIVE ICAN CANDIDATE GUIDE, 10 FREQUENTLY ASKED QUESTIONS */
        <section className="py-14 sm:py-18">
          <div className="v-container space-y-10">
            {/* Completion Timeline Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {completionTimelines.map((item) => (
                <div key={item.route} className="v-card p-5 space-y-2">
                  <span className="font-display text-2xl font-bold text-[#16C784] tabular-nums-display">
                    {item.estimate}
                  </span>
                  <h3 className="font-display text-sm font-bold text-white">{item.route}</h3>
                  <p className="text-[11px] font-medium text-[#C2C9D4]">{item.diets}</p>
                  <p className="text-[11px] text-[#9AA4B2] leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>

            {/* All 10 Official ICAN Candidate FAQs */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    ICAN Programme: 10 Frequently Asked Questions
                  </h2>
                  <p className="text-xs text-[#9AA4B2] mt-0.5">
                    A clear, step-by-step orientation guide for prospective ATSWA and ICAN (ACA) candidates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandAllFaqs((v) => !v)}
                  className="v-btn-secondary text-xs"
                >
                  {expandAllFaqs ? 'Collapse to Accordion' : 'Expand All 10 Answers'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {candidateFaqs.map((faq) => {
                  const isOpen = expandAllFaqs || openFaqNum === faq.num;
                  return (
                    <div key={faq.num} className="v-card overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          if (expandAllFaqs) setExpandAllFaqs(false);
                          setOpenFaqNum(openFaqNum === faq.num && !expandAllFaqs ? 0 : faq.num);
                        }}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="tabular-nums-display inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#16C784]/[0.12] border border-[#16C784]/30 text-xs font-bold text-[#16C784]">
                            {String(faq.num).padStart(2, '0')}
                          </span>
                          <span className="font-display text-sm sm:text-base font-bold text-white">
                            {faq.q}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-[#9AA4B2] transition-transform ${
                            isOpen ? 'rotate-180 text-[#16C784]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] space-y-3 text-xs sm:text-sm text-[#C2C9D4]">
                          <p className="text-[#9AA4B2] leading-relaxed">{faq.a}</p>

                          {faq.bullets && (
                            <ul className="space-y-1.5">
                              {faq.bullets.map((b) => (
                                <li key={b} className="flex items-start gap-2 text-xs sm:text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {faq.links && (
                            <div className="flex flex-wrap gap-2.5 pt-1">
                              {faq.links.map((lnk) => (
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

                          {faq.tagline && (
                            <p className="font-display text-sm sm:text-base font-bold italic text-[#16C784] pt-1">
                              {faq.tagline}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Closing Motivational Action Banner */}
            <div className="v-glass-card p-6 sm:p-8 border-[#16C784]/35 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#16C784]">
                  <Sparkles className="h-4 w-4" /> Start Your ACA Journey on VALENCE
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  “If I can, you CAN. That’s why it’s ICAN.”
                </h3>
                <p className="text-xs sm:text-sm text-[#9AA4B2]">
                  Check your exact entry level, create a free learner account, or apply for structured ATSWA & ICAN online tuition.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/programmes/ican/exemptions')}
                  className="v-btn-secondary text-xs"
                >
                  <Scale className="h-4 w-4 text-[#16C784]" /> Check My Starting Level
                </button>
                <Link to="/portal/student?mode=register" className="v-btn-primary text-xs">
                  Join VALENCE Free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
