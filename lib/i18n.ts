/**
 * 国际化（i18n）系统 - 简化版
 * Internationalization System (Simplified)
 */

export type Locale = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR' | 'fr-FR' | 'es-ES' | 'de-DE' | 'pt-BR';
export type Namespace = 'common' | 'home' | 'donation';

export interface LanguageInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  flagEmoji: string;
}

/**
 * 支持的语言列表
 */
export const LANGUAGES: LanguageInfo[] = [
  {
    code: 'zh-CN',
    name: 'Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
    flagEmoji: '🇨🇳',
  },
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    flagEmoji: '🇺🇸',
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    flagEmoji: '🇯🇵',
  },
  {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    flagEmoji: '🇰🇷',
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    flagEmoji: '🇫🇷',
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    flagEmoji: '🇪🇸',
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    flagEmoji: '🇩🇪',
  },
  {
    code: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    flagEmoji: '🇧🇷',
  },
];

export interface TranslationResources {
  [key: string]: string | TranslationResources;
}

/**
 * 翻译资源 - 仅保留核心功能
 */
const translations: Record<Locale, Record<Namespace, TranslationResources>> = {
  'zh-CN': {
    common: {
      close: '关闭',
      thankYou: '谢谢',
      language: '语言',
      switchLanguage: '切换语言',
    },
    home: {
      title: '赛博乞讨站',
      subtitle: 'CYBER BEGGING STATION',
      selectPayment: '选择施舍方式',
      wechat: '微信',
      alipay: '支付宝',
      qrCode: '收款码',
      messageWall: '留言墙',
      customQuotes: '自定义语录',
    },
    donation: {
      thankYou: '感谢您的慷慨施舍！',
      wechatQR: '微信收款码',
      alipayQR: '支付宝收款码',
      donateSuccess: '施舍成功！',
    },
  },
  'en-US': {
    common: {
      close: 'Close',
      thankYou: 'Thank you',
      language: 'Language',
      switchLanguage: 'Switch Language',
    },
    home: {
      title: 'Cyber Begging Station',
      subtitle: 'CYBER BEGGING STATION',
      selectPayment: 'Select Payment Method',
      wechat: 'WeChat',
      alipay: 'Alipay',
      qrCode: 'QR Code',
      messageWall: 'Message Wall',
      customQuotes: 'Custom Quotes',
    },
    donation: {
      thankYou: 'Thank you for your generous donation!',
      wechatQR: 'WeChat QR Code',
      alipayQR: 'Alipay QR Code',
      donateSuccess: 'Donation successful!',
    },
  },
  'ja-JP': {
    common: {
      close: '閉じる',
      thankYou: 'ありがとう',
      language: '言語',
      switchLanguage: '言語を切り替え',
    },
    home: {
      title: 'サイバー乞讨ステーション',
      subtitle: 'CYBER BEGGING STATION',
      selectPayment: '支払い方法を選択',
      wechat: 'WeChat',
      alipay: 'Alipay',
      qrCode: 'QRコード',
      messageWall: 'メッセージウォール',
      customQuotes: 'カスタム引用',
    },
    donation: {
      thankYou: 'ご寄付ありがとうございます！',
      wechatQR: 'WeChat QRコード',
      alipayQR: 'Alipay QRコード',
      donateSuccess: '寄付が成功しました！',
    },
  },
  'ko-KR': {
    common: {
      close: '닫기',
      thankYou: '감사합니다',
      language: '언어',
      switchLanguage: '언어 전환',
    },
    home: {
      title: '사이버 구걸 스테이션',
      subtitle: 'CYBER BEGGING STATION',
      selectPayment: '결제 방법 선택',
      wechat: '위챗',
      alipay: '알리페이',
      qrCode: 'QR 코드',
      messageWall: '메시지 벽',
      customQuotes: '사용자 정의 인용구',
    },
    donation: {
      thankYou: '관대한 기부에 감사드립니다!',
      wechatQR: '위챗 QR 코드',
      alipayQR: '알리페이 QR 코드',
      donateSuccess: '기부 성공!',
    },
  },
  'fr-FR': {
    common: {
      close: 'Fermer',
      thankYou: 'Merci',
      language: 'Langue',
      switchLanguage: 'Changer de langue',
    },
    home: {
      title: 'Station de Mendicité Cyber',
      subtitle: 'CYBER BEGGING STATION',
      selectPayment: 'Sélectionnez le mode de paiement',
      wechat: 'WeChat',
      alipay: 'Alipay',
      qrCode: 'Code QR',
      messageWall: 'Mur de messages',
      customQuotes: 'Citations personnalisées',
    },
    donation: {
      thankYou: 'Merci pour votre généreux don!',
      wechatQR: 'Code QR WeChat',
      alipayQR: 'Code QR Alipay',
      donateSuccess: 'Don réussi!',
    },
  },
  'es-ES': {
    common: {
      close: 'Cerrar',
      thankYou: 'Gracias',
      language: 'Idioma',
      switchLanguage: 'Cambiar idioma',
    },
    home: {
      title: 'Estación de Mendicidad Cibernética',
      subtitle: 'CYBER BEGGING STATION',
      selectPayment: 'Seleccionar método de pago',
      wechat: 'WeChat',
      alipay: 'Alipay',
      qrCode: 'Código QR',
      messageWall: 'Muro de mensajes',
      customQuotes: 'Citas personalizadas',
    },
    donation: {
      thankYou: '¡Gracias por su generosa donación!',
      wechatQR: 'Código QR WeChat',
      alipayQR: 'Código QR Alipay',
      donateSuccess: '¡Donación exitosa!',
    },
  },
  'de-DE': {
    common: {
      close: 'Schließen',
      thankYou: 'Danke',
      language: 'Sprache',
      switchLanguage: 'Sprache wechseln',
    },
    home: {
      title: 'Cyber-Bettler-Station',
      subtitle: 'CYBER BEGGING STATION',
      selectPayment: 'Zahlungsmethode auswählen',
      wechat: 'WeChat',
      alipay: 'Alipay',
      qrCode: 'QR-Code',
      messageWall: 'Nachrichtenwand',
      customQuotes: 'Benutzerdefinierte Zitate',
    },
    donation: {
      thankYou: 'Vielen Dank für Ihre großzügige Spende!',
      wechatQR: 'WeChat QR-Code',
      alipayQR: 'Alipay QR-Code',
      donateSuccess: 'Spende erfolgreich!',
    },
  },
  'pt-BR': {
    common: {
      close: 'Fechar',
      thankYou: 'Obrigado',
      language: 'Idioma',
      switchLanguage: 'Alterar idioma',
    },
    home: {
      title: 'Estação de Mendicidade Cibernética',
      subtitle: 'CYBER BEGGING STATION',
      selectPayment: 'Selecione o método de pagamento',
      wechat: 'WeChat',
      alipay: 'Alipay',
      qrCode: 'Código QR',
      messageWall: 'Mural de mensagens',
      customQuotes: 'Citações personalizadas',
    },
    donation: {
      thankYou: 'Obrigado pela sua generosa doação!',
      wechatQR: 'Código QR WeChat',
      alipayQR: 'Código QR Alipay',
      donateSuccess: 'Doação bem-sucedida!',
    },
  },
};

/**
 * 翻译管理器
 */
class TranslationManager {
  private currentLocale: Locale = 'zh-CN';

  setLocale(locale: Locale): void {
    this.currentLocale = locale;
  }

  getLocale(): Locale {
    return this.currentLocale;
  }

  getAvailableLocales(): Locale[] {
    return LANGUAGES.map(lang => lang.code);
  }

  t(key: string, namespace: Namespace = 'home'): string {
    const keys = key.split('.');
    let value: string | TranslationResources = translations[this.currentLocale][namespace];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as TranslationResources)[k];
      } else {
        // Fallback to default locale (Chinese)
        if (this.currentLocale !== 'zh-CN') {
          let fallbackValue: string | TranslationResources = translations['zh-CN'][namespace];
          for (const fallbackKey of keys) {
            if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
              fallbackValue = (fallbackValue as TranslationResources)[fallbackKey];
            } else {
              return key; // Return key if not found in fallback
            }
          }
          return fallbackValue as string;
        }
        return key; // Return key if not found
      }
    }

    return value as string;
  }

  interpolate(
    key: string,
    values: Record<string, string | number>,
    namespace: Namespace = 'home',
    locale?: Locale
  ): string {
    let translation = this.t(key, namespace);
    for (const [key, value] of Object.entries(values)) {
      translation = translation.replace(`{${key}}`, String(value));
    }
    return translation;
  }

  formatDate(date: Date, locale?: Locale): string {
    const loc = locale || this.currentLocale;
    return date.toLocaleDateString(loc, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatNumber(num: number, locale?: Locale): string {
    const loc = locale || this.currentLocale;
    return num.toLocaleString(loc);
  }

  formatCurrency(
    amount: number,
    currency: string = 'CNY',
    locale?: Locale
  ): string {
    const loc = locale || this.currentLocale;
    return amount.toLocaleString(loc, {
      style: 'currency',
      currency,
    });
  }
}

export const translationManager = new TranslationManager();

export { TranslationManager };
