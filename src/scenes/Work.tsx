import React, { useRef } from 'react';
import { useSceneRef } from '../engine/hooks';
import { DATA } from '../data';

export const Work: React.FC = () => {
  const deckRef = useRef<HTMLDivElement | null>(null);

  const frontRef = useSceneRef<HTMLDivElement>('work', (el, state) => {
    const m = state.metrics['work'];
    if (!m) return;

    const fadeOut = Math.max(0, 1 - m.exit * 2.4);
    el.style.opacity = `${m.vis * fadeOut}`;
    el.style.transform = `translate3d(0, ${-m.exit * 30}px, 0)`;

    // Cards dwell animation mapping
    // q = i + easeInOut(frac), d = q - i
    const nCards = DATA.projects.length;
    // Map m.p to card deck progress 0 .. (nCards - 1)
    const totalProg = m.p * (nCards - 1);

    const cards = el.querySelectorAll<HTMLDivElement>('.project-card');
    cards.forEach((card, i) => {
      const d = totalProg - i; // d < 0: upcoming, d > 0: leaving, d ~ 0: active

      let z = 0;
      let y = 0;
      let rotX = 0;
      let op = 1;

      if (d < 0) {
        // Upcoming cards: z = d * 300, y = d * 3.2vh, fading
        z = d * 280;
        y = d * 28;
        rotX = 0;
        op = Math.max(0, 1 + d * 0.9);
      } else {
        // Leaving cards: z = d * 900, y = -12d vh, rotateX = 28d, opacity = 1 - 1.8d
        z = d * 800;
        y = -d * 90;
        rotX = d * 26;
        op = Math.max(0, 1 - d * 1.6);
      }

      card.style.transform = `translate3d(0, ${y}px, ${z}px) rotateX(${rotX}deg)`;
      card.style.opacity = `${op}`;
      card.style.pointerEvents = Math.abs(d) < 0.4 ? 'auto' : 'none';
    });

    // Update counter
    const activeCard = Math.min(nCards - 1, Math.max(0, Math.round(totalProg)));
    const counterEl = el.querySelector<HTMLSpanElement>('.work-counter');
    if (counterEl) {
      counterEl.textContent = `0${activeCard + 1} / 0${nCards}`;
    }

    // Progress bar
    const barEl = el.querySelector<HTMLDivElement>('.work-progress-fill');
    if (barEl) {
      barEl.style.width = `${Math.min(100, Math.max(0, (totalProg / (nCards - 1)) * 100))}%`;
    }
  });

  return (
    <section className="relative w-full h-[460vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-6 md:px-0">
        <div
          ref={frontRef}
          className="w-full md:left-[5vw] md:top-[12vh] md:absolute md:w-[min(56vw,940px)] z-30 transition-opacity duration-75"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] select-none">
              <span className="text-[#ff1f1f] font-bold mr-2">(02)</span>
              <span>— Selected Projects</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="work-counter font-display text-lg font-bold text-[#0d0d0d] tracking-wider select-none">
                01 / 03
              </span>
              <div className="w-[140px] h-1.5 bg-black/10 rounded-full overflow-hidden">
                <div className="work-progress-fill h-full bg-[#ff1f1f] rounded-full transition-[width] duration-150" />
              </div>
            </div>
          </div>

          {/* 3D Deck Container */}
          <div
            ref={deckRef}
            className="relative w-full h-[58vh] [perspective:1500px] [transform-style:preserve-3d]"
          >
            {DATA.projects.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="project-card absolute inset-0 w-full h-full rounded-[30px] bg-white border border-[rgba(13,13,13,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-12 transform-gpu will-change-transform"
                style={{
                  transform: `translate3d(0, 0, ${-pIdx * 280}px)`,
                  opacity: pIdx === 0 ? 1 : 0.2,
                }}
              >
                {/* Left Side: Information */}
                <div className="md:col-span-7 p-6 md:p-7 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-[#ff1f1f]">
                        {proj.num}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#5e5e5e]">
                        {proj.category}
                      </span>
                    </div>

                    <h3 className="font-display text-[clamp(24px,2.8vw,48px)] leading-tight text-[#0d0d0d] uppercase tracking-tight mb-1.5">
                      {proj.title}
                    </h3>
                    <p className="font-sans text-xs md:text-sm font-semibold text-[#ff1f1f] mb-2">
                      {proj.tagline}
                    </p>
                    <p className="font-sans text-xs md:text-[13px] text-[#5e5e5e] leading-relaxed mb-3 line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Key Features List */}
                    <div className="mb-3">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#0d0d0d] tracking-wider block mb-1">
                        Key Features:
                      </span>
                      <ul className="space-y-0.5">
                        {proj.features.slice(0, 3).map((feat, fIdx) => (
                          <li key={fIdx} className="font-sans text-xs text-[#5e5e5e] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1f1f] flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/5">
                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-full bg-black/5 border border-black/5 font-mono text-[9px] uppercase font-medium text-[#0d0d0d]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {proj.demo && (
                      <div className="mt-2.5">
                        <a
                          href={proj.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="Live"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-black/15 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0d0d0d] hover:bg-black/5 transition-colors"
                        >
                          Live Demo ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Red Visual Mock with View Project button */}
                <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#ff1f1f] to-[#d60000] p-6 text-white relative overflow-hidden flex-col justify-between">
                  {/* Subtle technical background grid */}
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:16px_16px]" />

                  {/* Top / Mid Status Mockups */}
                  <div className="relative z-10 w-full">
                    {proj.type === 'procurement' && (
                      <div className="space-y-2.5 font-mono text-[11px]">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <div className="text-white/60 mb-1">BOOKING_QUEUE_STATUS</div>
                          <div className="flex justify-between font-bold">
                            <span>SLOT #FMR-0842</span>
                            <span className="text-emerald-300">CONFIRMED</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <div className="text-white/60 mb-1">ROLE ACCESS CONTROL</div>
                          <div className="flex justify-between text-xs">
                            <span>FARMER | ADMIN</span>
                            <span className="text-white/90 font-bold">ACTIVE</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-white w-4/5 animate-pulse" />
                          </div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center text-[10px] text-white/90">
                          DATABASE BACKED WORKFLOW (MONGODB)
                        </div>
                      </div>
                    )}

                    {proj.type === 'semantic' && (
                      <div className="space-y-2.5 font-mono text-[11px]">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <div className="text-white/60 mb-1">LOCAL MODEL ENGINE</div>
                          <div className="text-white font-bold flex justify-between">
                            <span>OLLAMA + LANGCHAIN</span>
                            <span className="text-emerald-300">ONLINE</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <div className="text-white/60 mb-1">EMBEDDING VECTOR SIMILARITY</div>
                          <div className="text-emerald-300 font-bold text-sm">COSINE DISTANCE: 0.942</div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center text-[10px] text-white/90">
                          REST API TESTED & DEBUGGED (POSTMAN)
                        </div>
                      </div>
                    )}

                    {proj.type === 'waterlevel' && (
                      <div className="space-y-2.5 font-mono text-[11px]">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2.5 bg-white/10 rounded-lg text-center">
                            <div className="text-white/60 text-[9px]">GREEN LED</div>
                            <div className="text-emerald-300 font-bold text-xs">NORMAL</div>
                          </div>
                          <div className="p-2.5 bg-white/10 rounded-lg text-center">
                            <div className="text-white/60 text-[9px]">YELLOW LED</div>
                            <div className="text-amber-300 font-bold text-xs">WARNING</div>
                          </div>
                          <div className="p-2.5 bg-white/10 rounded-lg text-center">
                            <div className="text-white/60 text-[9px]">RED + BUZZ</div>
                            <div className="text-rose-200 font-bold text-xs">CRITICAL</div>
                          </div>
                        </div>
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <div className="text-white/60 mb-1">HC-SR04 SENSOR DISTANCE</div>
                          <div className="text-white font-bold text-base flex justify-between">
                            <span>14.8 CM</span>
                            <span className="text-emerald-300 text-xs self-center">REAL-TIME ECHO</span>
                          </div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center text-[10px] text-white/90">
                          ARDUINO UNO EMBEDDED C/C++
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prominent View Project Button on the Red Side */}
                  {proj.github && (
                    <div className="relative z-10 pt-3">
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="Open"
                        className="group flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-white text-[#0d0d0d] font-sans font-bold text-xs uppercase tracking-wider shadow-lg transition-all duration-300 hover:bg-[#0d0d0d] hover:text-white hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <span>View Project</span>
                        <span className="font-mono text-sm transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
