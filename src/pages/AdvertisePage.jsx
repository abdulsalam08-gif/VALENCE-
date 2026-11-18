import React from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

const AD_PLACEMENTS = [
  '1. Homepage Promotional Banners',
  '2. Sponsored ICAN Programme Listings',
  '3. Sponsored ATSWA Programme Listings',
  '4. Student Dashboard Placements',
  '5. Sponsored VALENCE CONNECT Posts',
  '6. Featured Tuition Centre Listings',
  '7. Learning Section Placements',
  '8. Revision Workshop Promotions',
  '9. Professional Training Announcements',
];

export default function AdvertisePage() {
  const { openWhatsAppModal } = usePlatform();

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-5 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="green">VALENCE ADVERTISE</Badge>
            <Badge variant="neutral">Verified Educational Providers Only</Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            Reach Serious ATSWA, ICAN & University Accounting Candidates Nationwide
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2]">
            Designed for verified tuition centres, tutorial institutes and professional training providers across Nigeria — complete with audience targeting, server-verified Paystack billing, live impression/click/CTR analytics and strict academic advertising ethics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/portal/student?mode=advertiser" className="v-btn-primary text-xs">
              <Megaphone className="h-4 w-4" /> Register as an Advertiser
            </Link>
            <button
              type="button"
              onClick={() =>
                openWhatsAppModal({ category: 'VALENCE ADVERTISE — Tuition Centre Enquiry' })
              }
              className="v-btn-secondary text-xs"
            >
              <MessageCircle className="h-4 w-4 text-[#16C784]" /> Advertising Enquiry
            </button>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 v-card p-6 sm:p-7 space-y-4">
            <h2 className="font-display text-xl font-bold text-white">
              9 Approved Advertisement Placements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {AD_PLACEMENTS.map((pl) => (
                <div
                  key={pl}
                  className="rounded-xl bg-[#0B0E11] border border-white/[0.07] px-3.5 py-3 text-[#D5DBE3] font-medium"
                >
                  {pl}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 v-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-[#16C784]">
              <BarChart3 className="h-5 w-5" />
              <h2 className="font-display text-xl font-bold text-white">
                Governance & Privacy Guarantee
              </h2>
            </div>
            <ul className="space-y-2.5 text-xs text-[#9AA4B2]">
              {[
                'Mandatory administrative verification before publishing any advertisement.',
                'Every paid placement carries a clear Sponsored or Advertisement badge.',
                'All advertising package payments execute via server-verified Paystack checkout.',
                'Real-time impressions, clicks, CTR, schedule and remaining duration analytics.',
                'False claims of ICAN, ATSWA or VALENCE accreditation are strictly prohibited.',
                'Student private records are never sold and unsolicited cold DMs are blocked.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
