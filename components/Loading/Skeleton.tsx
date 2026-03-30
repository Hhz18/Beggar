"use client";

import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton组件
 * 骨架屏加载占位符
 */
function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    rectangular: 'rounded-none',
    circular: 'rounded-full',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`bg-[#d0d3b2] ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
      aria-hidden="true"
      role="presentation"
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/**
 * SkeletonText组件
 * 文本骨架屏
 */
export const SkeletonText = memo(function SkeletonText({
  lines = 3,
  className = '',
}: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
});

interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
}

/**
 * SkeletonCard组件
 * 卡片骨架屏
 */
export const SkeletonCard = memo(function SkeletonCard({
  className = '',
  showAvatar = false,
}: SkeletonCardProps) {
  return (
    <div className={`bg-[#d0d3b2] pixel-border p-4 ${className}`}>
      {showAvatar && (
        <div className="flex items-center gap-3 mb-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
      )}
      <SkeletonText lines={2} />
    </div>
  );
});

interface SkeletonStatsProps {
  className?: string;
}

/**
 * SkeletonStats组件
 * 统计卡片骨架屏
 */
export const SkeletonStats = memo(function SkeletonStats({
  className = '',
}: SkeletonStatsProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-[#d0d3b2] pixel-border p-3 text-center">
          <Skeleton variant="text" width="80%" className="mx-auto mb-2" />
          <Skeleton variant="rectangular" width="60%" height={24} className="mx-auto" />
        </div>
      ))}
    </div>
  );
});

export default memo(Skeleton);
