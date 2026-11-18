import React, { useEffect, useState } from 'react';

function getRemaining(targetIso) {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export default function CountdownTimer({ targetDate, compact = false }) {
  const [time, setTime] = useState(() => getRemaining(targetDate));

  useEffect(() => {
    setTime(getRemaining(targetDate));
    const id = setInterval(() => setTime(getRemaining(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const cells = [
    { label: 'Days', val: String(time.days).padStart(2, '0') },
    { label: 'Hrs', val: String(time.hours).padStart(2, '0') },
    { label: 'Min', val: String(time.mins).padStart(2, '0') },
    { label: 'Sec', val: String(time.secs).padStart(2, '0') },
  ];

  return (
    <div className="grid grid-cols-4 gap-2" aria-label="Examination countdown timer">
      {cells.map((c) => (
        <div
          key={c.label}
          className={`rounded-xl bg-[#0B0E11] border border-white/[0.08] text-center ${
            compact ? 'px-2 py-1.5' : 'px-2.5 py-2.5'
          }`}
        >
          <div
            className={`tabular-nums-display font-bold text-[#F4F6F9] ${
              compact ? 'text-base' : 'text-lg sm:text-xl'
            }`}
          >
            {c.val}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[#667085]">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
