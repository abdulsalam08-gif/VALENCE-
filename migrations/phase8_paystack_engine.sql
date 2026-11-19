-- Phase 8: Paystack Payment Engine, Level-Unlock Locks, Tuition Enrolment &
-- Google Meet Access Control
-- Spec: SCHEMA_OVERVIEW.md v02 (tuition) + v03 (Paystack Financial Engine)
-- New tables: payment_transactions, paystack_webhook_events, payment_receipts,
--             tuition_enrolments, live_class_sessions, live_class_attendance

-- ---------------------------------------------------------------------------
-- 1. payment_transactions (Paystack Financial Engine)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reference           text NOT NULL UNIQUE,
  amount_ngn          integer NOT NULL,
  currency            text NOT NULL DEFAULT 'NGN',
  payment_type        text NOT NULL DEFAULT 'other',
  status              text NOT NULL DEFAULT 'pending',
  paystack_reference  text,
  paystack_verify_job bigint,
  payload             jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY payment_transactions_select_own ON public.payment_transactions
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY payment_transactions_insert_own ON public.payment_transactions
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR auth.role() = 'service_role'::text);
CREATE POLICY payment_transactions_update_own ON public.payment_transactions
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR auth.role() = 'service_role'::text);
CREATE POLICY payment_transactions_delete_own ON public.payment_transactions
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 2. paystack_webhook_events (idempotency log)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.paystack_webhook_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    text NOT NULL UNIQUE,
  event_type  text NOT NULL,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  signature   text,
  processed   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Server-side log: service_role + admin only.
CREATE POLICY paystack_webhook_events_select_svc ON public.paystack_webhook_events
  FOR SELECT USING (auth.role() = 'service_role'::text OR is_admin_user());
CREATE POLICY paystack_webhook_events_insert_svc ON public.paystack_webhook_events
  FOR INSERT WITH CHECK (auth.role() = 'service_role'::text);
CREATE POLICY paystack_webhook_events_update_svc ON public.paystack_webhook_events
  FOR UPDATE USING (auth.role() = 'service_role'::text) WITH CHECK (auth.role() = 'service_role'::text);

-- ---------------------------------------------------------------------------
-- 3. payment_receipts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_receipts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_id  uuid REFERENCES public.payment_transactions(id) ON DELETE CASCADE,
  receipt_number  text NOT NULL UNIQUE,
  amount_ngn      integer NOT NULL,
  receipt_url     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY payment_receipts_select_own ON public.payment_receipts
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY payment_receipts_insert_own ON public.payment_receipts
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR auth.role() = 'service_role'::text);
CREATE POLICY payment_receipts_update_own ON public.payment_receipts
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR auth.role() = 'service_role'::text);
CREATE POLICY payment_receipts_delete_own ON public.payment_receipts
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 4. tuition_enrolments (gated by has_unlocked_level)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tuition_enrolments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  examination_level_id uuid NOT NULL REFERENCES public.examination_levels(id) ON DELETE CASCADE,
  course_ids          text[] NOT NULL DEFAULT '{}',
  status              text NOT NULL DEFAULT 'active',
  enrolled_at         timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE POLICY tuition_enrolments_select_own ON public.tuition_enrolments
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY tuition_enrolments_insert_own ON public.tuition_enrolments
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR auth.role() = 'service_role'::text);
CREATE POLICY tuition_enrolments_update_own ON public.tuition_enrolments
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR auth.role() = 'service_role'::text);
CREATE POLICY tuition_enrolments_delete_own ON public.tuition_enrolments
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 5. live_class_sessions (Google Meet URL gated to enrolled students, tutor & admins)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.live_class_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  examination_level_id uuid NOT NULL REFERENCES public.examination_levels(id) ON DELETE CASCADE,
  title            text NOT NULL,
  description      text,
  scheduled_at     timestamptz,
  meet_url         text NOT NULL,
  tutor_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status           text NOT NULL DEFAULT 'scheduled',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Anyone authenticated can list; the meet URL itself is gated by RPC.
CREATE POLICY live_class_sessions_select_public ON public.live_class_sessions
  FOR SELECT USING (auth.role() = 'service_role'::text OR is_admin_user() OR auth.uid() IS NOT NULL);
CREATE POLICY live_class_sessions_insert_admin ON public.live_class_sessions
  FOR INSERT WITH CHECK (auth.role() = 'service_role'::text OR is_admin_user());
CREATE POLICY live_class_sessions_update_admin ON public.live_class_sessions
  FOR UPDATE USING (auth.role() = 'service_role'::text OR is_admin_user()) WITH CHECK (auth.role() = 'service_role'::text OR is_admin_user());
CREATE POLICY live_class_sessions_delete_admin ON public.live_class_sessions
  FOR DELETE USING (auth.role() = 'service_role'::text OR is_admin_user());

-- ---------------------------------------------------------------------------
-- 6. live_class_attendance
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.live_class_attendance (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid NOT NULL REFERENCES public.live_class_sessions(id) ON DELETE CASCADE,
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attended_at   timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, profile_id)
);

CREATE POLICY live_class_attendance_select_own ON public.live_class_attendance
  FOR SELECT USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
CREATE POLICY live_class_attendance_insert_own ON public.live_class_attendance
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR auth.role() = 'service_role'::text);
CREATE POLICY live_class_attendance_update_own ON public.live_class_attendance
  FOR UPDATE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())) WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR auth.role() = 'service_role'::text);
CREATE POLICY live_class_attendance_delete_own ON public.live_class_attendance
  FOR DELETE USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin_user());
