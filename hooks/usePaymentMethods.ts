/**
 * Payment Methods Hook
 *
 * @description
 * Provides memoized payment methods with i18n support.
 * Ensures payment methods are only recalculated when necessary.
 *
 * @module hooks/usePaymentMethods
 */

import { useMemo } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { PAYMENT_METHODS } from '@/config/payment.config';
import { PaymentMethod } from '@/types';

/**
 * Payment method information with translated name
 */
export interface PaymentMethodInfo {
  /** Unique payment method identifier */
  id: PaymentMethod;
  /** Translated display name */
  name: string;
  /** Display color for UI elements */
  color: string;
  /** Path to QR code image */
  qrCode: string;
}

/**
 * Payment methods hook
 *
 * @returns {PaymentMethodInfo[]} Array of payment method information
 *
 * @example
 * ```typescript
 * function PaymentSection() {
 *   const paymentMethods = usePaymentMethods();
 *
 *   return (
 *     <div>
 *       {paymentMethods.map(method => (
 *         <div key={method.id} style={{ backgroundColor: method.color }}>
 *           <h3>{method.name}</h3>
 *           <img src={method.qrCode} alt={method.name} />
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePaymentMethods(): PaymentMethodInfo[] {
  const { t } = useI18n();

  return useMemo(() => {
    return PAYMENT_METHODS.map(method => ({
      id: method.id,
      name: t(method.nameKey),
      color: method.color,
      qrCode: method.qrCode,
    }));
  }, [t]);
}

/**
 * Get payment method info by ID
 *
 * @param {PaymentMethod[]} paymentMethods - Array of payment methods
 * @param {PaymentMethod} id - Payment method ID
 * @returns {PaymentMethodInfo | undefined} Payment method info or undefined
 *
 * @example
 * ```typescript
 * const paymentMethods = usePaymentMethods();
 * const wechat = getPaymentMethodInfo(paymentMethods, 'wechat');
 * console.log(wechat?.name); // '微信支付'
 * ```
 */
export function getPaymentMethodInfo(
  paymentMethods: PaymentMethodInfo[],
  id: PaymentMethod
): PaymentMethodInfo | undefined {
  return paymentMethods.find(method => method.id === id);
}
