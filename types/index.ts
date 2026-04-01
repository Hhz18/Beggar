/**
 * Core type definitions for Cyber Beggar application
 * @module types
 */

/**
 * Supported payment methods
 * @type {('wechat' | 'alipay')}
 */
export type PaymentMethod = 'wechat' | 'alipay';

/**
 * Donation record structure
 * @interface
 * @property {string} id - Unique identifier (auto-generated)
 * @property {number} amount - Donation amount in currency units
 * @property {PaymentMethod} paymentMethod - Payment method used
 * @property {number} timestamp - Unix timestamp in milliseconds
 * @property {string} date - Formatted date string for display
 *
 * @example
 * ```typescript
 * const donation: DonationRecord = {
 *   id: 'abc123',
 *   amount: 100,
 *   paymentMethod: 'wechat',
 *   timestamp: Date.now(),
 *   date: '2026-04-01',
 * };
 * ```
 */
export interface DonationRecord {
  /** Unique identifier (auto-generated) */
  id: string;
  /** Donation amount in currency units */
  amount: number;
  /** Payment method used */
  paymentMethod: PaymentMethod;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** Formatted date string for display */
  date: string;
}

/**
 * Donation statistics summary
 * @interface
 * @property {number} totalDonations - Total number of donations
 * @property {number} totalAmount - Sum of all donation amounts
 * @property {number} donationCount - Alias for totalDonations
 * @property {number} wechatCount - Number of WeChat donations
 * @property {number} alipayCount - Number of Alipay donations
 * @property {string} lastDonation - Date string of most recent donation
 * @property {string} firstDonation - Date string of first donation
 *
 * @example
 * ```typescript
 * const stats: DonationStats = {
 *   totalDonations: 42,
 *   totalAmount: 1337,
 *   donationCount: 42,
 *   wechatCount: 25,
 *   alipayCount: 17,
 *   lastDonation: '2026-04-01',
 *   firstDonation: '2026-03-15',
 * };
 * ```
 */
export interface DonationStats {
  /** Total number of donations */
  totalDonations: number;
  /** Sum of all donation amounts */
  totalAmount: number;
  /** Alias for totalDonations */
  donationCount: number;
  /** Number of WeChat donations */
  wechatCount: number;
  /** Number of Alipay donations */
  alipayCount: number;
  /** Date string of most recent donation */
  lastDonation: string;
  /** Date string of first donation */
  firstDonation: string;
}

/**
 * Thank you quote categories
 * @type {('funny' | 'touching' | 'cute' | 'philosophical')}
 */
export type QuoteCategory = 'funny' | 'touching' | 'cute' | 'philosophical';

/**
 * Thank you quote structure
 * @interface
 * @property {string} text - The quote text content
 * @property {QuoteCategory} category - Quote category for emotional tone
 *
 * @example
 * ```typescript
 * const quote: Quote = {
 *   text: 'Thank you for your generosity!',
 *   category: 'touching',
 * };
 * ```
 */
export interface Quote {
  /** The quote text content */
  text: string;
  /** Quote category for emotional tone */
  category: QuoteCategory;
}

/**
 * Cat emotion states for visual feedback
 * @type {('happy' | 'excited' | 'normal' | 'sad' | 'sleepy')}
 *
 * @example
 * ```typescript
 * const emotion: CatEmotion = 'happy';
 * ```
 */
export type CatEmotion = 'happy' | 'excited' | 'normal' | 'sad' | 'sleepy';

/**
 * Available theme options
 * @type {('light' | 'dark' | 'rainbow' | 'cyberpunk')}
 *
 * @example
 * ```typescript
 * const theme: Theme = 'cyberpunk';
 * ```
 */
export type Theme = 'light' | 'dark' | 'rainbow' | 'cyberpunk';

/**
 * User message on the message wall
 * @interface
 * @property {string} id - Unique identifier (auto-generated)
 * @property {string} content - Message content
 * @property {string} nickname - User's nickname
 * @property {number} timestamp - Unix timestamp in milliseconds
 * @property {string} date - Formatted date string for display
 * @property {number} likes - Number of likes received
 *
 * @example
 * ```typescript
 * const message: Message = {
 *   id: 'msg123',
 *   content: 'Great project!',
 *   nickname: 'Anonymous',
 *   timestamp: Date.now(),
 *   date: '2026-04-01',
 *   likes: 5,
 * };
 * ```
 */
export interface Message {
  /** Unique identifier (auto-generated) */
  id: string;
  /** Message content */
  content: string;
  /** User's nickname */
  nickname: string;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** Formatted date string for display */
  date: string;
  /** Number of likes received */
  likes: number;
}

/**
 * Custom user-created quote
 * @interface
 * @property {string} id - Unique identifier (auto-generated)
 * @property {string} text - The custom quote text
 * @property {QuoteCategory} category - Quote category
 * @property {number} timestamp - Unix timestamp in milliseconds
 *
 * @example
 * ```typescript
 * const customQuote: CustomQuote = {
 *   id: 'custom123',
 *   text: 'You are amazing!',
 *   category: 'cute',
 *   timestamp: Date.now(),
 * };
 * ```
 */
export interface CustomQuote {
  /** Unique identifier (auto-generated) */
  id: string;
  /** The custom quote text */
  text: string;
  /** Quote category */
  category: QuoteCategory;
  /** Unix timestamp in milliseconds */
  timestamp: number;
}

/**
 * Payment method information for UI display
 * @interface
 * @property {PaymentMethod} id - Payment method identifier
 * @property {string} name - Display name
 * @property {string} icon - Icon identifier
 * @property {string} color - Associated color for UI
 * @property {string} qrCode - QR code URL or path
 *
 * @example
 * ```typescript
 * const method: PaymentMethodInfo = {
 *   id: 'wechat',
 *   name: 'WeChat Pay',
 *   icon: 'wechat',
 *   color: '#07c160',
 *   qrCode: '/qr/wechat.png',
 * };
 * ```
 */
export interface PaymentMethodInfo {
  /** Payment method identifier */
  id: PaymentMethod;
  /** Display name */
  name: string;
  /** Icon identifier */
  icon: string;
  /** Associated color for UI */
  color: string;
  /** QR code URL or path */
  qrCode: string;
}

/**
 * Locale type for internationalization
 * @type {('zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR')}
 *
 * @example
 * ```typescript
 * const locale: Locale = 'zh-CN';
 * ```
 */
export type Locale = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR';

/**
 * Translation namespace
 * @type {('common' | 'home' | 'donation' | 'quotes')}
 */
export type Namespace = 'common' | 'home' | 'donation' | 'quotes';

/**
 * Translation key structure
 * @interface
 * @property {string} key - Translation key
 * @property {Namespace} namespace - Translation namespace
 * @property {Record<string, string | number>} values - Values for interpolation
 *
 * @example
 * ```typescript
 * const translation: TranslationKey = {
 *   key: 'donation.success',
 *   namespace: 'donation',
 *   values: { amount: 100 },
 * };
 * ```
 */
export interface TranslationKey {
  /** Translation key */
  key: string;
  /** Translation namespace */
  namespace?: Namespace;
  /** Values for interpolation */
  values?: Record<string, string | number>;
}
