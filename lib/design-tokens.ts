/**
 * 设计令牌系统
 * 统一管理所有设计常量,确保视觉一致性
 */

export const colors = {
  // 主色系 - 赛博乞讨主题
  background: '#ebf1d6',
  foreground: '#3d3d3d',

  // 辅助色系
  primary: '#a8cda2',    // 浅绿
  secondary: '#d0d3b2',  // 米黄
  tertiary: '#ebf1d6',   // 淡黄绿

  // 情绪色系
  emotion: {
    happy: '#a8cda2',      // 绿色 - 开心
    excited: '#ffd700',    // 金色 - 兴奋
    normal: '#d0d3b2',     // 米黄 - 正常
  },

  // 功能色
  border: '#3d3d3d',
  text: {
    primary: '#3d3d3d',
    secondary: '#5a5a5a',
    disabled: '#999999',
  },

  // 支付方式颜色
  payment: {
    wechat: '#a8cda2',
    alipay: '#d0d3b2',
  },
} as const;

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

export const fontSize = {
  xs: '0.75rem',   // 12px
  sm: '0.875rem',  // 14px
  base: '1rem',    // 16px
  lg: '1.125rem',  // 18px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  none: 'none',
} as const;

export const transitions = {
  default: `all ${animation.duration.base} ${animation.easing.default}`,
  fast: `all ${animation.duration.fast} ${animation.easing.default}`,
  slow: `all ${animation.duration.slow} ${animation.easing.default}`,
  colors: `color ${animation.duration.base} ${animation.easing.default}`,
  transform: `transform ${animation.duration.base} ${animation.easing.default}`,
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type AnimationDuration = typeof animation.duration;
export type AnimationEasing = typeof animation.easing;
export type ZIndex = typeof zIndex;
