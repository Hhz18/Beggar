/**
 * useTransition Hook
 * View Transitions API Hook
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { transitionManager, TransitionConfig, ElementTransitionConfig } from '@/lib/transitions/transitionManager';

export interface UseTransitionResult {
  isSupported: boolean;
  isTransitioning: boolean;
  startTransition: (updateDOM: () => void | Promise<void>) => Promise<void>;
  createElementTransition: (element: HTMLElement, config: ElementTransitionConfig) => Animation | null;
  applyClassTransition: (element: HTMLElement, className: string, duration?: number) => Promise<void>;
  predefinedEffects: Record<string, Keyframe[]>;
  pixelEffects: Record<string, Keyframe[]>;
  cancelTransition: () => Promise<void>;
}

export function useTransition(): UseTransitionResult {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef<boolean>(false);

  useEffect(() => {
    transitionRef.current = transitionManager.checkSupport();
  }, []);

  const isSupported = transitionRef.current;

  const startTransition = useCallback(async (updateDOM: () => void | Promise<void>) => {
    if (!isSupported) {
      await updateDOM();
      return;
    }

    setIsTransitioning(true);

    try {
      await transitionManager.startTransition({ updateDOM });
    } finally {
      setIsTransitioning(false);
    }
  }, [isSupported]);

  const createElementTransition = useCallback((
    element: HTMLElement,
    config: ElementTransitionConfig
  ): Animation | null => {
    return transitionManager.createElementTransition(element, config);
  }, []);

  const applyClassTransition = useCallback((
    element: HTMLElement,
    className: string,
    duration: number = 300
  ): Promise<void> => {
    return transitionManager.applyClassTransition(element, className, duration);
  }, []);

  const cancelTransition = useCallback(async () => {
    await transitionManager.cancelTransition();
    setIsTransitioning(false);
  }, []);

  const predefinedEffects = transitionManager.getPredefinedTransitions();
  const pixelEffects = transitionManager.getPixelTransitions();

  return {
    isSupported,
    isTransitioning,
    startTransition,
    createElementTransition,
    applyClassTransition,
    predefinedEffects,
    pixelEffects,
    cancelTransition,
  };
}
