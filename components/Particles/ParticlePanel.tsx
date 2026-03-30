"use client";

/**
 * ParticlePanel Component
 * 粒子系统测试面板
 */

import { useState, useRef, memo } from 'react';
import { useParticles } from '@/hooks/useParticles';

interface ParticlePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function ParticlePanel({ isOpen, onClose }: ParticlePanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const { usePreset, getParticleCount } = useParticles(canvasRef);
  const [particleCount, setParticleCount] = useState(0);

  const updateCount = () => {
    setParticleCount(getParticleCount());
  };

  const handlePreset = (preset: string, x: number, y: number) => {
    usePreset(preset, { x, y }, 30);
    setTimeout(updateCount, 100);
  };

  const presets = [
    { name: 'donation', label: '💰 捐赠', color: 'bg-yellow-500' },
    { name: 'celebration', label: '🎉 庆祝', color: 'bg-purple-500' },
    { name: 'glitch', label: '👾 故障', color: 'bg-green-500' },
    { name: 'hearts', label: '❤️ 爱心', color: 'bg-pink-500' },
    { name: 'coins', label: '🪙 金币', color: 'bg-yellow-400' },
    { name: 'cyber', label: '🤖 赛博', color: 'bg-cyan-500' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-40"
        style={{ pointerEvents: 'none' }}
      />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] pixel-border max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
          {/* 头部 */}
          <div className="bg-[#16213e] p-4 border-b-4 border-[#0f3460]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <h2 className="text-xl text-[#e94560] font-pixel font-bold">粒子系统</h2>
              </div>
              <button onClick={onClose} className="pixel-button bg-[#e94560] px-4 py-2 text-white">
                ✕
              </button>
            </div>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 粒子数量 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">📊 状态</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">活跃粒子</span>
                <span className="text-lg text-[#e94560] font-pixel">{particleCount}</span>
              </div>
            </div>

            {/* 预设效果 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">🎨 预设效果</h3>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePreset(preset.name, window.innerWidth / 2, window.innerHeight / 2)}
                    className={`pixel-button ${preset.color} px-4 py-3 text-sm text-white font-bold hover:opacity-90 transition-opacity`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义发射 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">🎯 点击发射</h3>
              <p className="text-xs text-gray-400 mb-3">
                在画布任意位置点击以发射粒子
              </p>
              <div className="bg-[#0f3460] pixel-border p-4">
                <p className="text-xs text-gray-500 text-center">
                  💡 提示：点击面板外的任意位置
                </p>
              </div>
            </div>

            {/* 功能说明 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">📖 功能说明</h3>
              <div className="text-xs text-gray-400 space-y-2">
                <p>🔹 <strong className="text-white">物理引擎</strong></p>
                <p className="pl-4">重力、摩擦力、速度模拟</p>

                <p>🔹 <strong className="text-white">粒子类型</strong></p>
                <p className="pl-4">像素、圆形、爱心、星星、文字、金币</p>

                <p>🔹 <strong className="text-white">性能优化</strong></p>
                <p className="pl-4">Canvas硬件加速，高效渲染</p>

                <p>🔹 <strong className="text-white">交互反馈</strong></p>
                <p className="pl-4">鼠标/触摸互动，实时响应</p>
              </div>
            </div>

            {/* 粒子类型说明 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">🎭 粒子类型</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-[#0f3460] pixel-border p-2 text-center">
                  <div className="text-lg mb-1">⬜</div>
                  <p className="text-gray-400">像素</p>
                </div>
                <div className="bg-[#0f3460] pixel-border p-2 text-center">
                  <div className="text-lg mb-1">⚪</div>
                  <p className="text-gray-400">圆形</p>
                </div>
                <div className="bg-[#0f3460] pixel-border p-2 text-center">
                  <div className="text-lg mb-1">❤️</div>
                  <p className="text-gray-400">爱心</p>
                </div>
                <div className="bg-[#0f3460] pixel-border p-2 text-center">
                  <div className="text-lg mb-1">⭐</div>
                  <p className="text-gray-400">星星</p>
                </div>
                <div className="bg-[#0f3460] pixel-border p-2 text-center">
                  <div className="text-lg mb-1">🪙</div>
                  <p className="text-gray-400">金币</p>
                </div>
                <div className="bg-[#0f3460] pixel-border p-2 text-center">
                  <div className="text-lg mb-1">🔤</div>
                  <p className="text-gray-400">文字</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ParticlePanel);
