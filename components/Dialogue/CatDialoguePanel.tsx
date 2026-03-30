"use client";

import { useState, useEffect, memo } from 'react';
import { useCatDialogue } from '@/lib/catDialogue';
import { CatEmotion } from '@/types';

interface CatDialoguePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEmotionChange?: (emotion: CatEmotion) => void;
}

/**
 * CatDialoguePanel组件
 * 小猫对话面板
 */
function CatDialoguePanel({ isOpen, onClose, onEmotionChange }: CatDialoguePanelProps) {
  const { currentNode, history, startDialogue, selectOption, freeChat, clearHistory } = useCatDialogue();
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startDialogue('greeting');
    }
  }, [isOpen, startDialogue]);

  useEffect(() => {
    if (currentNode?.emotion && onEmotionChange) {
      onEmotionChange(currentNode.emotion);
    }
  }, [currentNode, onEmotionChange]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    freeChat(userInput);
    setUserInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
        <div className="bg-[#ebf1d6] pixel-border shadow-xl flex flex-col max-h-[60vh]">
          {/* Header */}
          <div className="bg-[#a8cda2] p-4 border-b-4 border-[#3d3d3d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <h3 className="text-lg text-[#3d3d3d] font-pixel font-bold">
                  和小猫聊天
                </h3>
              </div>
              <button
                onClick={onClose}
                className="pixel-button bg-[#d0d3b2] px-3 py-1 hover:bg-[#a8cda2]"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.map((msg, index) => (
              <MessageBubble
                key={index}
                role={msg.role}
                text={msg.text}
              />
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#d0d3b2] pixel-border px-3 py-2 max-w-[80%]">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          {currentNode?.options && currentNode.options.length > 0 && (
            <div className="border-t-4 border-[#3d3d3d] p-3 bg-[#d0d3b2]">
              <div className="space-y-2">
                {currentNode.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectOption(index)}
                    className="w-full pixel-button bg-[#a8cda2] px-4 py-2 text-sm text-[#3d3d3d] hover:bg-[#ebf1d6] transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t-4 border-[#3d3d3d] p-3 bg-[#d0d3b2]">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="和小猫说点什么... ( =^･ω･^= )"
                className="flex-1 pixel-border px-3 py-2 text-sm bg-[#ebf1d6] text-[#3d3d3d] placeholder:text-[#5a5a5a]"
                maxLength={100}
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                className="pixel-button bg-[#a8cda2] px-4 py-2 text-sm text-[#3d3d3d] hover:bg-[#ebf1d6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ role, text }: { role: 'cat' | 'user'; text: string }) {
  const isCat = role === 'cat';

  return (
    <div className={`flex ${isCat ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`${
          isCat
            ? 'bg-[#d0d3b2] text-[#3d3d3d]'
            : 'bg-[#a8cda2] text-white'
        } pixel-border px-3 py-2 max-w-[80%] text-sm`}
      >
        {isCat && (
          <span className="text-lg mr-1" role="img" aria-label="小猫">
            🐱
          </span>
        )}
        {text}
      </div>
    </div>
  );
}

export default memo(CatDialoguePanel);
