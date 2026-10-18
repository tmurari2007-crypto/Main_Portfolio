import React, { useEffect, useRef } from 'react';
import { director, DirectorState } from '../engine/director';
import { frameLoader } from '../engine/frames';

export const Stage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const lastKeyRef = useRef<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle mouse movement for parallax
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mousePos.current.targetX = nx * 14;
      mousePos.current.targetY = ny * 14;
    };
    window.addEventListener('mousemove', onMouseMove);

    const render = (state: DirectorState) => {
      if (!canvas || !ctx) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const vw = state.vw;
      const vh = state.vh;
      const isMobile = vw < 820;

      if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
        canvas.width = vw * dpr;
        canvas.height = vh * dpr;
        canvas.style.width = `${vw}px`;
        canvas.style.height = `${vh}px`;
      }

      // Lerp mouse parallax
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.06;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.06;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, vw, vh);

      const loadedCount = frameLoader.getLoadedCount();
      const manifest = frameLoader.getManifest();

      if (!manifest || loadedCount === 0) {
        ctx.restore();
        return;
      }

      // Helper to draw single shot at given frame and transform
      const drawShot = (
        frameVal: number,
        sceneX: number,
        sceneK: number,
        clipPolygon?: [number, number][],
        alphaMod = 1.0,
        xShift = 0
      ) => {
        const floorF = Math.floor(frameVal);
        const frac = frameVal - floorF;
        const shot = frameLoader.getShotForFrame(floorF);
        if (!shot) return;

        const box = shot.box; // [x, y, w, h]
        const cx = shot.cx;

        // Scale and anchor calculations
        let scale = (vh * sceneK) / 900;
        let offX = sceneX * vw - cx * 1600 * scale + mousePos.current.x + xShift;
        let offY = vh - 900 * scale + mousePos.current.y;

        if (isMobile) {
          scale = Math.min((vh * 0.74) / 900, (vw * 1.05) / box[2]);
          offX = 0.5 * vw - cx * 1600 * scale + mousePos.current.x + xShift;
          offY = vh - 900 * scale + mousePos.current.y;
        }

        ctx.save();
        if (clipPolygon && clipPolygon.length >= 3) {
          ctx.beginPath();
          ctx.moveTo(clipPolygon[0][0], clipPolygon[0][1]);
          for (let p = 1; p < clipPolygon.length; p++) {
            ctx.lineTo(clipPolygon[p][0], clipPolygon[p][1]);
          }
          ctx.closePath();
          ctx.clip();
        }

        const dx = offX + box[0] * scale;
        const dy = offY + box[1] * scale;
        const dw = box[2] * scale;
        const dh = box[3] * scale;

        // Base floor frame
        const img1 = frameLoader.getFrame(floorF);
        if (img1) {
          ctx.globalAlpha = alphaMod;
          ctx.drawImage(img1, dx, dy, dw, dh);
        }

        // Fractional frame within same shot
        const nextF = floorF + 1;
        if (frac > 0.001 && nextF <= shot.to) {
          const img2 = frameLoader.getFrame(nextF);
          if (img2) {
            ctx.globalAlpha = frac * alphaMod;
            ctx.drawImage(img2, dx, dy, dw, dh);
          }
        }

        ctx.restore();
      };

      if (!state.isTransitioning) {
        // Normal state: draw active scene
        drawShot(state.frameFraction, state.activeScene.x, state.activeScene.k);
      } else {
        // Blade transition
        const t = state.transitionT;
        const skew = 0.2 * vh;
        const e = -skew + (vw + 2 * skew) * t;

        // Polygon to the right of line (e+skew, 0) to (e-skew, vh)
        const polyRight: [number, number][] = [
          [e + skew, 0],
          [vw * 2, 0],
          [vw * 2, vh],
          [e - skew, vh],
        ];

        // Polygon to the left of line
        const polyLeft: [number, number][] = [
          [-vw, 0],
          [e + skew, 0],
          [e - skew, vh],
          [-vw, vh],
        ];

        const curScene = state.activeScene;
        const nextScene = director.getState().activeSceneIndex < 6 ? director.getState().activeScene : curScene;

        // Outgoing shot (right of blade line, shifted +60t px, alpha 1 - 0.35t)
        drawShot(
          state.fromShotFrame,
          curScene.x,
          curScene.k,
          polyRight,
          1 - 0.35 * t,
          60 * t
        );

        // Incoming shot (left of blade line, shifted -60(1-t) px)
        drawShot(
          state.toShotFrame,
          nextScene.x,
          nextScene.k,
          polyLeft,
          1.0,
          -60 * (1 - t)
        );

        // Draw blade line: 3px red line (white when entering Contact) with 24px glow and 90px gradient trail
        const isEnteringContact = curScene.id === 'awards';
        const bladeColor = isEnteringContact ? '#ffffff' : '#ff1f1f';
        const glowColor = isEnteringContact ? 'rgba(255,255,255,0.7)' : 'rgba(255,31,31,0.7)';

        ctx.save();
        // 90px gradient trail behind blade
        const trailGrad = ctx.createLinearGradient(e - 90, 0, e, 0);
        trailGrad.addColorStop(0, 'rgba(255,31,31,0)');
        trailGrad.addColorStop(1, isEnteringContact ? 'rgba(255,255,255,0.25)' : 'rgba(255,31,31,0.25)');

        ctx.beginPath();
        ctx.moveTo(e + skew - 90, 0);
        ctx.lineTo(e + skew, 0);
        ctx.lineTo(e - skew, vh);
        ctx.lineTo(e - skew - 90, vh);
        ctx.closePath();
        ctx.fillStyle = trailGrad;
        ctx.fill();

        // Glow
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 24;

        // 3px blade line
        ctx.beginPath();
        ctx.moveTo(e + skew, 0);
        ctx.lineTo(e - skew, vh);
        ctx.strokeStyle = bladeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();
    };

    const unsubscribe = director.subscribe(state => {
      // Key includes loaded count and frame for responsive rendering
      const key = `${Math.round(state.frameFraction * 100)}_${state.isTransitioning}_${Math.round(state.transitionT * 100)}_${frameLoader.getLoadedCount()}`;
      if (key !== lastKeyRef.current) {
        lastKeyRef.current = key;
        render(state);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      style={{ zIndex: 1 }}
    />
  );
};
