"use client";

import { useEffect, useState, memo } from 'react';
import { getActiveSeasonalTheme, SEASONAL_THEMES } from '@/lib/seasonalThemes';

interface SeasonalThemeIndicatorProps {
  className?: string;
}

/**
 * SeasonalThemeIndicator组件
 * 季节性主题指示器
 */
function SeasonalThemeIndicator({ className = '' }: SeasonalThemeIndicatorProps) {
  const [activeTheme, setActiveTheme] = useState<ReturnType<typeof getActiveSeasonalTheme>>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // 检查季节性主题
    const theme = getActiveSeasonalTheme();
    setActiveTheme(theme);

    if (theme) {
      // 显示通知
      const hasSeen = localStorage.getItem(`season_${theme.id}_seen`);
      if (!hasSeen) {
        setShowNotification(true);
      }
    }
  }, []);

  const handleActivate = () => {
    if (activeTheme) {
      localStorage.setItem(`season_${activeTheme.id}_seen`, 'true');
      // 应用主题
      document.documentElement.setAttribute('data-season', activeTheme.id);
    }
    setShowNotification(false);
  };

  const handleDismiss = () => {
    if (activeTheme) {
      localStorage.setItem(`season_${activeTheme.id}_seen`, 'true');
    }
    setShowNotification(false);
  };

  if (!activeTheme) return null;

  return (
    <>
      {/* 季节主题图标 */}
      <div className={`fixed top-20 right-4 z-30 ${className}`}>
        <div
          className="pixel-button bg-[#d0d3b2] p-3 animate-bounce-slow shadow-lg"
          style={{
            animationDuration: '2s',
            boxShadow: '0 0 20px rgba(168, 205, 162, 0.5)',
          }}
          title={activeTheme.name}
        >
          <span className="text-2xl">{activeTheme.icon}</span>
        </div>
      </div>

      {/* 季节主题通知 */}
      {showNotification && (
        <div className="fixed top-24 right-4 z-40 max-w-xs">
          <div className="bg-[#ebf1d6] pixel-border p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{activeTheme.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-[#3d3d3d] mb-1">
                  {activeTheme.name}来啦！
                </h3>
                <p className="text-xs text-[#5a5a5a] mb-3">
                  已为您准备了特别的主题效果
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleActivate}
                    className="pixel-button bg-[#a8cda2] px-3 py-1 text-xs text-[#3d3d3d]"
                  >
                    启用主题
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="pixel-button bg-[#d0d3b2] px-3 py-1 text-xs text-[#3d3d3d]"
                  >
                    稍后再说
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(SeasonalThemeIndicator);
