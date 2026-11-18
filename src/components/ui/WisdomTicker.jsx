import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

function shuffleQuotes(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function WisdomTicker() {
  const { motivationalQuotes } = usePlatform();

  // Randomise quote order per session so visitors always see fresh wisdom first
  const orderedQuotes = useMemo(() => {
    if (!motivationalQuotes || motivationalQuotes.length === 0) return [];
    return shuffleQuotes(motivationalQuotes);
  }, [motivationalQuotes]);

  if (orderedQuotes.length === 0) return null;

  const renderQuoteSet = (prefix) =>
    orderedQuotes.map((q) => (
      <span
        key={`${prefix}-${q.id}`}
        className="inline-flex items-center gap-2.5 pr-12 text-[11.5px] whitespace-nowrap"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#16C784] shrink-0" />
        <span className="text-[#E5E9F0] font-normal">&ldquo;{q.quote}&rdquo;</span>
        {q.author && (
          <span className="font-display font-semibold text-[#16C784] text-[11px]">
            ({q.author})
          </span>
        )}
      </span>
    ));

  return (
    <div
      role="region"
      aria-label="Daily life and wisdom quotes"
      className="v-wisdom-bar w-full bg-[#06080A] border-b border-white/[0.07] overflow-hidden select-none"
    >
      <div className="flex h-8 items-center">
        <div className="shrink-0 z-10 flex h-full items-center gap-1.5 bg-[#06080A] pl-3 sm:pl-5 pr-3 border-r border-white/[0.08]">
          <Sparkles className="h-3 w-3 text-[#16C784]" />
          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-[#16C784]">
            Wisdom
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="v-wisdom-track items-center py-1">
            <div className="inline-flex items-center">{renderQuoteSet('a')}</div>
            <div className="inline-flex items-center" aria-hidden="true">
              {renderQuoteSet('b')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
