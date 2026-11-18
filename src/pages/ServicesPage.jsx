import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Video,
  MessageCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Users,
  Trophy,
  ShoppingBag,
  Megaphone,
  Briefcase,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

const SAMPLE_AI_WORKINGS = {
  ican: {
    badge: 'ICAN Skills · Financial Reporting (FR)',
    prompt:
      'Kano Plc acquired plant on 1 Jan 2024 for ₦40,000,000 (useful life 8 years, nil residual value). On 1 Jan 2026 it was revalued to ₦36,000,000 with remaining useful life unchanged. Calculate carrying amount at 31 Dec 2025, revaluation surplus on 1 Jan 2026 and 2026 depreciation.',
    steps: [
      { n: '1', title: 'Interpret the Question', body: 'Compute pre-revaluation carrying amount after 2 full years (2024 & 2025), recognise upward revaluation on 1 Jan 2026, and depreciate the revalued amount over the remaining 6 years.' },
      { n: '2', title: 'Identify Relevant Topic', body: 'Property, Plant and Equipment — Subsequent Measurement (Revaluation Model).' },
      { n: '3', title: 'Accounting Standard', body: 'IAS 16 (paras 31–41): Revaluation increases are credited to Other Comprehensive Income (OCI) and accumulated in Revaluation Surplus within equity unless reversing a prior P&L deficit.' },
      { n: '4', title: 'Step-by-Step Calculations (Workings)', body: 'W1 Annual dep (2024–2025) = ₦40,000,000 ÷ 8 = ₦5,000,000 p.a. | Acc. dep (2 yrs) = ₦10,000,000. | W2 CA at 31 Dec 2025 = ₦40,000,000 − ₦10,000,000 = ₦30,000,000. | W3 Revaluation surplus (1 Jan 2026) = ₦36,000,000 − ₦30,000,000 = ₦6,000,000 (OCI). | W4 2026 Depreciation = ₦36,000,000 ÷ 6 remaining yrs = ₦6,000,000 (P&L).' },
      { n: '5', title: 'Final Answer', body: 'CA (31/12/2025): ₦30,000,000 · Revaluation Surplus (01/01/2026): ₦6,000,000 · 2026 Depreciation: ₦6,000,000 · Closing CA (31/12/2026): ₦30,000,000.' },
      { n: '6', title: 'Examination Presentation', body: 'Present W1–W4 in a clean ₦’000 column, show Dr Asset / Dr Acc. Dep / Cr OCI journal entry, and note optional annual excess depreciation transfer (₦1,000,000) from Revaluation Surplus to Retained Earnings via SOCIE.' },
      { n: '7', title: 'Common Mistakes to Avoid', body: 'Dividing ₦36m by original 8 years instead of remaining 6 years, or posting the ₦6m revaluation gain into Profit or Loss instead of OCI.' },
    ],
  },
  atswa: {
    badge: 'ATSWA ATS 1 · BAPS',
    prompt:
      'Cash book (bank column) shows a debit balance of ₦485,000 on 31 Oct 2026. Bank charges of ₦6,500 and a direct credit from a customer of ₦42,000 appear only on the bank statement. Unpresented cheques total ₦74,000 and uncredited lodgements total ₦51,500. Compute adjusted cash book and bank statement balance.',
    steps: [
      { n: '1', title: 'Interpret the Question', body: 'First update the cash book for items omitted by the business, then reconcile the adjusted cash book balance to the bank statement balance for timing differences.' },
      { n: '2', title: 'Identify Relevant Topic', body: 'Bank Reconciliation Statement & Adjusted Cash Book (ATS 1 — BAPS).' },
      { n: '3', title: 'Accounting Principles', body: 'Omissions/standing orders/bank charges/credit transfers adjust the Cash Book; timing differences (unpresented cheques & uncredited lodgements) appear only in the Bank Reconciliation Statement.' },
      { n: '4', title: 'Step-by-Step Calculations', body: 'W1 Adjusted Cash Book = ₦485,000 + ₦42,000 (credit transfer) − ₦6,500 (bank charges) = ₦520,500 Dr. | W2 Bank Statement = ₦520,500 + ₦74,000 (unpresented cheques) − ₦51,500 (uncredited lodgements) = ₦543,000 Cr.' },
      { n: '5', title: 'Final Answer', body: 'Adjusted Cash Book Balance: ₦520,500 (Dr) · Balance per Bank Statement: ₦543,000 (Cr / favourable).' },
      { n: '6', title: 'Examination Presentation', body: 'Draw a two-column T-account for the Adjusted Cash Book first, bring down ₦520,500 clearly, then head the Bank Reconciliation Statement "as at 31 October 2026".' },
      { n: '7', title: 'Common Mistakes to Avoid', body: 'Recording unpresented cheques inside the Cash Book or writing "for the year ended" instead of "as at" on the reconciliation heading.' },
    ],
  },
};

export default function ServicesPage() {
  const { settings, openWhatsAppModal } = usePlatform();
  const [demoTab, setDemoTab] = useState('ican');
  const sample = SAMPLE_AI_WORKINGS[demoTab];

  const services = [
    {
      icon: Video,
      tag: 'ONLINE TUITION',
      title: 'Live Google Meet Examination Classes',
      body: 'Structured ATSWA (ATS 1–3) and ICAN (Foundation, Skills, Professional) online tuition with verified Paystack enrolment, attendance records, assignments, video libraries and syllabus trackers.',
      to: '/programmes',
      cta: 'View Programmes',
    },
    {
      icon: BookOpen,
      tag: 'PHYSICAL TUITION & OFFICIAL FEES',
      title: 'Physical Tuition & ICAN Fee Advisory Desk',
      body: 'Guided assistance for official ICAN registration, examination fees, annual subscriptions and physical tuition applications via prefilled WhatsApp enquiries (never used as online checkout).',
      action: () => openWhatsAppModal({ category: 'Physical Tuition Application Enquiry' }),
      cta: 'Enquire on WhatsApp',
    },
    {
      icon: Users,
      tag: 'VALENCE CONNECT',
      title: 'Networking, Announcements, Calls & Mentorship',
      body: 'Open community announcements, verified profiles & photo galleries, realtime 1-to-1 and group chat, WebRTC study calls, 12 subject forums, study groups and ACA/FCA mentorship.',
      to: '/connect',
      cta: 'Explore Connect',
    },
    {
      icon: Trophy,
      tag: 'VALENCE COMPETE',
      title: 'National Accounting Challenge, League & Battle Arena',
      body: 'Institutional qualifiers to national grand finale across 6 divisions, configurable ATSWA & ICAN exam engines, monthly leagues, 1v1/2v2 speed battles, Campus Ambassadors and Hall of Fame.',
      to: '/competitions',
      cta: 'See Competitions',
    },
    {
      icon: ShoppingBag,
      tag: 'VALENCE MARKETPLACE',
      title: 'Study Packs, Past Questions & Digital Library',
      body: 'All 15 ICAN study packs (7% cross-level multi-course discount), ATSWA study packs & past questions, free campus delivery across 6 Lagos hubs and authorised PDF textbooks.',
      to: '/store',
      cta: 'Open Marketplace',
    },
    {
      icon: Megaphone,
      tag: 'VALENCE ADVERTISE',
      title: 'Tuition Centre Directory & Sponsored Campaigns',
      body: '9 targeted ad placements across VALENCE plus Nigeria’s searchable Tuition Centres Directory — strictly verified, clearly labelled Sponsored, paid via Paystack with live CTR analytics.',
      to: '/advertise',
      cta: 'Advertise on VALENCE',
    },
    {
      icon: Briefcase,
      tag: 'VALENCE PROFESSIONAL & OPPORTUNITIES',
      title: 'Executive Networking, CPD & Finance Careers',
      body: 'Credential-verified ACA/FCA/ACCA/CPA hub, webinars, seminars, scholarships, audit internships, graduate trainee roles and fellowships.',
      to: '/opportunities',
      cta: 'Browse Opportunities',
    },
    {
      icon: Award,
      tag: 'TUTOR RECRUITMENT',
      title: 'Verified Faculty Onboarding & Assessment',
      body: 'ATSWA tutors require verified AAT+; ICAN tutors require BOTH AAT and ACA certificates plus a timed 20-question, 45-minute competency assessment and private credential review.',
      to: '/portal/tutor',
      cta: 'Apply as a Tutor',
    },
  ];

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container max-w-4xl space-y-4">
          <Badge variant="green">SERVICES · {settings.operatorName}</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            End-to-End Educational, Professional & Institutional Services
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2]">
            Every service on VALENCE connects to dedicated academic rules, role-based access controls, verified Paystack billing and administrator-managed scheduling.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="v-container grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div key={srv.title} className="v-card-hover p-6 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/12 border border-[#16C784]/25 text-[#16C784]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#16C784]">
                      {srv.tag}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-white">{srv.title}</h2>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#9AA4B2]">{srv.body}</p>
                </div>
                {srv.to ? (
                  <Link
                    to={srv.to}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16C784] hover:underline"
                  >
                    {srv.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={srv.action}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16C784] hover:underline self-start"
                  >
                    {srv.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive VALENCE AI Accounting Tutor Sample */}
      <section id="ai-tutor" className="py-16 bg-[#0D1116]">
        <div className="v-container space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <Badge variant="green">VALENCE AI ACCOUNTING TUTOR · SAMPLE OUTPUT</Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Structured 7-Step Examination Answer Engine
              </h2>
              <p className="text-xs text-[#9AA4B2]">
                Powered server-side with secure API isolation, usage quotas and administrator controls (live in Phase 9).
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-[#11161C] border border-white/[0.08] p-1 gap-1 self-start">
              <button
                type="button"
                onClick={() => setDemoTab('ican')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold ${
                  demoTab === 'ican' ? 'bg-[#16C784] text-[#06130D]' : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                ICAN Skills (FR)
              </button>
              <button
                type="button"
                onClick={() => setDemoTab('atswa')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold ${
                  demoTab === 'atswa' ? 'bg-[#16C784] text-[#06130D]' : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                ATSWA (BAPS)
              </button>
            </div>
          </div>

          <div className="v-card p-6 sm:p-8 space-y-5">
            <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-1.5">
              <span className="text-[11px] font-bold text-[#16C784]">{sample.badge}</span>
              <p className="text-xs sm:text-sm text-[#F4F6F9] leading-relaxed">{sample.prompt}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {sample.steps.map((s) => (
                <div
                  key={s.n}
                  className={`rounded-xl bg-[#0B0E11] border border-white/[0.06] p-4 space-y-1.5 ${
                    s.n === '4' ? 'md:col-span-2 border-[#16C784]/30' : ''
                  }`}
                >
                  <p className="text-xs font-bold text-[#16C784]">
                    Step {s.n} · {s.title}
                  </p>
                  <p className="text-xs leading-relaxed text-[#C2C9D4]">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
