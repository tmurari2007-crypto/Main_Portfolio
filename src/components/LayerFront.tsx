import React, { useEffect, useState } from 'react';
import { director } from '../engine/director';
import { DATA } from '../data';

export const LayerFront: React.FC = () => {
  const [skillsFront, setSkillsFront] = useState<Array<{ name: string; x: number; y: number; scale: number; opacity: number }>>([]);

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

      // Skills Fibonacci Sphere (chips with z > 0)
      const mSkills = state.metrics['skills'];
      if (mSkills && mSkills.vis > 0.05) {
        const skills = DATA.skills;
        const count = skills.length;
        const R = Math.min(0.27 * vw, 0.46 * vh);
        const ySquash = 0.78;
        const tilt = -0.28;

        const time = Date.now() * 0.0006;
        const spinAngle = time + mSkills.p * 5 * Math.PI + mouseX * 0.5;

        const frontChips: Array<{ name: string; x: number; y: number; scale: number; opacity: number }> = [];

        for (let i = 0; i < count; i++) {
          const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
          const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5) + spinAngle;

          let sx = R * Math.sin(phi) * Math.cos(theta);
          let sy = R * Math.sin(phi) * Math.sin(theta) * ySquash;
          let sz = R * Math.cos(phi);

          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const y2 = sy * cosT - sz * sinT;
          const z2 = sy * sinT + sz * cosT;

          // If z2 >= 0, it belongs in front of person!
          if (z2 >= 0) {
            const scale = 0.95 + 0.25 * (z2 / R);
            const op = Math.max(0.6, 0.4 + 0.6 * (z2 / R)) * mSkills.vis;
            const cx = 0.5 * vw + sx + mouseX * 20;
            const cy = 0.52 * vh + y2 + mouseY * 20;

            frontChips.push({
              name: skills[i],
              x: cx,
              y: cy,
              scale,
              opacity: op,
            });
          }
        }
        setSkillsFront(frontChips);
      } else if (skillsFront.length > 0) {
        setSkillsFront([]);
      }
    });

    return () => {
      unsub();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [skillsFront.length]);

  return (
    <div
      className="layer-front fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 2 }}
    >
      {/* Skills Front Chips (z > 0): red pill, white text, glow */}
      {skillsFront.map((chip, idx) => (
        <div
          key={idx}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-[#ff1f1f] text-white font-mono text-xs uppercase font-bold shadow-[0_8px_24px_rgba(255,31,31,0.45)] select-none will-change-transform"
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
    </div>
  );
};
