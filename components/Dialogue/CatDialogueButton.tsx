"use client";

import { useState, memo } from 'react';
import CatDialoguePanel from './CatDialoguePanel';

interface CatDialogueButtonProps {
  className?: string;
}

/**
 * CatDialogueButton组件
 * 触发小猫对话的按钮
 */
function CatDialogueButton({ className = '' }: CatDialogueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`pixel-button bg-[#a8cda2] px-4 py-2 text-sm text-[#3d3d3d] hover:bg-[#ebf1d6] transition-colors flex items-center gap-2 ${className}`}
      >
        <span className="text-lg">💬</span>
        <span>和小猫聊天</span>
      </button>

      <CatDialoguePanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default memo(CatDialogueButton);
