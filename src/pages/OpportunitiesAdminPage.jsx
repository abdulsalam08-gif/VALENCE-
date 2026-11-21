import React, { useEffect, useState, useCallback } from 'react';
import {
  Briefcase, ClipboardList, Loader2, Plus,
  CheckCircle2, XCircle,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import {
  fetchOpportunities,
  manageOpportunity,
  fetchOpportunityApplications,
  reviewOpportunityApplication,
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchOpportunities(null, 100, 0));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" />;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => setEditing({ title: '', category: 'scholarship', body: '', expires_at: '' })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#16C784] px-3 py-2 text-xs font-semibold text-[#06130D]"
        >
          <Plus className="h-3.5 w-3.5" /> Post Opportunity
        </button>
      </div>
      {items.map((o) => (
        <div key={o.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={o.status === 'published' ? 'live' : 'neutral'}>{o.status}</Badge>
                <Badge variant="neutral">{o.category}</Badge>
              </div>
              <p className="mt-1 font-semibold text-white">{o.title}</p>
              <p className="text-[11px] text-[#9AA4B2]">{fmtDate(o.created_at)}</p>
            </div>
            <button onClick={() => setEditing(o)} className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs text-[#9AA4B2] hover:text-white">Edit</button>
          </div>
        </div>
      ))}
      {editing && (
        <OpportunitiesEditor
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
          toast={toast}
        />
      )}
    </div>
  );
}

function OpportunitiesEditor({ item, onClose, onSaved, toast }) {
  const [form, setForm] = useState({
    title: item.title || '',
    category: item.category || 'scholarship',
    body: item.body || '',
    expires_at: item.expires_at || '',
  });

  const save = async () => {
    try {
      await manageOpportunity({
        id: item.id || null,
        title: form.title,
        category: form.category,
        body: form.body,
        expires_at: form.expires_at || null,
        status: 'published',
      });
      toast.success('Opportunity saved');
      onSaved();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="rounded-xl border border-[#16C784]/30 bg-[#0D1218] p-5 space-y-3">
      <h3 className="font-semibold text-white">{item.id ? 'Edit Opportunity' : 'New Opportunity'}</h3>
      <div>
        <label className="text-xs font-semibold text-[#9AA4B2]">Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 w-full rounded-lg bg-[#0B0E11] border border-white/[0.1] px-3 py-2 text-sm text-white" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#9AA4B2]">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-lg bg-[#0B0E11] border border-white/[0.1] px-3 py-2 text-sm text-white">
            <option value="scholarship">Scholarship</option>
            <option value="internship">Internship</option>
            <option value="job">Graduate Job</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#9AA4B2]">Expires At</label>
          <input type="date" value={form.expires_at?.slice(0, 10) || ''} onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
            className="mt-1 w-full rounded-lg bg-[#0B0E11] border border-white/[0.1] px-3 py-2 text-sm text-white" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-[#9AA4B2]">Body</label>
        <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4}
          className="mt-1 w-full rounded-lg bg-[#0B0E11] border border-white/[0.1] px-3 py-2 text-sm text-white" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-white/[0.1] px-3 py-2 text-xs text-[#9AA4B2]">Cancel</button>
        <button onClick={save} className="rounded-lg bg-[#16C784] px-3 py-2 text-xs font-semibold text-[#06130D]">Save</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Applications panel                                                */
/* ------------------------------------------------------------------ */

function ApplicationsPanel() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchOpportunityApplications(null));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" />;

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-[#9AA4B2]">No applications yet.</p>
      ) : (
        items.map((a) => (
          <div key={a.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-white">{a.display_name}</p>
                <p className="text-[11px] text-[#9AA4B2]">{a.opportunity_title}</p>
                <p className="mt-1 text-xs text-[#C2C9D4]">{a.application_text}</p>
                <p className="mt-1 text-[11px] text-[#9AA4B2]">{fmtDate(a.applied_at)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => reviewOpportunityApplication(a.id, 'approved')}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#16C784] px-3 py-1.5 text-xs font-semibold text-[#06130D]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </button>
                <button onClick={() => reviewOpportunityApplication(a.id, 'rejected')}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#EA3943]/40 bg-[#EA3943]/10 px-3 py-1.5 text-xs font-semibold text-[#EA3943]">
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
