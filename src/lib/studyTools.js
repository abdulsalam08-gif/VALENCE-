/**
 * VALENCE 15-Tool Study Suite + AI Accounting Tutor (Phase 7)
 *
 * Client helpers for the 15 study tools:
 *   1. Flashcards, 2. Quiz Generator, 3. Study Planner, 4. Progress Tracker,
 *   5. Exam Mode, 6. IAS, 7. IFRS, 8. Finance, 9. AI Accounting Tutor,
 *   10. Student Notes, 11. Revision Sessions, 12. Reading Progress,
 *   13. Learning Resources, 14. Performance Insights, 15. Study Goals.
 *
 * The AI Accounting Tutor uses the two-phase chat_ai_tutor RPC: the first call
 * schedules the OpenAI job and returns status 'processing'; the client retries
 * with the conversation_id until the assistant reply is written server-side.
 * Ownership is enforced by RLS; the RPC enforces the daily quota.
 */

import { supabase } from './supabase';

/** Resolve the current user's profile id (profiles.id) for profile-scoped writes. */
async function getProfileId() {
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData?.session?.user?.id;
  if (!uid) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();
  return profile?.id || null;
}

/* ---------------- AI Accounting Tutor ---------------- */

/**
 * Send a message to the AI Accounting Tutor. Handles the two-phase RPC:
 * first call schedules the job, then retries (with conversation_id) until
 * the assistant reply is ready. Returns the final message payload or an
 * error payload (quota / credits / empty response).
 */
export async function sendAiTutorMessage(message, { conversationId = null, onStatus } = {}) {
  if (!supabase) return { error: 'Supabase is not configured.' };
  let activeConversation = conversationId;
  let attempts = 0;

  while (attempts < 10) {
    attempts += 1;
    const { data, error } = await supabase.rpc('chat_ai_tutor', {
      p_message: message,
      p_conversation_id: activeConversation,
    });
    if (error) throw new Error(error.message || 'Unable to reach the AI tutor.');
    if (data?.status === 'processing') {
      activeConversation = data.conversation_id;
      onStatus?.('processing', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      continue;
    }
    if (data?.error) return { error: data.error, quota_used: data.quota_used, quota_limit: data.quota_limit };
    return { conversationId: data.conversation_id, messageId: data.message_id, content: data.content, steps: data.steps, usage: data.usage, quota_used: data.quota_used, quota_limit: data.quota_limit };
  }
  return { error: 'The AI tutor is taking longer than expected. Please try again in a moment.' };
}

/** The caller's AI tutor conversations (most recent first). */
export async function fetchAiTutorConversations() {
  const { data, error } = await supabase.rpc('list_ai_tutor_conversations');
  if (error) throw new Error(error.message || 'Unable to load tutor conversations.');
  if (Array.isArray(data)) return data;
  if (data?.error) throw new Error(data.error);
  return [];
}

/** Messages of one conversation (user + assistant). */
export async function fetchAiTutorMessages(conversationId) {
  const { data, error } = await supabase
    .from('ai_tutor_messages')
    .select('id, role, content, steps, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message || 'Unable to load tutor messages.');
  return data || [];
}

/* ---------------- Study Plans (Tool 3 + goals, Tool 15) ---------------- */

export async function fetchStudyPlans() {
  const { data, error } = await supabase
    .from('study_plans')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message || 'Unable to load study plans.');
  return data || [];
}

export async function createStudyPlan({ title, courseId = null, planType = 'general', targetDate = null, description = '' }) {
  const profileId = await getProfileId();
  const { data, error } = await supabase
    .from('study_plans')
    .insert({ profile_id: profileId, title, course_id: courseId, plan_type: planType, target_date: targetDate, description })
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to create the study plan.');
  return data;
}

export async function updateStudyPlan(planId, patch) {
  const { data, error } = await supabase
    .from('study_plans')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', planId)
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to update the study plan.');
  return data;
}

export async function deleteStudyPlan(planId) {
  const { error } = await supabase.from('study_plans').delete().eq('id', planId);
  if (error) throw new Error(error.message || 'Unable to delete the study plan.');
}

/* ---------------- Syllabus Progress (Tool 4 + subject hubs) ---------------- */

export async function fetchSyllabusProgress() {
  const { data, error } = await supabase
    .from('syllabus_progress')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message || 'Unable to load syllabus progress.');
  return data || [];
}

export async function createSyllabusProgress({ topicName, courseId = null, chapterName = '' }) {
  const profileId = await getProfileId();
  const { data, error } = await supabase
    .from('syllabus_progress')
    .insert({ profile_id: profileId, topic_name: topicName, course_id: courseId, chapter_name: chapterName })
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to add the syllabus topic.');
  return data;
}

export async function setSyllabusProgress(entryId, status) {
  const patch =
    status === 'completed'
      ? { status, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      : { status, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('syllabus_progress')
    .update(patch)
    .eq('id', entryId)
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to update progress.');
  return data;
}

/* ---------------- Study Sessions / Revision Sessions (Tool 11) ---------------- */

export async function fetchStudySessionsLog(limit = 20) {
  const { data, error } = await supabase
    .from('study_sessions_log')
    .select('*')
    .order('session_date', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message || 'Unable to load revision sessions.');
  return data || [];
}

export async function logStudySession({ subject = '', durationMinutes = 30, sessionDate = null, notes = '' }) {
  const profileId = await getProfileId();
  const { data, error } = await supabase
    .from('study_sessions_log')
    .insert({ profile_id: profileId, subject, duration_minutes: durationMinutes, session_date: sessionDate, notes })
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to log the session.');
  return data;
}

export async function deleteStudySession(sessionId) {
  const { error } = await supabase.from('study_sessions_log').delete().eq('id', sessionId);
  if (error) throw new Error(error.message || 'Unable to delete the session.');
}

/* ---------------- Student Notes (Tool 10) ---------------- */

export async function fetchStudentNotes() {
  const { data, error } = await supabase
    .from('student_notes')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message || 'Unable to load notes.');
  return data || [];
}

export async function createStudentNote({ title, content, courseId = null }) {
  const profileId = await getProfileId();
  const { data, error } = await supabase
    .from('student_notes')
    .insert({ profile_id: profileId, title, content, course_id: courseId })
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to save the note.');
  return data;
}

export async function updateStudentNote(noteId, patch) {
  const { data, error } = await supabase
    .from('student_notes')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', noteId)
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to update the note.');
  return data;
}

export async function deleteStudentNote(noteId) {
  const { error } = await supabase.from('student_notes').delete().eq('id', noteId);
  if (error) throw new Error(error.message || 'Unable to delete the note.');
}

/* ---------------- Flashcards (Tool 1) ---------------- */

export async function fetchFlashcardDecks() {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message || 'Unable to load flashcard decks.');
  return data || [];
}

export async function createFlashcardDeck({ deckTitle, description = '', cards = [], courseId = null }) {
  const profileId = await getProfileId();
  const { data, error } = await supabase
    .from('flashcard_decks')
    .insert({ profile_id: profileId, deck_title: deckTitle, description, cards, course_id: courseId })
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to create the deck.');
  return data;
}

export async function updateFlashcardDeck(deckId, patch) {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', deckId)
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to update the deck.');
  return data;
}

export async function deleteFlashcardDeck(deckId) {
  const { error } = await supabase.from('flashcard_decks').delete().eq('id', deckId);
  if (error) throw new Error(error.message || 'Unable to delete the deck.');
}

/* ---------------- Reading Progress (Tool 12) ---------------- */

export async function fetchReadingProgress() {
  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message || 'Unable to load reading progress.');
  return data || [];
}

export async function createReadingProgress({ topicName, chapterName = '', courseId = null }) {
  const profileId = await getProfileId();
  const { data, error } = await supabase
    .from('reading_progress')
    .insert({ profile_id: profileId, topic_name: topicName, chapter_name: chapterName, course_id: courseId })
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to add the reading topic.');
  return data;
}

export async function setReadingProgress(entryId, status) {
  const patch =
    status === 'completed'
      ? { status, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      : { status, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('reading_progress')
    .update(patch)
    .eq('id', entryId)
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to update reading progress.');
  return data;
}

/* ---------------- Learning Resources (Tool 13) ---------------- */

export async function fetchLearningResources() {
  const { data, error } = await supabase
    .from('learning_resources')
    .select('id, title, resource_type, course_id, file_url, access_permission, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message || 'Unable to load learning resources.');
  return data || [];
}

/* ---------------- Practice Quiz / Exam Mode (Tools 2 + 5 + 14) ---------------- */

/** Record a completed quiz or exam attempt. */
export async function recordQuizAttempt({
  quizTopic,
  questionsTotal,
  questionsCorrect,
  timeTakenSeconds = null,
  isExamMode = false,
  feedback = '',
  courseId = null,
}) {
  const score = questionsTotal > 0 ? Math.round((questionsCorrect / questionsTotal) * 10000) / 100 : 0;
  const profileId = await getProfileId();
  const { data, error } = await supabase
    .from('practice_quiz_attempts')
    .insert({
      profile_id: profileId,
      quiz_topic: quizTopic,
      questions_total: questionsTotal,
      questions_correct: questionsCorrect,
      score_percentage: score,
      time_taken_seconds: timeTakenSeconds,
      is_exam_mode: isExamMode,
      feedback,
      course_id: courseId,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message || 'Unable to save the attempt.');
  return data;
}

/** Attempt history for performance insights. */
export async function fetchQuizAttempts() {
  const { data, error } = await supabase
    .from('practice_quiz_attempts')
    .select('id, quiz_topic, questions_total, questions_correct, score_percentage, time_taken_seconds, is_exam_mode, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message || 'Unable to load attempt history.');
  return data || [];
}

/** Remove an attempt (own records only). */
export async function deleteQuizAttempt(attemptId) {
  const { error } = await supabase.from('practice_quiz_attempts').delete().eq('id', attemptId);
  if (error) throw new Error(error.message || 'Unable to delete the attempt.');
}

/* ---------------- Seed question bank (Quiz Generator + Exam Mode) ---------------- */

export const PRACTICE_QUESTION_BANK = [
  { topic: 'Double-entry bookkeeping', question: 'In double-entry bookkeeping, what does the accounting equation state?', options: ['Assets = Liabilities + Equity', 'Assets = Liabilities − Equity', 'Revenue = Expenses + Capital', 'Assets + Liabilities = Equity'], answer: 0, explanation: 'The accounting equation is Assets = Liabilities + Owner’s Equity. Every transaction keeps it in balance.' },
  { topic: 'Double-entry bookkeeping', question: 'A sale of goods on credit is recorded in which two accounts?', options: ['Sales account (debit) and Cash account (credit)', 'Sales account (credit) and Accounts Receivable account (debit)', 'Sales account (debit) and Accounts Payable account (credit)', 'Cash account (debit) and Sales account (credit)'], answer: 1, explanation: 'Credit sales increase the sales account (credit) and increase the customer’s receivable balance (debit).' },
  { topic: 'Bank reconciliation', question: 'What is a bank reconciliation statement?', options: ['A statement reconciling the cash book and the bank statement', 'A document recording bank charges only', 'A report of outstanding loans', 'A record of customer payments'], answer: 0, explanation: 'A bank reconciliation reconciles the difference between the cash book balance and the bank statement balance.' },
  { topic: 'Bank reconciliation', question: 'Which item appears on the bank statement but not the cash book (causing an overdraft difference)?', options: ['Standing orders', 'Standing orders and bank charges', 'Dishonoured cheques', 'Sales on credit'], answer: 1, explanation: 'Standing orders and bank charges are recorded by the bank and must be entered in the cash book.' },
  { topic: 'Depreciation', question: 'Which depreciation method charges a fixed amount per period?', options: ['Straight-line method', 'Diminishing balance method', 'Units-of-production method', 'Revaluation method'], answer: 0, explanation: 'The straight-line method charges an equal depreciation amount each period over the asset’s useful life.' },
  { topic: 'Depreciation', question: 'The reducing (diminishing) balance method calculates depreciation on:', options: ['The original cost each year', 'The net book value each year', 'The residual value only', 'The market value each year'], answer: 1, explanation: 'Reducing balance applies a fixed percentage to the net book value, so depreciation declines each year.' },
  { topic: 'Inventory', question: 'Which inventory valuation method assumes the oldest items are sold first?', options: ['FIFO', 'LIFO', 'Weighted average', 'Specific identification'], answer: 0, explanation: 'FIFO (First-In-First-Out) assumes the oldest inventory is sold first, matching current costs to revenue.' },
  { topic: 'Inventory', question: 'The closing stock appears in the statement of financial position as:', options: ['A current asset', 'A current liability', 'Revenue', 'An expense'], answer: 0, explanation: 'Closing stock is a current asset, valued at the lower of cost and net realisable value.' },
  { topic: 'Payroll', question: 'Gross pay minus statutory deductions equals:', options: ['Net pay', 'Gross pay', 'Total deductions', 'Overtime pay'], answer: 0, explanation: 'Net (take-home) pay is gross pay minus all statutory and authorized deductions.' },
  { topic: 'Payroll', question: 'PAYE is an abbreviation for:', options: ['Pay As You Earn', 'Personal Allowance Yield Estimate', 'Payroll Annual Yield Estimate', 'Personnel Accounting Year End'], answer: 0, explanation: 'PAYE (Pay As You Earn) is the system of deducting income tax from earnings at source.' },
  { topic: 'VAT', question: 'VAT is ultimately borne by:', options: ['The final consumer', 'The business registering for VAT', 'The tax authority', 'The supplier’s bank'], answer: 0, explanation: 'VAT is a consumption tax — the final consumer bears the tax even though businesses collect and remit it.' },
  { topic: 'VAT', question: 'For a VAT-registered business, input VAT is:', options: ['VAT paid on purchases, recoverable from the tax authority', 'VAT charged on sales', 'A penalty for late filing', 'VAT on fixed assets only'], answer: 0, explanation: 'Input VAT on business purchases is recoverable, while output VAT on sales is remitted to the tax authority.' },
  { topic: 'Final accounts', question: 'Where is gross profit presented in a trading account?', options: ['As the difference between sales and cost of goods sold', 'As sales plus returns', 'As operating expenses', 'As capital introduced'], answer: 0, explanation: 'Gross profit = Sales − Cost of Goods Sold, and is carried down in the trading account.' },
  { topic: 'Final accounts', question: 'The balance of the profit and loss account is transferred to:', options: ['The statement of financial position', 'The bank account', 'The sales account', 'The cash book'], answer: 0, explanation: 'Net profit from the profit and loss account is transferred to capital in the statement of financial position.' },
  { topic: 'Control accounts', question: 'A control account is maintained for:', options: ['A group of individual ledger accounts (e.g. trade receivables)', 'The bank account only', 'Cash only', 'Fixed assets only'], answer: 0, explanation: 'Control accounts summarize a subsidiary ledger (e.g. the trade receivables control account) and must agree with the individual balances.' },
  { topic: 'Errors', question: 'An error of omission is one where:', options: ['A transaction is completely left out of the books', 'The wrong account is debited', 'The amounts are transposed', 'Both debit and credit are overcast'], answer: 0, explanation: 'Errors of omission occur when a transaction is not recorded at all — they do not affect the trial balance.' },
  { topic: 'Errors', question: 'Which error will NOT be detected by a trial balance?', options: ['Error of omission', 'Error of commission (wrong amount, same side)', 'Compensating error', 'All of these'], answer: 3, explanation: 'Errors of omission, commission, compensation and principle all leave the trial balance in balance.' },
  { topic: 'IFRS', question: 'Under IFRS, which basis of preparation is generally required?', options: ['Accrual basis', 'Cash basis', 'Modified cash basis', 'Tax basis'], answer: 0, explanation: 'IFRS requires financial statements to be prepared on the accrual basis, except for certain cash-flow disclosures.' },
  { topic: 'IFRS', question: 'IFRS 15 governs revenue from contracts with customers and requires recognition when:', options: ['Performance obligations are satisfied', 'Cash is received', 'The invoice is issued', 'The order is placed'], answer: 0, explanation: 'IFRS 15 recognizes revenue as performance obligations are satisfied, following the five-step model.' },
  { topic: 'IAS', question: 'IAS 1 governs:', options: ['The presentation of financial statements', 'Inventory valuation', 'Payroll tax', 'Bank reconciliation'], answer: 0, explanation: 'IAS 1 sets out the structure and presentation requirements for general purpose financial statements.' },
];

/** Pick `count` random unique questions for a quiz. */
export function pickQuizQuestions(topic = 'All topics', count = 5) {
  const pool =
    topic && topic !== 'All topics'
      ? PRACTICE_QUESTION_BANK.filter((q) => q.topic.toLowerCase() === topic.toLowerCase())
      : [...PRACTICE_QUESTION_BANK];
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
