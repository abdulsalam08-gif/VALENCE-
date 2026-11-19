// WebRTC calls library: call sessions, signaling (ICE/STUN/TURN), ring/accept/
// decline/end, call logs & TURN credentials.

import { supabase } from './supabase.js';

function unwrap(result) {
  if (result.error) throw new Error(result.error.message || 'Something went wrong');
  return result.data;
}

/* ------------------------------------------------------------------ */
/* RPCs                                                                */
/* ------------------------------------------------------------------ */

export async function createCallSession(conversationId, callType = 'one_to_one', mediaType = 'audio') {
  const { data, error } = await supabase.rpc('create_call_session', {
    p_conversation_id: conversationId,
    p_call_type: callType,
    p_media_type: mediaType,
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

export async function getTurnCredentials() {
  const { data, error } = await supabase.rpc('get_turn_credentials');
  if (error) throw new Error(error.message || 'Failed to load TURN config');
  return data || { configured: false };
}

/* ------------------------------------------------------------------ */
/* Realtime signaling subscription                                     */
/* ------------------------------------------------------------------ */

// Subscribe to INSERT events on call_signals. Pass sessionId to filter to one
// session, or null to receive all signals (filter in the handler). onSignal(newRow).
// Falls back gracefully if Realtime is unavailable (polling still works).
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

/* ------------------------------------------------------------------ */
/* WebRTC ICE server config                                             */
/* ------------------------------------------------------------------ */

// Build ICE servers: public STUN always; TURN added when configured server-side.
export async function buildIceServers() {
  const servers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];
  try {
    const turn = await getTurnCredentials();
    if (turn && turn.configured && turn.turn_server_url) {
      servers.push({
        urls: turn.turn_server_url,
        username: turn.turn_username || undefined,
        credential: turn.turn_credential || undefined,
      });
    }
  } catch (e) { /* STUN-only fallback */ }
  return servers;
}
