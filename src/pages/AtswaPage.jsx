import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  Lock,
  ExternalLink,
  ArrowRight,
  FileText,
  ShieldCheck,
  Calendar,
  Video,
  MessageCircle,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { calculateAtswaTuition, formatNaira } from '../lib/pricing';

export default function AtswaPage() {
  const { atswaLevels, sessions, settings, openWhatsAppModal } = usePlatform();
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

  const activeLevel = atswaLevels.find((l) => l.id === selectedLevelId) || atswaLevels[0];
  const activeDiet = atswaSessions.find((s) => s.id === selectedDietId) || atswaSessions[0];

  const handleSelectLevel = (lvl) => {
    setSelectedLevelId(lvl.id);
    setSelectedCourseIds(lvl.courses.map((c) => c.id));
  };

  const toggleCourse = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
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

  const handleProceed = () => {
    if (selectedCourseIds.length === 0) {
      toast.warning('Select at least one course', 'Choose 1 to 4 ATSWA courses to enrol.');
      return;
    }
    toast.info(
      `${activeLevel.code} Selection Ready (${formatNaira(tuitionCalc.netTuition)})`,
      `Diet: ${activeDiet.label}. Sign in via Student Portal to unlock level & complete Paystack checkout.`
    );
  };

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Hero */}
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">ATSWA PROGRAMME · MARCH & SEPTEMBER DIETS</Badge>
              <Badge variant="neutral">Initial Upcoming Diet: March 2027</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
              Accounting Technicians Scheme West Africa (ATS 1 – ATS 3)
            </h1>
            <p className="text-sm sm:text-base text-[#9AA4B2]">
              Complete syllabus coverage, live authorised Google Meet classes, syllabus reading trackers and transparent tuition pricing: <strong className="text-white">₦20,000 per course</strong> with an automatic <strong className="text-[#16C784]">25% discount on 2 or more courses</strong> (maximum <strong className="text-white">₦60,000</strong> for all four courses).
            </p>
          </div>
          <a
            href={settings.officialLinks.atswaSoftCopy}
            target="_blank"
            rel="noopener noreferrer"
            className="v-btn-secondary text-xs self-start shrink-0"
          >
            Official ATSWA Soft-Copy Resources <ExternalLink className="h-4 w-4 text-[#16C784]" />
          </a>
        </div>
      </section>

      {/* Interactive ATSWA Level Selector & Tuition Calculator */}
      <section className="py-14 sm:py-18">
        <div className="v-container space-y-8">
          {/* Level Tabs */}
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

            {/* Diet Selector */}
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
            {/* Left: Course Picker + Official Fees + Documents */}
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
                              {course.topics} syllabus units · Live Google Meet + practice bank
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {tuitionCalc.qualifiesForDiscount && checked ? (
                            <>
                              <span className="block tabular-nums-display text-sm font-bold text-[#16C784]">
                                ₦15,000
                              </span>
                              <span className="block tabular-nums-display text-[11px] line-through text-[#667085]">
                                ₦20,000
                              </span>
                            </>
                          ) : (
                            <span className="tabular-nums-display text-sm font-bold text-[#F4F6F9]">
                              ₦20,000
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Official Applicable Fees & Required Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="v-card p-5 space-y-3">
                  <h3 className="font-display text-base font-bold text-white">
                    {activeLevel.code} Official Fee Schedule
                  </h3>
                  <p className="text-[11px] text-[#667085]">
                    Paid according to official diet deadlines (tuition discounts do not apply to official fees):
                  </p>
                  <div className="space-y-2 text-xs">
                    {activeLevel.officialFees.icanRegistration && (
                      <div className="flex justify-between rounded-lg bg-[#0B0E11] px-3 py-2">
                        <span className="text-[#9AA4B2]">ICAN Registration Fee</span>
                        <span className="tabular-nums-display font-bold text-white">
                          {formatNaira(activeLevel.officialFees.icanRegistration)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between rounded-lg bg-[#0B0E11] px-3 py-2">
                      <span className="text-[#9AA4B2]">Full Examination Fee</span>
                      <span className="tabular-nums-display font-bold text-white">
                        {formatNaira(activeLevel.officialFees.fullExamFee)}
                      </span>
                    </div>
                    <div className="flex justify-between rounded-lg bg-[#0B0E11] px-3 py-2">
                      <span className="text-[#9AA4B2]">Annual Subscription</span>
                      <span className="tabular-nums-display font-bold text-white">
                        {formatNaira(activeLevel.officialFees.annualSubscription)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="v-card p-5 space-y-3">
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#16C784]" /> Required Documents ({activeLevel.code})
                  </h3>
                  <ul className="space-y-2 text-xs text-[#C2C9D4]">
                    {activeLevel.requiredDocuments.map((doc) => (
                      <li
                        key={doc}
                        className="flex items-center gap-2 rounded-lg bg-[#0B0E11] px-3 py-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsAppModal({
                        category: 'ATSWA Document & Registration Guidance',
                        level: `ATSWA — ${activeLevel.code}`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16C784] hover:underline pt-1"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Ask about document submission
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Sticky Live Tuition & Unlock Summary */}
            <div className="lg:col-span-5 v-card p-6 space-y-5 lg:sticky lg:top-28">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">
                  Live Tuition Summary
                </h3>
                <Badge variant={tuitionCalc.qualifiesForDiscount ? 'green' : 'neutral'}>
                  {tuitionCalc.qualifiesForDiscount ? '25% Discount Active' : 'Select 2+ for 25% Off'}
                </Badge>
              </div>

              {/* Step 1: One-Time Level Unlock Box */}
              <div className="rounded-xl bg-[#0B0E11] border border-[#16C784]/25 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#16C784] inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> Step 1 · {activeLevel.code} Level Unlock
                  </span>
                  <span className="tabular-nums-display text-sm font-bold text-white">
                    {formatNaira(tuitionCalc.unlockFee)}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#9AA4B2]">
                  Paid once per ATSWA level via Paystack. Permanently unlocks {activeLevel.code} fee details & enrolment (never charged twice) and is credited/waived as your tutorial registration fee under the ATSWA arrangement.
                </p>
              </div>

              {/* Step 2: Online Tuition Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#9AA4B2]">
                  <span>Selected Level & Diet</span>
                  <span className="text-white font-semibold">
                    {activeLevel.code} · {activeDiet.diet} {activeDiet.year}
                  </span>
                </div>
                <div className="flex justify-between text-[#9AA4B2]">
                  <span>Courses Selected ({tuitionCalc.courseCount} × ₦20,000)</span>
                  <span className="tabular-nums-display text-white">
                    {formatNaira(tuitionCalc.grossTuition)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA4B2]">Multi-Course Tuition Discount (25%)</span>
                  <span
                    className={`tabular-nums-display font-semibold ${
                      tuitionCalc.discountAmount > 0 ? 'text-[#16C784]' : 'text-[#667085]'
                    }`}
                  >
                    −{formatNaira(tuitionCalc.discountAmount)}
                  </span>
                </div>
                <div className="border-t border-white/[0.08] pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Online Tuition Total</span>
                    <span className="text-[10.5px] text-[#667085]">
                      Capped at ₦60,000 max for all 4 courses
                    </span>
                  </div>
                  <span className="tabular-nums-display text-3xl font-bold text-[#16C784]">
                    {formatNaira(tuitionCalc.netTuition)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  to={`/portal/student?programme=atswa&level=${activeLevel.id}&diet=${activeDiet.id}`}
                  onClick={handleProceed}
                  className="v-btn-primary w-full py-3"
                >
                  Unlock & Enrol via Student Portal <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9AA4B2]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#16C784]" />
                  Paystack checkout only · Unlocks authorised Google Meet classes
                </div>
              </div>

              {/* Quick 1-4 Course Reference */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/[0.06] text-center">
                {[
                  { n: 1, amt: '₦20k' },
                  { n: 2, amt: '₦30k' },
                  { n: 3, amt: '₦45k' },
                  { n: 4, amt: '₦60k' },
                ].map((tier) => (
                  <div
                    key={tier.n}
                    className={`rounded-lg py-1.5 text-[11px] border ${
                      tuitionCalc.courseCount === tier.n
                        ? 'bg-[#16C784]/15 border-[#16C784]/40 text-[#16C784] font-bold'
                        : 'bg-[#0B0E11] border-white/[0.05] text-[#9AA4B2]'
                    }`}
                  >
                    <span className="block text-[10px] opacity-75">{tier.n} {tier.n === 1 ? 'Course' : 'Courses'}</span>
                    <span className="tabular-nums-display">{tier.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All 3 Levels Side-by-Side Comparison */}
          <div className="pt-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-white">
              Complete ATSWA Three-Level Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {atswaLevels.map((lvl) => (
                <div key={lvl.id} className="v-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-[#16C784]">{lvl.code}</span>
                    <Badge variant="neutral">Max Tuition: ₦60,000</Badge>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#D5DBE3]">
                    {lvl.courses.map((c, i) => (
                      <li key={c.id}>
                        {i + 1}. {c.title} ({c.code})
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-white/[0.06] pt-2.5 text-[11px] text-[#9AA4B2] space-y-1">
                    {lvl.officialFees.icanRegistration && (
                      <p>ICAN Reg: {formatNaira(lvl.officialFees.icanRegistration)}</p>
                    )}
                    <p>Full Exam Fee: {formatNaira(lvl.officialFees.fullExamFee)}</p>
                    <p>Annual Subscription: {formatNaira(lvl.officialFees.annualSubscription)}</p>
                    <p className="text-[#16C784]">One-Time Level Unlock: ₦3,000</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
