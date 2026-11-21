import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  GraduationCap,
  Award,
  Trophy,
  Megaphone,
  Shield,
  Scale,
  ArrowUpRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import WisdomTicker from '../ui/WisdomTicker';
import NotificationsPanel from '../ui/NotificationsPanel';
import { useAuth, useCart, usePublicData, useUi } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';
import { portalPathForAccountType } from '../../lib/auth';

const PROGRAMME_MENU = [
  { label: 'Programmes & Diet Timetables', desc: 'Exam dates, 7-day cutoffs & 30-day result countdowns', to: '/programmes' },
  { label: 'ATSWA Programme (ATS 1 to 3)', desc: '2-day March & Sept exams · ₦3k unlocks tuition cost implications', to: '/programmes/atswa' },
  { label: 'ICAN Foundation Level', desc: 'CBL, BE, MA, FA · 3-day May & Nov diets', to: '/programmes/ican/foundation' },
  { label: 'ICAN Skills Level', desc: 'FR, FM, PSAF, AAF, TAX, PM · 6 syllabus papers', to: '/programmes/ican/skills' },
  { label: 'ICAN Professional Level', desc: 'SBR, CS, AAAF, A/TAX, SFM · Final ACA stage', to: '/programmes/ican/professional' },
  { label: 'ICAN Exemption & Entry Tool', desc: 'Find your starting level + Accredited & MCATI school checks', to: '/programmes/ican/exemptions' },
  { label: 'ICAN Candidate Guide (10 FAQs)', desc: 'Eligibility, ATSWA vs Graduate routes, reg steps & timelines', to: '/programmes/ican/guide' },
  { label: 'Universities, Polytechnics & Colleges', desc: '466 accredited Nigerian institutions + 6 literacy tracks', to: '/programmes/tertiary' },
];

const PORTAL_ACTIONS = [
  { label: 'Student Portal', desc: 'Free signup · ₦3k unlocks level & centre cost implications', to: '/portal/student', icon: GraduationCap, accent: true },
  { label: 'Apply as a Tutor', desc: 'AAT (ATSWA) or AAT + ACA (ICAN) recruitment', to: '/portal/tutor', icon: Award },
  { label: 'National Inter-School Challenge', desc: 'Accounting & related fields · ₦500,000 podium pool', to: '/competitions', icon: Trophy },
  { label: 'Advertise (Centres, Authors & Vendors)', desc: '₦10,000/wk in-app · Publish centre tuition costs', to: '/advertise', icon: Megaphone },
  { label: 'Admin Portal Login', desc: 'Central Examination Authority & governance', to: '/portal/admin', icon: Shield },
];

/* Explore dropdown — grouped so one click reveals only what matters.      */
const EXPLORE_GROUPS = [
  {
    title: 'Learn',
    items: [
      { label: 'Services', desc: 'All VALENCE pillars & 7-step AI Accounting Tutor', to: '/services' },
      { label: 'Study Materials', desc: 'Syllabus guides, videos, textbooks & soft-copy links', to: '/study-materials' },
      { label: 'About Us', desc: 'The VALENCE mission, team & platform overview', to: '/about' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Community', desc: 'Discovery, study groups, subject forums, mentorship & events', to: '/community' },
      { label: 'Announcements', desc: 'Official platform notices & community announcements', to: '/announcements' },
      { label: 'Messages', desc: '1:1 & group chat with attachments, voice notes & read receipts', to: '/messages' },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      { label: 'Opportunities', desc: 'Verified scholarships, internships, audit & finance roles', to: '/opportunities' },
      { label: 'Tuition Centres & Vendors', desc: 'Verified physical centres (with cost unlock), authors & vendors', to: '/tuition-centres' },
      { label: 'Advertise on VALENCE', desc: 'Physical centres, textbook authors & vendors (₦10k/wk)', to: '/advertise' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Legal & Privacy Policies', desc: 'Terms, NDPA Privacy, Refunds, Delivery & Ad Policy', to: '/legal' },
      { label: 'Contact', desc: '24/7 support & official ICAN fee assistance', to: '/contact' },
    ],
  },
];

/* Mobile drawer — same grouping, rendered as sectioned cards.            */
const MOBILE_GROUPS = [
  {
    title: 'Programmes',
    items: [
      { label: 'Programmes & Timetables', to: '/programmes' },
      { label: 'ATSWA (ATS 1 to 3)', to: '/programmes/atswa' },
      { label: 'ICAN (Foundation / Skills / Pro)', to: '/programmes/ican' },
    ],
  },
  {
    title: 'Learn',
    items: [
      { label: 'Services', to: '/services' },
      { label: 'Study Materials', to: '/study-materials' },
      { label: 'About Us', to: '/about' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Community', to: '/community' },
      { label: 'Announcements', to: '/announcements' },
      { label: 'Messages', to: '/messages' },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      { label: 'Store', to: '/store' },
      { label: 'Inter-School Challenge (₦500k)', to: '/competitions' },
      { label: 'Opportunities', to: '/opportunities' },
      { label: 'Tuition Centres & Books', to: '/tuition-centres' },
      { label: 'Advertise on VALENCE', to: '/advertise' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Legal & Privacy', to: '/legal' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

// Solid opaque dropdown panel surface (zero bleed-through from page content behind)
const DROPDOWN_PANEL_CLASS =
  'rounded-2xl bg-[#0D1218] border border-white/[0.15] p-2.5 shadow-[0_24px_64px_rgba(0,0,0,0.95)] ring-1 ring-black z-[70] animate-fade-up';

export default function Navbar() {
  const { user, handleSignOut, profile } = useAuth();
  const { settings, universityCounts } = usePublicData();
  const { cartSummary } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
      isActive
        ? 'text-[#16C784] bg-[#16C784]/10'
        : 'text-[#C2C9D4] hover:text-white hover:bg-white/[0.04]'
    }`;

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full bg-[#0B0E11] border-b border-white/[0.08]"
    >
      {/* Non-intrusive Scrolling Life & Wisdom Quote Ribbon (Never Blocks Any Page View) */}
      <WisdomTicker />

      {/* Top Schedule & Competition Ribbon */}
      <div className="hidden lg:block border-b border-white/[0.05] bg-[#080B0E]">
        <div className="v-container flex h-8 items-center justify-between text-[11px] text-[#9AA4B2]">
          <div className="flex items-center gap-3">
            <span className="italic text-[#16C784]">{settings.tagline}</span>
            <span className="text-white/15">•</span>
            <Link to="/competitions" className="hover:text-white transition-colors">
              National Inter-School Challenge: <strong className="text-[#16C784]">₦500,000 podium pool</strong> · only 4 competitors per school
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/programmes/atswa"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#16C784]" />
              <span>ATSWA: 23–24 Mar 2027</span>
            </Link>
            <Link
              to="/programmes/ican"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#16C784]" />
              <span>ICAN: 4–6 May 2027</span>
            </Link>
            <span className="text-white/15">|</span>
            <Link to="/advertise" className="hover:text-[#16C784] transition-colors">
              Advertise on VALENCE
            </Link>
            <Link
              to="/portal/admin"
              className="inline-flex items-center gap-1 text-[#9AA4B2] hover:text-white transition-colors"
            >
              <Shield className="h-3 w-3 text-[#16C784]" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="v-container flex h-16 items-center justify-between gap-3">
        <BrandLogo size="md" showSubtext />

        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Primary Navigation">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'prog' ? null : 'prog')}
              aria-expanded={openDropdown === 'prog'}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                location.pathname.startsWith('/programmes')
                  ? 'text-[#16C784] bg-[#16C784]/10'
                  : 'text-[#C2C9D4] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Programmes
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  openDropdown === 'prog' ? 'rotate-180 text-[#16C784]' : ''
                }`}
              />
            </button>
            {openDropdown === 'prog' && (
              <div className={`absolute left-0 mt-2 w-[390px] ${DROPDOWN_PANEL_CLASS}`}>
                {PROGRAMME_MENU.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex flex-col rounded-xl px-3.5 py-2.5 hover:bg-[#161D26] transition-colors group"
                  >
                    <span className="text-xs font-semibold text-[#F4F6F9] group-hover:text-[#16C784] flex items-center justify-between">
                      {item.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span className="mt-0.5 text-[11px] text-[#9AA4B2]">{item.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/store" className={navLinkClass}>
            Store
          </NavLink>
          <NavLink to="/competitions" className={navLinkClass}>
            Competitions
          </NavLink>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'more' ? null : 'more')}
              aria-expanded={openDropdown === 'more'}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                [
                  '/services',
                  '/study-materials',
                  '/community',
                  '/announcements',
                  '/messages',
                  '/opportunities',
                  '/tuition-centres',
                  '/advertise',
                  '/about',
                  '/legal',
                  '/contact',
                ].some((p) => location.pathname.startsWith(p))
                  ? 'text-[#16C784] bg-[#16C784]/10'
                  : 'text-[#C2C9D4] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Explore
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  openDropdown === 'more' ? 'rotate-180 text-[#16C784]' : ''
                }`}
              />
            </button>
            {openDropdown === 'more' && (
              <div className={`absolute left-0 mt-2 w-[380px] ${DROPDOWN_PANEL_CLASS}`}>
                {EXPLORE_GROUPS.map((group) => (
                  <div key={group.title} className="px-2 py-1.5">
                    <p className="px-1.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#9AA4B2]">
                      {group.title}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex flex-col rounded-xl px-3.5 py-2.5 hover:bg-[#161D26] transition-colors group"
                      >
                        <span className="text-xs font-semibold text-[#F4F6F9] group-hover:text-[#16C784]">
                          {item.label}
                        </span>
                        <span className="mt-0.5 text-[11px] text-[#9AA4B2]">{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <NotificationsPanel />

          {user && (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'account' ? null : 'account')}
                aria-expanded={openDropdown === 'account'}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#161D26] pl-1.5 pr-2.5 py-1.5 hover:border-[#16C784]/40 transition-colors"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#16C784]/20 text-[#16C784] text-xs font-bold">
                  {(profile?.full_name || user.email).charAt(0).toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-[#F4F6F9] max-w-[120px] truncate">
                  {profile?.full_name || user.email.split('@')[0]}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#9AA4B2] transition-transform ${
                    openDropdown === 'account' ? 'rotate-180 text-[#16C784]' : ''
                  }`}
                />
              </button>
              {openDropdown === 'account' && (
                <div
                  style={{ backgroundColor: '#0D1218' }}
                  className={`absolute right-0 mt-2 w-56 ${DROPDOWN_PANEL_CLASS}`}
                >
                  <div className="px-3 py-2.5 border-b border-white/[0.08]">
                    <p className="text-xs font-bold text-white truncate">{profile?.full_name || user.email}</p>
                    <p className="text-[10px] text-[#9AA4B2] truncate">{user.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to={portalPathForAccountType(user?.user_metadata?.account_type)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#C2C9D4] hover:bg-[#18212C] hover:text-[#16C784] transition-colors"
                    >
                      <GraduationCap className="h-4 w-4" /> My Portal
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#C2C9D4] hover:bg-[#18212C] hover:text-[#16C784] transition-colors"
                    >
                      <UserIcon className="h-4 w-4" /> Profile &amp; Settings
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await handleSignOut();
                        toast.success('Signed out', 'You have been logged out.');
                        navigate('/');
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#C2C9D4] hover:bg-[#EA3943]/10 hover:text-[#EA3943] transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            to="/store"
            aria-label="Open Store Cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#141A22] border border-white/[0.08] text-[#C2C9D4] hover:border-[#16C784]/40 hover:text-white transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartSummary.totalQuantity > 0 && (
              <span className="absolute -top-1.5 -right-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#16C784] px-1 text-[10px] font-bold text-[#06130D] tabular-nums-display">
                {cartSummary.totalQuantity}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="xl:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#141A22] border border-white/[0.09] text-[#F4F6F9]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Solid Opaque Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{ backgroundColor: '#0B0E11' }}
          className="xl:hidden border-t border-white/[0.1] bg-[#0B0E11] max-h-[calc(100vh-6rem)] overflow-y-auto pb-24 shadow-2xl"
        >
          <div className="v-container py-5 space-y-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#16C784] mb-2.5">
                Portals &amp; Registration
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PORTAL_ACTIONS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <Link
                      key={p.label}
                      to={p.to}
                      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold border transition-colors ${
                        p.accent
                          ? 'bg-[#16C784] text-[#06130D] border-[#16C784]'
                          : 'bg-[#141A22] text-[#F4F6F9] border-white/[0.1] hover:border-[#16C784]/40'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {p.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {MOBILE_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9AA4B2] mb-2">
                    {group.title}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {group.items.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                          `rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-[#16C784]/15 text-[#16C784] border border-[#16C784]/30'
                              : 'bg-[#11161C] text-[#C2C9D4] border border-white/[0.07] hover:text-white'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#11161C] border border-white/[0.08] px-3.5 py-2.5 text-[11px] text-[#9AA4B2]">
              <span className="italic text-[#16C784]">{settings.tagline}</span>
              <Link to="/programmes/ican/exemptions" className="inline-flex items-center gap-1 text-[#F4F6F9] font-medium">
                <Scale className="h-3.5 w-3.5 text-[#16C784]" />
                Exemption Guide
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
