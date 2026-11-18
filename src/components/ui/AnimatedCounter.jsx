import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
  decimals = 0,
  className = '',
}) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const target = Number(value) || 0;
    let frameId;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(target * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplay(target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [hasAnimated, value, duration]);

  const formatted =
    decimals > 0
      ? display.toLocaleString('en-NG', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(display).toLocaleString('en-NG');

  return (
    <span ref={ref} className={`tabular-nums-display ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
