-- Phase 7: 15-Tool Study Suite + Server AI Tutor
-- Spec: SCHEMA_OVERVIEW.md v03_payments_store_tutors_and_study_tools (Tables 27-49)
-- Tables: study_plans, syllabus_progress, study_sessions_log, student_notes,
--         flashcard_decks, practice_quiz_attempts, ai_tutor_conversations, ai_tutor_messages
-- ai_tutor_conversations/ai_tutor_messages were deployed earlier in Phase 7.

-- ---------------------------------------------------------------------------
-- 1. study_plans
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_plans (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  title         text NOT NULL,
  plan_type     text NOT NULL DEFAULT 'general',
  status        text NOT NULL DEFAULT 'active',
  start_date    date,
  target_date   date,
  description   text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY study_plans_select_own ON public.study_plans
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY study_plans_insert_own ON public.study_plans
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY study_plans_update_own ON public.study_plans
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY study_plans_delete_own ON public.study_plans
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 2. syllabus_progress
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.syllabus_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  topic_name    text NOT NULL,
  chapter_name  text,
  status        text NOT NULL DEFAULT 'not_started',
  completed_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY syllabus_progress_select_own ON public.syllabus_progress
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY syllabus_progress_insert_own ON public.syllabus_progress
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY syllabus_progress_update_own ON public.syllabus_progress
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY syllabus_progress_delete_own ON public.syllabus_progress
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 3. study_sessions_log
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_sessions_log (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id         uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  subject           text,
  duration_minutes  integer NOT NULL DEFAULT 0,
  session_date      date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY study_sessions_log_select_own ON public.study_sessions_log
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY study_sessions_log_insert_own ON public.study_sessions_log
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY study_sessions_log_update_own ON public.study_sessions_log
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY study_sessions_log_delete_own ON public.study_sessions_log
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 4. student_notes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_notes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  title         text NOT NULL,
  content       text NOT NULL,
  is_pinned     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY student_notes_select_own ON public.student_notes
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY student_notes_insert_own ON public.student_notes
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY student_notes_update_own ON public.student_notes
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY student_notes_delete_own ON public.student_notes
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 5. flashcard_decks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  deck_title    text NOT NULL,
  description   text,
  cards         jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY flashcard_decks_select_own ON public.flashcard_decks
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY flashcard_decks_insert_own ON public.flashcard_decks
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY flashcard_decks_update_own ON public.flashcard_decks
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY flashcard_decks_delete_own ON public.flashcard_decks
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 6. practice_quiz_attempts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.practice_quiz_attempts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id           uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  quiz_topic          text NOT NULL,
  questions_total     integer NOT NULL DEFAULT 0,
  questions_correct   integer NOT NULL DEFAULT 0,
  score_percentage    numeric(5,2) NOT NULL DEFAULT 0,
  time_taken_seconds  integer,
  is_exam_mode        boolean NOT NULL DEFAULT false,
  feedback            text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY practice_quiz_attempts_select_own ON public.practice_quiz_attempts
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY practice_quiz_attempts_insert_own ON public.practice_quiz_attempts
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY practice_quiz_attempts_update_own ON public.practice_quiz_attempts
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY practice_quiz_attempts_delete_own ON public.practice_quiz_attempts
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
