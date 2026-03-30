"use client";

/**
 * QuickPaymentButton Component
 * 快速支付入口按钮
 */

import { memo, useState, useEffect } from 'react';
import { usePaymentRequest } from '@/hooks/usePaymentRequest';
import PaymentPanel from './PaymentPanel';

interface QuickPaymentButtonProps {
  onPaymentComplete?: (result: any) => void;
  className?: string;
}

function QuickPaymentButton({ onPaymentComplete, className = '' }: QuickPaymentButtonProps) {
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const { isSupported, canMakePayment, checkAvailability } = usePaymentRequest();

  useEffect(() => {
    if (isSupported) {
      checkAvailability();
    }
  }, [isSupported, checkAvailability]);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowPaymentPanel(true)}
        className={`pixel-button bg-gradient-to-r from-[#e94560] to-[#ff6b6b] px-4 py-2 text-sm text-white font-bold hover:from-[#ff6b6b] hover:to-[#e94560] transition-all ${className}`}
        title="快速支付"
      >
        <span className="mr-1">💳</span>
        快速支付
      </button>

      {showPaymentPanel && (
        <PaymentPanel
          isOpen={showPaymentPanel}
          onClose={() => setShowPaymentPanel(false)}
          onPaymentComplete={(result) => {
            onPaymentComplete?.(result);
            setShowPaymentPanel(false);
          }}
        />
      )}
    </>
  );
}

export default memo(QuickPaymentButton);
