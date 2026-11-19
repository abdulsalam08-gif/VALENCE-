-- Phase 12 — Real WebRTC direct audio & video calling
-- ICE/STUN/TURN signaling, ring/accept/decline/end, permission checks,
-- privacy controls & call logs.
--
-- call_sessions already exists from Phase 2 (no RLS). call_signals is new.
-- This migration adds call_signals, aligns call_sessions (media_type + updated_at),
-- enforces participant RLS, and adds the RPC layer.

-- 1) call_signals — append-only WebRTC signaling log.
CREATE TABLE IF NOT EXISTS public.call_signals (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      uuid NOT NULL REFERENCES public.call_sessions(id) ON DELETE CASCADE,
    signal_type     text NOT NULL,   -- ring | offer | answer | candidate | accept | decline | end | timeout
    from_profile_id uuid NOT NULL,
    to_profile_id   uuid,
    payload         jsonb,
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- 2) call_sessions — media_type (audio/video) + updated_at (trigger).
ALTER TABLE public.call_sessions ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'audio';
ALTER TABLE public.call_sessions ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 3) RLS on call_sessions (participant-gated).
CREATE POLICY call_sessions_select_participant ON public.call_sessions
    FOR SELECT TO public
    USING (
        public.is_conversation_participant(call_sessions.conversation_id)
        OR public.is_admin_user()
    );

CREATE POLICY call_sessions_insert_participant ON public.call_sessions
    FOR INSERT TO public
    WITH CHECK (
        public.is_conversation_participant(call_sessions.conversation_id)
        OR public.is_admin_user()
    );

CREATE POLICY call_sessions_update_participant ON public.call_sessions
    FOR UPDATE TO public
    USING (
        public.is_conversation_participant(call_sessions.conversation_id)
        OR public.is_admin_user()
    )
    WITH CHECK (
        public.is_conversation_participant(call_sessions.conversation_id)
        OR public.is_admin_user()
    );

-- 4) RLS on call_signals (participant of the session's conversation).
CREATE POLICY call_signals_select_participant ON public.call_signals
    FOR SELECT TO public
    USING (
        public.is_conversation_participant(
            (SELECT conversation_id FROM public.call_sessions WHERE id = call_signals.session_id)
        )
        OR public.is_admin_user()
    );

CREATE POLICY call_signals_insert_participant ON public.call_signals
    FOR INSERT TO public
    WITH CHECK (
        public.is_conversation_participant(
            (SELECT conversation_id FROM public.call_sessions WHERE id = call_signals.session_id)
        )
        OR public.is_admin_user()
    );

-- 5) Realtime: publish call_signals for live signaling.
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_signals;

-- 6) RPCs (deployed separately, one CREATE FUNCTION per call).
--    create_call_session, signal_call, accept_call, decline_call, end_call,
--    fetch_call_sessions, fetch_call_signals, get_turn_credentials.
