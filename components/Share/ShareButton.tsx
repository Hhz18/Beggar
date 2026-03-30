"use client";

/**
 * ShareButton Component
 * 原生分享按钮
 */

import { memo } from 'react';

interface ShareButtonProps {
  canShare: boolean;
  isSharing: boolean;
  onClick: () => void;
  className?: string;
  label?: string;
}

function ShareButton({
  canShare,
  isSharing,
  onClick,
  className = '',
  label = '分享'
}: ShareButtonProps) {
  if (!canShare) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={isSharing}
      className={`pixel-button bg-gradient-to-r from-[#e94560] to-[#ff6b6b] px-4 py-2 text-white font-bold hover:from-[#ff6b6b] hover:to-[#e94560] transition-all disabled:opacity-50 ${className}`}
    >
      {isSharing ? (
        <>
          <span
            className="mr-2 inline-block"
          >
            📤
          </span>
          分享中...
        </>
      ) : (
        <>
          <span className="mr-2">📤</span>
          {label}
        </>
      )}
    </button>
  );
}

export default memo(ShareButton);
