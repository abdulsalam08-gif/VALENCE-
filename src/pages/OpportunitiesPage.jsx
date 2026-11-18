import React, { useState } from 'react';
import { Calendar, Building2, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';

const ALL_CATEGORIES = [
  'All',
  'Scholarships',
  'Internships',
  'Graduate Opportunities',
  'Workshops',
  'Accounting Jobs',
  'Finance Jobs',
  'Fellowships',
];

export default function OpportunitiesPage() {
  const { opportunities } = usePlatform();
  const toast = useToast();
  const [cat, setCat] = useState('All');

  const visible = opportunities.filter((o) => cat === 'All' || o.category === cat);

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-4 max-w-4xl">
          <Badge variant="green">VALENCE OPPORTUNITIES</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
            Scholarships, Internships, Audit Roles & Career Development
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2]">
            Verified opportunities curated and maintained by VALENCE administrators covering scholarships, undergraduate internships, graduate trainee roles, accounting & finance positions, fellowships, workshops and career events.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="v-container space-y-6">
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors ${
                  cat === c
                    ? 'bg-[#16C784] text-[#06130D] border-[#16C784]'
                    : 'bg-[#11161C] text-[#9AA4B2] border-white/[0.08] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="v-card p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-white">
                No active listings in “{cat}” right now.
              </p>
              <p className="text-xs text-[#9AA4B2]">
                New verified listings published by administrators appear here automatically with in-app notifications.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {visible.map((opp) => (
                <article key={opp.id} className="v-card-hover p-6 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="green">{opp.category}</Badge>
                      <Badge variant="red">Deadline: {opp.deadline}</Badge>
                    </div>
                    <h2 className="font-display text-xl font-bold text-white">{opp.title}</h2>
                    <p className="text-xs font-medium text-[#C2C9D4] inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-[#16C784]" /> {opp.organisation}
                    </p>
                    <p className="text-xs leading-relaxed text-[#9AA4B2]">
                      <strong className="text-[#F4F6F9]">Eligibility:</strong> {opp.eligibility}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs">
                    <span className="text-[#667085] inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Published {opp.publishedAt}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        toast.info(
                          opp.title,
                          'Full application portal & document attachments go live in Phase 15.'
                        )
                      }
                      className="inline-flex items-center gap-1 font-semibold text-[#16C784] hover:underline"
                    >
                      View Details <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
