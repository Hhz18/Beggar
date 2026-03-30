"use client";

import { useState, useMemo, memo } from 'react';
import { getMessages, deleteMessage } from '@/lib/storage';
import { getAllReactions, getMessageReactions } from '@/lib/reactions';

interface EnhancedMessageWallProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * EnhancedMessageWall组件
 * 增强的留言墙 - 搜索、过滤、排序
 */
function EnhancedMessageWall({ isOpen, onClose }: EnhancedMessageWallProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'likes'>('latest');
  const [filterBy, setFilterBy] = useState<'all' | 'has-amount'>('all');

  const messages = useMemo(() => {
    let filtered = getMessages();

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 条件过滤
    if (filterBy === 'has-amount') {
      filtered = filtered.filter(m => m.content.includes('¥'));
    }

    // 排序
    if (sortBy === 'latest') {
      filtered = filtered.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'popular') {
      filtered = filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'likes') {
      // 结合反应数和点赞数
      filtered = filtered.sort((a, b) => {
        const aReactions = Object.values(getMessageReactions(a.id)).reduce((sum, count) => sum + count, 0);
        const bReactions = Object.values(getMessageReactions(b.id)).reduce((sum, count) => sum + count, 0);
        return (b.likes + bReactions) - (a.likes + aReactions);
      });
    }

    return filtered;
  }, [searchQuery, sortBy, filterBy]);

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* 面板 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-[#ebf1d6] pixel-border max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          {/* 标题 */}
          <div className="p-6 border-b-4 border-[#3d3d3d]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-[#3d3d3d] font-pixel">
                📝 留言墙
              </h2>
              <button
                onClick={onClose}
                className="pixel-button bg-[#d0d3b2] px-4 py-2 hover:bg-[#a8cda2]"
              >
                ✕
              </button>
            </div>

            {/* 搜索和过滤 */}
            <div className="flex flex-wrap gap-3">
              {/* 搜索框 */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索留言..."
                className="flex-1 min-w-[200px] pixel-border px-3 py-2 text-sm bg-[#d0d3b2] text-[#3d3d3d] placeholder:text-[#5a5a5a]"
              />

              {/* 排序 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pixel-button bg-[#d0d3b2] px-3 py-2 text-sm"
              >
                <option value="latest">最新</option>
                <option value="popular">最热</option>
                <option value="likes">最多互动</option>
              </select>

              {/* 过滤 */}
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="pixel-button bg-[#d0d3b2] px-3 py-2 text-sm"
              >
                <option value="all">全部</option>
                <option value="has-amount">有金额</option>
              </select>
            </div>

            {/* 统计 */}
            <div className="flex gap-4 mt-3 text-xs text-[#5a5a5a]">
              <span>共 {messages.length} 条留言</span>
              {searchQuery && <span>找到 {messages.length} 条</span>}
            </div>
          </div>

          {/* 留言列表 */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-[#5a5a5a] mb-2">
                  {searchQuery ? '没有找到匹配的留言' : '还没有留言'}
                </p>
                <p className="text-xs text-[#5a5a5a]">
                  ( =^･ω･^= ) 来留下第一条留言吧！
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-[#d0d3b2] pixel-border p-4"
                  >
                    {/* 头部 */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">😺</span>
                        <div>
                          <p className="text-sm font-bold text-[#3d3d3d]">
                            {message.nickname}
                          </p>
                          <p className="text-xs text-[#5a5a5a]">
                            {message.date}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="pixel-button bg-red-200 px-2 py-1 text-xs hover:bg-red-300"
                      >
                        删除
                      </button>
                    </div>

                    {/* 内容 */}
                    <p className="text-sm text-[#3d3d3d] mb-3 leading-relaxed">
                      {message.content}
                    </p>

                    {/* 点赞数 */}
                    <div className="flex items-center gap-2 text-xs text-[#5a5a5a]">
                      <span>👍 {message.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(EnhancedMessageWall);
