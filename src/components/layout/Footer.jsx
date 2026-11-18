import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, ShieldCheck, ExternalLink, MapPin } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import { usePlatform } from '../../context/PlatformContext';

export default function Footer() {
  const { settings, openWhatsAppModal, universityCounts } = usePlatform();

  const activeSocials = Object.entries(settings.socialLinks || {}).filter(
    ([, url]) => typeof url === 'string' && url.trim().length > 0
  );

  return (
    <footer className="border-t border-white/[0.07] bg-[#080B0E] pb-24 lg:pb-10">
      <div className="v-container pt-16 pb-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="lg" showSubtext />
            <p className="text-sm leading-relaxed text-[#9AA4B2] max-w-sm">
              Nigeria’s complete accounting education, professional networking, inter-school competition, marketplace and career ecosystem connecting ATSWA &amp; ICAN candidates,{' '}
              <span className="text-[#F4F6F9] font-medium">{universityCounts.total}+ Nigerian universities, polytechnics &amp; colleges</span>, verified partners and chartered accountants.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl bg-[#11161C] border border-white/[0.08] px-3.5 py-2 text-xs text-[#C2C9D4]">
                <ShieldCheck className="h-4 w-4 text-[#16C784] shrink-0" />
                <span>
                  Online Checkout Secured Exclusively by <strong className="text-white">Paystack</strong>
                </span>
              </div>
              {settings.whatsappChannelUrl && (
                <a
                  href={settings.whatsappChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#16C784]/15 border border-[#16C784]/35 px-3.5 py-2 text-xs font-semibold text-[#16C784] hover:bg-[#16C784] hover:text-[#06130D] transition-colors"
                >
                  Follow Official WhatsApp Channel <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            {activeSocials.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {activeSocials.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#11161C] border border-white/[0.08] px-2.5 py-1 capitalize text-[#C2C9D4] hover:text-[#16C784] hover:border-[#16C784]/40 transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F4F6F9]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#9AA4B2]">
              <li><Link to="/" className="hover:text-[#16C784] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#16C784] transition-colors">About Us</Link></li>
              <li><Link to="/programmes" className="hover:text-[#16C784] transition-colors">Programmes & Diets</Link></li>
              <li><Link to="/services" className="hover:text-[#16C784] transition-colors">Services</Link></li>
              <li><Link to="/study-materials" className="hover:text-[#16C784] transition-colors">Study Materials</Link></li>
              <li><Link to="/store" className="hover:text-[#16C784] transition-colors">Store (Marketplace)</Link></li>
              <li><Link to="/contact" className="hover:text-[#16C784] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F4F6F9]">
              Ecosystem & Portals
            </h4>
            <ul className="space-y-2 text-xs text-[#9AA4B2]">
              <li><Link to="/portal/student" className="hover:text-[#16C784] transition-colors">Student Portal (VALENCE LEARN)</Link></li>
              <li><Link to="/portal/professional" className="hover:text-[#16C784] transition-colors">Professional Portal (ACA/FCA/ACCA/CPA)</Link></li>
              <li><Link to="/connect" className="hover:text-[#16C784] transition-colors">Join VALENCE Connect</Link></li>
              <li><Link to="/competitions" className="hover:text-[#16C784] transition-colors">National Challenge (₦220,000 Podium Pool)</Link></li>
              <li><Link to="/portal/tutor" className="hover:text-[#16C784] transition-colors">Apply as a Tutor</Link></li>
              <li><Link to="/opportunities" className="hover:text-[#16C784] transition-colors">Scholarships & Opportunities</Link></li>
              <li><Link to="/tuition-centres" className="hover:text-[#16C784] transition-colors">Physical Centres, Authors &amp; Vendors</Link></li>
              <li><Link to="/advertise" className="hover:text-[#16C784] transition-colors">Advertise (Centres, Authors &amp; Vendors)</Link></li>
              <li><Link to="/portal/admin" className="hover:text-[#16C784] transition-colors">Admin Portal Login</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#F4F6F9]">
              Contact & Official Links
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9AA4B2]">
              <li className="flex items-start gap-2">
                <Phone className="h-3.5 w-3.5 text-[#16C784] mt-0.5 shrink-0" />
                <button
                  type="button"
                  onClick={() => openWhatsAppModal({ category: 'General Support Enquiry' })}
                  className="text-left hover:text-[#16C784] transition-colors"
                >
                  WhatsApp: {settings.whatsappNumber}
                  <span className="block text-[10.5px] text-[#667085]">Enquiries & ICAN official fee assistance</span>
                </button>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#16C784] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#16C784] transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#16C784] shrink-0" />
                <span>Operating hours: {settings.operatingHours}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#16C784] mt-0.5 shrink-0" />
                <span>
                  Past Qs: Same-day Lagos, 1-day outside Lagos (free: LASU, Ojo, UNILAG, YABATECH, FCE &amp; Yaba) · Study Packs: When available
                </span>
              </li>
            </ul>

            <div className="pt-2 space-y-1.5 border-t border-white/[0.06]">
              {settings.whatsappChannelUrl && (
                <>
                  <a
                    href={settings.whatsappChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16C784] hover:underline"
                  >
                    VALENCE Official WhatsApp Channel <ExternalLink className="h-3 w-3" />
                  </a>
                  <br />
                </>
              )}
              <a
                href={settings.officialLinks.atswaSoftCopy}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#9AA4B2] hover:text-[#16C784] transition-colors"
              >
                Official ICAN ATSWA Resources <ExternalLink className="h-3 w-3" />
              </a>
              <br />
              <a
                href={settings.officialLinks.icanSyllabus2026}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#9AA4B2] hover:text-[#16C784] transition-colors"
              >
                ICAN 2026 Official Syllabus (PDF) <ExternalLink className="h-3 w-3" />
              </a>
              <br />
              <a
                href={settings.officialLinks.icanAccreditedInstitutions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#9AA4B2] hover:text-[#16C784] transition-colors"
              >
                ICAN Accredited Institutions (PDF) <ExternalLink className="h-3 w-3" />
              </a>
              <br />
              <a
                href={settings.officialLinks.icanMcatiInstitutions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#9AA4B2] hover:text-[#16C784] transition-colors"
              >
                ICAN MCATI Institutions List (PDF) <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] space-y-4 text-[11px] text-[#667085]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[#9AA4B2]">
              <Link to="/legal/terms" className="hover:text-[#16C784] transition-colors">
                Terms of Service
              </Link>
              <Link to="/legal/privacy" className="hover:text-[#16C784] transition-colors">
                Privacy Policy (NDPA)
              </Link>
              <Link to="/legal/refunds" className="hover:text-[#16C784] transition-colors">
                Refund &amp; Delivery Policy
              </Link>
              <Link to="/legal/advertising" className="hover:text-[#16C784] transition-colors">
                Advertising &amp; Anti-Piracy Policy
              </Link>
            </div>
            <span className="text-[#667085]">
              Installable Web App (Android, iOS &amp; Desktop)
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © {new Date().getFullYear()} <span className="text-[#9AA4B2] font-semibold">VALENCE</span> ·{' '}
              <span className="italic text-[#16C784]/80">{settings.tagline}</span> All rights reserved.
            </p>
            <p className="text-center sm:text-right">
              Exam schedules &amp; result dates updated by Central Examination Authority. Paid ads are always labelled Sponsored.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
