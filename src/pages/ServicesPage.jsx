import React from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Bot,
  ShoppingBag,
  Users,
  Trophy,
  Building2,
  Briefcase,
  ArrowRight,
  MessageCircle,
  CalendarClock,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

const SERVICES = [
  {
    icon: Video,
    title: 'Online Live Tuition (ATSWA & ICAN)',
    badge: '₦3,000 to Apply & View Cost',
    desc: 'Structured live Google Meet tutorials, recorded lessons and syllabus guidance. Free platform entry; pay ₦3,000 per level only when applying for tuition and viewing cost implications.',
    cta: 'Apply for Tuition',
    to: '/programmes',
  },
  {
    icon: CalendarClock,
    title: 'Central Examination Authority & Result Tracker',
    badge: 'Live Timetables + 30-Day Countdown',
    desc: 'Official 2-day ATSWA and 3-day ICAN diet schedules, 1-week pre-exam registration cutoffs, day-by-day timetables and automatic 30-day result release countdowns updated for any delays.',
    cta: 'View Timetables',
    to: '/programmes#timetables',
  },
  {
    icon: Bot,
    title: 'AI Accounting Study Engine & 15 Tools',
    badge: 'Server-Side Secured',
    desc: 'Step-by-step AI explanations, journal & double-entry coach, study timetable builder, flashcard deck, exam readiness tracker, formula cheat sheets and 3-day revision sprints.',
    cta: 'Open Student Portal',
    to: '/portal/student',
  },
  {
    icon: Trophy,
    title: 'National Inter-School Competitions (₦50,000 Reward)',
    badge: '₦50,000 Cash Reward',
    desc: 'Five-round national championships across all Nigerian universities, polytechnics and tutorial centres with a verified ₦50,000 cash reward paid to top learners after every competition.',
    cta: 'Enter Competition',
    to: '/competitions',
  },
  {
    icon: ShoppingBag,
    title: 'Accounting Study Materials Store (In-App)',
    badge: 'Per-Course · Up to 9% Off',
    desc: '45 catalogue items — buy a single course or all applicable courses (ATSWA PQs ₦5,500/course, ICAN PQs ₦9,000/course & study packs) with Paystack checkout and in-app material & delivery enquiries.',
    cta: 'Shop Materials',
    to: '/store',
  },
  {
    icon: Users,
    title: 'VALENCE CONNECT & Direct Calling',
    badge: 'Realtime WebRTC',
    desc: 'Direct/group messaging, real audio & video calls, community announcements with 7 audience scopes, 12 subject forums, study groups and verified mentorship.',
    cta: 'Explore Connect',
    to: '/connect',
  },
  {
    icon: Building2,
    title: 'Verified Tuition Centres & VALENCE ADVERTISE',
    badge: '₦10,000/Week · In-App',
    desc: '100% in-app advertising at ₦10,000/week, independent directory verification, Paystack billing and live CTR analytics for approved accounting tuition centres across Nigeria.',
    cta: 'Advertise In-App',
    to: '/advertise',
  },
  {
    icon: Briefcase,
    title: 'Scholarships, Internships & Career Hub',
    badge: 'Verified Opportunities',
    desc: 'Curated internships, NYSC PPA openings, audit trainee roles, accounting scholarships, CPE/CPD webinars and graduate job applications.',
    cta: 'Browse Opportunities',
    to: '/opportunities',
  },
];

export default function ServicesPage() {
  const { openWhatsAppModal } = usePlatform();

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-4">
          <Badge variant="green">ECOSYSTEM SERVICES</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white max-w-3xl">
            Comprehensive Educational, Competition & Career Services
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2] max-w-2xl">
            Every academic, networking, examination timetable, ₦50,000 competition reward, bookstore and advertising capability integrated in one neutral platform.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="v-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="v-card-hover p-6 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C784]/12 border border-[#16C784]/25 text-[#16C784]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="neutral">{s.badge}</Badge>
                  </div>
                  <h2 className="font-display text-base font-bold text-white">{s.title}</h2>
                  <p className="text-xs leading-relaxed text-[#9AA4B2]">{s.desc}</p>
                </div>
                <Link
                  to={s.to}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16C784] hover:underline"
                >
                  {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="v-container mt-10">
          <div className="v-glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Need Physical Tuition or Official ICAN Registration / Exam Fee Assistance?
              </h3>
              <p className="text-xs text-[#9AA4B2] mt-1">
                Launch a prefilled WhatsApp message directly to the VALENCE academic support desk.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openWhatsAppModal({ category: 'Physical Tuition & ICAN Fee Assistance' })}
              className="v-btn-primary text-xs shrink-0"
            >
              <MessageCircle className="h-4 w-4" /> Start WhatsApp Enquiry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
