import React from 'react';
import { useSceneRef } from '../engine/hooks';
import { DATA } from '../data';

export const Journey: React.FC = () => {
  const frontRef = useSceneRef<HTMLDivElement>('journey', (el, state) => {
    const m = state.metrics['journey'];
    if (!m) return;

    const fadeOut = Math.max(0, 1 - m.exit * 2.4);
    el.style.opacity = `${m.vis * fadeOut}`;
    el.style.transform = `translate3d(0, ${-m.exit * 30}px, 0)`;

    // Draw SVG line from bottom up: pathLength=1, strokeDashoffset
    const path = el.querySelector<SVGPathElement>('.journey-svg-path');
    if (path) {
      // Line is drawn as user scrolls
      const offset = Math.max(0, Math.min(1, 1 - m.p * 1.2));
      path.style.strokeDashoffset = `${offset}`;
    }

    // Reveal items cleanly from the start of the journey section
    const items = el.querySelectorAll<HTMLDivElement>('.timeline-item');
    items.forEach((item, idx) => {
      // items appear early as soon as the user enters the scene
      const itemThresh = idx * 0.08;
      const itemP = Math.max(0, Math.min(1, (m.p + 0.15 - itemThresh) / 0.25));
      const rotY = (1 - itemP) * -20;
      const op = Math.max(0.2, itemP); // visible right away at low opacity and fades to 100%
      item.style.transform = `perspective(800px) rotateY(${rotY}deg) translateX(${(1 - itemP) * 15}px)`;
      item.style.opacity = `${op}`;

      // Node highlight
      const node = item.querySelector<HTMLDivElement>('.timeline-node');
      if (node) {
        if (itemP > 0.5) {
          node.classList.add('bg-[#ff1f1f]', 'border-[#ff1f1f]');
          node.classList.remove('bg-white', 'border-black/20');
        } else {
          node.classList.remove('bg-[#ff1f1f]', 'border-[#ff1f1f]');
          node.classList.add('bg-white', 'border-black/20');
        }
      }
    });
  });

  return (
    <section className="relative w-full h-[240vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-end">
        {/* Right column on desktop with ample width and padding */}
        <div
          ref={frontRef}
          className="w-full md:w-[50vw] lg:w-[48vw] px-6 md:px-0 md:mr-[5vw] z-30 transition-opacity duration-75 max-h-[88vh] overflow-y-auto pr-2"
        >
          {/* Header */}
          <div className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] mb-2 select-none">
            <span className="text-[#ff1f1f] font-bold mr-2">(03)</span>
            <span>— Chronology</span>
          </div>

          <h2 className="font-display text-[clamp(30px,3.5vw,60px)] leading-[0.9] text-[#0d0d0d] uppercase tracking-tighter mb-6">
            <span className="block">LEARNING</span>
            <span className="block text-[#ff1f1f]">OUT LOUD.</span>
          </h2>

          {/* Timeline */}
          <div className="relative pl-8 md:pl-10 space-y-6">
            {/* SVG Track and Line drawing from bottom up */}
            <div className="absolute left-[7px] md:left-[9px] top-3 bottom-3 w-[2px]">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Background grey track */}
                <line
                  x1="0"
                  y1="100%"
                  x2="0"
                  y2="0"
                  stroke="rgba(13,13,13,0.1)"
                  strokeWidth="2"
                />
                {/* Foreground drawing red line */}
                <path
                  className="journey-svg-path"
                  d="M 0,1000 L 0,0"
                  fill="none"
                  stroke="#ff1f1f"
                  strokeWidth="2"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: 1,
                    transition: 'stroke-dashoffset 0.1s ease-out',
                  }}
                />
              </svg>
            </div>

            {DATA.journey.items.map((item, iIdx) => (
              <div
                key={iIdx}
                className="timeline-item relative transform-gpu will-change-transform transition-all duration-200"
              >
                {/* Indicator Node */}
                <div className="timeline-node absolute -left-[29px] md:-left-[37px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-black/20 bg-white transition-colors duration-300 shadow-sm" />

                <span className="font-mono text-xs uppercase font-bold text-[#ff1f1f] block mb-0.5">
                  {item.year}
                </span>
                <h4 className="font-display text-xl md:text-2xl text-[#0d0d0d] uppercase tracking-tight mb-1">
                  {item.title}
                </h4>
                <p className="font-mono text-[11px] text-[#5e5e5e] uppercase tracking-wider mb-1.5 font-medium">
                  {item.org}
                </p>
                <p className="font-sans text-xs md:text-sm text-[#5e5e5e] leading-relaxed max-w-[34em]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
