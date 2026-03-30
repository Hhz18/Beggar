/**
 * Language Context
 * Provides language switching functionality to the app
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translationManager, Locale, LANGUAGES, LanguageInfo } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  languages: LanguageInfo[];
  t: (key: string, namespace?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function LanguageProvider({ children, defaultLocale = 'zh-CN' }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && LANGUAGES.some(lang => lang.code === savedLocale)) {
      setLocaleState(savedLocale);
      translationManager.setLocale(savedLocale);
    } else {
      // Detect browser language
      const browserLang = navigator.language as Locale;
      const supportedLocale = LANGUAGES.find(lang => lang.code === browserLang || lang.code.startsWith(browserLang.split('-')[0]));
      if (supportedLocale) {
        setLocaleState(supportedLocale.code);
        translationManager.setLocale(supportedLocale.code);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    translationManager.setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string, namespace: string = 'home') => {
    return translationManager.t(key, namespace as any);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, languages: LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
