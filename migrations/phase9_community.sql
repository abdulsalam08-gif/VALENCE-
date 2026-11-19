-- Phase 9: Community Features — Discovery, Follows, Study Groups,
-- 12 Subject Forums, Mentorship & Events
-- Spec: SCHEMA_OVERVIEW.md v04_community_announcements_messaging_calls_and_pro
-- New tables: user_follows, user_blocks, forum_categories, forum_threads,
--             forum_replies, content_reports, professional_verifications
-- Existing (RLS-ready): study_groups, study_group_members, mentorship_profiles,
--             mentorship_requests, professional_events, event_registrations,
--             opportunities

-- ---------------------------------------------------------------------------
-- 1. user_follows
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_follows (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  followed_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_profile_id, followed_profile_id)
);

CREATE POLICY user_follows_select_any ON public.user_follows
  FOR SELECT USING (auth.role() = 'service_role'::text OR is_admin_user() OR auth.uid() IS NOT NULL);
CREATE POLICY user_follows_insert_own ON public.user_follows
  FOR INSERT WITH CHECK (follower_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY user_follows_delete_own ON public.user_follows
  FOR DELETE USING (follower_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 2. user_blocks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_profile_id, blocked_profile_id)
);

CREATE POLICY user_blocks_select_any ON public.user_blocks
  FOR SELECT USING (auth.role() = 'service_role'::text OR is_admin_user() OR auth.uid() IS NOT NULL);
CREATE POLICY user_blocks_insert_own ON public.user_blocks
  FOR INSERT WITH CHECK (blocker_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY user_blocks_delete_own ON public.user_blocks
  FOR DELETE USING (blocker_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 3. forum_categories (12 subject forums seeded)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL UNIQUE,
  description   text,
  icon          text,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY forum_categories_select_public ON public.forum_categories
  FOR SELECT USING (auth.role() = 'service_role'::text OR is_admin_user() OR auth.uid() IS NOT NULL);
CREATE POLICY forum_categories_insert_admin ON public.forum_categories
  FOR INSERT WITH CHECK (auth.role() = 'service_role'::text OR is_admin_user());
CREATE POLICY forum_categories_update_admin ON public.forum_categories
  FOR UPDATE USING (auth.role() = 'service_role'::text OR is_admin_user()) WITH CHECK (auth.role() = 'service_role'::text OR is_admin_user());
CREATE POLICY forum_categories_delete_admin ON public.forum_categories
  FOR DELETE USING (auth.role() = 'service_role'::text OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 4. forum_threads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_threads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         text NOT NULL,
  content       text NOT NULL,
  is_pinned     boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'open',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY forum_threads_select_public ON public.forum_threads
  FOR SELECT USING (auth.role() = 'service_role'::text OR is_admin_user() OR auth.uid() IS NOT NULL);
CREATE POLICY forum_threads_insert_own ON public.forum_threads
  FOR INSERT WITH CHECK (author_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY forum_threads_update_own ON public.forum_threads
  FOR UPDATE USING (author_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user()) WITH CHECK (author_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY forum_threads_delete_own ON public.forum_threads
  FOR DELETE USING (author_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 5. forum_replies
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id     uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  author_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content       text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY forum_replies_select_public ON public.forum_replies
  FOR SELECT USING (auth.role() = 'service_role'::text OR is_admin_user() OR auth.uid() IS NOT NULL);
CREATE POLICY forum_replies_insert_own ON public.forum_replies
  FOR INSERT WITH CHECK (author_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY forum_replies_update_own ON public.forum_replies
  FOR UPDATE USING (author_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user()) WITH CHECK (author_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY forum_replies_delete_own ON public.forum_replies
  FOR DELETE USING (author_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 6. content_reports
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_reports (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type   text NOT NULL,
  target_id     uuid NOT NULL,
  reason        text NOT NULL,
  description   text,
  status        text NOT NULL DEFAULT 'pending',
  reviewed_by   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY content_reports_select_own ON public.content_reports
  FOR SELECT USING (reporter_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY content_reports_insert_own ON public.content_reports
  FOR INSERT WITH CHECK (reporter_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY content_reports_update_admin ON public.content_reports
  FOR UPDATE USING (is_admin_user() OR auth.role() = 'service_role'::text) WITH CHECK (is_admin_user() OR auth.role() = 'service_role'::text);
CREATE POLICY content_reports_delete_own ON public.content_reports
  FOR DELETE USING (reporter_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 7. professional_verifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.professional_verifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verification_type text NOT NULL,
  verification_body text NOT NULL,
  document_url  text,
  status        text NOT NULL DEFAULT 'pending',
  reviewed_by   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY professional_verifications_select_own ON public.professional_verifications
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY professional_verifications_insert_own ON public.professional_verifications
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY professional_verifications_update_admin ON public.professional_verifications
  FOR UPDATE USING (is_admin_user() OR auth.role() = 'service_role'::text) WITH CHECK (is_admin_user() OR auth.role() = 'service_role'::text);
CREATE POLICY professional_verifications_delete_own ON public.professional_verifications
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
