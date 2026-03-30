import { Theme } from '@/types';

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  name: Theme;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    tertiary: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    emotion: {
      happy: string;
      excited: string;
      love: string;
      normal: string;
    };
    payment: {
      wechat: string;
      alipay: string;
    };
  };
  effects?: {
    glow?: string;
    shadow?: string;
  };
}

/**
 * 主题定义
 */
export const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    colors: {
      background: '#ebf1d6',
      foreground: '#3d3d3d',
      primary: '#a8cda2',
      secondary: '#d0d3b2',
      tertiary: '#ebf1d6',
      border: '#3d3d3d',
      text: {
        primary: '#3d3d3d',
        secondary: '#5a5a5a',
        disabled: '#999999',
      },
      emotion: {
        happy: '#a8cda2',
        excited: '#ffd700',
        normal: '#d0d3b2',
      },
      payment: {
        wechat: '#a8cda2',
        alipay: '#d0d3b2',
      },
    },
  },
  dark: {
    name: 'dark',
    colors: {
      background: '#1a1a2e',
      foreground: '#e0e0e0',
      primary: '#16213e',
      secondary: '#0f3460',
      tertiary: '#1a1a2e',
      border: '#4a4a6a',
      text: {
        primary: '#e0e0e0',
        secondary: '#a0a0c0',
        disabled: '#606080',
      },
      emotion: {
        happy: '#4a9eff',
        excited: '#ffd700',
        normal: '#7b8eb5',
      },
      payment: {
        wechat: '#4a9eff',
        alipay: '#7b8eb5',
      },
    },
    effects: {
      glow: 'rgba(74, 158, 255, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
  },
  rainbow: {
    name: 'rainbow',
    colors: {
      background: '#ffe5ec',
      foreground: '#2d2d2d',
      primary: '#ffb3c6',
      secondary: '#ffdfba',
      tertiary: '#ffffba',
      border: '#2d2d2d',
      text: {
        primary: '#2d2d2d',
        secondary: '#4a4a4a',
        disabled: '#999999',
      },
      emotion: {
        happy: '#b5ffb3',
        excited: '#ffffba',
        normal: '#bae1ff',
      },
      payment: {
        wechat: '#b5ffb3',
        alipay: '#ffffba',
      },
    },
  },
  cyberpunk: {
    name: 'cyberpunk',
    colors: {
      background: '#0d0221',
      foreground: '#00ff9f',
      primary: '#ff00ff',
      secondary: '#00ffff',
      tertiary: '#0d0221',
      border: '#ff00ff',
      text: {
        primary: '#00ff9f',
        secondary: '#00ffff',
        disabled: '#660066',
      },
      emotion: {
        happy: '#00ff9f',
        excited: '#ffff00',
        normal: '#00ffff',
      },
      payment: {
        wechat: '#00ff9f',
        alipay: '#00ffff',
      },
    },
    effects: {
      glow: 'rgba(255, 0, 255, 0.7)',
      shadow: 'rgba(0, 255, 159, 0.3)',
    },
  },
};

/**
 * 默认主题
 */
export const DEFAULT_THEME: Theme = 'light';

/**
 * 获取主题配置
 */
export function getThemeConfig(theme: Theme): ThemeConfig {
  return themes[theme] || themes[DEFAULT_THEME];
}

/**
 * 应用主题到CSS变量
 */
export function applyTheme(theme: Theme): void {
  const config = getThemeConfig(theme);

  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // 设置颜色变量
  root.style.setProperty('--background', config.colors.background);
  root.style.setProperty('--foreground', config.colors.foreground);
  root.style.setProperty('--primary', config.colors.primary);
  root.style.setProperty('--secondary', config.colors.secondary);
  root.style.setProperty('--tertiary', config.colors.tertiary);
  root.style.setProperty('--border', config.colors.border);

  // 设置文本颜色
  root.style.setProperty('--text-primary', config.colors.text.primary);
  root.style.setProperty('--text-secondary', config.colors.text.secondary);

  // 设置情绪颜色
  root.style.setProperty('--emotion-happy', config.colors.emotion.happy);
  root.style.setProperty('--emotion-excited', config.colors.emotion.excited);
  root.style.setProperty('--emotion-normal', config.colors.emotion.normal);

  // 设置支付方式颜色
  root.style.setProperty('--payment-wechat', config.colors.payment.wechat);
  root.style.setProperty('--payment-alipay', config.colors.payment.alipay);

  // 保存到localStorage
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('无法保存主题设置:', error);
  }
}

/**
 * 从localStorage获取保存的主题
 */
export function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  try {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && themes[saved]) {
      return saved;
    }
  } catch (error) {
    console.warn('无法读取保存的主题:', error);
  }

  return DEFAULT_THEME;
}
