import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BadgeCheck,
  Lock,
  ArrowRight,
  CalendarClock,
  Banknote,
  Building2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

const COMMUNITIES_SERVED = [
  { num: '01', title: 'ATSWA Students', desc: 'ATS 1, ATS 2 and ATS 3 candidates preparing for 2-day March and September diets.' },
  { num: '02', title: 'ICAN Foundation Students', desc: 'Entry-stage ACA candidates taking CBL, BE, MA and Financial Accounting.' },
  { num: '03', title: 'ICAN Skills Students', desc: 'Intermediate candidates mastering FR, FM, PSAF, AAF, Taxation and PM.' },
  { num: '04', title: 'ICAN Professional Students', desc: 'Final-stage candidates sitting SBR, Case Study, AAAF, Advanced Taxation and SFM.' },
  { num: '05', title: 'University & Polytechnic Students', desc: 'Undergraduates across all Federal, State & Private Nigerian universities and polytechnics in 12+ disciplines.' },
  { num: '06', title: 'Chartered Accountants & Professionals', desc: 'Verified ACA, FCA, ACCA, CPA and practising finance leaders.' },
  { num: '07', title: 'Verified In-App Tutors & Physical Tuition Centres', desc: 'Online tuition taught strictly in-app by VALENCE-verified tutors, plus a directory of verified physical tuition centres across Nigeria.' },
  { num: '08', title: 'General Accounting Learners', desc: 'Entrepreneurs and individuals building financial literacy, bookkeeping and tax skills.' },
];

const COMMUNITY_STANDARDS = [
  'Zero tolerance for harassment, bullying, impersonation or fraud',
  'Strict prohibition of examination misconduct and copyright infringement',
  'Central Examination Authority governance over official dates, timetables & result notices',
  'Mandatory administrative verification for all professional, tutor, centre & school badges',
  'Neutral, transparent Sponsored / Advertisement labelling across VALENCE ADVERTISE',
  'Granular Row Level Security, private document storage & audited moderation logs',
];

export default function AboutPage() {
  const { settings, pillars, universityCounts } = usePlatform();

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="relative overflow-hidden bg-grid-fintech py-14 sm:py-20">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <Badge variant="green">ABOUT VALENCE</Badge>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              Academic Excellence, Professional Growth & Institutional Neutrality.
            </h1>
            <p className="font-display text-lg italic text-[#16C784]">
              “{settings.tagline}” ({settings.taglineTranslation})
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#9AA4B2] max-w-3xl">
              <strong className="text-white">VALENCE</strong> is Nigeria’s complete accounting education, professional networking, inter-school competition, marketplace, tuition-centre directory and career development ecosystem. Membership is free for students, professionals and learners, with a one-time ₦3,000 registration required only when applying for tuition and viewing personalised cost implications, and a verified <strong className="text-[#16C784]">₦50,000 cash reward</strong> celebrating top learners after every competition closes.
            </p>
          </div>

          <div className="lg:col-span-4 v-glass-card p-6 sm:p-8 text-center space-y-4">
            <div className="mx-auto h-24 w-24 rounded-3xl bg-[#0B0E11] border border-[#16C784]/35 flex items-center justify-center shadow-glow">
              <img src="/valence-mark.png" alt="VALENCE official emblem" className="h-16 w-16 object-contain" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-wider text-white">VALENCE</h2>
              <p className="text-xs italic text-[#16C784] mt-1.5">{settings.tagline}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-left text-xs">
              <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3">
                <span className="text-[#667085] block text-[10px] uppercase">Universities</span>
                <span className="tabular-nums-display font-bold text-white">
                  {universityCounts.total}+ Embedded
                </span>
              </div>
              <div className="rounded-xl bg-[#0B0E11] border border-white/[0.06] p-3">
                <span className="text-[#667085] block text-[10px] uppercase">Merit Award</span>
                <span className="tabular-nums-display font-bold text-[#16C784]">₦50,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Communities */}
      <section className="py-16">
        <div className="v-container space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
              WHO WE SERVE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Eight Connected Academic & Professional Communities
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMUNITIES_SERVED.map((c) => (
              <div key={c.num} className="v-card p-5 space-y-2.5">
                <span className="tabular-nums-display text-xs font-bold text-[#16C784]">{c.num}</span>
                <h3 className="font-display text-base font-bold text-white">{c.title}</h3>
                <p className="text-xs leading-relaxed text-[#9AA4B2]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Pillars */}
      <section className="py-16 bg-[#0D1116]">
        <div className="v-container space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#16C784]">
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              The Seven Pillars of VALENCE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillars.map((p) => (
              <Link
                key={p.id}
                to={p.route}
                className="v-card-hover p-5 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#16C784]">
                      {p.code}
                    </span>
                    <Badge variant="neutral">{p.metric}</Badge>
                  </div>
                  <h3 className="font-display text-base font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-[#9AA4B2] leading-relaxed">{p.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#16C784] mt-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Verification & Governance */}
      <section className="py-16">
        <div className="v-container grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="v-card p-6 sm:p-8 space-y-5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/15 text-[#16C784]">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Earned Verification, Never Automatic
            </h3>
            <p className="text-sm text-[#9AA4B2] leading-relaxed">
              Uploading a certificate or business profile never automatically awards verification. Every badge on VALENCE follows manual administrative authentication:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Approved Tutors (AAT / AAT + ACA)',
                'Verified Chartered Accountants',
                'Verified Professionals',
                'Verified Institutions',
                'Verified Physical Tuition Centres',
              ].map((b) => (
                <Badge key={b} variant="verified">
                  {b}
                </Badge>
              ))}
            </div>
          </div>

          <div className="v-card p-6 sm:p-8 space-y-5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/15 text-[#16C784]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Governance, Data Privacy & Community Safety
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#C2C9D4]">
              {COMMUNITY_STANDARDS.map((rule) => (
                <li key={rule} className="flex items-start gap-2.5">
                  <Lock className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
