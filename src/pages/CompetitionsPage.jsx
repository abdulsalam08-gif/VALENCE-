import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Swords,
  Medal,
  Building2,
  ShieldCheck,
  Clock,
  ArrowRight,
  Users,
  Award,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

export default function CompetitionsPage() {
  const { competitionDivisions } = usePlatform();

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-5 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="live">VALENCE COMPETE</Badge>
            <Badge variant="green">Inter-School & National Tournament</Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            VALENCE National Accounting Challenge
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2]">
            Also known as the <strong className="text-white">VALENCE Inter-School Accounting Challenge</strong> — uniting universities, polytechnics, colleges and professional candidates across Nigeria through syllabus-rigorous, never-mixed examination divisions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/portal/student" className="v-btn-primary text-xs">
              <Trophy className="h-4 w-4" /> Register as Candidate / School Team
            </Link>
            <Link to="/contact" className="v-btn-secondary text-xs">
              Apply for Verified Institution Profile
            </Link>
          </div>
        </div>
      </section>

      {/* 6 Divisions */}
      <section className="py-14">
        <div className="v-container space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Six Distinct Competition Divisions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitionDivisions.map((d, idx) => (
              <div key={d.id} className="v-card-hover p-5 space-y-2.5">
                <span className="tabular-nums-display text-xs font-bold text-[#16C784]">
                  DIVISION 0{idx + 1}
                </span>
                <h3 className="font-display text-lg font-bold text-white">{d.name}</h3>
                <p className="text-xs font-medium text-[#C2C9D4]">{d.level}</p>
                <p className="text-xs text-[#9AA4B2] border-t border-white/[0.06] pt-2.5">
                  {d.format}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exact Configurable Exam Formats: ATSWA vs ICAN */}
      <section className="py-14 bg-[#0D1116]">
        <div className="v-container space-y-6">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
              EXAMINATION ENGINE SPECIFICATION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Authentic, Admin-Configurable ATSWA & ICAN Exam Structures
            </h2>
            <p className="text-xs text-[#9AA4B2]">
              Server-controlled timers, question/option randomisation, offline-resilient autosave, auto-marked objective items and rubric-guided human theory marking with moderator review and appeals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="v-card p-6 space-y-4">
              <Badge variant="green">ATSWA Examination Format</Badge>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between rounded-xl bg-[#0B0E11] p-3.5">
                  <span className="text-white font-semibold">Section A · Multiple-Choice (MCQ)</span>
                  <span className="tabular-nums-display text-[#16C784] font-bold">30 Questions (Configurable)</span>
                </div>
                <div className="flex justify-between rounded-xl bg-[#0B0E11] p-3.5">
                  <span className="text-white font-semibold">Section B · Short-Answer (SAQ)</span>
                  <span className="tabular-nums-display text-[#16C784] font-bold">20 Questions (Configurable)</span>
                </div>
                <div className="flex justify-between rounded-xl bg-[#0B0E11] p-3.5">
                  <span className="text-white font-semibold">Section C · Answer 4 of 6 Theory (12.5m each)</span>
                  <span className="tabular-nums-display text-[#16C784] font-bold">50 Marks</span>
                </div>
              </div>
            </div>

            <div className="v-card p-6 space-y-4">
              <Badge variant="green">ICAN Examination Format (100 Marks)</Badge>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between rounded-xl bg-[#0B0E11] p-3.5">
                  <span className="text-white font-semibold">Section A · Compulsory</span>
                  <span className="tabular-nums-display text-[#16C784] font-bold">30 Marks</span>
                </div>
                <div className="flex justify-between rounded-xl bg-[#0B0E11] p-3.5">
                  <span className="text-white font-semibold">Section B · Answer 2 of 3 Theory (20m each)</span>
                  <span className="tabular-nums-display text-[#16C784] font-bold">40 Marks</span>
                </div>
                <div className="flex justify-between rounded-xl bg-[#0B0E11] p-3.5">
                  <span className="text-white font-semibold">Section C · Answer 2 of 4 Theory (15m each)</span>
                  <span className="tabular-nums-display text-[#16C784] font-bold">30 Marks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* League, Battle Arena, Ambassadors & Hall of Fame */}
      <section className="py-14">
        <div className="v-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Building2, title: 'National Accounting League', desc: 'Annual institutional season with school qualifiers, regional rounds, group stages, semifinals, grand finale & monthly fixtures.' },
            { icon: Swords, title: 'VALENCE Battle Arena', desc: '1v1 duels, 2v2 challenges, school-vs-school matches, daily puzzles and weekly challenges scored on accuracy and rigour — not speed alone.' },
            { icon: Users, title: 'Campus Ambassador Programme', desc: 'Represent VALENCE at your university or polytechnic, coordinate study groups & trials, and earn verified leadership certificates.' },
            { icon: Medal, title: 'Accounting Hall of Fame', desc: 'Permanent recognition of verified national champions, top ICAN/ATSWA/university scholars, tutors, professionals and ambassadors.' },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="v-card p-5 space-y-2.5">
                <Icon className="h-5 w-5 text-[#16C784]" />
                <h3 className="font-display text-base font-bold text-white">{c.title}</h3>
                <p className="text-xs text-[#9AA4B2] leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
