"use client";

import { useState, useEffect, useCallback, memo } from 'react';
import { CatEmotion } from '@/types';

interface PixelCatProps {
  emotion?: CatEmotion;
  onAnimate?: () => void;
  onInteractionChange?: (emotion: CatEmotion) => void;
}

function PixelCat({ emotion = 'normal', onAnimate, onInteractionChange }: PixelCatProps) {
  const [currentEmotion, setCurrentEmotion] = useState<CatEmotion>(emotion);
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (emotion !== currentEmotion) {
      setCurrentEmotion(emotion);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimate?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [emotion]);

  // 根据情绪获取颜色
  const getCatColors = () => {
    switch (currentEmotion) {
      case 'happy':
        return {
          ear: '#3d3d3d',
          head: '#a8cda2',
          headHighlight: '#c5e0c0',
          body: '#a8cda2',
          eye: '#3d3d3d',
          nose: '#ffb6c1',
        };
      case 'excited':
        return {
          ear: '#3d3d3d',
          head: '#ffd700',
          headHighlight: '#ffe44d',
          body: '#ffd700',
          eye: '#3d3d3d',
          nose: '#ff69b4',
        };
      default:
        return {
          ear: '#3d3d3d',
          head: '#d0d3b2',
          headHighlight: '#a8cda2',
          body: '#a8cda2',
          eye: '#3d3d3d',
          nose: '#ffb6c1',
        };
    }
  };

  const colors = getCatColors();

  // 处理点击小猫的互动
  const handleCatClick = useCallback(() => {
    const emotions: CatEmotion[] = ['happy', 'excited'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    setClickCount(prev => prev + 1);
    setCurrentEmotion(randomEmotion);
    setIsAnimating(true);
    onInteractionChange?.(randomEmotion);

    // 播放动画后恢复
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentEmotion(emotion);
      onAnimate?.();
    }, 2000);
  }, [emotion, onAnimate, onInteractionChange]);

  const getAnimationClass = () => {
    if (!isAnimating) return 'animate-bounce-slow';
    switch (currentEmotion) {
      case 'happy': return 'animate-cat-happy';
      case 'excited': return 'animate-cat-excited';
      default: return 'animate-bounce-slow';
    }
  };

  return (
    <div
      className={`flex justify-center ${getAnimationClass()} cursor-pointer select-none`}
      onClick={handleCatClick}
      role="button"
      aria-label="点击与小猫互动"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCatClick();
        }
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 12 12"
        className="md:w-[160px] md:h-[160px]"
        style={{ imageRendering: "pixelated" }}
      >
        {/* 星星特效 - excited 状态 */}
        {currentEmotion === 'excited' && isAnimating && (
          <>
            <text x="0" y="1" fontSize="2" fill="#ffd700">✨</text>
            <text x="10" y="1" fontSize="2" fill="#ffd700">⭐</text>
            <text x="11" y="4" fontSize="2" fill="#ffff00">🌟</text>
          </>
        )}

        {/* ===== 猫耳朵 ===== */}
        <rect x="2" y="0" width="1" height="2" fill={colors.ear} />
        <rect x="3" y="0" width="1" height="2" fill={colors.ear} />
        <rect x="8" y="0" width="1" height="2" fill={colors.ear} />
        <rect x="9" y="0" width="1" height="2" fill={colors.ear} />

        {/* ===== 猫头 ===== */}
        <rect x="2" y="2" width="8" height="7" fill={colors.head} />
        <rect x="3" y="2" width="6" height="1" fill={colors.headHighlight} />

        {/* ===== 眼睛 ===== */}
        {currentEmotion === 'excited' ? (
          // 星星眼
          <>
            <text x="4" y="4.5" fontSize="1" fill="#3d3d3d">✨</text>
            <text x="7" y="4.5" fontSize="1" fill="#3d3d3d">✨</text>
          </>
        ) : (
          // 普通像素眼
          <>
            <rect x="4" y="4" width="1" height="1" fill={colors.eye} />
            <rect x="7" y="4" width="1" height="1" fill={colors.eye} />
          </>
        )}

        {/* ===== 鼻子 ===== */}
        <rect x="5" y="6" width="2" height="1" fill={colors.nose} />

        {/* ===== 嘴巴 ===== */}
        {currentEmotion === 'happy' ? (
          // 开心的笑脸
          <>
            <rect x="4" y="7" width="1" height="1" fill="#3d3d3d" />
            <rect x="7" y="7" width="1" height="1" fill="#3d3d3d" />
            <rect x="5" y="7" width="2" height="1" fill="#3d3d3d" />
            <rect x="4" y="8" width="1" height="1" fill="#3d3d3d" />
            <rect x="7" y="8" width="1" height="1" fill="#3d3d3d" />
          </>
        ) : (
          // 普通嘴
          <>
            <rect x="4" y="7" width="1" height="1" fill="#3d3d3d" />
            <rect x="7" y="7" width="1" height="1" fill="#3d3d3d" />
          </>
        )}

        {/* ===== 胡须（可爱添加）===== */}
        <rect x="1" y="5" width="1" height="1" fill="#3d3d3d" opacity="0.5" />
        <rect x="0" y="6" width="1" height="1" fill="#3d3d3d" opacity="0.5" />
        <rect x="0" y="7" width="1" height="1" fill="#3d3d3d" opacity="0.5" />

        <rect x="10" y="5" width="1" height="1" fill="#3d3d3d" opacity="0.5" />
        <rect x="11" y="6" width="1" height="1" fill="#3d3d3d" opacity="0.5" />
        <rect x="11" y="7" width="1" height="1" fill="#3d3d3d" opacity="0.5" />

        {/* ===== 腮红（可爱添加）===== */}
        <rect x="3" y="6" width="1" height="1" fill={colors.nose} opacity="0.3" />
        <rect x="8" y="6" width="1" height="1" fill={colors.nose} opacity="0.3" />

        {/* ===== 身体 ===== */}
        <rect x="3" y="9" width="6" height="2" fill={colors.body} />

        {/* ===== 前腿 ===== */}
        <rect x="3" y="11" width="1" height="1" fill="#3d3d3d" />
        <rect x="8" y="11" width="1" height="1" fill="#3d3d3d" />

        {/* ===== 尾巴 ===== */}
        <rect x="9" y="10" width="2" height="1" fill={colors.body} />
        {currentEmotion === 'excited' && (
          <rect x="11" y="9" width="1" height="1" fill={colors.body} className="animate-pulse" />
        )}
      </svg>
    </div>
  );
}

// 添加display name以便调试
PixelCat.displayName = 'PixelCat';

export default PixelCat;
