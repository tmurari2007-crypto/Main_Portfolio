import React from 'react';
import { useSceneRef } from '../engine/hooks';
import { DATA } from '../data';

export const Awards: React.FC = () => {
  const rotationAngleRef = React.useRef(0);
  const scrollProgRef = React.useRef(0);
  const cylRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Slow continuous rotation around the circle: 12 degrees per second
      rotationAngleRef.current = (rotationAngleRef.current + dt * 12) % 360;

      if (cylRef.current) {
        // Base auto rotation + scroll-driven twist
        const totalRotY = -(rotationAngleRef.current + scrollProgRef.current * 180);
        cylRef.current.style.transform = `translateZ(-360px) rotateX(-14deg) rotateY(${totalRotY}deg)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const frontRef = useSceneRef<HTMLDivElement>('awards', (el, state) => {
    const m = state.metrics['awards'];
    if (!m) return;

    scrollProgRef.current = m.p;
    const fadeOut = Math.max(0, 1 - m.exit * 2.4);
    el.style.opacity = `${m.vis * fadeOut}`;
    el.style.transform = `translate3d(0, ${-m.exit * 30}px, 0)`;

    // Counter cards flip in using rotateX -100 -> 0, staggered
    const counterCards = el.querySelectorAll<HTMLDivElement>('.flip-counter-card');
    counterCards.forEach((card, idx) => {
      const cardThresh = idx * 0.12;
      const cardP = Math.max(0, Math.min(1, (m.p - cardThresh) / 0.35));
      const rotX = (1 - cardP) * -100;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg)`;
      card.style.opacity = `${cardP}`;
    });
  });

  const certs = DATA.awards.certifications;
  const N = certs.length;

  return (
    <section className="relative w-full h-[320vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-6 md:px-0">
        <div
          ref={frontRef}
          className="w-full md:left-[6vw] md:top-[12vh] md:absolute md:w-[min(54vw,880px)] z-30 transition-opacity duration-75"
        >
          {/* Header */}
          <div className="font-mono text-xs uppercase tracking-widest text-[#5e5e5e] mb-2 select-none">
            <span className="text-[#ff1f1f] font-bold mr-2">(05)</span>
            <span>— Validations & Honors</span>
          </div>

          <h2 className="font-display text-[clamp(32px,3.8vw,68px)] leading-[0.9] text-[#0d0d0d] uppercase tracking-tighter mb-6">
            <span>ALGORITHMIC</span> <span className="text-[#ff1f1f]">EXCELLENCE.</span>
          </h2>

          {/* Four flip-in counter cards in a row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {DATA.awards.platformStats.map((stat, idx) => {
              const isRed = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`flip-counter-card p-4 rounded-2xl flex flex-col justify-between shadow-lg transform-gpu will-change-transform select-none ${
                    isRed ? 'bg-[#ff1f1f] text-white' : 'bg-[#0d0d0d] text-white'
                  }`}
                  style={{ transform: 'perspective(800px) rotateX(-100deg)', opacity: 0 }}
                >
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 block mb-1">
                    {stat.label}
                  </span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                      {stat.count}
                    </span>
                    <span className="font-display text-xl font-bold text-white/80">
                      {stat.suffix}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certifications 3D Cylinder */}
          <div className="relative w-full h-[220px] [perspective:1600px] overflow-visible flex items-center justify-center select-none">
            <div
              ref={cylRef}
              className="cylinder-carousel relative w-[290px] h-[178px] [transform-style:preserve-3d] transition-transform duration-75"
              style={{
                transform: 'translateZ(-360px) rotateX(-14deg) rotateY(0deg)',
              }}
            >
              {certs.map((cert, cIdx) => {
                const angle = (360 / N) * cIdx;
                const isThirdRed = cIdx % 3 === 0;

                return (
                  <div
                    key={cIdx}
                    className="absolute inset-0 w-[290px] h-[178px] [transform-style:preserve-3d] transform-gpu will-change-transform"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(360px)`,
                    }}
                  >
                    {/* Front Face */}
                    <div
                      className={`absolute inset-0 w-full h-full rounded-2xl p-5 border flex flex-col justify-between [backface-visibility:hidden] shadow-xl ${
                        isThirdRed
                          ? 'bg-[#ff1f1f] text-white border-[#ff1f1f]'
                          : 'bg-white text-[#0d0d0d] border-[rgba(13,13,13,0.08)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-mono text-[10px] uppercase font-bold tracking-wider ${
                              isThirdRed ? 'text-white/80' : 'text-[#ff1f1f]'
                            }`}
                          >
                            CERTIFIED #{cIdx + 1}
                          </span>
                          <span className="text-sm font-bold">✓</span>
                        </div>
                        <h4 className="font-display text-lg uppercase leading-snug tracking-tight line-clamp-2">
                          {cert.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between border-t border-current/10 pt-2 font-mono text-[10px] opacity-75">
                        <span>{cert.issuer}</span>
                        <span>{cert.date}</span>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-[#ffe5e5] to-[#ffd0d0] border border-[#ff1f1f]/20 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-md"
                    >
                      <span className="font-mono text-xs uppercase font-bold text-[#ff1f1f] tracking-widest">
                        AUTHENTICATED CREDENTIAL
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
