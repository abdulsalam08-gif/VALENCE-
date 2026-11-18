import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  BookOpen,
  Store,
  MapPin,
  Search,
  Megaphone,
  ShieldAlert,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

export default function TuitionCentresPage() {
  const { tuitionCentres, textbookAdvertisers } = usePlatform();
  const [directoryTab, setDirectoryTab] = useState('centres'); // 'centres' | 'textbooks'
  const [search, setSearch] = useState('');
  const [progFilter, setProgFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');

  const activeList = directoryTab === 'centres' ? tuitionCentres : textbookAdvertisers;

  const availableStates = useMemo(
    () => Array.from(new Set(activeList.map((c) => c.state))).sort(),
    [activeList]
  );

  const filtered = useMemo(() => {
    return activeList.filter((c) => {
      if (progFilter !== 'ALL' && !c.programmes.some((p) => p.includes(progFilter))) return false;
      if (stateFilter !== 'ALL' && c.state !== stateFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.title && c.title.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q) ||
          c.subjects.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeList, search, progFilter, stateFilter]);

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">VERIFIED PARTNER DIRECTORY</Badge>
              <Badge variant="neutral">Physical Tuition Centres · Textbook Authors · Book Vendors</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
              Physical Tuition Centres, Textbook Authors &amp; Book Vendors
            </h1>
            <p className="text-sm text-[#9AA4B2]">
              Discover verified <strong className="text-white">physical (in-person) accounting tuition centres</strong> alongside{' '}
              <strong className="text-white">accounting textbook authors</strong> and{' '}
              <strong className="text-white">verified textbook vendors</strong> across Nigeria. All online tuition runs directly in-app with VALENCE-verified tutors.
            </p>
          </div>
          <Link to="/advertise" className="v-btn-primary text-xs self-start shrink-0">
            <Megaphone className="h-4 w-4" /> Advertise In-App (₦10,000/Wk)
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="v-container space-y-6">
          {/* Directory Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-2xl bg-[#11161C] border border-white/[0.08] p-1.5 gap-1">
              <button
                type="button"
                onClick={() => {
                  setDirectoryTab('centres');
                  setStateFilter('ALL');
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-display font-bold transition-all ${
                  directoryTab === 'centres'
                    ? 'bg-[#16C784] text-[#06130D]'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                Physical Tuition Centres ({tuitionCentres.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setDirectoryTab('textbooks');
                  setStateFilter('ALL');
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-display font-bold transition-all ${
                  directoryTab === 'textbooks'
                    ? 'bg-[#16C784] text-[#06130D]'
                    : 'text-[#9AA4B2] hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Textbook Authors &amp; Vendors ({textbookAdvertisers.length})
              </button>
            </div>

            <Link to="/programmes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16C784] hover:underline">
              <GraduationCap className="h-4 w-4" />
              Want Online Classes? Join In-App Verified Tutors <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  directoryTab === 'centres'
                    ? 'Search physical centre, area (Yaba, Ojo, Wuse) or paper...'
                    : 'Search author, bookshop, textbook topic (IFRS, TAX, SBR)...'
                }
                className="v-input pl-10 text-xs"
              />
            </div>
            <select
              value={progFilter}
              onChange={(e) => setProgFilter(e.target.value)}
              aria-label="Filter by programme"
              className="v-input text-xs"
            >
              <option value="ALL">All Programmes &amp; Levels</option>
              <option value="ATSWA">ATSWA</option>
              <option value="ICAN Foundation">ICAN Foundation</option>
              <option value="ICAN Skills">ICAN Skills</option>
              <option value="ICAN Professional">ICAN Professional</option>
              <option value="University">University Accounting</option>
            </select>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              aria-label="Filter by state"
              className="v-input text-xs"
            >
              <option value="ALL">All States</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-[#11161C] border border-white/[0.07] p-3.5 flex items-start gap-2.5 text-xs text-[#9AA4B2]">
            <ShieldAlert className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
            <p>
              VALENCE ADVERTISE features verified <strong className="text-white">physical tuition centres</strong> (never external online tuition), <strong className="text-white">accounting textbook authors</strong>, and <strong className="text-white">verified textbook vendors</strong> supplying genuine editions. Paid slots display <strong className="text-[#EA3943]">Sponsored</strong> or <strong className="text-[#EA3943]">Advertisement</strong> badges.
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="v-card p-10 text-center text-sm text-[#9AA4B2]">
              No listing matches your current filter. Reset filters or try another keyword.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((item) => {
                const ItemIcon =
                  directoryTab === 'centres'
                    ? Building2
                    : item.type === 'Textbook Author'
                    ? BookOpen
                    : Store;
                return (
                  <div key={item.id} className="v-card-hover p-6 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.verified && (
                            <Badge variant="verified">
                              {directoryTab === 'centres'
                                ? 'Verified Physical Centre'
                                : `Verified ${item.type}`}
                            </Badge>
                          )}
                          {item.schedule && <Badge variant="neutral">{item.schedule}</Badge>}
                        </div>
                        {item.sponsored && <Badge variant="sponsored">{item.adLabel}</Badge>}
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B0E11] border border-white/[0.08] text-[#16C784]">
                          <ItemIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="font-display text-lg font-bold text-white">{item.name}</h2>
                          {item.title && (
                            <p className="text-xs font-semibold text-[#16C784] mt-0.5 leading-snug">
                              {item.title}
                            </p>
                          )}
                          <p className="text-xs text-[#9AA4B2] inline-flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-[#16C784]" /> {item.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-[#9AA4B2]">{item.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.programmes.map((p) => (
                          <span
                            key={p}
                            className="rounded-lg bg-[#16C784]/10 border border-[#16C784]/25 px-2.5 py-0.5 text-[11px] font-medium text-[#16C784]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-white/[0.06] pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9AA4B2]">
                      <span>Subjects: {item.subjects.join(' · ')}</span>
                      <span className="text-[#C2C9D4]">
                        {directoryTab === 'centres' ? item.mode : 'Authentic Editions Only'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
