"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
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
  // 初始化主题
  useEffect(() => {
    const savedTheme = getSavedTheme();
    const initialTheme = defaultTheme || savedTheme;
    applyTheme(initialTheme);
  }, [defaultTheme]);

  const setTheme = (theme: Theme) => {
    applyTheme(theme);
    // 触发自定义事件，让其他组件知道主题已更改
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
    }
  };

  const contextValue: ThemeContextValue = {
    theme: getSavedTheme(),
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
