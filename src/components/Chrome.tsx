import React, { useEffect, useRef, useState } from 'react';
import { director, DirectorState, SCENES } from '../engine/director';
import { DATA } from '../data';
import gsap from 'gsap';

interface ChromeProps {
  onEnterApp?: () => void;
}

export const Chrome: React.FC<ChromeProps> = ({ onEnterApp }) => {
  const [loadPercent, setLoadPercent] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isWhiteTheme, setIsWhiteTheme] = useState(false);

  // Preloader split refs
  const topHalfRef = useRef<HTMLDivElement | null>(null);
  const bottomHalfRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const preloaderLinesRef = useRef<HTMLDivElement | null>(null);

  // Custom cursor refs
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const cursorLabelRef = useRef<HTMLSpanElement | null>(null);

  // Magnetic buttons setup
  useEffect(() => {
    // Subscribe to director state
    const unsub = director.subscribe(state => {
      setActiveSceneIdx(state.activeSceneIndex);

      // Total scroll progress
      const maxScroll = (SCENES.reduce((a, s) => a + s.vhHeight, 0) / 100) * state.vh - state.vh;
      const prog = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round((state.scrollY / maxScroll) * 100))) : 0;
      setScrollProgress(prog);

      // On Contact, only after blade passes t > 0.6, HUD turns white
      const isContact = state.activeScene.id === 'contact';
      const bladePassed = state.activeSceneIndex === 6 || (state.activeSceneIndex === 5 && state.isTransitioning && state.transitionT > 0.6);
      setIsWhiteTheme(isContact || (bladePassed && state.activeSceneIndex === 5));
    });

    return unsub;
  }, []);

  // Preloader tween
  useEffect(() => {
    const tweenObj = { val: 0 };
    const tween = gsap.to(tweenObj, {
      val: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        setLoadPercent(Math.floor(tweenObj.val));
      },
      onComplete: () => {
        // Slide lines up
        if (preloaderLinesRef.current) {
          gsap.to(preloaderLinesRef.current, {
            y: -40,
            opacity: 0,
            duration: 0.4,
            ease: 'expo.in',
          });
        }
        if (counterRef.current) {
          gsap.to(counterRef.current, {
            scale: 1.08,
            opacity: 0,
            duration: 0.4,
            delay: 0.05,
            ease: 'expo.in',
          });
        }

        // Halves split apart using expo.inOut over 1.2s
        const tl = gsap.timeline({
          delay: 0.25,
          onComplete: () => {
            setPreloaderDone(true);
            director.start();
            if (onEnterApp) onEnterApp();
          },
        });

        if (topHalfRef.current) {
          tl.to(
            topHalfRef.current,
            {
              yPercent: -100,
              duration: 1.2,
              ease: 'expo.inOut',
            },
            0
          );
        }
        if (bottomHalfRef.current) {
          tl.to(
            bottomHalfRef.current,
            {
              yPercent: 100,
              duration: 1.2,
              ease: 'expo.inOut',
            },
            0
          );
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [onEnterApp]);

  // Cursor handling
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 820) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check [data-cursor]
      const target = (e.target as HTMLElement)?.closest('[data-cursor]') as HTMLElement | null;
      if (target && cursorRingRef.current) {
        const label = target.getAttribute('data-cursor') || '';
        cursorRingRef.current.classList.add('cursor-hover');
        if (cursorLabelRef.current) {
          cursorLabelRef.current.textContent = label;
          cursorLabelRef.current.style.opacity = '1';
        }
      } else if (cursorRingRef.current) {
        cursorRingRef.current.classList.remove('cursor-hover');
        if (cursorLabelRef.current) {
          cursorLabelRef.current.textContent = '';
          cursorLabelRef.current.style.opacity = '0';
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Ticker for lerping 42px ring at 0.16
    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      requestAnimationFrame(tick);
    };
    const rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Preloader */}
      {!preloaderDone && (
        <div className="fixed inset-0 z-[100] pointer-events-auto overflow-hidden select-none">
          <div
            ref={topHalfRef}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#ff1f1f] border-b border-black/10 flex flex-col justify-end items-center pb-2 z-10"
          >
            <div ref={preloaderLinesRef} className="font-mono text-xs uppercase tracking-widest text-white/90">
              MURARISAI TADEPALLI — PORTFOLIO 2026
            </div>
          </div>
          <div
            ref={bottomHalfRef}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-[#ff1f1f] border-t border-black/10 flex flex-col justify-start items-center pt-2 z-10"
          >
            <div className="font-mono text-xs uppercase tracking-widest text-white/90">
              INITIALIZING HARDWARE DIRECTED SCROLL SYSTEM
            </div>
          </div>

          <div
            ref={counterRef}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <span className="font-display text-[min(26vw,40vh)] text-white tracking-tighter leading-none select-none">
              {String(loadPercent).padStart(3, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Desktop Cursor */}
      <div className="hidden md:block pointer-events-none z-[99]">
        <div
          ref={cursorDotRef}
          className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#ff1f1f] shadow-[0_0_8px_#ff1f1f] pointer-events-none transform-gpu will-change-transform"
        />
        <div
          ref={cursorRingRef}
          className="fixed top-0 left-0 w-[42px] h-[42px] -ml-[21px] -mt-[21px] rounded-full border border-black/20 flex items-center justify-center pointer-events-none transform-gpu will-change-transform transition-[width,height,background-color,border-color] duration-300"
        >
          <span
            ref={cursorLabelRef}
            className="font-mono text-[10px] uppercase font-bold tracking-wider text-white opacity-0 transition-opacity duration-200"
          />
        </div>
      </div>

      {/* HUD Header */}
      <header
        className={`fixed top-0 left-0 w-full px-6 py-5 md:px-12 md:py-8 flex items-center justify-between z-50 pointer-events-none transition-colors duration-500 ${
          isWhiteTheme ? 'text-white' : 'text-[#0d0d0d]'
        }`}
      >
        {/* Left: Logo */}
        <div
          data-cursor="Home"
          onClick={() => director.scrollToTop()}
          className="pointer-events-auto cursor-pointer flex items-baseline gap-1 select-none"
        >
          <span className="font-display text-2xl md:text-3xl tracking-tight uppercase">
            {DATA.personal.firstName}
          </span>
          <span className="font-sans text-xs md:text-sm font-black text-[#ff1f1f]">®</span>
        </div>

        {/* Right: Pill Nav */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white/65 backdrop-blur-md border border-[rgba(13,13,13,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.04)] pointer-events-auto select-none">
          {SCENES.map((scene, idx) => {
            const isActive = idx === activeSceneIdx;
            return (
              <button
                key={scene.id}
                data-cursor="Go"
                onClick={() => director.scrollToScene(idx)}
                className={`px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-wider font-semibold transition-all duration-300 ${
                  isActive
                    ? isWhiteTheme
                      ? 'bg-white text-[#ff1f1f] shadow-md'
                      : 'bg-[#ff1f1f] text-white shadow-md'
                    : isWhiteTheme
                    ? 'text-white/80 hover:text-white'
                    : 'text-[#5e5e5e] hover:text-[#0d0d0d]'
                }`}
              >
                {scene.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Bottom Right: Mono Progress Rail */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 select-none pointer-events-none">
        <span
          className={`font-mono text-xs uppercase tracking-widest font-semibold transition-colors duration-500 ${
            isWhiteTheme ? 'text-white' : 'text-[#5e5e5e]'
          }`}
        >
          {String(scrollProgress).padStart(3, '0')}%
        </span>
        <div className="w-[2px] h-10 bg-black/10 overflow-hidden rounded-full">
          <div
            className="w-full bg-[#ff1f1f] transition-[height] duration-150 rounded-full"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </>
  );
};
