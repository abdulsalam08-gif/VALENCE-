import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy, Medal, ShieldCheck, Clock, Swords, Banknote, ClipboardList,
  CheckCircle2, Award, ScrollText, ArrowLeft, Loader2, CalendarDays,
  Users, School, Flag,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import {
  fetchCompetitionDetails,
  fetchLeaderboard,
  fetchMyResults,
  fetchHallOfFame,
  fetchArenaMatches,
  startAttempt,
  getAttemptQuestions,
  submitAttempt,
  submitAppeal,
} from '../lib/competitions';
import { formatNaira } from '../lib/pricing';

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(iso).slice(0, 10);
  }
}

const RANK_STYLE = {
  1: { ring: 'border-[#FFD700]/50 text-[#FFD700] bg-[#FFD700]/10', icon: '🥇', label: '1st' },
  2: { ring: 'border-[#C0C6CE]/50 text-[#C0C6CE] bg-white/[0.06]', icon: '🥈', label: '2nd' },
  3: { ring: 'border-[#CD7F32]/50 text-[#CD7F32] bg-[#CD7F32]/10', icon: '🥉', label: '3rd' },
};

/* ------------------------------------------------------------------ */
/* Exam modal: timed MCQ attempt                                       */
/* ------------------------------------------------------------------ */

function ExamModal({ attemptId, questions, secondsLeft, onClose, onSubmitted }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(secondsLeft);
  const [, force] = useState(0);

  useEffect(() => {
    timerRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    const t = setInterval(() => {
      timerRef.current -= 1;
      force((n) => n + 1);
      if (timerRef.current <= 0) {
        clearInterval(t);
        handleSubmit(true);
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  async function handleSubmit(auto = false) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await submitAttempt(attemptId, Object.entries(answers).map(([question_id, option_id]) => ({ question_id, option_id })));
      onSubmitted(result, auto);
    } catch (e) {
      setSubmitting(false);
    }
  }

  const mm = Math.floor(timerRef.current / 60);
  const ss = timerRef.current % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B1117] shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.08] bg-[#0B1117]/95 px-5 py-4 backdrop-blur">
          <h3 className="font-semibold text-white">VALENCE Challenge Exam</h3>
          <div className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono font-bold ${timerRef.current < 60 ? 'border-[#EA3943]/50 text-[#EA3943]' : 'border-[#16C784]/40 text-[#16C784]'}`}>
            <Clock className="h-4 w-4" /> {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </div>
        </div>
        <div className="px-5 py-4">
          {questions.map((q, i) => (
            <div key={q.id} className="mb-6">
              <div className="mb-2 flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#16C784]/15 text-xs font-bold text-[#16C784]">{i + 1}</span>
                <p className="text-sm font-medium text-white">{q.question_text}</p>
              </div>
              <div className="ml-8 space-y-2">
                {q.options.map((o) => {
                  const selected = answers[q.id] === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${selected ? 'border-[#16C784] bg-[#16C784]/10 text-white' : 'border-white/[0.08] text-[#9AA4B2] hover:bg-white/[0.04]'}`}
                    >
                      <span className="mr-2 font-mono text-[#16C784]">{String.fromCharCode(64 + o.order)}</span> {o.text}
                    </button>
                  );
                })}
              </div>
              <p className="ml-8 mt-1 text-[11px] text-white/40">{q.marks} marks · {q.difficulty}</p>
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 flex items-center justify-between border-t border-white/[0.08] bg-[#0B1117]/95 px-5 py-4 backdrop-blur">
          <button onClick={onClose} className="text-sm text-[#9AA4B2] hover:text-white">Exit exam</button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="rounded-lg bg-[#16C784] px-5 py-2 text-sm font-semibold text-[#06130D] transition hover:bg-[#18D891] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result / awards panel                                               */
/* ------------------------------------------------------------------ */

function MyParticipation({ competitionId, onStartExam }) {
  const { profile } = usePlatform();
  const toast = useToast();
  const [my, setMy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null); // { attemptId, questions, secondsLeft }
  const [score, setScore] = useState(null);
  const [appealTarget, setAppealTarget] = useState(null);
  const [appealReason, setAppealReason] = useState('');

  async function load() {
    setLoading(true);
    try {
      setMy(await fetchMyResults(competitionId));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [competitionId]);

  async function handleStart() {
    try {
      const res = await startAttempt(competitionId, profile.id);
      const questions = await getAttemptQuestions(res.attempt_id);
      setExam({ attemptId: res.attempt_id, questions, secondsLeft: res.time_remaining_seconds });
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function onSubmitted(result, auto) {
    setExam(null);
    setScore(result);
    toast.success(`Exam submitted — provisional score: ${result.total_score}`);
    load();
  }

  async function handleAppeal(resultId) {
    try {
      await submitAppeal(resultId, appealReason || 'Requesting a re-check of my result.');
      toast.success('Appeal submitted — the administration will review it.');
      setAppealTarget(null);
      setAppealReason('');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return <div className="p-8 text-center text-[#9AA4B2]"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;

  const attempts = my?.attempts || [];
  const results = my?.results || [];
  const certificates = my?.certificates || [];
  const awards = my?.awards || [];
  const rewards = my?.rewards || [];
  const appeals = my?.appeals || [];
  const hasOpenAttempt = attempts.some((a) => a.status === 'in_progress');

  return (
    <div className="space-y-6">
      {profile ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">Your Exam Entry</h3>
              <p className="mt-1 text-sm text-[#9AA4B2]">Server-timed, strictly per the competition schedule. Your provisional score is auto-marked at submission; the final score applies once results are approved.</p>
            </div>
            <button
              onClick={handleStart}
              disabled={hasOpenAttempt}
              className="rounded-lg bg-[#16C784] px-5 py-2.5 text-sm font-semibold text-[#06130D] transition hover:bg-[#18D891] disabled:opacity-40"
            >
              {hasOpenAttempt ? 'Exam in progress' : 'Start Exam'}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-sm text-[#9AA4B2]">
          Sign in to enter the exam and track your awards.
        </div>
      )}

      {score && (
        <div className="rounded-2xl border border-[#16C784]/30 bg-[#16C784]/[0.06] p-5">
          <h3 className="font-semibold text-white">Provisional Result</h3>
          <p className="mt-1 text-sm text-[#9AA4B2]">
            You scored <span className="font-bold text-[#16C784]">{score.total_score}</span> marks · auto-marked
            {score.auto_marked_questions} question(s). Final standing is confirmed once results are approved and published.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><ClipboardList className="h-4 w-4 text-[#16C784]" /> Results</h3>
          {results.length === 0 ? <p className="text-sm text-[#9AA4B2]">No results yet.</p> : (
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={r.result_id} className="flex items-center justify-between rounded-lg border border-white/[0.06] px-3 py-2">
                  <div>
                    <span className="text-sm text-white">{r.total_score} marks</span>
                    {r.rank_position ? <span className="ml-2 text-xs text-[#16C784]">rank #{r.rank_position}</span> : null}
                    <div className="text-[11px] text-[#9AA4B2]">
                      status: {r.status}
                      {r.approved_at ? ` · approved ${fmtDate(r.approved_at)}` : ''}
                    </div>
                  </div>
                  {['pending', 'marked', 'rejected'].includes(r.status) && (
                    <button onClick={() => setAppealTarget(r.result_id)} className="text-xs font-medium text-[#16C784] hover:underline">
                      Appeal
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Banknote className="h-4 w-4 text-[#16C784]" /> Prizes & Awards</h3>
          {rewards.length === 0 && awards.length === 0 && certificates.length === 0 ? (
            <p className="text-sm text-[#9AA4B2]">No awards yet. Place on the podium to win.</p>
          ) : (
            <ul className="space-y-2">
              {rewards.map((rw) => (
                <li key={rw.reward_id} className="rounded-lg border border-[#16C784]/30 bg-[#16C784]/[0.05] px-3 py-2">
                  <div className="text-sm text-white">{RANK_STYLE[rw.placement_rank]?.label || `#${rw.placement_rank}`} place · {formatNaira(rw.prize_amount_ngn)}</div>
                  <div className="text-[11px] text-[#9AA4B2]">status: {rw.status}{rw.disbursed_at ? ` · disbursed ${fmtDate(rw.disbursed_at)}` : ''}</div>
                </li>
              ))}
              {awards.map((a) => (
                <li key={a.award_id} className="rounded-lg border border-white/[0.06] px-3 py-2">
                  <div className="text-sm text-white">{a.award_name}</div>
                  <div className="text-[11px] text-[#9AA4B2]">{a.award_type} · {formatNaira(a.prize_amount_ngn)}</div>
                </li>
              ))}
              {certificates.map((c) => (
                <li key={c.certificate_id} className="rounded-lg border border-white/[0.06] px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-white"><ScrollText className="h-3.5 w-3.5 text-[#16C784]" /> {c.certificate_number}</div>
                  <div className="text-[11px] text-[#9AA4B2]">{c.award_type} certificate · issued {fmtDate(c.issued_at)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {appeals.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Flag className="h-4 w-4 text-[#16C784]" /> Appeals</h3>
          <ul className="space-y-2">
            {appeals.map((a) => (
              <li key={a.appeal_id} className="rounded-lg border border-white/[0.06] px-3 py-2">
                <div className="text-sm text-white">{a.appeal_reason}</div>
                <div className="text-[11px] text-[#9AA4B2]">status: {a.status}{a.decision_notes ? ` · ${a.decision_notes}` : ''}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {appealTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1117] p-6">
            <h3 className="mb-3 font-semibold text-white">Appeal this result</h3>
            <textarea
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              rows={4}
              placeholder="Explain why you would like this result re-checked…"
              className="w-full rounded-lg border border-white/[0.1] bg-[#0F1620] px-3 py-2 text-sm text-white placeholder:text-[#9AA4B2]"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setAppealTarget(null)} className="rounded-lg border border-white/[0.1] px-4 py-2 text-sm text-[#9AA4B2]">Cancel</button>
              <button onClick={() => handleAppeal(appealTarget)} className="rounded-lg bg-[#16C784] px-4 py-2 text-sm font-semibold text-[#06130D]">Submit Appeal</button>
            </div>
          </div>
        </div>
      )}

      {exam && (
        <ExamModal
          attemptId={exam.attemptId}
          questions={exam.questions}
          secondsLeft={exam.secondsLeft}
          onClose={() => setExam(null)}
          onSubmitted={onSubmitted}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Leaderboard                                                         */
/* ------------------------------------------------------------------ */

function Leaderboard({ competitionId }) {
  const [type, setType] = useState('individual');
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLeaderboard(competitionId, type)
      .then((data) => { if (!cancelled) setRows(data); })
      .catch(() => { if (!cancelled) setRows([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [competitionId, type]);

  const tabs = [
    { id: 'individual', label: 'Individuals' },
    { id: 'team', label: 'School Teams' },
    { id: 'institution', label: 'Institutions' },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${type === t.id ? 'bg-[#16C784] text-[#06130D]' : 'border border-white/[0.08] text-[#9AA4B2] hover:bg-white/[0.04]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="p-6 text-center text-[#9AA4B2]"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
      ) : !rows || rows.length === 0 ? (
        <p className="p-6 text-center text-sm text-[#9AA4B2]">No entries yet — results are published once approved.</p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r) => {
            const rankStyle = RANK_STYLE[r.rank_position];
            const name = type === 'individual' ? r.display_name : type === 'team' ? r.team_name : r.institution_name;
            return (
              <li key={r.rank_position + r.profile_id + r.team_id + r.institution_id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${rankStyle ? rankStyle.ring : 'border-white/[0.08] text-[#9AA4B2]'}`}>
                  {r.rank_position}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{name || '—'}</p>
                  <p className="truncate text-[11px] text-[#9AA4B2]">{r.institution_name || r.team_name || '—'}</p>
                </div>
                {r.verified ? <Badge variant="verified">Verified</Badge> : <Badge variant="neutral">Pending</Badge>}
                <span className="font-mono font-bold text-[#16C784]">{r.score}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

export default function CompetitionPage() {
  const { id } = useParams();
  const { profile, competitionReward } = usePlatform();
  const toast = useToast();
  const [details, setDetails] = useState(null);
  const [tab, setTab] = useState('overview');
  const [hof, setHof] = useState([]);
  const [arena, setArena] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setDetails(null);
    setError(null);
    Promise.all([
      fetchCompetitionDetails(id).catch((e) => { if (!cancelled) setError(e.message); }),
      fetchHallOfFame(20).catch(() => null),
      fetchArenaMatches(id).catch(() => null),
    ]).then(([d, h, m]) => {
      if (cancelled) return;
      if (d) setDetails(d);
      if (h) setHof(h);
      if (m) setArena(m);
    });
    return () => { cancelled = true; };
  }, [id]);

  const competition = details?.competition;
  const prizes = details?.prizes || competitionReward;

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-[#EA3943]">{error}</p>
        <Link to="/competitions" className="mt-4 inline-block text-[#16C784] hover:underline">← Back to competitions</Link>
      </div>
    );
  }

  if (!details || !competition) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-[#9AA4B2]">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'my', label: 'My Participation' },
    { id: 'arena', label: 'Arena' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link to="/competitions" className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#9AA4B2] hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All competitions
      </Link>

      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0F1D17] to-[#0B1117] p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="official">{competition.division}</Badge>
              <Badge variant={competition.status === 'active' ? 'live' : 'neutral'}>{competition.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{competition.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#9AA4B2]">{competition.description}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarDays, label: 'Registration closes', value: fmtDate(competition.registration_closes) },
            { icon: Clock, label: 'Exam window', value: `${fmtDate(competition.exam_starts)} – ${fmtDate(competition.exam_ends)}` },
            { icon: Users, label: 'Duration', value: `${competition.duration_minutes} min` },
            { icon: ShieldCheck, label: 'Strictly 4 competitors per school', value: 'Cap enforced' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
              <s.icon className="h-4 w-4 text-[#16C784]" />
              <p className="mt-2 text-[11px] uppercase tracking-wide text-[#9AA4B2]">{s.label}</p>
              <p className="text-sm font-medium text-white">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#FFD700]/25 bg-[#FFD700]/[0.06] px-4 py-3">
            <Trophy className="h-5 w-5 text-[#FFD700]" />
            <div><span className="text-[10px] uppercase text-[#9AA4B2]">1st</span><span className="ml-2 font-bold text-[#FFD700]">{formatNaira(prizes.first)}</span></div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#C0C6CE]/25 bg-white/[0.04] px-4 py-3">
            <Medal className="h-5 w-5 text-[#C0C6CE]" />
            <div><span className="text-[10px] uppercase text-[#9AA4B2]">2nd</span><span className="ml-2 font-bold text-[#C0C6CE]">{formatNaira(prizes.second)}</span></div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#CD7F32]/25 bg-[#CD7F32]/[0.06] px-4 py-3">
            <Medal className="h-5 w-5 text-[#CD7F32]" />
            <div><span className="text-[10px] uppercase text-[#9AA4B2]">3rd</span><span className="ml-2 font-bold text-[#CD7F32]">{formatNaira(prizes.third)}</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === t.id ? 'bg-[#16C784] text-[#06130D]' : 'border border-white/[0.08] text-[#9AA4B2] hover:bg-white/[0.04]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><School className="h-4 w-4 text-[#16C784]" /> Divisions</h3>
                <ul className="space-y-2">
                  {(details.divisions || []).map((d) => (
                    <li key={d.id} className="rounded-lg border border-white/[0.06] px-3 py-2">
                      <p className="text-sm font-medium text-white">{d.name}</p>
                      <p className="text-[11px] text-[#9AA4B2]">{d.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><ClipboardList className="h-4 w-4 text-[#16C784]" /> Rounds</h3>
                <ol className="space-y-2">
                  {(details.rounds || []).map((r) => (
                    <li key={r.id} className="flex items-start gap-3 rounded-lg border border-white/[0.06] px-3 py-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#16C784]/15 text-xs font-bold text-[#16C784]">{r.round_number}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{r.round_name}</p>
                        <p className="text-[11px] text-[#9AA4B2]">{r.description}</p>
                        <p className="mt-0.5 text-[10px] text-white/40">{fmtDate(r.start_time)} – {fmtDate(r.end_time)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Users className="h-4 w-4 text-[#16C784]" /> Registered Schools & Teams</h3>
              {((details.schools || []).length === 0 && (details.teams || []).length === 0) ? (
                <p className="text-sm text-[#9AA4B2]">No schools have registered yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(details.schools || []).map((s) => (
                    <div key={s.id} className="rounded-lg border border-white/[0.06] px-3 py-2">
                      <p className="text-sm font-medium text-white">{s.institution_name}</p>
                      <p className="text-[11px] text-[#9AA4B2]">{s.status} · registered {fmtDate(s.registered_at)}</p>
                    </div>
                  ))}
                  {(details.teams || []).map((t) => (
                    <div key={t.id} className="rounded-lg border border-white/[0.06] px-3 py-2">
                      <p className="text-sm font-medium text-white">{t.team_name}</p>
                      <p className="text-[11px] text-[#9AA4B2]">{t.institution_name} · {t.competition_category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-white"><Award className="h-4 w-4 text-[#16C784]" /> Hall of Fame</h3>
              {hof.length === 0 ? (
                <p className="text-sm text-[#9AA4B2]">The Hall of Fame opens after the first podium is approved.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {hof.map((h) => (
                    <div key={h.entry_id} className="flex items-center gap-3 rounded-lg border border-white/[0.06] px-3 py-2">
                      <span className="text-xl">{RANK_STYLE[h.placement_rank]?.icon || '🏅'}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{h.display_name}</p>
                        <p className="truncate text-[11px] text-[#9AA4B2]">{h.institution_name} · {h.competition_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'leaderboard' && <Leaderboard competitionId={id} />}

        {tab === 'my' && <MyParticipation competitionId={id} onStartExam={() => setTab('my')} />}

        {tab === 'arena' && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="mb-1 flex items-center gap-2 font-semibold text-white"><Swords className="h-4 w-4 text-[#16C784]" /> Arena Matches · 1v1 & 2v2</h3>
            <p className="mb-4 text-sm text-[#9AA4B2]">Head-to-head exhibition brackets between registered school teams.</p>
            {arena.length === 0 ? (
              <p className="text-sm text-[#9AA4B2]">No Arena matches scheduled yet.</p>
            ) : (
              <ul className="space-y-3">
                {arena.map((m) => (
                  <li key={m.match_id} className="rounded-xl border border-white/[0.06] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant={m.status === 'completed' ? 'verified' : 'live'}>{m.match_format} · {m.status}</Badge>
                      <span className="text-[11px] text-[#9AA4B2]">{fmtDate(m.scheduled_at)}</span>
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
                    {m.winner_team_id && (
                      <p className="mt-2 text-center text-xs text-[#16C784]">
                        Winner: {m.winner_team_id === m.team_a.team_id ? m.team_a.team_name : m.team_b.team_name}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
