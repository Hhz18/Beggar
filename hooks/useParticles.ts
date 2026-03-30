/**
 * useParticles Hook
 * 粒子系统Hook
 */

import { useEffect, useRef, useCallback } from 'react';
import { particleEngine, ParticleEmitter, Vector2D } from '@/lib/particles/particleEngine';

export function useParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const emitterRef = useRef<ParticleEmitter | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初始化粒子引擎
    const initialized = particleEngine.initialize(canvas);
    if (!initialized) return;

    // 启动引擎
    particleEngine.start();

    return () => {
      particleEngine.stop();
    };
  }, [canvasRef]);

  const createEmitter = useCallback((config?: Partial<typeof import('@/lib/particles/particleEngine').EmitterConfig>): ParticleEmitter => {
    const emitter = particleEngine.createEmitter(config);
    emitterRef.current = emitter;
    return emitter;
  }, []);

  const burst = useCallback((position: Vector2D, count?: number, options?: Partial<typeof import('@/lib/particles/particleEngine').EmitterConfig>): void => {
    particleEngine.burst(position, count, options);
  }, []);

  const usePreset = useCallback((name: string, position: Vector2D, count?: number): void => {
    particleEngine.usePreset(name, position, count);
  }, []);

  const getParticleCount = useCallback((): number => {
    return particleEngine.getParticleCount();
  }, []);

  const clear = useCallback((): void => {
    particleEngine.clear();
  }, []);

  return {
    createEmitter,
    burst,
    usePreset,
    getParticleCount,
    clear,
  };
}
