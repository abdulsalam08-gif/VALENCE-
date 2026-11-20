import { useState, useEffect, useCallback, useRef } from 'react';
import { usePlatform } from '../context/PlatformContext.jsx';
import {
  fetchConversations, fetchConversationMessages, fetchConversationMembers,
  sendMessage, markConversationRead, leaveConversation, toggleConversationMute,
  createDirectConversation, createGroupConversation, reportMessage,
  uploadAttachment, getAttachmentSignedUrl, subscribeToMessages,
} from '../lib/messaging.js';
import { fetchDiscoveryProfiles, toggleBlock } from '../lib/community.js';
import { subscribeToCallSignals } from '../lib/calls.js';
import CallModal from '../components/calls/CallModal.jsx';

function initials(name) {
  return (name || 'V').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function fmtTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ------------------------------------------------------------------ */
/* Message bubble                                                      */
/* ------------------------------------------------------------------ */

function MessageBubble({ msg, mine, onReport }) {
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    let active = true;
    const att = (msg.attachments || [])[0];
    if (att && att.file_url) {
      getAttachmentSignedUrl(att.file_url).then((u) => {
        if (!active) return;
        if (msg.message_type === 'voice') setVoiceUrl(u);
        else if (msg.message_type === 'image') setImgUrl(u);
        else if (msg.message_type === 'file') setFileUrl(u);
      });
    }
    return () => { active = false; };
  }, [msg.attachments, msg.message_type]);

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${
        mine ? 'bg-[#16C784] text-[#06130D]' : 'bg-[#1C2530] text-[#E4E9F0]'
      }`}>
        {!mine && <div className="text-[10px] font-semibold opacity-70 mb-0.5">{msg.sender_name}</div>}
        {msg.message_type === 'text' && <div className="whitespace-pre-wrap break-words">{msg.content}</div>}
        {msg.message_type === 'image' && imgUrl && (
          <img src={imgUrl} alt="attachment" className="max-h-60 rounded-lg mt-1" />
        )}
        {msg.message_type === 'voice' && voiceUrl && (
          <audio controls src={voiceUrl} className="mt-1 h-9" />
        )}
        {msg.message_type === 'file' && fileUrl && (
          <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 underline">
            📎 {msg.content || 'Attachment'}
          </a>
        )}
        <div className={`mt-0.5 text-[10px] ${mine ? 'opacity-70' : 'opacity-50'}`}>{fmtTime(msg.created_at)}</div>
      </div>
      {!mine && (
        <button onClick={() => onReport(msg)} title="Report" className="ml-1 self-end text-[10px] text-[#667085] hover:text-[#EA3943]">⚑</button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* New chat / new group modals                                         */
/* ------------------------------------------------------------------ */

function PickerModal({ title, onClose, onConfirm, confirmLabel }) {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [name, setName] = useState('');

  useEffect(() => {
    fetchDiscoveryProfiles().then(setProfiles).catch(() => {});
  }, []);

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="v-card w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="v-btn-ghost px-2 py-1 text-xs">✕</button>
        </div>
        {title === 'New group' && (
          <input className="v-input mb-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" />
        )}
        <div className="max-h-72 space-y-2 overflow-y-auto">
          {profiles.length === 0 ? (
            <p className="text-sm text-[#9AA4B2]">No profiles available.</p>
          ) : profiles.map((p) => (
            <button
              key={p.profile_id}
              onClick={() => toggle(p.profile_id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                selected.has(p.profile_id) ? 'border-[#16C784] bg-[#16C784]/10' : 'border-white/[0.08] hover:bg-white/[0.04]'
              }`}
            >
              <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#16C784]/10 text-[#16C784] text-xs font-bold">{initials(p.display_name)}</span>
              <span className="flex-1 truncate text-sm text-[#F4F6F9]">{p.display_name}</span>
              <span className="text-xs text-[#16C784]">{selected.has(p.profile_id) ? '✓' : ''}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => onConfirm(title === 'New group' ? name : null, [...selected])}
          disabled={title === 'New group' ? !name.trim() || selected.size === 0 : selected.size === 0}
          className="v-btn-primary mt-4 w-full py-2 text-xs"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Messaging page                                                       */
/* ------------------------------------------------------------------ */

export default function MessagingPage() {
  const { user, profile } = usePlatform();
  const myProfileId = profile?.id;
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [text, setText] = useState('');
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(null);
  const [callModal, setCallModal] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef(null);
  const scrollRef = useRef(null);

  const flash = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadConversations = useCallback(async () => {
    try { setConversations(await fetchConversations()); }
    catch (e) { flash(e.message, true); }
  }, [flash]);

  useEffect(() => { if (user) loadConversations(); }, [user, loadConversations]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeId) return;
    let active = true;
    (async () => {
      try {
        const [ms, mem] = await Promise.all([
          fetchConversationMessages(activeId, 100),
          fetchConversationMembers(activeId),
        ]);
        if (!active) return;
        setMessages(ms || []);
        setMembers(mem || []);
        markConversationRead(activeId).catch(() => {});
        loadConversations();
      } catch (e) { flash(e.message, true); }
    })();
    return () => { active = false; };
  }, [activeId, flash, loadConversations]);

  // Realtime subscription for the active conversation
  useEffect(() => {
    if (!activeId) return;
    const unsub = subscribeToMessages(activeId, (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, { ...newMsg, sender_name: newMsg.sender_profile_id, attachments: [] }];
      });
      markConversationRead(activeId).catch(() => {});
      loadConversations();
    });
    return unsub;
  }, [activeId, loadConversations]);

  // Incoming call detection: ring signals addressed to me in the active conversation.
  useEffect(() => {
    if (!activeId || !myProfileId) return;
    const unsub = subscribeToCallSignals(null, (sig) => {
      if (sig.signal_type === 'ring' && sig.to_profile_id === myProfileId && sig.payload?.conversation_id === activeId) {
        setCallModal({ sessionId: sig.session_id, incoming: true, mediaType: sig.payload?.media_type || 'audio', meetUrl: sig.payload?.meet_url || null, peerName: activeConvo?.peer_name || 'Call' });
      }
    });
    return unsub;
  }, [activeId, myProfileId, activeConvo]);

  const startCall = (mediaType) => {
    if (!activeId) return;
    setCallModal({ sessionId: null, incoming: false, mediaType, peerName: activeConvo?.peer_name || 'Call' });
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const runAction = async (fn, successMsg, refresh) => {
    setBusy(true);
    try {
      const res = await fn();
      if (res && res.error) throw new Error(res.error);
      flash(successMsg);
      if (refresh) refresh();
    } catch (e) { flash(e.message, true); }
    setBusy(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || !activeId) return;
    await runAction(() => sendMessage(activeId, { content, messageType: 'text' }),
      'Sent', () => { setText(''); loadConversations(); });
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !activeId) return;
    setBusy(true);
    try {
      const path = await uploadAttachment(file, activeId);
      const type = file.type.startsWith('image/') ? 'image' : 'file';
      await sendMessage(activeId, { content: file.name, messageType: type, attachmentUrl: path, attachmentType: file.type, attachmentName: file.name });
      flash('Attachment sent');
      loadConversations();
    } catch (err) { flash(err.message, true); }
    setBusy(false);
  };

  const startVoice = () => {
    if (!activeId) return;
    navigator.mediaDevices?.getUserMedia({ audio: true }).then((stream) => {
      const rec = new MediaRecorder(stream);
      mediaRef.current = rec;
      const chunks = [];
      rec.ondataavailable = (ev) => chunks.push(ev.data);
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        try {
          const path = await uploadAttachment(blob, activeId);
          await sendMessage(activeId, { messageType: 'voice', attachmentUrl: path, attachmentType: 'audio/webm' });
          flash('Voice note sent');
          loadConversations();
        } catch (err) { flash(err.message, true); }
      };
      rec.start();
      setRecording(true);
    }).catch(() => flash('Microphone access denied', true));
  };

  const stopVoice = () => {
    if (mediaRef.current && mediaRef.current.state !== 'inactive') mediaRef.current.stop();
    setRecording(false);
  };

  const handleMute = () => runAction(() => toggleConversationMute(activeId), 'Mute updated', loadConversations);
  const handleLeave = () => runAction(() => leaveConversation(activeId), 'Left conversation', () => { setActiveId(null); loadConversations(); });
  const handleReport = (msg) => runAction(() => reportMessage(msg.id, 'Inappropriate message'), 'Report submitted');

  const handleNewChat = async (name, ids) => {
    setModal(null);
    if (ids.length !== 1) return;
    await runAction(() => createDirectConversation(ids[0]), 'Conversation opened', async (res) => {
      if (res && res.conversation_id) { setActiveId(res.conversation_id); loadConversations(); }
    });
  };

  const handleNewGroup = async (name, ids) => {
    setModal(null);
    await runAction(() => createGroupConversation(name, ids), 'Group created', async (res) => {
      if (res && res.conversation_id) { setActiveId(res.conversation_id); loadConversations(); }
    });
  };

  const handleBlockPeer = async () => {
    const other = members.find((m) => m.profile_id !== myProfileId);
    if (!other) { flash('No peer to block', true); return; }
    await runAction(() => toggleBlock(other.profile_id), 'Peer blocked');
  };

  if (!user) return null;
  const activeConvo = conversations.find((c) => c.id === activeId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#11161C] to-[#0B0F14] text-[#E4E9F0]">
      <div className="mx-auto flex h-[calc(100vh-0px)] w-full max-w-6xl px-4 sm:px-6 py-4">
        {toast && (
          <div className={`absolute left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl border px-4 py-2 text-sm font-medium ${
            toast.isError ? 'border-[#EA3943]/30 bg-[#EA3943]/10 text-[#EA3943]' : 'border-[#16C784]/30 bg-[#16C784]/10 text-[#16C784]'
          }`}>{toast.msg}</div>
        )}

        {/* Conversation list */}
        <aside className={`v-card flex w-full flex-col lg:w-72 lg:flex-none ${activeId ? 'hidden lg:flex' : 'flex'}`}>
          <div className="border-b border-white/[0.07] p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold text-white">Messages</h2>
              <div className="flex gap-1">
                <button onClick={() => setModal('new-chat')} className="v-btn-ghost px-2 py-1 text-xs">＋ Chat</button>
                <button onClick={() => setModal('new-group')} className="v-btn-ghost px-2 py-1 text-xs">＋ Group</button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto space-y-1.5">
              {conversations.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#9AA4B2]">No conversations yet. Start a new chat.</p>
              ) : conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full rounded-xl p-3 text-left transition-colors ${
                    activeId === c.id ? 'bg-[#16C784]/10' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#F4F6F9] truncate">{c.conversation_type === 'group' ? '👥 ' : ''}{c.peer_name || c.last_sender_name || 'Conversation'}</span>
                    {c.unread_count > 0 && !c.muted && <span className="flex-none rounded-full bg-[#16C784] px-1.5 py-0.5 text-[10px] font-bold text-[#06130D]">{c.unread_count}</span>}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-[#9AA4B2]">{c.last_message || 'No messages yet'}{c.muted ? ' · 🔕' : ''}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat view */}
        <section className={`v-card flex w-full flex-col ${activeId ? 'flex' : 'hidden lg:flex'}`}>
          {activeId && activeConvo ? (
            <>
              <div className="flex items-center justify-between border-b border-white/[0.07] p-3">
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">
                    {activeConvo.conversation_type === 'group' ? '👥 ' : ''}{activeConvo.peer_name || activeConvo.last_sender_name || 'Conversation'}
                  </div>
                  <div className="text-[11px] text-[#9AA4B2]">{members.length} members</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startCall('audio')} title="Audio call" className="v-btn-ghost px-2 py-1 text-xs">📞</button>
                  <button onClick={() => startCall('video')} title="Video call" className="v-btn-ghost px-2 py-1 text-xs">📹</button>
                  {activeConvo.conversation_type === 'direct' && (
                    <button onClick={handleBlockPeer} title="Block peer" className="v-btn-ghost px-2 py-1 text-xs">⛔</button>
                  )}
                  <button onClick={handleMute} title="Mute" className="v-btn-ghost px-2 py-1 text-xs">{activeConvo.muted ? '🔕' : '🔔'}</button>
                  <button onClick={handleLeave} title="Leave" className="v-btn-ghost px-2 py-1 text-xs">Exit</button>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <p className="py-10 text-center text-sm text-[#9AA4B2]">No messages yet. Say hello 👋</p>
                ) : messages.map((m) => (
                  <MessageBubble key={m.id} msg={m} mine={m.sender_profile_id === myProfileId} onReport={handleReport} />
                ))}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/[0.07] p-3">
                <label className="v-btn-ghost flex-none px-2 py-1 text-xs" title="Attach file">
                  📎
                  <input type="file" className="hidden" onChange={handleFile} />
                </label>
                <button type="button" onClick={recording ? stopVoice : startVoice} disabled={busy} className={`v-btn-ghost flex-none px-2 py-1 text-xs ${recording ? 'text-[#EA3943]' : ''}`} title="Voice note">
                  {recording ? '⏹' : '🎤'}
                </button>
                <input
                  className="v-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                />
                <button type="submit" disabled={busy || !text.trim()} className="v-btn-primary flex-none px-4 py-2 text-xs">Send</button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-[#9AA4B2]">
              Select a conversation or start a new chat to begin messaging.
            </div>
          )}
        </section>
      </div>

      {modal === 'new-chat' && (
        <PickerModal title="New chat" confirmLabel="Start chat" onClose={() => setModal(null)} onConfirm={handleNewChat} />
      )}
      {modal === 'new-group' && (
        <PickerModal title="New group" confirmLabel="Create group" onClose={() => setModal(null)} onConfirm={handleNewGroup} />
      )}

      {callModal && (
        <CallModal
          conversationId={activeId}
          sessionId={callModal.sessionId}
          mediaType={callModal.mediaType}
          incoming={callModal.incoming}
          meetUrl={callModal.meetUrl}
          peerName={callModal.peerName}
          myProfileId={myProfileId}
          onClose={() => setCallModal(null)}
        />
      )}
    </div>
  );
}
