"use client";

/**
 * App Providers
 * Combines all context providers for the application
 */

import { useEffect } from 'react';
import { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nContext';
import { setupGlobalErrorHandlers } from '@/lib/errorHandling';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Initialize global error handlers on mount
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  return (
    <I18nProvider initialLocale="zh-CN">
      {children}
    </I18nProvider>
  );
}
