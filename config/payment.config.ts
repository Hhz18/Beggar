/**
 * Payment Configuration
 *
 * @description
 * Centralizes all payment-related constants and settings.
 * Eliminates hardcoded values scattered throughout the codebase.
 *
 * @module config/payment.config
 */

import { PaymentMethod } from '@/types';

/**
 * Payment method information structure
 */
export interface PaymentMethodInfo {
  /** Unique payment method identifier */
  id: PaymentMethod;
  /** i18n key for payment method name */
  nameKey: string;
  /** Display color for UI elements */
  color: string;
  /** Path to QR code image */
  qrCode: string;
  /** Loading priority (lower = higher priority) */
  priority: number;
}

/**
 * Available payment methods
 *
 * @example
 * ```typescript
 * PAYMENT_METHODS.map(method => console.log(method.nameKey));
 * ```
 */
export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'wechat',
    nameKey: 'payment.wechat',
    color: '#a8cda2',
    qrCode: '/vx.jpg',
    priority: 1,
  },
  {
    id: 'alipay',
    nameKey: 'payment.alipay',
    color: '#d0d3b2',
    qrCode: '/zfb.jpg',
    priority: 2,
  },
] as const;

/**
 * Payment-related configuration constants
 */
export const PAYMENT_CONFIG = {
  /**
   * Cat emotions to display after successful donation
   */
  SUCCESS_EMOTIONS: ['happy', 'excited'] as const,

  /**
   * Delay before resetting cat emotion to normal (milliseconds)
   */
  EMOTION_RESET_DELAY: 3000,

  /**
   * Default cat emotion
   */
  DEFAULT_EMOTION: 'normal' as const,

  /**
   * Minimum donation amount (in currency units)
   */
  MIN_AMOUNT: 0.01,

  /**
   * Maximum donation amount (in currency units)
   */
  MAX_AMOUNT: 1000000,

  /**
   * Default donation amount for quick input
   */
  DEFAULT_AMOUNT: 10,

  /**
   * Quick donation amount options
   */
  QUICK_AMOUNTS: [1, 5, 10, 20, 50, 100] as const,

  /**
   * QR code loading priority
   */
  QR_CODE_PRIORITY: {
    wechat: true, // Priority load for WeChat
    alipay: false,
  } as const,
} as const;

/**
 * Success emotion type
 */
export type SuccessEmotion = typeof PAYMENT_CONFIG.SUCCESS_EMOTIONS[number];

/**
 * Get a random success emotion
 *
 * @returns {SuccessEmotion} A random success emotion
 *
 * @example
 * ```typescript
 * const emotion = getRandomSuccessEmotion();
 * console.log(emotion); // 'happy' or 'excited'
 * ```
 */
export function getRandomSuccessEmotion(): SuccessEmotion {
  const emotions = PAYMENT_CONFIG.SUCCESS_EMOTIONS;
  return emotions[Math.floor(Math.random() * emotions.length)];
}

/**
 * Get payment method info by ID
 *
 * @param {PaymentMethod} id - Payment method ID
 * @returns {PaymentMethodInfo | undefined} Payment method info or undefined
 *
 * @example
 * ```typescript
 * const wechat = getPaymentMethodInfo('wechat');
 * console.log(wechat?.color); // '#a8cda2'
 * ```
 */
export function getPaymentMethodInfo(id: PaymentMethod): PaymentMethodInfo | undefined {
  return PAYMENT_METHODS.find(method => method.id === id);
}
