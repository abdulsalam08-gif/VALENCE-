import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
  BookOpen,
  Scale,
  ArrowUpRight,
} from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import { usePlatform } from '../../context/PlatformContext';

const PROGRAMME_MENU = [
  { label: 'All Programmes Overview', desc: 'Compare ATSWA, ICAN, Tertiary & General tracks', to: '/programmes' },
  { label: 'ATSWA Programme (ATS 1 – 3)', desc: 'March & Sept diets · 25% off 2+ courses (max ₦60k)', to: '/programmes/atswa' },
  { label: 'ICAN Foundation Level', desc: 'CBL, BE, MA, FA · ₦40k/course · 25% off 3+', to: '/programmes/ican/foundation' },
  { label: 'ICAN Skills Level', desc: 'FR, FM, PSAF, AAF, TAX, PM · 6 syllabus papers', to: '/programmes/ican/skills' },
  { label: 'ICAN Professional Level', desc: 'SBR, CS, AAAF, A/TAX, SFM · Final ACA stage', to: '/programmes/ican/professional' },
  { label: 'ICAN Exemption Guidance Tool', desc: 'Check potential paper exemptions & conditions', to: '/programmes/ican/exemptions' },
  { label: 'University & General Learners', desc: '12 eligible disciplines + 6 financial literacy tracks', to: '/programmes/tertiary' },
];

const MORE_MENU = [
  { label: 'Services', desc: 'All 7 VALENCE pillars & AI Accounting Tutor', to: '/services' },
  { label: 'Study Materials', desc: 'Syllabus guides, videos, textbooks & soft-copy links', to: '/study-materials' },
  { label: 'Opportunities', desc: 'Scholarships, internships, audit & finance jobs', to: '/opportunities' },
  { label: 'Tuition Centres', desc: 'Search verified Nigerian accounting tuition centres', to: '/tuition-centres' },
  { label: 'Advertise on VALENCE', desc: 'Paid campaigns & placements for verified centres', to: '/advertise' },
  { label: 'Contact', desc: 'Enquiries, ICAN fee assistance & support desk', to: '/contact' },
];

const PORTAL_ACTIONS = [
  { label: 'Student Portal', desc: 'ATSWA, ICAN, Tertiary & General Learners', to: '/portal/student', icon: GraduationCap, accent: true },
  { label: 'Professional Portal', desc: 'ACA, FCA, ACCA & CPA Network', to: '/portal/professional', icon: Briefcase },
  { label: 'Join VALENCE Connect', desc: 'Community feed, study groups & messaging', to: '/connect', icon: Users },
  { label: 'Apply as a Tutor', desc: 'AAT (ATSWA) or AAT + ACA (ICAN) recruitment', to: '/portal/tutor', icon: Award },
  { label: 'Register for Competitions', desc: 'National Accounting Challenge & Battle Arena', to: '/competitions', icon: Trophy },
  { label: 'Advertise Your Tuition Centre', desc: 'VALENCE ADVERTISE verified onboarding', to: '/advertise', icon: Megaphone },
  { label: 'Admin Portal Login', desc: 'Authorised AAG governance & operations', to: '/portal/admin', icon: Shield },
];

const ALL_MOBILE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Programmes', to: '/programmes' },
  { label: 'ATSWA (ATS 1–3)', to: '/programmes/atswa' },
  { label: 'ICAN (Foundation / Skills / Pro)', to: '/programmes/ican' },
  { label: 'Services', to: '/services' },
  { label: 'Study Materials', to: '/study-materials' },
  { label: 'Store', to: '/store' },
  { label: 'VALENCE Connect', to: '/connect' },
  { label: 'Competitions', to: '/competitions' },
  { label: 'Opportunities', to: '/opportunities' },
  { label: 'Tuition Centres', to: '/tuition-centres' },
  { label: 'Advertise on VALENCE', to: '/advertise' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, userRole, cartSummary, settings } = usePlatform();
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
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
      isActive
        ? 'text-[#16C784] bg-[#16C784]/10'
        : 'text-[#C2C9D4] hover:text-white hover:bg-white/[0.04]'
    }`;

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full v-glass border-b border-white/[0.07]">
      {/* Slim institutional status ribbon */}
      <div className="hidden lg:block border-b border-white/[0.05] bg-[#07090B]/70">
        <div className="v-container flex h-8 items-center justify-between text-[11px] text-[#9AA4B2]">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wider text-[#C2C9D4]">
              {settings.operatorName}
            </span>
            <span className="text-white/15">•</span>
            <span className="italic text-[#16C784]/90">{settings.tagline}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/programmes/atswa"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#16C784]" />
              <span>ATSWA March 2027 Open</span>
            </Link>
            <Link
              to="/programmes/ican"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#16C784]" />
              <span>ICAN May 2027 Enrolling</span>
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

      {/* Main navigation bar */}
      <div className="v-container flex h-16 items-center justify-between gap-3">
        <BrandLogo size="md" showSubtext />

        {/* Desktop links */}
        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Primary Navigation">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>

          {/* Programmes dropdown */}
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
              <div className="absolute left-0 mt-2 w-[380px] rounded-2xl bg-[#11161C]/98 backdrop-blur-xl border border-white/[0.1] p-2.5 shadow-2xl animate-fade-up">
                {PROGRAMME_MENU.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex flex-col rounded-xl px-3.5 py-2.5 hover:bg-white/[0.05] transition-colors group"
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

          {/* Explore / More dropdown covering remaining public links cleanly */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'more' ? null : 'more')}
              aria-expanded={openDropdown === 'more'}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                ['/services', '/study-materials', '/opportunities', '/tuition-centres', '/advertise', '/contact'].includes(
                  location.pathname
                )
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
              <div className="absolute left-0 mt-2 w-[340px] rounded-2xl bg-[#11161C]/98 backdrop-blur-xl border border-white/[0.1] p-2.5 shadow-2xl animate-fade-up">
                {MORE_MENU.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex flex-col rounded-xl px-3.5 py-2.5 hover:bg-white/[0.05] transition-colors group"
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

        {/* Right Actions: Cart + Role-adaptive Portals + Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-2">
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

          {/* Portals launcher (desktop) */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'portals' ? null : 'portals')}
              aria-expanded={openDropdown === 'portals'}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#161D26] border border-white/[0.1] px-3.5 py-2 text-xs font-semibold text-[#F4F6F9] hover:border-white/[0.2] transition-colors"
            >
              {user ? `${userRole || 'My'} Dashboard` : 'Portals'}
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#9AA4B2] transition-transform ${
                  openDropdown === 'portals' ? 'rotate-180 text-[#16C784]' : ''
                }`}
              />
            </button>
            {openDropdown === 'portals' && (
              <div className="absolute right-0 mt-2 w-[340px] rounded-2xl bg-[#11161C]/98 backdrop-blur-xl border border-white/[0.1] p-2.5 shadow-2xl animate-fade-up">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#667085]">
                  VALENCE Portals & Quick Actions
                </div>
                {PORTAL_ACTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors group"
                    >
                      <span
                        className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          item.accent
                            ? 'bg-[#16C784]/15 border-[#16C784]/30 text-[#16C784]'
                            : 'bg-[#0B0E11] border-white/[0.08] text-[#9AA4B2] group-hover:text-[#16C784]'
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
            )}
          </div>

          <Link
            to={user ? `/portal/${userRole || 'student'}` : '/portal/student'}
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-[#16C784] px-4 py-2 text-xs font-bold text-[#06130D] hover:bg-[#1ED791] shadow-glow-sm transition-all"
          >
            <GraduationCap className="h-4 w-4" />
            {user ? 'Open Portal' : 'Student Portal'}
          </Link>

          {/* Mobile Drawer Trigger */}
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

      {/* Mobile Full Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-white/[0.08] bg-[#0B0E11]/98 backdrop-blur-2xl max-h-[calc(100vh-4rem)] overflow-y-auto pb-24">
          <div className="v-container py-5 space-y-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#667085] mb-2.5">
                Portals & Registration
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
                          : 'bg-[#11161C] text-[#F4F6F9] border-white/[0.08] hover:border-[#16C784]/40'
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
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#667085] mb-2">
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
                          ? 'bg-[#16C784]/12 text-[#16C784] border border-[#16C784]/25'
                          : 'bg-[#11161C]/70 text-[#C2C9D4] border border-white/[0.05] hover:text-white'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#11161C] border border-white/[0.07] px-3.5 py-2.5 text-[11px] text-[#9AA4B2]">
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
