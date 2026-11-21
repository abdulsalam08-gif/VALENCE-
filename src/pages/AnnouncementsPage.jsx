import { useState, useEffect, useCallback } from 'react';
import { useAuth, useCart, usePublicData, useUi } from '../context/PlatformContext';
import {
  fetchAnnouncements, fetchAnnouncementDetail, fetchAnnouncementComments,
  createAnnouncement, deleteAnnouncement,
  toggleAnnouncementLike, toggleAnnouncementBookmark,
  addAnnouncementComment, deleteAnnouncementComment,
  shareAnnouncement, reportAnnouncement,
  moderateAnnouncement,
} from '../lib/announcements.js';

const AUDIENCE_SCOPES = [
  { value: 'public', label: 'Public — everyone' },
  { value: 'connections', label: 'Connections — followers' },
  { value: 'study_group', label: 'Study group' },
  { value: 'institution', label: 'Institution' },
  { value: 'programme', label: 'Programme' },
  { value: 'course', label: 'Course' },
  { value: 'professional', label: 'Professional hub' },
];

function initials(name) {
  return (name || 'V').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function ScopeBadge({ audience }) {
  const label = (AUDIENCE_SCOPES.find((s) => s.value === audience) || {}).label || audience;
  return <span className="rounded-md bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 text-[11px] text-[#9AA4B2]">{label}</span>;
}

/* ------------------------------------------------------------------ */
/* Composer                                                            */
/* ------------------------------------------------------------------ */

function Composer({ onCreated }) {
  const { adminRoles } = useAuth();
  const isAdmin = adminRoles.length > 0;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('public');
  const [category, setCategory] = useState('');
  const [isOfficial, setIsOfficial] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const flash = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3 || content.trim().length < 2) {
      flash('Title (3+ chars) and content are required', true);
      return;
    }
    setBusy(true);
    try {
      const res = await createAnnouncement({
        title: title.trim(), content: content.trim(), audience,
        category: category.trim() || null, isOfficial: isAdmin && isOfficial,
      });
      if (res.error) throw new Error(res.error);
      flash('Announcement posted');
      setTitle(''); setContent(''); setCategory(''); setIsOfficial(false);
      setOpen(false);
      onCreated && onCreated();
    } catch (err) {
      flash(err.message, true);
    }
    setBusy(false);
  };

  return (
    <div className="v-card p-4">
      {!open ? (
        <button onClick={() => setOpen(true)} className="v-btn-primary px-4 py-2 text-xs">+ Post announcement</button>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">New announcement</span>
            <button type="button" onClick={() => setOpen(false)} className="v-btn-ghost px-2 py-1 text-xs">Cancel</button>
          </div>
          <input className="v-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" />
          <textarea className="v-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the announcement…" rows={3} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="v-label">Audience scope</label>
              <select className="v-input" value={audience} onChange={(e) => setAudience(e.target.value)}>
                {AUDIENCE_SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="v-label">Category (optional)</label>
              <input className="v-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Exam notice" />
            </div>
          </div>
          {isAdmin && (
            <label className="flex items-center gap-2 text-sm text-[#9AA4B2]">
              <input type="checkbox" checked={isOfficial} onChange={(e) => setIsOfficial(e.target.checked)} className="accent-[#16C784]" />
              Mark as official (admin only)
            </label>
          )}
          {toast && (
            <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${toast.isError ? 'border-[#EA3943]/30 bg-[#EA3943]/10 text-[#EA3943]' : 'border-[#16C784]/30 bg-[#16C784]/10 text-[#16C784]'}`}>{toast.msg}</div>
          )}
          <button type="submit" disabled={busy} className="v-btn-primary px-4 py-2 text-xs">Publish</button>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Announcement card (feed)                                            */
/* ------------------------------------------------------------------ */

function AnnouncementCard({ ann, onOpen, onLike, onBookmark }) {
  return (
    <div onClick={() => onOpen(ann.id)} className="v-card-hover mb-3 cursor-pointer p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#16C784]/10 text-[#16C784] text-xs font-bold">{initials(ann.author_name)}</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#F4F6F9] truncate">{ann.author_name}</div>
            <div className="text-[11px] text-[#667085]">{new Date(ann.created_at).toLocaleString()}</div>
          </div>
        </div>
        <div className="flex flex-none items-center gap-1.5">
          {ann.is_official && <span className="rounded-md bg-[#16C784]/15 border border-[#16C784]/30 px-2 py-0.5 text-[11px] font-semibold text-[#16C784]">OFFICIAL</span>}
          <ScopeBadge audience={ann.audience} />
        </div>
      </div>
      <h3 className="mt-3 font-semibold text-white">{ann.title}</h3>
      <p className="mt-1 text-sm text-[#9AA4B2] line-clamp-2">{ann.content}</p>
      <div className="mt-3 flex items-center gap-1 text-xs text-[#9AA4B2]">
        <button onClick={(e) => { e.stopPropagation(); onLike(ann); }} className="rounded-md px-2 py-1 hover:bg-white/[0.05]">{ann.liked ? '❤️' : '🤍'} {ann.likes_count || 0}</button>
        <span className="px-2">💬 {ann.comments_count || 0}</span>
        <span className="px-2">🔁 {ann.shares_count || 0}</span>
        <button onClick={(e) => { e.stopPropagation(); onBookmark(ann); }} className="ml-auto rounded-md px-2 py-1 hover:bg-white/[0.05]">{ann.bookmarked ? '🔖' : '🏷️'}</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Announcements page                                                  */
/* ------------------------------------------------------------------ */

export default function AnnouncementsPage() {
  const { adminRoles } = useAuth();
  const isAdmin = adminRoles.length > 0;
  const [anns, setAnns] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);

  const flash = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    try { setAnns(await fetchAnnouncements()); }
    catch (e) { flash(e.message, true); }
  }, [flash]);

  const loadDetail = useCallback(async (id) => {
    try {
      const [d, c] = await Promise.all([fetchAnnouncementDetail(id), fetchAnnouncementComments(id)]);
      setDetail(d);
      setComments(c || []);
    } catch (e) { flash(e.message, true); }
  }, [flash]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (activeId) loadDetail(activeId); }, [activeId, loadDetail]);

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

  const handleLike = (ann) => runAction(() => toggleAnnouncementLike(ann.id),
    ann.liked ? 'Unliked' : 'Liked', load);

  const handleBookmark = (ann) => runAction(() => toggleAnnouncementBookmark(ann.id),
    ann.bookmarked ? 'Removed bookmark' : 'Bookmarked', load);

  const handleShare = (id) => runAction(() => shareAnnouncement(id, null), 'Shared');

  const handleReport = (id) => runAction(() => reportAnnouncement(id, 'Community guidelines'), 'Report submitted');

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !activeId) return;
    await runAction(() => addAnnouncementComment(activeId, newComment.trim()),
      'Comment posted', () => { setNewComment(''); loadDetail(activeId); load(); });
  };

  const handleDeleteComment = (cid) => runAction(() => deleteAnnouncementComment(cid),
    'Comment deleted', () => loadDetail(activeId));

  const handleModerate = (id, action) => runAction(() => moderateAnnouncement(id, action),
    action === 'hide' ? 'Hidden' : action === 'unhide' ? 'Restored' : 'Deleted', load);

  const handleDelete = (id) => runAction(() => deleteAnnouncement(id), 'Announcement deleted', () => { setActiveId(null); load(); });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#11161C] to-[#0B0F14] text-[#E4E9F0]">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Announcements</h1>
          <p className="mt-1 text-sm text-[#9AA4B2]">Official platform notices and community announcements, scoped to your audience.</p>
        </div>

        {toast && (
          <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${toast.isError ? 'border-[#EA3943]/30 bg-[#EA3943]/10 text-[#EA3943]' : 'border-[#16C784]/30 bg-[#16C784]/10 text-[#16C784]'}`}>{toast.msg}</div>
        )}

        <div className="mb-5">
          <Composer onCreated={load} />
        </div>

        {activeId ? (
          <div>
            <button onClick={() => setActiveId(null)} className="v-btn-ghost mb-4 px-2 py-1 text-xs">← Back to feed</button>
            {detail && !detail.error && (
              <div className="v-card p-5 mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#16C784]/10 text-[#16C784] text-xs font-bold">{initials(detail.author_name)}</span>
                    <div>
                      <div className="text-sm font-semibold text-[#F4F6F9]">{detail.author_name}</div>
                      <div className="text-[11px] text-[#667085]">{new Date(detail.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-1.5">
                    {detail.is_official && <span className="rounded-md bg-[#16C784]/15 border border-[#16C784]/30 px-2 py-0.5 text-[11px] font-semibold text-[#16C784]">OFFICIAL</span>}
                    <ScopeBadge audience={detail.audience} />
                  </div>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-white">{detail.title}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-[#C2C9D4]">{detail.content}</p>

                <div className="mt-5 flex flex-wrap items-center gap-1 border-t border-white/[0.07] pt-4">
                  <button onClick={() => handleLike(detail)} disabled={busy} className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs hover:bg-white/[0.05]">
                    {detail.liked ? '❤️' : '🤍'} {detail.likes_count || 0}
                  </button>
                  <button onClick={() => handleShare(detail.id)} disabled={busy} className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs hover:bg-white/[0.05]">🔁 Share</button>
                  <button onClick={() => handleBookmark(detail)} disabled={busy} className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs hover:bg-white/[0.05]">
                    {detail.bookmarked ? '🔖 Saved' : '🏷️ Save'}
                  </button>
                  <button onClick={() => handleReport(detail.id)} disabled={busy} className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs hover:bg-white/[0.05]">⚑ Report</button>
                  {isAdmin && (
                    <div className="ml-auto flex gap-1">
                      {detail.status !== 'hidden' && <button onClick={() => handleModerate(detail.id, 'hide')} className="v-btn-ghost px-2 py-1 text-xs">Hide</button>}
                      {detail.status === 'hidden' && <button onClick={() => handleModerate(detail.id, 'unhide')} className="v-btn-ghost px-2 py-1 text-xs">Restore</button>}
                      <button onClick={() => handleDelete(detail.id)} className="v-btn-danger px-2 py-1 text-xs">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="v-card p-4 mb-4">
              <h4 className="text-sm font-semibold text-white mb-3">Comments ({comments.length})</h4>
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-[#9AA4B2]">No comments yet.</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2">
                      <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#16C784]/10 text-[#16C784] text-[10px] font-bold">{initials(c.author_name)}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[#F4F6F9]">{c.author_name}</div>
                        <div className="text-sm text-[#C2C9D4]">{c.content}</div>
                      </div>
                      {(c.profile_id === detail.profile_id || isAdmin) && (
                        <button onClick={() => handleDeleteComment(c.id)} className="v-btn-ghost flex-none px-1 py-0.5 text-[11px]">✕</button>
                      )}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleComment} className="mt-4 flex gap-2">
                <input className="v-input" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment…" />
                <button type="submit" disabled={busy || !newComment.trim()} className="v-btn-primary px-4 py-2 text-xs">Post</button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            {anns.length === 0 ? (
              <div className="v-card p-8 text-center text-[#9AA4B2]">No announcements visible in your feed yet.</div>
            ) : (
              anns.map((a) => (
                <AnnouncementCard key={a.id} ann={a} onOpen={setActiveId} onLike={handleLike} onBookmark={handleBookmark} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
