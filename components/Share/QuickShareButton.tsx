"use client";

/**
 * QuickShareButton Component
 * 快速分享按钮
 */

import { memo, useState } from 'react';
import { useShare } from '@/hooks/useShare';
import SharePanel from './SharePanel';

interface QuickShareButtonProps {
  shareData?: {
    url?: string;
    title?: string;
    text?: string;
  };
  className?: string;
}

function QuickShareButton({ shareData, className = '' }: QuickShareButtonProps) {
  const [showSharePanel, setShowSharePanel] = useState(false);
  const { canShare, shareURL } = useShare();

  const handleQuickShare = async () => {
    if (canShare) {
      const url = shareData?.url || (typeof window !== 'undefined' ? window.location.href : '');
      const title = shareData?.title || '赛博乞讨站';
      const text = shareData?.text || '一个赛博朋克风格的乞讨网站';

      const result = await shareURL(url, title, text);
      if (result.success) {
        return;
      }
    }

    // 如果原生分享失败或不可用，显示分享面板
    setShowSharePanel(true);
  };

  return (
    <>
      <button
        onClick={handleQuickShare}
        className={`pixel-button bg-gradient-to-r from-[#e94560] to-[#ff6b6b] px-4 py-2 text-sm text-white font-bold hover:from-[#ff6b6b] hover:to-[#e94560] transition-all ${className}`}
      >
        📤 分享
      </button>

      {showSharePanel && (
        <SharePanel
          isOpen={showSharePanel}
          onClose={() => setShowSharePanel(false)}
          shareData={shareData}
        />
      )}
    </>
  );
}

export default memo(QuickShareButton);
