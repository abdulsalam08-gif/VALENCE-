import React, { useEffect, useState } from 'react';
import {
  Trophy, Medal, Clock, Banknote, Swords, ShieldCheck, ScrollText,
  ClipboardList, Flag, Users, Loader2, CheckCircle2, Award,
  ListChecks, RefreshCw, Send,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import {
  fetchCompetitions,
  fetchCompetitionDetails,
  fetchLeaderboard,
  fetchMarkingQueue,
  fetchArenaMatches,
  fetchAuditLogs,
  manualMarkAttempt,
  approveResult,
  reviewAppeal,
  disburseReward,
  recomputeLeaderboard,
  createArenaMatch,
  completeArenaMatch,
  logAuditAction,
} from '../lib/competitions';
import { formatNaira } from '../lib/pricing';

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(iso);
  }
}

export default function CompetitionAdminPage() {
  const { profile } = usePlatform();
  const toast = useToast();
  const [competitions, setCompetitions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [tab, setTab] = useState('marking');
  const [loading, setLoading] = useState(false);

  const run = async (fn, successMsg) => {
    try {
      const res = await fn();
      if (res?.error) {
        toast.error(res.error);
        return null;
      }
      toast.success(successMsg);
      return res;
    } catch (e) {
      toast.error(e.message);
      return null;
    }
  };

  useEffect(() => {
    fetchCompetitions(50).then(setCompetitions).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) { setDetails(null); return; }
    setLoading(true);
    fetchCompetitionDetails(selected)
      .then(setDetails)
      .catch(() => toast.error('Failed to load competition details'))
      .finally(() => setLoading(false));
  }, [selected]);

  const competition = details?.competition;

  const tabs = [
    { id: 'marking', label: 'Marking & Approval', icon: ClipboardList },
    { id: 'leaderboard', label: 'Leaderboard', icon: ListChecks },
    { id: 'appeals', label: 'Appeals', icon: Flag },
    { id: 'rewards', label: 'Rewards', icon: Banknote },
    { id: 'arena', label: 'Arena', icon: Swords },
    { id: 'audit', label: 'Audit Log', icon: ScrollText },
  ];

  return (
    <div className="space-y-6">
      {!selected ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Competitions</h2>
          {competitions.length === 0 ? (
            <p className="text-sm text-[#9AA4B2]">No competitions found.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {competitions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition hover:border-[#16C784]/40 hover:bg-[#16C784]/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="official">{c.division}</Badge>
                    <Badge variant={c.status === 'active' ? 'live' : 'neutral'}>{c.status}</Badge>
                  </div>
                  <h3 className="mt-2 font-semibold text-white">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[#9AA4B2]">{c.description}</p>
                  <p className="mt-2 text-[11px] text-white/40">Exam: {fmtDate(c.exam_starts)} → {fmtDate(c.exam_ends)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <button onClick={() => setSelected(null)} className="text-xs text-[#16C784] hover:underline">← All competitions</button>
                <h2 className="mt-1 text-lg font-semibold text-white">{competition?.name}</h2>
                <p className="text-xs text-[#9AA4B2]">
                  {competition?.division} · {competition?.status} · {competition?.duration_minutes} min exam
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => run(() => recomputeLeaderboard(selected), 'Leaderboard recomputed')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-[#C2C9D4] hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Recompute
                </button>
                <button
                  onClick={() => run(() => logAuditAction(selected, 'leaderboard_recomputed', { at: new Date().toISOString() }), 'Audit logged')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-[#C2C9D4] hover:text-white"
                >
                  <ScrollText className="h-3.5 w-3.5" /> Log action
                </button>
              </div>
            </div>
            {loading && <p className="mt-3 text-xs text-[#9AA4B2]"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Loading details…</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition ${tab === t.id ? 'bg-[#16C77A]/90 text-[#06130D]' : 'border border-white/[0.08] text-[#9AA4B2] hover:bg-white/[0.04]'}`}
              >
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'marking' && <MarkingPanel competitionId={selected} profileId={profile?.id} run={run} />}
          {tab === 'leaderboard' && <LeaderboardPanel competitionId={selected} run={run} />}
          {tab === 'appeals' && <AppealsPanel competitionId={selected} profileId={profile?.id} run={run} />}
          {tab === 'rewards' && <RewardsPanel competitionId={selected} profileId={profile?.id} run={run} />}
          {tab === 'arena' && <ArenaPanel competitionId={selected} details={details} run={run} />}
          {tab === 'audit' && <AuditPanel competitionId={selected} />}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marking & approval                                                  */
/* ------------------------------------------------------------------ */

function MarkingPanel({ competitionId, profileId, run }) {
  const [queue, setQueue] = useState([]);
  const [marking, setMarking] = useState({}); // attempt_id -> marks
  const [approved, setApproved] = useState([]);

  const load = async () => {
    const q = await run(() => fetchMarkingQueue(competitionId), null);
    if (q) setQueue(q || []);
    await loadApprovable();
  };

  const loadApprovable = async () => {
    const { supabase } = await import('../lib/supabase');
    const { data, error } = await supabase
      .from('competition_results')
      .select('*, profiles(display_name)')
      .eq('competition_id', competitionId)
      .eq('status', 'marked')
      .order('total_score', { ascending: false });
    if (error) return;
    setApprovable((prev) => data || []);
  };

  const [approvable, setApprovable] = useState([]);

  useEffect(() => { load(); }, [competitionId]);

  async function doMark(attempt) {
    const marks = Number(marking[attempt.attempt_id]);
    if (marks == null || Number.isNaN(marks)) return;
    const res = await run(() => manualMarkAttempt(attempt.attempt_id, profileId, marks), 'Attempt marked');
    if (res) load();
  }

  async function doApprove(result) {
    const res = await run(() => approveResult(result.id), `Result approved — rank ${result.rank_position}`);
    if (res) {
      setApproved([...approved, result.id]);
      loadApprovable();
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><ClipboardList className="h-4 w-4 text-[#16C784]" /> Marking Queue</h3>
        {queue.length === 0 ? (
          <p className="text-sm text-[#9AA4B2]">No attempts awaiting manual marking.</p>
        ) : (
          <ul className="space-y-3">
            {queue.map((q) => (
              <li key={q.attempt_id} className="rounded-xl border border-white/[0.06] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{q.display_name}</p>
                    <p className="text-[11px] text-[#9AA4B2]">{q.team_name || '—'} · started {fmtDate(q.started_at)}</p>
                  </div>
                  <Badge variant="neutral">submitted</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marking[q.attempt_id] ?? ''}
                    onChange={(e) => setMarking((m) => ({ ...m, [q.attempt_id]: e.target.value }))}
                    placeholder="Marks 0–100"
                    className="w-28 rounded-lg border border-white/[0.1] bg-[#0F1620] px-2 py-1.5 text-sm text-white"
                  />
                  <button onClick={() => doMark(q)} className="rounded-lg bg-[#16C784] px-3 py-1.5 text-xs font-semibold text-[#06130D]">Mark</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><CheckCircle2 className="h-4 w-4 text-[#16C784]" /> Results to Approve</h3>
        {approvable.filter((r) => !approved.includes(r.id)).length === 0 ? (
          <p className="text-sm text-[#9AA4B2]">No marked results awaiting approval.</p>
        ) : (
          <ul className="space-y-3">
            {approvable
              .filter((r) => !approved.includes(r.id))
              .map((r) => (
                <li key={r.id} className="rounded-xl border border-white/[0.06] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Attempt #{String(r.attempt_id).slice(0, 8)}</p>
                      <p className="text-[11px] text-[#9AA4B2]">score {r.total_score} · {fmtDate(r.created_at)}</p>
                    </div>
                    <span className="font-mono font-bold text-[#16C784]">{r.total_score}</span>
                  </div>
                  <button
                    onClick={() => doApprove(r)}
                    className="mt-3 w-full rounded-lg border border-[#16C784]/40 bg-[#16C784]/10 px-3 py-1.5 text-xs font-semibold text-[#16C784] hover:bg-[#16C784]/20"
                  >
                    Approve & Publish
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Leaderboard                                                         */
/* ------------------------------------------------------------------ */

function LeaderboardPanel({ competitionId, run }) {
  const [rows, setRows] = useState({ individual: [], team: [], institution: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchLeaderboard(competitionId, 'individual'),
      fetchLeaderboard(competitionId, 'team'),
      fetchLeaderboard(competitionId, 'institution'),
    ])
      .then(([a, b, c]) => { if (!cancelled) setRows({ individual: a || [], team: b || [], institution: c || [] }); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [competitionId]);

  const renderTable = (title, rows) => (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><ListChecks className="h-4 w-4 text-[#16C784]" /> {title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-[#9AA4B2]">No entries yet.</p>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r, i) => {
              const name = r.display_name || r.team_name || r.institution_name || '—';
              return (
                <tr key={`${r.rank_position}-${i}`} className="border-b border-white/[0.06] last:border-0">
                  <td className="w-10 py-2 font-mono font-bold text-[#9AA4B2]">{r.rank_position ?? '—'}</td>
                  <td className="py-2 text-white">{name}</td>
                  <td className="py-2 text-xs text-[#9AA4B2]">{r.institution_name || r.team_name || '—'}</td>
                  <td className="py-2 text-right font-mono font-bold text-[#16C784]">{r.score}</td>
                  <td className="py-2 text-right">{r.verified ? <CheckCircle2 className="h-4 w-4 text-[#16C784]" /> : <Badge variant="neutral">pending</Badge>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  return loading ? <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" /> : (
    <div className="space-y-4">
      {renderTable('Individuals', rows.individual)}
      {renderTable('School Teams', rows.team)}
      {renderTable('Institutions', rows.institution)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Appeals                                                             */
/* ------------------------------------------------------------------ */

function AppealsPanel({ competitionId, profileId, run }) {
  const [appeals, setAppeals] = useState([]);
  const [notes, setNotes] = useState({});

  const load = async () => {
    const { supabase } = await import('../lib/supabase');
    const { data, error } = await supabase
      .from('competition_appeals')
      .select('*, competition_results(competition_id)')
      .eq('competition_results.competition_id', competitionId)
      .order('created_at', { ascending: false });
    if (error) return;
    setAppeals(data || []);
  };

  useEffect(() => { load(); }, [competitionId]);

  async function doReview(appeal, decision) {
    const res = await run(() => reviewAppeal(appeal.id, decision, notes[appeal.id] || null), `Appeal ${decision}`);
    if (res) load();
  }

  if (appeals.length === 0) return <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-sm text-[#9AA4B2]">No appeals submitted.</p>;
  return (
    <div className="space-y-3">
      {appeals.map((a) => (
        <div key={a.id} className="rounded-xl border border-white/[0.06] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-white">{a.appeal_reason}</p>
              <p className="mt-1 text-[11px] text-[#9AA4B2]">Submitted {fmtDate(a.created_at)} · status: {a.status}</p>
            </div>
            <Badge variant={a.status === 'approved' ? 'verified' : a.status === 'rejected' ? 'red' : 'live'}>{a.status}</Badge>
          </div>
          {a.status === 'pending' && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                value={notes[a.id] || ''}
                onChange={(e) => setNotes((n) => ({ ...n, [a.id]: e.target.value }))}
                placeholder="Decision notes (optional)"
                className="flex-1 min-w-[200px] rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-1.5 text-xs text-white"
              />
              <button onClick={() => doReview(a, 'approved')} className="rounded-lg bg-[#16C784] px-3 py-1.5 text-xs font-semibold text-[#06130D]">Approve</button>
              <button onClick={() => doReview(a, 'rejected')} className="rounded-lg border border-[#EA3943]/40 bg-[#EA3943]/10 px-3 py-1.5 text-xs font-semibold text-[#EA3943]">Reject</button>
            </div>
          )}
          {a.decision_notes && <p className="mt-2 text-[11px] text-white/50">Notes: {a.decision_notes}</p>}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rewards                                                             */
/* ------------------------------------------------------------------ */

function RewardsPanel({ competitionId, profileId, run }) {
  const [rewards, setRewards] = useState([]);

  const load = async () => {
    const { supabase } = await import('../lib/supabase');
    const { data, error } = await supabase.from('competition_rewards').select('*').eq('competition_id', competitionId).order('placement_rank');
    if (error) return;
    setRewards(data || []);
  };

  useEffect(() => { load(); }, [competitionId]);

  async function doDisburse(rw) {
    const res = await run(() => disburseReward(rw.id), 'Reward disbursed — audit logged');
    if (res) load();
  }

  if (rewards.length === 0) return <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-sm text-[#9AA4B2]">No podium rewards issued yet — results must be approved first.</p>;
  return (
    <div className="space-y-3">
      {rewards.map((r) => (
        <div key={r.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#FFD700]">#{r.placement_rank}</span>
              <p className="text-sm font-medium text-white">{r.award_type || 'Podium Reward'}</p>
            </div>
            <p className="mt-1 text-xs text-[#9AA4B2]">
              {formatNaira(r.prize_amount_ngn)} · status: {r.status}{r.disbursed_at ? ` · disbursed ${fmtDate(r.disbursed_at)}` : ''}
            </p>
          </div>
          <button
            onClick={() => doDisburse(r)}
            disabled={r.status === 'disbursed'}
            className="rounded-lg bg-[#16C784] px-4 py-2 text-xs font-semibold text-[#06130D] disabled:opacity-40"
          >
            <Banknote className="mr-1 inline h-3.5 w-3.5" />{r.status === 'disbursed' ? 'Disbursed' : 'Disburse'}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Arena                                                               */
/* ------------------------------------------------------------------ */

function ArenaPanel({ competitionId, details, run }) {
  const [matches, setMatches] = useState([]);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [winner, setWinner] = useState({});

  const load = async () => {
    const m = await run(() => fetchArenaMatches(competitionId), null);
    if (m) setMatches(m);
  };

  useEffect(() => { load(); }, [competitionId]);

  const teams = (details?.teams || []).filter((t) => t.status === 'approved' || t.status === 'registered');

  async function schedule() {
    if (!teamA || !teamB || teamA === teamB) return;
    const res = await run(() => createArenaMatch(competitionId, teamA, teamB, '1v1'), 'Arena match scheduled');
    if (res) {
      setTeamA(''); setTeamB('');
      load();
    }
  }

  async function finish(match) {
    const w = winner[match.match_id];
    if (!w) return;
    const res = await run(() => completeArenaMatch(match.match_id, w), 'Match completed');
    if (res) load();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Swords className="h-4 w-4 text-[#16C784]" /> Schedule a Match</h3>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-[#9AA4B2]">
            Team A
            <select value={teamA} onChange={(e) => setTeamA(e.target.value)} className="mt-1 block w-56 rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-1.5 text-sm text-white">
              <option value="">Select…</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.team_name}</option>)}
            </select>
          </label>
          <label className="text-xs text-[#9AA4B2]">
            Team B
            <select value={teamB} onChange={(e) => setTeamB(e.target.value)} className="mt-1 block w-56 rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-1.5 text-sm text-white">
              <option value="">Select…</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.team_name}</option>)}
            </select>
          </label>
          <button onClick={schedule} disabled={!teamA || !teamB || teamA === teamB} className="rounded-lg bg-[#16C784] px-4 py-1.5 text-xs font-semibold text-[#06130D] disabled:opacity-40">Schedule</button>
        </div>
        {teams.length < 2 && <p className="mt-2 text-xs text-[#9AA4B2]">At least 2 registered teams are required.</p>}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Trophy className="h-4 w-4 text-[#16C784]" /> Arena Matches</h3>
        {matches.length === 0 ? (
          <p className="text-sm text-[#9AA4B2]">No matches scheduled.</p>
        ) : (
          <ul className="space-y-3">
            {matches.map((m) => (
              <li key={m.match_id} className="rounded-xl border border-white/[0.06] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={m.status === 'completed' ? 'verified' : 'live'}>{m.match_format} · {m.status}</Badge>
                  <span className="text-[11px] text-[#9AA4B2]">{fmtDate(m.played_at || m.scheduled_at)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{m.team_a.team_name}</p>
                    <p className="text-[11px] text-[#9AA4B2]">{m.team_a.institution_name}</p>
                  </div>
                  <span className="font-mono text-[#16C784]">VS</span>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{m.team_b.team_name}</p>
                    <p className="text-[11px] text-[#9AA4B2]">{m.team_b.institution_name}</p>
                  </div>
                </div>
                {m.status === 'scheduled' && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#9AA4B2]">Winner:</span>
                    <label className="inline-flex items-center gap-1 text-xs text-white">
                      <input type="radio" name={`w-${m.match_id}`} value={m.team_a.team_id} checked={winner[m.match_id] === m.team_a.team_id} onChange={() => setWinner((w) => ({ ...w, [m.match_id]: m.team_a.team_id }))} />
                      {m.team_a.team_name}
                    </label>
                    <label className="inline-flex items-center gap-1 text-xs text-white">
                      <input type="radio" name={`w-${m.match_id}`} value={m.team_b.team_id} checked={winner[m.match_id] === m.team_b.team_id} onChange={() => setWinner((w) => ({ ...w, [m.match_id]: m.team_b.team_id }))} />
                      {m.team_b.team_name}
                    </label>
                    <button onClick={() => finish(m)} className="rounded-lg bg-[#16C784] px-3 py-1.5 text-xs font-semibold text-[#06130D]">Complete Match</button>
                  </div>
                )}
                {m.status === 'completed' && (
                  <p className="mt-2 text-center text-xs text-[#16C784]">
                    Winner: {m.winner_team_id === m.team_a.team_id ? m.team_a.team_name : m.team_b.team_name}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Audit log                                                           */
/* ------------------------------------------------------------------ */

function AuditPanel({ competitionId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs(competitionId)
      .then((l) => setLogs(l || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [competitionId]);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#9AA4B2]" />;
  if (logs.length === 0) return <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-sm text-[#9AA4B2]">No audit entries.</p>;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] text-left text-[11px] uppercase tracking-wide text-[#9AA4B2]">
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l, i) => (
            <tr key={l.id || i} className="border-b border-white/[0.06] last:border-0">
              <td className="px-4 py-2 text-xs text-[#9AA4B2]">{fmtDate(l.created_at)}</td>
              <td className="px-4 py-2"><Badge variant="neutral">{l.action}</Badge></td>
              <td className="px-4 py-2 text-xs text-white/70">{JSON.stringify(l.details || {})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
