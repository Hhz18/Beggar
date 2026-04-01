/**
 * usePaymentRequest Hook
 * Payment Request API Hook
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { paymentEngine, PaymentMethodData, PaymentItem, PaymentOptions, PaymentResult } from '@/lib/payment/paymentEngine';

export interface UsePaymentRequestResult {
  isSupported: boolean;
  canMakePayment: boolean;
  isChecking: boolean;
  isProcessing: boolean;
  error: string | null;
  checkAvailability: () => Promise<boolean>;
  initiatePayment: (amount: number, currency?: string) => Promise<PaymentResult | null>;
  formatAmount: (amount: number, currency?: string) => string;
}

export function usePaymentRequest(): UsePaymentRequestResult {
  const [isSupported, setIsSupported] = useState(false);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check support only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsSupported(paymentEngine.isSupported());
  }, []);

  const paymentMethodsRef = useRef<PaymentMethodData[]>(paymentEngine.getSupportedPaymentMethods());

  const checkAvailability = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    setIsChecking(true);
    setError(null);

    try {
      const available = await paymentEngine.canMakePayment(paymentMethodsRef.current);
      setCanMakePayment(available);
      return available;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check payment availability';
      setError(message);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [isSupported]);

  const initiatePayment = useCallback(async (
    amount: number,
    currency: string = 'CNY'
  ): Promise<PaymentResult | null> => {
    if (!isSupported) {
      setError('Payment Request API not supported');
      return null;
    }

    if (!paymentEngine.validateAmount(amount)) {
      setError('Invalid amount');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 创建支付请求
      const request = paymentEngine.createPaymentRequest({
        paymentMethods: paymentMethodsRef.current,
        total: {
          label: '赛博乞讨 - 施舍金额',
          amount: {
            currency,
            value: amount.toFixed(2),
          },
        },
        displayItems: [
          {
            label: '施舍金额',
            amount: {
              currency,
              value: amount.toFixed(2),
            },
          },
        ],
        options: {
          requestPayerName: true,
          requestPayerEmail: true,
          requestPayerPhone: false,
          requestBillingAddress: false,
          requestShipping: false,
        },
      });

      if (!request) {
        setError('Failed to create payment request');
        return null;
      }

      // 显示支付界面
      const response = await paymentEngine.show();

      if (!response) {
        // 用户取消
        return null;
      }

      // 提取支付信息
      const paymentInfo = paymentEngine.extractPaymentInfo(response);

      // 完成支付
      await paymentEngine.completePayment(response, 'success');

      return paymentInfo;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);

      // 尝试完成支付（失败状态）
      try {
        await paymentEngine.completePayment(
          (err as any).response,
          'fail'
        );
      } catch {
        // 忽略
      }

      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [isSupported]);

  const formatAmount = useCallback((amount: number, currency?: string) => {
    return paymentEngine.formatAmount(amount, currency);
  }, []);

  return {
    isSupported,
    canMakePayment,
    isChecking,
    isProcessing,
    error,
    checkAvailability,
    initiatePayment,
    formatAmount,
  };
}
