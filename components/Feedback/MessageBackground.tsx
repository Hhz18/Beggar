"use client";

import { useEffect, useState } from 'react';
import { getMessages } from '@/lib/storage';
import { Message } from '@/types';

export default function MessageBackground() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 加载留言
    const loadMessages = () => {
      const allMessages = getMessages();
      // 只显示最近的20条留言，避免背景过于拥挤
      setMessages(allMessages.slice(0, 20));
    };

    loadMessages();

    // 监听存储变化（当有新留言时自动更新）
    const handleStorageChange = () => {
      loadMessages();
    };

    window.addEventListener('storage', handleStorageChange);
    // 使用自定义事件监听同页面内的留言变化
    window.addEventListener('messagesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('messagesUpdated', handleStorageChange);
    };
  }, []);

  if (messages.length === 0) return null;

  // 生成随机位置和旋转角度
  const getRandomPosition = (index: number) => {
    // 使用索引作为种子，确保每次渲染位置相同
    const seed = index * 137.508; // 黄金角度
    const top = ((seed * 7) % 80) + 10; // 10% - 90% 之间
    const left = ((seed * 13) % 80) + 10; // 10% - 90% 之间
    const rotation = ((seed * 3) % 30) - 15; // -15度 到 +15度
    const fontSize = 12 + ((seed * 5) % 6); // 12px - 18px

    return { top, left, rotation, fontSize };
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {messages.map((message, index) => {
        const { top, left, rotation, fontSize } = getRandomPosition(index);

        return (
          <div
            key={message.id}
            className="absolute transform opacity-20 hover:opacity-40 transition-opacity duration-300"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: `rotate(${rotation}deg)`,
              fontSize: `${fontSize}px`,
            }}
          >
            <div className="bg-[#d0d3b2] pixel-border px-3 py-2 max-w-xs">
              <p className="text-[#3d3d3d] font-bold mb-1">
                {message.nickname || '匿名'}
              </p>
              <p className="text-[#5a5a5a] leading-relaxed">
                {message.content}
              </p>
              <p className="text-xs text-[#5a5a5a] mt-1">
                ❤️ {message.likes}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
