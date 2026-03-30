"use client";

import { useEffect, useState, useCallback, memo } from 'react';
import { getRandomQuote } from '@/data/quotes';
import { Quote } from '@/types';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  paymentMethod?: string;
}

function ThankYouModal({
  isOpen,
  onClose,
  amount = 0,
  paymentMethod = '',
}: ThankYouModalProps) {
  const [quote, setQuote] = useState<Quote>({ text: '', category: 'funny' });
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 生成新的随机语录
      setQuote(getRandomQuote());

      // 延迟显示爱心动画
      setTimeout(() => setShowHearts(true), 300);

      // 5秒后自动关闭
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowHearts(false);
    setTimeout(() => onClose(), 200);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* 弹窗容器 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-[#d0d3b2] pixel-border max-w-md w-full animate-bounce-in">
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-[#3d3d3d] hover:text-[#a8cda2] transition-colors text-2xl pixel-button px-3 py-1"
          >
            ✕
          </button>

          {/* 内容 */}
          <div className="p-6 md:p-8 text-center">
            {/* 大标题 */}
            <h2 className="text-2xl md:text-3xl text-[#3d3d3d] mb-4 animate-glitter">
              感谢施舍！
            </h2>

            {/* 爱心动画 */}
            {showHearts && (
              <div className="text-4xl md:text-6xl mb-4 animate-heart-beat">
                ❤️
              </div>
            )}

            {/* 感谢语录 */}
            <p className="text-sm md:text-base text-[#5a5a5a] mb-6 leading-relaxed min-h-[60px] flex items-center justify-center">
              {quote.text}
            </p>

            {/* 施舍信息 */}
            {amount > 0 && (
              <div className="bg-[#ebf1d6] pixel-border p-4 mb-4">
                <p className="text-xs text-[#5a5a5a] mb-2">施舍金额</p>
                <p className="text-2xl md:text-3xl text-[#3d3d3d] font-bold">
                  ¥{amount.toFixed(2)}
                </p>
                <p className="text-xs text-[#5a5a5a] mt-2">
                  通过 {paymentMethod === 'wechat' ? '微信' : '支付宝'}
                </p>
              </div>
            )}

            {/* 确认按钮 */}
            <button
              onClick={handleClose}
              className="pixel-button bg-[#a8cda2] px-8 py-3 text-sm md:text-base text-[#3d3d3d] hover:bg-[#ebf1d6] transition-colors w-full"
            >
              太棒了！
            </button>

            {/* 底部小猫 */}
            <div className="mt-4 text-xs text-[#5a5a5a] animate-blink">
              ( =^･ω･^= ) 感谢您的慷慨
            </div>
          </div>
        </div>
      </div>

      {/* 飘落的爱心 */}
      {showHearts && <FloatingHearts />}
    </>
  );
}

// 使用display name以便调试
ThankYouModal.displayName = 'ThankYouModal';

export default ThankYouModal;

// 飘落爱心动画组件
const FloatingHearts = memo(function FloatingHearts() {
  const hearts = ['❤️', '💝', '💖', '💗', '💓'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((heart, index) => (
        <div
          key={index}
          className="absolute animate-float-heart text-2xl md:text-4xl"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-50px',
            animationDelay: `${index * 0.2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          {heart}
        </div>
      ))}
    </div>
  );
});
