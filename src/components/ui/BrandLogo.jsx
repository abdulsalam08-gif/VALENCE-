import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({ size = 'md', showSubtext = true, to = '/' }) {
  const sizes = {
    sm: { box: 'h-8 w-8 rounded-lg', img: 'h-6 w-6', text: 'text-base', sub: 'text-[9.5px]' },
    md: { box: 'h-9 w-9 rounded-xl', img: 'h-7 w-7', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'h-12 w-12 rounded-2xl', img: 'h-9 w-9', text: 'text-2xl', sub: 'text-[11.5px]' },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <span className="inline-flex items-center gap-2.5 group">
      <span
        className={`relative inline-flex ${s.box} items-center justify-center bg-[#0F141A] border border-[#E0A82E]/25 shadow-glow-sm transition-transform duration-200 group-hover:scale-[1.03] group-hover:border-[#E0A82E]/50 overflow-hidden`}
      >
        <img
          src="/valence-mark-sm.png"
          alt="VALENCE emblem"
          className={`${s.img} object-contain select-none`}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display ${s.text} font-bold tracking-[0.07em] text-[#F4F6F9] group-hover:text-white transition-colors`}
        >
          VALENCE
        </span>
        {showSubtext && (
          <span className={`mt-0.5 ${s.sub} italic font-medium tracking-wide text-[#E0A82E]/90`}>
            Vita sine litteris mors est.
          </span>
        )}
      </span>
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} aria-label="VALENCE Home" className="focus:outline-none">
      {content}
    </Link>
  );
}
