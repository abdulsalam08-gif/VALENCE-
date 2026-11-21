import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Building2, ArrowUpRight, ArrowRight, Loader2, MapPin,
  Banknote, CheckCircle2, FileText, Inbox,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import {
  fetchOpportunities,
  fetchOpportunityDetails,
  submitOpportunityApplication,
  withdrawOpportunityApplication,
  fetchMyOpportunityApplications,
} from '../lib/opportunities';
import { formatNaira } from '../lib/pricing';

const ALL_CATEGORIES = [
  'All',
  'Scholarships',
  'Internships',
  'Graduate Opportunities',
  'Workshops',
  'Accounting Jobs',
  'Finance Jobs',
  'Fellowships',
];

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(iso).slice(0, 10);
  }
}

function statusVariant(status) {
  if (status === 'shortlisted') return 'verified';
  if (status === 'rejected') return 'red';
  if (status === 'withdrawn') return 'neutral';
  return 'live';
}

/* ------------------------------------------------------------------ */
/* Apply modal                                                         */
/* ------------------------------------------------------------------ */

function ApplyModal({ opportunity, onClose, onApplied }) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleApply() {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await submitOpportunityApplication(opportunity.id, text.trim());
      toast.success('Application submitted');
      onApplied();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B1117] p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white">Apply: {opportunity.title}</h3>
            <p className="mt-0.5 text-xs text-[#9AA4B2]">{opportunity.organisation} · {opportunity.category}</p>
          </div>
          <button onClick={onClose} className="text-[#9AA4B2] hover:text-white">✕</button>
        </div>
        <p className="mt-4 text-sm text-[#9AA4B2]">
          Write your application statement. Supporting documents can be attached after submission.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Explain your interest, eligibility and why you are a strong candidate…"
          className="mt-3 w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white placeholder:text-[#9AA4B2]"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-white/[0.1] px-4 py-2 text-sm text-[#9AA4B2]">Cancel</button>
          <button
            onClick={handleApply}
            disabled={submitting || !text.trim()}
            className="rounded-lg bg-[#16C784] px-4 py-2 text-sm font-semibold text-[#06130D] disabled:opacity-40"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* My applications panel                                              */
/* ------------------------------------------------------------------ */

function MyApplications() {
  const toast = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setApps(await fetchMyOpportunityApplications(50));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function handleWithdraw(id) {
    try {
      await withdrawOpportunityApplication(id);
      toast.success('Application withdrawn');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Inbox className="h-4 w-4 text-[#16C784]" /> My Applications</h3>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-[#9AA4B2]" />
      ) : apps.length === 0 ? (
        <p className="text-sm text-[#9AA4B2]">You haven't applied to any opportunity yet.</p>
      ) : (
        <ul className="space-y-2">
          {apps.map((a) => (
            <li key={a.id} className="rounded-lg border border-white/[0.06] p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{a.opportunity_title}</p>
                  <p className="truncate text-[11px] text-[#9AA4B2]">{a.organisation} · {a.category} · deadline {fmtDate(a.deadline)}</p>
                </div>
                <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
              </div>
              {['submitted', 'pending'].includes(a.status) && (
                <button onClick={() => handleWithdraw(a.id)} className="mt-2 text-xs font-medium text-[#EA3943] hover:underline">
                  Withdraw application
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */

export default function OpportunitiesPage() {
  const toast = useToast();
  const [cat, setCat] = useState('All');
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // detail modal
  const [applyTarget, setApplyTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOpps((await fetchOpportunities(cat === 'All' ? null : cat, 50, 0)) || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [cat, toast]);

  useEffect(() => { load(); }, [load]);

  async function openDetail(opp) {
    try {
      const det = await fetchOpportunityDetails(opp.id);
      setActive(det);
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-4 max-w-4xl">
          <Badge variant="green">VALENCE OPPORTUNITIES</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            Scholarships, Internships, Audit Roles & Career Development
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2]">
            Verified opportunities curated and maintained by VALENCE administrators covering scholarships, undergraduate internships, graduate trainee roles, accounting & finance positions, fellowships, workshops and career events.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="v-container space-y-6">
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors ${
                  cat === c
                    ? 'bg-[#16C784] text-[#06130D] border-[#16C784]'
                    : 'bg-[#11161C] text-[#9AA4B2] border-white/[0.08] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="v-card p-8 text-center text-[#9AA4B2]"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
              ) : opps.length === 0 ? (
                <div className="v-card p-8 sm:p-10 text-center space-y-3 max-w-2xl mx-auto">
                  <Badge variant="green">VERIFIED LISTINGS ONLY</Badge>
                  <p className="font-display text-lg font-bold text-white">
                    Verified {cat === 'All' ? 'Opportunities' : cat} Publish Here Live
                  </p>
                  <p className="text-xs text-[#9AA4B2] leading-relaxed">
                    VALENCE never displays fake or expired placeholder jobs. Every scholarship, internship, audit trainee role, and workshop is verified by the Admin team before going live, with instant notifications to students and professionals.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link to="/portal/student?mode=register" className="v-btn-secondary text-xs">
                      Join Free for Opportunity Alerts
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {opps.map((opp) => (
                    <article key={opp.id} className="v-card-hover p-6 flex flex-col justify-between gap-5">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge variant="green">{opp.category}</Badge>
                          <Badge variant="red">Deadline: {fmtDate(opp.deadline)}</Badge>
                        </div>
                        <h2 className="font-display text-xl font-bold text-white">{opp.title}</h2>
                        <p className="text-xs font-medium text-[#C2C9D4] inline-flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-[#16C784]" /> {opp.organisation}
                        </p>
                        <p className="text-xs leading-relaxed text-[#9AA4B2]">
                          <strong className="text-[#F4F6F9]">Eligibility:</strong> {opp.eligibility}
                        </p>
                        {opp.amount_ngn != null && (
                          <p className="text-xs inline-flex items-center gap-1.5 font-semibold text-[#16C784]">
                            <Banknote className="h-3.5 w-3.5" /> {formatNaira(opp.amount_ngn)}
                          </p>
                        )}
                        {opp.location && (
                          <p className="text-xs inline-flex items-center gap-1.5 text-[#9AA4B2]">
                            <MapPin className="h-3.5 w-3.5" /> {opp.location}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs">
                        <span className="text-[#667085] inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Published {fmtDate(opp.published_at)} · {opp.application_count} applied
                        </span>
                        <button
                          type="button"
                          onClick={() => openDetail(opp)}
                          className="inline-flex items-center gap-1 font-semibold text-[#16C784] hover:underline"
                        >
                          View Details <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <MyApplications />
            </div>
          </div>
        </div>
      </section>

      {/* Detail modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B1117] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white">{active.opportunity.title}</h3>
                <p className="mt-1 text-xs text-[#9AA4B2]">{active.opportunity.organisation} · {active.opportunity.category}</p>
              </div>
              <button onClick={() => setActive(null)} className="text-[#9AA4B2] hover:text-white">✕</button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                {active.opportunity.amount_ngn != null && (
                  <Badge variant="green">{formatNaira(active.opportunity.amount_ngn)}</Badge>
                )}
                {active.opportunity.location && <Badge variant="neutral">{active.opportunity.location}</Badge>}
                <Badge variant="red">Deadline {fmtDate(active.opportunity.deadline)}</Badge>
              </div>
              <p className="text-[#C2C9D4]">{active.opportunity.description}</p>
              <p><strong className="text-white">Eligibility:</strong> <span className="text-[#9AA4B2]">{active.opportunity.eligibility}</span></p>
              {active.opportunity.application_link && (
                <a href={active.opportunity.application_link} target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-1 text-[#16C784] hover:underline">
                  External application portal <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            <div className="mt-4 border-t border-white/[0.08] pt-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9AA4B2]">Applications ({active.applications?.length || 0})</h4>
              {!active.applications || active.applications.length === 0 ? (
                <p className="text-sm text-[#9AA4B2]">No applications yet.</p>
              ) : (
                <ul className="space-y-2">
                  {active.applications.map((a) => (
                    <li key={a.id} className="rounded-lg border border-white/[0.06] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{a.applicant || 'Applicant'}</span>
                        <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-[#9AA4B2] line-clamp-3">{a.application_text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => { setApplyTarget(active.opportunity); setActive(null); }}
                className="rounded-lg bg-[#16C784] px-5 py-2 text-sm font-semibold text-[#06130D]"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {applyTarget && (
        <ApplyModal opportunity={applyTarget} onClose={() => setApplyTarget(null)} onApplied={() => { setApplyTarget(null); load(); }} />
      )}
    </div>
  );
}
