"use client";

import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LoadingSpinner组件
 * 像素风格的加载动画
 */
function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={`relative ${sizeStyles[size]} ${className}`}
      role="status"
      aria-label="加载中"
    >
      <div className="absolute inset-0 border-4 border-[#3d3d3d] border-t-[#a8cda2] rounded-full animate-spin" />
      <div className="absolute inset-2 border-4 border-[#3d3d3d] border-b-[#d0d3b2] rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
    </div>
  );
}

export default memo(LoadingSpinner);
