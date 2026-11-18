import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Check,
  Lock,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { ICAN_PRICING_TABLE } from '../data/platformConfig';
import {
  calculateIcanTuition,
  evaluateIcanExemptions,
  formatNaira,
} from '../lib/pricing';

export default function IcanPage() {
  const { levelSlug } = useParams();
  const navigate = useNavigate();
  const {
    icanLevels,
    allIcanCourses,
    exemptionRules,
    sessions,
    settings,
    openWhatsAppModal,
  } = usePlatform();
  const toast = useToast();

  const icanSessions = useMemo(
    () => sessions.filter((s) => s.programme === 'ICAN'),
    [sessions]
  );

  const activeTab = ['foundation', 'skills', 'professional', 'exemptions'].includes(levelSlug)
    ? levelSlug
    : 'foundation';

  const activeLevel =
    icanLevels.find((l) => l.slug === activeTab) || icanLevels[0];

  const [selectedDietId, setSelectedDietId] = useState(icanSessions[0]?.id || 'ican-may-2027');
  const [selectedCourseIds, setSelectedCourseIds] = useState(() =>
    activeLevel.courses.map((c) => c.id)
  );

  useEffect(() => {
    if (activeTab !== 'exemptions') {
      const lvl = icanLevels.find((l) => l.slug === activeTab) || icanLevels[0];
      setSelectedCourseIds(lvl.courses.slice(0, Math.min(3, lvl.courses.length)).map((c) => c.id));
    }
  }, [activeTab, icanLevels]);

  // Exemption Guidance Tool state
  const [exInput, setExInput] = useState({
    qualificationKey: 'aat_atswa',
    institution: '',
    graduationYear: '2025',
    courseStudied: 'Accounting',
    professionalQualification: 'NONE',
    priorPassedCodes: [],
    supportingDocNote: '',
  });
  const [exResult, setExResult] = useState(null);

  const activeDiet = icanSessions.find((s) => s.id === selectedDietId) || icanSessions[0];
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
      'Exemption Estimate Generated',
      `${res.potentialExemptions.length} potential exemptions · ${res.remainingCourses.length} remaining papers.`
    );
  };

  const whatsappEnquiryButtons = [
    { label: 'ICAN Registration Enquiry', category: 'ICAN Official Registration Fee Assistance' },
    { label: 'Examination Fee Enquiry', category: 'ICAN Official Examination Fee Assistance' },
    { label: 'Annual Subscription Enquiry', category: 'ICAN Official Annual Subscription Assistance' },
    { label: 'Physical Tuition Application', category: 'Physical Tuition Application Enquiry' },
  ];

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Header */}
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="green">ICAN PROGRAMME · MAY & NOVEMBER DIETS</Badge>
                <Badge variant="neutral">25% Off 3+ Online Courses</Badge>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
                {activeTab === 'exemptions'
                  ? 'ICAN Exemption Guidance Tool'
                  : activeLevel.name}
              </h1>
              <p className="text-sm sm:text-base text-[#9AA4B2]">
                {activeTab === 'exemptions'
                  ? 'Estimate potential ICAN paper exemptions, remaining syllabus courses and official documentary conditions before submitting your formal application to ICAN.'
                  : activeLevel.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={settings.officialLinks.icanSyllabus2026}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn-secondary text-xs"
              >
                2026 ICAN Syllabus PDF <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
              </a>
              <a
                href={settings.officialLinks.icanExamDockets}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn-secondary text-xs"
              >
                Official Exam Dockets <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
              </a>
            </div>
          </div>

          {/* Dedicated Sub-page Navigation Tabs */}
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
              Exemption Guidance Tool
            </button>
          </div>
        </div>
      </section>

      {activeTab !== 'exemptions' ? (
        <section className="py-14 sm:py-18">
          <div className="v-container space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              {/* Left: Course Selection & Official WhatsApp Assistance */}
              <div className="lg:col-span-7 space-y-6">
                <div className="v-card p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-white">
                        Select {activeLevel.shortName} Level Courses
                      </h2>
                      <p className="text-xs text-[#9AA4B2] mt-0.5">
                        ₦40,000 per online course · Automatic 25% discount when selecting 3 or more courses in one transaction.
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
                                {c.topics} syllabus modules · Study pack available ({formatNaira(c.studyPackPrice)})
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            {tuitionCalc.qualifiesForDiscount && checked ? (
                              <>
                                <span className="block tabular-nums-display text-sm font-bold text-[#16C784]">
                                  ₦30,000
                                </span>
                                <span className="block tabular-nums-display text-[11px] line-through text-[#667085]">
                                  ₦40,000
                                </span>
                              </>
                            ) : (
                              <span className="tabular-nums-display text-sm font-bold text-white">
                                ₦40,000
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Official ICAN Fees & Physical Tuition via WhatsApp Assistance */}
                <div className="v-card p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <Badge variant="neutral">Dedicated WhatsApp Assistance · {settings.whatsappNumber}</Badge>
                      <h3 className="mt-2 font-display text-lg font-bold text-white">
                        Official ICAN Fees & Physical Tuition Enquiries
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-[#9AA4B2]">
                    Official ICAN registration, examination and annual subscription fees — as well as physical tuition applications — are coordinated through our dedicated WhatsApp advisory process with prefilled student details. (Online tuition checkout runs strictly through Paystack.)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {whatsappEnquiryButtons.map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() =>
                          openWhatsAppModal({
                            category: btn.category,
                            level: `ICAN — ${activeLevel.shortName} Level`,
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

              {/* Right: Online Tuition Calculator & Pricing Schedule */}
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
                <div className="v-card p-6 space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-white">
                      ICAN Online Tuition Checkout Summary
                    </h3>
                    <Badge variant={tuitionCalc.qualifiesForDiscount ? 'green' : 'neutral'}>
                      {tuitionCalc.qualifiesForDiscount ? '25% Discount Applied' : 'Pick 3+ for 25% Off'}
                    </Badge>
                  </div>

                  {/* Diet picker */}
                  <div>
                    <label className="v-label" htmlFor="ican-diet-select">
                      Intended ICAN Diet (May / November)
                    </label>
                    <select
                      id="ican-diet-select"
                      value={selectedDietId}
                      onChange={(e) => setSelectedDietId(e.target.value)}
                      className="v-input text-xs"
                    >
                      {icanSessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} — Exam: {s.examWindow}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level unlock notice */}
                  <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3.5 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#16C784] inline-flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5" /> {activeLevel.shortName} Level Unlock (One-Time)
                      </span>
                      <span className="tabular-nums-display text-white">₦3,000</span>
                    </div>
                    <p className="text-[11px] text-[#9AA4B2]">
                      Recorded permanently for {activeLevel.shortName} Level only. Does not unlock other ICAN levels and does not offset official ICAN registration, subscription or exam fees.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#9AA4B2]">
                      <span>Online Tuition ({tuitionCalc.courseCount} × ₦40,000)</span>
                      <span className="tabular-nums-display text-white">
                        {formatNaira(tuitionCalc.grossTuition)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9AA4B2]">25% Discount (3+ Courses Same Transaction)</span>
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
                          Excludes unlock, official fees, store & delivery
                        </span>
                      </div>
                      <span className="tabular-nums-display text-3xl font-bold text-[#16C784]">
                        {formatNaira(tuitionCalc.netTuition)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/portal/student?programme=ican&level=${activeLevel.slug}&diet=${activeDiet.id}`}
                    className="v-btn-primary w-full py-3"
                  >
                    Proceed to Student Portal (Paystack) <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Official ICAN 1-6 Course Pricing Table */}
                <div className="v-card p-5 space-y-3">
                  <h4 className="font-display text-sm font-bold text-white">
                    Standard ICAN Online Tuition Schedule
                  </h4>
                  <div className="divide-y divide-white/[0.06] text-xs">
                    {ICAN_PRICING_TABLE.map((row) => (
                      <div
                        key={row.courses}
                        className={`flex items-center justify-between py-2 px-2 rounded-lg ${
                          tuitionCalc.courseCount === row.courses ? 'bg-[#16C784]/10' : ''
                        }`}
                      >
                        <span className="text-[#C2C9D4]">
                          {row.courses} {row.courses === 1 ? 'Course' : 'Courses'}
                        </span>
                        <div className="flex items-center gap-2.5">
                          {row.discounted && (
                            <span className="text-[10.5px] text-[#16C784] font-semibold">
                              Save {formatNaira(row.savings)}
                            </span>
                          )}
                          <span className="tabular-nums-display font-bold text-white">
                            {formatNaira(row.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ICAN EXEMPTION GUIDANCE TOOL */
        <section className="py-14 sm:py-18">
          <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form onSubmit={runExemptionCheck} className="lg:col-span-6 v-card p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-white">
                  Candidate Qualification Profile
                </h2>
                <Badge variant="green">Advisory Mapper</Badge>
              </div>

              <div>
                <label className="v-label" htmlFor="ex-qual">Highest Academic / Technical Qualification</label>
                <select
                  id="ex-qual"
                  value={exInput.qualificationKey}
                  onChange={(e) => setExInput({ ...exInput, qualificationKey: e.target.value })}
                  className="v-input"
                >
                  {exemptionRules.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="v-label" htmlFor="ex-inst">Awarding Institution</label>
                  <input
                    id="ex-inst"
                    type="text"
                    value={exInput.institution}
                    onChange={(e) => setExInput({ ...exInput, institution: e.target.value })}
                    placeholder="e.g. UNILAG, LASU, YABATECH"
                    className="v-input"
                  />
                </div>
                <div>
                  <label className="v-label" htmlFor="ex-year">Graduation / Induction Year</label>
                  <input
                    id="ex-year"
                    type="number"
                    min="1980"
                    max="2030"
                    value={exInput.graduationYear}
                    onChange={(e) => setExInput({ ...exInput, graduationYear: e.target.value })}
                    className="v-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="v-label" htmlFor="ex-course">Course Studied</label>
                  <input
                    id="ex-course"
                    type="text"
                    value={exInput.courseStudied}
                    onChange={(e) => setExInput({ ...exInput, courseStudied: e.target.value })}
                    placeholder="e.g. B.Sc. Accounting"
                    className="v-input"
                  />
                </div>
                <div>
                  <label className="v-label" htmlFor="ex-pro">Additional Professional Qualification</label>
                  <select
                    id="ex-pro"
                    value={exInput.professionalQualification}
                    onChange={(e) =>
                      setExInput({ ...exInput, professionalQualification: e.target.value })
                    }
                    className="v-input"
                  >
                    <option value="NONE">None</option>
                    <option value="ACCA_AFFILIATE_MEMBER">ACCA (Affiliate / Member)</option>
                    <option value="CITN_ACTI">CITN (ACTI)</option>
                    <option value="CIMA_ACMA">CIMA (ACMA / CGMA)</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="v-label">Previous ICAN Examination History (Tick Already Passed Papers)</span>
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
                  placeholder="e.g. Official transcript, AAT certificate, NYSC discharge"
                  className="v-input"
                />
              </div>

              <button type="submit" className="v-btn-primary w-full py-3">
                <Scale className="h-4 w-4" /> Evaluate Potential Exemptions
              </button>
            </form>

            {/* Output Panel */}
            <div className="lg:col-span-6 space-y-5">
              {!exResult ? (
                <div className="v-card p-8 text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-[#16C784]/12 border border-[#16C784]/25 flex items-center justify-center text-[#16C784]">
                    <FileCheck2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Ready to Assess Your Qualification
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9AA4B2] max-w-md mx-auto">
                    Complete your academic qualification, institution and examination history on the left to view estimated ICAN paper exemptions, remaining papers, conditions and recommended next steps.
                  </p>
                  <p className="text-[11px] text-[#667085]">
                    Note: ICAN retains sole authority for final exemption approval. VALENCE never automatically removes a course from enrolment based on an estimate.
                  </p>
                </div>
              ) : (
                <div className="v-card p-6 sm:p-7 space-y-5 animate-fade-up">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="green">Exemption Assessment Output</Badge>
                    <span className="text-xs text-[#9AA4B2]">
                      {exInput.institution || 'Candidate Assessment'} ({exInput.graduationYear})
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {exResult.ruleTitle}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#9AA4B2]">
                      {exResult.guidance}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-[#0B0E11] border border-[#16C784]/25 p-4 space-y-2.5">
                      <p className="text-xs font-bold text-[#16C784]">
                        Potential Exemptions ({exResult.potentialExemptions.length})
                      </p>
                      {exResult.potentialExemptions.length === 0 ? (
                        <p className="text-xs text-[#9AA4B2]">
                          No standard automatic exemptions — commence from Foundation Level.
                        </p>
                      ) : (
                        <ul className="space-y-1 text-xs text-[#D5DBE3]">
                          {exResult.potentialExemptions.map((c) => (
                            <li key={c.code} className="flex items-center justify-between">
                              <span>{c.title}</span>
                              <span className="text-[#16C784] font-display font-semibold">{c.code}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-2.5">
                      <p className="text-xs font-bold text-white">
                        Remaining Courses to Write ({exResult.remainingCourses.length})
                      </p>
                      <ul className="space-y-1 text-xs text-[#9AA4B2]">
                        {exResult.remainingCourses.map((c) => (
                          <li key={c.code} className="flex items-center justify-between">
                            <span className="text-[#D5DBE3]">{c.title}</span>
                            <span className="text-[10.5px] text-[#9AA4B2]">{c.level}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

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
        </section>
      )}
    </div>
  );
}
