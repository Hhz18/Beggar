"use client";

import { useState } from 'react';

interface DonationInputProps {
  onSubmit: (amount: number) => void;
  paymentMethod?: string;
}

export default function DonationInput({ onSubmit, paymentMethod = '' }: DonationInputProps) {
  const [amount, setAmount] = useState('');
  const [showInput, setShowInput] = useState(false);

  // 预设金额
  const presetAmounts = [1, 5, 10, 20, 50, 100];

  const handleSubmit = (value: number) => {
    if (value > 0) {
      onSubmit(value);
      setAmount('');
      setShowInput(false);
    }
  };

  const handleCustomSubmit = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      handleSubmit(value);
    }
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="pixel-button bg-[#a8cda2] px-8 py-3 text-sm hover:bg-[#ebf1d6] transition-colors animate-glow w-full md:w-auto"
      >
        💰 我已施舍
      </button>
    );
  }

  return (
    <div className="bg-[#d0d3b2] pixel-border p-4 md:p-6 max-w-md mx-auto animate-bounce-in">
      <h3 className="text-center text-sm md:text-base text-[#3d3d3d] mb-3 md:mb-4">
        请输入施舍金额
      </h3>

      {/* 预设金额 */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            onClick={() => handleSubmit(preset)}
            className="pixel-button bg-[#ebf1d6] px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm hover:bg-[#a8cda2] transition-colors"
          >
            ¥{preset}
          </button>
        ))}
      </div>

      {/* 自定义金额输入 */}
      <div className="mb-3 md:mb-4">
        <label className="block text-xs text-[#5a5a5a] mb-2">
          或输入自定义金额
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d3d3d] text-sm">
              ¥
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 md:py-3 bg-[#ebf1d6] pixel-border text-[#3d3d3d] text-sm focus:outline-none focus:bg-[#a8cda2]"
              min="0"
              step="0.01"
            />
          </div>
          <button
            onClick={handleCustomSubmit}
            className="pixel-button bg-[#a8cda2] px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm hover:bg-[#ebf1d6] transition-colors"
          >
            确认
          </button>
        </div>
      </div>

      {/* 取消按钮 */}
      <button
        onClick={() => setShowInput(false)}
        className="w-full text-xs text-[#5a5a5a] hover:text-[#3d3d3d] transition-colors"
      >
        取消
      </button>
    </div>
  );
}
