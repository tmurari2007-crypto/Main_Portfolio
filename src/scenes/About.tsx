import React, { useRef } from 'react';
import { useSceneRef } from '../engine/hooks';
import { DATA } from '../data';
import { TiltCard } from '../components/TiltCard';
import { Odometer } from '../components/Odometer';

export const About: React.FC = () => {
  const scrollProgRef = useRef(0);

  const frontRef = useSceneRef<HTMLDivElement>('about', (el, state) => {
    const m = state.metrics['about'];
    if (!m) return;

    scrollProgRef.current = m.p;
    const fadeOut = Math.max(0, 1 - m.exit * 2.4);
    el.style.opacity = `${m.vis * fadeOut}`;
    el.style.transform = `translate3d(0, ${-m.exit * 30}px, 0)`;

    // Reveal manifesto words word by word: opacity .1 -> 1, translateY .25em -> 0, blur 4px -> 0
    const words = el.querySelectorAll<HTMLSpanElement>('.manifesto-word');
    const totalWords = words.length;
    words.forEach((word, idx) => {
      const wordThreshold = idx / totalWords;
      const wordProgress = Math.max(0, Math.min(1, (m.p - wordThreshold * 0.7) / 0.15));
      const op = 0.1 + 0.9 * wordProgress;
      const ty = (1 - wordProgress) * 0.25;
      const blur = (1 - wordProgress) * 4;
      word.style.opacity = `${op}`;
      word.style.transform = `translateY(${ty}em)`;
      word.style.filter = `blur(${blur}px)`;
    });
  });

  return (
    <section className="relative w-full h-[280vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-end">
        {/* Right column on desktop, overlay panel on mobile */}
        <div
          ref={frontRef}
          className="w-full md:w-[48vw] px-6 md:px-0 md:mr-[5vw] top-[14vh] md:top-[15vh] max-h-[85vh] flex flex-col justify-between z-30 transition-opacity duration-75"
        >
          {/* Section Label */}
          <div className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] mb-4 select-none">
            <span className="text-[#ff1f1f] font-bold mr-2">(01)</span>
            <span>— About me & Background</span>
          </div>

          {/* About narrative */}
          <div className="space-y-4 mb-8 overflow-y-auto max-h-[46vh] pr-2">
            <p className="font-sans font-semibold text-[clamp(17px,1.6vw,24px)] leading-relaxed text-[#0d0d0d] tracking-tight">
              {DATA.personal.aboutParagraphs[0]}
            </p>
            <p className="font-sans text-xs md:text-sm text-[#5e5e5e] leading-relaxed">
              {DATA.personal.aboutParagraphs[1]}
            </p>
            <p className="font-sans text-xs md:text-sm text-[#0d0d0d] font-medium leading-relaxed bg-[#ff1f1f]/5 p-3 rounded-xl border border-[#ff1f1f]/10">
              <span className="font-bold text-[#ff1f1f]">Technical focus: </span>
              {DATA.personal.aboutParagraphs[2]}
            </p>
            <p className="font-sans text-xs md:text-sm text-[#5e5e5e] leading-relaxed">
              {DATA.personal.aboutParagraphs[3]}
            </p>
            <p className="font-sans text-xs md:text-sm text-[#5e5e5e] leading-relaxed">
              {DATA.personal.aboutParagraphs[4]}
            </p>
          </div>

          {/* Two Glass Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DATA.stats.map((stat, sIdx) => (
              <TiltCard
                key={sIdx}
                className="p-5 border border-white/60 bg-white/75 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[#5e5e5e] tracking-wider block mb-1">
                    {stat.label}
                  </span>
                  <div className="flex items-baseline gap-1 text-[#0d0d0d]">
                    <span className="odometer-val font-display text-4xl md:text-5xl font-bold tracking-tight">
                      {stat.decimals > 0 ? stat.value.toFixed(stat.decimals) : stat.value.toString()}
                    </span>
                    <span className="font-display text-2xl font-bold text-[#ff1f1f]">
                      {stat.suffix}
                    </span>
                  </div>
                </div>
                <p className="font-sans text-xs text-[#5e5e5e] font-medium mt-3 border-t border-black/5 pt-2">
                  {stat.sub}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
