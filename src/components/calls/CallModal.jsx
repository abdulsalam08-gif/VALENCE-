import { useState, useEffect, useRef, useCallback } from 'react';
import {
  createMeetLink,
  createCallSession,
  acceptCall,
  declineCall,
  endCall,
  subscribeToCallSignals,
} from '../../lib/calls.js';

const STATE = {
  outgoing: 'Calling…',
  incoming: 'Incoming call',
  active: 'In call',
  ended: 'Call ended',
};

// Opens the Google Meet room externally in a new browser tab. The Meet link
// was created by the caller and carried in the ring signal payload.
const openMeetExternally = (meetUrl) => {
  if (meetUrl) window.open(meetUrl, '_blank', 'noopener,noreferrer');
};

export default function CallModal({ conversationId, sessionId, mediaType, incoming, meetUrl, peerName, myProfileId, onClose }) {
  const [phase, setPhase] = useState(incoming ? 'incoming' : 'outgoing');
  const [error, setError] = useState(null);
  const [meet, setMeet] = useState(meetUrl || null);
  const [joined, setJoined] = useState(false);

  const mySessionRef = useRef(sessionId);
  const unsubscribeRef = useRef(null);
  const meetUrlRef = useRef(meetUrl || null);
  const video = mediaType === 'video';

  const cleanup = useCallback(() => {
    try { if (unsubscribeRef.current) unsubscribeRef.current(); } catch (e) {}
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  // ---- Outgoing call: create Meet link, start session, wait for accept ----
  useEffect(() => {
    if (incoming) return;
    let active = true;
    (async () => {
      try {
        // 1) Provision a Google Meet room (external).
        const meet = await createMeetLink(peerName, mediaType);
        if (!active) return;
        meetUrlRef.current = meet.meetUrl;
        setMeet(meet.meetUrl);

        // 2) Create the call session; the ring signal carries the Meet URL.
        const res = await createCallSession(conversationId, 'one_to_one', mediaType, meet.meetUrl);
        if (!active) return;
        if (res.error) throw new Error(res.error);
        mySessionRef.current = res.session_id;

        // 3) Listen for the callee's accept / decline / end.
        unsubscribeRef.current = subscribeToCallSignals(mySessionRef.current, (sig) => {
          if (!active) return;
          if (sig.signal_type === 'accept' && sig.from_profile_id !== myProfileId) {
            // Callee accepted → open Meet externally and go active.
            setPhase('active');
            setTimeout(() => openMeetExternally(meetUrlRef.current), 300);
          } else if (sig.signal_type === 'decline' && sig.from_profile_id !== myProfileId) {
            setError('Call declined');
            setPhase('ended');
            setTimeout(onClose, 900);
          } else if (sig.signal_type === 'end') {
            setPhase('ended');
            setTimeout(onClose, 600);
          }
        });
        setPhase('outgoing');
      } catch (e) {
        if (active) setError(e.message || 'Failed to start call');
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Incoming call: subscribe; on accept/decline act ----
  useEffect(() => {
    if (!incoming || !sessionId) return;
    mySessionRef.current = sessionId;
    unsubscribeRef.current = subscribeToCallSignals(sessionId, (sig) => {
      if (sig.signal_type === 'end') {
        setPhase('ended');
        setTimeout(onClose, 600);
      }
    });
    return () => { try { if (unsubscribeRef.current) unsubscribeRef.current(); } catch (e) {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming, sessionId]);

  const doAccept = async () => {
    try {
      const res = await acceptCall(mySessionRef.current);
      if (res.error) throw new Error(res.error);
      setPhase('active');
      // Open the Meet room externally (link came from the ring payload).
      setTimeout(() => openMeetExternally(meetUrlRef.current || meetUrl), 300);
    } catch (e) { setError(e.message); }
  };

  const doDecline = async () => {
    try { await declineCall(mySessionRef.current); } catch (e) {}
    cleanup();
    setPhase('ended');
    setTimeout(onClose, 400);
  };

  const doEnd = async () => {
    try { await endCall(mySessionRef.current); } catch (e) {}
    cleanup();
    setPhase('ended');
    setTimeout(onClose, 500);
  };

  const joinNow = () => openMeetExternally(meetUrlRef.current || meetUrl);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4" onClick={phase === 'ended' ? onClose : undefined}>
      <div className="v-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">{peerName || 'Call'}</h3>
            <p className="text-xs text-[#9AA4B2]">{STATE[phase]} · {mediaType} · Google Meet</p>
          </div>
          <button onClick={phase === 'ended' ? onClose : doEnd} className="v-btn-ghost px-2 py-1 text-xs">✕</button>
        </div>

        <div className={`relative mb-4 overflow-hidden rounded-2xl bg-[#0B0F14] ${video ? 'aspect-video' : 'aspect-square'} flex items-center justify-center`}>
          <span className="text-4xl">{phase === 'outgoing' ? '📞' : phase === 'incoming' ? '📞' : phase === 'active' ? '🟢' : '📵'}</span>
        </div>

        {error && <div className="mb-3 rounded-lg border border-[#EA3943]/30 bg-[#EA3943]/10 px-3 py-2 text-xs text-[#EA3943]">{error}</div>}

        {phase === 'active' && meet && !joined && (
          <div className="mb-3 rounded-lg border border-[#1f6feb]/30 bg-[#1f6feb]/10 px-3 py-2 text-xs text-[#79c0ff]">
            A Google Meet tab has opened. If it didn't, use the button below.
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          {phase === 'incoming' && (
            <>
              <button onClick={doDecline} className="v-btn-danger px-5 py-2 text-xs">Decline</button>
              <button onClick={doAccept} className="v-btn-primary px-5 py-2 text-xs">Accept</button>
            </>
          )}
          {phase === 'outgoing' && (
            <button onClick={doEnd} className="v-btn-danger px-5 py-2 text-xs">Cancel</button>
          )}
          {phase === 'active' && (
            <>
              {meet && (
                <button onClick={() => { setJoined(true); joinNow(); }} className="v-btn-secondary px-4 py-2 text-xs">Open Meet</button>
              )}
              <button onClick={doEnd} className="v-btn-danger px-5 py-2 text-xs">End</button>
            </>
          )}
          {phase === 'ended' && (
            <button onClick={onClose} className="v-btn-primary px-5 py-2 text-xs">Close</button>
          )}
        </div>
      </div>
    </div>
  );
}
