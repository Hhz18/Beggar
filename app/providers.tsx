"use client";

/**
 * App Providers
 * Combines all context providers for the application
 */

import { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider initialLocale="zh-CN">
      {children}
    </I18nProvider>
  );
}
