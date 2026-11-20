import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpenCheck,
  Loader2,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import BrandLogo from '../components/ui/BrandLogo';
import {
  fetchAssessmentQuestions,
  fetchMyTutorProfile,
  fetchTutorAssessment,
  startAssessment,
  submitAssessment,
} from '../lib/tutor';

const TOTAL_SECONDS = 45 * 60;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TutorExamPage() {
  const { user } = usePlatform();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [phase, setPhase] = useState('intro'); // intro | running | result
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const [profile, asm, qs] = await Promise.all([
          fetchMyTutorProfile(),
          null,
          fetchAssessmentQuestions(),
        ]);
        if (!profile) {
          navigate('/portal/tutor', { replace: true });
          return;
        }
        const as = await fetchTutorAssessment(profile.id);
        if (!as) {
          navigate('/portal/tutor', { replace: true });
          return;
        }
        setAssessment(as);
        setQuestions(qs);
        if (as.status !== 'ready' && as.status !== 'failed') {
          setPhase('blocked');
        }
      } catch (err) {
        toast.error('Exam load failed', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, toast]);

  // Countdown + auto-submit
  useEffect(() => {
    if (phase !== 'running') return undefined;
    const tick = () => {
      setRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && remaining === 0 && !submittingRef.current) {
      toast.info('Time up', 'Your assessment is being submitted automatically.');
      doSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase]);

  const startExam = async () => {
    if (!assessment) return;
    setSubmitting(true);
    try {
      const started = await startAssessment(assessment.tutor_profile_id);
      setAttempt(started);
      setAnswers({});
      setRemaining(started.duration_minutes * 60);
      setPhase('running');
    } catch (err) {
      toast.error('Could not start the exam', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const doSubmit = async (auto = false) => {
    if (submittingRef.current) return;
    if (!attempt) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const res = await submitAssessment(attempt.attempt_id, answers);
      setResult(res);
      setPhase('result');
      toast.success(
        res.passed ? 'Qualifying test passed' : 'Qualifying test not passed',
        `Score: ${res.score}/${res.total_questions} (pass mark ${res.pass_score}).`
      );
    } catch (err) {
      submittingRef.current = false;
      toast.error('Submission failed', err.message);
      setPhase('running');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-grid-fintech py-24 flex justify-center">
        <Loader2 className="h-6 w-6 text-[#E0A82E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-grid-fintech py-12 sm:py-16">
      <div className="v-container space-y-8">
        <div className="flex items-center justify-between gap-3">
          <BrandLogo size="sm" showTagline={false} />
          <Link to="/portal/tutor" className="text-xs font-medium text-[#9AA4B2] hover:text-white">
            Back to workspace
          </Link>
        </div>

        {phase !== 'running' && (
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E0A82E]/[0.12] border border-[#E0A82E]/30 text-[#E0A82E]">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Qualification Assessment</h1>
              <p className="text-sm text-[#9AA4B2]">{user?.email}</p>
            </div>
          </div>
        )}

        {phase === 'intro' && assessment && (
          <div className="max-w-3xl space-y-6">
            <div className="v-card p-6 space-y-4">
              <Badge variant="green">20 QUESTIONS · 45 MINUTES · PASS {assessment.pass_score}/20</Badge>
              <p className="text-sm text-[#C2C9D4] leading-relaxed">
                The qualifying test covers accounting fundamentals, ATSWA/ICAN knowledge, taxation and financial reporting. Select the best answer for each of the 20 questions.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-[#D5DBE3]">
                <li className="flex items-start gap-2.5"><Clock className="h-4 w-4 text-[#E0A82E] shrink-0 mt-0.5" /> The timer runs for exactly 45 minutes and your answers submit automatically at zero.</li>
                <li className="flex items-start gap-2.5"><ShieldCheck className="h-4 w-4 text-[#E0A82E] shrink-0 mt-0.5" /> Answers are scored server-side against the question bank — results are final.</li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="h-4 w-4 text-[#E0A82E] shrink-0 mt-0.5" /> You need {assessment.pass_score} correct answers out of 20 to qualify.</li>
              </ul>
            </div>
            <button onClick={startExam} className="v-btn-primary w-full py-3" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
              Start the 45-minute test
            </button>
          </div>
        )}

        {phase === 'blocked' && (
          <div className="max-w-xl v-card p-8 text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EA3943]/10 border border-[#EA3943]/30 text-[#EA3943]">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-white">The test is not open yet</h2>
            <p className="text-sm text-[#9AA4B2]">
              The qualifying test opens automatically once Admin verifies your certificates. {assessment?.status === 'passed' ? 'You have already passed this test.' : ''}
            </p>
            <Link to="/portal/tutor" className="v-btn-secondary px-5 py-2.5 text-sm">Back to workspace</Link>
          </div>
        )}

        {phase === 'running' && attempt && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="green">{questions.length} Questions · 45 Minutes</Badge>
                <span className="text-xs text-[#9AA4B2]">{questions.filter((q) => answers[q.id] !== undefined).length} answered</span>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono font-bold ${
                remaining <= 60 ? 'bg-[#EA3943]/15 border-[#EA3943]/40 text-[#EA3943]' : 'bg-[#0B0E11] border-white/[0.1] text-white'
              }`}>
                <Clock className="h-4 w-4" /> {formatTime(remaining)}
              </div>
            </div>

            <div className="space-y-5">
              {questions.map((q, idx) => (
                <div key={q.id} className="v-card p-5 space-y-3">
                  <p className="text-sm font-semibold text-white">
                    {idx + 1}. {q.question_text}
                  </p>
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === i;
                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                          selected
                            ? 'bg-[#E0A82E]/10 border-[#E0A82E]/50 text-white'
                            : 'bg-[#11161C] border-white/[0.08] text-[#C2C9D4] hover:border-white/[0.2]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={selected}
                          onChange={() => setAnswers({ ...answers, [q.id]: i })}
                          className="accent-[#E0A82E]"
                        />
                        <span className="font-mono text-xs text-[#667085]">{String.fromCharCode(65 + i)}</span>
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="sticky bottom-4">
              <div className="v-glass-card p-4 flex items-center justify-between gap-3">
                <span className="text-xs text-[#9AA4B2]">
                  {questions.filter((q) => answers[q.id] !== undefined).length} of {questions.length} answered
                </span>
                <button onClick={() => doSubmit(false)} className="v-btn-primary px-5 py-2.5" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit test
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && result && (
          <div className="max-w-3xl space-y-6">
            <div className={`v-card p-8 text-center space-y-3 border ${result.passed ? 'border-[#E0A82E]/40' : 'border-[#EA3943]/40'}`}>
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${result.passed ? 'bg-[#E0A82E]/15 text-[#E0A82E]' : 'bg-[#EA3943]/15 text-[#EA3943]'}`}>
                {result.passed ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                {result.passed ? 'You qualified!' : 'Not qualified — retake available'}
              </h2>
              <p className="text-sm text-[#C2C9D4]">
                Your score: <span className="font-bold text-white">{result.score}/{result.total_questions}</span> — pass mark {result.pass_score}.
              </p>
              {result.passed && (
                <p className="text-xs text-[#E0A82E]">You are now a verified VALENCE tutor. Visit your workspace for status.</p>
              )}
              <Link to="/portal/tutor" className="v-btn-primary px-5 py-2.5 text-sm inline-flex">
                Back to workspace <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="v-card p-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#E0A82E]">Answer Review</p>
              <ul className="space-y-3">
                {questions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  return (
                    <li key={q.id} className="rounded-xl bg-[#0B0E11] border border-white/[0.08] p-4 space-y-2">
                      <p className="text-xs font-semibold text-white">
                        {idx + 1}. {q.question_text}
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        {userAnswer === undefined || userAnswer === null
                          ? 'No answer submitted (scored zero).'
                          : `Your answer: ${String.fromCharCode(65 + userAnswer)} — ${q.options[userAnswer]}`}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
