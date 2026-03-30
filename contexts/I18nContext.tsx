"use client";

/**
 * I18n Context Provider
 * Provides internationalization context to the application
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translationManager, Locale, Namespace } from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  changeLocale: (locale: Locale) => void;
  t: (key: string, namespace?: Namespace, values?: Record<string, string | number>) => string;
  formatDate: (date: Date, locale?: Locale) => string;
  formatNumber: (num: number, locale?: Locale) => string;
  formatCurrency: (amount: number, currency?: string, locale?: Locale) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale = 'zh-CN' }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Try to get locale from localStorage after mounting
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && translationManager.getAvailableLocales().includes(saved)) {
      translationManager.setLocale(saved);
      setLocale(saved);
    } else {
      translationManager.setLocale(initialLocale);
    }
  }, [initialLocale]);

  const changeLocale = useCallback((newLocale: Locale) => {
    translationManager.setLocale(newLocale);
    setLocale(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      // Dispatch event for non-react components
      window.dispatchEvent(new CustomEvent('localechange', { detail: { locale: newLocale } }));
    }
  }, []);

  const t = useCallback((
    key: string,
    namespace?: Namespace,
    values?: Record<string, string | number>
  ) => {
    if (values) {
      return translationManager.interpolate(key, values, namespace, locale);
    }
    return translationManager.t(key, namespace, locale);
  }, [locale]);

  const formatDate = useCallback((date: Date, localeOverride?: Locale) => {
    return translationManager.formatDate(date, localeOverride || locale);
  }, [locale]);

  const formatNumber = useCallback((num: number, localeOverride?: Locale) => {
    return translationManager.formatNumber(num, localeOverride || locale);
  }, [locale]);

  const formatCurrency = useCallback((
    amount: number,
    currency: string = 'USD',
    localeOverride?: Locale
  ) => {
    return translationManager.formatCurrency(amount, currency, localeOverride || locale);
  }, [locale]);

  const value: I18nContextType = {
    locale,
    changeLocale,
    t,
    formatDate,
    formatNumber,
    formatCurrency,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
