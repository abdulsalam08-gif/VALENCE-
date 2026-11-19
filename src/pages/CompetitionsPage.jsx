import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Building2,
  Clock,
  ShieldCheck,
  Award,
  Swords,
  ArrowRight,
  CheckCircle2,
  Banknote,
  Sparkles,
  Medal,
  Star,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import UniversitySelect from '../components/ui/UniversitySelect';
import { formatNaira } from '../lib/pricing';

const ROUNDS = [
  { step: '01', title: 'School Registration & Verification', desc: 'Select your Nigerian university, polytechnic, college or tuition centre and register your verified team · strictly only 4 students can compete in each school.' },
  { step: '02', title: 'Individual Qualifying Round', desc: 'Server-timed CBT examination paper testing breadth, accuracy and exam speed.' },
  { step: '03', title: 'Zonal / Regional Round', desc: 'Top-ranked individuals and school teams advance into regional brackets across Nigeria’s 6 geopolitical zones.' },
  { step: '04', title: 'National Semi-Finals', desc: 'Full professional standard case-study and multi-section theory evaluations.' },
  { step: '05', title: 'National Grand Finale & Podium Payout', desc: 'Championship round followed by audited verification and the ₦100,000 / ₦70,000 / ₦50,000 podium cash prize disbursement to the top three winners.' },
];

const PODIUM = [
  { rank: '1st', icon: Trophy, valueKey: 'firstPrize', label: 'Champion' },
  { rank: '2nd', icon: Medal, valueKey: 'secondPrize', label: 'Runner-Up' },
  { rank: '3rd', icon: Medal, valueKey: 'thirdPrize', label: 'Second Runner-Up' },
];

export default function CompetitionsPage() {
  const {
    competitionDivisions,
    competitionStructures,
    competitionReward,
    universityCounts,
  } = usePlatform();
  const toast = useToast();
  const [selectedStructure, setSelectedStructure] = useState('atswa');
  const [previewUniversity, setPreviewUniversity] = useState('');

  const activeStructure = competitionStructures[selectedStructure];

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">VALENCE COMPETE</Badge>
              <Badge variant="verified">₦220,000 Podium Prize Pool Every Competition</Badge>
              <Badge variant="neutral">Only 4 Competitors Per School</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              The VALENCE National Inter-School Challenge
            </h1>
            <p className="text-sm sm:text-base text-[#9AA4B2]">
              Nigeria’s premier inter-school academic championship uniting all{' '}
              <strong className="text-white">{universityCounts.total} accredited Nigerian universities, polytechnics and colleges</strong>, ATSWA candidates, ICAN candidates and private learners. Questions are rigorously structured across{' '}
              <strong className="text-white">accounting and related fields</strong> (financial &amp; corporate reporting, cost &amp; management accounting, auditing, taxation, finance, economics, business law, public sector accounting, quantitative methods, management and business ethics). Strictly only{' '}
              <strong className="text-white">4 students can compete in each school</strong>, and the top three winners earn a guaranteed{' '}
              <strong className="text-[#16C784]">{formatNaira(competitionReward.totalPodiumPool)} podium prize pool</strong>{' · '}
              <strong className="text-[#16C784]">{formatNaira(competitionReward.firstPrize)} for 1st</strong>,{' '}
              <strong className="text-[#16C784]">{formatNaira(competitionReward.secondPrize)} for 2nd</strong> and{' '}
              <strong className="text-[#16C784]">{formatNaira(competitionReward.thirdPrize)} for 3rd</strong> after every competition closes.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/portal/school" className="v-btn-primary text-xs">
                Register Your School / Team <Building2 className="h-4 w-4" />
              </Link>
              <Link to="/portal/student" className="v-btn-secondary text-xs">
                Enter as Candidate & Compete for the Podium <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/competitions/19bd2129-6b4e-4804-8728-fb35cb2f5554" className="v-btn-ghost text-xs">
                View the Live 2027 Competition <Trophy className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ₦220,000 Podium Prize Spotlight Card */}
          <div className="lg:col-span-5 v-glass-card p-6 sm:p-7 border-[#16C784]/35 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#16C784]">
                <Banknote className="h-4 w-4" /> Official Podium Prize Pool
              </span>
              <Sparkles className="h-4 w-4 text-[#16C784]" />
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {PODIUM.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.rank}
                    className="rounded-2xl bg-[#0B0E11] border border-[#16C784]/30 p-4 text-center space-y-1"
                  >
                    <Icon className="h-5 w-5 text-[#16C784] mx-auto" />
                    <p className="font-display text-base font-bold text-[#16C784] tabular-nums-display">
                      {formatNaira(competitionReward[p.valueKey])}
                    </p>
                    <p className="text-[10px] font-semibold text-white">{p.rank}</p>
                    <p className="text-[9.5px] text-[#667085]">{p.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl bg-[#0B0E11] border border-[#16C784]/25 p-3 text-center">
              <p className="font-display text-lg font-bold text-white tabular-nums-display">
                {formatNaira(competitionReward.totalPodiumPool)} Total Podium Pool
              </p>
              <p className="text-[10px] text-[#9AA4B2]">Awarded after every competition closes</p>
            </div>
            <p className="text-xs leading-relaxed text-[#C2C9D4]">{competitionReward.summary}</p>
            <ul className="space-y-1.5 text-[11.5px] text-[#9AA4B2]">
              {competitionReward.eligibilityRules.map((rule) => (
                <li key={rule} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* School Readiness Check (All Nigerian Universities Embedded) */}
      <section className="py-12 bg-[#0D1116]">
        <div className="v-container">
          <div className="v-card p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
            <div className="lg:col-span-8">
              <UniversitySelect
                id="compete-uni-check"
                label={`Find Your Institution (${universityCounts.total} Nigerian Universities, Polytechnics & Colleges Embedded)`}
                value={previewUniversity}
                onChange={setPreviewUniversity}
                placeholder="Search e.g. UNILAG, YABATECH, Covenant, ABU Zaria, Auchi Poly, LASU, FCE..."
              />
            </div>
            <div className="lg:col-span-4">
              <Link
                to={`/portal/school${previewUniversity ? `?institution=${encodeURIComponent(previewUniversity)}` : ''}`}
                onClick={() => {
                  if (previewUniversity) {
                    toast.success(
                      'Institution Eligible',
                      `${previewUniversity} is ready for VALENCE National Inter-School Challenge registration.`
                    );
                  }
                }}
                className="v-btn-primary w-full py-3 text-xs"
              >
                Register {previewUniversity ? 'Selected Institution' : 'Your Institution'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Divisions */}
      <section className="py-16">
        <div className="v-container space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Six Official Competition Divisions (All Podium Pool Eligible)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitionDivisions.map((d, idx) => (
              <div key={d.id} className="v-card-hover p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="tabular-nums-display text-xs font-bold text-[#16C784]">
                    DIVISION 0{idx + 1}
                  </span>
                  <Badge variant="green">₦220,000 Podium Eligible</Badge>
                </div>
                <h3 className="font-display text-base font-bold text-white">{d.name}</h3>
                <p className="text-xs text-[#9AA4B2]">Eligible: {d.level}</p>
                <p className="text-[11px] text-[#667085]">Format: {d.format}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentic ATSWA & ICAN Paper Blueprints */}
      <section className="py-16 bg-[#0D1116]">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <Badge variant="green">EXAMINATION ENGINE BLUEPRINT</Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Authentic ATSWA & ICAN Paper Structures
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA4B2]">
              Server-enforced countdown timers, auto-saved answers, instant objective grading and blind rubric-based theory grading by qualified examiners before every post-competition podium prize disbursement (₦100,000 / ₦70,000 / ₦50,000).
            </p>

            <div className="inline-flex rounded-xl bg-[#11161C] border border-white/[0.08] p-1">
              <button
                type="button"
                onClick={() => setSelectedStructure('atswa')}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                  selectedStructure === 'atswa' ? 'bg-[#16C784] text-[#06130D]' : 'text-[#9AA4B2]'
                }`}
              >
                ATSWA Format (100 Marks)
              </button>
              <button
                type="button"
                onClick={() => setSelectedStructure('ican')}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                  selectedStructure === 'ican' ? 'bg-[#16C784] text-[#06130D]' : 'text-[#9AA4B2]'
                }`}
              >
                ICAN Format (100 Marks)
              </button>
            </div>

            <div className="v-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">
                  {activeStructure.name}
                </h3>
                <span className="tabular-nums-display text-xs font-bold text-[#16C784]">
                  Total: {activeStructure.totalMarks} Marks
                </span>
              </div>
              <div className="space-y-2.5">
                {activeStructure.sections.map((sec) => (
                  <div
                    key={sec.label}
                    className="rounded-xl bg-[#0B0E11] border border-white/[0.07] p-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{sec.label}</p>
                      <p className="text-[11px] text-[#9AA4B2] mt-0.5">{sec.detail}</p>
                    </div>
                    <span className="tabular-nums-display rounded-lg bg-[#16C784]/[0.12] border border-[#16C784]/25 px-2.5 py-1 text-xs font-bold text-[#16C784] shrink-0">
                      {sec.marks} mks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <Badge variant="neutral">CHAMPIONSHIP PROGRESSION & PAYOUT</Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Five Rounds From Registration to the Podium Payout
            </h2>
            <div className="space-y-3">
              {ROUNDS.map((r) => (
                <div key={r.step} className="v-card p-4 flex items-start gap-4">
                  <span className="tabular-nums-display inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#16C784]/[0.12] border border-[#16C784]/30 text-xs font-bold text-[#16C784]">
                    {r.step}
                  </span>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">{r.title}</h4>
                    <p className="text-xs text-[#9AA4B2] mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrity, Arena, Awards & Leaderboards */}
      <section className="py-16">
        <div className="v-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Banknote,
              title: '₦220,000 Post-Competition Podium Pool',
              desc: 'Direct podium cash prizes (₦100,000 / ₦70,000 / ₦50,000) paid to verified top three performers after final scores and appeals conclude.',
            },
            {
              icon: Clock,
              title: 'Practice, Mock & Timed CBT',
              desc: 'Daily drills, weekly tests, monthly national mocks and strict server-timed competition papers.',
            },
            {
              icon: Swords,
              title: 'Monthly League & 1v1 / 2v2 Arena',
              desc: 'Recurring monthly challenges, 1v1 quiz duels, 2v2 team battles, Campus Ambassadors and Hall of Fame.',
            },
            {
              icon: ShieldCheck,
              title: 'Anti-Cheat & Audited Grading',
              desc: 'Question randomization, one-attempt controls, integrity tracking, published results and formal appeals.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="v-card p-5 space-y-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#16C784]/[0.12] text-[#16C784]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-display text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#9AA4B2]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top VALENCE Students School-Profile Spotlight */}
      <section className="py-16 bg-[#0D1116]">
        <div className="v-container space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="verified">TOP VALENCE STUDENTS</Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Champions Featured on Their School Profiles
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA4B2] max-w-2xl">
                Winning students are displayed on their respective school’s official VALENCE profile as
                <strong className="text-white"> Top VALENCE Students</strong> · permanent, verified recognition that
                every visiting learner, parent and recruiter sees on the institution’s campus profile.
              </p>
            </div>
            <Link to="/portal/school" className="v-btn-secondary text-xs shrink-0">
              View School Profiles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Star,
                title: 'School-Profile Badge',
                desc: 'Each winning student earns a “Top VALENCE Student” badge on the official VALENCE profile of their university, polytechnic or college.',
              },
              {
                icon: Award,
                title: 'Verified Podium Record',
                desc: 'The profile carries the audited competition record: 1st, 2nd or 3rd position, the ₦100,000 / ₦70,000 / ₦50,000 prize earned and the competition diet.',
              },
              {
                icon: Building2,
                title: 'Campus Reputation Boost',
                desc: 'Institutions showcase their podium winners publicly, strengthening campus standing across the VALENCE national leaderboard.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="v-card p-6 space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[#16C784]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-[#9AA4B2]">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="v-glass-card p-6 sm:p-7 border-[#16C784]/25 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#16C784]" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#16C784]">
                How Top VALENCE Students Appear on School Profiles
              </h3>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 space-y-0">
              {[
                'The final results are audited and published after the Grand Finale.',
                'The top three winners are confirmed per competition and school standing.',
                'Winners are enrolled on their school’s official VALENCE profile as Top VALENCE Students.',
                'The school profile displays their badge, podium position and prize earned.',
              ].map((step, idx) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-xl bg-[#0B0E11] border border-white/[0.07] p-4"
                >
                  <span className="tabular-nums-display inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[11px] font-bold text-[#16C784]">
                    {idx + 1}
                  </span>
                  <span className="text-[11.5px] leading-relaxed text-[#C2C9D4]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
