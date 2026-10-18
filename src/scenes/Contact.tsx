import React from 'react';
import { useSceneRef } from '../engine/hooks';
import { director } from '../engine/director';
import { DATA } from '../data';

export const Contact: React.FC = () => {
  const frontRef = useSceneRef<HTMLDivElement>('contact', (el, state) => {
    const m = state.metrics['contact'];
    if (!m) return;

    el.style.opacity = `${m.vis}`;
    el.style.transform = `translate3d(0, ${(1 - m.enter) * 30}px, 0)`;
  });

  return (
    <section className="relative w-full h-[240vh]">
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 md:p-14 z-40 pointer-events-none">
        <div
          ref={frontRef}
          className="relative w-full h-full flex flex-col justify-between transition-opacity duration-150 z-40"
        >
          {/* Top spacer (giant LET'S TALK is in Back Layer behind person) */}
          <div className="pt-12 select-none">
            <span className="font-mono text-xs uppercase tracking-widest text-white/80 font-bold block">
              (06) — INITIATE PROTOCOL
            </span>
          </div>

          {/* Bottom Grid: Left email, Right links */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pointer-events-auto pb-4">
            {/* Left: Contact Message & Email */}
            <div className="md:col-span-7 select-none">
              <p className="font-sans text-xs md:text-sm text-white/90 leading-relaxed mb-6 max-w-[32em]">
                {DATA.personal.contactMessage}
              </p>
              <span className="font-mono text-xs uppercase tracking-widest text-white/80 block mb-2 font-bold">
                DIRECT TRANSMISSION
              </span>
              <a
                href={`mailto:${DATA.personal.email}`}
                data-cursor="Write"
                className="group inline-block"
              >
                <div className="font-display text-[clamp(34px,3.7vw,74px)] leading-[0.9] text-white uppercase tracking-tight">
                  <span className="block text-white">tmurari2007</span>
                  <span className="block text-white/90 group-hover:text-white transition-colors duration-200">
                    @gmail.com
                  </span>
                </div>
                {/* Underline wiping on hover */}
                <div className="h-1 w-full bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2" />
              </a>
            </div>

            {/* Right: Stacked Links */}
            <div className="md:col-span-5 flex flex-col space-y-3 font-mono text-sm uppercase font-bold text-white">
              <a
                href={DATA.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Open"
                className="group flex items-center justify-between py-2 border-b border-white/20 hover:border-white transition-colors"
              >
                <span>GitHub Repository</span>
                <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  ↗
                </span>
              </a>

              <a
                href={DATA.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Open"
                className="group flex items-center justify-between py-2 border-b border-white/20 hover:border-white transition-colors"
              >
                <span>LinkedIn Profile</span>
                <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  ↗
                </span>
              </a>

              <a
                href={DATA.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="PDF"
                className="group flex items-center justify-between py-2 border-b border-white/20 hover:border-white transition-colors"
              >
                <span>Full Résumé PDF</span>
                <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* Footer bar */}
          <footer className="w-full flex items-center justify-between pt-4 border-t border-white/20 font-mono text-xs uppercase tracking-wider text-white/80 pointer-events-auto">
            <span>© 2026 {DATA.personal.fullName}. ALL RIGHTS RESERVED.</span>
            <button
              data-cursor="Top"
              onClick={() => director.scrollToTop()}
              className="hover:text-white transition-colors flex items-center gap-1 font-bold"
            >
              Back to top ↑
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
};
