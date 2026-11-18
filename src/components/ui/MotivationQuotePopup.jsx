import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, RefreshCw, X, BellOff } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

const MUTE_KEY = 'valence_quotes_paused_v1';
const INITIAL_DELAY_MS = 3800;
const AUTO_HIDE_MS = 12000;
const INTERVAL_POPUP_MS = 70000;

export default function MotivationQuotePopup() {
  const { motivationalQuotes } = usePlatform();
  const { pathname } = useLocation();

  const [paused, setPaused] = useState(() => {
    try {
      return sessionStorage.getItem(MUTE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(() =>
    Math.floor(Math.random() * Math.max(1, motivationalQuotes.length))
  );
  const routeStepsRef = useRef(0);
  const lastIdxRef = useRef(quoteIdx);

  const pickNextRandom = useCallback(() => {
    if (!motivationalQuotes || motivationalQuotes.length === 0) return;
    if (motivationalQuotes.length === 1) {
      setQuoteIdx(0);
      return;
    }
    let next = Math.floor(Math.random() * motivationalQuotes.length);
    if (next === lastIdxRef.current) {
      next = (next + 1 + Math.floor(Math.random() * (motivationalQuotes.length - 1))) %
        motivationalQuotes.length;
    }
    lastIdxRef.current = next;
    setQuoteIdx(next);
  }, [motivationalQuotes]);

  const showFreshQuote = useCallback(() => {
    pickNextRandom();
    setVisible(true);
  }, [pickNextRandom]);

  // Initial welcome quote pop-up shortly after opening the app
  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => {
      setVisible(true);
    }, INITIAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [paused]);

  // Periodic random motivational pop-up while studying on the app
  useEffect(() => {
    if (paused) return undefined;
    const interval = setInterval(() => {
      showFreshQuote();
    }, INTERVAL_POPUP_MS);
    return () => clearInterval(interval);
  }, [paused, showFreshQuote]);

  // Also surface a fresh quote every 3 page navigations if not currently open
  useEffect(() => {
    if (paused) return undefined;
    routeStepsRef.current += 1;
    if (routeStepsRef.current > 1 && routeStepsRef.current % 3 === 0) {
      const t = setTimeout(() => {
        showFreshQuote();
      }, 1400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [pathname, paused, showFreshQuote]);

  // Auto-hide cleanly after reading window (pauses while hovered)
  useEffect(() => {
    if (!visible || hovered) return undefined;
    const t = setTimeout(() => {
      setVisible(false);
    }, AUTO_HIDE_MS);
    return () => clearTimeout(t);
  }, [visible, hovered, quoteIdx]);

  const handlePauseSession = () => {
    setPaused(true);
    setVisible(false);
    try {
      sessionStorage.setItem(MUTE_KEY, '1');
    } catch {
      // ignore storage errors
    }
  };

  const handleManualOpen = () => {
    if (paused) {
      setPaused(false);
      try {
        sessionStorage.removeItem(MUTE_KEY);
      } catch {
        // ignore
      }
    }
    showFreshQuote();
  };

  if (!motivationalQuotes || motivationalQuotes.length === 0) return null;
  const current = motivationalQuotes[quoteIdx] || motivationalQuotes[0];

  if (!visible) {
    return (
      <button
        type="button"
        onClick={handleManualOpen}
        aria-label="Show a random life and wisdom quote"
        title="Click for a random life and wisdom quote"
        className="fixed bottom-20 lg:bottom-6 left-4 sm:left-6 z-40 inline-flex items-center gap-1.5 rounded-full bg-[#11161C]/95 backdrop-blur-xl border border-[#16C784]/35 hover:border-[#16C784] px-3 py-2 text-[11px] font-display font-bold text-[#F4F6F9] shadow-xl hover:-translate-y-0.5 transition-all"
      >
        <Sparkles className="h-3.5 w-3.5 text-[#16C784]" />
        <span className="hidden sm:inline">Daily Wisdom</span>
      </button>
    );
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-20 lg:bottom-6 left-3 right-16 sm:right-auto sm:left-6 z-40 sm:w-[360px] rounded-2xl bg-[#11161C]/95 backdrop-blur-xl border border-[#16C784]/40 p-4 shadow-2xl animate-fade-up overflow-hidden"
    >
      {/* Top Emerald Accent Line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#16C784] via-[#34D399] to-transparent" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-[#16C784]">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          {current.tag}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={pickNextRandom}
            title="Show another random quote"
            aria-label="Show another random quote"
            className="rounded-lg p-1 text-[#9AA4B2] hover:text-[#16C784] hover:bg-white/[0.06] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handlePauseSession}
            title="Pause automatic quote pop-ups for this session"
            aria-label="Pause automatic quote pop-ups"
            className="rounded-lg p-1 text-[#667085] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <BellOff className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            title="Close quote"
            aria-label="Close motivational quote"
            className="rounded-lg p-1 text-[#9AA4B2] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <blockquote className="text-xs leading-relaxed text-[#F4F6F9] font-medium">
        “{current.quote}”
      </blockquote>

      <div className="mt-2.5 flex items-center justify-between gap-2 text-[10.5px]">
        <span className="text-[#9AA4B2] italic">{current.author}</span>
        <button
          type="button"
          onClick={pickNextRandom}
          className="font-semibold text-[#16C784] hover:underline shrink-0"
        >
          Next quote →
        </button>
      </div>
    </aside>
  );
}
