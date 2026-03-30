"use client";

/**
 * VoiceCommandPanel Component
 * 语音命令面板
 */

import { useState, memo } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from '@/hooks';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

interface VoiceCommandPanelProps {
  onClose: () => void;
}

function VoiceCommandPanel({ onClose }: VoiceCommandPanelProps) {
  const { isListening, isSupported, finalTranscript, error, startListening, stopListening } = useSpeechRecognition({
    lang: 'zh-CN',
    continuous: true,
    interimResults: true,
  });

  const { speak, isSpeaking } = useSpeechSynthesis();
  const [response, setResponse] = useState('');

  // 定义语音命令
  const commands = [
    {
      pattern: /(?:谢谢|感谢|thank you)/i,
      action: () => {
        const message = '不客气！感谢您的支持！';
        setResponse(message);
        speak(message, { lang: 'zh-CN', rate: 1.0 });
      },
      description: '感谢回复',
    },
    {
      pattern: /(?:你好|嗨|hi|hello)/i,
      action: () => {
        const message = '你好！欢迎来到赛博乞讨站！';
        setResponse(message);
        speak(message, { lang: 'zh-CN', rate: 1.0 });
      },
      description: '问候回复',
    },
    {
      pattern: /(?:多少钱|费用|how much)/i,
      action: () => {
        const message = '您可以自由选择施舍金额，任何支持我们都感激不尽！';
        setResponse(message);
        speak(message, { lang: 'zh-CN', rate: 1.0 });
      },
      description: '金额询问',
    },
    {
      pattern: /(?:再见|拜拜|bye|goodbye)/i,
      action: () => {
        const message = '再见！期待您的下次光临！';
        setResponse(message);
        speak(message, { lang: 'zh-CN', rate: 1.0 });
      },
      description: '告别回复',
    },
  ];

  useVoiceCommand(commands, isListening);

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] pixel-border p-6 max-w-md">
          <h2 className="text-xl text-[#e94560] font-pixel mb-4">❌ 不支持语音识别</h2>
          <p className="text-sm text-gray-400 mb-4">您的浏览器不支持Web Speech API，请使用Chrome或其他现代浏览器。</p>
          <button onClick={onClose} className="pixel-button bg-[#e94560] px-4 py-2 text-white w-full">
            关闭
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a2e] pixel-border max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="bg-[#16213e] p-4 border-b-4 border-[#0f3460]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎤</span>
              <h2 className="text-xl text-[#e94560] font-pixel font-bold">语音命令</h2>
            </div>
            <button onClick={onClose} className="pixel-button bg-[#e94560] px-4 py-2 text-white">
              ✕
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 控制按钮 */}
          <div className="flex gap-2">
            {!isListening ? (
              <button
                onClick={() => startListening()}
                className="flex-1 pixel-button bg-[#e94560] px-6 py-3 text-white font-bold hover:bg-[#ff6b6b] transition-colors"
              >
                🎙️ 开始监听
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex-1 pixel-button bg-[#e94560] px-6 py-3 text-white font-bold hover:bg-[#ff6b6b] transition-colors"
              >
                ⏹️ 停止监听
              </button>
            )}
          </div>

          {/* 识别状态 */}
          <div className="bg-[#16213e] pixel-border p-4">
            <h3 className="text-sm text-[#e94560] font-pixel mb-3">📝 识别结果</h3>
            {finalTranscript ? (
              <div className="bg-[#0f3460] pixel-border p-3">
                <p className="text-sm text-white font-pixel">{finalTranscript}</p>
              </div>
            ) : (
              <div className="bg-[#0f3460] pixel-border p-3">
                <p className="text-sm text-gray-500 font-pixel">等待语音输入...</p>
              </div>
            )}
          </div>

          {/* 语音回复 */}
          {response && (
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">🔊 语音回复</h3>
              <div className="bg-[#0f3460] pixel-border p-3">
                <p className="text-sm text-white font-pixel">{response}</p>
                {isSpeaking && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-[#e94560] animate-pulse"
                          style={{
                            height: `${8 + Math.random() * 16}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#e94560] font-pixel">播放中...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 可用命令 */}
          <div className="bg-[#16213e] pixel-border p-4">
            <h3 className="text-sm text-[#e94560] font-pixel mb-3">📋 可用命令</h3>
            <div className="space-y-2">
              {commands.map((cmd, i) => (
                <div key={i} className="bg-[#0f3460] pixel-border p-3">
                  <p className="text-sm text-white font-pixel">{cmd.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(VoiceCommandPanel);
