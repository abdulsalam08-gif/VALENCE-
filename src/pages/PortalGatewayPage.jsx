import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Award,
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import BrandLogo from '../components/ui/BrandLogo';
import { isSupabaseConfigured } from '../lib/supabase';

const PORTAL_CONFIG = {
  student: {
    badge: 'STUDENT & LEARNER PORTAL',
    title: 'VALENCE LEARN & Candidate Portal',
    subtitle:
      'Sign in or register as an ATSWA candidate, ICAN (Foundation / Skills / Professional) student, university/polytechnic student, general learner, institutional representative or advertiser.',
    icon: GraduationCap,
    highlights: [
      'Exam diet countdowns (ATSWA March/Sept · ICAN May/Nov)',
      'One-time ₦3,000 per-level unlocks & 25% multi-course discounts via Paystack',
      'Authorised Google Meet classes, reading tracker, streaks & readiness score',
      'Customisable profile, photo gallery & open VALENCE CONNECT publishing',
    ],
  },
  professional: {
    badge: 'VALENCE PROFESSIONAL',
    title: 'Chartered Accountants & Professionals Portal',
    subtitle:
      'Dedicated environment for ACA, FCA, ACCA, CPA and recognised finance professionals.',
    icon: Briefcase,
    highlights: [
      'Credential upload & manual verification for official Verified Badges',
      'Executive networking, industry discussions & CPD-related resources',
      'Structured student mentorship profiles with configurable availability',
      'Webinars, speaking invitations, career roles & verified tutor recruitment',
    ],
  },
  tutor: {
    badge: 'FACULTY RECRUITMENT & TUTOR PORTAL',
    title: 'Apply as a Tutor / Faculty Sign-In',
    subtitle:
      'Structured credential verification, timed competency testing and classroom management.',
    icon: Award,
    highlights: [
      'ATSWA Tutor minimum: verified AAT (or accepted higher qualification)',
      'ICAN Tutor mandatory: BOTH AAT certificate AND ACA certificate required',
      'Private Supabase Storage certificate review + 20-question (45-min) assessment',
      'Strict data isolation: zero tutor access to student financial records',
    ],
  },
  admin: {
    badge: 'RESTRICTED GOVERNANCE ACCESS',
    title: 'VALENCE Master Administration Portal',
    subtitle:
      'Role-based control centre for AAG PROFESSIONAL SERVICES — backend-enforced permissions only (never self-assignable).',
    icon: Shield,
    highlights: [
      '8+ Roles: Master, Academic, Finance, Tutor, Competition, Moderator, Ads & Store',
      'Dynamic control of diets, fees, discounts, products, delivery zones & banners',
      'Certificate verification, competition marking/results & official announcements',
      'Full Paystack audit logs, community moderation queue & platform settings',
    ],
  },
};

export default function PortalGatewayPage() {
  const { portalType } = useParams();
  const toast = useToast();
  const key = PORTAL_CONFIG[portalType] ? portalType : 'student';
  const cfg = PORTAL_CONFIG[key];
  const Icon = cfg.icon;

  const [authTab, setAuthTab] = useState(key === 'admin' ? 'signin' : 'register');
  const [category, setCategory] = useState('ican_skills');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info(
      'Ready for Phase 2 Supabase Connection',
      'Phase 1 Public Website is active. Live Supabase Authentication, PostgreSQL schema & RLS policies activate in Phase 2.'
    );
  };

  return (
    <section className="bg-grid-fintech py-12 sm:py-18">
      <div className="v-container space-y-8">
        {/* Portal Switcher */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'student', label: 'Student Portal' },
            { id: 'professional', label: 'Professional Portal' },
            { id: 'tutor', label: 'Tutor Portal' },
            { id: 'admin', label: 'Admin Portal' },
          ].map((p) => (
            <Link
              key={p.id}
              to={`/portal/${p.id}`}
              className={`rounded-xl px-4 py-2 text-xs font-semibold border transition-colors ${
                key === p.id
                  ? 'bg-[#16C784] text-[#06130D] border-[#16C784]'
                  : 'bg-[#11161C] text-[#9AA4B2] border-white/[0.08] hover:text-white'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Role Brief */}
          <div className="lg:col-span-6 space-y-5">
            <Badge variant="green">{cfg.badge}</Badge>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16C784]/15 border border-[#16C784]/30 text-[#16C784]">
                <Icon className="h-6 w-6" />
              </span>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">{cfg.title}</h1>
            </div>
            <p className="text-sm leading-relaxed text-[#9AA4B2]">{cfg.subtitle}</p>
            <div className="v-card p-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9AA4B2]">
                Portal Architecture & Access Controls
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#D5DBE3]">
                {cfg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Auth Card */}
          <div className="lg:col-span-6 v-glass-card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <BrandLogo size="sm" showSubtext subtextMode="tagline" to={null} />
              <Badge variant={isSupabaseConfigured ? 'green' : 'neutral'}>
                <Database className="h-3 w-3" />
                {isSupabaseConfigured ? 'Supabase Live' : 'Phase 2 Auth Ready'}
              </Badge>
            </div>

            {key !== 'admin' && (
              <div className="grid grid-cols-2 rounded-xl bg-[#0B0E11] border border-white/[0.07] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setAuthTab('signin')}
                  className={`rounded-lg py-2 text-xs font-semibold ${
                    authTab === 'signin' ? 'bg-[#16C784] text-[#06130D]' : 'text-[#9AA4B2]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`rounded-lg py-2 text-xs font-semibold ${
                    authTab === 'register' ? 'bg-[#16C784] text-[#06130D]' : 'text-[#9AA4B2]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authTab === 'register' && key !== 'admin' && (
                <>
                  <div>
                    <label className="v-label" htmlFor="pg-name">Full Name</label>
                    <input
                      id="pg-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="v-input"
                    />
                  </div>
                  {key === 'student' && (
                    <div>
                      <label className="v-label" htmlFor="pg-cat">Account Category</label>
                      <select
                        id="pg-cat"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="v-input"
                      >
                        <option value="atswa">ATSWA Examination Student (ATS 1 – 3)</option>
                        <option value="ican_foundation">ICAN Foundation Student</option>
                        <option value="ican_skills">ICAN Skills Student</option>
                        <option value="ican_professional">ICAN Professional Student</option>
                        <option value="tertiary">University / Polytechnic Student (12 Disciplines)</option>
                        <option value="general">General Accounting Learner</option>
                        <option value="advertiser">Tuition Centre / Advertiser (VALENCE ADVERTISE)</option>
                        <option value="institution">Institution Official Representative</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="v-label" htmlFor="pg-email">Email Address</label>
                <input
                  id="pg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="v-input"
                />
              </div>

              <div>
                <label className="v-label" htmlFor="pg-pass">Password</label>
                <input
                  id="pg-pass"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="v-input"
                />
              </div>

              <button type="submit" className="v-btn-primary w-full py-3">
                <Lock className="h-4 w-4" />
                {key === 'admin'
                  ? 'Sign In to Admin Portal'
                  : authTab === 'signin'
                  ? 'Sign In to VALENCE'
                  : 'Continue Registration'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="text-[11px] text-center text-[#667085]">
              Supabase Auth, email confirmation, role-based access & PostgreSQL Row Level Security connect live in <strong className="text-[#9AA4B2]">Phase 2</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
