-- Phase 13 — VALENCE National Inter-School Challenge (Competition system)
-- School registration, 6 divisions, configurable ATSWA & ICAN timed exams,
-- auto + human rubric grading, 6 leaderboards, Monthly League, 1v1/2v2 Arena,
-- certificates, appeals, Hall of Fame & audited ₦220,000 podium disbursement
-- (₦100,000 / ₦70,000 / ₦50,000), Top VALENCE Students school-profile display,
-- and the strictly-4-competitors-per-school cap.
--
-- Core tables (competitions, competition_categories, competition_teams,
-- competition_registrations, competition_rounds, competition_questions,
-- competition_options, competition_attempts, competition_answers,
-- competition_results, competition_leaderboards, competition_certificates,
-- competition_appeals, competition_marking_rubrics, competition_marks,
-- competition_markers, competition_subjects, competition_question_banks,
-- competition_awards, competition_audit_logs, competition_team_members) already
-- exist from Phase 2. This migration adds the podium reward system + arena +
-- hall of fame + school registration, seeds the flagship edition, and adds the
-- two enforcement/sync triggers.

-- 1) Podium prize configuration in platform_settings (key-value).
INSERT INTO public.platform_settings (setting_key, setting_value, description)
VALUES
  ('competition_first_prize', '100000'::jsonb, 'VALENCE National Inter-School Challenge 1st-place prize (₦)'),
  ('competition_second_prize', '70000'::jsonb, 'VALENCE National Inter-School Challenge 2nd-place prize (₦)'),
  ('competition_third_prize', '50000'::jsonb, 'VALENCE National Inter-School Challenge 3rd-place prize (₦)'),
  ('competition_max_competitors_per_school', '4'::jsonb, 'Strictly 4 competitors per school per competition')
ON CONFLICT (setting_key) DO NOTHING;

-- 2) competition_schools — school registration per competition.
CREATE TABLE IF NOT EXISTS public.competition_schools (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id  uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    institution_id  uuid NOT NULL REFERENCES public.institutions(id),
    registered_by   uuid,
    status          text NOT NULL DEFAULT 'registered',
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (competition_id, institution_id)
);

-- 3) competition_rewards — audited podium payout ledger.
CREATE TABLE IF NOT EXISTS public.competition_rewards (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id  uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    profile_id      uuid NOT NULL REFERENCES public.profiles(id),
    institution_id  uuid REFERENCES public.institutions(id),
    placement_rank  integer NOT NULL CHECK (placement_rank IN (1, 2, 3)),
    prize_amount_ngn integer NOT NULL,
    status          text NOT NULL DEFAULT 'pending',   -- pending | disbursed
    disbursed_at    timestamptz,
    audited_by      uuid,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (competition_id, placement_rank)
);

-- 4) arena_matches — 1v1 / 2v2 Arena.
CREATE TABLE IF NOT EXISTS public.arena_matches (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id  uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    team_a_id       uuid NOT NULL REFERENCES public.competition_teams(id) ON DELETE CASCADE,
    team_b_id       uuid NOT NULL REFERENCES public.competition_teams(id) ON DELETE CASCADE,
    match_format    text NOT NULL DEFAULT '1v1',   -- 1v1 | 2v2
    status          text NOT NULL DEFAULT 'scheduled',  -- scheduled | in_progress | completed
    winner_team_id  uuid REFERENCES public.competition_teams(id) ON DELETE SET NULL,
    scheduled_at    timestamptz,
    played_at       timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- 5) hall_of_fame_entries.
CREATE TABLE IF NOT EXISTS public.hall_of_fame_entries (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id  uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    profile_id      uuid NOT NULL REFERENCES public.profiles(id),
    institution_id  uuid REFERENCES public.institutions(id),
    placement_rank  integer NOT NULL,
    badge_label     text NOT NULL DEFAULT 'Hall of Fame',
    year            text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- 6) school_top_valence_students — Top VALENCE Students on school profiles.
CREATE TABLE IF NOT EXISTS public.school_top_valence_students (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    winner_user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id  uuid NOT NULL REFERENCES public.institutions(id),
    competition_id  uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    reward_id       uuid REFERENCES public.competition_rewards(id) ON DELETE SET NULL,
    placement_rank  integer NOT NULL,
    prize_amount_ngn integer NOT NULL,
    badge_label     text NOT NULL DEFAULT 'Top VALENCE Student',
    profile_spotlight boolean NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (reward_id)
);

-- 7) Strictly-4-competitors-per-school cap (BEFORE INSERT OR UPDATE on registrations).
CREATE OR REPLACE FUNCTION public.fn_enforce_max_competitors_per_school()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_team record;
  v_count int;
  v_max int;
BEGIN
  SELECT * INTO v_team FROM public.competition_teams WHERE id = NEW.team_id;
  IF v_team IS NULL THEN
    RAISE EXCEPTION 'Team not found for registration.';
  END IF;
  SELECT setting_value::int INTO v_max FROM public.platform_settings WHERE setting_key = 'competition_max_competitors_per_school';
  IF v_max IS NULL THEN v_max := 4; END IF;
  SELECT count(*) INTO v_count
  FROM public.competition_registrations r
  JOIN public.competition_teams t ON t.id = r.team_id
  WHERE r.competition_id = NEW.competition_id
    AND t.institution_id = v_team.institution_id
    AND r.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND r.status <> 'disqualified';
  IF v_count >= v_max THEN
    RAISE EXCEPTION 'A school may register at most % competitors per competition (strictly 4).', v_max;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_enforce_max_competitors ON public.competition_registrations;
CREATE TRIGGER trg_enforce_max_competitors
    BEFORE INSERT OR UPDATE ON public.competition_registrations
    FOR EACH ROW EXECUTE FUNCTION public.fn_enforce_max_competitors_per_school();

-- 8) Sync Top VALENCE Students on school profiles (AFTER INSERT OR UPDATE on rewards).
CREATE OR REPLACE FUNCTION public.fn_sync_school_top_valence_students()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT user_id INTO v_user_id FROM public.profiles WHERE id = NEW.profile_id;
  INSERT INTO public.school_top_valence_students
      (winner_user_id, institution_id, competition_id, reward_id, placement_rank, prize_amount_ngn, badge_label)
  VALUES
      (v_user_id, NEW.institution_id, NEW.competition_id, NEW.id, NEW.placement_rank, NEW.prize_amount_ngn, 'Top VALENCE Student')
  ON CONFLICT (reward_id) DO UPDATE SET
      placement_rank = EXCLUDED.placement_rank,
      prize_amount_ngn = EXCLUDED.prize_amount_ngn,
      badge_label = EXCLUDED.badge_label,
      profile_spotlight = true;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_sync_school_top_students ON public.competition_rewards;
CREATE TRIGGER trg_sync_school_top_students
    AFTER INSERT OR UPDATE ON public.competition_rewards
    FOR EACH ROW EXECUTE FUNCTION public.fn_sync_school_top_valence_students();

-- 9) RLS on the new tables.
ALTER TABLE public.competition_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_of_fame_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_top_valence_students ENABLE ROW LEVEL SECURITY;

-- Read: any authenticated user. Write: admins only.
DROP POLICY IF EXISTS p_competition_schools_select ON public.competition_schools;
CREATE POLICY p_competition_schools_select ON public.competition_schools
    FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS p_competition_schools_admin ON public.competition_schools
    FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS p_arena_matches_select ON public.arena_matches;
CREATE POLICY p_arena_matches_select ON public.arena_matches
    FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS p_arena_matches_admin ON public.arena_matches
    FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS p_hof_select ON public.hall_of_fame_entries;
CREATE POLICY p_hof_select ON public.hall_of_fame_entries
    FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS p_hof_admin ON public.hall_of_fame_entries
    FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS p_topval_select ON public.school_top_valence_students;
CREATE POLICY p_topval_select ON public.school_top_valence_students
    FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS p_topval_admin ON public.school_top_valence_students
    FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

-- Rewards: readable by admins and by the winner personally; admin-writable.
DROP POLICY IF EXISTS p_rewards_select ON public.competition_rewards;
CREATE POLICY p_rewards_select ON public.competition_rewards
    FOR SELECT TO authenticated
    USING (is_admin_user() OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = competition_rewards.profile_id AND p.user_id = auth.uid()));
DROP POLICY IF EXISTS p_rewards_admin ON public.competition_rewards
    FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

-- Admin read coverage: appeals and full (incl. unverified) leaderboards,
-- needed by the Admin Portal competition console (direct table reads).
DROP POLICY IF EXISTS p_appeals_admin_select ON public.competition_appeals;
CREATE POLICY p_appeals_admin_select ON public.competition_appeals
    FOR SELECT TO authenticated USING (is_admin_user());
DROP POLICY IF EXISTS p_leaderboards_admin_select ON public.competition_leaderboards;
CREATE POLICY p_leaderboards_admin_select ON public.competition_leaderboards
    FOR SELECT TO authenticated USING (is_admin_user());

-- 9a) competition_registrations gets updated_at (the shared BEFORE UPDATE
--      trigger trg_competition_registrations_updated -> update_updated_at()
--      requires the column to exist).
ALTER TABLE public.competition_registrations ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- 9b) Seed: 6 divisions, flagship 2027 competition, 5 rounds, sample MCQ
--     questions. (Seeded via separate execute_query calls below.)

-- 10) Competition RPCs (SECURITY DEFINER, all params explicit).

-- 10a) Competition CRUD + read.
CREATE OR REPLACE FUNCTION public.manage_competition(
    p_competition_id uuid DEFAULT NULL,
    p_name text DEFAULT NULL,
    p_description text DEFAULT NULL,
    p_division text DEFAULT NULL,
    p_status text DEFAULT NULL,
    p_duration_minutes integer DEFAULT NULL,
    p_registration_closes timestamptz DEFAULT NULL,
    p_exam_starts timestamptz DEFAULT NULL,
    p_exam_ends timestamptz DEFAULT NULL
) RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  IF p_competition_id IS NOT NULL THEN
    UPDATE public.competitions c
    SET name = COALESCE(p_name, c.name),
        description = COALESCE(p_description, c.description),
        division = COALESCE(p_division, c.division),
        status = COALESCE(p_status, c.status),
        duration_minutes = COALESCE(p_duration_minutes, c.duration_minutes),
        registration_closes = COALESCE(p_registration_closes, c.registration_closes),
        exam_starts = COALESCE(p_exam_starts, c.exam_starts),
        exam_ends = COALESCE(p_exam_ends, c.exam_ends)
    WHERE c.id = p_competition_id
    RETURNING id INTO v_id;
  ELSE
    INSERT INTO public.competitions (name, description, division, status, duration_minutes, registration_closes, exam_starts, exam_ends, created_by)
    VALUES (p_name, p_description, p_division, COALESCE(p_status, 'draft'), COALESCE(p_duration_minutes, 60), p_registration_closes, p_exam_starts, p_exam_ends,
      (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1))
    RETURNING id INTO v_id;
  END IF;
  RETURN jsonb_build_object('status', 'ok', 'competition_id', v_id, 'message', 'Competition saved');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_competitions(p_limit int DEFAULT 50, p_offset int DEFAULT 0)
RETURNS TABLE(competition_id uuid, name text, division text, status text, description text,
              registration_opens timestamptz, registration_closes timestamptz, exam_starts timestamptz,
              exam_ends timestamptz, duration_minutes int, teams_count int, competitors_count int)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT c.id, c.name, c.division, c.status, c.description, c.registration_opens, c.registration_closes,
         c.exam_starts, c.exam_ends, c.duration_minutes,
         (SELECT count(*)::int FROM public.competition_teams t WHERE t.competition_id = c.id),
         (SELECT count(*)::int FROM public.competition_registrations r WHERE r.competition_id = c.id AND r.status = 'registered')
  FROM public.competitions c
  ORDER BY c.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_competition_details(p_competition_id uuid)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_build_object(
    'competition', (SELECT row_to_json(c) FROM public.competitions c WHERE c.id = p_competition_id),
    'divisions', (SELECT jsonb_agg(row_to_json(d) ORDER BY d.name) FROM public.competition_categories d WHERE d.competition_id = p_competition_id),
    'rounds', (SELECT jsonb_agg(row_to_json(r) ORDER BY r.round_number) FROM public.competition_rounds r WHERE r.competition_id = p_competition_id),
    'subjects', (SELECT jsonb_agg(row_to_json(s) ORDER BY s.name) FROM public.competition_subjects s WHERE s.competition_id = p_competition_id),
    'schools', (SELECT jsonb_agg(jsonb_build_object('id', cs.id, 'institution_id', cs.institution_id, 'institution_name', i.name, 'status', cs.status, 'registered_at', cs.created_at))
                FROM public.competition_schools cs JOIN public.institutions i ON i.id = cs.institution_id
                WHERE cs.competition_id = p_competition_id),
    'teams', (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'team_name', t.team_name, 'institution_name', i.name, 'competition_category', t.competition_category, 'registered_level', t.registered_level, 'status', t.status))
              FROM public.competition_teams t JOIN public.institutions i ON i.id = t.institution_id
              WHERE t.competition_id = p_competition_id),
    'prizes', (SELECT jsonb_build_object(
      'first', (SELECT setting_value::int FROM public.platform_settings WHERE setting_key = 'competition_first_prize'),
      'second', (SELECT setting_value::int FROM public.platform_settings WHERE setting_key = 'competition_second_prize'),
      'third', (SELECT setting_value::int FROM public.platform_settings WHERE setting_key = 'competition_third_prize')))
  );
$function$;

-- 10b) School registration + teams + competitor registration.
CREATE OR REPLACE FUNCTION public.register_school_competition(p_competition_id uuid, p_institution_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
  v_actor uuid;
BEGIN
  INSERT INTO public.competition_schools (competition_id, institution_id, registered_by)
  VALUES (p_competition_id, p_institution_id,
          (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1))
  ON CONFLICT (competition_id, institution_id) DO UPDATE SET status = 'registered'
  RETURNING id INTO v_id;
  v_actor := (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1);
  INSERT INTO public.competition_audit_logs (competition_id, actor_profile_id, action, details)
  VALUES (p_competition_id, v_actor, 'school_registered', jsonb_build_object('institution_id', p_institution_id));
  RETURN jsonb_build_object('status', 'ok', 'school_id', v_id, 'message', 'School registered for competition');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_competition_team(
    p_competition_id uuid, p_institution_id uuid, p_team_name text,
    p_competition_category text, p_registered_level text,
    p_team_captain_profile_id uuid DEFAULT NULL,
    p_assistant_captain_profile_id uuid DEFAULT NULL,
    p_school_representative_profile_id uuid DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.competition_teams
      (competition_id, institution_id, team_name, team_captain_profile_id, assistant_captain_profile_id,
       school_representative_profile_id, competition_category, registered_level, status)
  VALUES (p_competition_id, p_institution_id, p_team_name, p_team_captain_profile_id,
          p_assistant_captain_profile_id, p_school_representative_profile_id,
          p_competition_category, p_registered_level, 'registered')
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('status', 'ok', 'team_id', v_id, 'message', 'Team created');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.register_competitant(p_competition_id uuid, p_team_id uuid, p_profile_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_reg_id uuid;
BEGIN
  INSERT INTO public.competition_registrations (competition_id, team_id, profile_id, registration_type, status)
  VALUES (p_competition_id, p_team_id, p_profile_id, 'individual', 'registered')
  RETURNING id INTO v_reg_id;
  INSERT INTO public.competition_team_members (team_id, profile_id, role, status)
  VALUES (p_team_id, p_profile_id, 'competitor', 'active')
  ON CONFLICT DO NOTHING;
  RETURN jsonb_build_object('status', 'ok', 'registration_id', v_reg_id, 'message', 'Competitor registered');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.withdraw_registration(p_registration_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.competition_registrations SET status = 'withdrawn' WHERE id = p_registration_id;
  RETURN jsonb_build_object('status', 'ok', 'message', 'Registration withdrawn');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_competition_round(
    p_competition_id uuid, p_round_name text, p_round_number int,
    p_start_time timestamptz, p_end_time timestamptz, p_description text DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.competition_rounds (competition_id, round_name, round_number, start_time, end_time, description)
  VALUES (p_competition_id, p_round_name, p_round_number, p_start_time, p_end_time, p_description)
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('status', 'ok', 'round_id', v_id, 'message', 'Round added');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

-- 10c) Question bank authoring.
CREATE OR REPLACE FUNCTION public.create_question_bank(p_competition_id uuid, p_subject_id uuid, p_name text, p_description text DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.competition_question_banks (competition_id, subject_id, name, description)
  VALUES (p_competition_id, p_subject_id, p_name, p_description)
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('status', 'ok', 'bank_id', v_id, 'message', 'Question bank created');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_question(
    p_bank_id uuid, p_question_text text, p_marks int, p_difficulty text,
    p_syllabus_reference text DEFAULT NULL, p_options jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_q_id uuid;
  v_opt jsonb;
BEGIN
  INSERT INTO public.competition_questions (question_bank_id, question_text, question_type, marks, difficulty, syllabus_reference, academic_reviewed)
  VALUES (p_bank_id, p_question_text, 'mcq', p_marks, p_difficulty, p_syllabus_reference, true)
  RETURNING id INTO v_q_id;
  FOR v_opt IN SELECT * FROM jsonb_array_elements(p_options) LOOP
    INSERT INTO public.competition_options (question_id, option_text, is_correct, option_order)
    VALUES (v_q_id, v_opt ->> 'text', (v_opt ->> 'is_correct')::boolean, COALESCE((v_opt ->> 'order')::int, 1));
  END LOOP;
  RETURN jsonb_build_object('status', 'ok', 'question_id', v_q_id, 'message', 'Question added');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_question_bank(p_bank_id uuid)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_build_object(
    'bank', (SELECT row_to_json(b) FROM public.competition_question_banks b WHERE b.id = p_bank_id),
    'questions', (SELECT jsonb_agg(jsonb_build_object(
        'id', q.id, 'question_text', q.question_text, 'question_type', q.question_type, 'marks', q.marks,
        'difficulty', q.difficulty, 'syllabus_reference', q.syllabus_reference,
        'options', (SELECT jsonb_agg(jsonb_build_object('id', o.id, 'text', o.option_text, 'is_correct', o.is_correct, 'order', o.option_order) ORDER BY o.option_order)
                    FROM public.competition_options o WHERE o.question_id = q.id)) ORDER BY q.created_at)
      FROM public.competition_questions q WHERE q.question_bank_id = p_bank_id));
$function$;

-- 10d) Attempts: start, fetch questions, submit with auto-marking.
CREATE OR REPLACE FUNCTION public.start_attempt(p_competition_id uuid, p_profile_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_attempt_id uuid;
  v_duration int;
  v_reg_id uuid;
  v_team_id uuid;
BEGIN
  SELECT c.duration_minutes, r.id INTO v_duration, v_reg_id
  FROM public.competitions c
  JOIN public.competition_registrations r ON r.competition_id = c.id
  WHERE c.id = p_competition_id AND r.profile_id = p_profile_id AND r.status = 'registered'
  LIMIT 1;
  IF v_reg_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Registration not found for this competitor');
  END IF;
  IF EXISTS (SELECT 1 FROM public.competition_attempts a
             WHERE a.competition_id = p_competition_id AND a.profile_id = p_profile_id AND a.status IN ('in_progress', 'submitted')) THEN
    RETURN jsonb_build_object('error', 'An attempt is already open for this competitor');
  END IF;
  SELECT t.team_id INTO v_team_id FROM public.competition_registrations t WHERE t.id = v_reg_id;
  INSERT INTO public.competition_attempts (competition_id, profile_id, team_id, started_at, time_remaining_seconds, status)
  VALUES (p_competition_id, p_profile_id, v_team_id, now(), v_duration * 60, 'in_progress')
  RETURNING id INTO v_attempt_id;
  RETURN jsonb_build_object('status', 'ok', 'attempt_id', v_attempt_id, 'time_remaining_seconds', v_duration * 60);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_attempt_questions(p_attempt_id uuid)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH a AS (SELECT competition_id FROM public.competition_attempts WHERE id = p_attempt_id)
  SELECT jsonb_agg(jsonb_build_object(
      'id', q.id, 'question_text', q.question_text, 'question_type', q.question_type, 'marks', q.marks,
      'difficulty', q.difficulty,
      'options', (SELECT jsonb_agg(jsonb_build_object('id', o.id, 'text', o.option_text, 'order', o.option_order) ORDER BY o.option_order)
                  FROM public.competition_options o WHERE o.question_id = q.id)
  ))
  FROM public.competition_questions q
  WHERE q.question_bank_id IN (SELECT b.id FROM public.competition_question_banks b WHERE b.competition_id = (SELECT competition_id FROM a));
$function$;

CREATE OR REPLACE FUNCTION public.submit_attempt(p_attempt_id uuid, p_answers jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_attempt record;
  v_total int := 0;
  v_total_marks int;
  v_marked int := 0;
  v_result_id uuid;
  v_correct boolean;
  v_row record;
BEGIN
  SELECT a.* INTO v_attempt FROM public.competition_attempts a WHERE a.id = p_attempt_id;
  IF v_attempt IS NULL THEN
    RETURN jsonb_build_object('error', 'Attempt not found');
  END IF;
  IF v_attempt.status = 'submitted' THEN
    RETURN jsonb_build_object('error', 'Attempt already submitted');
  END IF;
  UPDATE public.competition_attempts
  SET status = 'submitted', submitted_at = now(), time_remaining_seconds = 0
  WHERE id = p_attempt_id;

  FOR v_row IN
    SELECT (elem ->> 'question_id')::uuid AS q_id, (elem ->> 'option_id')::uuid AS opt_id
    FROM jsonb_array_elements(p_answers) elem
  LOOP
    SELECT o.is_correct INTO v_correct
    FROM public.competition_options o
    WHERE o.id = v_row.opt_id AND o.question_id = v_row.q_id;
    IF v_correct = true THEN
      SELECT q.marks INTO v_total_marks FROM public.competition_questions q WHERE q.id = v_row.q_id;
      v_total := v_total + v_total_marks;
      v_marked := v_marked + 1;
    END IF;
  END LOOP;

  INSERT INTO public.competition_results (competition_id, attempt_id, profile_id, total_score, status)
  VALUES (v_attempt.competition_id, p_attempt_id, v_attempt.profile_id, v_total, 'pending')
  RETURNING id INTO v_result_id;

  INSERT INTO public.competition_leaderboards (competition_id, profile_id, team_id, institution_id, score, leaderboard_type, verified)
  SELECT v_attempt.competition_id, v_attempt.profile_id, v_attempt.team_id,
         (SELECT t.institution_id FROM public.competition_teams t WHERE t.id = v_attempt.team_id),
         v_total, 'individual', false
  ON CONFLICT (competition_id, profile_id, leaderboard_type)
  DO UPDATE SET score = EXCLUDED.score;

  RETURN jsonb_build_object('status', 'ok', 'result_id', v_result_id, 'total_score', v_total,
                            'auto_marked_questions', v_marked, 'message', 'Attempt submitted and auto-marked');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

-- 10e) Human marking.
CREATE OR REPLACE FUNCTION public.assign_marker(p_competition_id uuid, p_marker_profile_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.competition_markers (competition_id, marker_profile_id, assigned_by)
  VALUES (p_competition_id, p_marker_profile_id,
          (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1))
  ON CONFLICT (competition_id, marker_profile_id) DO NOTHING;
  RETURN jsonb_build_object('status', 'ok', 'message', 'Marker assigned');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_marking_queue(p_competition_id uuid)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(jsonb_build_object(
      'attempt_id', a.id, 'profile_id', a.profile_id, 'display_name', p.display_name,
      'team_name', t.team_name, 'started_at', a.started_at, 'submitted_at', a.submitted_at,
      'time_remaining_seconds', a.time_remaining_seconds,
      'result_status', r.status, 'total_score', r.total_score,
      'marked', (r.id IS NOT NULL AND r.status = 'pending'))
      ORDER BY a.submitted_at)
  FROM public.competition_attempts a
  JOIN public.profiles p ON p.id = a.profile_id
  LEFT JOIN public.competition_teams t ON t.id = a.team_id
  LEFT JOIN public.competition_results r ON r.attempt_id = a.id
  LEFT JOIN public.competition_marks m ON m.attempt_id = a.id
  WHERE a.competition_id = p_competition_id AND a.status = 'submitted'
    AND NOT EXISTS (SELECT 1 FROM public.competition_marks m2 WHERE m2.attempt_id = a.id)
    AND NOT EXISTS (SELECT 1 FROM public.competition_results r2 WHERE r2.attempt_id = a.id AND r2.status = 'approved');
$function$;

CREATE OR REPLACE FUNCTION public.manual_mark_attempt(
    p_attempt_id uuid, p_marker_profile_id uuid, p_total_marks int, p_moderator_reviewed boolean DEFAULT false)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_result_id uuid;
BEGIN
  INSERT INTO public.competition_marks (attempt_id, marker_profile_id, total_marks, moderator_reviewed, status, marked_at)
  VALUES (p_attempt_id, p_marker_profile_id, p_total_marks, p_moderator_reviewed, 'marked', now())
  ON CONFLICT (attempt_id) DO UPDATE SET total_marks = EXCLUDED.total_marks, moderator_reviewed = EXCLUDED.moderator_reviewed, status = EXCLUDED.status, marked_at = EXCLUDED.marked_at;
  UPDATE public.competition_results SET total_score = p_total_marks, status = 'marked'
  WHERE attempt_id = p_attempt_id
  RETURNING id INTO v_result_id;
  IF v_result_id IS NULL THEN
    INSERT INTO public.competition_results (competition_id, attempt_id, profile_id, total_score, status)
    SELECT a.competition_id, a.id, a.profile_id, p_total_marks, 'marked'
    FROM public.competition_attempts a WHERE a.id = p_attempt_id
    RETURNING id INTO v_result_id;
  END IF;
  RETURN jsonb_build_object('status', 'ok', 'result_id', v_result_id, 'message', 'Attempt marked');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

-- 10f) Result approval: ranks, verified leaderboard, podium rewards, awards,
-- certificates and Hall of Fame.
CREATE OR REPLACE FUNCTION public.approve_result(p_result_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_result record;
  v_rank int;
  v_admin uuid;
  v_reward_id uuid;
  v_amount int;
BEGIN
  SELECT r.* INTO v_result FROM public.competition_results r WHERE r.id = p_result_id;
  IF v_result IS NULL THEN
    RETURN jsonb_build_object('error', 'Result not found');
  END IF;
  IF v_result.status = 'approved' THEN
    RETURN jsonb_build_object('error', 'Result already approved');
  END IF;
  v_admin := auth.uid();
  UPDATE public.competition_results
  SET status = 'approved', approved_by = v_admin, approved_at = now(),
      rank_position = COALESCE((
        SELECT count(*) + 1 FROM public.competition_results r2
        WHERE r2.competition_id = v_result.competition_id AND r2.status = 'approved'
          AND (r2.total_score > v_result.total_score OR (r2.total_score = v_result.total_score AND r2.id < v_result.id))
      ), 1)
  WHERE id = p_result_id
  RETURNING rank_position INTO v_rank;

  INSERT INTO public.competition_leaderboards (competition_id, profile_id, team_id, institution_id, score, rank_position, leaderboard_type, verified)
  SELECT v_result.competition_id, v_result.profile_id,
         (SELECT team_id FROM public.competition_attempts a WHERE a.id = v_result.attempt_id),
         (SELECT t.institution_id FROM public.competition_teams t WHERE t.id = (SELECT team_id FROM public.competition_attempts a WHERE a.id = v_result.attempt_id)),
         v_result.total_score, v_rank, 'individual', true
  ON CONFLICT (competition_id, profile_id, leaderboard_type)
  DO UPDATE SET score = EXCLUDED.score, rank_position = EXCLUDED.rank_position, verified = true;

  IF v_rank BETWEEN 1 AND 3 THEN
    CASE v_rank
      WHEN 1 THEN SELECT setting_value::int INTO v_amount FROM public.platform_settings WHERE setting_key = 'competition_first_prize';
      WHEN 2 THEN SELECT setting_value::int INTO v_amount FROM public.platform_settings WHERE setting_key = 'competition_second_prize';
      ELSE   SELECT setting_value::int INTO v_amount FROM public.platform_settings WHERE setting_key = 'competition_third_prize';
    END CASE;
    INSERT INTO public.competition_rewards (competition_id, profile_id, institution_id, placement_rank, prize_amount_ngn, audited_by)
    SELECT v_result.competition_id, v_result.profile_id,
           (SELECT t.institution_id FROM public.competition_teams t WHERE t.id = (SELECT team_id FROM public.competition_attempts a WHERE a.id = v_result.attempt_id)),
           v_rank, v_amount, v_admin
    ON CONFLICT (competition_id, placement_rank) DO NOTHING
    RETURNING id INTO v_reward_id;
    INSERT INTO public.competition_awards (competition_id, profile_id, institution_id, award_name, award_type, prize_amount_ngn, rank_position, awarded_at)
    SELECT v_result.competition_id, v_result.profile_id,
           (SELECT t.institution_id FROM public.competition_teams t WHERE t.id = (SELECT team_id FROM public.competition_attempts a WHERE a.id = v_result.attempt_id)),
           'VALENCE National Inter-School Challenge 2027 - Podium Award',
           CASE v_rank WHEN 1 THEN 'gold' WHEN 2 THEN 'silver' ELSE 'bronze' END,
           v_amount, v_rank, now()
    ON CONFLICT DO NOTHING;
    INSERT INTO public.competition_certificates (competition_id, profile_id, institution_id, certificate_number, certificate_url, award_type, rank_position, issued_at)
    SELECT v_result.competition_id, v_result.profile_id,
           (SELECT t.institution_id FROM public.competition_teams t WHERE t.id = (SELECT team_id FROM public.competition_attempts a WHERE a.id = v_result.attempt_id)),
           'VAL-CERT-' || replace(v_result.competition_id::text, '-', '') || '-' || v_rank,
           NULL, 'podium', v_rank, now()
    ON CONFLICT DO NOTHING;
    INSERT INTO public.hall_of_fame_entries (competition_id, profile_id, institution_id, placement_rank, badge_label, year)
    SELECT v_result.competition_id, v_result.profile_id,
           (SELECT t.institution_id FROM public.competition_teams t WHERE t.id = (SELECT team_id FROM public.competition_attempts a WHERE a.id = v_result.attempt_id)),
           v_rank, 'Hall of Fame', extract(year FROM now())::text
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.competition_certificates (competition_id, profile_id, institution_id, certificate_number, certificate_url, award_type, rank_position, issued_at)
    SELECT v_result.competition_id, v_result.profile_id,
           (SELECT t.institution_id FROM public.competition_teams t WHERE t.id = (SELECT team_id FROM public.competition_attempts a WHERE a.id = v_result.attempt_id)),
           'VAL-CERT-' || replace(v_result.competition_id::text, '-', '') || '-' || COALESCE(v_rank::text, 'X'),
           NULL, 'merit', COALESCE(v_rank, 0), now()
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'result_id', p_result_id, 'rank_position', v_rank,
                            'total_score', v_result.total_score, 'message', 'Result approved');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

-- 10g) Appeals.
CREATE OR REPLACE FUNCTION public.submit_appeal(p_result_id uuid, p_appeal_reason text)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_appeal_id uuid;
BEGIN
  INSERT INTO public.competition_appeals (result_id, profile_id, appeal_reason, status)
  VALUES (p_result_id, (SELECT profile_id FROM public.competition_results WHERE id = p_result_id), p_appeal_reason, 'pending')
  RETURNING id INTO v_appeal_id;
  RETURN jsonb_build_object('status', 'ok', 'appeal_id', v_appeal_id, 'message', 'Appeal submitted');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.review_appeal(p_appeal_id uuid, p_decision text, p_decision_notes text DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_admin uuid;
BEGIN
  IF p_decision NOT IN ('approved', 'rejected') THEN
    RETURN jsonb_build_object('error', 'Decision must be approved or rejected');
  END IF;
  UPDATE public.competition_appeals
  SET status = p_decision, reviewed_by = auth.uid(),
      reviewed_at = now(), decision_notes = p_decision_notes
  WHERE id = p_appeal_id;
  IF p_decision = 'approved' THEN
    UPDATE public.competition_results SET status = 'approved', approved_at = COALESCE(approved_at, now()) WHERE id = (SELECT result_id FROM public.competition_appeals WHERE id = p_appeal_id);
  END IF;
  RETURN jsonb_build_object('status', 'ok', 'appeal_id', p_appeal_id, 'decision', p_decision, 'message', 'Appeal reviewed');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

-- 10h) Reward disbursement (audited payout).
CREATE OR REPLACE FUNCTION public.disburse_reward(p_reward_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.competition_rewards
  SET status = 'disbursed', disbursed_at = now(), audited_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
  WHERE id = p_reward_id;
  INSERT INTO public.competition_audit_logs (competition_id, actor_profile_id, action, details)
  SELECT r.competition_id, (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1), 'reward_disbursed',
         jsonb_build_object('reward_id', r.id)
  FROM public.competition_rewards r WHERE r.id = p_reward_id;
  RETURN jsonb_build_object('status', 'ok', 'reward_id', p_reward_id, 'message', 'Reward disbursed');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

-- 10i) Leaderboard recompute (individual, team, institution).
CREATE OR REPLACE FUNCTION public.recompute_leaderboard(p_competition_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.competition_leaderboards WHERE competition_id = p_competition_id;
  INSERT INTO public.competition_leaderboards (competition_id, profile_id, team_id, institution_id, score, rank_position, leaderboard_type, verified)
  SELECT r.competition_id, r.profile_id, a.team_id, t.institution_id, r.total_score,
         row_number() OVER (ORDER BY r.total_score DESC, r.id), 'individual', true
  FROM public.competition_results r
  JOIN public.competition_attempts a ON a.id = r.attempt_id
  LEFT JOIN public.competition_teams t ON t.id = a.team_id
  WHERE r.competition_id = p_competition_id AND r.status = 'approved';
  INSERT INTO public.competition_leaderboards (competition_id, team_id, institution_id, score, rank_position, leaderboard_type, verified)
  SELECT DISTINCT ON (a.team_id) a.competition_id, a.team_id, t.institution_id,
         COALESCE(SUM(r.total_score), 0),
         row_number() OVER (ORDER BY COALESCE(SUM(r.total_score), 0) DESC), 'team', true
  FROM public.competition_attempts a
  JOIN public.competition_teams t ON t.id = a.team_id
  LEFT JOIN public.competition_results r ON r.attempt_id = a.id AND r.status = 'approved'
  WHERE a.competition_id = p_competition_id
  GROUP BY a.team_id, t.institution_id, a.competition_id;
  INSERT INTO public.competition_leaderboards (competition_id, institution_id, score, rank_position, leaderboard_type, verified)
  SELECT competition_id, institution_id, SUM(score),
         row_number() OVER (ORDER BY SUM(score) DESC), 'institution', true
  FROM public.competition_leaderboards
  WHERE competition_id = p_competition_id AND leaderboard_type = 'team'
  GROUP BY competition_id, institution_id;
  RETURN jsonb_build_object('status', 'ok', 'message', 'Leaderboard recomputed');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_leaderboard(p_competition_id uuid, p_type text DEFAULT 'individual')
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.rank_key)
  FROM (
    SELECT jsonb_build_object(
      'rank_position', lb.rank_position, 'profile_id', lb.profile_id, 'display_name', p.display_name,
      'team_id', lb.team_id, 'team_name', t.team_name, 'institution_id', lb.institution_id,
      'institution_name', i.name, 'score', lb.score, 'leaderboard_type', lb.leaderboard_type, 'verified', lb.verified) AS data,
      COALESCE(lb.rank_position, 999999) AS rank_key
    FROM public.competition_leaderboards lb
    LEFT JOIN public.profiles p ON p.id = lb.profile_id
    LEFT JOIN public.competition_teams t ON t.id = lb.team_id
    LEFT JOIN public.institutions i ON i.id = lb.institution_id
    WHERE lb.competition_id = p_competition_id AND lb.leaderboard_type = p_type
  ) s;
$function$;

-- 10j) Participant results view.
CREATE OR REPLACE FUNCTION public.fetch_my_results(p_competition_id uuid DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_profile_id uuid := (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1);
BEGIN
  RETURN jsonb_build_object(
    'attempts', (SELECT jsonb_agg(jsonb_build_object(
        'attempt_id', a.id, 'competition_id', a.competition_id, 'status', a.status,
        'started_at', a.started_at, 'submitted_at', a.submitted_at))
      FROM public.competition_attempts a WHERE a.profile_id = v_profile_id
        AND (p_competition_id IS NULL OR a.competition_id = p_competition_id)),
    'results', (SELECT jsonb_agg(jsonb_build_object(
        'result_id', r.id, 'competition_id', r.competition_id, 'total_score', r.total_score,
        'rank_position', r.rank_position, 'status', r.status, 'approved_at', r.approved_at))
      FROM public.competition_results r WHERE r.profile_id = v_profile_id
        AND (p_competition_id IS NULL OR r.competition_id = p_competition_id)),
    'certificates', (SELECT jsonb_agg(jsonb_build_object(
        'certificate_id', c.id, 'competition_id', c.competition_id, 'certificate_number', c.certificate_number,
        'award_type', c.award_type, 'rank_position', c.rank_position, 'issued_at', c.issued_at))
      FROM public.competition_certificates c WHERE c.profile_id = v_profile_id),
    'awards', (SELECT jsonb_agg(jsonb_build_object(
        'award_id', w.id, 'competition_id', w.competition_id, 'award_name', w.award_name,
        'award_type', w.award_type, 'prize_amount_ngn', w.prize_amount_ngn, 'rank_position', w.rank_position))
      FROM public.competition_awards w WHERE w.profile_id = v_profile_id),
    'rewards', (SELECT jsonb_agg(jsonb_build_object(
        'reward_id', wr.id, 'competition_id', wr.competition_id, 'placement_rank', wr.placement_rank,
        'prize_amount_ngn', wr.prize_amount_ngn, 'status', wr.status, 'disbursed_at', wr.disbursed_at))
      FROM public.competition_rewards wr WHERE wr.profile_id = v_profile_id),
    'appeals', (SELECT jsonb_agg(jsonb_build_object(
        'appeal_id', ap.id, 'competition_id', (SELECT competition_id FROM public.competition_results r WHERE r.id = ap.result_id),
        'appeal_reason', ap.appeal_reason, 'status', ap.status, 'decision_notes', ap.decision_notes))
      FROM public.competition_appeals ap WHERE ap.profile_id = v_profile_id));
END;
$function$;

-- 10k) Arena 1v1 / 2v2.
CREATE OR REPLACE FUNCTION public.create_arena_match(
    p_competition_id uuid, p_team_a_id uuid, p_team_b_id uuid,
    p_match_format text DEFAULT '1v1', p_scheduled_at timestamptz DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  IF p_team_a_id = p_team_b_id THEN
    RETURN jsonb_build_object('error', 'Team A and Team B must differ');
  END IF;
  IF p_match_format NOT IN ('1v1', '2v2') THEN
    RETURN jsonb_build_object('error', 'Match format must be 1v1 or 2v2');
  END IF;
  INSERT INTO public.arena_matches (competition_id, team_a_id, team_b_id, match_format, scheduled_at)
  VALUES (p_competition_id, p_team_a_id, p_team_b_id, p_match_format, p_scheduled_at)
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('status', 'ok', 'match_id', v_id, 'message', 'Arena match scheduled');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.complete_arena_match(p_match_id uuid, p_winner_team_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.arena_matches
  SET status = 'completed', winner_team_id = p_winner_team_id, played_at = now()
  WHERE id = p_match_id;
  RETURN jsonb_build_object('status', 'ok', 'match_id', p_match_id, 'winner_team_id', p_winner_team_id, 'message', 'Match completed');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_arena_matches(p_competition_id uuid)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(jsonb_build_object(
      'match_id', m.id, 'competition_id', m.competition_id, 'match_format', m.match_format,
      'status', m.status, 'scheduled_at', m.scheduled_at, 'played_at', m.played_at,
      'team_a', jsonb_build_object('team_id', m.team_a_id, 'team_name', ta.team_name, 'institution_name', ia.name),
      'team_b', jsonb_build_object('team_id', m.team_b_id, 'team_name', tb.team_name, 'institution_name', ib.name),
      'winner_team_id', m.winner_team_id)
  )
  FROM public.arena_matches m
  JOIN public.competition_teams ta ON ta.id = m.team_a_id
  JOIN public.institutions ia ON ia.id = ta.institution_id
  JOIN public.competition_teams tb ON tb.id = m.team_b_id
  JOIN public.institutions ib ON ib.id = tb.institution_id
  WHERE m.competition_id = p_competition_id;
$function$;

-- 10l) Hall of Fame, Top VALENCE Students, audit.
CREATE OR REPLACE FUNCTION public.fetch_hall_of_fame(p_limit int DEFAULT 50)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.rank_key)
  FROM (
    SELECT jsonb_build_object(
      'entry_id', h.id, 'competition_id', h.competition_id, 'competition_name', c.name,
      'profile_id', h.profile_id, 'display_name', p.display_name, 'institution_name', i.name,
      'placement_rank', h.placement_rank, 'badge_label', h.badge_label, 'year', h.year) AS data,
      h.placement_rank AS rank_key
    FROM public.hall_of_fame_entries h
    JOIN public.competitions c ON c.id = h.competition_id
    JOIN public.profiles p ON p.id = h.profile_id
    LEFT JOIN public.institutions i ON i.id = h.institution_id
    ORDER BY h.placement_rank, h.created_at DESC
    LIMIT p_limit
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_school_top_students(p_institution_id uuid)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.rank_key)
  FROM (
    SELECT jsonb_build_object(
      'student_id', st.id, 'winner_user_id', st.winner_user_id, 'competition_id', st.competition_id,
      'competition_name', c.name, 'profile_id', (SELECT id FROM public.profiles p WHERE p.user_id = st.winner_user_id),
      'display_name', (SELECT display_name FROM public.profiles p WHERE p.user_id = st.winner_user_id),
      'placement_rank', st.placement_rank, 'prize_amount_ngn', st.prize_amount_ngn,
      'badge_label', st.badge_label, 'profile_spotlight', st.profile_spotlight) AS data,
      st.placement_rank AS rank_key
    FROM public.school_top_valence_students st
    JOIN public.competitions c ON c.id = st.competition_id
    WHERE st.institution_id = p_institution_id
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_audit_logs(p_competition_id uuid DEFAULT NULL)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key DESC)
  FROM (
    SELECT jsonb_build_object(
      'log_id', l.id, 'competition_id', l.competition_id, 'actor_display_name', p.display_name,
      'action', l.action, 'details', l.details, 'created_at', l.created_at) AS data,
      l.created_at AS sort_key
    FROM public.competition_audit_logs l
    LEFT JOIN public.profiles p ON p.id = l.actor_profile_id
    WHERE (p_competition_id IS NULL OR l.competition_id = p_competition_id)
    ORDER BY l.created_at DESC
    LIMIT 200
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.log_audit_action(p_competition_id uuid, p_action text, p_details jsonb DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.competition_audit_logs (competition_id, actor_profile_id, action, details)
  VALUES (p_competition_id, (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1), p_action, COALESCE(p_details, '{}'::jsonb));
  RETURN jsonb_build_object('status', 'ok', 'message', 'Audit log written');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;
