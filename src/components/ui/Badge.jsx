import React from 'react';
import { BadgeCheck, ShieldCheck, Megaphone } from 'lucide-react';

const STYLES = {
  green: 'bg-[#E0A82E]/15 text-[#E0A82E] border border-[#E0A82E]/30',
  red: 'bg-[#EA3943]/15 text-[#EA3943] border border-[#EA3943]/30',
  neutral: 'bg-white/[0.06] text-[#9AA4B2] border border-white/[0.1]',
  verified: 'bg-[#E0A82E]/15 text-[#E0A82E] border border-[#E0A82E]/35',
  official: 'bg-[#E0A82E] text-[#06130D] font-bold border border-[#E0A82E]',
  community: 'bg-[#161D26] text-[#9AA4B2] border border-white/[0.1]',
  sponsored: 'bg-[#EA3943]/15 text-[#EA3943] border border-[#EA3943]/35 uppercase tracking-wider',
  live: 'bg-[#EA3943]/15 text-[#EA3943] border border-[#EA3943]/35',
};

export default function Badge({ variant = 'neutral', children, className = '' }) {
  const style = STYLES[variant] || STYLES.neutral;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${style} ${className}`}
    >
      {variant === 'verified' && <BadgeCheck className="h-3.5 w-3.5 shrink-0" />}
      {variant === 'official' && <ShieldCheck className="h-3.5 w-3.5 shrink-0" />}
      {variant === 'sponsored' && <Megaphone className="h-3 w-3 shrink-0" />}
      {variant === 'live' && (
        <span className="h-1.5 w-1.5 rounded-full bg-[#EA3943] animate-pulse-soft" />
      )}
      {children}
    </span>
  );
}
