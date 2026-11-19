-- Phase 14 — Scholarships, Internships, Graduate Jobs, CPE/CPD Webinars &
-- VALENCE PRO Verified Professional Hub.
-- Builds on the Phase 2 opportunities / professional_* tables and adds:
--   * opportunities amount/location columns (scholarships, internships, jobs)
--   * cpd_webinars + cpd_webinar_registrations (CPE/CPD webinar engine with
--     attendance capture and CPD certificate issuance)
--   * RLS fixes for the dead professional_profiles / professional_credentials
--     tables (RLS enabled, zero policies)
--   * SECURITY DEFINER RPC suite: opportunity management + applications,
--     CPD webinar engine, VALENCE PRO professional hub (profiles, credentials,
--     verifications)
-- All RPCs return error JSON (RAISE EXCEPTION hangs on this project).

-- 1) Extend opportunities with scholarship / internship / job fields.
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS amount_ngn integer;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS location text;

-- 2) cpd_webinars — CPE/CPD webinar sessions.
CREATE TABLE IF NOT EXISTS public.cpd_webinars (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title             text NOT NULL,
    description       text,
    webinar_type      text NOT NULL DEFAULT 'CPE',   -- CPE | CPD
    organiser_profile_id uuid REFERENCES public.profiles(id),
    start_time        timestamptz,
    end_time          timestamptz,
    meeting_link      text,
    capacity          integer NOT NULL DEFAULT 50,
    cpd_hours         numeric(4,1) NOT NULL DEFAULT 1.0,
    status            text NOT NULL DEFAULT 'draft',  -- draft | published | completed | cancelled
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now()
);

-- 3) cpd_webinar_registrations — registrations, attendance & CPD certificates.
CREATE TABLE IF NOT EXISTS public.cpd_webinar_registrations (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    webinar_id        uuid NOT NULL REFERENCES public.cpd_webinars(id) ON DELETE CASCADE,
    profile_id        uuid NOT NULL REFERENCES public.profiles(id),
    status            text NOT NULL DEFAULT 'registered',  -- registered | attended | certified
    attended_at       timestamptz,
    certificate_number text,
    certificate_url   text,
    cpd_hours_awarded numeric(4,1),
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    UNIQUE (webinar_id, profile_id)
);

-- updated_at triggers for the new tables.
CREATE OR REPLACE FUNCTION public.trg_cpd_webinars_updated() RETURNS trigger
 LANGUAGE plpgsql AS $function$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $function$;
CREATE OR REPLACE FUNCTION public.trg_cpd_webinar_registrations_updated() RETURNS trigger
 LANGUAGE plpgsql AS $function$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $function$;
DROP TRIGGER IF EXISTS trg_cpd_webinars_updated ON public.cpd_webinars;
CREATE TRIGGER trg_cpd_webinars_updated BEFORE UPDATE ON public.cpd_webinars
  FOR EACH ROW EXECUTE FUNCTION public.trg_cpd_webinars_updated();
DROP TRIGGER IF EXISTS trg_cpd_webinar_registrations_updated ON public.cpd_webinar_registrations;
CREATE TRIGGER trg_cpd_webinar_registrations_updated BEFORE UPDATE ON public.cpd_webinar_registrations
  FOR EACH ROW EXECUTE FUNCTION public.trg_cpd_webinar_registrations_updated();

-- 4) RLS on the new tables + fixes for the dead professional tables.
ALTER TABLE public.cpd_webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpd_webinar_registrations ENABLE ROW LEVEL SECURITY;

-- cpd_webinars: public read published; admin manage.
DROP POLICY IF EXISTS cpd_webinars_select_public ON public.cpd_webinars;
CREATE POLICY cpd_webinars_select_public ON public.cpd_webinars
  FOR SELECT TO authenticated USING (status = 'published');
DROP POLICY IF EXISTS cpd_webinars_admin ON public.cpd_webinars;
CREATE POLICY cpd_webinars_admin ON public.cpd_webinars
  FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

-- cpd_webinar_registrations: own read/insert; admin read.
DROP POLICY IF EXISTS cpd_registrations_select_own ON public.cpd_webinar_registrations;
CREATE POLICY cpd_registrations_select_own ON public.cpd_webinar_registrations
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
         OR is_admin_user());
DROP POLICY IF EXISTS cpd_registrations_insert_own ON public.cpd_webinar_registrations;
CREATE POLICY cpd_registrations_insert_own ON public.cpd_webinar_registrations
  FOR INSERT TO authenticated
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- opportunities: tighten insert (was unqualified), add admin update/delete.
DROP POLICY IF EXISTS opportunities_insert_admin ON public.opportunities;
CREATE POLICY opportunities_insert_admin ON public.opportunities
  FOR INSERT TO authenticated WITH CHECK (is_admin_user());
DROP POLICY IF EXISTS opportunities_update_admin ON public.opportunities;
CREATE POLICY opportunities_update_admin ON public.opportunities
  FOR UPDATE TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());
DROP POLICY IF EXISTS opportunities_delete_admin ON public.opportunities;
CREATE POLICY opportunities_delete_admin ON public.opportunities
  FOR DELETE TO authenticated USING (is_admin_user());

-- professional_profiles: was RLS-enabled with zero policies — now live.
DROP POLICY IF EXISTS prof_profiles_select_own ON public.professional_profiles;
CREATE POLICY prof_profiles_select_own ON public.professional_profiles
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
         OR is_admin_user());
DROP POLICY IF EXISTS prof_profiles_select_directory ON public.professional_profiles;
CREATE POLICY prof_profiles_select_directory ON public.professional_profiles
  FOR SELECT TO authenticated USING (verification_status = 'verified');
DROP POLICY IF EXISTS prof_profiles_insert_own ON public.professional_profiles;
CREATE POLICY prof_profiles_insert_own ON public.professional_profiles
  FOR INSERT TO authenticated
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS prof_profiles_update_own ON public.professional_profiles;
CREATE POLICY prof_profiles_update_own ON public.professional_profiles
  FOR UPDATE TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
         OR is_admin_user())
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
              OR is_admin_user());

-- professional_credentials: was RLS-enabled with zero policies — now live.
DROP POLICY IF EXISTS prof_credentials_select_own ON public.professional_credentials;
CREATE POLICY prof_credentials_select_own ON public.professional_credentials
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
         OR is_admin_user());
DROP POLICY IF EXISTS prof_credentials_insert_own ON public.professional_credentials;
CREATE POLICY prof_credentials_insert_own ON public.professional_credentials
  FOR INSERT TO authenticated
  WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS prof_credentials_update_admin ON public.professional_credentials;
CREATE POLICY prof_credentials_update_admin ON public.professional_credentials
  FOR UPDATE TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

-- 5) RPCs — SECURITY DEFINER, error-JSON returns, auth.uid() for own rows.

-- 5a) Opportunity management.
CREATE OR REPLACE FUNCTION public.manage_opportunity(
    p_opportunity_id uuid DEFAULT NULL, p_title text DEFAULT NULL,
    p_organisation text DEFAULT NULL, p_category text DEFAULT NULL,
    p_description text DEFAULT NULL, p_eligibility text DEFAULT NULL,
    p_deadline timestamptz DEFAULT NULL, p_application_link text DEFAULT NULL,
    p_flyer_url text DEFAULT NULL, p_amount_ngn integer DEFAULT NULL,
    p_location text DEFAULT NULL, p_status text DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  IF NOT is_admin_user() THEN
    RETURN jsonb_build_object('error', 'Admins only');
  END IF;
  IF p_opportunity_id IS NOT NULL THEN
    UPDATE public.opportunities
    SET title = COALESCE(p_title, title),
        organisation = COALESCE(p_organisation, organisation),
        category = COALESCE(p_category, category),
        description = COALESCE(p_description, description),
        eligibility = COALESCE(p_eligibility, eligibility),
        deadline = COALESCE(p_deadline, deadline),
        application_link = COALESCE(p_application_link, application_link),
        flyer_url = COALESCE(p_flyer_url, flyer_url),
        amount_ngn = COALESCE(p_amount_ngn, amount_ngn),
        location = COALESCE(p_location, location),
        status = COALESCE(p_status, status),
        published_at = CASE WHEN COALESCE(p_status, status) = 'published' AND published_at IS NULL
                             THEN now() ELSE published_at END
    WHERE id = p_opportunity_id;
    v_id := p_opportunity_id;
  ELSE
    INSERT INTO public.opportunities (title, organisation, category, description, eligibility,
        deadline, application_link, flyer_url, amount_ngn, location, status, published_at)
    VALUES (p_title, p_organisation, p_category, p_description, p_eligibility,
        p_deadline, p_application_link, p_flyer_url, p_amount_ngn, p_location,
        COALESCE(p_status, 'draft'),
        CASE WHEN COALESCE(p_status, 'draft') = 'published' THEN now() ELSE NULL END)
    RETURNING id INTO v_id;
  END IF;
  RETURN jsonb_build_object('status', 'ok', 'opportunity_id', v_id, 'message', 'Opportunity saved');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_opportunities(p_category text DEFAULT NULL, p_limit int DEFAULT 50, p_offset int DEFAULT 0)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key DESC NULLS LAST)
  FROM (
    SELECT jsonb_build_object(
      'id', o.id, 'title', o.title, 'organisation', o.organisation, 'category', o.category,
      'description', o.description, 'eligibility', o.eligibility, 'deadline', o.deadline,
      'application_link', o.application_link, 'supporting_documents', o.supporting_documents,
      'flyer_url', o.flyer_url, 'amount_ngn', o.amount_ngn, 'location', o.location,
      'status', o.status, 'published_at', o.published_at,
      'application_count', (SELECT count(*)::int FROM public.opportunity_applications a WHERE a.opportunity_id = o.id)
    ) AS data, o.published_at AS sort_key
    FROM public.opportunities o
    WHERE o.status = 'published'
      AND (p_category IS NULL OR o.category = p_category)
    ORDER BY o.published_at DESC NULLS LAST
    LIMIT p_limit OFFSET p_offset
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_opportunity_details(p_opportunity_id uuid)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH apps AS (
    SELECT jsonb_build_object(
      'id', a.id, 'application_text', a.application_text, 'document_urls', a.document_urls,
      'status', a.status, 'created_at', a.created_at, 'applicant', p.display_name
    ) AS data
    FROM public.opportunity_applications a
    JOIN public.profiles p ON p.id = a.profile_id
    WHERE a.opportunity_id = p_opportunity_id
    ORDER BY a.created_at DESC
  )
  SELECT jsonb_build_object(
    'opportunity', (SELECT row_to_json(o) FROM public.opportunities o WHERE o.id = p_opportunity_id),
    'applications', (SELECT jsonb_agg(apps.data) FROM apps)
  );
$function$;

CREATE OR REPLACE FUNCTION public.submit_opportunity_application(p_opportunity_id uuid, p_application_text text, p_document_urls text[] DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_profile uuid;
BEGIN
  SELECT id INTO v_profile FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('error', 'No profile found for this account');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.opportunities WHERE id = p_opportunity_id AND status = 'published') THEN
    RETURN jsonb_build_object('error', 'Opportunity not found or not published');
  END IF;
  IF EXISTS (SELECT 1 FROM public.opportunity_applications WHERE opportunity_id = p_opportunity_id AND profile_id = v_profile) THEN
    RETURN jsonb_build_object('error', 'You have already applied for this opportunity');
  END IF;
  INSERT INTO public.opportunity_applications (opportunity_id, profile_id, application_text, document_urls)
  VALUES (p_opportunity_id, v_profile, p_application_text, p_document_urls);
  RETURN jsonb_build_object('status', 'ok', 'message', 'Application submitted');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.withdraw_opportunity_application(p_application_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_profile uuid;
BEGIN
  SELECT id INTO v_profile FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  IF NOT is_admin_user() AND NOT EXISTS (SELECT 1 FROM public.opportunity_applications WHERE id = p_application_id AND profile_id = v_profile) THEN
    RETURN jsonb_build_object('error', 'Application not found');
  END IF;
  UPDATE public.opportunity_applications
  SET status = 'withdrawn', updated_at = now()
  WHERE id = p_application_id;
  RETURN jsonb_build_object('status', 'ok', 'message', 'Application withdrawn');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_my_opportunity_applications(p_limit int DEFAULT 50)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key DESC)
  FROM (
    SELECT jsonb_build_object(
      'id', a.id, 'opportunity_id', a.opportunity_id, 'application_text', a.application_text,
      'document_urls', a.document_urls, 'status', a.status, 'created_at', a.created_at,
      'opportunity_title', o.title, 'organisation', o.organisation, 'category', o.category,
      'deadline', o.deadline
    ) AS data, a.created_at AS sort_key
    FROM public.opportunity_applications a
    JOIN public.opportunities o ON o.id = a.opportunity_id
    WHERE a.profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
    ORDER BY a.created_at DESC
    LIMIT p_limit
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_opportunity_applications(p_opportunity_id uuid DEFAULT NULL)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key DESC)
  FROM (
    SELECT jsonb_build_object(
      'id', a.id, 'opportunity_id', a.opportunity_id, 'application_text', a.application_text,
      'document_urls', a.document_urls, 'status', a.status, 'created_at', a.created_at,
      'applicant_profile_id', a.profile_id, 'applicant_name', p.display_name
    ) AS data, a.created_at AS sort_key
    FROM public.opportunity_applications a
    LEFT JOIN public.profiles p ON p.id = a.profile_id
    WHERE a.opportunity_id = COALESCE(p_opportunity_id, a.opportunity_id)
      AND (p_opportunity_id IS NULL OR a.opportunity_id = p_opportunity_id)
    ORDER BY a.created_at DESC
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.review_opportunity_application(p_application_id uuid, p_decision text)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_actor uuid;
BEGIN
  IF NOT is_admin_user() THEN
    RETURN jsonb_build_object('error', 'Admins only');
  END IF;
  IF p_decision NOT IN ('shortlisted', 'rejected') THEN
    RETURN jsonb_build_object('error', 'Decision must be shortlisted or rejected');
  END IF;
  UPDATE public.opportunity_applications
  SET status = p_decision, updated_at = now()
  WHERE id = p_application_id;
  v_actor := (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1);
  RETURN jsonb_build_object('status', 'ok', 'application_id', p_application_id, 'decision', p_decision);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

-- 5b) CPD webinar engine.
CREATE OR REPLACE FUNCTION public.manage_cpd_webinar(
    p_webinar_id uuid DEFAULT NULL, p_title text DEFAULT NULL,
    p_description text DEFAULT NULL, p_webinar_type text DEFAULT NULL,
    p_start_time timestamptz DEFAULT NULL, p_end_time timestamptz DEFAULT NULL,
    p_meeting_link text DEFAULT NULL, p_capacity integer DEFAULT NULL,
    p_cpd_hours numeric DEFAULT NULL, p_status text DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  IF NOT is_admin_user() THEN
    RETURN jsonb_build_object('error', 'Admins only');
  END IF;
  IF p_webinar_id IS NOT NULL THEN
    UPDATE public.cpd_webinars
    SET title = COALESCE(p_title, title),
        description = COALESCE(p_description, description),
        webinar_type = COALESCE(p_webinar_type, webinar_type),
        start_time = COALESCE(p_start_time, start_time),
        end_time = COALESCE(p_end_time, end_time),
        meeting_link = COALESCE(p_meeting_link, meeting_link),
        capacity = COALESCE(p_capacity, capacity),
        cpd_hours = COALESCE(p_cpd_hours, cpd_hours),
        status = COALESCE(p_status, status)
    WHERE id = p_webinar_id;
    v_id := p_webinar_id;
  ELSE
    INSERT INTO public.cpd_webinars (title, description, webinar_type, start_time, end_time,
        meeting_link, capacity, cpd_hours, status)
    VALUES (p_title, p_description, COALESCE(p_webinar_type, 'CPE'), p_start_time, p_end_time,
        p_meeting_link, COALESCE(p_capacity, 50), COALESCE(p_cpd_hours, 1.0),
        COALESCE(p_status, 'draft'))
    RETURNING id INTO v_id;
  END IF;
  RETURN jsonb_build_object('status', 'ok', 'webinar_id', v_id, 'message', 'Webinar saved');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_cpd_webinars(p_limit int DEFAULT 50)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key)
  FROM (
    SELECT jsonb_build_object(
      'id', w.id, 'title', w.title, 'description', w.description, 'webinar_type', w.webinar_type,
      'organiser_profile_id', w.organiser_profile_id, 'start_time', w.start_time, 'end_time', w.end_time,
      'meeting_link', w.meeting_link, 'capacity', w.capacity, 'cpd_hours', w.cpd_hours, 'status', w.status,
      'registered_count', (SELECT count(*)::int FROM public.cpd_webinar_registrations r WHERE r.webinar_id = w.id)
    ) AS data, w.start_time AS sort_key
    FROM public.cpd_webinars w
    WHERE w.status = 'published'
    ORDER BY w.start_time
    LIMIT p_limit
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.register_cpd_webinar(p_webinar_id uuid)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_profile uuid;
  v_count int;
BEGIN
  SELECT id INTO v_profile FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('error', 'No profile found for this account');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.cpd_webinars WHERE id = p_webinar_id AND status = 'published') THEN
    RETURN jsonb_build_object('error', 'Webinar not found or not open for registration');
  END IF;
  IF EXISTS (SELECT 1 FROM public.cpd_webinar_registrations WHERE webinar_id = p_webinar_id AND profile_id = v_profile) THEN
    RETURN jsonb_build_object('error', 'You are already registered for this webinar');
  END IF;
  SELECT count(*) INTO v_count FROM public.cpd_webinar_registrations WHERE webinar_id = p_webinar_id;
  IF v_count >= (SELECT capacity FROM public.cpd_webinars WHERE id = p_webinar_id) THEN
    RETURN jsonb_build_object('error', 'Webinar is full');
  END IF;
  INSERT INTO public.cpd_webinar_registrations (webinar_id, profile_id)
  VALUES (p_webinar_id, v_profile);
  RETURN jsonb_build_object('status', 'ok', 'message', 'Registered for webinar');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_cpd_webinar_registrations(p_webinar_id uuid)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key)
  FROM (
    SELECT jsonb_build_object(
      'id', r.id, 'webinar_id', r.webinar_id, 'profile_id', r.profile_id,
      'status', r.status, 'attended_at', r.attended_at,
      'certificate_number', r.certificate_number, 'certificate_url', r.certificate_url,
      'cpd_hours_awarded', r.cpd_hours_awarded, 'created_at', r.created_at,
      'display_name', p.display_name
    ) AS data, r.created_at AS sort_key
    FROM public.cpd_webinar_registrations r
    LEFT JOIN public.profiles p ON p.id = r.profile_id
    WHERE r.webinar_id = p_webinar_id
    ORDER BY r.created_at
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.mark_cpd_attendance(p_webinar_id uuid, p_profile_id uuid, p_attended boolean)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_hours numeric;
BEGIN
  IF NOT is_admin_user() THEN
    RETURN jsonb_build_object('error', 'Admins only');
  END IF;
  SELECT cpd_hours INTO v_hours FROM public.cpd_webinars WHERE id = p_webinar_id;
  IF v_hours IS NULL THEN
    RETURN jsonb_build_object('error', 'Webinar not found');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.cpd_webinar_registrations WHERE webinar_id = p_webinar_id AND profile_id = p_profile_id) THEN
    RETURN jsonb_build_object('error', 'No registration found for this attendee');
  END IF;
  UPDATE public.cpd_webinar_registrations
  SET status = CASE WHEN p_attended THEN 'attended' ELSE 'registered' END,
      attended_at = CASE WHEN p_attended THEN COALESCE(attended_at, now()) ELSE NULL END,
      updated_at = now()
  WHERE webinar_id = p_webinar_id AND profile_id = p_profile_id;
  IF p_attended AND NOT EXISTS (SELECT 1 FROM public.cpd_webinar_registrations
      WHERE webinar_id = p_webinar_id AND profile_id = p_profile_id AND certificate_number IS NOT NULL) THEN
    UPDATE public.cpd_webinar_registrations
    SET status = 'certified',
        certificate_number = 'CPD-' || extract(year from now())::int || '-' || split_part(p_webinar_id::text, '-', 1),
        certificate_url = NULL,
        cpd_hours_awarded = v_hours,
        updated_at = now()
    WHERE webinar_id = p_webinar_id AND profile_id = p_profile_id;
  END IF;
  RETURN jsonb_build_object('status', 'ok', 'message', 'Attendance recorded');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_my_cpd_registrations(p_limit int DEFAULT 50)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key DESC NULLS LAST)
  FROM (
    SELECT jsonb_build_object(
      'id', r.id, 'webinar_id', r.webinar_id, 'profile_id', r.profile_id, 'status', r.status, 'attended_at', r.attended_at,
      'certificate_number', r.certificate_number, 'certificate_url', r.certificate_url,
      'cpd_hours_awarded', r.cpd_hours_awarded, 'created_at', r.created_at,
      'title', w.title, 'webinar_type', w.webinar_type, 'start_time', w.start_time,
      'meeting_link', w.meeting_link
    ) AS data, w.start_time AS sort_key
    FROM public.cpd_webinar_registrations r
    JOIN public.cpd_webinars w ON w.id = r.webinar_id
    WHERE r.profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
    ORDER BY w.start_time DESC NULLS LAST
    LIMIT p_limit
  ) s;
$function$;

-- 5c) VALENCE PRO verified professional hub.
CREATE OR REPLACE FUNCTION public.manage_professional_profile(
    p_profile_id uuid DEFAULT NULL, p_qualifications text[] DEFAULT NULL,
    p_expertise text[] DEFAULT NULL, p_experience text DEFAULT NULL,
    p_available_hours text DEFAULT NULL, p_preferred_mentee_categories text[] DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_own uuid;
  v_id uuid;
BEGIN
  SELECT id INTO v_own FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  IF v_own IS NULL THEN
    RETURN jsonb_build_object('error', 'No profile found for this account');
  END IF;
  SELECT id INTO v_id FROM public.professional_profiles WHERE profile_id = v_own LIMIT 1;
  IF v_id IS NOT NULL THEN
    UPDATE public.professional_profiles
    SET qualifications = COALESCE(p_qualifications, qualifications),
        expertise = COALESCE(p_expertise, expertise),
        experience = COALESCE(p_experience, experience),
        available_hours = COALESCE(p_available_hours, available_hours),
        preferred_mentee_categories = COALESCE(p_preferred_mentee_categories, preferred_mentee_categories),
        updated_at = now()
    WHERE id = v_id;
  ELSE
    INSERT INTO public.professional_profiles (profile_id, qualifications, expertise, experience,
        available_hours, preferred_mentee_categories)
    VALUES (v_own, p_qualifications, p_expertise, p_experience, p_available_hours, p_preferred_mentee_categories)
    RETURNING id INTO v_id;
  END IF;
  RETURN jsonb_build_object('status', 'ok', 'profile_id', v_id, 'message', 'Professional profile saved');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_professional_profile_by_profile()
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT row_to_json(pp)
  FROM public.professional_profiles pp
  WHERE pp.profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_professional_directory(p_limit int DEFAULT 50, p_offset int DEFAULT 0)
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key)
  FROM (
    SELECT jsonb_build_object(
      'id', pp.id, 'profile_id', pp.profile_id, 'qualifications', pp.qualifications,
      'expertise', pp.expertise, 'experience', pp.experience, 'available_hours', pp.available_hours,
      'preferred_mentee_categories', pp.preferred_mentee_categories,
      'verification_status', pp.verification_status,
      'display_name', p.display_name, 'biography', p.biography, 'institution_name', i.name
    ) AS data, p.display_name AS sort_key
    FROM public.professional_profiles pp
    JOIN public.profiles p ON p.id = pp.profile_id
    LEFT JOIN public.institutions i ON i.id = p.institution_id
    WHERE pp.verification_status = 'verified'
    ORDER BY p.display_name
    LIMIT p_limit OFFSET p_offset
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.submit_professional_credential(
    p_credential_type text, p_credential_name text, p_issuing_body text,
    p_certificate_number text DEFAULT NULL, p_document_url text DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_profile uuid;
BEGIN
  SELECT id INTO v_profile FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('error', 'No profile found for this account');
  END IF;
  INSERT INTO public.professional_credentials (profile_id, credential_type, credential_name,
      issuing_body, certificate_number, document_url)
  VALUES (v_profile, p_credential_type, p_credential_name, p_issuing_body, p_certificate_number, p_document_url);
  RETURN jsonb_build_object('status', 'ok', 'message', 'Credential submitted for verification');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_my_professional_credentials()
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key DESC)
  FROM (
    SELECT jsonb_build_object(
      'id', c.id, 'profile_id', c.profile_id, 'credential_type', c.credential_type,
      'credential_name', c.credential_name, 'issuing_body', c.issuing_body,
      'certificate_number', c.certificate_number, 'verification_status', c.verification_status,
      'verified_by', c.verified_by, 'verified_at', c.verified_at, 'document_url', c.document_url,
      'created_at', c.created_at
    ) AS data, c.created_at AS sort_key
    FROM public.professional_credentials c
    WHERE c.profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
    ORDER BY c.created_at DESC
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_professional_credentials(p_status text DEFAULT 'pending')
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key)
  FROM (
    SELECT jsonb_build_object(
      'id', c.id, 'profile_id', c.profile_id, 'credential_type', c.credential_type,
      'credential_name', c.credential_name, 'issuing_body', c.issuing_body,
      'certificate_number', c.certificate_number, 'verification_status', c.verification_status,
      'verified_by', c.verified_by, 'verified_at', c.verified_at, 'document_url', c.document_url,
      'created_at', c.created_at, 'applicant_name', p.display_name
    ) AS data, c.created_at AS sort_key
    FROM public.professional_credentials c
    LEFT JOIN public.profiles p ON p.id = c.profile_id
    WHERE c.verification_status = p_status
    ORDER BY c.created_at
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.review_professional_credential(p_credential_id uuid, p_approved boolean)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_admin_user() THEN
    RETURN jsonb_build_object('error', 'Admins only');
  END IF;
  UPDATE public.professional_credentials
  SET verification_status = CASE WHEN p_approved THEN 'verified' ELSE 'rejected' END,
      verified_by = auth.uid(),
      verified_at = now(),
      updated_at = now()
  WHERE id = p_credential_id;
  RETURN jsonb_build_object('status', 'ok', 'credential_id', p_credential_id,
    'decision', CASE WHEN p_approved THEN 'verified' ELSE 'rejected' END);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.submit_professional_verification(p_verification_type text, p_verification_body text, p_document_url text DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_profile uuid;
BEGIN
  SELECT id INTO v_profile FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('error', 'No profile found for this account');
  END IF;
  INSERT INTO public.professional_verifications (profile_id, verification_type, verification_body, document_url, status)
  VALUES (v_profile, p_verification_type, p_verification_body, p_document_url, 'pending');
  RETURN jsonb_build_object('status', 'ok', 'message', 'VALENCE PRO verification requested');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_professional_verification_queue(p_status text DEFAULT 'pending')
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key)
  FROM (
    SELECT jsonb_build_object(
      'id', v.id, 'profile_id', v.profile_id, 'verification_type', v.verification_type,
      'verification_body', v.verification_body, 'document_url', v.document_url,
      'status', v.status, 'reviewed_by', v.reviewed_by, 'created_at', v.created_at,
      'applicant_name', p.display_name
    ) AS data, v.created_at AS sort_key
    FROM public.professional_verifications v
    LEFT JOIN public.profiles p ON p.id = v.profile_id
    WHERE v.status = p_status
    ORDER BY v.created_at
  ) s;
$function$;

CREATE OR REPLACE FUNCTION public.review_professional_verification(p_verification_id uuid, p_approved boolean, p_notes text DEFAULT NULL)
RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_admin_user() THEN
    RETURN jsonb_build_object('error', 'Admins only');
  END IF;
  UPDATE public.professional_verifications
  SET status = CASE WHEN p_approved THEN 'approved' ELSE 'rejected' END,
      reviewed_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1),
      updated_at = now()
  WHERE id = p_verification_id;
  IF p_approved THEN
    UPDATE public.professional_profiles
    SET verification_status = 'verified', updated_at = now()
    WHERE profile_id = (SELECT profile_id FROM public.professional_verifications WHERE id = p_verification_id);
  ELSE
    UPDATE public.professional_profiles
    SET verification_status = 'rejected', updated_at = now()
    WHERE profile_id = (SELECT profile_id FROM public.professional_verifications WHERE id = p_verification_id);
  END IF;
  RETURN jsonb_build_object('status', 'ok', 'verification_id', p_verification_id,
    'decision', CASE WHEN p_approved THEN 'approved' ELSE 'rejected' END);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.fetch_my_professional_verification()
RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_agg(s.data ORDER BY s.sort_key DESC)
  FROM (
    SELECT jsonb_build_object(
      'id', v.id, 'profile_id', v.profile_id, 'verification_type', v.verification_type,
      'verification_body', v.verification_body, 'document_url', v.document_url,
      'status', v.status, 'reviewed_by', v.reviewed_by, 'created_at', v.created_at
    ) AS data, v.created_at AS sort_key
    FROM public.professional_verifications v
    WHERE v.profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
    ORDER BY v.created_at DESC
  ) s;
$function$;
