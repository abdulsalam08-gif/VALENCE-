import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpenCheck,
  ShieldCheck,
  Upload,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import BrandLogo from '../components/ui/BrandLogo';
import {
  CERTIFICATE_REQUIREMENTS,
  addTutorCertificate,
  createTutorApplication,
  fetchMyTutorProfile,
  fetchTutorCertificates,
  uploadTutorCertificate,
} from '../lib/tutor';

const TRACKS = {
  ATSWA: { label: 'ATSWA Tutor', certificates: CERTIFICATE_REQUIREMENTS.ATSWA, note: 'Minimum AAT certificate required.' },
  ICAN: { label: 'ICAN Tutor', certificates: CERTIFICATE_REQUIREMENTS.ICAN, note: 'Both AAT and ACA certificates required.' },
  BOTH: { label: 'Both ATSWA & ICAN', certificates: ['AAT', 'ACA'], note: 'AAT for ATSWA teaching; AAT + ACA for ICAN teaching.' },
};

const CERT_LABELS = {
  AAT: 'AAT (Associate Accounting Technician)',
  ACA: 'ACA (Associate Chartered Accountant)',
};

function CertificateUploadCard({ certType, tutorProfileId, certificates, onAdded }) {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [meta, setMeta] = useState({ certificateName: '', issuingBody: '', certificateNumber: '' });
  const existing = certificates.find((c) => c.certificate_type === certType);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const up = await uploadTutorCertificate(file, tutorProfileId);
      if (up.error) throw new Error(up.error);
      await addTutorCertificate({
        tutorProfileId,
        certificateType: certType,
        certificateName: meta.certificateName || CERT_LABELS[certType],
        issuingBody: meta.issuingBody,
        certificateNumber: meta.certificateNumber,
        documentUrl: up.fileName,
      });
      toast.success('Certificate uploaded', `${certType} certificate recorded in private storage.`);
      setMeta({ certificateName: '', issuingBody: '', certificateNumber: '' });
      onAdded();
    } catch (err) {
      toast.error('Upload failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="v-card p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">{CERT_LABELS[certType]}</p>
        {existing ? (
          <Badge variant={existing.verification_status === 'verified' ? 'verified' : existing.verification_status === 'rejected' ? 'red' : 'neutral'}>
            {existing.verification_status}
          </Badge>
        ) : (
          <Badge variant="red">Required</Badge>
        )}
      </div>
      <p className="text-[11px] text-[#9AA4B2]">
        Upload a clear scan/photo of your {certType} certificate. Documents live in private storage and are visible only to you and authorised verifiers.
      </p>
      {existing && (
        <div className="rounded-lg bg-[#0B0E11] border border-white/[0.08] p-3 flex items-center gap-2 text-[11px] text-[#C2C9D4]">
          <FileText className="h-3.5 w-3.5 text-[#16C784] shrink-0" />
          <span className="truncate">
            {existing.certificate_name} · {existing.issuing_body || 'Issuing body not set'}
            {existing.certificate_number ? ` · #${existing.certificate_number}` : ''}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          className="v-input text-xs"
          placeholder="Certificate name"
          value={meta.certificateName}
          onChange={(e) => setMeta({ ...meta, certificateName: e.target.value })}
        />
        <input
          type="text"
          className="v-input text-xs"
          placeholder="Issuing body"
          value={meta.issuingBody}
          onChange={(e) => setMeta({ ...meta, issuingBody: e.target.value })}
        />
        <input
          type="text"
          className="v-input text-xs"
          placeholder="Certificate no."
          value={meta.certificateNumber}
          onChange={(e) => setMeta({ ...meta, certificateNumber: e.target.value })}
        />
      </div>
      <label className="inline-flex items-center gap-2 rounded-xl bg-[#11161C] border border-white/[0.08] px-3.5 py-2 text-xs font-semibold text-[#C2C9D4] cursor-pointer hover:border-[#16C784]/40 hover:text-white transition-colors">
        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {uploading ? 'Uploading…' : existing ? 'Replace certificate' : 'Upload certificate'}
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}

export default function TutorApplyPage() {
  const { user } = usePlatform();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [track, setTrack] = useState('ATSWA');
  const [qualifications, setQualifications] = useState('');
  const [expertise, setExpertise] = useState('');
  const [availableHours, setAvailableHours] = useState('');
  const [preferredCategories, setPreferredCategories] = useState('');
  const [tutorProfile, setTutorProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const loadCertificates = async () => {
    if (!tutorProfile) return;
    try {
      setCertificates(await fetchTutorCertificates(tutorProfile.id));
    } catch {
      /* keep previous state */
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await fetchMyTutorProfile();
        if (cancelled) return;
        if (profile) {
          if (profile.verification_status !== 'rejected') {
            navigate('/portal/tutor', { replace: true });
            return;
          }
          setTutorProfile(profile);
          setCertificates(await fetchTutorCertificates(profile.id));
        }
      } catch {
        /* not an error for first-time visitors */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  const parseList = (v) =>
    v.split(',').map((s) => s.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await createTutorApplication({
        qualifications: parseList(qualifications),
        expertise: parseList(expertise),
        availableHours,
        preferredMenteeCategories: parseList(preferredCategories),
      });
      setTutorProfile({
        id: result.tutor_profile_id,
        verification_status: result.verification_status,
      });
      toast.success('Application submitted', 'Your tutor application is now in the verification queue.');
    } catch (err) {
      toast.error('Application failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-grid-fintech py-24 flex justify-center">
        <Loader2 className="h-6 w-6 text-[#16C784] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-grid-fintech py-12 sm:py-16">
      <div className="v-container space-y-8">
        <div className="flex items-center justify-between gap-3">
          <BrandLogo size="sm" showTagline={false} />
          <Link to="/portal/student" className="text-xs font-medium text-[#9AA4B2] hover:text-white">
            Back to portal
          </Link>
        </div>

        <div className="space-y-3">
          <Badge variant="green">MANUAL APPROVAL + QUALIFYING TEST</Badge>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[#16C784]">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Tutor Application
              </h1>
              <p className="text-sm text-[#9AA4B2]">
                ATSWA tutors need AAT; ICAN tutors need AAT + ACA. All certificates are uploaded to private storage and verified manually by Admin before the qualifying test opens.
              </p>
            </div>
          </div>
        </div>

        {!tutorProfile ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              <div className="v-card p-6 space-y-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">Application Details</p>
                <div>
                  <label className="v-label" htmlFor="track">Teaching Track Applied For</label>
                  <select id="track" className="v-input" value={track} onChange={(e) => setTrack(e.target.value)}>
                    {Object.entries(TRACKS).map(([key, t]) => (
                      <option key={key} value={key}>{t.label} — {t.note}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="v-label" htmlFor="qual">Qualifications (comma-separated)</label>
                  <input
                    id="qual"
                    type="text"
                    className="v-input"
                    placeholder="B.Sc Accounting, AAT, MBA"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                  />
                </div>
                <div>
                  <label className="v-label" htmlFor="expertise">Subject Expertise — course codes (comma-separated)</label>
                  <input
                    id="expertise"
                    type="text"
                    className="v-input"
                    placeholder="BAPS, ECO, MAT, FIN"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                  />
                </div>
                <div>
                  <label className="v-label" htmlFor="hours">Available Teaching Hours</label>
                  <input
                    id="hours"
                    type="text"
                    className="v-input"
                    placeholder="Mon–Sat, 4–8 pm"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(e.target.value)}
                  />
                </div>
                <div>
                  <label className="v-label" htmlFor="mentees">Preferred Mentee Categories (comma-separated)</label>
                  <input
                    id="mentees"
                    type="text"
                    className="v-input"
                    placeholder="ATSWA ATS 1 candidates, ICAN Foundation students"
                    value={preferredCategories}
                    onChange={(e) => setPreferredCategories(e.target.value)}
                  />
                </div>
              </div>

              <div className="v-card p-5 flex items-start gap-3 text-xs text-[#C2C9D4]">
                <ShieldCheck className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                <p>
                  Your application creates a private tutor profile. Submission is free. Verification and the 20-question / 45-minute qualifying test are the only gates to tutor delivery on VALENCE.
                </p>
              </div>

              <button type="submit" className="v-btn-primary w-full py-3" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {submitting ? 'Submitting…' : 'Submit Tutor Application'}
              </button>
            </form>

            <div className="lg:col-span-5 space-y-6">
              <div className="v-glass-card p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">How Verification Works</p>
                <ol className="space-y-3 text-xs sm:text-sm text-[#D5DBE3]">
                  {[
                    'Submit your application with teaching track and expertise.',
                    'Upload the certificates required by your track to private storage.',
                    'Admin manually verifies your certificates (AAT for ATSWA; AAT + ACA for ICAN).',
                    'Once verified, the 20-question / 45-minute qualifying test opens.',
                    'Pass 14/20 to become a verified VALENCE tutor with your workspace.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16C784]/15 text-[10px] font-bold text-[#16C784] mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="v-card p-5 space-y-2.5 text-xs text-[#C2C9D4]">
                <p className="font-semibold text-white">Certificate Requirements</p>
                <ul className="space-y-1.5">
                  {Object.entries(TRACKS).map(([key, t]) => (
                    <li key={key} className="flex items-start gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-[#16C784] shrink-0 mt-0.5" />
                      <span><span className="font-semibold text-white">{t.label}:</span> {t.certificates.map((c) => CERT_LABELS[c]).join(' + ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="v-card p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/[0.12] border border-[#16C784]/30 text-[#16C784]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Application received</p>
                    <p className="text-[11px] text-[#9AA4B2]">Your tutor profile is in the admin verification queue.</p>
                  </div>
                </div>
                <Badge variant={tutorProfile.verification_status === 'pending' ? 'neutral' : 'verified'}>
                  {tutorProfile.verification_status}
                </Badge>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#16C784]">
                  Certificate Uploads — {TRACKS[track]?.label || 'ATSWA / ICAN'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TRACKS[track].certificates.map((certType) => (
                    <CertificateUploadCard
                      key={certType}
                      certType={certType}
                      tutorProfileId={tutorProfile.id}
                      certificates={certificates}
                      onAdded={loadCertificates}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/portal/tutor')} className="v-btn-primary px-5 py-2.5">
                  Go to Tutor Workspace <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="v-glass-card p-5 space-y-3 text-xs text-[#C2C9D4]">
                <p className="font-bold text-white inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#16C784]" /> Next Steps
                </p>
                <p>Upload every certificate required for your track. Admin verification opens the qualifying test automatically — no action needed from you once certificates are in.</p>
                {certificates.length > 0 && (
                  <p className="text-[#9AA4B2]">
                    {certificates.filter((c) => c.verification_status === 'verified').length} of {certificates.length} certificate(s) verified.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
