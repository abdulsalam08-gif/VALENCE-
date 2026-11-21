import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  GraduationCap,
  BookOpenCheck,
  Building2,
  Megaphone,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Database,
  ArrowRight,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuth, useCart, usePublicData, useUi } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import BrandLogo from '../components/ui/BrandLogo';
import UniversitySelect from '../components/ui/UniversitySelect';
import { useNavigate } from 'react-router-dom';

const PORTAL_META = {
  student: {
    key: 'student',
    label: 'Student & Learner Portal',
    badge: 'FREE TO JOIN · ₦3,000 ONLY FOR TUITION',
    icon: GraduationCap,
    headline: 'Your Complete Accounting Study, Timetable, Connect & Competition Workspace',
    summary:
      'Free signup for ATSWA candidates, ICAN candidates, students across all Nigerian universities/polytechnics and general accounting learners. Pay ₦3,000 per level only when applying for tuition and viewing cost implications.',
    capabilities: [
      'Free access to profile, photo gallery, forums, study groups, AI tools & official diet timetables',
      'In-app ATSWA document checklist, upload & registration guidance + in-app study material & delivery enquiries',
      'Optional ₦3,000 per-level Paystack registration exclusively when applying for tuition & cost implication',
      'Per-course past question & study pack orders (buy 1 course or all applicable) with automatic discounts up to 9%',
      '15 study tools, WebRTC voice/video calling & National Competitions with ₦500,000 podium cash prizes',
    ],
    needsInstitution: true,
    registerFields: [
      { name: 'learnerCategory', label: 'Learner Type', type: 'select', options: [
        'ATSWA Examination Student (ATS 1 – ATS 3)',
        'ICAN Foundation / Skills / Professional Student',
        'University / Polytechnic / College Student',
        'General Accounting Learner',
      ] },
    ],
  },
  tutor: {
    key: 'tutor',
    label: 'Tutor Portal',
    badge: 'MANUAL APPROVAL + QUALIFYING TEST',
    icon: BookOpenCheck,
    headline: 'Apply or Sign In as an Approved VALENCE Accounting Tutor',
    summary:
      'ATSWA tutors require minimum AAT; ICAN tutors require BOTH AAT and ACA certificates uploaded to private storage, manually verified by Admin, plus passing the 20-question 45-minute qualifying test.',
    capabilities: [
      'ATSWA Tutors: Minimum AAT certificate upload + Admin authentication + 20-Q / 45-min timed test',
      'ICAN Tutors: Mandatory AAT + ACA certificates uploaded & verified before ICAN subject assignment',
      'Course assignment roster, live Google Meet delivery, assignments, grading queue & Q&A responses',
      'Strict role isolation: zero access to platform finance or central schedule modifications',
    ],
    needsInstitution: true,
    registerFields: [
      { name: 'tutorTrack', label: 'Teaching Track Applied For', type: 'select', options: [
        'ATSWA Tutor (Minimum AAT Certificate Required)',
        'ICAN Tutor (Both AAT & ACA Certificates Required)',
        'Both ATSWA & ICAN (AAT + ACA Required)',
      ] },
    ],
  },
  school: {
    key: 'school',
    label: 'School & Institution Portal',
    badge: 'ALL NIGERIAN UNIVERSITIES EMBEDDED',
    icon: Building2,
    headline: 'Register Your Nigerian University, Polytechnic, College or Tuition Centre',
    summary:
      'Select your institution from the embedded directory of all Nigerian universities, polytechnics and colleges, manage candidate squads (strictly only 4 competitors per school), appoint supervisors and track national rankings, Top VALENCE Students and ₦500,000 podium reward tracking.',
    capabilities: [
      'Full Federal, State & Private Nigerian university directory + polytechnics & colleges',
      'Coordinator verification & official Verified Institution profile badge',
      'Multi-division competition team registration, roster locking & qualifying status',
      'Realtime school leaderboard analytics, merit certificates, Top VALENCE Students spotlight & podium reward tracking (₦250,000 / ₦150,000 / ₦100,000)',
    ],
    needsInstitution: true,
    registerFields: [
      { name: 'institutionType', label: 'Institution Category', type: 'select', options: [
        'Federal University',
        'State University',
        'Private University',
        'Polytechnic / Monotechnic',
        'College of Education',
        'ATSWA / ICAN Tuition Centre',
      ] },
    ],
  },
  advertiser: {
    key: 'advertiser',
    label: 'VALENCE Advertiser Portal',
    badge: 'PHYSICAL CENTRES · AUTHORS · BOOK VENDORS · ₦10K/WK',
    icon: Megaphone,
    headline: 'Promote Your Physical Tuition Centre, Textbooks or Bookshop (₦10,000/Week)',
    summary:
      'Open to verified physical (in-person) accounting tuition centres, accounting textbook authors selling original books, and verified textbook vendors/bookshops. Book weekly ads at ₦10,000/week via Paystack and track live CTR in-app. (Online tuition stays strictly in-app via VALENCE-verified tutors.)',
    capabilities: [
      'Verified Physical Tuition Centres (in-person venues only), Textbook Authors & Verified Textbook Vendors',
      '100% in-app campaign booking at ₦10,000/week across 9 placements (incl. Bookstore & Syllabus spotlights)',
      'Verified Physical Tuition Centres: publish verified per-level/per-course tuition cost implications revealed to students who unlock a level',
      'Textbook Authors & Vendors: built-in in-app student enquiry inbox plus optional in-app Paystack checkout',
      'Strict zero-piracy verification for author textbooks & vendor stock, plus physical venue verification for centres',
      'Live impression counts, clicks, CTR analytics, Paystack receipts & one-click weekly renewals',
    ],
    needsInstitution: false,
    registerFields: [
      { name: 'advertiserCategory', label: 'Advertiser Type', type: 'select', options: [
        'Verified Physical Tuition Centre (In-Person Only)',
        'Accounting Textbook Author',
        'Verified Textbook Vendor / Bookshop',
      ] },
      { name: 'centreName', label: 'Centre, Author or Bookshop Name', type: 'text', placeholder: 'Your registered centre, author or bookshop name' },
    ],
  },
  admin: {
    key: 'admin',
    label: 'Admin & Central Examination Authority',
    badge: 'FULL PLATFORM CMS · RBAC · RLS PROTECTED',
    icon: ShieldCheck,
    headline: 'VALENCE Administration, Content Updates & Central Examination Authority Console',
    summary:
      'Complete role-based Admin Portal to update all live platform information anytime: store courses/prices/discounts, delivery zones & in-app material enquiries, ATSWA document & registration guidance, ₦10,000/week ad rates & campaigns, official exam timetables/results, tuition pricing, FAQs and announcements.',
    capabilities: [
      'Dynamic Platform & Pricing CMS: update per-course past question/study pack prices, discounts, delivery zones, tuition fees, ₦3,000 lock, ₦10,000/week ad rate, motivational quote pop-ups & FAQs anytime',
      'In-App Operations Queues: manage ATSWA document/registration guidance, study material & delivery enquiries, and VALENCE ADVERTISE campaign approvals & billing',
      'Central Examination Authority: update ATSWA (2-day) & ICAN (3-day) dates, paper timetables & 30-day result release / delay notices',
      'Competition Manager: papers, timers, rubric grading, appeals & ₦250,000 / ₦150,000 / ₦100,000 podium post-competition reward disbursement logs',
      'Verification, Finance & Moderation: tutor certificates (AAT / AAT + ACA), professionals, Nigerian institutions, Paystack audit logs & community safety',
    ],
    needsInstitution: false,
    registerFields: [],
  },
};

export default function PortalGatewayPage({ defaultPortal = 'student' }) {
  const { portalType } = useParams();
  const [searchParams] = useSearchParams();
  const { handleSignIn, handleSignUp } = useAuth();
  const { universityCounts } = usePublicData();
  const toast = useToast();
  const navigate = useNavigate();

  const routePortal = portalType || defaultPortal;
  const initialPortal = PORTAL_META[routePortal] ? routePortal : 'student';
  const [selectedPortal, setSelectedPortal] = useState(initialPortal);
  const [mode, setMode] = useState(
    selectedPortal === 'admin' ? 'signin' : searchParams.get('mode') || 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState(searchParams.get('institution') || '');

  useEffect(() => {
    const nextPortal = PORTAL_META[routePortal] ? routePortal : 'student';
    setSelectedPortal(nextPortal);
    if (nextPortal === 'admin') {
      setMode('signin');
    } else if (searchParams.get('mode') === 'register') {
      setMode('register');
    }
    const inst = searchParams.get('institution');
    if (inst) setUniversity(inst);
  }, [routePortal, searchParams]);

  const meta = PORTAL_META[selectedPortal];
  const Icon = meta.icon;
  const applyForTuition = searchParams.get('apply') === 'tuition';

  // Map each portal to its own post-login destination — every portal lands on
  // the portal it is meant to. general_learner uses the student/learner portal
  // as its workspace; school gets its own gateway path.
  const portalRoute = {
    student: '/portal/student',
    school: '/portal/school',
    general_learner: '/portal/student',
    tutor: '/portal/tutor',
    advertiser: '/portal/advertiser',
    admin: '/portal/admin',
  };

  const handlePortalSwitch = (key) => {
    setSelectedPortal(key);
    if (key === 'admin') setMode('signin');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast.info(
        'Database & Supabase Auth Activating in Phase 2–3',
        `${meta.label} interface is wired and ready for live Supabase authentication and role-based RLS.`
      );
      return;
    }

    if (mode === 'signin') {
      const result = await handleSignIn(email, password);
      if (result.error) {
        toast.error('Sign in failed', result.error);
        return;
      }
      toast.success('Signed in', `Welcome to ${meta.label}.`);
      navigate(portalRoute[selectedPortal] || '/portal/student');
    } else {
        const accountType = selectedPortal === 'admin' ? 'admin' :
        selectedPortal === 'school' ? 'school_rep' :
        selectedPortal === 'tutor' ? 'tutor' :
        selectedPortal === 'advertiser' ? 'advertiser' :
        selectedPortal === 'general_learner' ? 'general_learner' : 'student';

      const payload = {
        email,
        password,
        full_name: fullName || email.split('@')[0],
        account_type: accountType,
        institution_id: selectedPortal === 'admin' ? null : university || null,
        onboarding_completed: true,
      };
      const result = await handleSignUp(payload);
      if (result.error) {
        toast.error('Registration failed', result.error);
        return;
      }
      toast.success('Account created', `Welcome to VALENCE.`);
      navigate(selectedPortal === 'tutor' ? '/portal/tutor/apply' : portalRoute[selectedPortal] || '/portal/student');
    }
  };

  return (
    <div className="bg-grid-fintech py-12 sm:py-16">
      <div className="v-container space-y-8">
        {/* Portal Switcher Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.values(PORTAL_META).map((p) => {
            const PIcon = p.icon;
            const active = selectedPortal === p.key;
            return (
              <Link
                key={p.key}
                to={`/portal/${p.key}`}
                onClick={() => handlePortalSwitch(p.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-[#16C784] text-[#06130D] border-[#16C784] shadow-glow-sm'
                    : 'bg-[#11161C] text-[#C2C9D4] border-white/[0.08] hover:border-white/[0.2] hover:text-white'
                }`}
              >
                <PIcon className="h-3.5 w-3.5" />
                {p.label.replace(' Portal', '').replace(' & Central Examination Authority', '')}
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Portal Overview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <Badge variant="green">{meta.badge}</Badge>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[#16C784]">
                  <Icon className="h-6 w-6" />
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {meta.label}
                </h1>
              </div>
              <p className="font-display text-base sm:text-lg font-medium text-[#E5E9F0]">
                {meta.headline}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#9AA4B2]">{meta.summary}</p>
            </div>

            {applyForTuition && selectedPortal === 'student' && (
              <div className="rounded-2xl bg-[#16C784]/10 border border-[#16C784]/35 p-4 text-xs text-[#E5E9F0] space-y-1">
                <p className="font-bold text-[#16C784]">
                  Tuition Application & Cost Implication Selected (₦3,000 One-Time Unlock)
                </p>
                <p className="text-[#C2C9D4]">
                  Sign in or create your free account below to unlock your selected level’s personalised tuition cost implication via Paystack. (If you do not want tuition, no ₦3,000 payment is required.)
                </p>
              </div>
            )}

            <div className="v-card p-6 space-y-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">
                Included Portal Capabilities
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#D5DBE3]">
                {meta.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!isSupabaseConfigured && (
              <div className="rounded-2xl bg-[#11161C] border border-[#16C784]/25 p-4 flex items-start gap-3 text-xs text-[#C2C9D4]">
                <Database className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Supabase Auth & Database Binding Ready</p>
                  <p className="text-[#9AA4B2] mt-0.5">
                    Live database provisioning (including all {universityCounts.total} accredited Nigerian universities, polytechnics &amp; colleges, Central Exam Authority tables, ₦3,000 tuition unlock records &amp; ₦500,000 podium reward ledgers) connects directly in Phase 2 &amp; Phase 3.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sign In / Create Account Card */}
          <div className="lg:col-span-6 v-glass-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <BrandLogo size="sm" showTagline={false} />
              {selectedPortal !== 'admin' ? (
                <div className="inline-flex rounded-xl bg-[#0B0E11] border border-white/[0.08] p-1">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      mode === 'signin' ? 'bg-[#16C784] text-[#06130D]' : 'text-[#9AA4B2]'
                    }`}
                  >
                    <LogIn className="h-3.5 w-3.5" /> Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      mode === 'register' ? 'bg-[#16C784] text-[#06130D]' : 'text-[#9AA4B2]'
                    }`}
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Register Free
                  </button>
                </div>
              ) : (
                <Badge variant="red">Restricted Admin Access</Badge>
              )}
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === 'register' && selectedPortal !== 'admin' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="v-label" htmlFor="p-name">Full Name</label>
                      <input
                        id="p-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Surname & First Name"
                        className="v-input"
                      />
                    </div>
                    <div>
                      <label className="v-label" htmlFor="p-phone">Phone / WhatsApp</label>
                      <input
                        id="p-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="v-input"
                      />
                    </div>
                  </div>

                  {meta.registerFields.map((field) => (
                    <div key={field.name}>
                      <label className="v-label" htmlFor={`p-${field.name}`}>{field.label}</label>
                      {field.type === 'select' ? (
                        <select id={`p-${field.name}`} className="v-input">
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={`p-${field.name}`}
                          type="text"
                          required
                          placeholder={field.placeholder}
                          className="v-input"
                        />
                      )}
                    </div>
                  ))}

                  {meta.needsInstitution && (
                    <UniversitySelect
                      id="p-university"
                      label={`Nigerian University / Institution (${universityCounts.total} Embedded)`}
                      value={university}
                      onChange={setUniversity}
                    />
                  )}
                </>
              )}

              <div>
                <label className="v-label" htmlFor="p-email">Email Address</label>
                <input
                  id="p-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="v-input"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#C2C9D4]" htmlFor="p-pass">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() =>
                        toast.info('Password Reset', 'Email recovery activates with Supabase Auth in Phase 3.')
                      }
                      className="text-[11px] font-medium text-[#16C784] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="p-pass"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="v-input"
                />
              </div>

              <button type="submit" className="v-btn-primary w-full py-3">
                {mode === 'signin'
                  ? `Sign In to ${meta.label}`
                  : `Create Free ${meta.label.replace(' Portal', '')} Account`}
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11px] text-center text-[#9AA4B2]">
                By continuing, you agree to VALENCE&apos;s{' '}
                <Link to="/legal/terms" className="text-[#16C784] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/legal/privacy" className="text-[#16C784] hover:underline">
                  NDPA Privacy Policy
                </Link>
                .
              </p>
            </form>

            <div className="border-t border-white/[0.07] pt-4 flex items-center justify-between gap-2 text-[11px] text-[#667085]">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#16C784]" />
                Encrypted Supabase Auth · Role-Isolated RLS
              </span>
              <span>Zero Secrets in Client</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
