"use client";

/**
 * ParticleEffects Component
 * 粒子效果触发器
 */

import { memo, useRef, useEffect } from 'react';
import { useParticles } from '@/hooks/useParticles';

interface ParticleEffectsProps {
  onDonate?: (amount: number) => void;
}

function ParticleEffects({ onDonate }: ParticleEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const { usePreset } = useParticles(canvasRef);

  const triggerConfetti = (x: number, y: number) => {
    usePreset('celebration', { x, y }, 50);
  };

  const triggerDonation = (x: number, y: number, amount: number) => {
    usePreset('donation', { x, y }, 30);
    onDonate?.(amount);
  };

  const triggerGlitch = (x: number, y: number) => {
    usePreset('glitch', { x, y }, 20);
  };

  const triggerHearts = (x: number, y: number) => {
    usePreset('hearts', { x, y }, 25);
  };

  const triggerCoins = (x: number, y: number) => {
    usePreset('coins', { x, y }, 20);
  };

  const triggerCyber = (x: number, y: number) => {
    usePreset('cyber', { x, y }, 40);
  };

  // 暴露给全局使用
  useEffect(() => {
    (window as any).particleEffects = {
      triggerConfetti,
      triggerDonation,
      triggerGlitch,
      triggerHearts,
      triggerCoins,
      triggerCyber,
    };
  }, []);

  return null;
}

export default memo(ParticleEffects);
