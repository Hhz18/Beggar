"use client";

import { useEffect, useState, memo } from 'react';
import { getErrorLogs, clearErrorLogs } from '@/lib/errorHandling';

interface ErrorLogsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ErrorLogsPanel组件
 * 错误日志查看面板（仅开发环境）
 */
function ErrorLogsPanel({ isOpen, onClose }: ErrorLogsPanelProps) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLogs(getErrorLogs());
    }
  }, [isOpen]);

  const handleClear = () => {
    clearErrorLogs();
    setLogs([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* 面板 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-[#ebf1d6] pixel-border max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          {/* 标题 */}
          <div className="p-6 border-b-4 border-[#3d3d3d]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-[#3d3d3d] font-pixel">
                🐛 错误日志
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="pixel-button bg-red-300 px-4 py-2 text-xs hover:bg-red-400"
                >
                  清空日志
                </button>
                <button
                  onClick={onClose}
                  className="pixel-button bg-[#d0d3b2] px-4 py-2 hover:bg-[#a8cda2]"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* 日志列表 */}
          <div className="flex-1 overflow-y-auto p-6">
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-[#5a5a5a]">
                  ( =^･ω･^= ) 暂无错误日志
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="bg-[#d0d3b2] pixel-border p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-[#3d3d3d]">
                        {log.type || 'Error'}
                      </span>
                      <span className="text-xs text-[#5a5a5a]">
                        {new Date(log.timestamp).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-[#5a5a5a] mb-2">
                      {log.message}
                    </p>
                    {log.stack && (
                      <pre className="text-xs bg-[#ebf1d6] p-2 overflow-x-auto">
                        {log.stack}
                      </pre>
                    )}
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

export default memo(ErrorLogsPanel);
