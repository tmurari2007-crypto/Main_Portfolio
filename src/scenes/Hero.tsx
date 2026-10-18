import React from 'react';
import { useSceneRef } from '../engine/hooks';
import { director } from '../engine/director';
import { DATA } from '../data';

export const Hero: React.FC = () => {
  const frontRef = useSceneRef<HTMLDivElement>('hero', (el, state) => {
    const m = state.metrics['hero'];
    if (!m) return;
    const fadeOut = Math.max(0, 1 - m.exit * 2.4);
    el.style.opacity = `${m.vis * fadeOut}`;
    el.style.transform = `translate3d(0, ${-m.exit * 40}px, 0)`;

    // Red highlighter underline whose width grows with scroll progress
    const underline = el.querySelector<HTMLDivElement>('.reading-underline');
    if (underline) {
      underline.style.width = `${Math.min(100, Math.max(0, m.p * 115))}%`;
    }
  });

  return (
    <section className="relative w-full h-[230vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Front content */}
        <div
          ref={frontRef}
          className="absolute left-[5vw] top-[22vh] md:top-[26vh] max-w-[90vw] md:max-w-[min(47vw,780px)] z-30 transition-opacity duration-75 mobile-panel md:bg-transparent md:backdrop-blur-none md:p-0 md:border-none"
        >
          {/* Headline Title */}
          <h1 className="font-display text-[clamp(42px,5.8vw,112px)] leading-[0.9] uppercase tracking-tighter text-[#0d0d0d] mb-5">
            <span className="block">{DATA.personal.roleFirstLine}</span>
            <span className="block text-[#ff1f1f]">{DATA.personal.roleSecondLine}</span>
          </h1>

          {/* Intro description with progressive reading underline */}
          <div className="relative inline-block mb-8">
            <p className="font-sans text-[clamp(15px,1.2vw,19px)] text-[#0d0d0d] font-semibold leading-relaxed max-w-[34em]">
              {DATA.personal.intro}
            </p>
            <div className="reading-underline absolute bottom-0 left-0 h-[3px] bg-[#ff1f1f] transition-[width] duration-75 ease-out rounded-full" />
          </div>

          {/* Action Buttons: View My Projects, Download Resume, Contact Me */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              data-cursor="Open"
              onClick={() => director.scrollToScene(2)} // Work scene
              className="relative group h-[52px] px-7 rounded-full bg-[#ff1f1f] text-white font-sans font-bold text-xs uppercase tracking-wider overflow-hidden shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Projects ↘
              </span>
              <div className="absolute inset-0 bg-[#0d0d0d] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>

            <a
              href={DATA.personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="PDF"
              className="relative group h-[52px] px-7 rounded-full border-2 border-[#0d0d0d] text-[#0d0d0d] font-sans font-bold text-xs uppercase tracking-wider overflow-hidden transition-transform hover:scale-105 active:scale-95 flex items-center"
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                Resume ↗
              </span>
              <div className="absolute inset-0 bg-[#ff1f1f] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </a>

            <button
              data-cursor="Write"
              onClick={() => director.scrollToScene(6)} // Contact scene
              className="relative group h-[52px] px-7 rounded-full border-2 border-[#ff1f1f]/30 text-[#0d0d0d] bg-white font-sans font-bold text-xs uppercase tracking-wider overflow-hidden transition-transform hover:scale-105 active:scale-95 flex items-center"
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                Contact Me ✉
              </span>
              <div className="absolute inset-0 bg-[#ff1f1f] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
