"use client";

/**
 * SharePanel Component
 * 分享面板
 */

import { useState, memo, useEffect } from 'react';
import { useShare } from '@/hooks/useShare';
import ShareButton from './ShareButton';

interface SharePanelProps {
  isOpen: boolean;
  onClose: () => void;
  shareData?: {
    url?: string;
    title?: string;
    text?: string;
  };
}

function SharePanel({ isOpen, onClose, shareData }: SharePanelProps) {
  const {
    canShare,
    canShareFiles,
    isSharing,
    error,
    shareURL,
    shareToClipboard,
    getSocialShareLinks,
    generateQRCode,
  } = useShare();

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const defaultUrl = shareData?.url || (typeof window !== 'undefined' ? window.location.href : '');
  const defaultTitle = shareData?.title || '赛博乞讨站';
  const defaultText = shareData?.text || '一个赛博朋克风格的乞讨网站';

  const socialLinks = getSocialShareLinks(defaultUrl, defaultTitle, defaultText);
  const qrCodeUrl = generateQRCode(defaultUrl);

  const handleNativeShare = async () => {
    const result = await shareURL(defaultUrl, defaultTitle, defaultText);
    if (result.success) {
      onClose();
    }
  };

  const handleCopyLink = async () => {
    const result = await shareToClipboard(defaultUrl);
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openSocialShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-[#1a1a2e] pixel-border max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* 头部 */}
          <div className="bg-[#16213e] p-4 border-b-4 border-[#0f3460]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📤</span>
                <h2 className="text-xl text-[#e94560] font-pixel font-bold">分享</h2>
              </div>
              <button onClick={onClose} className="pixel-button bg-[#e94560] px-4 py-2 text-white">
                ✕
              </button>
            </div>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 原生分享 */}
            {canShare && (
              <div className="bg-[#16213e] pixel-border p-4">
                <h3 className="text-sm text-[#e94560] font-pixel mb-3">🚀 原生分享</h3>
                <ShareButton
                  canShare={canShare}
                  isSharing={isSharing}
                  onClick={handleNativeShare}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  使用系统原生分享功能
                </p>
              </div>
            )}

            {/* 复制链接 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">🔗 复制链接</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={defaultUrl}
                  readOnly
                  className="flex-1 pixel-border px-3 py-2 bg-[#0f3460] text-white text-sm font-pixel"
                />
                <button
                  onClick={handleCopyLink}
                  className="pixel-button bg-[#e94560] px-4 py-2 text-white text-sm font-bold hover:bg-[#ff6b6b] transition-colors"
                >
                  {copied ? '✓ 已复制' : '复制'}
                </button>
              </div>
            </div>

            {/* 社交媒体 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">💬 社交媒体</h3>
              <div className="grid grid-cols-4 gap-2">
                <SocialShareButton
                  icon="𝕏"
                  label="X"
                  onClick={() => openSocialShare(socialLinks.twitter)}
                />
                <SocialShareButton
                  icon="📘"
                  label="Facebook"
                  onClick={() => openSocialShare(socialLinks.facebook)}
                />
                <SocialShareButton
                  icon="💼"
                  label="LinkedIn"
                  onClick={() => openSocialShare(socialLinks.linkedin)}
                />
                <SocialShareButton
                  icon="💬"
                  label="WhatsApp"
                  onClick={() => openSocialShare(socialLinks.whatsapp)}
                />
                <SocialShareButton
                  icon="✈️"
                  label="Telegram"
                  onClick={() => openSocialShare(socialLinks.telegram)}
                />
                <SocialShareButton
                  icon="📱"
                  label="微博"
                  onClick={() => openSocialShare(socialLinks.weibo)}
                />
                <SocialShareButton
                  icon="🐧"
                  label="QQ"
                  onClick={() => openSocialShare(socialLinks.qq)}
                />
                <SocialShareButton
                  icon="🌟"
                  label="Qzone"
                  onClick={() => openSocialShare(socialLinks.qzone)}
                />
              </div>
            </div>

            {/* 二维码 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <h3 className="text-sm text-[#e94560] font-pixel mb-3">📱 二维码</h3>
              {!showQR ? (
                <button
                  onClick={() => setShowQR(true)}
                  className="w-full pixel-button bg-[#0f3460] px-4 py-2 text-white text-sm hover:bg-[#1a1a2e] transition-colors"
                >
                  生成二维码
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white pixel-border p-4 flex justify-center">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                  <button
                    onClick={() => setShowQR(false)}
                    className="w-full pixel-button bg-[#0f3460] px-4 py-2 text-white text-sm hover:bg-[#1a1a2e] transition-colors"
                  >
                    隐藏二维码
                  </button>
                </div>
              )}
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-900/50 pixel-border p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-sm text-red-400 font-pixel mb-1">分享失败</p>
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 功能说明 */}
            <div className="bg-[#16213e] pixel-border p-4">
              <div className="flex items-start gap-2">
                <span className="text-xl">ℹ️</span>
                <div>
                  <p className="text-sm text-[#e94560] font-pixel mb-1">关于分享</p>
                  <p className="text-xs text-gray-400">
                    使用原生分享功能可直接调用系统分享菜单，
                    支持分享到已安装的应用。如不支持，可使用社交媒体链接或复制链接。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SocialShareButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="pixel-button bg-[#0f3460] p-2 text-white hover:bg-[#1a1a2e] transition-colors flex flex-col items-center gap-1"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}

export default memo(SharePanel);
