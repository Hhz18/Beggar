"use client";

import { useState, useEffect } from 'react';
import { getMessages, saveMessage, likeMessage, deleteMessage } from '@/lib/storage';
import { Message } from '@/types';

interface MessageWallProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageWall({ isOpen, onClose }: MessageWallProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = () => {
    const allMessages = getMessages();
    // 按时间倒序排列，最新的在前
    setMessages(allMessages.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !nickname.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟提交延迟
      saveMessage({
        content: newMessage.trim(),
        nickname: nickname.trim(),
      });

      setNewMessage('');
      loadMessages();

      // 触发自定义事件，通知背景留言更新
      window.dispatchEvent(new Event('messagesUpdated'));
    } catch (error) {
      console.error('Failed to submit message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (messageId: string) => {
    likeMessage(messageId);
    loadMessages();
  };

  const handleDelete = (messageId: string) => {
    if (confirm('确定要删除这条留言吗？')) {
      deleteMessage(messageId);
      loadMessages();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) { // 1分钟内
      return '刚刚';
    } else if (diff < 3600000) { // 1小时内
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) { // 24小时内
      return `${Math.floor(diff / 3600000)}小时前`;
    } else if (diff < 604800000) { // 7天内
      return `${Math.floor(diff / 86400000)}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 弹窗容器 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-[#d0d3b2] pixel-border max-w-2xl w-full max-h-[80vh] overflow-hidden animate-bounce-in flex flex-col">
          {/* 标题栏 */}
          <div className="p-4 md:p-6 border-b-4 border-[#3d3d3d]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl text-[#3d3d3d]">
                📝 施舍者留言墙
              </h2>
              <button
                onClick={onClose}
                className="text-[#3d3d3d] hover:text-[#a8cda2] transition-colors text-xl pixel-button px-3 py-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* 留言列表 */}
            <div className="space-y-4 mb-6">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#5a5a5a] text-sm mb-2">还没有留言</p>
                  <p className="text-[#5a5a5a] text-xs">成为第一个留言的人吧！( =^･ω･^= )</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-[#ebf1d6] pixel-border p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#3d3d3d]">
                          {message.nickname || '匿名'}
                        </span>
                        <span className="text-xs text-[#5a5a5a]">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-xs text-[#5a5a5a] hover:text-red-500 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                    <p className="text-sm text-[#3d3d3d] mb-3 leading-relaxed">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(message.id)}
                        className="flex items-center gap-1 text-xs text-[#5a5a5a] hover:text-[#a8cda2] transition-colors"
                      >
                        <span className="text-sm">❤️</span>
                        <span>{message.likes}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="p-4 md:p-6 border-t-4 border-[#3d3d3d] bg-[#ebf1d6]">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="你的昵称（选填）"
                maxLength={20}
                className="w-full px-4 py-2 pixel-border bg-white text-[#3d3d3d] text-sm placeholder-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#a8cda2]"
              />
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="写下你的留言吧..."
                rows={3}
                maxLength={200}
                className="w-full px-4 py-2 pixel-border bg-white text-[#3d3d3d] text-sm placeholder-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#a8cda2] resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5a5a5a]">
                  {newMessage.length}/200
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !newMessage.trim()}
                  className="pixel-button bg-[#a8cda2] px-6 py-2 text-sm text-[#3d3d3d] hover:bg-[#ebf1d6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '提交中...' : '发布留言'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
