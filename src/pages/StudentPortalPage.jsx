import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import NotificationsPanel from '../components/ui/NotificationsPanel';
import {
  GraduationCap,
  Trophy,
  BookOpen,
  Users,
  Flame,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Bell,
  LogOut,
  User as UserIcon,
  Compass,
  Check,
} from 'lucide-react';

export default function StudentPortalPage() {
  const { user, profile, userNotifications, handleSignOut } = usePlatform();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const handleSignOutClick = async () => {
    await handleSignOut();
    toast.success('Signed out', 'You have been logged out.');
    navigate('/');
  };

  const quickLinks = [
    { key: 'overview', label: 'Overview', icon: TrendingUp, path: '/portal/student' },
    { key: 'competitions', label: 'Competitions', icon: Trophy, path: '/competitions' },
    { key: 'learning', label: 'Learning', icon: BookOpen, path: '/learning' },
    { key: 'community', label: 'Community', icon: Users, path: '/community' },
    { key: 'profile', label: 'Profile', icon: UserIcon, path: '/profile' },
  ];

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email;
  const unread = userNotifications.filter((n) => !n.read_at).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#11161C] to-[#0B0F14] text-[#E4E9F0]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#0B0F14]/85 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#16C784] text-black font-bold text-sm">V</div>
            <span className="text-sm font-bold text-white">VALENCE</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationsPanel />
            <div className="h-6 w-px bg-white/[0.1]" />
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/[0.05] transition-colors"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#16C784]/20 text-[#16C784] text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="text-xs font-medium text-[#C2C9D4] hidden sm:block">{displayName}</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOutClick}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9AA4B2] hover:bg-white/[0.05] hover:text-white transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#16C784]/[0.10] to-transparent border border-[#16C784]/20 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#16C784]">Student Portal</p>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">Welcome back, {displayName.split(' ')[0]}</h1>
              <p className="text-sm text-[#9AA4B2] mt-1">
                {profile?.institution_name
                  ? `${profile.institution_name} · ${profile.account_type?.replace(/_/g, ' ') || 'Student'}`
                  : profile?.account_type?.replace(/_/g, ' ') || 'Student'}
              </p>
            </div>
            {profile?.onboarding_completed && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#16C784]/10 border border-[#16C784]/20 px-3 py-1.5 text-xs font-semibold text-[#16C784]">
                <Check className="h-3.5 w-3.5" /> Onboarding complete
              </span>
            )}
          </div>
        </div>

        {/* Quick tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 -mx-1 px-1">
          {quickLinks.map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => setActiveTab(link.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === link.key
                  ? 'bg-[#16C784] text-black'
                  : 'bg-white/[0.04] text-[#9AA4B2] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </button>
          ))}
        </div>

        {/* Overview grid */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={Trophy}
                label="Competitions"
                value="₦220,000"
                sub="Podium pool"
                accent="#EA3943"
                to="/competitions"
              />
              <MetricCard
                icon={BookOpen}
                label="Study tools"
                value="15"
                sub="Free tools"
                accent="#16C784"
                to="/learning"
              />
              <MetricCard
                icon={Users}
                label="Community"
                value="Active"
                sub="Forums & groups"
                accent="#16C784"
                to="/community"
              />
              <MetricCard
                icon={Flame}
                label="Streak"
                value={profile?.study_streak ? `${profile.study_streak} days` : 'Start now'}
                sub="Keep learning"
                accent="#F5A623"
                to="/learning"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Quick actions */}
              <div className="lg:col-span-2 rounded-2xl bg-[#11161C] border border-white/[0.10] p-6">
                <h2 className="text-sm font-bold text-white mb-4">Quick actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <QuickAction
                    icon={Compass}
                    title="Explore competitions"
                    desc="Join the National Inter-School Challenge"
                    to="/competitions"
                  />
                  <QuickAction
                    icon={BookOpen}
                    title="Browse study tools"
                    desc="15 free study tools available"
                    to="/learning"
                  />
                  <QuickAction
                    icon={Users}
                    title="Join community"
                    desc="Forums, study groups, peer connect"
                    to="/community"
                  />
                  <QuickAction
                    icon={UserIcon}
                    title="Edit profile & privacy"
                    desc="Avatar, gallery, privacy settings"
                    to="/profile"
                  />
                </div>
              </div>

              {/* Notifications summary */}
              <div className="rounded-2xl bg-[#11161C] border border-white/[0.10] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Notifications</h2>
                  <span className="text-[10px] font-bold text-[#EA3943]">{unread} unread</span>
                </div>
                {userNotifications.length === 0 ? (
                  <p className="text-xs text-[#667085] py-6 text-center">No notifications yet.</p>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {userNotifications.slice(0, 5).map((n) => (
                      <div key={n.id} className="rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2">
                        <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                        <p className="text-[10px] text-[#667085] truncate">{n.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitions' && (
          <TabContent icon={Trophy} title="National Inter-School Challenge" to="/competitions">
            Join the National Inter-School Challenge with a ₦220,000 podium pool. Only 4 competitors per school. Compete across ATSWA and ICAN divisions.
          </TabContent>
        )}

        {activeTab === 'learning' && (
          <TabContent icon={BookOpen} title="Learning Center" to="/learning">
            Access 15 free study tools, ATSWA & ICAN materials, past questions, and official diet timetables.
          </TabContent>
        )}

        {activeTab === 'community' && (
          <TabContent icon={Users} title="Community" to="/community">
            Join forums, study groups, and connect with peers across all 466 Nigerian institutions.
          </TabContent>
        )}

        {activeTab === 'profile' && (
          <div className="mt-6">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-[#11161C] border border-white/[0.10] px-5 py-3 text-sm font-semibold text-white hover:border-[#16C784]/30 transition-colors"
            >
              <UserIcon className="h-4 w-4 text-[#16C784]" />
              Go to profile & settings
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, accent, to }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl bg-[#11161C] border border-white/[0.10] p-5 hover:border-white/[0.2] transition-colors"
    >
      <div className="flex items-start justify-between">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-[#667085] group-hover:text-white transition-colors" />
      </div>
      <p className="text-xs font-semibold text-[#9AA4B2] mt-3">{label}</p>
      <p className="text-lg font-bold text-white mt-0.5">{value}</p>
      <p className="text-[10px] text-[#667085] mt-0.5">{sub}</p>
    </Link>
  );
}

function QuickAction({ icon: Icon, title, desc, to }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] p-3.5 hover:border-[#16C784]/30 hover:bg-white/[0.04] transition-colors"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#16C784]/10 text-[#16C784] shrink-0">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white">{title}</p>
        <p className="text-[10px] text-[#667085] truncate">{desc}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[#667085] group-hover:text-white transition-colors" />
    </Link>
  );
}

function TabContent({ icon: Icon, title, to, children }) {
  return (
    <div className="mt-6 rounded-2xl bg-[#11161C] border border-white/[0.10] p-8 text-center animate-fade-up">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#16C784]/10 text-[#16C784] mb-4">
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="text-sm text-[#9AA4B2] mt-2 max-w-md mx-auto">{children}</p>
      <Link to={to} className="v-btn-primary mt-5 inline-flex !py-2.5 !px-5 text-sm">
        Open <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
