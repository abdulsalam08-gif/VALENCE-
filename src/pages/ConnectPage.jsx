import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Megaphone,
  MessageSquare,
  PhoneCall,
  Image,
  Award,
  Calendar,
  ShieldCheck,
  Heart,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

const AUDIENCE_TYPES = [
  '1. Public (All VALENCE)',
  '2. Connections Only',
  '3. Study Group Members',
  '4. Institution-Specific',
  '5. Programme-Specific',
  '6. Course-Specific',
  '7. Professional Community',
];

export default function ConnectPage() {
  const { announcements, discussionCategories, events, settings } = usePlatform();
  const [selectedForum, setSelectedForum] = useState(discussionCategories[0]);

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-5 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="green">VALENCE CONNECT</Badge>
            <Badge variant="neutral">Academic & Professional Network</Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            Collaborate, Publish Announcements, Study Together & Grow
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2]">
            A purposeful academic and professional community where every registered member manages their profile and photo gallery, publishes targeted announcements, joins subject study groups, messages in real time, joins voice/video calls and connects with verified mentors.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/portal/student" className="v-btn-primary text-xs">
              Join VALENCE Connect <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/portal/professional" className="v-btn-secondary text-xs">
              Offer Professional Mentorship
            </Link>
            {settings.whatsappChannelUrl && (
              <a
                href={settings.whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn-secondary text-xs border-[#E0A82E]/35 text-[#E0A82E]"
              >
                Follow Official WhatsApp Channel <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-14 bg-[#0D1116]">
        <div className="v-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Megaphone, title: 'Open Community Publishing', desc: 'All registered members can compose, preview, save drafts and publish announcements across 7 backend-enforced audience scopes.' },
            { icon: Image, title: 'Profiles & Photo Galleries', desc: 'Upload, preview, crop and optimise JPG/PNG/WebP profile pictures and captioned galleries with granular privacy controls.' },
            { icon: MessageSquare, title: 'Realtime Private & Group Chat', desc: 'Supabase Realtime messaging with image/document attachments, read receipts, blocking and reporting controls.' },
            { icon: PhoneCall, title: 'Voice & Video Study Calls', desc: '1-to-1 and group study calls with invitations, call history and microphone/camera controls.' },
            { icon: Users, title: 'Focused Study Groups', desc: 'Public, private and approval-based groups organised by ICAN/ATSWA level, course, institution or examination diet.' },
            { icon: Award, title: 'Mentorship & Events', desc: 'Verified ACA/FCA/ACCA/CPA mentorship matching plus webinars, revision workshops and career seminars.' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="v-card p-5 space-y-2.5">
                <Icon className="h-5 w-5 text-[#E0A82E]" />
                <h2 className="font-display text-base font-bold text-white">{f.title}</h2>
                <p className="text-xs leading-relaxed text-[#9AA4B2]">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Announcements & Audience Governance */}
      <section className="py-14">
        <div className="v-container grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              Community & Official Announcements Stream
            </h2>
            {announcements.map((ann) => (
              <article
                key={ann.id}
                className={`v-card p-5 space-y-3 ${
                  ann.isOfficial ? 'border-[#E0A82E]/40' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ann.isOfficial ? (
                      <Badge variant="official">VALENCE OFFICIAL</Badge>
                    ) : (
                      <Badge variant="community">Community Post</Badge>
                    )}
                    <span className="text-[11px] text-[#667085]">{ann.category}</span>
                  </div>
                  <span className="text-[11px] text-[#667085]">{ann.timestamp}</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">{ann.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#9AA4B2]">{ann.content}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3 text-xs text-[#9AA4B2]">
                  <span className="font-medium text-[#D5DBE3]">
                    {ann.authorName} · <span className="text-[#667085]">{ann.audience}</span>
                  </span>
                  <span className="inline-flex items-center gap-3 tabular-nums-display">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 text-[#E0A82E]" /> {ann.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> {ann.comments}
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:col-span-4 space-y-5">
            <div className="v-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E0A82E]">
                <Lock className="h-4 w-4" /> 7 Server-Enforced Audiences
              </div>
              <ul className="space-y-1.5 text-xs text-[#C2C9D4]">
                {AUDIENCE_TYPES.map((a) => (
                  <li key={a} className="rounded-lg bg-[#0B0E11] border border-white/[0.06] px-3 py-2">
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="v-card p-5 space-y-3">
              <h3 className="font-display text-base font-bold text-white">
                12 Academic Discussion Forums
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {discussionCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedForum(cat)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium border transition-colors ${
                      selectedForum === cat
                        ? 'bg-[#E0A82E] text-[#06130D] border-[#E0A82E] font-semibold'
                        : 'bg-[#0B0E11] text-[#9AA4B2] border-white/[0.07] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#9AA4B2] pt-1">
                Selected space: <strong className="text-white">{selectedForum}</strong>: supports threads, nested replies, likes, bookmarks and moderation reporting.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
