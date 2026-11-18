import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  Search,
  ShoppingBag,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';
import { formatNaira } from '../lib/pricing';

export default function StudyMaterialsPage() {
  const { atswaLevels, icanLevels, settings } = usePlatform();
  const [filterProg, setFilterProg] = useState('ALL');
  const [query, setQuery] = useState('');

  const allSyllabusItems = useMemo(() => {
    const atswaPackImg = {
      'ATS 1': { packImg: '/materials/ats1-study-pack.jpg', pqImg: '/materials/ats1-past-question.jpg', colour: 'Blue Edition', hex: '#2563EB' },
      'ATS 2': { packImg: '/materials/ats2-study-pack.jpg', pqImg: '/materials/ats2-past-question.jpg', colour: 'Orange Edition', hex: '#EA580C' },
      'ATS 3': { packImg: '/materials/ats3-study-pack.jpg', pqImg: '/materials/ats3-past-question.jpg', colour: 'Dark Green Edition', hex: '#15803D' },
    };
    const atswa = atswaLevels.flatMap((lvl) =>
      lvl.courses.map((c) => ({
        ...c,
        programme: 'ATSWA',
        levelName: lvl.code,
        packPrice: 9500,
        pqPrice: 5500,
        ...(atswaPackImg[lvl.code] || atswaPackImg['ATS 1']),
      }))
    );
    const ican = icanLevels.flatMap((lvl) =>
      lvl.courses.map((c) => ({
        ...c,
        programme: 'ICAN',
        levelName: lvl.shortName,
        packPrice: c.studyPackPrice,
        pqPrice: 9000,
        packImg: '/materials/ican-study-pack.jpg',
        pqImg: '/materials/ican-past-question.jpg',
        colour: 'Study Text + Pathfinder',
        hex: '#2563EB',
      }))
    );
    return [...atswa, ...ican];
  }, [atswaLevels, icanLevels]);

  const filtered = allSyllabusItems.filter((item) => {
    if (filterProg !== 'ALL' && item.programme !== filterProg) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.levelName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container space-y-5">
          <Badge variant="green">STUDY MATERIALS & RESOURCE LIBRARY</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white max-w-3xl">
            27 Syllabus Courses, Official Soft-Copy Links, Textbooks & Video Library
          </h1>
          <p className="text-sm sm:text-base text-[#9AA4B2] max-w-2xl">
            Access official ICAN and ATSWA soft-copy references, browse syllabus paper guides across all levels, purchase printed study packs & past questions, or unlock digital PDF textbooks and YouTube lecture playlists inside your Student Portal.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={settings.officialLinks.atswaSoftCopy}
              target="_blank"
              rel="noopener noreferrer"
              className="v-btn-primary text-xs"
            >
              ATSWA Official Soft-Copy Resources <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={settings.officialLinks.icanSyllabus2026}
              target="_blank"
              rel="noopener noreferrer"
              className="v-btn-secondary text-xs"
            >
              ICAN 2026 Official Syllabus PDF <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
            </a>
            <a
              href={settings.officialLinks.icanAccreditedInstitutions}
              target="_blank"
              rel="noopener noreferrer"
              className="v-btn-secondary text-xs"
            >
              Accredited Institutions PDF <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
            </a>
            <a
              href={settings.officialLinks.icanMcatiInstitutions}
              target="_blank"
              rel="noopener noreferrer"
              className="v-btn-secondary text-xs"
            >
              MCATI Institutions PDF <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
            </a>
            <a
              href={settings.officialLinks.icanExamDockets}
              target="_blank"
              rel="noopener noreferrer"
              className="v-btn-secondary text-xs"
            >
              ICAN Exam Dockets <ExternalLink className="h-3.5 w-3.5 text-[#16C784]" />
            </a>
          </div>
        </div>
      </section>

      {/* Resource Formats */}
      <section className="py-12 bg-[#0D1116]">
        <div className="v-container grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="v-card p-5 space-y-2">
            <FileText className="h-5 w-5 text-[#16C784]" />
            <h3 className="font-display text-base font-bold text-white">Secure PDF Textbook Library</h3>
            <p className="text-xs text-[#9AA4B2]">
              Admin-curated textbooks, standards summaries and revision packs with authorised per-level download permissions.
            </p>
          </div>
          <div className="v-card p-5 space-y-2">
            <Video className="h-5 w-5 text-[#16C784]" />
            <h3 className="font-display text-base font-bold text-white">Structured Video Lessons</h3>
            <p className="text-xs text-[#9AA4B2]">
              Organised by programme, examination level, course, verified tutor and syllabus topic with playlist progression.
            </p>
          </div>
          <div className="v-card p-5 space-y-2">
            <ShoppingBag className="h-5 w-5 text-[#16C784]" />
            <h3 className="font-display text-base font-bold text-white">Hard-Copy Study Packs & PQs</h3>
            <p className="text-xs text-[#9AA4B2]">
              Automatic volume & multi-course discounts up to 9%, free delivery across 6 Lagos campus hubs and Paystack checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Filterable 27-Paper Directory */}
      <section className="py-14">
        <div className="v-container space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex rounded-xl bg-[#11161C] border border-white/[0.08] p-1 gap-1 self-start">
              {['ALL', 'ATSWA', 'ICAN'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterProg(tab)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                    filterProg === tab
                      ? 'bg-[#16C784] text-[#06130D]'
                      : 'text-[#9AA4B2] hover:text-white'
                  }`}
                >
                  {tab === 'ALL' ? 'All 27 Papers' : tab}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search paper or code (e.g. SBR, BAPS)..."
                className="v-input pl-10 text-xs"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="v-card p-10 text-center text-sm text-[#9AA4B2]">
              No syllabus course matches “{query}”. Try another paper code or clear filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="v-card-hover p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="green">
                        {item.programme} · {item.levelName}
                      </Badge>
                      <span className="font-display text-xs font-bold text-[#F4F6F9]">
                        {item.code}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex -space-x-2 shrink-0">
                        <img
                          src={item.packImg}
                          alt={`${item.title} Study Pack`}
                          loading="lazy"
                          className="h-14 w-11 rounded-lg object-cover border border-white/[0.15] shadow"
                        />
                        <img
                          src={item.pqImg}
                          alt={`${item.title} Past Questions`}
                          loading="lazy"
                          className="h-14 w-11 rounded-lg object-cover border border-white/[0.15] shadow translate-y-1"
                        />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h3 className="font-display text-sm sm:text-base font-bold text-white leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-[#9AA4B2] inline-flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.hex }}
                          />
                          {item.colour} · {item.topics} topics
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
                    <span className="text-[#9AA4B2]">
                      Pack:{' '}
                      <strong className="tabular-nums-display text-white">
                        {formatNaira(item.packPrice)}
                      </strong>{' '}
                      · PQ:{' '}
                      <strong className="tabular-nums-display text-white">
                        {formatNaira(item.pqPrice)}
                      </strong>
                    </span>
                    <Link to="/store" className="font-semibold text-[#16C784] hover:underline shrink-0">
                      Order →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
