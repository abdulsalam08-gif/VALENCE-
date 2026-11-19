// Messaging library: 1:1 & group conversations, messages, attachments, voice
// notes, read receipts, mute, block & report. Realtime subscription helper.

import { supabase } from './supabase.js';

function unwrap(result) {
  if (result.error) throw new Error(result.error.message || 'Something went wrong');
  return result.data;
}

/* ------------------------------------------------------------------ */
/* Conversations                                                       */
/* ------------------------------------------------------------------ */

export async function createDirectConversation(otherProfileId) {
  const { data, error } = await supabase.rpc('create_direct_conversation', { p_other_profile_id: otherProfileId });
  if (error) throw new Error(error.message || 'Failed to open conversation');
  return data;
}

export async function createGroupConversation(name, memberProfileIds) {
  const { data, error } = await supabase.rpc('create_group_conversation', {
    p_name: name,
    p_member_profile_ids: memberProfileIds || [],
  });
  if (error) throw new Error(error.message || 'Failed to create group');
  return data;
}

export async function fetchConversations() {
  const { data, error } = await supabase.rpc('fetch_conversations');
  if (error) throw new Error(error.message || 'Failed to load conversations');
  return data || [];
}

export async function fetchConversationMembers(conversationId) {
  const { data, error } = await supabase.rpc('fetch_conversation_members', { p_conversation_id: conversationId });
  if (error) throw new Error(error.message || 'Failed to load members');
  return data || [];
}

export async function leaveConversation(conversationId) {
  const { data, error } = await supabase.rpc('leave_conversation', { p_conversation_id: conversationId });
  if (error) throw new Error(error.message || 'Failed to leave conversation');
  return data;
}

export async function toggleConversationMute(conversationId) {
  const { data, error } = await supabase.rpc('toggle_conversation_mute', { p_conversation_id: conversationId });
  if (error) throw new Error(error.message || 'Failed to update mute');
  return data;
}

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

export async function fetchConversationMessages(conversationId, limit) {
  const { data, error } = await supabase.rpc('fetch_conversation_messages', {
    p_conversation_id: conversationId,
    p_limit: limit || 50,
  });
  if (error) throw new Error(error.message || 'Failed to load messages');
  return data || [];
}

export async function sendMessage(conversationId, { content, messageType, attachmentUrl, attachmentType, attachmentName }) {
  const { data, error } = await supabase.rpc('send_message', {
    p_conversation_id: conversationId,
    p_content: content || null,
    p_message_type: messageType || 'text',
    p_attachment_url: attachmentUrl || null,
    p_attachment_type: attachmentType || null,
    p_attachment_name: attachmentName || null,
  });
  if (error) throw new Error(error.message || 'Failed to send message');
  return data;
}

export async function markConversationRead(conversationId) {
  const { data, error } = await supabase.rpc('mark_conversation_read', { p_conversation_id: conversationId });
  if (error) throw new Error(error.message || 'Failed to mark read');
  return data;
}

export async function reportMessage(messageId, reason) {
  const { data, error } = await supabase.rpc('report_message', { p_message_id: messageId, p_reason: reason });
  if (error) throw new Error(error.message || 'Failed to submit report');
  return data;
}

/* ------------------------------------------------------------------ */
/* Realtime                                                            */
/* ------------------------------------------------------------------ */

// Subscribe to INSERT events on the messages table for a conversation.
// The caller receives each new message via onMessage. Returns an unsubscribe fn.
// (Requires `messages` to be in the Supabase Realtime publication; degrades
// gracefully — polling still works if Realtime is unavailable.)
export function subscribeToMessages(conversationId, onMessage) {
  if (!supabase) return () => {};
  const channel = supabase.channel(`messages:${conversationId}`, {
    config: { broadcast: { self: false }, presence: { active: false } },
  });
  channel
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    }, (payload) => {
      onMessage && onMessage(payload.new);
    })
    .subscribe();
  return () => {
    try { supabase.removeChannel(channel); } catch (e) { /* ignore */ }
  };
}

/* ------------------------------------------------------------------ */
/* Attachments & voice notes (private message-attachments bucket)     */
/* ------------------------------------------------------------------ */

const ATTACH_BUCKET = 'message-attachments';

// Upload a file/blob to the private bucket; returns the object path.
export async function uploadAttachment(file, conversationId) {
  if (!supabase) throw new Error('Supabase not configured');
  const uid = (supabase.auth.getUser?.() && (await supabase.auth.getUser()).data?.user?.id) || 'anon';
  const ext = (file.name && file.name.split('.').pop()) || 'bin';
  const path = `${uid}/${conversationId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(ATTACH_BUCKET).upload(path, file, { upsert: false });
  if (error) throw new Error(error.message || 'Upload failed');
  return path;
}

// Resolve a stored object path to a time-limited signed URL for display.
export async function getAttachmentSignedUrl(path) {
  if (!supabase || !path) return path;
  const { data, error } = await supabase.storage.from(ATTACH_BUCKET).createSignedUrl(path, 3600);
  if (error) return path;
  return data?.signedUrl || path;
}
