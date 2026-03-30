"use client";

import { useState, memo } from 'react';
import { DYNAMIC_THEMES, applyDynamicTheme, removeDynamicTheme } from '@/lib/dynamicThemes';

interface DynamicThemeSwitcherProps {
  className?: string;
}

/**
 * DynamicThemeSwitcher组件
 * 动态主题切换器
 */
function DynamicThemeSwitcher({ className = '' }: DynamicThemeSwitcherProps) {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const handleThemeChange = (themeId: string) => {
    if (activeTheme === themeId) {
      removeDynamicTheme();
      setActiveTheme(null);
    } else {
      const theme = DYNAMIC_THEMES[themeId];
      applyDynamicTheme(theme);
      setActiveTheme(themeId);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs text-[#5a5a5a] font-pixel">
        🌈 动态主题
      </label>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(DYNAMIC_THEMES).map(([id, theme]) => (
          <button
            key={id}
            onClick={() => handleThemeChange(id)}
            className={`pixel-button px-3 py-2 text-xs transition-all ${
              activeTheme === id
                ? 'ring-2 ring-offset-2 ring-[#a8cda2]'
                : 'bg-[#d0d3b2] hover:bg-[#a8cda2]'
            }`}
            style={{
              background: activeTheme === id
                ? `linear-gradient(135deg, ${theme.colors.join(', ')})`
                : '',
            }}
            aria-label={`切换到${theme.name}`}
            aria-pressed={activeTheme === id}
          >
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg">✨</span>
              <span className="text-xs">{theme.name}</span>
            </div>
          </button>
        ))}
      </div>

      {activeTheme && (
        <button
          onClick={() => {
            removeDynamicTheme();
            setActiveTheme(null);
          }}
          className="pixel-button bg-[#ff6b6b] px-3 py-2 text-xs text-white w-full mt-2 hover:bg-[#ff5252]"
        >
          关闭动态效果
        </button>
      )}
    </div>
  );
}

export default memo(DynamicThemeSwitcher);
