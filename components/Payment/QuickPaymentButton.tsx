"use client";

/**
 * QuickPaymentButton Component
 * 快速支付入口按钮
 */

import { memo, useState } from 'react';

interface QuickPaymentButtonProps {
  onPaymentComplete?: (result: any) => void;
  className?: string;
}

function QuickPaymentButton({ onPaymentComplete, className = '' }: QuickPaymentButtonProps) {
  return (
    <button
      onClick={() => onPaymentComplete?.({ method: 'quick', status: 'initiated' })}
      className={`pixel-button bg-gradient-to-r from-[#e94560] to-[#ff6b6b] px-4 py-2 text-sm text-white font-bold hover:from-[#ff6b6b] hover:to-[#e94560] transition-all ${className}`}
      title="快速支付"
    >
      <span className="mr-1">💳</span>
      快速支付
    </button>
  );
}

export default memo(QuickPaymentButton);
