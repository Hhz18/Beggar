"use client";

/**
 * PaymentPanel Component
 * Payment Request支付面板
 */

import { useState, memo, useEffect } from 'react';
import { usePaymentRequest } from '@/hooks/usePaymentRequest';
import PaymentButton from './PaymentButton';

interface PaymentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: (result: any) => void;
  defaultAmount?: number;
}

function PaymentPanel({
  isOpen,
  onClose,
  onPaymentComplete,
  defaultAmount = 10
}: PaymentPanelProps) {
  const {
    isSupported,
    canMakePayment,
    isChecking,
    isProcessing,
    error,
    checkAvailability,
    initiatePayment,
    formatAmount,
  } = usePaymentRequest();

  const [amount, setAmount] = useState(defaultAmount);
  const [presetAmounts] = useState([1, 5, 10, 20, 50, 100]);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen && isSupported) {
      checkAvailability();
    }
  }, [isOpen, isSupported, checkAvailability]);

  const handlePayment = async () => {
    const result = await initiatePayment(amount);

    if (result) {
      setPaymentResult(result);
      onPaymentComplete?.(result);

      // 3秒后关闭
      setTimeout(() => {
        onClose();
        setPaymentResult(null);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-[#1a1a2e] pixel-border max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* 头部 */}
          <div className="bg-[#16213e] p-4 border-b-4 border-[#0f3460]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <h2 className="text-xl text-[#e94560] font-pixel font-bold">快速支付</h2>
              </div>
              <button onClick={onClose} className="pixel-button bg-[#e94560] px-4 py-2 text-white">
                ✕
              </button>
            </div>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 支付说明 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-2">🚀 原生支付</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                使用浏览器原生支付功能，支持已保存的银行卡、支付宝、微信支付等支付方式。
                支付过程安全、快速、便捷。
              </p>
            </div>

            {/* 支持状态 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">📋 支付状态</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">API支持</span>
                  <span className={`text-xs font-pixel ${isSupported ? 'text-green-400' : 'text-red-400'}`}>
                    {isSupported ? '✓ 支持' : '✗ 不支持'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">可用支付方式</span>
                  <span className={`text-xs font-pixel ${canMakePayment ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isChecking ? '检测中...' : canMakePayment ? '✓ 已配置' : '✗ 未配置'}
                  </span>
                </div>
              </div>
            </div>

            {/* 金额选择 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">💰 选择金额</h3>

              {/* 预设金额 */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`pixel-button py-2 text-sm font-bold transition-all ${
                      amount === preset
                        ? 'bg-[#e94560] text-white'
                        : 'bg-[#0f3460] text-gray-400 hover:bg-[#1a1a2e]'
                    }`}
                  >
                    {formatAmount(preset)}
                  </button>
                ))}
              </div>

              {/* 自定义金额 */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="1"
                  max="1000000"
                  step="1"
                  className="flex-1 pixel-border px-3 py-2 bg-[#0f3460] text-white font-pixel text-sm"
                  placeholder="自定义金额"
                />
                <span className="text-xs text-gray-400 font-pixel">元</span>
              </div>
            </div>

            {/* 支付按钮 */}
            {isSupported && (
              <div className="bg-[#16213e] pixel-border p-4">
                <PaymentButton
                  isSupported={isSupported}
                  canMakePayment={canMakePayment}
                  isProcessing={isProcessing}
                  onClick={handlePayment}
                  amount={amount}
                  className="w-full"
                />
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-900/50 pixel-border p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-sm text-red-400 font-pixel mb-1">支付错误</p>
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 支付成功 */}
            {paymentResult && (
              <div
                className="bg-green-900/50 pixel-border p-4"
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-sm text-green-400 font-pixel mb-1">支付成功</p>
                    <p className="text-xs text-green-300">感谢您的慷慨施舍！</p>
                    {paymentResult.payerName && (
                      <p className="text-xs text-gray-400 mt-2">支付人: {paymentResult.payerName}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 支付方式说明 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">📖 支付方式</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💳</span>
                  <span className="text-gray-400">银行卡</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔵</span>
                  <span className="text-gray-400">支付宝</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💚</span>
                  <span className="text-gray-400">微信支付</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍎</span>
                  <span className="text-gray-400">Apple Pay</span>
                </div>
              </div>
            </div>

            {/* 安全提示 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <div className="flex items-start gap-2">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="text-sm text-[#e94560] font-pixel mb-1">安全保障</p>
                  <p className="text-xs text-gray-400">
                    使用浏览器原生支付API，支付过程由浏览器和支付平台保障安全。
                    您的支付信息不会存储在我们的服务器上。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(PaymentPanel);
