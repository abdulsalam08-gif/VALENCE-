import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Users,
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
import { usePlatform } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';

const PROGRAMME_MENU = [
  { label: 'Programmes & Diet Timetables', desc: 'Exam dates, 7-day cutoffs & 30-day result countdowns', to: '/programmes' },
  { label: 'ATSWA Programme (ATS 1 to 3)', desc: '2-day March & Sept exams · ₦3k unlocks tuition cost implications', to: '/programmes/atswa' },
  { label: 'ICAN Foundation Level', desc: 'CBL, BE, MA, FA · 3-day May & Nov diets', to: '/programmes/ican/foundation' },
  { label: 'ICAN Skills Level', desc: 'FR, FM, PSAF, AAF, TAX, PM · 6 syllabus papers', to: '/programmes/ican/skills' },
  { label: 'ICAN Professional Level', desc: 'SBR, CS, AAAF, A/TAX, SFM · Final ACA stage', to: '/programmes/ican/professional' },
  { label: 'ICAN Exemption & Entry Tool', desc: 'Find your starting level + Accredited & MCATI school checks', to: '/programmes/ican/exemptions' },
  { label: 'ICAN Candidate Guide (10 FAQs)', desc: 'Eligibility, ATSWA vs Graduate routes, reg steps & timelines', to: '/programmes/ican/guide' },
  { label: 'Universities, Polytechnics & Colleges', desc: `${universityCounts.total} accredited Nigerian institutions + 6 literacy tracks`, to: '/programmes/tertiary' },
];

const MORE_MENU = [
  { label: 'Services', desc: 'All 7 VALENCE pillars & 7-step AI Accounting Tutor', to: '/services' },
  { label: 'Study Materials', desc: 'Syllabus guides, videos, textbooks & soft-copy links', to: '/study-materials' },
  { label: 'Opportunities', desc: 'Verified scholarships, internships, audit & finance roles', to: '/opportunities' },
  { label: 'Tuition Centres & Vendors', desc: 'Verified physical centres (with cost unlock), authors & vendors', to: '/tuition-centres' },
  { label: 'Advertise on VALENCE', desc: 'Physical centres, textbook authors & vendors (₦10k/wk)', to: '/advertise' },
  { label: 'Legal & Privacy Policies', desc: 'Terms, NDPA Privacy, Refunds, Delivery & Ad Policy', to: '/legal' },
  { label: 'Contact', desc: '24/7 support & official ICAN fee assistance', to: '/contact' },
];

const PORTAL_ACTIONS = [
  { label: 'Student Portal', desc: 'Free signup · ₦3k unlocks level & centre cost implications', to: '/portal/student', icon: GraduationCap, accent: true },
  { label: 'Professional Portal', desc: 'Verified ACA, FCA, ACCA & CPA Network', to: '/portal/professional', icon: Briefcase },
  { label: 'Join VALENCE Connect', desc: 'Community feed, study groups & messaging', to: '/connect', icon: Users },
  { label: 'Apply as a Tutor', desc: 'AAT (ATSWA) or AAT + ACA (ICAN) recruitment', to: '/portal/tutor', icon: Award },
  { label: 'National Inter-School Challenge', desc: 'Accounting & related fields · ₦220,000 podium pool', to: '/competitions', icon: Trophy },
  { label: 'Advertise (Centres, Authors & Vendors)', desc: '₦10,000/wk in-app · Publish centre tuition costs', to: '/advertise', icon: Megaphone },
  { label: 'Admin Portal Login', desc: 'Central Examination Authority & governance', to: '/portal/admin', icon: Shield },
];

const ALL_MOBILE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Programmes & Timetables', to: '/programmes' },
  { label: 'ATSWA (ATS 1 to 3)', to: '/programmes/atswa' },
  { label: 'ICAN (Foundation / Skills / Pro)', to: '/programmes/ican' },
  { label: 'Services', to: '/services' },
  { label: 'Study Materials', to: '/study-materials' },
  { label: 'Store', to: '/store' },
  { label: 'VALENCE Connect', to: '/connect' },
  { label: 'Inter-School Challenge (₦220k)', to: '/competitions' },
  { label: 'Opportunities', to: '/opportunities' },
  { label: 'Tuition Centres & Books', to: '/tuition-centres' },
  { label: 'Advertise on VALENCE', to: '/advertise' },
  { label: 'Legal & Privacy', to: '/legal' },
  { label: 'Contact', to: '/contact' },
];

// Solid opaque dropdown panel surface (zero bleed-through from page content behind)
const DROPDOWN_PANEL_CLASS =
  'rounded-2xl bg-[#0D1218] border border-white/[0.15] p-2.5 shadow-[0_24px_64px_rgba(0,0,0,0.95)] ring-1 ring-black z-[70] animate-fade-up';

export default function Navbar() {
  const { user, userRole, cartSummary, settings, universityCounts, handleSignOut, profile } = usePlatform();
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
              National Inter-School Challenge: <strong className="text-[#16C784]">₦220,000 podium pool</strong> · only 4 competitors per school
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
            {settings.whatsappChannelUrl && (
              <a
                href={settings.whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#16C784] hover:text-[#1ED791] transition-colors"
              >
                WhatsApp Channel
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
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
          <NavLink to="/about" className={navLinkClass}>
            About Us
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

          <NavLink to="/connect" className={navLinkClass}>
            VALENCE Connect
          </NavLink>
          <NavLink to="/competitions" className={navLinkClass}>
            Competitions
          </NavLink>
          <NavLink to="/store" className={navLinkClass}>
            Store
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
                  '/opportunities',
                  '/tuition-centres',
                  '/advertise',
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
              <div className={`absolute left-0 mt-2 w-[350px] ${DROPDOWN_PANEL_CLASS}`}>
                {MORE_MENU.map((item) => (
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
                      to="/portal/student"
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

          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'portals' ? null : 'portals')}
              aria-expanded={openDropdown === 'portals'}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors border ${
                openDropdown === 'portals'
                  ? 'bg-[#1A2330] border-[#16C784]/60 text-white'
                  : 'bg-[#161D26] border-white/[0.12] text-[#F4F6F9] hover:border-white/[0.25]'
              }`}
            >
              {user ? `${userRole || 'My'} Dashboard` : 'Portals'}
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#9AA4B2] transition-transform ${
                  openDropdown === 'portals' ? 'rotate-180 text-[#16C784]' : ''
                }`}
              />
            </button>
            {openDropdown === 'portals' && (
              <div
                style={{ backgroundColor: '#0D1218' }}
                className={`absolute right-0 mt-2 w-[355px] ${DROPDOWN_PANEL_CLASS}`}
              >
                <div className="px-3 py-2 mb-1 border-b border-white/[0.08] text-[10px] font-semibold uppercase tracking-widest text-[#16C784]">
                  VALENCE Portals &amp; Quick Actions
                </div>
                <div className="space-y-0.5">
                  {PORTAL_ACTIONS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 bg-[#0D1218] hover:bg-[#18212C] transition-colors group"
                      >
                        <span
                          className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                            item.accent
                              ? 'bg-[#16C784]/15 border-[#16C784]/35 text-[#16C784]'
                              : 'bg-[#141B24] border-white/[0.1] text-[#C2C9D4] group-hover:text-[#16C784] group-hover:border-[#16C784]/30'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-xs font-semibold text-[#F4F6F9] group-hover:text-[#16C784]">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-[#9AA4B2]">{item.desc}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to={user ? `/portal/${userRole || 'student'}` : '/portal/student'}
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-[#16C784] px-4 py-2 text-xs font-bold text-[#06130D] hover:bg-[#1ED791] shadow-glow-sm transition-all"
          >
            <GraduationCap className="h-4 w-4" />
            {user ? 'Open Portal' : 'Student Portal'}
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

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9AA4B2] mb-2">
                All Navigation Pages
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_MOBILE_LINKS.map((link) => (
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

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#11161C] border border-white/[0.08] px-3.5 py-2.5 text-[11px] text-[#9AA4B2]">
              {settings.whatsappChannelUrl ? (
                <a
                  href={settings.whatsappChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#16C784] hover:underline"
                >
                  Follow Official WhatsApp Channel <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="italic text-[#16C784]">{settings.tagline}</span>
              )}
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
