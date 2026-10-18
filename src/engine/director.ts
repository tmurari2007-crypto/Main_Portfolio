import Lenis from 'lenis';
import gsap from 'gsap';

export interface SceneDef {
  id: string;
  from: number;
  to: number;
  x: number;
  k: number;
  label: string;
  vhHeight: number; // section height in vh
}

export interface SceneMetrics {
  enter: number;
  p: number;
  exit: number;
  vis: number;
}

export interface DirectorState {
  scrollY: number;
  vh: number;
  vw: number;
  activeSceneIndex: number;
  activeScene: SceneDef;
  frameFraction: number;
  isTransitioning: boolean;
  transitionT: number;
  fromShotFrame: number;
  toShotFrame: number;
  metrics: Record<string, SceneMetrics>;
}

export type DirectorSubscriber = (state: DirectorState) => void;

// SCENES definition mapped exactly to shots:
// S1: 0..23, S2: 24..47, S3: 48..71, S4: 72..107
// hero: S1 start->end (0->23), x: 0.70, k: 1.0, 230vh
// about: S2 (24->47), x: 0.27, k: 1.0, 280vh
// work: S3 (48->71), x: 0.77, k: 0.86, 460vh
// journey: S4 first 60% (72->93), x: 0.26, k: 1.0, 240vh
// skills: S4 next 25% (94->102), x: 0.50, k: 0.98, 280vh
// awards: S4 last 15% (103->107), x: 0.75, k: 1.0, 320vh
// contact: S1 reversed (23->0), x: 0.50, k: 1.0, 240vh

export const SCENES: SceneDef[] = [
  { id: 'hero', from: 0, to: 23, x: 0.70, k: 1.0, label: 'Hello', vhHeight: 230 },
  { id: 'about', from: 24, to: 47, x: 0.27, k: 1.0, label: 'About', vhHeight: 280 },
  { id: 'work', from: 48, to: 71, x: 0.77, k: 0.86, label: 'Work', vhHeight: 460 },
  { id: 'journey', from: 72, to: 93, x: 0.26, k: 1.0, label: 'Journey', vhHeight: 240 },
  { id: 'skills', from: 94, to: 102, x: 0.50, k: 0.98, label: 'Toolkit', vhHeight: 280 },
  { id: 'awards', from: 103, to: 107, x: 0.75, k: 1.0, label: 'Awards', vhHeight: 320 },
  { id: 'contact', from: 23, to: 0, x: 0.50, k: 1.0, label: 'Contact', vhHeight: 240 },
];

function clamp(val: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, val));
}

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export class ScrollDirector {
  private lenis: Lenis | null = null;
  private subscribers: Set<DirectorSubscriber> = new Set();
  private sectionOffsets: Array<{ top: number; height: number }> = [];
  private vh = 0;
  private vw = 0;
  private resizeObserver: ResizeObserver | null = null;
  private isRunning = false;
  private currentState: DirectorState;

  constructor() {
    this.vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    this.vw = typeof window !== 'undefined' ? window.innerWidth : 1600;

    const initialMetrics: Record<string, SceneMetrics> = {};
    SCENES.forEach(s => {
      initialMetrics[s.id] = { enter: 0, p: 0, exit: 0, vis: 0 };
    });

    this.currentState = {
      scrollY: 0,
      vh: this.vh,
      vw: this.vw,
      activeSceneIndex: 0,
      activeScene: SCENES[0],
      frameFraction: SCENES[0].from,
      isTransitioning: false,
      transitionT: 0,
      fromShotFrame: SCENES[0].from,
      toShotFrame: SCENES[0].from,
      metrics: initialMetrics,
    };
  }

  public init(): void {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    this.updateDimensions();

    this.lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });

    // Keep stopped until preloader finishes
    this.lenis.stop();

    // Drive from GSAP ticker with lagSmoothing(0)
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add((time: number) => {
      this.lenis?.raf(time * 1000);
    });

    this.lenis.on('scroll', (e: { scroll: number }) => {
      this.onScrollTick(e.scroll);
    });

    window.addEventListener('scroll', () => {
      if (!this.lenis) return;
      this.onScrollTick(window.scrollY);
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.updateDimensions();
      this.recalculateSectionBounds();
      this.onScrollTick(this.lenis?.scroll || 0);
    });
  }

  public start(): void {
    this.isRunning = true;
    this.lenis?.start();
    this.recalculateSectionBounds();
    this.onScrollTick(0);
  }

  public scrollToScene(index: number): void {
    if (!this.lenis || index < 0 || index >= this.sectionOffsets.length) return;
    const targetTop = this.sectionOffsets[index].top;
    this.lenis.scrollTo(targetTop, {
      duration: 2.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // easeOutQuart
    });
  }

  public scrollToTop(): void {
    this.lenis?.scrollTo(0, {
      duration: 2.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  }

  public subscribe(cb: DirectorSubscriber): () => void {
    this.subscribers.add(cb);
    cb(this.currentState);
    return () => this.subscribers.delete(cb);
  }

  public registerSectionElements(elements: HTMLElement[]): void {
    if (typeof window === 'undefined') return;

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      this.recalculateSectionBounds(elements);
    });

    elements.forEach(el => this.resizeObserver?.observe(el));
    this.recalculateSectionBounds(elements);
  }

  private updateDimensions(): void {
    this.vh = window.innerHeight;
    this.vw = window.innerWidth;
  }

  private recalculateSectionBounds(elements?: HTMLElement[]): void {
    if (elements && elements.length > 0) {
      this.sectionOffsets = elements.map(el => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + (this.lenis?.scroll || window.scrollY);
        return { top, height: el.offsetHeight };
      });
    } else {
      // Calculate based on configured vhHeights
      let currentTop = 0;
      this.sectionOffsets = SCENES.map(scene => {
        const height = (scene.vhHeight / 100) * this.vh;
        const entry = { top: currentTop, height };
        currentTop += height;
        return entry;
      });
    }
  }

  private onScrollTick(y: number): void {
    const vh = this.vh;
    const vw = this.vw;
    const lead = 0.78 * vh;
    const span = 0.62 * vh;

    // Cache metrics per scene
    const metrics: Record<string, SceneMetrics> = {};
    for (let i = 0; i < SCENES.length; i++) {
      const scene = SCENES[i];
      const bound = this.sectionOffsets[i] || { top: (i * 250 * vh) / 100, height: 250 * vh };
      const top = bound.top;
      const h = bound.height;

      const enter = clamp((y - (top - vh)) / vh);
      const p = clamp((y - top) / Math.max(1, h - vh));
      const exit = clamp((y - (top + h - vh)) / vh);
      const vis = clamp(Math.min(enter * 1.6, 1 - exit * 2.2));

      metrics[scene.id] = { enter, p, exit, vis };
    }

    // Active scene: last one where y >= top - lead
    let activeIdx = 0;
    for (let i = 0; i < SCENES.length; i++) {
      const bound = this.sectionOffsets[i] || { top: 0, height: 0 };
      if (y >= bound.top - lead) {
        activeIdx = i;
      }
    }

    const curScene = SCENES[activeIdx];
    const curP = metrics[curScene.id].p;
    let frameFraction = curScene.from + (curScene.to - curScene.from) * curP;

    // Check transition to next scene
    let isTransitioning = false;
    let transitionT = 0;
    let fromShotFrame = curScene.to;
    let toShotFrame = curScene.to;

    if (activeIdx < SCENES.length - 1) {
      const nextBound = this.sectionOffsets[activeIdx + 1];
      if (nextBound) {
        const transStart = nextBound.top - lead;
        if (y >= transStart && y <= transStart + span) {
          isTransitioning = true;
          const rawT = clamp((y - transStart) / span);
          transitionT = easeInOutSine(rawT);
          fromShotFrame = curScene.from + (curScene.to - curScene.from) * curP;
          const nextScene = SCENES[activeIdx + 1];
          toShotFrame = nextScene.from;
        }
      }
    }

    this.currentState = {
      scrollY: y,
      vh,
      vw,
      activeSceneIndex: activeIdx,
      activeScene: curScene,
      frameFraction,
      isTransitioning,
      transitionT,
      fromShotFrame,
      toShotFrame,
      metrics,
    };

    // Notify subscribers
    this.subscribers.forEach(cb => cb(this.currentState));
  }

  public getState(): DirectorState {
    return this.currentState;
  }
}

export const director = new ScrollDirector();
