import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Loader2, Award, Briefcase, Clock, Users, FileCheck2,
  CheckCircle2, XCircle, Plus,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import {
  fetchProfessionalDirectory,
  fetchProfessionalProfileByProfile,
  manageProfessionalProfile,
  submitProfessionalCredential,
  fetchMyProfessionalCredentials,
  submitProfessionalVerification,
  fetchMyProfessionalVerification,
} from '../lib/opportunities';

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(iso).slice(0, 10);
  }
}

function ChipList({ items }) {
  if (!items || items.length === 0) return <span className="text-[#9AA4B2]">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i, idx) => (
        <span key={idx} className="rounded-md bg-[#16C784]/10 border border-[#16C784]/20 px-2 py-0.5 text-[11px] text-[#16C784]">{i}</span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Verified professional card (directory)                             */
/* ------------------------------------------------------------------ */

function DirectoryCard({ prof }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16C784]/15 text-[#16C784] font-bold">
            {prof.display_name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <p className="font-semibold text-white">{prof.display_name}</p>
            {prof.institution_name && <p className="text-[11px] text-[#9AA4B2]">{prof.institution_name}</p>}
          </div>
        </div>
        <Badge variant="verified"><ShieldCheck className="h-3.5 w-3.5" /> VALENCE PRO</Badge>
      </div>
      {prof.experience && <p className="mt-3 text-xs leading-relaxed text-[#9AA4B2] line-clamp-3">{prof.experience}</p>}
      <div className="mt-3 space-y-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#9AA4B2]">Expertise</p>
          <div className="mt-1"><ChipList items={prof.expertise} /></div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#9AA4B2]">Qualifications</p>
          <div className="mt-1"><ChipList items={prof.qualifications} /></div>
        </div>
        {prof.available_hours && (
          <p className="inline-flex items-center gap-1.5 text-[11px] text-[#9AA4B2]"><Clock className="h-3.5 w-3.5" /> {prof.available_hours}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Own professional hub panel                                         */
/* ------------------------------------------------------------------ */

function MyProHub() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [creds, setCreds] = useState([]);
  const [verifs, setVerifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ qualifications: '', expertise: '', experience: '', available_hours: '', preferred_mentee_categories: '' });

  const load = useCallback(async () => {
    try {
      const [p, c, v] = await Promise.all([
        fetchProfessionalProfileByProfile(),
        fetchMyProfessionalCredentials(),
        fetchMyProfessionalVerification(),
      ]);
      setProfile(p || null);
      setCreds(c || []);
      setVerifs(v || []);
      if (p) {
        setForm({
          qualifications: (p.qualifications || []).join(', '),
          expertise: (p.expertise || []).join(', '),
          experience: p.experience || '',
          available_hours: p.available_hours || '',
          preferred_mentee_categories: (p.preferred_mentee_categories || []).join(', '),
        });
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  function arr(str) {
    return str.split(',').map((s) => s.trim()).filter(Boolean);
  }

  async function handleSave() {
    try {
      await manageProfessionalProfile({
        p_qualifications: arr(form.qualifications),
        p_expertise: arr(form.expertise),
        p_experience: form.experience,
        p_available_hours: form.available_hours,
        p_preferred_mentee_categories: arr(form.preferred_mentee_categories),
      });
      toast.success('Professional profile saved');
      setEditing(false);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function handleCredential(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await submitProfessionalCredential({
        p_credential_type: fd.get('type'),
        p_credential_name: fd.get('name'),
        p_issuing_body: fd.get('body'),
        p_certificate_number: fd.get('number'),
        p_document_url: fd.get('doc') || null,
      });
      toast.success('Credential submitted for verification');
      e.target.reset();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleVerification() {
    try {
      await submitProfessionalVerification({
        p_verification_type: 'Professional Body Membership',
        p_verification_body: 'ICAN Nigeria',
        p_document_url: null,
      });
      toast.success('VALENCE PRO verification requested');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" />;

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">My VALENCE PRO Profile</h3>
              <Badge variant={profile?.verification_status === 'verified' ? 'verified' : profile?.verification_status === 'rejected' ? 'red' : 'live'}>
                {profile?.verification_status || 'not set up'}
              </Badge>
            </div>
            {profile ? (
              <>
                <p className="mt-2 text-xs text-[#9AA4B2]">{profile.experience}</p>
                <div className="mt-3 space-y-2">
                  <div><p className="text-[10px] uppercase tracking-wide text-[#9AA4B2]">Expertise</p><div className="mt-1"><ChipList items={profile.expertise} /></div></div>
                  <div><p className="text-[10px] uppercase tracking-wide text-[#9AA4B2]">Qualifications</p><div className="mt-1"><ChipList items={profile.qualifications} /></div></div>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-[#9AA4B2]">Set up your professional profile to join the VALENCE PRO hub.</p>
            )}
          </div>
          <button
            onClick={() => setEditing((v) => !v)}
            className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-[#C2C9D4] hover:text-white"
          >
            {editing ? 'Cancel' : profile ? 'Edit Profile' : 'Set Up Profile'}
          </button>
        </div>

        {editing && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-[#9AA4B2]">Qualifications (comma-separated)
              <input value={form.qualifications} onChange={(e) => setForm((f) => ({ ...f, qualifications: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
            </label>
            <label className="text-xs text-[#9AA4B2]">Expertise (comma-separated)
              <input value={form.expertise} onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
            </label>
            <label className="text-xs text-[#9AA4B2] sm:col-span-2">Experience
              <textarea value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} rows={3}
                className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
            </label>
            <label className="text-xs text-[#9AA4B2]">Available hours
              <input value={form.available_hours} onChange={(e) => setForm((f) => ({ ...f, available_hours: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
            </label>
            <label className="text-xs text-[#9AA4B2]">Preferred mentee categories (comma-separated)
              <input value={form.preferred_mentee_categories} onChange={(e) => setForm((f) => ({ ...f, preferred_mentee_categories: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
            </label>
            <div className="sm:col-span-2 flex justify-end">
              <button onClick={handleSave} className="rounded-lg bg-[#16C784] px-4 py-2 text-sm font-semibold text-[#06130D]">Save Profile</button>
            </div>
          </div>
        )}

        {!profile?.verification_status || profile?.verification_status === 'pending' || profile?.verification_status === 'rejected' ? (
          <div className="mt-4">
            <button onClick={handleVerification} className="rounded-lg border border-[#16C784]/40 bg-[#16C784]/10 px-4 py-2 text-sm font-semibold text-[#16C784] hover:bg-[#16C784]/20">
              Request VALENCE PRO Verification
            </button>
          </div>
        ) : null}
      </div>

      {/* Verification history */}
      {verifs.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><FileCheck2 className="h-4 w-4 text-[#16C784]" /> Verification Requests</h3>
          <ul className="space-y-2">
            {verifs.map((v) => (
              <li key={v.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] px-3 py-2">
                <div>
                  <p className="text-sm text-white">{v.verification_type} · {v.verification_body}</p>
                  <p className="text-[11px] text-[#9AA4B2]">{fmtDate(v.created_at)}</p>
                </div>
                <Badge variant={v.status === 'approved' ? 'verified' : v.status === 'rejected' ? 'red' : 'live'}>{v.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Credentials */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Award className="h-4 w-4 text-[#16C784]" /> Professional Credentials</h3>
        <form onSubmit={handleCredential} className="mb-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-[#9AA4B2]">Credential type
            <input name="type" required placeholder="e.g. ACA Final" className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
          </label>
          <label className="text-xs text-[#9AA4B2]">Credential name
            <input name="name" required placeholder="e.g. ACA" className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
          </label>
          <label className="text-xs text-[#9AA4B2]">Issuing body
            <input name="body" required placeholder="e.g. ICAN Nigeria" className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
          </label>
          <label className="text-xs text-[#9AA4B2]">Certificate number
            <input name="number" placeholder="optional" className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-lg bg-[#16C784] px-4 py-2 text-sm font-semibold text-[#06130D]">Submit Credential</button>
          </div>
        </form>
        {creds.length === 0 ? (
          <p className="text-sm text-[#9AA4B2]">No credentials submitted yet.</p>
        ) : (
          <ul className="space-y-2">
            {creds.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] px-3 py-2">
                <div>
                  <p className="text-sm text-white">{c.credential_name} · {c.credential_type}</p>
                  <p className="text-[11px] text-[#9AA4B2]">{c.issuing_body}{c.certificate_number ? ` · ${c.certificate_number}` : ''}</p>
                </div>
                <Badge variant={c.verification_status === 'verified' ? 'verified' : c.verification_status === 'rejected' ? 'red' : 'live'}>
                  {c.verification_status === 'verified' ? <CheckCircle2 className="h-3.5 w-3.5" /> : c.verification_status === 'rejected' ? <XCircle className="h-3.5 w-3.5" /> : null}
                  {c.verification_status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ValenceProPage() {
  const { user } = usePlatform();
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessionalDirectory(50, 0)
      .then((d) => setDirectory(d || []))
      .catch(() => setDirectory([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="space-y-2">
        <Link to="/" className="text-xs text-[#9AA4B2] hover:text-white">← VALENCE home</Link>
        <Badge variant="official"><ShieldCheck className="h-3.5 w-3.5" /> VALENCE PRO</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Verified Professional Hub</h1>
        <p className="text-sm text-[#9AA4B2] max-w-2xl">
          The VALENCE PRO hub connects students and learners with verified accounting and finance professionals — every member's credentials and body membership are checked by VALENCE before they go live.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white"><Users className="h-4 w-4 text-[#16C784]" /> Verified Professionals</h2>
          {loading ? (
            <div className="p-8 text-center text-[#9AA4B2]"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
          ) : directory.length === 0 ? (
            <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-[#9AA4B2]">
              No verified professionals yet. Be the first — set up your VALENCE PRO profile.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {directory.map((prof) => <DirectoryCard key={prof.id} prof={prof} />)}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white"><Briefcase className="h-4 w-4 text-[#16C784]" /> Your VALENCE PRO Hub</h2>
          {user ? (
            <MyProHub />
          ) : (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-sm text-[#9AA4B2]">
              Sign in to set up your professional profile, submit credentials and request VALENCE PRO verification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
