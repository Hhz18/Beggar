/**
 * 动态主题配置
 */
export interface DynamicTheme {
  name: string;
  colors: string[];
  animation: string;
  speed: number;
}

/**
 * 动态主题定义
 */
export const DYNAMIC_THEMES: Record<string, DynamicTheme> = {
  rainbow: {
    name: '彩虹渐变',
    colors: ['#ff6b6b', '#ffd700', '#4a9eff', '#a8cda2', '#ff69b4'],
    animation: 'gradient-flow',
    speed: 10,
  },
  sunset: {
    name: '日落渐变',
    colors: ['#ff6b6b', '#ffd700', '#ff8c00'],
    animation: 'gradient-flow',
    speed: 15,
  },
  ocean: {
    name: '海洋渐变',
    colors: ['#4a9eff', '#00d4ff', '#a8cda2'],
    animation: 'wave',
    speed: 8,
  },
  aurora: {
    name: '极光渐变',
    colors: ['#a8cda2', '#bb8fce', '#4a9eff'],
    animation: 'aurora',
    speed: 12,
  },
  neon: {
    name: '霓虹闪烁',
    colors: ['#ff69b4', '#00ff9f', '#ffd700'],
    animation: 'neon-pulse',
    speed: 5,
  },
};

/**
 * 应用动态主题
 */
export function applyDynamicTheme(theme: DynamicTheme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // 移除旧的动态主题
  root.style.removeProperty('--dynamic-theme-active');

  if (theme) {
    root.style.setProperty('--dynamic-theme-active', 'true');
    root.style.setProperty('--dynamic-colors', theme.colors.join(','));
    root.style.setProperty('--dynamic-speed', `${theme.speed}s`);
    root.style.setProperty('--dynamic-animation', theme.animation);
  }
}

/**
 * 移除动态主题
 */
export function removeDynamicTheme(): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.removeProperty('--dynamic-theme-active');
}
