"use client";

import { memo } from 'react';
import { keyboardShortcutManager, formatShortcut } from '@/lib/keyboardShortcuts';

interface ShortcutHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ShortcutHelp组件
 * 快捷键帮助面板
 */
function ShortcutHelp({ isOpen, onClose }: ShortcutHelpProps) {
  if (!isOpen) return null;

  const shortcuts = keyboardShortcutManager.getAllShortcuts();
  const categories = {
    navigation: '导航',
    action: '操作',
    toggle: '切换',
    special: '特殊',
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* 面板 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-[#ebf1d6] pixel-border max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          {/* 标题 */}
          <div className="p-6 border-b-4 border-[#3d3d3d]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-[#3d3d3d] font-pixel">
                ⌨️ 快捷键
              </h2>
              <button
                onClick={onClose}
                className="pixel-button bg-[#d0d3b2] px-4 py-2 hover:bg-[#a8cda2]"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 快捷键列表 */}
          <div className="flex-1 overflow-y-auto p-6">
            {Object.entries(categories).map(([key, label]) => {
              const categoryShortcuts = shortcuts.filter(s => s.category === key);
              if (categoryShortcuts.length === 0) return null;

              return (
                <div key={key} className="mb-6">
                  <h3 className="text-lg font-bold text-[#3d3d3d] mb-3">
                    {label}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#d0d3b2] pixel-border p-3"
                      >
                        <span className="text-sm text-[#5a5a5a]">
                          {shortcut.description}
                        </span>
                        <kbd className="pixel-button bg-[#ebf1d6] px-3 py-1 text-xs text-[#3d3d3d]">
                          {formatShortcut(shortcut)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部提示 */}
          <div className="p-4 border-t-4 border-[#3d3d3d] text-center">
            <p className="text-xs text-[#5a5a5a]">
              按 <kbd className="pixel-button bg-[#d0d3b2] px-2 py-1 text-xs">?</kbd> 键随时打开此帮助
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ShortcutHelp);
