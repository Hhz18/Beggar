/**
 * Donation Processing Hook
 *
 * @description
 * Encapsulates donation logic with proper error handling and cleanup.
 * Manages the complete donation flow from submission to confirmation.
 *
 * @module hooks/useDonationHandler
 */

import { useCallback, useEffect, useRef } from 'react';
import { PaymentMethod } from '@/types';
import { saveDonationRecord } from '@/lib/storage';
import { PAYMENT_CONFIG } from '@/config/payment.config';
import { useAppState } from './useAppState';

/**
 * Donation handler hook return type
 */
interface UseDonationHandlerReturn {
  /**
   * Process a donation
   *
   * @param {number} amount - Donation amount
   * @param {PaymentMethod} methodId - Payment method ID
   */
  handleDonate: (amount: number, methodId: PaymentMethod) => void;
}

/**
 * Donation processing hook
 *
 * @returns {UseDonationHandlerReturn} Donation handler function
 *
 * @example
 * ```typescript
 * function PaymentForm() {
 *   const { handleDonate } = useDonationHandler();
 *
 *   return (
 *     <DonationInput
 *       onSubmit={(amount) => handleDonate(amount, 'wechat')}
 *       paymentMethod="WeChat"
 *     />
 *   );
 * }
 * ```
 */
export function useDonationHandler(): UseDonationHandlerReturn {
  const { actions } = useAppState();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Handle donation submission
   *
   * @param {number} amount - Donation amount
   * @param {PaymentMethod} methodId - Payment method ID
   */
  const handleDonate = useCallback((amount: number, methodId: PaymentMethod) => {
    try {
      // Validate donation amount
      if (amount < PAYMENT_CONFIG.MIN_AMOUNT || amount > PAYMENT_CONFIG.MAX_AMOUNT) {
        console.error(`Invalid donation amount: ${amount}`);
        // TODO: Show error toast to user
        return;
      }

      // Create donation record
      const record = {
        amount,
        paymentMethod: methodId,
        timestamp: Date.now(),
        date: new Date().toLocaleString('zh-CN'),
      };

      // Save donation record
      saveDonationRecord(record);

      // Show thank you modal (emotion is set automatically)
      actions.showThankYou(amount, methodId);

      // Reset cat emotion after delay
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        actions.resetCatEmotion();
      }, PAYMENT_CONFIG.EMOTION_RESET_DELAY);

    } catch (error) {
      console.error('Failed to process donation:', error);
      // TODO: Show error toast to user
    }
  }, [actions]);

  return { handleDonate };
}
