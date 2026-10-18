import { useEffect, useState, useRef } from 'react';
import { director, DirectorState } from './director';

export function useDirector(): DirectorState {
  const [state, setState] = useState<DirectorState>(() => director.getState());

  useEffect(() => {
    return director.subscribe(newState => {
      // Only state updates when active scene changes or transitions start/end to avoid re-renders while scrolling
      setState(prev => {
        if (
          prev.activeSceneIndex !== newState.activeSceneIndex ||
          prev.isTransitioning !== newState.isTransitioning
        ) {
          return newState;
        }
        return prev;
      });
    });
  }, []);

  return state;
}

export function useSceneRef<T extends HTMLElement>(
  sceneId: string,
  onUpdate: (element: T, state: DirectorState) => void
) {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const unsub = director.subscribe(state => {
      if (elementRef.current) {
        onUpdate(elementRef.current, state);
      }
    });
    return unsub;
  }, [sceneId, onUpdate]);

  return elementRef;
}
