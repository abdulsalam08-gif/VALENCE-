import React, { useEffect, useState, useCallback } from 'react';
import {
  Briefcase, ClipboardList, Calendar, ShieldCheck, Loader2, Plus,
  CheckCircle2, XCircle, Users, Award, FileCheck2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import {
  fetchOpportunities,
  manageOpportunity,
  fetchOpportunityApplications,
  reviewOpportunityApplication,
  fetchCpdWebinars,
  manageCpdWebinar,
  fetchCpdWebinarRegistrations,
  markCpdAttendance,
  fetchProfessionalCredentials,
  reviewProfessionalCredential,
  fetchProfessionalVerificationQueue,
  reviewProfessionalVerification,
} from '../lib/opportunities';
import { formatNaira } from '../lib/pricing';

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(iso);
  }
}

export default function OpportunitiesAdminPage() {
  const [tab, setTab] = useState('opportunities');
  const tabs = [
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: ClipboardList },
    { id: 'webinars', label: 'CPD Webinars', icon: Calendar },
    { id: 'pro', label: 'PRO Verification', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition ${tab === t.id ? 'bg-[#16C784] text-[#06130D]' : 'border border-white/[0.08] text-[#9AA4B2] hover:bg-white/[0.04]'}`}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'opportunities' && <OpportunitiesPanel />}
      {tab === 'applications' && <ApplicationsPanel />}
      {tab === 'webinars' && <WebinarsPanel />}
      {tab === 'pro' && <ProVerificationPanel />}
    </div>
  );
}

const run = (toast, fn, successMsg) => async () => {
  try {
    const res = await fn();
    toast.success(successMsg);
    return res;
  } catch (e) {
    toast.error(e.message);
  }
};

/* ------------------------------------------------------------------ */
/* Opportunities panel                                                */
/* ------------------------------------------------------------------ */

function OpportunitiesPanel() {
  const toast = useToast();
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', organisation: '', category: 'Scholarships', description: '', eligibility: '', deadline: '', amount_ngn: '', location: '', status: 'draft' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOpps(await fetchOpportunities(null, 100, 0));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(null);
    setForm({ title: '', organisation: '', category: 'Scholarships', description: '', eligibility: '', deadline: '', amount_ngn: '', location: '', status: 'draft' });
    setShowForm(true);
  }

  function openEdit(o) {
    setEditing(o);
    setForm({
      title: o.title, organisation: o.organisation, category: o.category,
      description: o.description || '', eligibility: o.eligibility || '',
      deadline: o.deadline ? new Date(o.deadline).toISOString().slice(0, 10) : '',
      amount_ngn: o.amount_ngn ?? '', location: o.location || '', status: o.status,
    });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      p_title: form.title, p_organisation: form.organisation, p_category: form.category,
      p_description: form.description, p_eligibility: form.eligibility,
      p_deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      p_amount_ngn: form.amount_ngn ? Number(form.amount_ngn) : null,
      p_location: form.location, p_status: form.status,
    };
    if (editing) {
      payload.p_opportunity_id = editing.id;
    }
    try {
      await manageOpportunity(payload);
      toast.success('Opportunity saved');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openNew} className="rounded-lg bg-[#16C784] px-4 py-2 text-xs font-semibold text-[#06130D]">
          <Plus className="mr-1 inline h-3.5 w-3.5" /> New Opportunity
        </button>
      </div>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" />
      ) : opps.length === 0 ? (
        <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-[#9AA4B2]">No opportunities yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {opps.map((o) => (
            <div key={o.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="green">{o.category}</Badge>
                    <Badge variant={o.status === 'published' ? 'live' : 'neutral'}>{o.status}</Badge>
                  </div>
                  <p className="mt-1 font-semibold text-white">{o.title}</p>
                  <p className="text-[11px] text-[#9AA4B2]">{o.organisation} · {o.application_count} applied</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(o)} className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs text-[#C2C9D4] hover:text-white">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form onSubmit={handleSave} className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B1117] p-6 space-y-3">
            <h3 className="font-semibold text-white">{editing ? 'Edit Opportunity' : 'New Opportunity'}</h3>
            <label className="text-xs text-[#9AA4B2]">Title
              <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-[#9AA4B2]">Organisation
                <input required value={form.organisation} onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))} className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
              </label>
              <label className="text-xs text-[#9AA4B2]">Category
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white">
                  {['Scholarships', 'Internships', 'Graduate Opportunities', 'Workshops', 'Accounting Jobs', 'Finance Jobs', 'Fellowships'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <label className="text-xs text-[#9AA4B2]">Description
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
            </label>
            <label className="text-xs text-[#9AA4B2]">Eligibility
              <textarea value={form.eligibility} onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))} rows={2} className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs text-[#9AA4B2]">Amount (₦)
                <input type="number" value={form.amount_ngn} onChange={(e) => setForm((f) => ({ ...f, amount_ngn: e.target.value }))} placeholder="optional" className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
              </label>
              <label className="text-xs text-[#9AA4B2]">Location
                <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="optional" className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
              </label>
              <label className="text-xs text-[#9AA4B2]">Deadline
                <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white" />
              </label>
            </div>
            <label className="text-xs text-[#9AA4B2]">Status
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="mt-1 block w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-white/[0.1] px-4 py-2 text-sm text-[#9AA4B2]">Cancel</button>
              <button type="submit" className="rounded-lg bg-[#16C784] px-4 py-2 text-sm font-semibold text-[#06130D]">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Applications panel                                                */
/* ------------------------------------------------------------------ */

function ApplicationsPanel() {
  const toast = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setApps(await fetchOpportunityApplications(null));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function review(id, decision) {
    try {
      await reviewOpportunityApplication(id, decision);
      toast.success(`Application ${decision}`);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" />;
  if (apps.length === 0) return <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-[#9AA4B2]">No applications yet.</p>;
  return (
    <div className="space-y-3">
      {apps.map((a) => (
        <div key={a.id} className="rounded-xl border border-white/[0.06] p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-white">{a.applicant_name || 'Applicant'}</p>
              <p className="text-[11px] text-[#9AA4B2]">Applied {fmtDate(a.created_at)} · status: {a.status}</p>
            </div>
            <Badge variant={a.status === 'shortlisted' ? 'verified' : a.status === 'rejected' ? 'red' : a.status === 'withdrawn' ? 'neutral' : 'live'}>{a.status}</Badge>
          </div>
          <p className="mt-2 text-sm text-[#9AA4B2]">{a.application_text}</p>
          {['submitted', 'pending'].includes(a.status) && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => review(a.id, 'shortlisted')} className="rounded-lg bg-[#16C784] px-3 py-1.5 text-xs font-semibold text-[#06130D]">Shortlist</button>
              <button onClick={() => review(a.id, 'rejected')} className="rounded-lg border border-[#EA3943]/40 bg-[#EA3943]/10 px-3 py-1.5 text-xs font-semibold text-[#EA3943]">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CPD Webinars panel                                                */
/* ------------------------------------------------------------------ */

function WebinarsPanel() {
  const toast = useToast();
  const [webinars, setWebinars] = useState([]);
  const [active, setActive] = useState(null); // webinar id for registrations
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setWebinars(await fetchCpdWebinars(100));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!active) { setRegs([]); return; }
    fetchCpdWebinarRegistrations(active).then((r) => setRegs(r || [])).catch(() => setRegs([]));
  }, [active]);

  async function markAttend(id, profileId, attended) {
    try {
      await markCpdAttendance(active, profileId, attended);
      toast.success('Attendance updated');
      setRegs(await fetchCpdWebinarRegistrations(active));
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" />;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {webinars.length === 0 ? (
          <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-[#9AA4B2]">No webinars.</p>
        ) : (
          webinars.map((w) => (
            <div key={w.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={w.webinar_type === 'CPE' ? 'verified' : 'official'}>{w.webinar_type}</Badge>
                    <Badge variant={w.status === 'published' ? 'live' : 'neutral'}>{w.status}</Badge>
                  </div>
                  <p className="mt-1 font-semibold text-white">{w.title}</p>
                  <p className="text-[11px] text-[#9AA4B2]">{fmtDate(w.start_time)} · {w.cpd_hours}h · {w.registered_count}/{w.capacity}</p>
                </div>
              </div>
              {w.status === 'published' && (
                <button onClick={() => setActive(w.id)} className="mt-3 rounded-lg border border-[#16C784]/40 bg-[#16C784]/10 px-3 py-1.5 text-xs font-semibold text-[#16C784]">
                  View registrations
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Users className="h-4 w-4 text-[#16C784]" /> Registrations & Attendance</h3>
        {!active ? (
          <p className="text-sm text-[#9AA4B2]">Select a published webinar to manage registrations and mark attendance.</p>
        ) : regs.length === 0 ? (
          <p className="text-sm text-[#9AA4B2]">No registrations yet.</p>
        ) : (
          <ul className="space-y-3">
            {regs.map((r) => (
              <li key={r.id} className="rounded-lg border border-white/[0.06] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{r.display_name}</p>
                    <p className="text-[11px] text-[#9AA4B2]">{r.status}{r.certificate_number ? ` · ${r.certificate_number}` : ''}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => markAttend(r.id, r.profile_id, true)} disabled={r.status === 'certified'}
                      className="rounded-lg bg-[#16C784] px-2.5 py-1 text-[11px] font-semibold text-[#06130D] disabled:opacity-40">Mark attended</button>
                    <button onClick={() => markAttend(r.id, r.profile_id, false)}
                      className="rounded-lg border border-white/[0.1] px-2.5 py-1 text-[11px] text-[#9AA4B2]">Reset</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PRO verification panel                                            */
/* ------------------------------------------------------------------ */

function ProVerificationPanel() {
  const toast = useToast();
  const [creds, setCreds] = useState([]);
  const [verifs, setVerifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, v] = await Promise.all([
        fetchProfessionalCredentials('pending'),
        fetchProfessionalVerificationQueue('pending'),
      ]);
      setCreds(c || []);
      setVerifs(v || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function reviewCred(id, approved) {
    try {
      await reviewProfessionalCredential(id, approved);
      toast.success('Credential reviewed');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function reviewVerif(id, approved) {
    try {
      await reviewProfessionalVerification(id, approved);
      toast.success('Verification reviewed');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" />;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Award className="h-4 w-4 text-[#16C784]" /> Credential Verification Queue</h3>
        {creds.length === 0 ? (
          <p className="text-sm text-[#9AA4B2]">No credentials pending verification.</p>
        ) : (
          <ul className="space-y-3">
            {creds.map((c) => (
              <li key={c.id} className="rounded-lg border border-white/[0.06] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{c.credential_name} · {c.credential_type}</p>
                    <p className="text-[11px] text-[#9AA4B2]">{c.applicant_name} · {c.issuing_body}{c.certificate_number ? ` · ${c.certificate_number}` : ''}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => reviewCred(c.id, true)} className="rounded-lg bg-[#16C784] px-3 py-1.5 text-xs font-semibold text-[#06130D]">Verify</button>
                  <button onClick={() => reviewCred(c.id, false)} className="rounded-lg border border-[#EA3943]/40 bg-[#EA3943]/10 px-3 py-1.5 text-xs font-semibold text-[#EA3943]">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><ShieldCheck className="h-4 w-4 text-[#16C784]" /> VALENCE PRO Verification Queue</h3>
        {verifs.length === 0 ? (
          <p className="text-sm text-[#9AA4B2]">No verification requests pending.</p>
        ) : (
          <ul className="space-y-3">
            {verifs.map((v) => (
              <li key={v.id} className="rounded-lg border border-white/[0.06] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{v.applicant_name}</p>
                    <p className="text-[11px] text-[#9AA4B2]">{v.verification_type} · {v.verification_body}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => reviewVerif(v.id, true)} className="rounded-lg bg-[#16C784] px-3 py-1.5 text-xs font-semibold text-[#06130D]">Approve</button>
                  <button onClick={() => reviewVerif(v.id, false)} className="rounded-lg border border-[#EA3943]/40 bg-[#EA3943]/10 px-3 py-1.5 text-xs font-semibold text-[#EA3943]">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
