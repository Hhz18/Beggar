"use client";

import { useState, useEffect } from 'react';
import { getCustomQuotes, saveCustomQuote, deleteCustomQuote } from '@/lib/storage';
import { CustomQuote } from '@/types';
import { Quote } from '@/types';

interface CustomQuoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomQuoteEditor({ isOpen, onClose }: CustomQuoteEditorProps) {
  const [customQuotes, setCustomQuotes] = useState<CustomQuote[]>([]);
  const [newQuote, setNewQuote] = useState('');
  const [category, setCategory] = useState<Quote['category']>('funny');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCustomQuotes();
    }
  }, [isOpen]);

  const loadCustomQuotes = () => {
    const quotes = getCustomQuotes();
    setCustomQuotes(quotes.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuote.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟提交延迟
      saveCustomQuote({
        text: newQuote.trim(),
        category,
      });

      setNewQuote('');
      setCategory('funny');
      loadCustomQuotes();
    } catch (error) {
      console.error('Failed to save custom quote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (quoteId: string) => {
    if (confirm('确定要删除这个自定义语录吗？')) {
      deleteCustomQuote(quoteId);
      loadCustomQuotes();
    }
  };

  const categoryLabels: Record<Quote['category'], string> = {
    funny: '😂 搞笑',
    touching: '😢 感人',
    cute: '🐱 可爱',
    philosophical: '🤔 哲理',
  };

  const categoryColors: Record<Quote['category'], string> = {
    funny: 'bg-yellow-100',
    touching: 'bg-blue-100',
    cute: 'bg-pink-100',
    philosophical: 'bg-purple-100',
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
                ✨ 自定义感谢语录
              </h2>
              <button
                onClick={onClose}
                className="text-[#3d3d3d] hover:text-[#a8cda2] transition-colors text-xl pixel-button px-3 py-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#5a5a5a] mt-2">
              创建你自己的感谢语录，它们会在施舍后随机显示
            </p>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {/* 添加新语录表单 */}
            <form onSubmit={handleSubmit} className="mb-6 bg-[#ebf1d6] pixel-border p-4">
              <h3 className="text-sm font-bold text-[#3d3d3d] mb-3">添加新语录</h3>

              <textarea
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                placeholder="输入你的感谢语录..."
                rows={3}
                maxLength={100}
                className="w-full px-4 py-2 pixel-border bg-white text-[#3d3d3d] text-sm placeholder-[#5a5a5a] focus:outline-none focus:ring-2 focus:ring-[#a8cda2] resize-none mb-3"
              />

              <div className="mb-3">
                <label className="text-xs text-[#5a5a5a] mb-2 block">选择分类</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(Object.keys(categoryLabels) as Quote['category'][]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`pixel-button text-xs px-3 py-2 transition-colors ${
                        category === cat
                          ? 'bg-[#a8cda2] text-[#3d3d3d]'
                          : 'bg-white text-[#5a5a5a] hover:bg-[#ebf1d6]'
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5a5a5a]">
                  {newQuote.length}/100
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuote.trim()}
                  className="pixel-button bg-[#a8cda2] px-6 py-2 text-sm text-[#3d3d3d] hover:bg-[#ebf1d6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '保存中...' : '保存语录'}
                </button>
              </div>
            </form>

            {/* 现有自定义语录列表 */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#3d3d3d] mb-3">
                我的语录 ({customQuotes.length})
              </h3>

              {customQuotes.length === 0 ? (
                <div className="text-center py-8 bg-[#ebf1d6] pixel-border">
                  <p className="text-[#5a5a5a] text-sm mb-2">还没有自定义语录</p>
                  <p className="text-[#5a5a5a] text-xs">添加一个吧！( =^･ω･^= )</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className={`pixel-border p-4 ${categoryColors[quote.category]}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-bold text-[#3d3d3d] px-2 py-1 bg-white/50 rounded">
                          {categoryLabels[quote.category]}
                        </span>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="text-xs text-[#5a5a5a] hover:text-red-500 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                      <p className="text-sm text-[#3d3d3d] leading-relaxed">
                        {quote.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 底部说明 */}
          <div className="p-4 border-t-4 border-[#3d3d3d] bg-[#ebf1d6]">
            <p className="text-xs text-[#5a5a5a] text-center">
              💡 提示：自定义语录会与系统语录一起随机显示
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
