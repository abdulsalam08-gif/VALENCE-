-- Phase 11 — Direct 1:1 & group messaging
-- Supabase Realtime, attachments, voice notes, read receipts, mute, block & report.
--
-- Tables already exist from Phase 2 (names differ from the spec overview):
--   conversations, conversation_members, messages, message_attachments.
-- The Phase 2 helpers is_conversation_participant() and is_blocked_between() were
-- stale (referenced non-existent tables/columns). This migration realigns them,
-- adds a `muted` column for mute, enforces membership RLS, and adds the RPC layer.

-- 1) Realign is_conversation_participant() to conversation_members (profile_id).
CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_convo_id uuid, p_uid uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $func$
    SELECT EXISTS (
        SELECT 1
        FROM public.conversation_members cm
        JOIN public.profiles p ON p.id = cm.profile_id
        WHERE cm.conversation_id = p_convo_id
          AND p.user_id = COALESCE(p_uid, auth.uid())
    );
$func$;

-- 2) Realign is_blocked_between() to Phase 9 user_blocks columns.
CREATE OR REPLACE FUNCTION public.is_blocked_between(p_a uuid, p_b uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $func$
    SELECT EXISTS (
        SELECT 1 FROM public.user_blocks b
        WHERE (b.blocker_profile_id = p_a AND b.blocked_profile_id = p_b)
           OR (b.blocker_profile_id = p_b AND b.blocked_profile_id = p_a)
    );
$func$;

-- 3) Mute column on conversation_members.
ALTER TABLE public.conversation_members ADD COLUMN IF NOT EXISTS muted boolean NOT NULL DEFAULT false;

-- 4) RLS: enforce membership-based visibility (replace permissive SELECT policies).
--    conversations: visible to participants.
DROP POLICY IF EXISTS conversations_select_member ON public.conversations;
CREATE POLICY conversations_select_member ON public.conversations
    FOR SELECT TO public
    USING (public.is_conversation_participant(conversations.id));

--    conversation_members: a participant sees the member list of their conversations.
DROP POLICY IF EXISTS conversation_members_select_member ON public.conversation_members;
CREATE POLICY conversation_members_select_member ON public.conversation_members
    FOR SELECT TO public
    USING (
        public.is_conversation_participant(conversation_members.conversation_id)
        OR public.is_admin_user()
    );

--    messages: visible to participants of the conversation.
DROP POLICY IF EXISTS messages_select_member ON public.messages;
CREATE POLICY messages_select_member ON public.messages
    FOR SELECT TO public
    USING (public.is_conversation_participant(messages.conversation_id));

--    message_attachments: SELECT gated on parent-message conversation membership.
CREATE POLICY message_attachments_select_member ON public.message_attachments
    FOR SELECT TO public
    USING (
        public.is_conversation_participant(
            (SELECT conversation_id FROM public.messages WHERE id = message_attachments.message_id)
        )
        OR public.is_admin_user()
    );

--    message_attachments INSERT: only the message sender attaches files.
CREATE POLICY message_attachments_insert_sender ON public.message_attachments
    FOR INSERT TO public
    WITH CHECK (
        message_attachments.message_id IN (
            SELECT id FROM public.messages
            WHERE sender_profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        )
    );

-- 5) RPCs (deployed separately, one CREATE FUNCTION per call).
--    create_direct_conversation, create_group_conversation, send_message,
--    fetch_conversations, fetch_conversation_messages, fetch_conversation_members,
--    mark_conversation_read, toggle_conversation_mute, leave_conversation,
--    report_message.
