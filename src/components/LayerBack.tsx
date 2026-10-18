import React, { useEffect, useRef, useState } from 'react';
import { director, DirectorState } from '../engine/director';
import { DATA } from '../data';

export const LayerBack: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  // References for direct style mutations without re-rendering
  const heroNameRef = useRef<HTMLDivElement | null>(null);
  const aboutShadeRef = useRef<HTMLDivElement | null>(null);
  const workGridRef = useRef<HTMLDivElement | null>(null);
  const journeyYearRef = useRef<HTMLDivElement | null>(null);
  const contactRedBgRef = useRef<HTMLDivElement | null>(null);
  const contactTextRef = useRef<HTMLDivElement | null>(null);

  // Skills sphere state for z < 0
  const [skillsBack, setSkillsBack] = useState<Array<{ name: string; x: number; y: number; scale: number; opacity: number }>>([]);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const unsub = director.subscribe(state => {
      const vh = state.vh;
      const vw = state.vw;

      // 1. Hero: Giant first name in Anton, red, right: 3vw, top: 10.5vh
      if (heroNameRef.current) {
        const m = state.metrics['hero'];
        if (m) {
          const fadeOut = Math.max(0, 1 - m.exit * 2.8);
          const ty = m.p * 40;
          heroNameRef.current.style.opacity = `${m.vis * fadeOut}`;
          heroNameRef.current.style.transform = `translate3d(0, ${ty}px, 0)`;
        }
      }

      // 2. About: Soft red shade radial-gradient(60vw 90vh at 22vw 70vh, ...)
      if (aboutShadeRef.current) {
        const m = state.metrics['about'];
        if (m) {
          const fadeOut = Math.max(0, 1 - m.exit * 2.4);
          const tx = (1 - m.enter) * -60;
          aboutShadeRef.current.style.opacity = `${m.vis * fadeOut}`;
          aboutShadeRef.current.style.transform = `translate3d(${tx}px, 0, 0)`;
        }
      }

      // 3. Work: Perspective grid floor rotated rotateX(68deg), moving with scroll
      if (workGridRef.current) {
        const m = state.metrics['work'];
        if (m) {
          const fadeOut = Math.max(0, 1 - m.exit * 2.4);
          const gridShift = (m.p * 300) % 90;
          workGridRef.current.style.opacity = `${m.vis * fadeOut}`;
          workGridRef.current.style.backgroundPosition = `0px ${gridShift}px`;
        }
      }

      // 4. Journey: Colossal outlined year in Anton 44vh, transparent fill, 2px red stroke
      if (journeyYearRef.current) {
        const m = state.metrics['journey'];
        if (m) {
          const fadeOut = Math.max(0, 1 - m.exit * 2.4);
          const currentYear = Math.round(
            DATA.journey.startYear + (DATA.journey.gradYear - DATA.journey.startYear) * m.p
          );
          journeyYearRef.current.textContent = `${currentYear}`;
          journeyYearRef.current.style.opacity = `${m.vis * fadeOut}`;
        }
      }

      // 5. Skills Fibonacci Sphere (chips with z < 0)
      const mSkills = state.metrics['skills'];
      if (mSkills && mSkills.vis > 0.05) {
        const skills = DATA.skills;
        const count = skills.length;
        const R = Math.min(0.27 * vw, 0.46 * vh);
        const ySquash = 0.78;
        const tilt = -0.28;

        // Auto-spin + scroll spin x 5 + mouse follow
        const time = Date.now() * 0.0006;
        const spinAngle = time + mSkills.p * 5 * Math.PI + mouseX * 0.5;

        const backChips: Array<{ name: string; x: number; y: number; scale: number; opacity: number }> = [];

        for (let i = 0; i < count; i++) {
          // Fibonacci sphere distribution
          const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
          const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5) + spinAngle;

          let sx = R * Math.sin(phi) * Math.cos(theta);
          let sy = R * Math.sin(phi) * Math.sin(theta) * ySquash;
          let sz = R * Math.cos(phi);

          // Apply tilt around X axis
          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const y2 = sy * cosT - sz * sinT;
          const z2 = sy * sinT + sz * cosT;

          // If z2 < 0, it belongs to the BACK layer!
          if (z2 < 0) {
            const scale = 0.75 + 0.25 * (z2 / R + 1);
            const op = Math.max(0.2, 0.75 * (z2 / R + 1)) * mSkills.vis;
            // Center around person position (0.50 vw, 0.50 vh)
            const cx = 0.5 * vw + sx + mouseX * 20;
            const cy = 0.52 * vh + y2 + mouseY * 20;

            backChips.push({
              name: skills[i],
              x: cx,
              y: cy,
              scale,
              opacity: op,
            });
          }
        }
        setSkillsBack(backChips);
      } else if (skillsBack.length > 0) {
        setSkillsBack([]);
      }

      // 6. Contact: Full red background revealed by same blade polygon
      if (contactRedBgRef.current) {
        const isContactActive = state.activeScene.id === 'contact';
        const isBladeTransition = state.activeScene.id === 'awards' && state.isTransitioning;

        if (isContactActive) {
          contactRedBgRef.current.style.display = 'block';
          contactRedBgRef.current.style.clipPath = 'none';
        } else if (isBladeTransition) {
          contactRedBgRef.current.style.display = 'block';
          const t = state.transitionT;
          const skew = 0.2 * vh;
          const e = -skew + (vw + 2 * skew) * t;
          // Incoming blade polygon to the left of the line
          contactRedBgRef.current.style.clipPath = `polygon(-100px 0, ${e + skew}px 0, ${e - skew}px ${vh}px, -100px ${vh}px)`;
        } else {
          contactRedBgRef.current.style.display = 'none';
        }
      }

      // Contact giant LET'S TALK
      if (contactTextRef.current) {
        const m = state.metrics['contact'];
        if (m) {
          contactTextRef.current.style.opacity = `${m.vis}`;
          contactTextRef.current.style.transform = `translate3d(-50%, ${(1 - m.enter) * 40}px, 0)`;
        }
      }
    });

    return () => {
      unsub();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [skillsBack.length]);

  return (
    <div
      className="layer-back fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 0 }}
    >
      {/* Hero Giant First Name */}
      <div
        ref={heroNameRef}
        className="absolute top-[8.5vh] md:top-[10.5vh] right-[3vw] font-display text-[min(24vw,36vh)] text-[#ff1f1f] leading-none tracking-tighter opacity-0 will-change-transform"
      >
        {DATA.personal.firstName}
      </div>

      {/* About Soft Red Shade */}
      <div
        ref={aboutShadeRef}
        className="absolute inset-0 opacity-0 pointer-events-none will-change-transform"
        style={{
          background: `
            radial-gradient(60vw 90vh at 22vw 70vh, rgba(255,31,31,0.30), rgba(255,31,31,0.10) 55%, transparent 80%),
            linear-gradient(to right, rgba(255,31,31,0.06), transparent 50%)
          `,
        }}
      />

      {/* Work Red Perspective Grid Floor */}
      <div
        ref={workGridRef}
        className="absolute bottom-0 left-0 w-full h-[65vh] opacity-0 will-change-transform pointer-events-none"
        style={{
          transform: 'perspective(600px) rotateX(68deg)',
          transformOrigin: 'bottom center',
          backgroundImage: `
            linear-gradient(to right, rgba(255,31,31,0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,31,31,0.35) 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 15%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 15%, transparent 95%)',
        }}
      />

      {/* Journey Colossal Outlined Year */}
      <div
        ref={journeyYearRef}
        className="absolute top-[28vh] left-[4vw] font-display text-[44vh] leading-none text-transparent opacity-0 select-none will-change-transform"
        style={{
          WebkitTextStroke: '2px #ff1f1f',
        }}
      >
        2022
      </div>

      {/* Skills Back Chips (z < 0) */}
      {skillsBack.map((chip, idx) => (
        <div
          key={idx}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full border border-[#ff1f1f]/50 bg-white/75 backdrop-blur-sm font-mono text-xs uppercase font-bold text-[#ff1f1f] shadow-sm select-none"
          style={{
            left: `${chip.x}px`,
            top: `${chip.y}px`,
            transform: `translate(-50%, -50%) scale(${chip.scale})`,
            opacity: chip.opacity,
          }}
        >
          {chip.name}
        </div>
      ))}

      {/* Contact Full Red Background with Blade Polygon */}
      <div
        ref={contactRedBgRef}
        className="absolute inset-0 bg-[#ff1f1f] will-change-transform"
        style={{ display: 'none' }}
      >
        {/* Giant LET'S TALK Centred behind person */}
        <div
          ref={contactTextRef}
          className="absolute top-[10vh] left-1/2 transform -translate-x-1/2 font-display text-[min(36vh,26vw)] text-white/95 leading-[0.84] uppercase tracking-tighter text-center whitespace-nowrap opacity-0 select-none"
        >
          <span className="block">LET'S</span>
          <span className="block">TALK</span>
        </div>
      </div>
    </div>
  );
};
