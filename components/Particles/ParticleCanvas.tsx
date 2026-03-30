"use client";

/**
 * ParticleCanvas Component
 * 粒子Canvas组件
 */

import { memo, useRef, useEffect } from 'react';
import { useParticles } from '@/hooks/useParticles';

interface ParticleCanvasProps {
  className?: string;
  onParticleCountChange?: (count: number) => void;
}

function ParticleCanvas({ className = '', onParticleCountChange }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const { getParticleCount } = useParticles(canvasRef);

  // 定期更新粒子数量
  useEffect(() => {
    const interval = setInterval(() => {
      const count = getParticleCount();
      onParticleCountChange?.(count);
    }, 100);

    return () => clearInterval(interval);
  }, [getParticleCount, onParticleCountChange]);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-canvas ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  );
}

export default memo(ParticleCanvas);
