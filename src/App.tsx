import React, { useEffect, useRef } from 'react';
import { director } from './engine/director';
import { frameLoader } from './engine/frames';
import { Stage } from './components/Stage';
import { Chrome } from './components/Chrome';
import { LayerBack } from './components/LayerBack';
import { LayerFront } from './components/LayerFront';
import { Hero } from './scenes/Hero';
import { About } from './scenes/About';
import { Work } from './scenes/Work';
import { Journey } from './scenes/Journey';
import { Skills } from './scenes/Skills';
import { Awards } from './scenes/Awards';
import { Contact } from './scenes/Contact';
import { Chatbot } from './components/Chatbot';

export const App: React.FC = () => {
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 1. Initialize director and frame loader
    director.init();
    frameLoader.init();

    // 2. Register all section elements for ResizeObserver tracking
    if (mainRef.current) {
      const sectionEls = Array.from(mainRef.current.querySelectorAll<HTMLElement>('section'));
      director.registerSectionElements(sectionEls);
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* z0: Fixed .layer-back */}
      <LayerBack />

      {/* z1: Fixed Stage (Canvas) */}
      <Stage />

      {/* z2: Fixed .layer-front */}
      <LayerFront />

      {/* z3: <main> containing the sticky sections */}
      <main ref={mainRef} className="relative w-full z-10" style={{ zIndex: 3 }}>
        <Hero />
        <About />
        <Work />
        <Journey />
        <Skills />
        <Awards />
        <Contact />
      </main>

      {/* z50 & z90+: Chrome (HUD, Nav, Progress, Preloader, Cursor) */}
      <Chrome />

      {/* z60: Interactive AI Chatbot "Ask Murari" */}
      <Chatbot />
    </div>
  );
};
