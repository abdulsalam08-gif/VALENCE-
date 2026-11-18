import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Scale,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Search,
  Building2,
  Calendar,
  Lock,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';
import CountdownTimer from '../components/ui/CountdownTimer';
import { formatReadableDate, getSessionLifecycle } from '../lib/examSchedule';

export default function ProgrammesPage({ focusTertiary = false }) {
  const {
    sessions,
    atswaLevels,
    icanLevels,
    atswaEntryPathways,
    graduateEntryPathways,
    tertiaryDisciplines,
    generalLearnerTracks,
    universities,
    nigerianStates,
    universityCounts,
    settings,
  } = usePlatform();

  const [openTimetableId, setOpenTimetableId] = useState('atswa-mar-2027');
  const [uniSearch, setUniSearch] = useState('');
  const [uniCategory, setUniCategory] = useState('ALL');
  const [uniState, setUniState] = useState('ALL');
  const [showAllUnis, setShowAllUnis] = useState(false);

  const filteredUnis = useMemo(() => {
    const q = uniSearch.trim().toLowerCase();
    return universities.filter((u) => {
      if (uniCategory !== 'ALL' && u.category !== uniCategory) return false;
      if (uniState !== 'ALL' && u.state !== uniState) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q)
      );
    });
  }, [universities, uniSearch, uniCategory, uniState]);

  const displayedUnis = showAllUnis ? filteredUnis : filteredUnis.slice(0, 18);

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-5">
          <Badge variant="green">VALENCE PROGRAMMES & CENTRAL EXAM AUTHORITY</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white max-w-3xl">
            {focusTertiary
              ? `All ${universityCounts.total} Nigerian Universities, Polytechnics & General Tracks`
              : 'Programmes, Official Diet Timetables & Result Countdowns'}
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2] max-w-2xl">
            Browse ATSWA and ICAN syllabuses, exam timetables and exemption rules for free. Students pay the one-time{' '}
            <strong className="text-[#16C784]">₦3,000 registration</strong> per level only when applying for tuition and viewing their personalised cost implication.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/programmes/atswa" className="v-btn-primary text-xs">
              ATSWA (ATS 1 – 3) <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/programmes/ican" className="v-btn-secondary text-xs">
              ICAN (Foundation · Skills · Professional)
            </Link>
            <Link to="/programmes/ican/exemptions" className="v-btn-secondary text-xs">
              <Scale className="h-4 w-4 text-[#16C784]" /> ICAN Exemption & Entry Tool
            </Link>
            <Link to="/programmes/ican/guide" className="v-btn-secondary text-xs">
              Candidate Guide (10 FAQs)
            </Link>
          </div>
        </div>
      </section>

      {/* Central Examination Authority Calendar, Timetables & 30-Day Result Countdowns */}
      {!focusTertiary && (
        <section id="timetables" className="py-14 bg-[#0D1116]">
          <div className="v-container space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="official">CENTRAL EXAMINATION AUTHORITY</Badge>
                <Badge variant="neutral">Schedule & Timetable Feed</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                ATSWA (2-Day) & ICAN (3-Day) Exam Schedule + 30-Day Result Tracker
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA4B2]">
                <strong className="text-white">ATSWA (March & September):</strong> 2 days on the second-to-last Tuesday & Wednesday.{' '}
                <strong className="text-white">ICAN (May & November):</strong> 3 days on the first Tuesday, Wednesday & Thursday. Exam registration closes <strong className="text-[#EA3943]">1 week before exams</strong>, and a <strong className="text-[#16C784]">30-day result countdown</strong> starts right after the final paper. Because the Institute occasionally adjusts exam or result dates, all entries below are managed live by VALENCE’s Central Examination Authority.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {sessions.map((s) => {
                const lc = getSessionLifecycle(s);
                const timetableOpen = openTimetableId === s.id;
                return (
                  <div
                    key={s.id}
                    className={`v-card p-6 space-y-4 ${
                      lc.phase === 'awaiting_results' ? 'border-[#16C784]/40' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="green">{s.programme}</Badge>
                        <span className="text-xs font-semibold text-[#C2C9D4]">
                          {s.durationDays} Exam Days
                        </span>
                      </div>
                      <Badge variant={lc.badgeVariant}>{lc.badgeLabel}</Badge>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-white">{s.label}</h3>
                      <p className="text-xs text-[#9AA4B2] mt-0.5">{s.patternLabel}</p>
                    </div>

                    {lc.countdownTarget && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold text-[#16C784]">
                          {lc.countdownLabel}
                        </p>
                        <CountdownTimer targetDate={lc.countdownTarget} compact />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-2.5">
                        <span className="block text-[10px] text-[#667085]">Exam Window</span>
                        <span className="font-semibold text-[#F4F6F9]">{s.examWindow}</span>
                      </div>
                      <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-2.5">
                        <span className="block text-[10px] text-[#667085]">Reg. Closes (−7 Days)</span>
                        <span className="font-semibold text-[#EA3943]">
                          {s.registrationCloseFormatted}
                        </span>
                      </div>
                      <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-2.5">
                        <span className="block text-[10px] text-[#667085]">Est. Results (+30 Days)</span>
                        <span className="font-semibold text-[#16C784]">
                          {s.expectedResultFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Official Diet Timetable */}
                    <div className="border-t border-white/[0.06] pt-3">
                      <button
                        type="button"
                        onClick={() => setOpenTimetableId(timetableOpen ? null : s.id)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-[#F4F6F9] hover:text-[#16C784] transition-colors"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#16C784]" />
                          {timetableOpen ? 'Hide' : 'View'} {s.durationDays}-Day Examination Timetable
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            timetableOpen ? 'rotate-180 text-[#16C784]' : ''
                          }`}
                        />
                      </button>

                      {timetableOpen && (
                        <div className="mt-3 space-y-2">
                          {s.timetable.map((slot) => (
                            <div
                              key={slot.dayLabel}
                              className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3 text-[11.5px] space-y-1"
                            >
                              <div className="flex justify-between font-semibold text-[#16C784]">
                                <span>{slot.dayLabel}</span>
                                <span>{formatReadableDate(s.examDays[slot.dateIndex], false)}</span>
                              </div>
                              <p className="text-[#D5DBE3]">
                                <strong className="text-[#9AA4B2]">AM:</strong> {slot.morning}
                              </p>
                              <p className="text-[#D5DBE3]">
                                <strong className="text-[#9AA4B2]">PM:</strong> {slot.afternoon}
                              </p>
                            </div>
                          ))}
                          <p className="text-[10.5px] text-[#667085]">{lc.subNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ATSWA vs ICAN Cards */}
      {!focusTertiary && (
        <section className="py-16">
          <div className="v-container grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="v-card-hover p-7 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="green">ATSWA · 2-Day Diet (Mar & Sep)</Badge>
                  <span className="text-xs text-[#9AA4B2] inline-flex items-center gap-1">
                    <Lock className="h-3 w-3 text-[#16C784]" /> ₦3,000 for Tuition
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  ATSWA Programme (ATS 1, ATS 2 & ATS 3)
                </h2>
                <p className="text-sm text-[#9AA4B2]">
                  12 courses across 3 levels examined on the second-to-last Tuesday and Wednesday of March and September. Complete your one-time ₦3,000 level registration only when applying for tuition to unlock your full cost implication and 25% multi-course discount (2+ courses).
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {atswaLevels.map((l) => (
                    <div key={l.id} className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-3">
                      <p className="font-display text-sm font-bold text-[#16C784]">{l.code}</p>
                      <p className="text-[11px] text-[#9AA4B2] mt-0.5">{l.courses.length} courses</p>
                      <p className="text-[10.5px] text-[#667085] mt-1">
                        {l.courses.map((c) => c.code).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/programmes/atswa" className="v-btn-primary text-xs">
                  Apply for ATSWA Tuition <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={settings.officialLinks.atswaSoftCopy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-btn-secondary text-xs"
                >
                  Official Soft-Copy <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="v-card-hover p-7 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="green">ICAN · 3-Day Diet (May & Nov)</Badge>
                  <span className="text-xs text-[#9AA4B2] inline-flex items-center gap-1">
                    <Lock className="h-3 w-3 text-[#16C784]" /> ₦3,000 for Tuition
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  ICAN Programme (Foundation, Skills & Professional)
                </h2>
                <p className="text-sm text-[#9AA4B2]">
                  15 syllabus papers examined on the first Tuesday, Wednesday and Thursday of May and November (updated by Central Examination Authority if revised). Pay ₦3,000 per level only when applying for tuition to view your cost implication and 25% discount on 3+ courses.
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {icanLevels.map((l) => (
                    <Link
                      key={l.id}
                      to={`/programmes/ican/${l.slug}`}
                      className="rounded-xl bg-[#0B0E11] border border-white/[0.07] hover:border-[#16C784]/40 p-3 transition-colors"
                    >
                      <p className="font-display text-sm font-bold text-[#16C784]">{l.shortName}</p>
                      <p className="text-[11px] text-[#9AA4B2] mt-0.5">{l.courses.length} papers</p>
                      <p className="text-[10.5px] text-[#667085] mt-1 truncate">
                        {l.courses.map((c) => c.code).join(' · ')}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/programmes/ican" className="v-btn-primary text-xs">
                  Explore ICAN Levels <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/programmes/ican/exemptions" className="v-btn-secondary text-xs">
                  Check Exemptions
                </Link>
                <Link to="/programmes/ican/guide" className="v-btn-secondary text-xs">
                  10 Candidate FAQs
                </Link>
              </div>
            </div>
          </div>

          {/* Entry Route Matrix: Where Should I Start? (ATSWA vs Graduate + Accredited / MCATI Checks) */}
          <div className="v-container mt-10">
            <div className="v-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <Badge variant="green">PROSPECTIVE CANDIDATE ENTRY GUIDE</Badge>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Which Level Should You Start From?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9AA4B2]">
                    Anyone interested in accounting, whether an accounting or non-accounting student or graduate, can become an ACA. Clear all courses in each stage to advance.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={settings.officialLinks.icanAccreditedInstitutions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v-btn-secondary text-xs"
                  >
                    Accredited Schools PDF <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
                  </a>
                  <a
                    href={settings.officialLinks.icanMcatiInstitutions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v-btn-secondary text-xs"
                  >
                    MCATI Schools PDF <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
                <div className="rounded-2xl bg-[#0B0E11] border border-white/[0.07] p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-bold text-white">
                      a) Undergraduate & ND Route (ATSWA)
                    </p>
                    <Badge variant="neutral">~2.5 Yrs to ACA</Badge>
                  </div>
                  <div className="space-y-2">
                    {atswaEntryPathways.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#11161C] border border-white/[0.06] p-3 flex flex-wrap items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-white">{item.qualification}</p>
                          <p className="text-[11px] text-[#9AA4B2]">{item.exemptions}</p>
                        </div>
                        <span className="font-display font-bold text-[#16C784]">{item.startAt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0B0E11] border border-white/[0.07] p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-bold text-white">
                      b) Graduate Route (B.Sc. / HND, Direct ICAN)
                    </p>
                    <Badge variant="neutral">~6 Mos – 1.5 Yrs</Badge>
                  </div>
                  <div className="space-y-2">
                    {graduateEntryPathways.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#11161C] border border-white/[0.06] p-3 flex flex-wrap items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{item.qualification}</p>
                          <p className="text-[11px] text-[#9AA4B2]">
                            {item.exemptions} · {item.duration}
                          </p>
                        </div>
                        <span className="font-display font-bold text-[#16C784] shrink-0">
                          {item.startAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/[0.06] text-xs">
                <p className="font-display italic text-[#16C784]">
                  “If I can, you CAN. That’s why it’s ICAN.”
                </p>
                <Link
                  to="/programmes/ican/guide"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#F4F6F9] hover:text-[#16C784] transition-colors"
                >
                  Read all 10 Prospective ICAN Candidate FAQs <ArrowRight className="h-3.5 w-3.5 text-[#16C784]" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tertiary Disciplines & General Accounting Tracks */}
      <section id="tertiary" className="py-16 bg-[#0D1116]">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 v-card p-7 space-y-5">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#16C784]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#16C784]">
                TERTIARY STUDENTS · FREE REGISTRATION
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              University, Polytechnic & College Accounting Community
            </h2>
            <p className="text-sm text-[#9AA4B2]">
              Join free even if you are not yet an ICAN or ATSWA candidate. Access general accounting lessons, study groups, 12 subject forums, AI tutor support, verified mentorship, internships and inter-school competitions with <strong className="text-[#16C784]">₦50,000 merit rewards</strong>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tertiaryDisciplines.map((disc) => (
                <div
                  key={disc}
                  className="flex items-center gap-2 rounded-xl bg-[#0B0E11] border border-white/[0.07] px-3 py-2 text-xs text-[#D5DBE3]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0" />
                  <span className="truncate">{disc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 v-card p-7 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#16C784]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#16C784]">
                  GENERAL ACCOUNTING LEARNERS
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Six Practical Accounting Literacy Tracks
              </h3>
              <div className="space-y-2">
                {generalLearnerTracks.map((t) => (
                  <div key={t.title} className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-3">
                    <h4 className="text-xs font-bold text-[#16C784]">{t.title}</h4>
                    <p className="text-[11px] text-[#9AA4B2] mt-0.5">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/portal/student" className="v-btn-primary w-full text-xs">
              Create Free Learner Account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded Directory of ALL Universities in Nigeria */}
      <section id="nigerian-universities" className="py-16">
        <div className="v-container space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <Badge variant="green">EMBEDDED NATIONAL INSTITUTION DIRECTORY</Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                All {universityCounts.total} Accredited Universities in Nigeria
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA4B2]">
                Covering {universityCounts.federal} Federal, {universityCounts.state} State and {universityCounts.private} Private universities across all 36 States and FCT Abuja for profiles, study groups, exemptions and competitions.
              </p>
            </div>
          </div>

          {/* Search + Category + State Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={uniSearch}
                onChange={(e) => setUniSearch(e.target.value)}
                placeholder="Search university or acronym (UNILAG, LASU, ABU, CU)..."
                className="v-input pl-10 text-xs"
              />
            </div>
            <select
              value={uniCategory}
              onChange={(e) => setUniCategory(e.target.value)}
              aria-label="Filter university category"
              className="v-input text-xs"
            >
              <option value="ALL">All Categories ({universityCounts.total})</option>
              <option value="Federal">Federal Universities ({universityCounts.federal})</option>
              <option value="State">State Universities ({universityCounts.state})</option>
              <option value="Private">Private Universities ({universityCounts.private})</option>
            </select>
            <select
              value={uniState}
              onChange={(e) => setUniState(e.target.value)}
              aria-label="Filter by Nigerian state"
              className="v-input text-xs"
            >
              <option value="ALL">All 36 States + FCT</option>
              {nigerianStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedUnis.map((u) => (
              <div
                key={u.id}
                className="v-card p-4 flex items-start justify-between gap-3 hover:border-white/[0.15]"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-snug">{u.name}</p>
                  <p className="text-[11px] text-[#9AA4B2] mt-1">
                    {u.category} · {u.state} ({u.zone})
                  </p>
                </div>
                <span className="rounded-lg bg-[#16C784]/10 border border-[#16C784]/25 px-2 py-0.5 font-display text-[10.5px] font-bold text-[#16C784] shrink-0">
                  {u.shortName}
                </span>
              </div>
            ))}
          </div>

          {filteredUnis.length > 18 && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowAllUnis((v) => !v)}
                className="v-btn-secondary text-xs"
              >
                <Building2 className="h-4 w-4 text-[#16C784]" />
                {showAllUnis
                  ? 'Show Fewer Universities'
                  : `Show All ${filteredUnis.length} Matching Universities`}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
