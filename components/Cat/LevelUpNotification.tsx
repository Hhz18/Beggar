"use client";

import { useEffect, useState, memo } from 'react';
import { CatLevel } from '@/types/leveling';

interface LevelUpNotificationProps {
  newLevel: CatLevel;
  onClose: () => void;
}

/**
 * LevelUpNotification组件
 * 小猫升级通知动画
 */
function LevelUpNotification({ newLevel, onClose }: LevelUpNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setShowConfetti(true), 500);

    const timer = setTimeout(() => {
      handleClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-[#ebf1d6] pixel-border max-w-md w-full p-8 text-center transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-20'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: newLevel.color,
        }}
      >
        {/* 彩带效果 */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-heart text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                  color: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'][i % 5],
                }}
              >
                {['🎉', '🎊', '⭐', '✨', '💫'][i % 5]}
              </div>
            ))}
          </div>
        )}

        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 pixel-button bg-[#d0d3b2] px-3 py-1 text-xs hover:bg-[#a8cda2]"
        >
          ✕
        </button>

        {/* 内容 */}
        <div className="relative">
          {/* 大图标 */}
          <div className="text-6xl mb-4 animate-bounce-slow">
            🎊
          </div>

          {/* 标题 */}
          <h2 className="text-2xl md:text-3xl text-[#3d3d3d] mb-2 animate-glitter font-pixel">
            升级啦！
          </h2>

          {/* 新等级 */}
          <div className="mb-4">
            <div className="text-lg text-[#5a5a5a] mb-2">
              你的小猫现在是
            </div>
            <div
              className="text-3xl font-bold text-[#3d3d3d] pixel-border inline-block px-6 py-3"
              style={{
                backgroundColor: newLevel.color,
                boxShadow: `0 0 20px ${newLevel.color}80`,
              }}
            >
              {newLevel.name}
            </div>
          </div>

          {/* 等级 */}
          <div className="text-5xl font-bold text-[#3d3d3d] mb-4">
            Lv.{newLevel.level}
          </div>

          {/* 解锁内容 */}
          <div className="bg-[#d0d3b2] pixel-border p-4 mb-4">
            <p className="text-sm text-[#5a5a5a] mb-2">解锁新内容：</p>
            <div className="space-y-2">
              {newLevel.unlockedEmotions.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span>😀</span>
                  <span className="text-[#3d3d3d]">新表情</span>
                </div>
              )}
              {newLevel.unlockedAccessories.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span>🎀</span>
                  <span className="text-[#3d3d3d]">
                    新配饰: {newLevel.unlockedAccessories.join('、')}
                  </span>
                </div>
              )}
              {newLevel.bonusMultiplier > 1 && (
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span>⭐</span>
                  <span className="text-[#3d3d3d]">
                    经验加成: {(newLevel.bonusMultiplier - 1) * 100}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 确认按钮 */}
          <button
            onClick={handleClose}
            className="pixel-button bg-[#a8cda2] px-8 py-3 text-sm text-[#3d3d3d] hover:bg-[#ebf1d6] transition-colors"
          >
            太棒了！
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(LevelUpNotification);
