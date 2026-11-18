import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  Lock,
  Unlock,
  ExternalLink,
  ArrowRight,
  FileText,
  ShieldCheck,
  Calendar,
  Clock,
  UploadCloud,
  Send,
  ShoppingBag,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import CountdownTimer from '../components/ui/CountdownTimer';
import { calculateAtswaTuition, formatNaira } from '../lib/pricing';
import { formatReadableDate, getSessionLifecycle } from '../lib/examSchedule';

export default function AtswaPage() {
  const {
    atswaLevels,
    atswaEntryPathways,
    atswaRegistrationGuide,
    sessions,
    settings,
    isLevelUnlocked,
    submitInAppTicket,
  } = usePlatform();
  const toast = useToast();

  const atswaSessions = useMemo(
    () => sessions.filter((s) => s.programme === 'ATSWA'),
    [sessions]
  );

  const [selectedLevelId, setSelectedLevelId] = useState('ats-1');
  const [selectedDietId, setSelectedDietId] = useState(atswaSessions[0]?.id || 'atswa-mar-2027');
  const [selectedCourseIds, setSelectedCourseIds] = useState([
    'ats1-baps',
    'ats1-eco',
    'ats1-cs',
    'ats1-bl',
  ]);

  // Interactive In-App ATSWA Document Readiness & Registration Guidance state
  const [checkedDocs, setCheckedDocs] = useState([]);
  const [showGuidanceForm, setShowGuidanceForm] = useState(false);
  const [guidanceForm, setGuidanceForm] = useState({
    fullName: '',
    email: '',
    entryQualification: "O'Level Result (WAEC / NECO / NABTEB)",
    question: '',
  });
  const [submittedRef, setSubmittedRef] = useState(null);

  const activeLevel = atswaLevels.find((l) => l.id === selectedLevelId) || atswaLevels[0];
  const activeDiet = atswaSessions.find((s) => s.id === selectedDietId) || atswaSessions[0];
  const dietLifecycle = getSessionLifecycle(activeDiet);
  const unlocked = isLevelUnlocked(`atswa:${activeLevel.id}`);

  const handleSelectLevel = (lvl) => {
    setSelectedLevelId(lvl.id);
    setSelectedCourseIds(lvl.courses.map((c) => c.id));
    setCheckedDocs([]);
  };

  const toggleCourse = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleDoc = (doc) => {
    setCheckedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const tuitionCalc = useMemo(
    () =>
      calculateAtswaTuition(selectedCourseIds.length, {
        basePerCourse: activeLevel.tuitionPerCourse,
        discountThreshold: activeLevel.discountMinCourses,
        discountRate: activeLevel.discountRate,
        maxTuition: activeLevel.maxTuition,
        unlockFee: activeLevel.unlockFee,
      }),
    [selectedCourseIds.length, activeLevel]
  );

  const handleUnlockRedirect = () => {
    if (selectedCourseIds.length === 0) {
      toast.warning('Select at least one course', 'Pick the ATSWA papers you intend to take.');
      return;
    }
    toast.info(
      `Unlock ${activeLevel.code} Cost Implication (₦3,000)`,
      'Only required when applying for tuition. Sign in to complete your one-time Paystack unlock.'
    );
  };

  const handleGuidanceSubmit = (e) => {
    e.preventDefault();
    const ticket = submitInAppTicket('atswa', {
      ...guidanceForm,
      level: activeLevel.code,
      diet: activeDiet.label,
      readyDocuments: checkedDocs,
    });
    setSubmittedRef(ticket.id);
    toast.success(
      `ATSWA Guidance Logged In-App (${ticket.id})`,
      'Your document checklist & registration request are saved for in-app review inside your Student Portal.'
    );
    setGuidanceForm((prev) => ({ ...prev, question: '' }));
  };

  const allDocsReady =
    activeLevel.requiredDocuments.length > 0 &&
    checkedDocs.length === activeLevel.requiredDocuments.length;

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">ATSWA · MARCH & SEPTEMBER DIETS (2 EXAM DAYS)</Badge>
              <Badge variant="neutral">In-App Document & Registration Guidance</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
              Accounting Technicians Scheme West Africa (ATS 1 – ATS 3)
            </h1>
            <p className="text-sm sm:text-base text-[#9AA4B2]">
              Complete your ATSWA document checklist, registration guidance and 2-day diet timetable review directly inside VALENCE. You only pay the one-time{' '}
              <strong className="text-[#16C784]">₦3,000 registration</strong> per level if applying for online tuition and unlocking your full cost implication (credited/waived as your tutorial registration fee).
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 self-start shrink-0">
            <a
              href={settings.officialLinks.atswaSoftCopy}
              target="_blank"
              rel="noopener noreferrer"
              className="v-btn-secondary text-xs"
            >
              Official Soft-Copy Portal <ExternalLink className="h-4 w-4 text-[#16C784]" />
            </a>
            <Link
              to={`/store?category=atswa_past_question&level=${encodeURIComponent(activeLevel.code)}`}
              className="v-btn-secondary text-xs"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#16C784]" /> Per-Course PQs (₦5,500)
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-18">
        <div className="v-container space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-2xl bg-[#11161C] border border-white/[0.08] p-1.5 gap-1">
              {atswaLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleSelectLevel(lvl)}
                  className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-display font-bold transition-all ${
                    selectedLevelId === lvl.id
                      ? 'bg-[#16C784] text-[#06130D] shadow-glow-sm'
                      : 'text-[#9AA4B2] hover:text-white'
                  }`}
                >
                  {lvl.code}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#16C784]" />
              <span className="text-xs text-[#9AA4B2]">Intended Diet:</span>
              <select
                value={selectedDietId}
                onChange={(e) => setSelectedDietId(e.target.value)}
                aria-label="Select intended ATSWA examination diet"
                className="rounded-xl bg-[#11161C] border border-white/[0.1] px-3 py-2 text-xs font-semibold text-white focus:border-[#16C784] focus:outline-none"
              >
                {atswaSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.diet} {s.year} ({s.examWindow})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left: Courses, 2-Day Timetable, Entry Route & In-App Document/Registration Guidance */}
            <div className="lg:col-span-7 space-y-6">
              <div className="v-card p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">{activeLevel.name}</h2>
                    <p className="text-xs text-[#9AA4B2] mt-1">{activeLevel.summary}</p>
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
                      ? 'Clear selection'
                      : 'Select all 4 courses'}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeLevel.courses.map((course, idx) => {
                    const checked = selectedCourseIds.includes(course.id);
                    return (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                        className={`w-full flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                          checked
                            ? 'bg-[#16C784]/[0.08] border-[#16C784]/45'
                            : 'bg-[#0B0E11] border-white/[0.07] hover:border-white/[0.16]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                              checked
                                ? 'bg-[#16C784] border-[#16C784] text-[#06130D]'
                                : 'border-white/20 bg-transparent'
                            }`}
                          >
                            {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {idx + 1}. {course.title}{' '}
                              <span className="text-xs text-[#16C784] font-display">
                                ({course.code})
                              </span>
                            </p>
                            <p className="text-[11px] text-[#9AA4B2]">
                              {course.topics} syllabus units · Past Question: ₦5,500/course (9% off 2+)
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] font-medium text-[#9AA4B2] inline-flex items-center gap-1">
                          {unlocked ? (
                            <span className="tabular-nums-display font-bold text-[#16C784]">
                              {formatNaira(tuitionCalc.effectivePerCourse)}
                            </span>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 text-[#16C784]" /> Unlocked on apply
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Official 2-Day ATSWA Exam Schedule & Timetable */}
              <div className="v-card p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-white">
                    {activeDiet.label} — 2-Day Schedule & Timetable
                  </h3>
                  <Badge variant={dietLifecycle.badgeVariant}>{dietLifecycle.badgeLabel}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-xl bg-[#0B0E11] p-3 border border-white/[0.06]">
                    <span className="text-[10.5px] text-[#667085] block">2 Exam Days (Tue & Wed)</span>
                    <span className="font-semibold text-white">{activeDiet.examWindow}</span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11] p-3 border border-white/[0.06]">
                    <span className="text-[10.5px] text-[#667085] block">Exam Reg. Closes (−1 Wk)</span>
                    <span className="font-semibold text-[#EA3943]">
                      {activeDiet.registrationCloseFormatted}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0B0E11] p-3 border border-white/[0.06]">
                    <span className="text-[10.5px] text-[#667085] block">Result Release (+30 Days)</span>
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
                <p className="text-[11px] text-[#667085]">{activeDiet.authorityNotice}</p>
              </div>

              {/* ATSWA Entry Route & Progression Rules */}
              <div className="v-card p-5 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-white">
                    Where Do I Start in ATSWA? (Undergraduate & ND Route)
                  </h3>
                  <Badge variant="green">~2.5 Yrs Full ATSWA → ACA</Badge>
                </div>
                <p className="text-xs text-[#9AA4B2]">
                  Pass all 4 courses in a level before moving to the next. After clearing ATS 3, you earn the{' '}
                  <strong className="text-white">AAT certificate</strong> and progress directly to ICAN{' '}
                  <strong className="text-[#16C784]">Skills & Professional Levels</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {atswaEntryPathways.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-3.5 space-y-1"
                    >
                      <p className="font-display font-bold text-[#16C784]">{p.startAt}</p>
                      <p className="font-semibold text-white">{p.qualification}</p>
                      <p className="text-[11px] text-[#9AA4B2]">{p.exemptions}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* IN-APP ATSWA Document Checklist & Registration Guidance (100% On-App, Admin-Editable) */}
              <div id="document-guidance" className="v-card p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#16C784]" /> In-App {activeLevel.code} Document & Registration Guidance
                  </h3>
                  <Badge variant={allDocsReady ? 'green' : 'neutral'}>
                    {allDocsReady
                      ? 'All Documents Ready'
                      : `${checkedDocs.length}/${activeLevel.requiredDocuments.length} Checked`}
                  </Badge>
                </div>

                <p className="text-xs text-[#9AA4B2]">
                  Tick each required document below to verify readiness and complete your ATSWA registration & document verification directly inside VALENCE (requirements & steps are kept updated via the Admin Portal).
                </p>

                {/* Interactive Document Readiness Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {activeLevel.requiredDocuments.map((doc) => {
                    const ready = checkedDocs.includes(doc);
                    return (
                      <button
                        key={doc}
                        type="button"
                        onClick={() => toggleDoc(doc)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition-all ${
                          ready
                            ? 'bg-[#16C784]/12 border-[#16C784]/45 text-white'
                            : 'bg-[#0B0E11] border-white/[0.07] text-[#C2C9D4] hover:border-white/[0.18]'
                        }`}
                      >
                        <span
                          className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            ready
                              ? 'bg-[#16C784] border-[#16C784] text-[#06130D]'
                              : 'border-white/25'
                          }`}
                        >
                          {ready && <Check className="h-3 w-3 stroke-[3]" />}
                        </span>
                        <span className="font-medium leading-snug">{doc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 4-Step In-App Registration Workflow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {atswaRegistrationGuide.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3.5 space-y-1"
                    >
                      <p className="font-display font-bold text-[#16C784]">
                        Step {item.step} · <span className="text-white">{item.title}</span>
                      </p>
                      <p className="text-[11px] text-[#9AA4B2] leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>

                {/* In-App Document Upload & Registration Guidance Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <Link
                    to={`/portal/student?programme=atswa&level=${activeLevel.id}&section=documents`}
                    className="v-btn-primary text-xs py-2.5 px-4"
                  >
                    <UploadCloud className="h-4 w-4" /> Upload {activeLevel.code} Documents in Student Portal
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowGuidanceForm((v) => !v)}
                    className="v-btn-secondary text-xs py-2.5 px-4"
                  >
                    {showGuidanceForm ? 'Hide In-App Guidance Form' : 'Request In-App Registration Guidance'}
                  </button>
                </div>

                {submittedRef && (
                  <div className="rounded-xl bg-[#16C784]/10 border border-[#16C784]/35 p-3.5 text-xs text-[#E5E9F0]">
                    <strong className="text-[#16C784]">Reference {submittedRef} logged in-app.</strong>{' '}
                    Track document verification feedback and admin responses inside your VALENCE Student Portal.
                  </div>
                )}

                {showGuidanceForm && (
                  <form
                    onSubmit={handleGuidanceSubmit}
                    className="rounded-2xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-3 animate-fade-up"
                  >
                    <p className="font-display text-xs font-bold uppercase tracking-wider text-[#16C784]">
                      In-App {activeLevel.code} Document & Registration Request
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="v-label" htmlFor="ag-name">Full Name</label>
                        <input
                          id="ag-name"
                          type="text"
                          required
                          value={guidanceForm.fullName}
                          onChange={(e) =>
                            setGuidanceForm({ ...guidanceForm, fullName: e.target.value })
                          }
                          placeholder="Surname & First Name"
                          className="v-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="v-label" htmlFor="ag-email">Email Address</label>
                        <input
                          id="ag-email"
                          type="email"
                          required
                          value={guidanceForm.email}
                          onChange={(e) =>
                            setGuidanceForm({ ...guidanceForm, email: e.target.value })
                          }
                          placeholder="you@example.com"
                          className="v-input text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="v-label" htmlFor="ag-qual">Entry Qualification</label>
                      <select
                        id="ag-qual"
                        value={guidanceForm.entryQualification}
                        onChange={(e) =>
                          setGuidanceForm({ ...guidanceForm, entryQualification: e.target.value })
                        }
                        className="v-input text-xs"
                      >
                        <option>O&apos;Level Result (WAEC / NECO / NABTEB) — ATS 1 Entry</option>
                        <option>ND Non-Accounting — ATS 1 Entry</option>
                        <option>ND Banking &amp; Finance — ATS 2 Entry (Exempt ATS 1)</option>
                        <option>ND Accounting — ATS 3 Entry (Exempt ATS 1 &amp; 2)</option>
                        <option>Returning ATSWA Candidate (Passed Previous ATS Level)</option>
                      </select>
                    </div>
                    <div>
                      <label className="v-label" htmlFor="ag-q">
                        Document or Registration Details
                      </label>
                      <textarea
                        id="ag-q"
                        rows={2}
                        required
                        value={guidanceForm.question}
                        onChange={(e) =>
                          setGuidanceForm({ ...guidanceForm, question: e.target.value })
                        }
                        placeholder="Ask about document format, O'Level combination, ND exemption slip or ATSWA registration number..."
                        className="v-input text-xs resize-none"
                      />
                    </div>
                    <button type="submit" className="v-btn-primary text-xs py-2.5 px-4">
                      <Send className="h-3.5 w-3.5" /> Submit In-App Guidance Request
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Tuition Application & Gated Cost Implication Panel */}
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

                {dietLifecycle.countdownTarget && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-[#9AA4B2] flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#16C784]" /> {dietLifecycle.countdownLabel}
                    </p>
                    <CountdownTimer targetDate={dietLifecycle.countdownTarget} compact />
                  </div>
                )}

                <div className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Selected Level</span>
                    <span className="font-semibold text-white">{activeLevel.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Selected Courses</span>
                    <span className="font-semibold text-white">
                      {selectedCourseIds.length} of {activeLevel.courses.length} papers
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Multi-Course Benefit</span>
                    <span className="font-semibold text-[#16C784]">
                      {selectedCourseIds.length >= 2
                        ? '25% Tuition Discount Eligible'
                        : 'Select 2+ courses for 25% off'}
                    </span>
                  </div>
                </div>

                {unlocked ? (
                  <div className="rounded-xl bg-[#0B0E11] border border-[#16C784]/35 p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#16C784] font-semibold">
                      <Unlock className="h-3.5 w-3.5" /> {activeLevel.code} Cost Implication Unlocked
                    </div>
                    <div className="flex justify-between text-[#9AA4B2]">
                      <span>Online Tuition ({tuitionCalc.courseCount} courses)</span>
                      <span className="tabular-nums-display font-bold text-white">
                        {formatNaira(tuitionCalc.netTuition)}
                      </span>
                    </div>
                    {activeLevel.officialFees.icanRegistration && (
                      <div className="flex justify-between text-[#9AA4B2]">
                        <span>ICAN Registration Fee</span>
                        <span className="tabular-nums-display text-white">
                          {formatNaira(activeLevel.officialFees.icanRegistration)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#9AA4B2]">
                      <span>Full Exam Fee · Annual Subscription</span>
                      <span className="tabular-nums-display text-white">
                        {formatNaira(activeLevel.officialFees.fullExamFee)} ·{' '}
                        {formatNaira(activeLevel.officialFees.annualSubscription)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-gradient-to-b from-[#16C784]/[0.08] to-[#0B0E11] border border-[#16C784]/30 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16C784]">
                        <Lock className="h-4 w-4" /> Cost Implication Locked
                      </span>
                      <span className="tabular-nums-display text-xl font-bold text-white">₦3,000</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#C2C9D4]">
                      Joining VALENCE is free. Pay the one-time <strong>₦3,000</strong> registration for{' '}
                      <strong>{activeLevel.code}</strong> only when you want to apply for tuition and reveal your full cost implication (tuition, automatic 25% multi-course savings, examination and annual subscription breakdown).
                    </p>
                    <ul className="space-y-1 text-[11px] text-[#9AA4B2]">
                      <li>• Permanently unlocks {activeLevel.code} — never charged twice</li>
                      <li>• Credited/waived as your ATSWA tutorial registration fee</li>
                      <li>• Verified server-side via Paystack; unlocks Google Meet enrolment</li>
                    </ul>
                  </div>
                )}

                <Link
                  to={`/portal/student?programme=atswa&level=${activeLevel.id}&diet=${activeDiet.id}&apply=tuition`}
                  onClick={handleUnlockRedirect}
                  className="v-btn-primary w-full py-3"
                >
                  Apply for {activeLevel.code} Tuition & View Cost (₦3,000){' '}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#667085]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#16C784]" />
                  Paystack exclusive online checkout · In-app ATSWA document desk
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
