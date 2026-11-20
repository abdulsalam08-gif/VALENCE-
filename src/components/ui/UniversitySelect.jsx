import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, ChevronDown, Search, Check } from 'lucide-react';
import { NIGERIAN_UNIVERSITIES } from '../../data/nigerianUniversities';

export default function UniversitySelect({
  value,
  onChange,
  label = 'Nigerian University, Polytechnic or College',
  placeholder = 'Search university, polytechnic or college (UNILAG, YABATECH, LASU, Auchi Poly, FCE)...',
  allowCustom = true,
  id = 'university-select',
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NIGERIAN_UNIVERSITIES.filter((u) => {
      if (catFilter !== 'ALL' && u.category !== catFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q)
      );
    });
  }, [query, catFilter]);

  const categoryCounts = useMemo(() => {
    const counts = { ALL: NIGERIAN_UNIVERSITIES.length };
    for (const u of NIGERIAN_UNIVERSITIES) {
      counts[u.category] = (counts[u.category] || 0) + 1;
    }
    return counts;
  }, []);

  const selectItem = (labelText) => {
    onChange(labelText);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label htmlFor={id} className="v-label">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="v-input flex items-center justify-between gap-2 text-left"
      >
        <span className={`truncate flex items-center gap-2 ${value ? 'text-[#F4F6F9]' : 'text-[#667085]'}`}>
          <Building2 className="h-4 w-4 text-[#E0A82E] shrink-0" />
          <span className="truncate">{value || placeholder}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#9AA4B2] shrink-0 transition-transform ${
            open ? 'rotate-180 text-[#E0A82E]' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-[#11161C] border border-white/[0.12] shadow-2xl p-3 space-y-2.5 animate-fade-up">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, acronym (UNILAG, YABATECH, FPILARO, FCE) or state..."
              className="v-input pl-9 py-2 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {[
              ['ALL', 'All Institutions'],
              ['Federal', 'Federal'],
              ['State', 'State'],
              ['Private', 'Private'],
              ['Polytechnic', 'Polytechnic'],
              ['College', 'College'],
            ].map(([c, label]) => (
              <button
                key={c}
                type="button"
                onClick={() => setCatFilter(c)}
                className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors ${
                  catFilter === c
                    ? 'bg-[#E0A82E] text-[#06130D]'
                    : 'bg-[#0B0E11] text-[#9AA4B2] hover:text-white'
                }`}
              >
                {label} ({categoryCounts[c] || 0})
              </button>
            ))}
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {matches.map((u) => {
              const display = `${u.name} (${u.shortName})`;
              const isSelected = value === display;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => selectItem(display)}
                  className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#E0A82E]/15 text-[#E0A82E] border border-[#E0A82E]/30'
                      : 'hover:bg-white/[0.05] text-[#D5DBE3]'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {u.name}{' '}
                      <span className="font-display font-bold text-[#E0A82E]">({u.shortName})</span>
                    </p>
                    <p className="text-[10.5px] text-[#667085]">
                      {u.typeLabel || `${u.category} University`} · {u.state} ({u.zone})
                    </p>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[#E0A82E] shrink-0" />}
                </button>
              );
            })}

            {allowCustom && query.trim().length > 2 && (
              <button
                type="button"
                onClick={() => selectItem(query.trim())}
                className="w-full rounded-xl bg-[#0B0E11] border border-dashed border-[#E0A82E]/40 px-3 py-2 text-left text-xs text-[#E0A82E] hover:bg-[#E0A82E]/10"
              >
                Use polytechnic / college / foreign institution: “{query.trim()}”
              </button>
            )}

            {matches.length === 0 && !allowCustom && (
              <p className="py-4 text-center text-xs text-[#667085]">
                No Nigerian university matches “{query}”.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
