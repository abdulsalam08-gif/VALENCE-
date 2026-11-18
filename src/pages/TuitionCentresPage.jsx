import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Search, Megaphone, ShieldAlert } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Badge from '../components/ui/Badge';

export default function TuitionCentresPage() {
  const { tuitionCentres } = usePlatform();
  const [search, setSearch] = useState('');
  const [progFilter, setProgFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return tuitionCentres.filter((c) => {
      if (progFilter !== 'ALL' && !c.programmes.some((p) => p.includes(progFilter))) return false;
      if (modeFilter !== 'ALL' && !c.mode.toLowerCase().includes(modeFilter.toLowerCase())) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.subjects.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [tuitionCentres, search, progFilter, modeFilter]);

  return (
    <div className="divide-y divide-white/[0.06]">
      <section className="bg-grid-fintech py-14 sm:py-18">
        <div className="v-container flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <Badge variant="green">TUITION CENTRES DIRECTORY</Badge>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
              Discover Verified Tuition Centres Across Nigeria
            </h1>
            <p className="text-sm text-[#9AA4B2]">
              Filter verified accounting tutorial institutes by programme, subject, location and delivery mode (Online or Physical).
            </p>
          </div>
          <Link to="/advertise" className="v-btn-primary text-xs self-start shrink-0">
            <Megaphone className="h-4 w-4" /> List & Advertise Your Centre
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="v-container space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search centre, city (Lagos, Abuja) or paper..."
                className="v-input pl-10 text-xs"
              />
            </div>
            <select
              value={progFilter}
              onChange={(e) => setProgFilter(e.target.value)}
              aria-label="Filter by programme"
              className="v-input text-xs"
            >
              <option value="ALL">All Programmes & Levels</option>
              <option value="ATSWA">ATSWA</option>
              <option value="ICAN Foundation">ICAN Foundation</option>
              <option value="ICAN Skills">ICAN Skills</option>
              <option value="ICAN Professional">ICAN Professional</option>
              <option value="University">University Accounting</option>
            </select>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              aria-label="Filter by tuition mode"
              className="v-input text-xs"
            >
              <option value="ALL">All Modes (Online & Physical)</option>
              <option value="Online">Online Tuition</option>
              <option value="Physical">Physical Tuition</option>
            </select>
          </div>

          <div className="rounded-xl bg-[#11161C] border border-white/[0.07] p-3.5 flex items-start gap-2.5 text-xs text-[#9AA4B2]">
            <ShieldAlert className="h-4 w-4 text-[#16C784] shrink-0 mt-0.5" />
            <p>
              Paid enhanced-visibility placements are clearly marked <strong className="text-[#EA3943]">Sponsored</strong> or <strong className="text-[#EA3943]">Advertisement</strong>. Advertiser verification confirms business identity and does not guarantee teaching quality, official ICAN accreditation or examination outcomes.
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="v-card p-10 text-center text-sm text-[#9AA4B2]">
              No tuition centre matches your current filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((c) => (
                <div key={c.id} className="v-card-hover p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {c.verified && <Badge variant="verified">Verified Centre</Badge>}
                        <Badge variant="neutral">{c.mode}</Badge>
                      </div>
                      {c.sponsored && <Badge variant="sponsored">{c.adLabel}</Badge>}
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B0E11] border border-white/[0.08] text-[#16C784]">
                        <Building2 className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-display text-lg font-bold text-white">{c.name}</h2>
                        <p className="text-xs text-[#9AA4B2] inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#16C784]" /> {c.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-[#9AA4B2]">{c.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.programmes.map((p) => (
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
                    <span>Papers: {c.subjects.join(' · ')}</span>
                    <span className="text-[#C2C9D4]">{c.contact}</span>
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
