export interface ManifestShot {
  from: number;
  to: number;
  box: [number, number, number, number];
  cx: number;
}

export interface FrameManifest {
  w: number;
  h: number;
  count: number;
  shots: ManifestShot[];
}

export class FrameLoader {
  private manifest: FrameManifest | null = null;
  private frames: Map<number, HTMLImageElement> = new Map();
  private loadedCount = 0;
  private isMobile = false;
  private callbacks: Array<(loadedCount: number, total: number) => void> = [];
  private isPreloaded = false;

  constructor() {
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 820;
  }

  public async init(onProgress?: (loaded: number, total: number) => void): Promise<void> {
    if (onProgress) this.callbacks.push(onProgress);

    try {
      const resp = await fetch('./frames/manifest.json');
      this.manifest = await resp.json();
    } catch (e) {
      console.error('Failed to load frames manifest:', e);
      return;
    }

    if (!this.manifest) return;

    const total = this.manifest.count;
    const folder = this.isMobile ? 'sm' : 'lg';

    // Sequence loading: stride 8 -> 4 -> 2 -> 1, with shot boundaries first
    const boundaryFrames = new Set<number>();
    this.manifest.shots.forEach(s => {
      boundaryFrames.add(s.from);
      boundaryFrames.add(s.to);
    });

    const orderedIndices: number[] = [];
    const added = new Set<number>();

    // 1. Boundaries
    boundaryFrames.forEach(idx => {
      if (idx < total && !added.has(idx)) {
        orderedIndices.push(idx);
        added.add(idx);
      }
    });

    // 2. Strides: 8, 4, 2, 1
    const strides = [8, 4, 2, 1];
    for (const stride of strides) {
      for (let i = 0; i < total; i += stride) {
        if (!added.has(i)) {
          orderedIndices.push(i);
          added.add(i);
        }
      }
    }

    // Preloader target: first quarter of frames
    const quarterCount = Math.max(8, Math.floor(total / 4));

    // Load first batch synchronously awaited up to quarterCount
    const initialBatch = orderedIndices.slice(0, quarterCount);
    const remainingBatch = orderedIndices.slice(quarterCount);

    await Promise.all(
      initialBatch.map(idx => this.loadSingleFrame(idx, folder, total))
    );

    this.isPreloaded = true;

    // Stream remaining frames in background
    (async () => {
      for (const idx of remainingBatch) {
        await this.loadSingleFrame(idx, folder, total);
        // Micro-yield to maintain 60fps render
        await new Promise(r => setTimeout(r, 8));
      }
    })();
  }

  private async loadSingleFrame(idx: number, folder: string, total: number): Promise<void> {
    if (this.frames.has(idx)) return;

    return new Promise(resolve => {
      const img = new Image();
      const numStr = String(idx).padStart(3, '0');
      img.src = `./frames/${folder}/f${numStr}.webp`;

      const onDone = async () => {
        try {
          if ('decode' in img) {
            await img.decode();
          }
        } catch {
          // ignore decode errors
        }
        this.frames.set(idx, img);
        this.loadedCount++;
        this.callbacks.forEach(cb => cb(this.loadedCount, total));
        resolve();
      };

      img.onload = onDone;
      img.onerror = () => {
        console.warn(`Frame f${numStr}.webp failed to load.`);
        resolve();
      };
    });
  }

  public getManifest(): FrameManifest | null {
    return this.manifest;
  }

  public getLoadedCount(): number {
    return this.loadedCount;
  }

  public getFrame(idx: number): HTMLImageElement | null {
    if (this.frames.has(idx)) {
      return this.frames.get(idx)!;
    }

    if (!this.manifest) return null;

    // Fall back to nearest loaded frame in the same shot
    const shot = this.manifest.shots.find(s => idx >= s.from && idx <= s.to);
    if (!shot) return this.frames.get(0) || null;

    let nearest: HTMLImageElement | null = null;
    let minDiff = Infinity;

    for (let i = shot.from; i <= shot.to; i++) {
      if (this.frames.has(i)) {
        const diff = Math.abs(i - idx);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = this.frames.get(i)!;
        }
      }
    }

    return nearest || this.frames.get(0) || null;
  }

  public getShotForFrame(idx: number): ManifestShot | null {
    if (!this.manifest) return null;
    return this.manifest.shots.find(s => idx >= s.from && idx <= s.to) || this.manifest.shots[0];
  }
}

export const frameLoader = new FrameLoader();
