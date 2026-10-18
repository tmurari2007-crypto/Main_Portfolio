import React, { useEffect, useRef } from 'react';

interface OdometerProps {
  val: number;
  decimals?: number;
  progress: number; // 0..1
}

export const Odometer: React.FC<OdometerProps> = ({ val, decimals = 0, progress }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smoothstep between 0.55 and 1.0 for the lowest digit snap
  const smoothProgress = Math.max(0, Math.min(1, (progress - 0.55) / 0.45));
  const easedP = smoothProgress * smoothProgress * (3 - 2 * smoothProgress);

  const displayVal = val * easedP;
  const strVal = decimals > 0 ? displayVal.toFixed(decimals) : Math.round(displayVal).toString();
  const chars = strVal.split('');

  return (
    <div ref={containerRef} className="inline-flex items-baseline font-display overflow-hidden select-none">
      {chars.map((ch, idx) => {
        if (ch === '.' || ch === ',') {
          return (
            <span key={idx} className="text-current px-0.5">
              {ch}
            </span>
          );
        }

        const digit = parseInt(ch, 10);
        return (
          <div
            key={idx}
            className="relative h-[1.15em] w-[0.62em] overflow-hidden inline-block"
          >
            <div
              className="absolute top-0 left-0 flex flex-col transition-transform duration-300 ease-out"
              style={{
                transform: `translateY(-${digit * 10}%)`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, dIdx) => (
                <span
                  key={dIdx}
                  className="h-[1.15em] flex items-center justify-center font-display leading-none"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
