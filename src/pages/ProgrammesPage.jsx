import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Scale,
  GraduationCap,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';
import CountdownTimer from '../components/ui/CountdownTimer';

export default function ProgrammesPage({ focusTertiary = false }) {
  const {
    sessions,
    atswaLevels,
    icanLevels,
    tertiaryDisciplines,
    generalLearnerTracks,
    settings,
  } = usePlatform();

  return (
    <div className="divide-y divide-white/[0.06]">
      {/* Header */}
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-5">
          <Badge variant="green">VALENCE ACADEMIC PROGRAMMES</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white max-w-3xl">
            {focusTertiary
              ? 'University, Polytechnic & General Accounting Tracks'
              : 'Structured Pathways for Every Stage of Accounting Mastery'}
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2] max-w-2xl">
            Choose from full diet-aligned ATSWA and ICAN online tuition, our ICAN Exemption Guidance tool, tertiary undergraduate learning communities and general accounting literacy programmes.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/programmes/atswa" className="v-btn-primary text-xs">
              ATSWA (ATS 1 – 3) <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/programmes/ican" className="v-btn-secondary text-xs">
              ICAN (Foundation · Skills · Professional)
            </Link>
            <Link to="/programmes/ican/exemptions" className="v-btn-secondary text-xs">
              <Scale className="h-4 w-4 text-[#16C784]" /> ICAN Exemption Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Examination Diet Calendar (ATSWA March/Sept vs ICAN May/Nov) */}
      {!focusTertiary && (
        <section className="py-14 bg-[#0D1116]">
          <div className="v-container space-y-6">
            <div className="max-w-2xl space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
                ADMINISTRATOR-MANAGED DIET CALENDAR
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Upcoming ATSWA (March/Sept) & ICAN (May/Nov) Sessions
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA4B2]">
                Enrolment into closed sessions is automatically restricted unless an authorised administrator grants an override.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sessions.map((s) => (
                <div key={s.id} className="v-card p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="green">{s.programme}</Badge>
                      <span className="text-xs font-semibold text-[#C2C9D4]">
                        {s.diet} {s.year} Diet
                      </span>
                    </div>
                    <Badge variant={s.status === 'registration_open' ? 'green' : 'neutral'}>
                      {s.status === 'registration_open' ? 'Registration Open' : 'Upcoming Session'}
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-xl font-bold text-white">{s.label}</h3>
                    <span className="text-xs text-[#9AA4B2]">{s.examWindow}</span>
                  </div>

                  <CountdownTimer targetDate={s.examStartDate} compact />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                    <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-2.5">
                      <span className="block text-[10px] text-[#667085]">Tuition Starts</span>
                      <span className="font-semibold text-[#F4F6F9]">{s.tuitionCommencement}</span>
                    </div>
                    <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-2.5">
                      <span className="block text-[10px] text-[#667085]">Reg. Closes</span>
                      <span className="font-semibold text-[#EA3943]">{s.registrationClose}</span>
                    </div>
                    <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-2.5 col-span-2 sm:col-span-1">
                      <span className="block text-[10px] text-[#667085]">Mock Exam</span>
                      <span className="font-semibold text-[#16C784]">{s.mockExamDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Programme Comparison Cards */}
      {!focusTertiary && (
        <section className="py-16">
          <div className="v-container grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ATSWA Card */}
            <div className="v-card-hover p-7 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="green">March & September Diets</Badge>
                  <span className="tabular-nums-display text-xs font-bold text-[#16C784]">
                    ₦20,000 / course
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  ATSWA Programme (ATS 1, ATS 2 & ATS 3)
                </h2>
                <p className="text-sm text-[#9AA4B2]">
                  12 courses across 3 levels leading to the AAT qualification. Enjoy an automatic 25% tuition discount when selecting 2+ courses (capped at ₦60,000 for all 4) and a one-time ₦3,000 per-level unlock credited as your tutorial registration fee.
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
                  Open ATSWA Page & Calculator <ArrowRight className="h-4 w-4" />
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

            {/* ICAN Card */}
            <div className="v-card-hover p-7 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="green">May & November Diets</Badge>
                  <span className="tabular-nums-display text-xs font-bold text-[#16C784]">
                    ₦40,000 / course
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  ICAN Professional Programme (Foundation, Skills & Professional)
                </h2>
                <p className="text-sm text-[#9AA4B2]">
                  15 syllabus papers across 3 separate levels. Save 25% automatically when enrolling in 3+ online courses in the same transaction (3 = ₦90k · 4 = ₦120k · 5 = ₦150k · 6 = ₦180k). One-time ₦3,000 unlock per level.
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
              </div>
            </div>
          </div>
        </section>
      )}

      {/* University / Polytechnic & General Accounting Learners Section */}
      <section id="tertiary" className="py-16 bg-[#0D1116]">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 v-card p-7 space-y-5">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#16C784]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#16C784]">
                TERTIARY STUDENTS
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              University, Polytechnic & College Accounting Community
            </h2>
            <p className="text-sm text-[#9AA4B2]">
              Undergraduate and HND students can join VALENCE even without active ICAN or ATSWA registration. Gain access to general accounting lessons, academic discussion forums, campus study groups, the VALENCE National Accounting Challenge, practice banks, VALENCE AI Accounting Tutor, mentorship and internship pipelines.
            </p>
            <div>
              <p className="text-xs font-semibold text-white mb-2.5">12 Eligible Academic Disciplines:</p>
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
            <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3.5 text-xs text-[#9AA4B2]">
              <strong className="text-white">Access Boundary Policy:</strong> Tertiary student accounts do not automatically unlock restricted paid ICAN or ATSWA tuition classes and level-gated exam resources; you can upgrade or unlock any examination level at any time.
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/portal/student" className="v-btn-primary text-xs">
                Register as a Tertiary Student <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/competitions" className="v-btn-secondary text-xs">
                Join Your School Team
              </Link>
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
              <h3 className="font-display text-2xl font-bold text-white">
                Accounting for Founders, Professionals & Everyday Learners
              </h3>
              <div className="space-y-2.5">
                {generalLearnerTracks.map((t) => (
                  <div key={t.title} className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-3.5">
                    <h4 className="text-xs font-bold text-[#16C784]">{t.title}</h4>
                    <p className="text-xs text-[#9AA4B2] mt-0.5">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/portal/student" className="v-btn-secondary w-full text-xs">
              Start as a General Learner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
