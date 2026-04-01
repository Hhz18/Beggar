/**
 * Storage Layer - Refactored with Generic Wrapper
 *
 * @description
 * All storage operations now use StorageManager for consistency.
 * This eliminates code duplication and provides better error handling.
 *
 * @module lib/storage
 */

import { StorageManager } from './storage/core';
import { generateDonationId, generateMessageId, generateQuoteId } from './utils/idGenerator';
import type { DonationRecord, DonationStats, Message, CustomQuote } from '@/types';

// ============ Storage Configuration ============

/**
 * Default stats value
 */
const DEFAULT_STATS: DonationStats = {
  totalDonations: 0,
  totalAmount: 0,
  donationCount: 0,
  wechatCount: 0,
  alipayCount: 0,
  lastDonation: '',
  firstDonation: '',
};

/**
 * Storage configurations
 */
const STORAGE_CONFIGS = {
  DONATION_RECORDS: 'cyber_beggar_donations',
  DONATION_STATS: 'cyber_beggar_stats',
  LAST_VISIT: 'cyber_beggar_last_visit',
  MESSAGES: 'cyber_beggar_messages',
  CUSTOM_QUOTES: 'cyber_beggar_custom_quotes',
} as const;

// Create storage managers with caching enabled
const donationsStorage = new StorageManager<DonationRecord[]>({
  key: STORAGE_CONFIGS.DONATION_RECORDS,
  defaultValue: [],
  enableCache: true,
});

const statsStorage = new StorageManager<DonationStats>({
  key: STORAGE_CONFIGS.DONATION_STATS,
  defaultValue: DEFAULT_STATS,
  enableCache: true,
});

const lastVisitStorage = new StorageManager<string>({
  key: STORAGE_CONFIGS.LAST_VISIT,
  defaultValue: '',
  enableCache: false,
});

const messagesStorage = new StorageManager<Message[]>({
  key: STORAGE_CONFIGS.MESSAGES,
  defaultValue: [],
  enableCache: true,
});

const quotesStorage = new StorageManager<CustomQuote[]>({
  key: STORAGE_CONFIGS.CUSTOM_QUOTES,
  defaultValue: [],
  enableCache: true,
});

// ============ Donation Records ============

/**
 * Retrieves all donation records from localStorage.
 *
 * @returns {DonationRecord[]} Array of donation records, empty array if none exist
 *
 * @example
 * ```typescript
 * const records = getDonationRecords();
 * console.log(`Found ${records.length} donations`);
 * ```
 */
export function getDonationRecords(): DonationRecord[] {
  return donationsStorage.get();
}

/**
 * Saves a new donation record to localStorage.
 *
 * @param {Omit<DonationRecord, 'id'>} record - Donation record without ID (will be auto-generated)
 * @returns {DonationRecord} Complete donation record with generated ID
 *
 * @example
 * ```typescript
 * const newRecord = saveDonationRecord({
 *   amount: 100,
 *   paymentMethod: 'wechat',
 *   timestamp: Date.now(),
 *   date: new Date().toLocaleString(),
 * });
 * ```
 */
export function saveDonationRecord(record: Omit<DonationRecord, 'id'>): DonationRecord {
  const newRecord: DonationRecord = {
    ...record,
    id: generateDonationId(),
  };

  donationsStorage.update(records => [...records, newRecord]);
  updateStats(donationsStorage.get());

  return newRecord;
}

/**
 * Deletes a donation record by ID.
 *
 * @param {string} id - The ID of the donation record to delete
 *
 * @example
 * ```typescript
 * deleteDonationRecord('donation_abc123');
 * ```
 */
export function deleteDonationRecord(id: string): void {
  donationsStorage.update(records => records.filter(r => r.id !== id));
  updateStats(donationsStorage.get());
}

/**
 * Clears all donation records and stats.
 *
 * @example
 * ```typescript
 * clearAllRecords();
 * ```
 */
export function clearAllRecords(): void {
  donationsStorage.clear();
  statsStorage.clear();
}

// ============ Statistics ============

/**
 * Retrieves aggregated donation statistics.
 *
 * @returns {DonationStats} Current donation statistics
 *
 * @example
 * ```typescript
 * const stats = getDonationStats();
 * console.log(`Total: ${stats.totalAmount} from ${stats.totalDonations} donations`);
 * ```
 */
export function getDonationStats(): DonationStats {
  return statsStorage.get();
}

/**
 * Updates statistics based on current donation records.
 *
 * @param {DonationRecord[]} records - Current donation records
 * @private
 */
function updateStats(records: DonationRecord[]): void {
  if (records.length === 0) {
    statsStorage.set(DEFAULT_STATS);
    return;
  }

  const stats: DonationStats = {
    totalDonations: records.length,
    totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
    donationCount: records.length,
    wechatCount: records.filter(r => r.paymentMethod === 'wechat').length,
    alipayCount: records.filter(r => r.paymentMethod === 'alipay').length,
    lastDonation: new Date(records[records.length - 1].timestamp).toLocaleString('zh-CN'),
    firstDonation: new Date(records[0].timestamp).toLocaleString('zh-CN'),
  };

  statsStorage.set(stats);
}

/**
 * Initializes statistics from existing donation records.
 * Only rebuilds stats if they don't already exist.
 *
 * @example
 * ```typescript
 * initializeStats(); // Call on app startup
 * ```
 */
export function initializeStats(): void {
  const records = getDonationRecords();
  const existingStats = localStorage.getItem(STORAGE_CONFIGS.DONATION_STATS);

  if (!existingStats && records.length > 0) {
    updateStats(records);
  }
}

// ============ Last Visit ============

/**
 * Retrieves the last visit timestamp.
 *
 * @returns {string} ISO timestamp of last visit, empty string if none
 *
 * @example
 * ```typescript
 * const lastVisit = getLastVisit();
 * console.log(`Last visited: ${lastVisit}`);
 * ```
 */
export function getLastVisit(): string {
  return lastVisitStorage.get();
}

/**
 * Updates the last visit timestamp to current time.
 *
 * @example
 * ```typescript
 * updateLastVisit(); // Call on app startup
 * ```
 */
export function updateLastVisit(): void {
  lastVisitStorage.set(new Date().toISOString());
}

// ============ Messages ============

/**
 * Retrieves all messages from localStorage.
 *
 * @returns {Message[]} Array of all messages
 *
 * @example
 * ```typescript
 * const messages = getMessages();
 * console.log(`Found ${messages.length} messages`);
 * ```
 */
export function getMessages(): Message[] {
  return messagesStorage.get();
}

/**
 * Saves a new message to localStorage.
 *
 * @param {Omit<Message, 'id' | 'timestamp' | 'date' | 'likes'>} message - Message without auto-generated fields
 * @returns {Message} Complete message with generated ID and timestamps
 *
 * @example
 * ```typescript
 * const newMessage = saveMessage({
 *   content: 'Great project!',
 *   nickname: 'John',
 * });
 * ```
 */
export function saveMessage(message: Omit<Message, 'id' | 'timestamp' | 'date' | 'likes'>): Message {
  const newMessage: Message = {
    ...message,
    id: generateMessageId(),
    timestamp: Date.now(),
    date: new Date().toISOString(),
    likes: 0,
  };

  messagesStorage.update(messages => [...messages, newMessage]);
  return newMessage;
}

/**
 * Increments the like count for a message.
 *
 * @param {string} messageId - The ID of the message to like
 *
 * @example
 * ```typescript
 * likeMessage('msg_abc123');
 * ```
 */
export function likeMessage(messageId: string): void {
  messagesStorage.update(messages =>
    messages.map(m =>
      m.id === messageId ? { ...m, likes: m.likes + 1 } : m
    )
  );
}

/**
 * Deletes a message by ID.
 *
 * @param {string} messageId - The ID of the message to delete
 *
 * @example
 * ```typescript
 * deleteMessage('msg_abc123');
 * ```
 */
export function deleteMessage(messageId: string): void {
  messagesStorage.update(messages => messages.filter(m => m.id !== messageId));
}

// ============ Custom Quotes ============

/**
 * Retrieves all custom quotes from localStorage.
 *
 * @returns {CustomQuote[]} Array of all custom quotes
 *
 * @example
 * ```typescript
 * const quotes = getCustomQuotes();
 * console.log(`Found ${quotes.length} custom quotes`);
 * ```
 */
export function getCustomQuotes(): CustomQuote[] {
  return quotesStorage.get();
}

/**
 * Saves a new custom quote to localStorage.
 *
 * @param {Omit<CustomQuote, 'id' | 'timestamp'>} quote - Quote without auto-generated fields
 * @returns {CustomQuote} Complete quote with generated ID and timestamp
 *
 * @example
 * ```typescript
 * const newQuote = saveCustomQuote({
 *   text: 'Keep up the good work!',
 *   category: 'funny',
 * });
 * ```
 */
export function saveCustomQuote(quote: Omit<CustomQuote, 'id' | 'timestamp'>): CustomQuote {
  const newQuote: CustomQuote = {
    ...quote,
    id: generateQuoteId(),
    timestamp: Date.now(),
  };

  quotesStorage.update(quotes => [...quotes, newQuote]);
  return newQuote;
}

/**
 * Deletes a custom quote by ID.
 *
 * @param {string} quoteId - The ID of the quote to delete
 *
 * @example
 * ```typescript
 * deleteCustomQuote('custom_abc123');
 * ```
 */
export function deleteCustomQuote(quoteId: string): void {
  quotesStorage.update(quotes => quotes.filter(q => q.id !== quoteId));
}

/**
 * Updates a custom quote with new values.
 *
 * @param {string} quoteId - The ID of the quote to update
 * @param {Partial<Omit<CustomQuote, 'id' | 'timestamp'>>} updates - Fields to update
 *
 * @example
 * ```typescript
 * updateCustomQuote('custom_abc123', { text: 'Updated text' });
 * ```
 */
export function updateCustomQuote(
  quoteId: string,
  updates: Partial<Omit<CustomQuote, 'id' | 'timestamp'>>
): void {
  quotesStorage.update(quotes =>
    quotes.map(q =>
      q.id === quoteId ? { ...q, ...updates } : q
    )
  );
}
