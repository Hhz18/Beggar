/**
 * Web Share Engine
 * Web Share API 原生分享引擎
 * Native Share System
 */

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export interface ShareResult {
  success: boolean;
  method?: string;
  error?: string;
}

export interface ShareTargetData {
  title?: string;
  text?: string;
  url?: string;
  files?: FileList;
}

/**
 * ShareEngine
 * 分享引擎
 */
class ShareEngine {
  /**
   * 检查Web Share API支持
   */
  canShare(): boolean {
    return typeof window !== 'undefined' && 'share' in navigator;
  }

  /**
   * 检查文件分享支持
   */
  canShareFiles(): boolean {
    return typeof window !== 'undefined' &&
           'share' in navigator &&
           'canShare' in navigator;
  }

  /**
   * 检查是否能分享特定内容
   */
  async canShareContent(data: ShareData): Promise<boolean> {
    if (!this.canShare()) return false;

    try {
      if ('canShare' in navigator) {
        return await (navigator as any).canShare(data);
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 分享内容
   */
  async share(data: ShareData): Promise<ShareResult> {
    if (!this.canShare()) {
      return {
        success: false,
        error: 'Web Share API not supported',
      };
    }

    try {
      // 验证分享内容
      const canShare = await this.canShareContent(data);
      if (!canShare) {
        return {
          success: false,
          error: 'Content cannot be shared',
        };
      }

      // 执行分享
      await navigator.share(data);

      return {
        success: true,
        method: 'native',
      };
    } catch (error) {
      if (error instanceof Error) {
        // 用户取消分享
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Share cancelled by user',
          };
        }

        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: 'Unknown error',
      };
    }
  }

  /**
   * 分享URL
   */
  async shareURL(url: string, title?: string, text?: string): Promise<ShareResult> {
    return this.share({
      url,
      title,
      text,
    });
  }

  /**
   * 分享文本
   */
  async shareText(text: string, title?: string): Promise<ShareResult> {
    return this.share({
      text,
      title,
    });
  }

  /**
   * 分享文件
   */
  async shareFiles(files: File[], title?: string, text?: string): Promise<ShareResult> {
    if (!this.canShareFiles()) {
      return {
        success: false,
        error: 'File sharing not supported',
      };
    }

    return this.share({
      files,
      title,
      text,
    });
  }

  /**
   * 分享图片
   */
  async shareImage(file: File, title?: string): Promise<ShareResult> {
    return this.shareFiles([file], title || '分享图片');
  }

  /**
   * 分享到剪贴板
   */
  async shareToClipboard(text: string): Promise<ShareResult> {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      return {
        success: false,
        error: 'Clipboard API not supported',
      };
    }

    try {
      await navigator.clipboard.writeText(text);

      return {
        success: true,
        method: 'clipboard',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to copy to clipboard',
      };
    }
  }

  /**
   * 分享到社交媒体（直接链接）
   */
  getSocialShareLinks(url: string, title: string, description?: string) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || '');

    return {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
      qq: `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}`,
      qzone: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodedUrl}&title=${encodedTitle}`,
    };
  }

  /**
   * 生成二维码
   */
  generateQRCode(url: string): string {
    // 使用第三方API生成二维码
    const encodedUrl = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
  }

  /**
   * 下载图片
   */
  async downloadImage(url: string, filename?: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || `share-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }

  /**
   * 检测是否为Share Target接收
   */
  isShareTarget(): boolean {
    if (typeof window === 'undefined') return false;

    const url = new URL(window.location.href);
    return url.searchParams.has('share-target');
  }

  /**
   * 解析Share Target数据
   */
  parseShareTargetData(): ShareTargetData | null {
    if (typeof window === 'undefined') return null;

    const url = new URL(window.location.href);
    const title = url.searchParams.get('title') || undefined;
    const text = url.searchParams.get('text') || undefined;
    const link = url.searchParams.get('url') || undefined;

    // 文件分享通过POST请求，需要在服务端处理
    // 这里只处理URL参数

    if (title || text || link) {
      return {
        title,
        text,
        url: link,
      };
    }

    return null;
  }
}

// 导出单例
export const shareEngine = new ShareEngine();
