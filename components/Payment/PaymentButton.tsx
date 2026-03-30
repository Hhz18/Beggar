"use client";

/**
 * PaymentButton Component
 * 原生支付按钮
 */

import { memo } from 'react';

interface PaymentButtonProps {
  isSupported: boolean;
  canMakePayment: boolean;
  isProcessing: boolean;
  onClick: () => void;
  amount: number;
  currency?: string;
  className?: string;
}

function PaymentButton({
  isSupported,
  canMakePayment,
  isProcessing,
  onClick,
  amount,
  currency = 'CNY',
  className = ''
}: PaymentButtonProps) {
  if (!isSupported) {
    return null;
  }

  const formatAmount = (amt: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
    }).format(amt);
  };

  return (
    <button
      onClick={onClick}
      disabled={!canMakePayment || isProcessing}
      className={`pixel-button bg-gradient-to-r from-[#e94560] to-[#ff6b6b] px-6 py-3 text-white font-bold hover:from-[#ff6b6b] hover:to-[#e94560] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isProcessing ? (
        <>
          <span className="mr-2 inline-block animate-spin">
            💳
          </span>
          支付处理中...
        </>
      ) : (
        <>
          <span className="mr-2">💳</span>
          快速支付 {formatAmount(amount)}
        </>
      )}
    </button>
  );
}

export default memo(PaymentButton);
