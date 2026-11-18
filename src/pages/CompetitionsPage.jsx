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
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import UniversitySelect from '../components/ui/UniversitySelect';
import { formatNaira } from '../lib/pricing';

const ROUNDS = [
  { step: '01', title: 'School Registration & Verification', desc: 'Select your Nigerian university, polytechnic, college or tuition centre and register verified teams (1–5 candidates + supervisor).' },
  { step: '02', title: 'Individual Qualifying Round', desc: 'Server-timed CBT examination paper testing breadth, accuracy and exam speed.' },
  { step: '03', title: 'Zonal / Regional Round', desc: 'Top-ranked individuals and school teams advance into regional brackets across Nigeria’s 6 geopolitical zones.' },
  { step: '04', title: 'National Semi-Finals', desc: 'Full professional standard case-study and multi-section theory evaluations.' },
  { step: '05', title: 'National Grand Finale & ₦50,000 Reward Payout', desc: 'Championship round followed by audited verification and ₦50,000 cash reward disbursement to top learners.' },
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
              <Badge variant="verified">₦50,000 Merit Cash Reward Every Competition</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              The VALENCE National Inter-School Accounting Challenge
            </h1>
            <p className="text-sm sm:text-base text-[#9AA4B2]">
              Nigeria’s premier academic accounting championship uniting all{' '}
              <strong className="text-white">{universityCounts.total} accredited Nigerian universities</strong>, polytechnics, colleges, ATSWA centres, ICAN centres and private candidates, with a guaranteed{' '}
              <strong className="text-[#16C784]">{formatNaira(competitionReward.amount)}</strong> cash reward paid to outstanding learners after every competition concludes.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/portal/school" className="v-btn-primary text-xs">
                Register Your School / Team <Building2 className="h-4 w-4" />
              </Link>
              <Link to="/portal/student" className="v-btn-secondary text-xs">
                Enter as Candidate & Compete for ₦50,000 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ₦50,000 Competition Reward Spotlight Card */}
          <div className="lg:col-span-5 v-glass-card p-6 sm:p-7 border-[#16C784]/35 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#16C784]">
                <Banknote className="h-4 w-4" /> Official Learner Merit Reward
              </span>
              <Sparkles className="h-4 w-4 text-[#16C784]" />
            </div>
            <div className="rounded-2xl bg-[#0B0E11] border border-[#16C784]/30 p-5 text-center space-y-1">
              <p className="font-display text-4xl sm:text-5xl font-bold text-[#16C784] tabular-nums-display">
                {formatNaira(competitionReward.amount)}
              </p>
              <p className="text-xs font-semibold text-white">
                Awarded After Every Competition Closes
              </p>
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
                label={`Find Your Institution (${universityCounts.total} Federal, State & Private Nigerian Universities Embedded)`}
                value={previewUniversity}
                onChange={setPreviewUniversity}
                placeholder="Search e.g. University of Lagos, Covenant, ABU Zaria, UNN, OAU, LASU, UNILORIN..."
              />
            </div>
            <div className="lg:col-span-4">
              <Link
                to={`/portal/school${previewUniversity ? `?institution=${encodeURIComponent(previewUniversity)}` : ''}`}
                onClick={() => {
                  if (previewUniversity) {
                    toast.success(
                      'Institution Eligible',
                      `${previewUniversity} is ready for VALENCE Inter-School Challenge registration.`
                    );
                  }
                }}
                className="v-btn-primary w-full py-3 text-xs"
              >
                Register {previewUniversity ? 'Selected Institution' : 'Your University'}
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
            Six Official Competition Divisions (All ₦50,000 Reward Eligible)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitionDivisions.map((d, idx) => (
              <div key={d.id} className="v-card-hover p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="tabular-nums-display text-xs font-bold text-[#16C784]">
                    DIVISION 0{idx + 1}
                  </span>
                  <Badge variant="green">₦50,000 Eligible</Badge>
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
              Server-enforced countdown timers, auto-saved answers, instant objective grading and blind rubric-based theory grading by qualified examiners before every ₦50,000 post-competition reward disbursement.
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
                    <span className="tabular-nums-display rounded-lg bg-[#16C784]/12 border border-[#16C784]/25 px-2.5 py-1 text-xs font-bold text-[#16C784] shrink-0">
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
              Five Rounds From Registration to ₦50,000 Reward
            </h2>
            <div className="space-y-3">
              {ROUNDS.map((r) => (
                <div key={r.step} className="v-card p-4 flex items-start gap-4">
                  <span className="tabular-nums-display inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#16C784]/12 border border-[#16C784]/30 text-xs font-bold text-[#16C784]">
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
              title: '₦50,000 Post-Competition Reward',
              desc: 'Direct cash reward paid to verified top-performing learners after final scores and appeals conclude.',
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
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#16C784]/12 text-[#16C784]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-display text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#9AA4B2]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
