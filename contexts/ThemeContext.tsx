"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '@/types';
import { applyTheme, getSavedTheme, DEFAULT_THEME } from '@/lib/themes';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * ThemeProvider组件
 * 提供主题切换功能
 */
export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme || DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // 初始化主题（仅在客户端运行）
  useEffect(() => {
    setMounted(true);
    const savedTheme = getSavedTheme();
    const initialTheme = defaultTheme || savedTheme || DEFAULT_THEME;
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, [defaultTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    // 触发自定义事件，让其他组件知道主题已更改
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }));
    }
  };

  const contextValue: ThemeContextValue = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * 在组件中访问主题
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
