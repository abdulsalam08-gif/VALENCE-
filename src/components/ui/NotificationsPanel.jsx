import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useCart, usePublicData, useUi } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../lib/auth';
import { Bell, Check, Loader2, Link2, Clock } from 'lucide-react';

export default function NotificationsPanel() {
  const { user } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await fetchNotifications();
    setNotifications(data || []);
    setUnreadCount((data || []).filter((n) => !n.read_at).length);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    setUnreadCount(0);
    toast.success('All caught up', 'All notifications marked as read.');
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#9AA4B2] hover:bg-white/[0.05] hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EA3943] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#11161C] border border-white/[0.12] shadow-2xl animate-fade-up overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <p className="text-xs font-bold text-white">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16C784] hover:underline"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-8 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-[#16C784] animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#667085]">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read_at && handleMarkRead(n.id)}
                  className={`px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors hover:bg-white/[0.03] ${
                    !n.read_at ? 'bg-[#16C784]/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-1 inline-block h-2 w-2 rounded-full shrink-0 ${!n.read_at ? 'bg-[#16C784]' : 'bg-[#667085]'}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${n.read_at ? 'text-[#C2C9D4]' : 'text-white'}`}>{n.title}</p>
                      <p className="text-[11px] text-[#9AA4B2] mt-0.5 line-clamp-2">{n.body}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-[#667085]" />
                        <span className="text-[10px] text-[#667085]">{formatTime(n.created_at)}</span>
                        {n.link_url && (
                          <Link2 className="h-3 w-3 text-[#16C784] ml-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
