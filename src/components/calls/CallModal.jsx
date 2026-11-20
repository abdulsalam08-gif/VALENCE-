import { useState, useEffect, useRef, useCallback } from 'react';
import {
  createCallSession, signalCall, acceptCall, declineCall, endCall,
  buildIceServers, subscribeToCallSignals,
} from '../../lib/calls.js';

const STATE = {
  outgoing: 'Calling…',
  incoming: 'Incoming call',
  active: 'In call',
  ended: 'Call ended',
};

export default function CallModal({ conversationId, sessionId, mediaType, incoming, peerName, myProfileId, onClose }) {
  const [phase, setPhase] = useState(incoming ? 'incoming' : 'outgoing');
  const [error, setError] = useState(null);
  const [remoteUrl, setRemoteUrl] = useState(null);
  const [localUrl, setLocalUrl] = useState(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const iceCandidatesRef = useRef([]);
  const pendingOfferRef = useRef(null);
  const mySessionRef = useRef(sessionId);
  const unsubscribeRef = useRef(null);
  const video = mediaType === 'video';

  const cleanup = useCallback(() => {
    try { if (unsubscribeRef.current) unsubscribeRef.current(); } catch (e) {}
    try { if (pcRef.current) pcRef.current.close(); } catch (e) {}
    try { if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {}
    setLocalUrl(null);
    setRemoteUrl(null);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const attachLocal = (stream) => {
    localStreamRef.current = stream;
    if (stream) setLocalUrl(URL.createObjectURL(stream));
  };

  const setupPeerConnection = useCallback(async (iceServers) => {
    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;
    const local = localStreamRef.current;
    if (local) local.getTracks().forEach((t) => pc.addTrack(t, local));
    pc.onicecandidate = (e) => {
      if (e.candidate && mySessionRef.current) {
        signalCall(mySessionRef.current, 'candidate', null, { candidate: e.candidate.toJSON() }).catch(() => {});
      }
    };
    pc.ontrack = (e) => {
      remoteStreamRef.current = e.streams[0];
      setRemoteUrl(URL.createObjectURL(e.streams[0]));
    };
    return pc;
  }, []);

  const handleSignal = useCallback(async (sig) => {
    const pc = pcRef.current;
    if (!pc || !mySessionRef.current) return;
    if (sig.signal_type === 'offer' && sig.from_profile_id !== myProfileId) {
      const offer = sig.payload?.sdp;
      if (!offer) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        signalCall(mySessionRef.current, 'answer', sig.from_profile_id, { sdp: answer }).catch(() => {});
      } catch (e) { setError(e.message); }
    } else if (sig.signal_type === 'answer' && sig.from_profile_id !== myProfileId) {
      const answer = sig.payload?.sdp;
      if (!answer) return;
      try { await pc.setRemoteDescription(new RTCSessionDescription(answer)); } catch (e) { setError(e.message); }
    } else if (sig.signal_type === 'candidate' && sig.from_profile_id !== myProfileId) {
      const cand = sig.payload?.candidate;
      if (!cand) return;
      try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) { /* ignore late candidates */ }
    } else if (sig.signal_type === 'end') {
      cleanup();
      setPhase('ended');
      setTimeout(onClose, 600);
    } else if (sig.signal_type === 'decline') {
      setError('Call declined');
      cleanup();
      setPhase('ended');
      setTimeout(onClose, 800);
    }
  }, [cleanup, myProfileId, onClose]);

  // Outgoing call: create session, get media, wait for accept, then offer.
  useEffect(() => {
    if (incoming) return;
    let active = true;
    (async () => {
      try {
        const iceServers = await buildIceServers();
        const res = await createCallSession(conversationId, 'one_to_one', mediaType);
        if (!active) return;
        if (res.error) throw new Error(res.error);
        mySessionRef.current = res.session_id;
        const stream = await navigator.mediaDevices.getUserMedia({ video, audio: true });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        attachLocal(stream);
        unsubscribeRef.current = subscribeToCallSignals(mySessionRef.current, handleSignal);
        // Wait for the callee's accept before creating the offer.
        const poll = setInterval(async () => {
          if (!active || !pcRef.current) {
            // Once accept arrives, the signal handler below creates the PC+offer.
          }
        }, 1000);
        // Listen for accept via a dedicated subscription effect.
        setPhase('outgoing');
        // Store iceServers for when accept fires.
        window.__callIceServers = iceServers;
        // We rely on handleSignal for accept; handle accept here:
        const acceptHandler = async (sig) => {
          if (sig.signal_type === 'accept' && sig.from_profile_id !== myProfileId) {
            clearInterval(poll);
            try {
              const pc = await setupPeerConnection(window.__callIceServers || iceServers);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              signalCall(mySessionRef.current, 'offer', sig.from_profile_id, { sdp: offer }).catch(() => {});
              setPhase('active');
            } catch (e) { setError(e.message); }
          }
        };
        // Re-subscribe to also catch accept (handleSignal ignores accept; add separate).
        unsubscribeRef.current = subscribeToCallSignals(mySessionRef.current, (sig) => {
          handleSignal(sig);
          acceptHandler(sig);
        });
      } catch (e) {
        if (active) setError(e.message || 'Failed to start call');
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Incoming call: subscribe to signals; on accept/decline act.
  useEffect(() => {
    if (!incoming || !sessionId) return;
    mySessionRef.current = sessionId;
    unsubscribeRef.current = subscribeToCallSignals(sessionId, handleSignal);
    return () => { try { if (unsubscribeRef.current) unsubscribeRef.current(); } catch (e) {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming, sessionId]);

  const doAccept = async () => {
    try {
      const res = await acceptCall(mySessionRef.current);
      if (res.error) throw new Error(res.error);
      const stream = await navigator.mediaDevices.getUserMedia({ video, audio: true });
      attachLocal(stream);
      const iceServers = await buildIceServers();
      await setupPeerConnection(iceServers);
      setPhase('active');
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

  const toggleMute = () => {
    const tracks = localStreamRef.current?.getAudioTracks() || [];
    tracks.forEach((t) => { t.enabled = !t.enabled; });
  };

  const toggleCam = () => {
    const tracks = localStreamRef.current?.getVideoTracks() || [];
    tracks.forEach((t) => { t.enabled = !t.enabled; });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4" onClick={phase === 'ended' ? onClose : undefined}>
      <div className="v-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">{peerName || 'Call'}</h3>
            <p className="text-xs text-[#9AA4B2]">{STATE[phase]} · {mediaType}</p>
          </div>
          <button onClick={phase === 'ended' ? onClose : doEnd} className="v-btn-ghost px-2 py-1 text-xs">✕</button>
        </div>

        <div className={`relative mb-4 overflow-hidden rounded-2xl bg-[#0B0F14] ${video ? 'aspect-video' : 'aspect-square'} flex items-center justify-center`}>
          {phase === 'active' && remoteUrl ? (
            video ? (
              <video src={remoteUrl} autoPlay playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                <span className="text-5xl">🎙️</span>
                <audio src={remoteUrl} autoPlay />
              </div>
            )
          ) : (
            <span className="text-4xl">{phase === 'outgoing' ? '📞' : phase === 'incoming' ? '📞' : '📵'}</span>
          )}
          {phase === 'active' && video && localUrl && (
            <video src={localUrl} muted playsInline className="absolute bottom-3 right-3 h-24 w-32 rounded-lg object-cover border border-white/10" />
          )}
        </div>

        {error && <div className="mb-3 rounded-lg border border-[#EA3943]/30 bg-[#EA3943]/10 px-3 py-2 text-xs text-[#EA3943]">{error}</div>}

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
              <button onClick={toggleMute} className="v-btn-secondary px-4 py-2 text-xs">🎤</button>
              {video && <button onClick={toggleCam} className="v-btn-secondary px-4 py-2 text-xs">📷</button>}
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
