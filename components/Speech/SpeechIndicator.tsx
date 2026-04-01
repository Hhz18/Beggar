"use client";

/**
 * SpeechIndicator Component
 * 像素风格的语音识别指示器
 */

import { memo } from 'react';
import { motion } from 'framer-motion';

interface SpeechIndicatorProps {
  isListening: boolean;
  transcript?: string;
  error?: string | null;
  className?: string;
}

function SpeechIndicator({ isListening, transcript, error, className = '' }: SpeechIndicatorProps) {
  if (error) {
    return (
      <div className={`pixel-border bg-red-100 p-4 ${className}`}>
        <div className="flex items-center gap-2 text-red-600">
          <span className="text-xl">⚠️</span>
          <span className="text-sm font-pixel">语音识别错误</span>
        </div>
        <p className="text-xs text-red-500 mt-2 font-pixel">{error}</p>
      </div>
    );
  }

  if (!isListening) {
    return (
      <div className={`pixel-border bg-gray-100 p-4 ${className}`}>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-xl">🎤</span>
          <span className="text-sm font-pixel">点击麦克风开始说话</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`pixel-border bg-blue-100 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <motion.span
          className="text-xl inline-block"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🎙️
        </motion.span>
        <span className="text-sm text-blue-600 font-pixel">正在聆听...</span>
      </div>

      {/* 声波动画 */}
      <div className="flex items-end justify-center gap-1 h-8 mb-3">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-blue-500"
            animate={{
              height: [8, 32, 8],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {transcript && (
        <div className="bg-white pixel-border p-3">
          <p className="text-sm text-gray-700 font-pixel">{transcript}</p>
        </div>
      )}
    </div>
  );
}

export default memo(SpeechIndicator);
