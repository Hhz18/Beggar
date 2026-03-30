"use client";

import { memo } from 'react';
import { Theme } from '@/types';
import { themes } from '@/lib/themes';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
}

/**
 * ThemeSwitcher组件
 * 主题切换按钮
 */
function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { theme: currentTheme, setTheme } = useTheme();

  const themeOptions: { key: Theme; name: string; emoji: string }[] = [
    { key: 'light', name: '明亮', emoji: '☀️' },
    { key: 'dark', name: '暗黑', emoji: '🌙' },
    { key: 'rainbow', name: '彩虹', emoji: '🌈' },
    { key: 'cyberpunk', name: '赛博', emoji: '💜' },
  ];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs text-[#5a5a5a] font-pixel">
        🎨 主题风格
      </label>
      <div className="grid grid-cols-2 gap-2">
        {themeOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setTheme(option.key)}
            className={`pixel-button px-3 py-2 text-xs transition-all ${
              currentTheme === option.key
                ? themes[option.key].colors.primary.replace('bg-', '') + ' ring-2 ring-offset-2 ring-[#3d3d3d]'
                : 'bg-[#d0d3b2] hover:bg-[#a8cda2]'
            }`}
            aria-label={`切换到${option.name}主题`}
            aria-pressed={currentTheme === option.key}
          >
            <span className="flex items-center justify-center gap-1">
              <span role="img" aria-label={option.name}>
                {option.emoji}
              </span>
              <span>{option.name}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 使用memo优化性能
export default memo(ThemeSwitcher);
