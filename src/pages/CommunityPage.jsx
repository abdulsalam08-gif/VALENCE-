import { useState, useEffect, useCallback } from 'react';
import {
  fetchDiscoveryProfiles, toggleFollow, toggleBlock,
  fetchStudyGroups, joinStudyGroup, leaveStudyGroup,
  fetchForumCategories, fetchForumThreads, fetchThreadReplies,
  createForumThread, createForumReply, reportContent,
  fetchMentorshipProfiles, requestMentorship,
  fetchPlatformEvents, registerForEvent,
} from '../lib/community.js';

const TABS = [
  { id: 'discovery', label: 'Discovery', icon: '🔍' },
  { id: 'groups', label: 'Study Groups', icon: '👥' },
  { id: 'forums', label: 'Forums', icon: '💬' },
  { id: 'mentorship', label: 'Mentorship', icon: '🎓' },
  { id: 'events', label: 'Events', icon: '📅' },
];

function initials(name) {
  return (name || 'V')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function Avatar({ src, name }) {
  if (src) {
    return <img src={src} alt={name} className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#1C2530] text-[#E0A82E] text-sm font-bold" />;
  }
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E0A82E]/15 text-[#E0A82E] text-sm font-bold">
      {initials(name)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Profile card                                                       */
/* ------------------------------------------------------------------ */

function ProfileCard({ profile, onFollow, onBlock }) {
  return (
    <div className="v-card p-5">
      <div className="flex items-start gap-3">
        <Avatar src={profile.profile_photo_url} name={profile.display_name} />
        <div className="min-w-0">
          <div className="font-semibold text-[#F4F6F9] truncate">{profile.display_name || profile.username}</div>
          <div className="text-xs text-[#9AA4B2]">{profile.user_category || 'Learner'}</div>
          {profile.examination_level && (
            <span className="mt-1 inline-block rounded-md bg-[#E0A82E]/10 border border-[#E0A82E]/20 px-2 py-0.5 text-[11px] font-semibold text-[#E0A82E]">
              {profile.examination_level}
            </span>
          )}
        </div>
      </div>
      {profile.programme && <p className="mt-3 text-sm text-[#9AA4B2]">{profile.programme}</p>}
      <div className="mt-3 text-xs text-[#9AA4B2]">👥 {profile.followers || 0} followers</div>
      <div className="mt-4 flex gap-2">
        {profile.following ? (
          <button onClick={() => onFollow(profile)} className="v-btn-secondary px-3 py-1.5 text-xs">Following</button>
        ) : (
          <button onClick={() => onFollow(profile)} className="v-btn-primary px-3 py-1.5 text-xs">+ Follow</button>
        )}
        <button onClick={() => onBlock(profile)} className="v-btn-ghost px-3 py-1.5 text-xs">
          {profile.blocked ? 'Unblock' : 'Block'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Study group card                                                   */
/* ------------------------------------------------------------------ */

function GroupCard({ group, onJoin, onLeave }) {
  return (
    <div className="v-card p-5">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#E0A82E]/10 text-xl">👥</div>
        <div className="min-w-0">
          <div className="font-semibold text-[#F4F6F9] truncate">{group.name}</div>
          <div className="text-xs text-[#9AA4B2]">{group.course || group.programme || 'General study group'}</div>
        </div>
      </div>
      {group.description && <p className="mt-3 text-sm text-[#9AA4B2]">{group.description}</p>}
      <div className="mt-3 flex items-center gap-2 text-xs text-[#9AA4B2]">
        <span>👥 {group.member_count || 0} members</span>
        <span className="rounded-md bg-white/[0.05] px-2 py-0.5">{group.access_type}</span>
      </div>
      <div className="mt-4">
        {group.is_member ? (
          <button onClick={() => onLeave(group)} className="v-btn-secondary px-3 py-1.5 text-xs">Leave group</button>
        ) : (
          <button onClick={() => onJoin(group)} className="v-btn-primary px-3 py-1.5 text-xs">Join group</button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mentor card                                                        */
/* ------------------------------------------------------------------ */

function MentorCard({ mentor, onRequest, busy }) {
  return (
    <div className="v-card p-5">
      <div className="flex items-start gap-3">
        <Avatar src={mentor.profile_photo_url} name={mentor.display_name} />
        <div className="min-w-0">
          <div className="font-semibold text-[#F4F6F9] truncate">{mentor.display_name}</div>
          {mentor.qualifications && <div className="text-xs text-[#9AA4B2]">{mentor.qualifications}</div>}
        </div>
      </div>
      {mentor.expertise && <p className="mt-3 text-sm"><span className="font-medium text-[#F4F6F9]">Expertise:</span> <span className="text-[#9AA4B2]">{mentor.expertise}</span></p>}
      {mentor.experience && <p className="mt-2 text-sm"><span className="font-medium text-[#F4F6F9]">Experience:</span> <span className="text-[#9AA4B2]">{mentor.experience}</span></p>}
      {mentor.available_hours && <p className="mt-2 text-sm text-[#9AA4B2]">🕐 {mentor.available_hours}</p>}
      <div className="mt-4">
        <button onClick={() => onRequest(mentor)} disabled={busy} className="v-btn-primary px-3 py-1.5 text-xs">
          Request mentorship
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Event card                                                         */
/* ------------------------------------------------------------------ */

function EventCard({ event, onRegister }) {
  const date = event.event_date ? new Date(event.event_date) : null;
  return (
    <div className="v-card p-5">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#E0A82E]/10 text-xl">📅</div>
        <div className="min-w-0">
          <div className="font-semibold text-[#F4F6F9] truncate">{event.title}</div>
          <div className="text-xs text-[#9AA4B2]">{event.event_type}</div>
        </div>
      </div>
      {event.description && <p className="mt-3 text-sm text-[#9AA4B2]">{event.description}</p>}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#9AA4B2]">
        {date && <span>🗓 {date.toLocaleString()}</span>}
        {event.venue && <span>📍 {event.venue}</span>}
        <span>👥 {event.registrations || 0}{event.capacity ? ` / ${event.capacity}` : ''}</span>
      </div>
      {event.meeting_link && (
        <a href={event.meeting_link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-[#E0A82E] hover:underline">
          Join link ↗
        </a>
      )}
      <div className="mt-4">
        {event.registered ? (
          <button disabled className="v-btn-secondary px-3 py-1.5 text-xs">✓ Registered</button>
        ) : (
          <button onClick={() => onRegister(event)} className="v-btn-primary px-3 py-1.5 text-xs">Register</button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Community page                                                     */
/* ------------------------------------------------------------------ */

export default function CommunityPage() {
  const [tab, setTab] = useState('discovery');
  const [profiles, setProfiles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [threadsByCategory, setThreadsByCategory] = useState({});
  const [repliesByThread, setRepliesByThread] = useState({});
  const [mentors, setMentors] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeThread, setActiveThread] = useState(null);

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newReply, setNewReply] = useState('');
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);

  const showToast = useCallback((message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ---- loaders ---- */
  const loadProfiles = useCallback(async () => {
    try { setProfiles(await fetchDiscoveryProfiles()); }
    catch (e) { showToast(e.message, true); }
  }, [showToast]);

  const loadGroups = useCallback(async () => {
    try { setGroups(await fetchStudyGroups()); }
    catch (e) { showToast(e.message, true); }
  }, [showToast]);

  const loadMentors = useCallback(async () => {
    try { setMentors(await fetchMentorshipProfiles()); }
    catch (e) { showToast(e.message, true); }
  }, [showToast]);

  const loadEvents = useCallback(async () => {
    try { setEvents(await fetchPlatformEvents()); }
    catch (e) { showToast(e.message, true); }
  }, [showToast]);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await fetchForumCategories();
      setCategories(cats);
      if (cats.length && !activeCategory) setActiveCategory(cats[0].id);
    } catch (e) { showToast(e.message, true); }
  }, [showToast, activeCategory]);

  const loadThreads = useCallback(async (categoryId) => {
    if (!categoryId) return;
    try {
      const threads = await fetchForumThreads(categoryId);
      setThreadsByCategory((prev) => ({ ...prev, [categoryId]: threads }));
    } catch (e) { showToast(e.message, true); }
  }, [showToast]);

  const loadReplies = useCallback(async (threadId) => {
    if (!threadId) return;
    try {
      const replies = await fetchThreadReplies(threadId);
      setRepliesByThread((prev) => ({ ...prev, [threadId]: replies }));
    } catch (e) { showToast(e.message, true); }
  }, [showToast]);

  useEffect(() => {
    loadProfiles();
    loadGroups();
    loadMentors();
    loadEvents();
    loadCategories();
  }, [loadProfiles, loadGroups, loadMentors, loadEvents, loadCategories]);

  useEffect(() => {
    if (activeCategory && !activeThread) loadThreads(activeCategory);
  }, [activeCategory, activeThread, loadThreads]);

  useEffect(() => {
    if (activeThread) loadReplies(activeThread);
  }, [activeThread, loadReplies]);

  /* ---- actions ---- */
  const runAction = async (fn, successMsg, refresh) => {
    setBusy(true);
    try {
      const res = await fn();
      if (res && res.error) throw new Error(res.error);
      showToast(successMsg);
      if (refresh) refresh();
    } catch (e) { showToast(e.message, true); }
    setBusy(false);
  };

  const handleFollow = (profile) =>
    runAction(() => toggleFollow(profile.profile_id),
      profile.following ? 'Unfollowed' : `Now following ${profile.display_name}`, loadProfiles);

  const handleBlock = (profile) =>
    runAction(() => toggleBlock(profile.profile_id),
      profile.blocked ? 'Unblocked' : `Blocked ${profile.display_name}`, loadProfiles);

  const handleJoin = (group) =>
    runAction(() => joinStudyGroup(group.id), `Joined ${group.name}`, loadGroups);

  const handleLeave = (group) =>
    runAction(() => leaveStudyGroup(group.id), `Left ${group.name}`, loadGroups);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      showToast('Title and content are required', true);
      return;
    }
    await runAction(() => createForumThread(activeCategory, newThreadTitle.trim(), newThreadContent.trim()),
      'Thread created', () => { setNewThreadTitle(''); setNewThreadContent(''); loadThreads(activeCategory); });
  };

  const handleReply = async (e) => {
    e.preventDefault();
    const threadId = activeThread;
    if (!threadId || !newReply.trim()) return;
    await runAction(() => createForumReply(threadId, newReply.trim()),
      'Reply posted', () => { setNewReply(''); loadReplies(threadId); if (activeCategory) loadThreads(activeCategory); });
  };

  const handleReport = async (targetType, targetId) => {
    await runAction(() => reportContent(targetType, targetId, 'Community guidelines', ''),
      'Report submitted for moderation');
  };

  const handleMentorRequest = (mentor) =>
    runAction(() => requestMentorship(mentor.profile_id, ''), 'Mentorship request sent');

  const handleEventRegister = (event) =>
    runAction(() => registerForEvent(event.id), 'Registered for event', loadEvents);

  const activeThreadObj = activeThread
    ? (threadsByCategory[activeCategory] || []).find((t) => t.id === activeThread)
    : null;
  const activeReplies = activeThread ? (repliesByThread[activeThread] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#11161C] to-[#0B0F14] text-[#E4E9F0]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
        {/* header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Community</h1>
          <p className="mt-1 text-sm text-[#9AA4B2]">
            Discover learners, join study groups, discuss in subject forums, find a mentor and register for events.
          </p>
        </div>

        {/* tabs */}
        <div className="mb-6 flex flex-wrap gap-1.5 border-b border-white/[0.07] pb-px">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setActiveThread(null); }}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-[#E0A82E] text-[#06130D]'
                  : 'text-[#9AA4B2] hover:bg-white/[0.05] hover:text-[#F4F6F9]'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {toast && (
          <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            toast.isError
              ? 'border-[#EA3943]/30 bg-[#EA3943]/10 text-[#EA3943]'
              : 'border-[#E0A82E]/30 bg-[#E0A82E]/10 text-[#E0A82E]'
          }`}>
            {toast.message}
          </div>
        )}

        {/* ---------------- Discovery ---------------- */}
        {tab === 'discovery' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.length === 0 ? (
              <div className="v-card p-8 text-center text-[#9AA4B2]">No other profiles to discover yet.</div>
            ) : (
              profiles.map((p) => (
                <ProfileCard key={p.profile_id} profile={p} onFollow={handleFollow} onBlock={handleBlock} />
              ))
            )}
          </div>
        )}

        {/* ---------------- Study groups ---------------- */}
        {tab === 'groups' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.length === 0 ? (
              <div className="v-card p-8 text-center text-[#9AA4B2]">No study groups available right now.</div>
            ) : (
              groups.map((g) => (
                <GroupCard key={g.id} group={g} onJoin={handleJoin} onLeave={handleLeave} />
              ))
            )}
          </div>
        )}

        {/* ---------------- Forums ---------------- */}
        {tab === 'forums' && (
          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            {/* sidebar */}
            <aside className="v-card p-3 h-fit lg:sticky lg:top-4">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#667085]">Subjects</div>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setActiveCategory(c.id); setActiveThread(null); }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    activeCategory === c.id ? 'bg-[#E0A82E]/10 text-[#E0A82E]' : 'text-[#9AA4B2] hover:bg-white/[0.05] hover:text-[#F4F6F9]'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-[11px] text-[#667085]">({c.thread_count || 0})</span>
                </button>
              ))}
            </aside>

            {/* main */}
            <div className="min-w-0">
              {activeThread ? (
                <div>
                  <button onClick={() => setActiveThread(null)} className="v-btn-ghost mb-4 px-2 py-1 text-xs">← Back to threads</button>
                  <div className="v-card p-5 mb-4">
                    <h2 className="text-lg font-semibold text-white">{activeThreadObj?.title}</h2>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-[#C2C9D4]">{activeThreadObj?.content}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
                      <span className="text-xs text-[#9AA4B2]">{activeReplies.length} replies</span>
                      <button onClick={() => handleReport('forum_thread', activeThread)} className="v-btn-ghost px-2 py-1 text-xs">Report</button>
                    </div>
                  </div>

                  <div className="mb-4 space-y-3">
                    {activeReplies.length === 0 ? (
                      <div className="v-card p-8 text-center text-[#9AA4B2]">No replies yet — be the first to respond.</div>
                    ) : (
                      activeReplies.map((r) => (
                        <div key={r.id} className="v-card p-4">
                          <div className="whitespace-pre-wrap text-sm text-[#C2C9D4]">{r.content}</div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleReply} className="v-card p-4 space-y-3">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Write your reply…"
                      rows={3}
                      className="v-input"
                    />
                    <button type="submit" disabled={busy || !newReply.trim()} className="v-btn-primary px-4 py-2 text-xs">
                      Post reply
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleCreateThread} className="v-card mb-5 space-y-3 p-4">
                    <input
                      value={newThreadTitle}
                      onChange={(e) => setNewThreadTitle(e.target.value)}
                      placeholder="Thread title"
                      className="v-input"
                    />
                    <textarea
                      value={newThreadContent}
                      onChange={(e) => setNewThreadContent(e.target.value)}
                      placeholder="What do you want to discuss?"
                      rows={3}
                      className="v-input"
                    />
                    <button type="submit" disabled={busy || !newThreadTitle.trim()} className="v-btn-primary px-4 py-2 text-xs">
                      Start thread
                    </button>
                  </form>

                  {(threadsByCategory[activeCategory] || []).length === 0 ? (
                    <div className="v-card p-8 text-center text-[#9AA4B2]">No threads in this subject yet. Start the first one above.</div>
                  ) : (
                    (threadsByCategory[activeCategory] || []).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveThread(t.id)}
                        className="v-card-hover mb-3 cursor-pointer p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#F4F6F9] truncate">{t.title}</span>
                          <span className="flex-none text-xs text-[#9AA4B2]">{t.reply_count || 0} replies</span>
                        </div>
                        <p className="mt-1 text-sm text-[#9AA4B2] line-clamp-2">{t.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- Mentorship ---------------- */}
        {tab === 'mentorship' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.length === 0 ? (
              <div className="v-card p-8 text-center text-[#9AA4B2]">No mentors are available right now.</div>
            ) : (
              mentors.map((m) => (
                <MentorCard key={m.id} mentor={m} onRequest={handleMentorRequest} busy={busy} />
              ))
            )}
          </div>
        )}

        {/* ---------------- Events ---------------- */}
        {tab === 'events' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <div className="v-card p-8 text-center text-[#9AA4B2]">No events are open for registration right now.</div>
            ) : (
              events.map((ev) => (
                <EventCard key={ev.id} event={ev} onRegister={handleEventRegister} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
