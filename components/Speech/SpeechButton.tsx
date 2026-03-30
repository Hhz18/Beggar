"use client";

/**
 * SpeechButton Component
 * 语音控制按钮
 */

import { memo } from 'react';

interface SpeechButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

function SpeechButton({ isListening, onClick, disabled = false, className = '' }: SpeechButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`pixel-button px-4 py-2 text-sm font-bold transition-all ${
        isListening
          ? 'bg-[#e94560] text-white animate-pulse'
          : 'bg-[#0f3460] text-[#a0a0a0] hover:bg-[#1a1a2e]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label={isListening ? '停止语音识别' : '开始语音识别'}
    >
      <span className="mr-1">{isListening ? '🎙️' : '🎤'}</span>
      {isListening ? '监听中' : '语音'}
    </button>
  );
}

export default memo(SpeechButton);
