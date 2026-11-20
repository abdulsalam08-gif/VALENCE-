// Calls library: Google Meet external calls.
//
// Rewired from in-app WebRTC to external Google Meet. The call-control layer
// (call_sessions + call_signals via Supabase Realtime) is unchanged — it still
// handles ring / accept / decline / end coordination. The media now happens in
// a Google Meet room: the caller creates a Meet link (via the Vercel serverless
// endpoint /api/meet/create), the link rides in the ring signal payload, and
// both parties open the Meet room externally in a new browser tab. No in-app
// media, no WebRTC, no ICE/STUN/TURN.

import { supabase } from './supabase.js';

function unwrap(result) {
  if (result.error) throw new Error(result.error.message || 'Something went wrong');
  return result.data;
}

/* ------------------------------------------------------------------ */
/* Google Meet link creation (Vercel serverless endpoint)              */
/* ------------------------------------------------------------------ */

// POST /api/meet/create — creates a Google Meet room via the Calendar API
// (works with a personal Gmail account; the Meet spaces.create API needs
// Workspace). Returns { ok, meetUrl, meetCode, eventId, summary }.
export async function createMeetLink(peerName, callType = 'audio') {
  const res = await fetch('/api/meet/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ peerName, callType }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Failed to create Google Meet link (${res.status})`);
  }
  return data; // { meetUrl, meetCode, eventId, summary }
}

/* ------------------------------------------------------------------ */
/* Call session RPCs (coordination — unchanged)                        */
/* ------------------------------------------------------------------ */

export async function createCallSession(conversationId, callType = 'one_to_one', mediaType = 'audio', meetUrl = null) {
  const { data, error } = await supabase.rpc('create_call_session', {
    p_conversation_id: conversationId,
    p_call_type: callType,
    p_media_type: mediaType,
    p_meet_url: meetUrl,
  });
  if (error) throw new Error(error.message || 'Failed to start call');
  return data;
}

export async function signalCall(sessionId, signalType, toProfileId, payload) {
  const { data, error } = await supabase.rpc('signal_call', {
    p_session_id: sessionId,
    p_signal_type: signalType,
    p_to_profile_id: toProfileId || null,
    p_payload: payload || null,
  });
  if (error) throw new Error(error.message || 'Failed to send signal');
  return data;
}

export async function acceptCall(sessionId) {
  const { data, error } = await supabase.rpc('accept_call', { p_session_id: sessionId });
  if (error) throw new Error(error.message || 'Failed to accept call');
  return data;
}

export async function declineCall(sessionId) {
  const { data, error } = await supabase.rpc('decline_call', { p_session_id: sessionId });
  if (error) throw new Error(error.message || 'Failed to decline call');
  return data;
}

export async function endCall(sessionId) {
  const { data, error } = await supabase.rpc('end_call', { p_session_id: sessionId });
  if (error) throw new Error(error.message || 'Failed to end call');
  return data;
}

export async function fetchCallSessions(conversationId) {
  const { data, error } = await supabase.rpc('fetch_call_sessions', { p_conversation_id: conversationId });
  if (error) throw new Error(error.message || 'Failed to load call log');
  return data || [];
}

export async function fetchCallSignals(sessionId) {
  const { data, error } = await supabase.rpc('fetch_call_signals', { p_session_id: sessionId });
  if (error) throw new Error(error.message || 'Failed to load signals');
  return data || [];
}

/* ------------------------------------------------------------------ */
/* Realtime signaling subscription (coordination — unchanged)          */
/* ------------------------------------------------------------------ */

// Subscribe to INSERT events on call_signals. Pass sessionId to filter to one
// session, or null to receive all signals (filter in the handler). onSignal(newRow).
// Falls back gracefully if Realtime is unavailable.
export function subscribeToCallSignals(sessionId, onSignal) {
  if (!supabase) return () => {};
  const filter = sessionId ? `session_id=eq.${sessionId}` : null;
  const channel = supabase.channel(`call_signals:${sessionId || 'all'}`, {
    config: { broadcast: { self: false }, presence: { active: false } },
  });
  channel
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'call_signals',
      ...(filter ? { filter } : {}),
    }, (payload) => {
      onSignal && onSignal(payload.new);
    })
    .subscribe();
  return () => {
    try { supabase.removeChannel(channel); } catch (e) { /* ignore */ }
  };
}
