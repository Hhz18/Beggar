/**
 * useShare Hook
 * Web Share API Hook
 */

import { useState, useCallback } from 'react';
import { shareEngine, ShareData, ShareResult } from '@/lib/share/shareEngine';

export interface UseShareResult {
  canShare: boolean;
  canShareFiles: boolean;
  isSharing: boolean;
  error: string | null;
  share: (data: ShareData) => Promise<ShareResult>;
  shareURL: (url: string, title?: string, text?: string) => Promise<ShareResult>;
  shareText: (text: string, title?: string) => Promise<ShareResult>;
  shareFiles: (files: File[], title?: string, text?: string) => Promise<ShareResult>;
  shareImage: (file: File, title?: string) => Promise<ShareResult>;
  shareToClipboard: (text: string) => Promise<ShareResult>;
  getSocialShareLinks: (url: string, title: string, description?: string) => Record<string, string>;
  generateQRCode: (url: string) => string;
  downloadImage: (url: string, filename?: string) => Promise<void>;
}

export function useShare(): UseShareResult {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShare = shareEngine.canShare();
  const canShareFiles = shareEngine.canShareFiles();

  const share = useCallback(async (data: ShareData): Promise<ShareResult> => {
    setIsSharing(true);
    setError(null);

    try {
      const result = await shareEngine.share(data);

      if (!result.success) {
        setError(result.error || 'Share failed');
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Share failed';
      setError(message);
      return {
        success: false,
        error: message,
      };
    } finally {
      setIsSharing(false);
    }
  }, []);

  const shareURL = useCallback(async (url: string, title?: string, text?: string): Promise<ShareResult> => {
    return share({ url, title, text });
  }, [share]);

  const shareText = useCallback(async (text: string, title?: string): Promise<ShareResult> => {
    return share({ text, title });
  }, [share]);

  const shareFiles = useCallback(async (files: File[], title?: string, text?: string): Promise<ShareResult> => {
    return share({ files, title, text });
  }, [share]);

  const shareImage = useCallback(async (file: File, title?: string): Promise<ShareResult> => {
    return share({ files: [file], title: title || '分享图片' });
  }, [share]);

  const shareToClipboard = useCallback(async (text: string): Promise<ShareResult> => {
    setIsSharing(true);
    setError(null);

    try {
      const result = await shareEngine.shareToClipboard(text);

      if (!result.success) {
        setError(result.error || 'Failed to copy to clipboard');
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to copy to clipboard';
      setError(message);
      return {
        success: false,
        error: message,
      };
    } finally {
      setIsSharing(false);
    }
  }, []);

  const getSocialShareLinks = useCallback((url: string, title: string, description?: string) => {
    return shareEngine.getSocialShareLinks(url, title, description);
  }, []);

  const generateQRCode = useCallback((url: string) => {
    return shareEngine.generateQRCode(url);
  }, []);

  const downloadImage = useCallback(async (url: string, filename?: string) => {
    await shareEngine.downloadImage(url, filename);
  }, []);

  return {
    canShare,
    canShareFiles,
    isSharing,
    error,
    share,
    shareURL,
    shareText,
    shareFiles,
    shareImage,
    shareToClipboard,
    getSocialShareLinks,
    generateQRCode,
    downloadImage,
  };
}
