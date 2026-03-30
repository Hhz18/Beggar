"use client";

/**
 * Language Switcher Component
 * Pixel-art styled language selector with country flags
 */

import { memo, useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { LANGUAGES, Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons';
}

function LanguageSwitcher({ className = '', variant = 'dropdown' }: LanguageSwitcherProps) {
  const { locale, changeLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    changeLocale(newLocale);
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-lg
              transition-all duration-200
              ${locale === lang.code
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
              }
              backdrop-blur-sm
              border border-white/20
              hover:border-white/40
            `}
            title={lang.name}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm font-medium hidden sm:inline">{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          inline-flex items-center gap-2 px-4 py-2
          bg-white/10 backdrop-blur-sm
          border border-white/20 rounded-lg
          text-white hover:bg-white/20
          transition-all duration-200
          hover:border-white/40 hover:scale-105
          shadow-lg
        "
      >
        <span className="text-2xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.nativeName}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="
            absolute top-full mt-2 right-0
            bg-black/90 backdrop-blur-xl
            border border-white/20 rounded-xl
            shadow-2xl
            overflow-hidden
            z-50
            min-w-[200px]
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          <div className="py-2 max-h-[400px] overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full px-4 py-3
                  flex items-center gap-3
                  transition-all duration-150
                  hover:bg-white/10
                  ${locale === lang.code ? 'bg-white/20' : ''}
                `}
              >
                <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium text-white truncate">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-white/60 truncate">
                    {lang.name}
                  </span>
                </div>
                {locale === lang.code && (
                  <svg
                    className="w-5 h-5 text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(LanguageSwitcher);
