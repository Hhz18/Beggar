/**
 * Dynamic Font Switcher Component
 * Applies appropriate fonts based on current language
 */

'use client';

import { useEffect, useRef } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Locale } from '@/lib/i18n';

// Font mappings for each locale - using pixel font as base with appropriate language fonts
const FONT_FAMILIES: Record<Locale, string> = {
  'zh-CN': "'Press Start 2P', 'Noto Sans SC', var(--font-noto-sans-sc), cursive, monospace",
  'en-US': "'Press Start 2P', cursive, monospace",
  'ja-JP': "'Press Start 2P', 'Noto Sans JP', var(--font-noto-sans-jp), cursive, monospace",
  'ko-KR': "'Press Start 2P', 'Noto Sans KR', var(--font-noto-sans-kr), cursive, monospace",
  'fr-FR': "'Press Start 2P', cursive, monospace",
  'es-ES': "'Press Start 2P', cursive, monospace",
  'de-DE': "'Press Start 2P', cursive, monospace",
  'pt-BR': "'Press Start 2P', cursive, monospace",
};

// Font size adjustments for different languages (CJK languages need larger fonts)
const FONT_SCALES: Record<Locale, number> = {
  'zh-CN': 1.0,
  'en-US': 0.85,
  'ja-JP': 1.0,
  'ko-KR': 1.0,
  'fr-FR': 0.85,
  'es-ES': 0.85,
  'de-DE': 0.85,
  'pt-BR': 0.85,
};

export default function FontSwitcher() {
  const { locale } = useI18n();
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const applyFonts = () => {
      const fontFamily = FONT_FAMILIES[locale] || FONT_FAMILIES['en-US'];
      const fontScale = FONT_SCALES[locale] || 1.0;

      // Apply to document root
      const root = document.documentElement;
      root.style.setProperty('--font-family', fontFamily);
      root.style.setProperty('--font-scale', fontScale.toString());

      // Apply to body with !important
      document.body.style.setProperty('font-family', fontFamily, 'important');
      document.body.style.fontSize = `${16 * fontScale}px`;

      // Apply to all text elements with broader selector
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const element = el as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        const currentFont = computedStyle.fontFamily;

        // Only update if it has the pixel font or no specific font set
        if (currentFont.includes('Press Start 2P') || currentFont.includes('monospace')) {
          element.style.setProperty('font-family', fontFamily, 'important');
        }
      });
    };

    // Apply fonts immediately
    applyFonts();

    // Set up MutationObserver to catch dynamically added elements
    if (typeof window !== 'undefined' && 'MutationObserver' in window) {
      observerRef.current = new MutationObserver((mutations) => {
        let shouldApply = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldApply = true;
          }
        });

        if (shouldApply) {
          // Small delay to let React finish rendering
          setTimeout(applyFonts, 0);
        }
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [locale]);

  return null; // This component doesn't render anything
}
