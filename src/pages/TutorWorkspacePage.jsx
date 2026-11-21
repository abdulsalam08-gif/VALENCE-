import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpenCheck,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  ListChecks,
} from 'lucide-react';
import { useAuth, useCart, usePublicData, useUi } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import BrandLogo from '../components/ui/BrandLogo';
import {
  fetchAssessmentAttempts,
  fetchTutorAssessment,
  fetchTutorCertificates,
  fetchMyTutorProfile,
} from '../lib/tutor';

function StatusCard({ icon: Icon, tint, title, value, sub, children }) {
  return (
    <div className="v-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-[#11161C]">
          <Icon className={`h-4.5 w-4.5 ${tint}`} />
        </div>
        {children}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[#667085]">{title}</p>
        <p className="font-display text-lg font-bold text-white">{value}</p>
        {sub && <p className="text-[11px] text-[#9AA4B2] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const VERIFICATION_STYLE = {
  pending: { variant: 'neutral', label: 'Pending admin review' },
  verified: { variant: 'verified', label: 'Verified' },
  rejected: { variant: 'red', label: 'Rejected' },
};

const ASSESSMENT_STYLE = {
  pending: { variant: 'neutral', label: 'Awaiting verification' },
  ready: { variant: 'green', label: 'Open — you can start the test' },
  passed: { variant: 'verified', label: 'Passed' },
  failed: { variant: 'red', label: 'Not passed — retake available' },
  rejected: { variant: 'red', label: 'Not applicable' },
};

export default function TutorWorkspacePage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [attempts, setAttempts] = useState([]);

  const loadAll = async () => {
    try {
      const p = await fetchMyTutorProfile();
      if (!p) {
        setLoading(false);
        setProfile(null);
        return;
      }
      setProfile(p);
      const [certs, asm, atts] = await Promise.all([
        fetchTutorCertificates(p.id),
        fetchTutorAssessment(p.id),
        fetchAssessmentAttempts(p.id),
      ]);
      setCertificates(certs);
      setAssessment(asm);
      setAttempts(atts);
    } catch (err) {
      toast.error('Workspace load failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="bg-grid-fintech py-24 flex justify-center">
        <Loader2 className="h-6 w-6 text-[#16C784] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-grid-fintech py-12 sm:py-16">
        <div className="v-container space-y-8">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo size="sm" showTagline={false} />
            <Link to="/portal/student" className="text-xs font-medium text-[#9AA4B2] hover:text-white">
              Back to portal
            </Link>
          </div>
          <div className="max-w-2xl mx-auto v-card p-10 text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[#16C784]">
              <BookOpenCheck className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">No tutor application yet</h1>
            <p className="text-sm text-[#9AA4B2]">
              Apply to become a verified VALENCE accounting tutor. ATSWA tutors require AAT; ICAN tutors require AAT + ACA — then pass the 20-question / 45-minute qualifying test.
            </p>
            <button onClick={() => navigate('/portal/tutor/apply')} className="v-btn-primary px-6 py-3">
              Apply to Teach <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const vStyle = VERIFICATION_STYLE[profile.verification_status] || VERIFICATION_STYLE.pending;
  const aStyle = assessment ? ASSESSMENT_STYLE[assessment.status] || ASSESSMENT_STYLE.pending : ASSESSMENT_STYLE.pending;
  const examOpen = assessment && (assessment.status === 'ready' || (assessment.status === 'failed' && profile.verification_status === 'verified'));

  return (
    <div className="bg-grid-fintech py-12 sm:py-16">
      <div className="v-container space-y-8">
        <div className="flex items-center justify-between gap-3">
          <BrandLogo size="sm" showTagline={false} />
          <div className="flex items-center gap-3">
            <Link to="/portal/student" className="text-xs font-medium text-[#9AA4B2] hover:text-white">
              Back to portal
            </Link>
            {!examOpen && profile.verification_status !== 'verified' && (
              <button onClick={() => navigate('/portal/tutor/apply')} className="v-btn-secondary px-4 py-2 text-xs">
                Manage certificates
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[#16C784]">
            <BookOpenCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Tutor Workspace</h1>
            <p className="text-sm text-[#9AA4B2]">{user?.email}</p>
          </div>
          <Badge variant={vStyle.variant} className="ml-auto">{vStyle.label}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            icon={ShieldCheck}
            tint="text-[#16C784]"
            title="Verification"
            value={profile.verification_status}
            sub="Certificate review by VALENCE Admin"
          />
          <StatusCard
            icon={Award}
            tint={assessment?.status === 'passed' ? 'text-[#16C784]' : 'text-[#9AA4B2]'}
            title="Qualifying Test"
            value={assessment ? `${aStyle.label}` : '—'}
            sub={assessment ? `20 questions · 45 minutes · pass ${assessment.pass_score}/20` : 'Opens after verification'}
          />
          <StatusCard
            icon={ListChecks}
            tint="text-[#9AA4B2]"
            title="Attempts"
            value={attempts.length}
            sub={attempts.length ? `Best score: ${attempts.reduce((m, a) => Math.max(m, a.score ?? 0), 0)}/20` : 'No attempts yet'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificates */}
          <div className="v-card p-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Certificates</p>
            {certificates.length === 0 ? (
              <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 flex items-center gap-2 text-xs text-[#9AA4B2]">
                <FileText className="h-4 w-4" />
                No certificates uploaded yet.
              </div>
            ) : (
              <ul className="space-y-2.5">
                {certificates.map((c) => (
                  <li key={c.id} className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-4 w-4 text-[#16C784] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{c.certificate_type} — {c.certificate_name}</p>
                        <p className="text-[11px] text-[#667085] truncate">
                          {c.issuing_body || 'Issuing body not set'}
                          {c.certificate_number ? ` · #${c.certificate_number}` : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant={c.verification_status === 'verified' ? 'verified' : c.verification_status === 'rejected' ? 'red' : 'neutral'}>
                      {c.verification_status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
            {profile.verification_status === 'rejected' && (
              <div className="rounded-xl bg-[#EA3943]/10 border border-[#EA3943]/30 p-3 flex items-start gap-2 text-xs text-[#EA3943]">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Your application was rejected. You can apply again from the application page.</span>
              </div>
            )}
          </div>

          {/* Assessment */}
          <div className="v-card p-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Qualification Assessment</p>
            {assessment?.status === 'passed' ? (
              <div className="rounded-xl bg-[#16C784]/10 border border-[#16C784]/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#16C784]">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm font-bold">Qualified — you're a verified VALENCE tutor</p>
                </div>
                <p className="text-xs text-[#C2C9D4]">
                  Final score {assessment.score_achieved}/20 (pass mark {assessment.pass_score}). Delivery controls activate in the tutor delivery workspace.
                </p>
              </div>
            ) : examOpen ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-[#11161C] border border-white/[0.08] p-4 space-y-2 text-xs text-[#C2C9D4]">
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#16C784]" /> 20 questions · 45-minute timer · auto-submit at zero</p>
                  <p>Pass mark: {assessment.pass_score} / 20. Unanswered questions score zero. The server enforces the time limit.</p>
                </div>
                <button onClick={() => navigate('/portal/tutor/exam')} className="v-btn-primary w-full py-3">
                  {assessment.status === 'failed' ? 'Retake Qualifying Test' : 'Start Qualifying Test'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 flex items-center gap-2 text-xs text-[#9AA4B2]">
                <Clock className="h-4 w-4" />
                The qualifying test opens automatically once Admin verifies your certificates.
              </div>
            )}

            {attempts.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">Attempt History</p>
                <ul className="space-y-1.5">
                  {attempts.map((a) => (
                    <li key={a.id} className="flex items-center justify-between rounded-lg bg-[#0B0E11] border border-white/[0.08] px-3 py-2 text-xs">
                      <span className="text-[#C2C9D4]">{new Date(a.submitted_at || a.started_at).toLocaleString()}</span>
                      <span className={`font-semibold ${a.passed ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
                        {a.score}/20 · {a.passed ? 'Passed' : 'Failed'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {profile.verification_status === 'verified' && assessment?.status === 'passed' && (
          <div className="v-glass-card p-6 flex items-center gap-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/15 border border-[#16C784]/30 text-[#16C784]">
              <Award className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Verified tutor status active</p>
              <p className="text-xs text-[#9AA4B2]">Your profile, certificates and qualifying score are complete.</p>
            </div>
            <Link to="/portal/student" className="v-btn-secondary px-4 py-2 text-xs">Return to portal</Link>
          </div>
        )}
      </div>
    </div>
  );
}
