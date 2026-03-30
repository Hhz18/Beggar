"use client";

/**
 * InteractiveParticles Component
 * 交互式粒子背景
 */

import { memo, useRef, useEffect } from 'react';
import { useParticles } from '@/hooks/useParticles';

interface InteractiveParticlesProps {
  className?: string;
  preset?: string;
  intensity?: number;
}

function InteractiveParticles({
  className = '',
  preset = 'cyber',
  intensity = 1
}: InteractiveParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const { usePreset } = useParticles(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 鼠标移动时发射粒子
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > intensity * 0.3) return;

      usePreset(preset, { x: e.clientX, y: e.clientY }, 1);
    };

    // 触摸移动
    const handleTouchMove = (e: TouchEvent) => {
      if (Math.random() > intensity * 0.3) return;

      const touch = e.touches[0];
      usePreset(preset, { x: touch.clientX, y: touch.clientY }, 1);
    };

    // 点击时爆发
    const handleClick = (e: MouseEvent) => {
      usePreset(preset, { x: e.clientX, y: e.clientY }, 15);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [preset, intensity, usePreset]);

  return (
    <canvas
      ref={canvasRef}
      className={`interactive-particles ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 1,
      }}
    />
  );
}

export default memo(InteractiveParticles);
