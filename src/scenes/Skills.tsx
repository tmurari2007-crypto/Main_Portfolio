import React from 'react';
import { useSceneRef } from '../engine/hooks';
import { DATA } from '../data';

export const Skills: React.FC = () => {
  const frontRef = useSceneRef<HTMLDivElement>('skills', (el, state) => {
    const m = state.metrics['skills'];
    if (!m) return;

    const fadeOut = Math.max(0, 1 - m.exit * 2.4);
    el.style.opacity = `${m.vis * fadeOut}`;
    el.style.transform = `translate3d(0, ${-m.exit * 30}px, 0)`;

    // Marquee scroll movement
    const marquee = el.querySelector<HTMLDivElement>('.skills-marquee-track');
    if (marquee) {
      // Move with scroll
      const offset = (m.p * 600) % 1200;
      marquee.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }
  });

  return (
    <section className="relative w-full h-[280vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Title at top-left */}
        <div
          ref={frontRef}
          className="pt-[14vh] pl-[6vw] z-30 transition-opacity duration-75 select-none"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] mb-3">
            <span className="text-[#ff1f1f] font-bold mr-2">(04)</span>
            <span>— Technical Stack</span>
          </div>

          <h2 className="font-display text-[clamp(44px,6vw,96px)] leading-[0.88] text-[#0d0d0d] uppercase tracking-tighter">
            <span className="block">EVERYTHING</span>
            <span className="block text-[#ff1f1f]">IN ORBIT.</span>
          </h2>
        </div>

        {/* Bottom Red Marquee Tape */}
        <div className="relative w-full h-[10vh] min-h-[70px] bg-[#ff1f1f] -rotate-2 -mb-4 overflow-hidden flex items-center z-30 shadow-xl select-none">
          <div className="skills-marquee-track whitespace-nowrap flex items-center gap-8 font-display text-2xl md:text-4xl text-white uppercase tracking-wider will-change-transform">
            {[...DATA.skills, ...DATA.skills, ...DATA.skills].map((skill, idx) => (
              <span key={idx} className="flex items-center gap-8">
                <span>{skill}</span>
                <span className="text-white/60 text-lg">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
