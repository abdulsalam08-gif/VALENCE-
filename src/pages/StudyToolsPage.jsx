import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  HelpCircle,
  CalendarDays,
  TrendingUp,
  GraduationCap,
  BookMarked,
  BookOpen,
  Scale,
  Coins,
  Sparkles,
  StickyNote,
  Timer,
  CheckCircle2,
  Library,
  ChartBar,
  Target,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  X,
  RotateCcw,
  Send,
  Loader2,
  ChevronRight,
  ChevronDown,
  Flame,
  Clock,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';
import {
  sendAiTutorMessage,
  fetchAiTutorConversations,
  fetchAiTutorMessages,
  fetchStudyPlans,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
  fetchSyllabusProgress,
  createSyllabusProgress,
  setSyllabusProgress,
  fetchStudySessionsLog,
  logStudySession,
  deleteStudySession,
  fetchStudentNotes,
  createStudentNote,
  deleteStudentNote,
  fetchFlashcardDecks,
  createFlashcardDeck,
  updateFlashcardDeck,
  deleteFlashcardDeck,
  fetchReadingProgress,
  createReadingProgress,
  setReadingProgress,
  fetchLearningResources,
  recordQuizAttempt,
  fetchQuizAttempts,
  deleteQuizAttempt,
  PRACTICE_QUESTION_BANK,
  pickQuizQuestions,
} from '../lib/studyTools';

const GREEN = '#16C784';

const TOOLS = [
  { id: 'flashcards', name: 'Flashcards', icon: Layers, desc: 'Build decks and flip-study terms & definitions' },
  { id: 'quiz', name: 'Quiz Generator', icon: HelpCircle, desc: 'Generate practice quizzes and get instant scoring' },
  { id: 'planner', name: 'Study Planner', icon: CalendarDays, desc: 'Plan study blocks with targets and deadlines' },
  { id: 'progress', name: 'Progress Tracker', icon: TrendingUp, desc: 'Track syllabus topics as you complete them' },
  { id: 'exam', name: 'Exam Mode', icon: GraduationCap, desc: 'Timed 10-question practice exams under pressure' },
  { id: 'ias', name: 'IAS', icon: BookMarked, desc: 'IAS standards hub — topics, progress, revision' },
  { id: 'ifrs', name: 'IFRS', icon: BookOpen, desc: 'IFRS hub — standards, progress and practice' },
  { id: 'finance', name: 'Finance', icon: Coins, desc: 'Finance & accounting hub for bookkeeping, tax' },
  { id: 'tutor', name: 'AI Accounting Tutor', icon: Sparkles, desc: 'Ask anything — 7-step guided answers, on demand' },
  { id: 'notes', name: 'Student Notes', icon: StickyNote, desc: 'Capture and organize your study notes' },
  { id: 'sessions', name: 'Revision Sessions', icon: Timer, desc: 'Log revision sessions and build your streak' },
  { id: 'reading', name: 'Reading Progress', icon: CheckCircle2, desc: 'Mark chapters and topics you have read' },
  { id: 'resources', name: 'Learning Resources', icon: Library, desc: 'Browse curated study resources' },
  { id: 'insights', name: 'Performance Insights', icon: ChartBar, desc: 'See your scores, time and study trends' },
  { id: 'goals', name: 'Study Goals', icon: Target, desc: 'Set targets and track plan milestones' },
];

/* ------------------------------------------------------------------ */
/* Shared UI atoms                                                     */
/* ------------------------------------------------------------------ */

function SectionCard({ title, subtitle, right, children, className = '' }) {
  return (
    <div className={`v-card p-5 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-[#9AA4B2] mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="text-center py-10 px-4">
      <Icon size={28} className="mx-auto text-[#5A6472] mb-3" />
      <p className="text-sm font-semibold text-white">{title}</p>
      {desc && <p className="text-xs text-[#9AA4B2] mt-1 max-w-xs mx-auto">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-[#EA3943]/40 bg-[#EA3943]/10 px-4 py-3 text-sm text-[#FF8A8A]">
      {message}
    </div>
  );
}

function SuccessNote({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-[#16C784]/40 bg-[#16C784]/10 px-4 py-3 text-sm text-[#16C784]">
      {message}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="v-label">{label}</span>
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Flashcards                                                       */
/* ------------------------------------------------------------------ */

function FlashcardsTool({ onToast }) {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDeck, setActiveDeck] = useState(null);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [deckTitle, setDeckTitle] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);
  const [known, setKnown] = useState(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDecks(await fetchFlashcardDecks());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addCard = async (e) => {
    e.preventDefault();
    if (!activeDeck || !front.trim() || !back.trim()) return;
    const cards = [...(activeDeck.cards || []), { front: front.trim(), back: back.trim() }];
    try {
      const updated = await updateFlashcardDeck(activeDeck.id, { cards });
      setActiveDeck(updated);
      setFront('');
      setBack('');
      onToast?.('Card added to the deck');
    } catch (err) {
      setError(err.message);
    }
  };

  const createDeck = async (e) => {
    e.preventDefault();
    if (!deckTitle.trim()) return;
    try {
      const deck = await createFlashcardDeck({ deckTitle: deckTitle.trim() });
      setDecks((d) => [deck, ...d]);
      setDeckTitle('');
      setActiveDeck(deck);
      setIdx(0);
      setKnown(new Set());
      onToast?.('Flashcard deck created');
    } catch (err) {
      setError(err.message);
    }
  };

  const cards = activeDeck?.cards || [];
  const current = cards[idx];

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Your decks" subtitle="Click a deck to study or manage its cards">
          {loading ? (
            <p className="text-sm text-[#9AA4B2]">Loading decks...</p>
          ) : decks.length === 0 ? (
            <EmptyState icon={Layers} title="No decks yet" desc="Create a deck and add your first card." />
          ) : (
            <ul className="space-y-2">
              {decks.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => { setActiveDeck(d); setIdx(0); setFlipped(false); setKnown(new Set()); }}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                      activeDeck?.id === d.id
                        ? 'border-[#16C784]/60 bg-[#16C784]/10'
                        : 'border-white/[0.10] hover:border-[#16C784]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{d.deck_title}</span>
                      <span className="text-xs text-[#9AA4B2]">{(d.cards || []).length} cards</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={createDeck} className="mt-4 grid grid-cols-1 gap-3">
            <Field label="New deck title">
              <input className="v-input" value={deckTitle} onChange={(e) => setDeckTitle(e.target.value)} placeholder="e.g. IAS 1 — Presentation of Financial Statements" />
            </Field>
            <button type="submit" className="v-btn-primary">
              <Plus size={15} /> Create deck
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title={activeDeck ? `Study: ${activeDeck.deck_title}` : 'Study a deck'}
          subtitle={activeDeck ? `${cards.length} cards` : 'Select a deck from the left to begin'}
          right={activeDeck && (
            <button onClick={() => { setActiveDeck(null); setFlipped(false); }} className="text-xs text-[#9AA4B2] hover:text-white flex items-center gap-1">
              <ArrowLeft size={13} /> Back
            </button>
          )}
        >
          {activeDeck && cards.length === 0 && (
            <EmptyState icon={Layers} title="Deck is empty" desc="Add cards with a front (term) and back (definition)." />
          )}
          {activeDeck && cards.length > 0 && (
            <>
              <div className="relative h-44 rounded-2xl border border-white/[0.10] bg-[#0E131A] flex items-center justify-center overflow-hidden">
                <button
                  onClick={() => setFlipped((f) => !f)}
                  className="absolute inset-0 cursor-pointer"
                  aria-label="Flip card"
                >
                  <div className="text-center px-8">
                    <p className="text-[#9AA4B2] text-xs mb-2">{flipped ? 'Answer' : 'Question'}</p>
                    <p className="text-lg font-semibold text-white">
                      {flipped ? current.back : current.front}
                    </p>
                  </div>
                </button>
                <div className="absolute top-2 right-2 text-xs text-[#9AA4B2]">
                  {idx + 1} / {cards.length}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mt-3">
                <button
                  onClick={() => { setIdx((i) => (i - 1 + cards.length) % cards.length); setFlipped(false); }}
                  className="v-btn-secondary"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setKnown((k) => new Set(k).add(idx)); setIdx((i) => Math.min(cards.length - 1, i + 1)); setFlipped(false); }}
                    className="v-btn-secondary"
                  >
                    <Check size={15} /> Got it
                  </button>
                  <button
                    onClick={() => { setKnown((k) => { const n = new Set(k); n.delete(idx); return n; }); setIdx((i) => Math.min(cards.length - 1, i + 1)); setFlipped(false); }}
                    className="v-btn-secondary"
                  >
                    Review
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#9AA4B2] mt-3">
                Known: {known.size} / {cards.length}
              </p>

              <form onSubmit={addCard} className="mt-4 grid grid-cols-1 gap-3">
                <Field label="Card front (term)">
                  <input className="v-input" value={front} onChange={(e) => setFront(e.target.value)} placeholder="e.g. Accrual basis" />
                </Field>
                <Field label="Card back (definition)">
                  <input className="v-input" value={back} onChange={(e) => setBack(e.target.value)} placeholder="e.g. Revenue and expenses recognised when earned/incurred" />
                </Field>
                <button type="submit" className="v-btn-primary">
                  <Plus size={15} /> Add card
                </button>
              </form>
              <button
                onClick={async () => { await deleteFlashcardDeck(activeDeck.id); setActiveDeck(null); load(); onToast?.('Deck deleted'); }}
                className="mt-3 text-xs text-[#EA3943] hover:text-[#FF8A8A] flex items-center gap-1"
              >
                <Trash2 size={13} /> Delete deck
              </button>
            </>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Quiz Generator                                                   */
/* ------------------------------------------------------------------ */

function QuizTool({ onToast }) {
  const topics = useMemo(() => ['All topics', ...Array.from(new Set(PRACTICE_QUESTION_BANK.map((q) => q.topic)))], []);
  const [topic, setTopic] = useState('All topics');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    const qs = pickQuizQuestions(topic, count);
    setQuestions(qs);
    setAnswers({});
    setResult(null);
    setError('');
    setSeconds(0);
  };

  useEffect(() => {
    if (!questions.length) return undefined;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [questions.length]);

  const submit = async () => {
    if (!questions.length) return;
    const correct = questions.filter((q) => answers[q.question]).length;
    try {
      const attempt = await recordQuizAttempt({
        quizTopic: topic,
        questionsTotal: questions.length,
        questionsCorrect: correct,
        timeTakenSeconds: seconds,
        isExamMode: false,
        feedback: correct >= questions.length * 0.6 ? 'Solid work — review the explanations for missed answers.' : 'Keep practising — reread the relevant theory.',
      });
      setResult({ correct, total: questions.length, score: attempt.score_percentage });
      onToast?.(`Quiz saved — ${correct}/${questions.length}`);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <SectionCard title="Quiz Generator" subtitle="Pick a topic and generate a scored practice quiz">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Topic">
            <select className="v-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Questions">
            <select className="v-input" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[5, 8, 10].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <div className="flex items-end">
            <button onClick={start} className="v-btn-primary w-full justify-center">
              <HelpCircle size={15} /> Generate quiz
            </button>
          </div>
        </div>
      </SectionCard>

      {questions.length > 0 && (
        <>
          <div className="flex items-center justify-between text-xs text-[#9AA4B2]">
            <span><Clock size={13} className="inline mr-1" />{seconds}s elapsed</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="v-card p-5">
                <p className="text-sm font-semibold text-white mb-3">{i + 1}. {q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() => setAnswers((a) => ({ ...a, [q.question]: j }))}
                      className={`text-left rounded-lg border px-3 py-2 text-sm transition ${
                        answers[q.question] === j
                          ? 'border-[#16C784]/60 bg-[#16C784]/10 text-[#16C784]'
                          : 'border-white/[0.10] text-[#C6CDD6] hover:border-[#16C784]/40'
                      }`}
                    >
                      {String.fromCharCode(65 + j)}. {opt}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#5A6472] mt-3">{q.explanation}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={submit} className="v-btn-primary flex-1 justify-center">
              <Check size={15} /> Submit answers
            </button>
            <button onClick={start} className="v-btn-secondary flex-1 justify-center">
              <RotateCcw size={15} /> New quiz
            </button>
          </div>
        </>
      )}

      {result && (
        <SectionCard title="Your result" subtitle="Attempt recorded in your performance history">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#16C784]">{result.score}%</div>
              <p className="text-xs text-[#9AA4B2] mt-1">{result.correct}/{result.total} correct</p>
            </div>
            <div className="text-sm text-[#C6CDD6]">
              {result.score >= 80 ? 'Excellent — you know this topic well.' : result.score >= 60 ? 'Good effort — a bit more practice will solidify it.' : 'Keep going — reread the theory and try again.'}
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Study Planner                                                    */
/* ------------------------------------------------------------------ */

function PlannerTool({ onToast }) {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', planType: 'general', targetDate: '', description: '' });

  const load = useCallback(async () => {
    try { setPlans(await fetchStudyPlans()); } catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await createStudyPlan({
        title: form.title.trim(),
        planType: form.planType,
        targetDate: form.targetDate || null,
        description: form.description,
      });
      setForm({ title: '', planType: 'general', targetDate: '', description: '' });
      await load();
      onToast?.('Study plan created');
    } catch (err) {
      setError(err.message);
    }
  };

  const cycleStatus = async (p) => {
    const next = p.status === 'active' ? 'completed' : 'active';
    try {
      await updateStudyPlan(p.id, { status: next });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try { await deleteStudyPlan(id); await load(); onToast?.('Plan deleted'); } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <SectionCard title="Create a study plan" subtitle="Plans appear in your Study Goals and can carry a target date">
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Plan title">
            <input className="v-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Complete IAS 12 — Income Tax" />
          </Field>
          <Field label="Type">
            <select className="v-input" value={form.planType} onChange={(e) => setForm({ ...form, planType: e.target.value })}>
              <option value="general">General</option>
              <option value="atswa">ATSWA</option>
              <option value="ican">ICAN</option>
              <option value="exam">Exam prep</option>
            </select>
          </Field>
          <Field label="Target date">
            <input type="date" className="v-input" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          </Field>
          <Field label="Description">
            <input className="v-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional notes" />
          </Field>
          <div className="sm:col-span-2">
            <button type="submit" className="v-btn-primary"><Plus size={15} /> Add plan</button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Your plans" subtitle={`${plans.length} active plans`}>
        {plans.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No plans yet" desc="Create your first study plan to get organised." />
        ) : (
          <ul className="space-y-2">
            {plans.map((p) => (
              <li key={p.id} className="rounded-xl border border-white/[0.10] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.title}</p>
                    <p className="text-xs text-[#9AA4B2] mt-0.5">
                      {p.plan_type} · {p.target_date ? `Target: ${p.target_date}` : 'No target date'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={p.status === 'completed' ? 'verified' : 'green'}>{p.status}</Badge>
                    <button onClick={() => cycleStatus(p)} className="v-btn-secondary">{p.status === 'completed' ? 'Reopen' : 'Complete'}</button>
                    <button onClick={() => remove(p.id)} className="text-[#EA3943] hover:text-[#FF8A8A]"><Trash2 size={14} /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Progress Tracker                                                 */
/* ------------------------------------------------------------------ */

function ProgressTool({ onToast }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [topic, setTopic] = useState('');
  const [chapter, setChapter] = useState('');

  const load = useCallback(async () => {
    try { setItems(await fetchSyllabusProgress()); } catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    try {
      await createSyllabusProgress({ topicName: topic.trim(), chapterName: chapter });
      setTopic(''); setChapter('');
      await load();
      onToast?.('Topic added');
    } catch (err) {
      setError(err.message);
    }
  };

  const cycle = async (it) => {
    try {
      const next = it.status === 'completed' ? 'in_progress' : it.status === 'in_progress' ? 'completed' : 'in_progress';
      await setSyllabusProgress(it.id, next);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const done = items.filter((i) => i.status === 'completed').length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <SectionCard title="Syllabus progress" subtitle={`${done}/${items.length} topics completed · ${pct}%`}>
        <div className="h-2.5 rounded-full bg-white/[0.08] mb-4 overflow-hidden">
          <div className="h-full rounded-full bg-[#16C784] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Field label="Topic">
            <input className="v-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Bank reconciliation" />
          </Field>
          <Field label="Chapter (optional)">
            <input className="v-input" value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="e.g. Chapter 3 — Bank column" />
          </Field>
          <div className="sm:col-span-2"><button type="submit" className="v-btn-primary"><Plus size={15} /> Add topic</button></div>
        </form>
        {items.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No topics tracked yet" desc="Add syllabus topics as you start covering them." />
        ) : (
          <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.10] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{it.topic_name}</p>
                  {it.chapter_name && <p className="text-xs text-[#9AA4B2]">{it.chapter_name}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={it.status === 'completed' ? 'verified' : it.status === 'in_progress' ? 'green' : 'neutral'}>{it.status}</Badge>
                  <button onClick={() => cycle(it)} className="v-btn-secondary">
                    {it.status === 'completed' ? 'Reset' : it.status === 'in_progress' ? 'Mark done' : 'Start'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Exam Mode                                                       */
/* ------------------------------------------------------------------ */

function ExamTool({ onToast }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(600);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  const start = () => {
    setQuestions(pickQuizQuestions('All topics', 10));
    setAnswers({});
    setSeconds(600);
    setSubmitted(null);
    setStarted(true);
    setError('');
  };

  useEffect(() => {
    if (!started || submitted) return undefined;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [started, submitted]);

  const submit = async () => {
    if (!questions.length) return;
    const correct = questions.filter((q) => answers[q.question]).length;
    try {
      const attempt = await recordQuizAttempt({
        quizTopic: 'Exam Mode',
        questionsTotal: questions.length,
        questionsCorrect: correct,
        timeTakenSeconds: 600 - seconds,
        isExamMode: true,
        feedback: 'Timed exam-mode attempt — review explanations for any missed questions.',
      });
      setSubmitted({ correct, total: questions.length, score: attempt.score_percentage });
      onToast?.(`Exam submitted — ${correct}/${questions.length}`);
    } catch (e) {
      setError(e.message);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <SectionCard title="Exam Mode" subtitle="10 questions · 10 minutes · scored and recorded">
        {!started && (
          <div className="text-center py-6">
            <GraduationCap size={32} className="mx-auto text-[#16C784] mb-3" />
            <p className="text-sm text-[#C6CDD6] mb-4">Simulate exam conditions with a timed, scored practice paper.</p>
            <button onClick={start} className="v-btn-primary"><GraduationCap size={15} /> Start timed exam</button>
          </div>
        )}
        {started && !submitted && (
          <>
            <div className={`flex items-center justify-center gap-2 mb-4 rounded-xl border px-4 py-2 w-fit ${seconds < 60 ? 'border-[#EA3943]/50 text-[#FF8A8A]' : 'border-white/[0.10] text-[#16C784]'}`}>
              <Clock size={15} /> {mm}:{ss}
            </div>
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {questions.map((q, i) => (
                <div key={i} className="v-card p-5">
                  <p className="text-sm font-semibold text-white mb-3">{i + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => setAnswers((a) => ({ ...a, [q.question]: j }))}
                        className={`text-left rounded-lg border px-3 py-2 text-sm transition ${
                          answers[q.question] === j
                            ? 'border-[#16C784]/60 bg-[#16C784]/10 text-[#16C784]'
                            : 'border-white/[0.10] text-[#C6CDD6] hover:border-[#16C784]/40'
                        }`}
                      >
                        {String.fromCharCode(65 + j)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={submit} className="v-btn-primary"><Check size={15} /> Submit exam</button>
            </div>
          </>
        )}
        {submitted && (
          <>
            <div className="text-center py-6">
              <Trophy size={32} className="mx-auto text-[#16C784] mb-3" />
              <div className="text-4xl font-bold text-[#16C784]">{submitted.score}%</div>
              <p className="text-sm text-[#9AA4B2] mt-1">{submitted.correct}/{submitted.total} correct · attempt saved</p>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={start} className="v-btn-secondary"><RotateCcw size={15} /> Try again</button>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6-8. Subject hubs (IAS / IFRS / Finance)                            */
/* ------------------------------------------------------------------ */

function SubjectHubTool({ subject, onToast }) {
  const [progress, setProgress] = useState([]);
  const [reading, setReading] = useState([]);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, r] = await Promise.all([fetchSyllabusProgress(), fetchReadingProgress()]);
      setProgress(p);
      setReading(r);
    } catch (e) {
      setError(e.message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    try {
      await createSyllabusProgress({ topicName: topic.trim() });
      setTopic('');
      await load();
      onToast?.('Topic added');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <SectionCard
        title={`${subject} hub`}
        subtitle={`Syllabus topics and reading progress for ${subject}`}
      >
        <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Field label={`Add ${subject} topic`}>
            <input className="v-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={`e.g. ${subject} standard or topic`} />
          </Field>
          <div className="flex items-end">
            <button type="submit" className="v-btn-primary w-full justify-center"><Plus size={15} /> Add topic</button>
          </div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-[#9AA4B2] uppercase tracking-wide mb-2">Syllabus topics</p>
            {progress.length === 0 ? (
              <p className="text-sm text-[#5A6472]">No topics yet — add one above.</p>
            ) : (
              <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                {progress.map((it) => (
                  <li key={it.id} className="flex items-center justify-between rounded-lg border border-white/[0.10] px-3 py-2">
                    <span className="text-sm text-white">{it.topic_name}</span>
                    <Badge variant={it.status === 'completed' ? 'verified' : it.status === 'in_progress' ? 'green' : 'neutral'}>{it.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-[#9AA4B2] uppercase tracking-wide mb-2">Reading progress</p>
            {reading.length === 0 ? (
              <p className="text-sm text-[#5A6472]">No reading entries yet.</p>
            ) : (
              <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                {reading.map((it) => (
                  <li key={it.id} className="flex items-center justify-between rounded-lg border border-white/[0.10] px-3 py-2">
                    <span className="text-sm text-white">{it.topic_name}{it.chapter_name ? ` · ${it.chapter_name}` : ''}</span>
                    <Badge variant={it.status === 'completed' ? 'verified' : 'neutral'}>{it.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Ask the AI tutor" subtitle="Get a 7-step guided answer on any topic">
        <p className="text-sm text-[#9AA4B2]">
          The AI Accounting Tutor answers in a 7-step structure: Understanding the Question, Relevant Principle, Theory Explained, Step-by-Step Solution, Final Answer, Common Mistakes and Practice Tip.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Link to="/learning" onClick={() => {}} className="v-btn-secondary">
            Open AI Accounting Tutor
            <ChevronRight size={14} />
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 9. AI Accounting Tutor                                              */
/* ------------------------------------------------------------------ */

const TUTOR_SUGGESTIONS = [
  'Explain the matching concept with an example.',
  'How do I prepare a bank reconciliation statement?',
  'What is the difference between a debit and a credit?',
  'Explain FIFO and LIFO inventory valuation.',
];

const STEP_ICON_COLORS = ['#16C784', '#3B82F6', '#8B5CF6', '#F5A623', '#16C784', '#EA3943', '#3B82F6'];

function AiTutorTool({ onToast }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try { setConversations(await fetchAiTutorConversations()); } catch (e) { setError(e.message); }
  }, []);

  const loadMessages = useCallback(async (convId) => {
    try {
      const msgs = await fetchAiTutorMessages(convId);
      setMessages(msgs);
      setActiveConversationId(convId);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, processing]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || sending) return;
    setSending(true);
    setError('');
    setMessages((m) => [...m, { id: `local-${Date.now()}`, role: 'user', content: message, steps: null, created_at: new Date().toISOString() }]);
    setInput('');
    setProcessing(true);
    try {
      const result = await sendAiTutorMessage(message, {
        conversationId: activeConversationId,
        onStatus: () => setProcessing(true),
      });
      if (result.error) {
        setError(result.error);
      } else {
        setMessages((m) => [...m, {
          id: result.messageId,
          role: 'assistant',
          content: result.content,
          steps: result.steps,
          created_at: new Date().toISOString(),
        }]);
        setActiveConversationId(result.conversationId);
        await loadConversations();
        onToast?.('Tutor reply ready');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setProcessing(false);
      setSending(false);
    }
  };

  const startNew = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError('');
  };

  const steps = messages.filter((m) => m.role === 'assistant' && m.steps).map((m) => m.steps).pop();

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <SectionCard title="Conversations" subtitle="Recent chats">
          {conversations.length === 0 ? (
            <p className="text-sm text-[#5A6472]">No conversations yet.</p>
          ) : (
            <ul className="space-y-2 max-h-[420px] overflow-y-auto">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => loadMessages(c.id)}
                    className={`w-full text-left rounded-xl border px-3 py-2 transition ${
                      activeConversationId === c.id
                        ? 'border-[#16C784]/60 bg-[#16C784]/10'
                        : 'border-white/[0.10] hover:border-[#16C784]/40'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white truncate">{c.title}</p>
                    <p className="text-xs text-[#9AA4B2]">{c.message_count} messages</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={startNew} className="v-btn-secondary w-full justify-center mt-4">
            <Plus size={14} /> New conversation
          </button>
        </SectionCard>

        <div className="v-card flex flex-col" style={{ height: 'min(640px, 70vh)' }}>
          <div className="border-b border-white/[0.08] px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} style={{ color: GREEN }} /> AI Accounting Tutor
              </h3>
              <p className="text-xs text-[#9AA4B2]">7-step guided answers · 30 messages per day</p>
            </div>
            <Badge variant="green">Live</Badge>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.length === 0 && !processing && (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <Sparkles size={34} style={{ color: GREEN }} className="mb-4" />
                <p className="text-sm font-semibold text-white">Ask any accounting question</p>
                <p className="text-xs text-[#9AA4B2] mt-1 max-w-sm">
                  The tutor replies with a 7-step structure: understanding the question, the principle, theory, a step-by-step solution, the final answer, common mistakes and a practice tip.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-5">
                  {TUTOR_SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="v-btn-secondary text-xs">{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-[#16C784] text-[#0E131A]' : 'bg-[#141A22] border border-white/[0.10] text-white'}`}>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {processing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#141A22] border border-white/[0.10] px-4 py-3 flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" style={{ color: GREEN }} />
                  <span className="text-sm text-[#9AA4B2]">The tutor is thinking…</span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-white/[0.08] px-5 py-4 flex gap-2"
          >
            <input
              className="v-input flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about accounting, bookkeeping, tax, IFRS or IAS…"
              disabled={sending}
            />
            <button type="submit" className="v-btn-primary" disabled={sending || processing}>
              <Send size={15} /> Send
            </button>
          </form>
        </div>
      </div>

      {steps && (
        <SectionCard title="Latest 7-step breakdown" subtitle="Structured breakdown of the tutor's latest answer">
          {(steps.steps || []).length === 0 ? (
            <p className="text-sm text-[#9AA4B2]">No structured steps available.</p>
          ) : (
            <ol className="space-y-3">
              {steps.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${STEP_ICON_COLORS[i % STEP_ICON_COLORS.length]}22`, color: STEP_ICON_COLORS[i % STEP_ICON_COLORS.length] }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{s.title || `Step ${i + 1}`}</p>
                    <p className="text-sm text-[#C6CDD6] mt-0.5 whitespace-pre-wrap">{s.content || ''}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </SectionCard>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Student Notes                                                   */
/* ------------------------------------------------------------------ */

function NotesTool({ onToast }) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '' });

  const load = useCallback(async () => {
    try { setNotes(await fetchStudentNotes()); } catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    try {
      await createStudentNote({ title: form.title.trim(), content: form.content.trim() });
      setForm({ title: '', content: '' });
      await load();
      onToast?.('Note saved');
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try { await deleteStudentNote(id); await load(); onToast?.('Note deleted'); } catch (e) { setError(e.message); }
  };

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <SectionCard title="Add a note" subtitle="Your private study notes">
        <form onSubmit={create} className="grid grid-cols-1 gap-3">
          <Field label="Title">
            <input className="v-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Bank reconciliation — key steps" />
          </Field>
          <Field label="Content">
            <textarea className="v-input min-h-[120px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your notes…" />
          </Field>
          <div><button type="submit" className="v-btn-primary"><Plus size={15} /> Save note</button></div>
        </form>
      </SectionCard>

      <SectionCard title="Your notes" subtitle={`${notes.length} notes`}>
        {notes.length === 0 ? (
          <EmptyState icon={StickyNote} title="No notes yet" desc="Capture key concepts as you study." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((n) => (
              <div key={n.id} className="rounded-xl border border-white/[0.10] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  {n.is_pinned && <Badge variant="official">Pinned</Badge>}
                </div>
                <p className="text-sm text-[#C6CDD6] mt-2 whitespace-pre-wrap">{n.content}</p>
                <div className="flex justify-end mt-3">
                  <button onClick={() => remove(n.id)} className="text-xs text-[#EA3943] hover:text-[#FF8A8A] flex items-center gap-1">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Revision Sessions                                               */
/* ------------------------------------------------------------------ */

function SessionsTool({ onToast }) {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ subject: '', duration: 30, notes: '' });

  const load = useCallback(async () => {
    try { setSessions(await fetchStudySessionsLog()); } catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const log = async (e) => {
    e.preventDefault();
    try {
      await logStudySession({
        subject: form.subject,
        durationMinutes: Number(form.duration) || 30,
        notes: form.notes,
      });
      setForm({ subject: '', duration: 30, notes: '' });
      await load();
      onToast?.('Session logged');
    } catch (err) {
      setError(err.message);
    }
  };

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const days = new Set(sessions.map((s) => s.session_date));

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Sessions logged</p>
          <p className="text-2xl font-bold text-white mt-1">{sessions.length}</p>
        </div>
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Total minutes</p>
          <p className="text-2xl font-bold text-white mt-1">{totalMinutes}</p>
        </div>
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Study days</p>
          <p className="text-2xl font-bold text-white mt-1">{days.size}</p>
        </div>
      </div>

      <SectionCard title="Log a revision session" subtitle="Build your study streak">
        <form onSubmit={log} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Subject">
            <input className="v-input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Double-entry bookkeeping" />
          </Field>
          <Field label="Duration (minutes)">
            <input type="number" min="1" max="600" className="v-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes (optional)">
              <input className="v-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="What did you cover?" />
            </Field>
          </div>
          <div className="sm:col-span-2"><button type="submit" className="v-btn-primary"><Plus size={15} /> Log session</button></div>
        </form>
      </SectionCard>

      <SectionCard title="Recent sessions" subtitle="Your revision history">
        {sessions.length === 0 ? (
          <EmptyState icon={Timer} title="No sessions logged yet" desc="Log your first revision session above." />
        ) : (
          <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.10] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{s.subject || 'Untitled session'}</p>
                  <p className="text-xs text-[#9AA4B2]">{s.session_date} · {s.duration_minutes} min{s.notes ? ` · ${s.notes}` : ''}</p>
                </div>
                <button onClick={async () => { await deleteStudySession(s.id); load(); onToast?.('Session removed'); }} className="text-[#EA3943] hover:text-[#FF8A8A]">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 12. Reading Progress                                                */
/* ------------------------------------------------------------------ */

function ReadingTool({ onToast }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ topic: '', chapter: '' });

  const load = useCallback(async () => {
    try { setItems(await fetchReadingProgress()); } catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    try {
      await createReadingProgress({ topicName: form.topic.trim(), chapterName: form.chapter });
      setForm({ topic: '', chapter: '' });
      await load();
      onToast?.('Topic added');
    } catch (err) {
      setError(err.message);
    }
  };

  const cycle = async (it) => {
    try {
      await setReadingProgress(it.id, it.status === 'completed' ? 'in_progress' : 'completed');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const done = items.filter((i) => i.status === 'completed').length;

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <SectionCard title="Reading progress" subtitle={`${done}/${items.length} readings completed`}>
        <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <Field label="Topic">
            <input className="v-input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. IAS 16 — Property, Plant & Equipment" />
          </Field>
          <Field label="Chapter (optional)">
            <input className="v-input" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} placeholder="e.g. Chapter 2 — Recognition" />
          </Field>
          <div className="sm:col-span-2"><button type="submit" className="v-btn-primary"><Plus size={15} /> Add reading</button></div>
        </form>
        {items.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="No reading progress tracked" desc="Add topics as you work through the syllabus." />
        ) : (
          <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.10] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{it.topic_name}</p>
                  {it.chapter_name && <p className="text-xs text-[#9AA4B2]">{it.chapter_name}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={it.status === 'completed' ? 'verified' : 'neutral'}>{it.status}</Badge>
                  <button onClick={() => cycle(it)} className="v-btn-secondary">{it.status === 'completed' ? 'Reset' : 'Mark read'}</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 13. Learning Resources                                              */
/* ------------------------------------------------------------------ */

function ResourcesTool() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      try { setResources(await fetchLearningResources()); } catch (e) { setError(e.message); }
    })();
  }, []);

  const filtered = resources.filter((r) => {
    const q = query.trim().toLowerCase();
    return !q || r.title.toLowerCase().includes(q) || (r.resource_type || '').toLowerCase().includes(q);
  });

  const iconFor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('video')) return 'Video';
    if (t.includes('pdf') || t.includes('document') || t.includes('doc')) return 'PDF';
    if (t.includes('link') || t.includes('url')) return 'Link';
    if (t.includes('ebook') || t.includes('e-book') || t.includes('book')) return 'Book';
    return 'Resource';
  };

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <SectionCard title="Learning resources" subtitle="Curated study materials for your programme">
        <input className="v-input mb-4" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources…" />
        {filtered.length === 0 ? (
          <EmptyState icon={Library} title="No resources found" desc={resources.length === 0 ? 'Resources will appear here as they are added.' : 'Try a different search term.'} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/[0.10] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{r.title}</p>
                  <Badge variant="neutral">{iconFor(r.resource_type)}</Badge>
                </div>
                <p className="text-xs text-[#9AA4B2] mt-1">{r.resource_type}{r.access_permission ? ` · ${r.access_permission}` : ''}</p>
                {r.file_url && (
                  <a href={r.file_url} target="_blank" rel="noreferrer" className="text-xs text-[#16C784] hover:underline mt-2 inline-flex items-center gap-1">
                    Open resource <ExternalLink />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 14. Performance Insights                                            */
/* ------------------------------------------------------------------ */

function InsightsTool() {
  const [attempts, setAttempts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [a, s] = await Promise.all([fetchQuizAttempts(), fetchStudySessionsLog(50)]);
        setAttempts(a);
        setSessions(s);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const avg = attempts.length ? Math.round(attempts.reduce((sum, a) => sum + Number(a.score_percentage || 0), 0) / attempts.length) : 0;
  const best = attempts.reduce((m, a) => Math.max(m, Number(a.score_percentage || 0)), 0);
  const totalMin = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const exams = attempts.filter((a) => a.is_exam_mode).length;
  const bestTopic = attempts.length
    ? attempts.slice().sort((a, b) => Number(b.score_percentage) - Number(a.score_percentage))[0].quiz_topic
    : null;

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Average score</p>
          <p className="text-2xl font-bold text-[#16C784] mt-1">{avg}%</p>
        </div>
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Best score</p>
          <p className="text-2xl font-bold text-white mt-1">{best}%</p>
        </div>
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Quiz attempts</p>
          <p className="text-2xl font-bold text-white mt-1">{attempts.length}</p>
        </div>
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Exam-mode runs</p>
          <p className="text-2xl font-bold text-white mt-1">{exams}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Score trend" subtitle="Your last attempts">
          {attempts.length === 0 ? (
            <EmptyState icon={ChartBar} title="No attempts yet" desc="Take a quiz or exam to see your trend." />
          ) : (
            <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {attempts.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-[#9AA4B2] truncate">{a.quiz_topic}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-white/[0.08] overflow-hidden">
                    <div className="h-full rounded-full bg-[#16C784]" style={{ width: `${a.score_percentage}%` }} />
                  </div>
                  <span className="w-12 text-xs font-semibold text-white text-right">{a.score_percentage}%</span>
                  <button onClick={async () => { await deleteQuizAttempt(a.id); setAttempts((x) => x.filter((i) => i.id !== a.id)); }} className="text-[#EA3943] hover:text-[#FF8A8A]">
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Study activity" subtitle="Revision sessions overview">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-white/[0.10] p-4">
              <p className="text-xs text-[#9AA4B2]">Total study time</p>
              <p className="text-lg font-bold text-white mt-1">{totalMin} min</p>
            </div>
            <div className="rounded-xl border border-white/[0.10] p-4">
              <p className="text-xs text-[#9AA4B2]">Sessions</p>
              <p className="text-lg font-bold text-white mt-1">{sessions.length}</p>
            </div>
          </div>
          <p className="text-xs text-[#9AA4B2]">
            {bestTopic ? `Your strongest area so far: ${bestTopic}.` : 'Take a quiz to discover your strongest areas.'}
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 15. Study Goals                                                     */
/* ------------------------------------------------------------------ */

function GoalsTool({ onToast }) {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { setPlans(await fetchStudyPlans()); } catch (e) { setError(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (p) => {
    try {
      await updateStudyPlan(p.id, { status: p.status === 'completed' ? 'active' : 'completed' });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const active = plans.filter((p) => p.status !== 'completed');
  const completed = plans.filter((p) => p.status === 'completed');
  const upcoming = active
    .filter((p) => p.target_date)
    .sort((a, b) => String(a.target_date).localeCompare(String(b.target_date)));

  return (
    <div className="space-y-6">
      <ErrorNote message={error} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Active goals</p>
          <p className="text-2xl font-bold text-[#16C784] mt-1">{active.length}</p>
        </div>
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">Completed</p>
          <p className="text-2xl font-bold text-white mt-1">{completed.length}</p>
        </div>
        <div className="v-card p-5">
          <p className="text-xs text-[#9AA4B2]">With target date</p>
          <p className="text-2xl font-bold text-white mt-1">{upcoming.length}</p>
        </div>
      </div>

      <SectionCard title="Upcoming goals" subtitle="Active plans sorted by target date">
        {upcoming.length === 0 ? (
          <EmptyState icon={Target} title="No dated goals" desc="Create a study plan with a target date from the Study Planner." />
        ) : (
          <ul className="space-y-2">
            {upcoming.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.10] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{p.title}</p>
                  <p className="text-xs text-[#9AA4B2]">Target: {p.target_date} · {p.plan_type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="green">{p.status}</Badge>
                  <button onClick={() => toggle(p)} className="v-btn-secondary">Complete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Completed goals" subtitle="Milestones achieved">
        {completed.length === 0 ? (
          <p className="text-sm text-[#5A6472]">Nothing completed yet — your achievements will appear here.</p>
        ) : (
          <ul className="space-y-2">
            {completed.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#16C784]/20 bg-[#16C784]/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} style={{ color: GREEN }} />
                  <span className="text-sm font-semibold text-white">{p.title}</span>
                </div>
                <button onClick={() => toggle(p)} className="v-btn-secondary">Reopen</button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
      <p className="text-xs text-[#5A6472]">
        Want more goals? Use the <span className="text-[#16C784] font-semibold">Study Planner</span> tool to create new plans with target dates.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

const TOOL_RENDERERS = {
  flashcards: FlashcardsTool,
  quiz: QuizTool,
  planner: PlannerTool,
  progress: ProgressTool,
  exam: ExamTool,
  ias: (props) => <SubjectHubTool subject="IAS" {...props} />,
  ifrs: (props) => <SubjectHubTool subject="IFRS" {...props} />,
  finance: (props) => <SubjectHubTool subject="Finance" {...props} />,
  tutor: AiTutorTool,
  notes: NotesTool,
  sessions: SessionsTool,
  reading: ReadingTool,
  resources: ResourcesTool,
  insights: InsightsTool,
  goals: GoalsTool,
};

export default function StudyToolsPage() {
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const tool = TOOLS.find((t) => t.id === selected);
  const Render = selected ? TOOL_RENDERERS[selected] : null;
  const onToast = (message) => toast.success(message);

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-5">
          <Badge variant="green">15-TOOL STUDY SUITE</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white max-w-3xl">
            One workspace for everything you need to study accounting
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2] max-w-2xl">
            From flashcards and timed exams to the AI Accounting Tutor — pick a tool below and dive in. All your progress is saved automatically.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="v-container">
          {selected ? (
            <div className="space-y-5">
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-[#9AA4B2] hover:text-white flex items-center gap-1"
              >
                <ArrowLeft size={15} /> All 15 tools
              </button>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#16C784]/10 border border-[#16C784]/30">
                  {tool && <tool.icon size={20} style={{ color: GREEN }} />}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">{tool?.name}</h2>
                  <p className="text-xs text-[#9AA4B2]">{tool?.desc}</p>
                </div>
              </div>
              <Render onToast={onToast} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t.id)}
                    className="v-card-hover p-5 text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#16C784]/10 border border-[#16C784]/30">
                        <t.icon size={20} style={{ color: GREEN }} />
                      </span>
                      <ChevronRight size={16} className="text-[#5A6472]" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{t.name}</h3>
                    <p className="text-xs text-[#9AA4B2] mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
              <div className="mt-10 v-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Flame size={20} style={{ color: '#16C784' }} />
                  <p className="text-sm text-[#C6CDD6]">
                    <span className="font-semibold text-white">Tip:</span> Log daily revision sessions and take a quiz every day to build a strong study streak.
                  </p>
                </div>
                <Link to="/study-materials" className="v-btn-secondary whitespace-nowrap">
                  Browse study materials <ChevronRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
