import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, Radio } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

function shuffleList(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function resolvePageTickerKey(pathname) {
  const path = (pathname || '/').toLowerCase();
  if (path === '/') return 'home';
  if (path.startsWith('/programmes/atswa')) return 'atswa';
  if (path.startsWith('/programmes/ican/exemptions')) return 'icanExemptions';
  if (path.startsWith('/programmes/ican/guide')) return 'icanGuide';
  if (path.startsWith('/programmes/ican')) return 'ican';
  if (path.startsWith('/programmes/tertiary')) return 'tertiary';
  if (path.startsWith('/programmes')) return 'programmes';
  if (path.startsWith('/store')) return 'store';
  if (path.startsWith('/study-materials')) return 'studyMaterials';
  if (path.startsWith('/connect')) return 'connect';
  if (path.startsWith('/competitions')) return 'competitions';
  if (path.startsWith('/opportunities')) return 'opportunities';
  if (path.startsWith('/tuition-centres')) return 'tuitionCentres';
  if (path.startsWith('/advertise')) return 'advertise';
  if (path.startsWith('/services')) return 'services';
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/contact')) return 'contact';
  if (path.startsWith('/legal')) return 'legal';
  if (path.startsWith('/portal')) return 'portal';
  return 'home';
}

// Gentle, unhurried crawl (~0.24s per character ~ 28-32 px/sec) so visitors comfortably read every word
const SECONDS_PER_CHAR = 0.24;

export default function WisdomTicker() {
  const { motivationalQuotes, pageTickerNotices } = usePlatform();
  const { pathname } = useLocation();
  const [touchPaused, setTouchPaused] = useState(false);

  const shuffledQuotes = useMemo(() => {
    if (!motivationalQuotes || motivationalQuotes.length === 0) return [];
    return shuffleList(motivationalQuotes);
  }, [motivationalQuotes]);

  const pageKey = resolvePageTickerKey(pathname);
  const pageConfig =
    pageKey !== 'home' && pageTickerNotices ? pageTickerNotices[pageKey] : null;

  const isQuoteMode = !pageConfig || !pageConfig.items?.length;
  const badgeLabel = isQuoteMode ? 'Wisdom' : pageConfig.label;
  const BadgeIcon = isQuoteMode ? Sparkles : Radio;

  const activeEntries = useMemo(() => {
    if (isQuoteMode) {
      return shuffledQuotes.map((q) => ({
        id: q.id,
        text: q.quote,
        meta: q.author || '',
        isQuote: true,
      }));
    }
    return pageConfig.items.map((item) => ({
      id: item.id,
      text: item.text,
      meta: item.tag || '',
      isQuote: false,
    }));
  }, [isQuoteMode, shuffledQuotes, pageConfig]);

  // Keep reading velocity consistently calm regardless of whether 4 or 30 messages are running
  const durationSeconds = useMemo(() => {
    const totalChars = activeEntries.reduce(
      (sum, entry) => sum + entry.text.length + (entry.meta ? entry.meta.length + 8 : 6),
      0
    );
    return Math.max(75, Math.round(totalChars * SECONDS_PER_CHAR));
  }, [activeEntries]);

  if (activeEntries.length === 0) return null;

  const renderSet = (prefix) =>
    activeEntries.map((entry) => (
      <span
        key={`${prefix}-${entry.id}`}
        className="inline-flex items-center gap-2.5 pr-14 text-[11.5px] whitespace-nowrap"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#E0A82E] shrink-0" />
        {!entry.isQuote && entry.meta && (
          <span className="rounded bg-[#E0A82E]/15 border border-[#E0A82E]/30 px-1.5 py-0.5 font-display text-[9.5px] font-bold uppercase tracking-wider text-[#E0A82E]">
            {entry.meta}
          </span>
        )}
        <span className="text-[#E5E9F0] font-normal">
          {entry.isQuote ? `“${entry.text}”` : entry.text}
        </span>
        {entry.isQuote && entry.meta && (
          <span className="font-display font-semibold text-[#E0A82E] text-[11px]">
            ({entry.meta})
          </span>
        )}
      </span>
    ));

  return (
    <div
      role="region"
      aria-label={isQuoteMode ? 'Daily life and wisdom quotes' : `${badgeLabel} live updates`}
      data-paused={touchPaused ? 'true' : 'false'}
      onClick={() => setTouchPaused((p) => !p)}
      title="Hover or tap to pause reading"
      className="v-wisdom-bar w-full bg-[#06080A] border-b border-white/[0.07] overflow-hidden select-none cursor-pointer"
    >
      <div className="flex h-8 items-center">
        <div className="shrink-0 z-10 flex h-full items-center gap-1.5 bg-[#06080A] pl-3 sm:pl-5 pr-3 border-r border-white/[0.08]">
          <BadgeIcon className="h-3 w-3 text-[#E0A82E] shrink-0" />
          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-[#E0A82E] whitespace-nowrap">
            {badgeLabel}
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            key={pageKey}
            style={{ '--ticker-duration': `${durationSeconds}s` }}
            className="v-wisdom-track items-center py-1"
          >
            <div className="inline-flex items-center">{renderSet('a')}</div>
            <div className="inline-flex items-center" aria-hidden="true">
              {renderSet('b')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
