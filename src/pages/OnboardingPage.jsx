import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import UniversitySelect from '../components/ui/UniversitySelect';
import { USER_TYPES } from '../lib/auth';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  School,
  Megaphone,
  Compass,
  Shield,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  User,
} from 'lucide-react';

const TYPE_ICONS = {
  student: GraduationCap,
  professional: Briefcase,
  tutor: BookOpen,
  school_rep: School,
  advertiser: Megaphone,
  general_learner: Compass,
  admin: Shield,
};

export default function OnboardingPage() {
  const { handleSignUp, user } = usePlatform();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'student',
    institutionId: '',
    customInstitutionName: '',
    graduationYear: '',
    role: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/profile', { replace: true });
    }
  }, [user, navigate]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validateStep = (s) => {
    setError('');
    if (s === 1) {
      if (!form.fullName.trim()) return 'Full name is required.';
      if (form.email.length < 5 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
      if (form.password.length < 6) return 'Password must be at least 6 characters.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    }
    if (s === 2) {
      if (form.accountType === 'school_rep' || form.accountType === 'admin') {
        // Institution optional for admin; required for school_rep
        if (form.accountType === 'school_rep' && !form.institutionId && !form.customInstitutionName.trim()) {
          return 'Select or enter your institution.';
        }
      } else {
        if (!form.institutionId) return 'Select your institution.';
      }
    }
    return null;
  };

  const nextStep = async () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setStep((prev) => Math.min(3, prev + 1));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const submitOnboarding = async () => {
    const err = validateStep(2);
    if (err) {
      setError(err);
      setStep(2);
      return;
    }
    setLoading(true);
    setError('');

    const payload = {
      email: form.email,
      password: form.password,
      full_name: form.fullName,
      account_type: form.accountType,
      institution_id: form.institutionId || null,
      custom_institution_name: form.customInstitutionName || null,
      graduation_year: form.graduationYear || null,
      role: form.role || null,
      bio: form.bio || null,
      onboarding_completed: true,
    };

    const result = await handleSignUp(payload);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast.success('Account created', 'Welcome to VALENCE. Your account is ready.');
    // Small delay to let auth state propagate
    setTimeout(() => navigate('/portal/student', { replace: true }), 500);
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#11161C] to-[#0B0F14] text-[#E4E9F0]">
      <div className="relative z-0 max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    step >= s
                      ? 'bg-[#16C784] text-black'
                      : 'bg-white/[0.06] text-[#667085]'
                  }`}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                <span className={`text-[11px] font-semibold hidden sm:block ${step >= s ? 'text-white' : 'text-[#667085]'}`}>
                  {s === 1 ? 'Account' : s === 2 ? 'Profile' : 'Review'}
                </span>
              </div>
              {s < 3 && (
                <div className={`h-px flex-1 mx-2 ${step > s ? 'bg-[#16C784]' : 'bg-white/[0.08]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-2xl bg-[#11161C] border border-white/[0.10] p-6 sm:p-8 shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Join VALENCE</h1>
          <p className="text-sm text-[#9AA4B2] mt-1">
            Create your account to access exam prep, community, and competitions.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-[#EA3943]/[0.10] border border-[#EA3943]/30 px-3 py-2 text-xs font-medium text-[#FF6B73]">
              {error}
            </div>
          )}

          {/* Step 1: Account details */}
          {step === 1 && (
            <div className="mt-6 space-y-4 animate-fade-up">
              <Field label="Full name" required>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className="v-input"
                  placeholder="Adeola Adeyemi"
                  autoComplete="name"
                />
              </Field>
              <Field label="Email address" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="v-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Password" required>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className="v-input"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Confirm password" required>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    className="v-input"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Step 2: Profile type & institution */}
          {step === 2 && (
            <div className="mt-6 space-y-5 animate-fade-up">
              <div>
                <label className="v-label">I am a</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {USER_TYPES.map((t) => {
                    const Icon = TYPE_ICONS[t.key] || User;
                    const active = form.accountType === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => update('accountType', t.key)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition-all ${
                          active
                            ? 'border-[#16C784] bg-[#16C784]/[0.08] text-white'
                            : 'border-white/[0.08] bg-white/[0.02] text-[#9AA4B2] hover:border-white/20'
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        <span className="text-xs font-semibold leading-tight">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field
                label={form.accountType === 'school_rep' || form.accountType === 'admin' ? 'Institution (optional)' : 'Institution'}
                required={form.accountType !== 'admin'}
              >
                <UniversitySelect
                  value={form.institutionId}
                  onChange={(id) => update('institutionId', id)}
                  placeholder="Search 466 Nigerian institutions"
                />
              </Field>

              {form.accountType === 'school_rep' && !form.institutionId && (
                <Field label="Or enter institution name" hint="If your institution is not in the directory.">
                  <input
                    type="text"
                    value={form.customInstitutionName}
                    onChange={(e) => update('customInstitutionName', e.target.value)}
                    className="v-input"
                    placeholder="e.g. XYZ Community Secondary School"
                  />
                </Field>
              )}

              {form.accountType === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Graduation year" hint="Optional">
                    <input
                      type="number"
                      value={form.graduationYear}
                      onChange={(e) => update('graduationYear', e.target.value)}
                      className="v-input"
                      placeholder="2027"
                      min="1950"
                      max="2099"
                    />
                  </Field>
                  <Field label="Role / Title" hint="Optional">
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => update('role', e.target.value)}
                      className="v-input"
                      placeholder="e.g. SS3 Student"
                    />
                  </Field>
                </div>
              )}

              <Field label="Short bio" hint="Optional">
                <textarea
                  value={form.bio}
                  onChange={(e) => update('bio', e.target.value)}
                  className="v-input resize-none"
                  rows={3}
                  placeholder="Tell the community a bit about yourself..."
                />
              </Field>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="mt-6 space-y-3 animate-fade-up">
              <ReviewRow label="Name" value={form.fullName} />
              <ReviewRow label="Email" value={form.email} />
              <ReviewRow label="Account type" value={USER_TYPES.find((t) => t.key === form.accountType)?.label || form.accountType} />
              <ReviewRow
                label="Institution"
                value={
                  form.institutionId
                    ? undefined
                    : form.customInstitutionName
                }
                extra={form.institutionId ? 'From directory' : undefined}
              />
              {form.graduationYear && <ReviewRow label="Graduation year" value={form.graduationYear} />}
              {form.role && <ReviewRow label="Role" value={form.role} />}
              {form.bio && <ReviewRow label="Bio" value={form.bio} />}

              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 mt-3">
                <p className="text-[11px] text-[#667085] leading-relaxed">
                  By creating this account you agree to the VALENCE Terms of Service and Privacy Policy. Your data is stored securely and you can adjust privacy settings at any time.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-white/[0.07]">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                step === 1 ? 'opacity-30 cursor-not-allowed' : 'text-[#9AA4B2] hover:text-white'
              }`}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#16C784] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#1DD99A] transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitOnboarding}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#16C784] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#1DD99A] transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    Create account <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#667085] mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="font-semibold text-[#16C784] hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="v-label">
          {label} {required && <span className="text-[#EA3943]">*</span>}
        </label>
        {hint && <span className="text-[10px] text-[#667085]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value, extra }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-white/[0.02] border border-white/[0.05] px-3.5 py-2.5">
      <span className="text-xs font-medium text-[#9AA4B2] shrink-0">{label}</span>
      <span className="text-xs font-semibold text-white text-right break-words">
        {value || <span className="text-[#667085] font-normal">Not provided</span>}
        {extra && <span className="text-[#667085] font-normal"> · {extra}</span>}
      </span>
    </div>
  );
}
