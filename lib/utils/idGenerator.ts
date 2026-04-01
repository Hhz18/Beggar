/**
 * Secure ID Generator
 *
 * @description
 * Generates secure, unique IDs using the Web Crypto API when available,
 * with a fallback for server-side rendering or older browsers.
 * Replaces the unsafe Math.random() approach.
 */

/**
 * Generate a secure unique ID
 *
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} A unique identifier
 *
 * @example
 * ```typescript
 * generateId('user'); // "user_a1b2c3d4e5f6..."
 * generateId(); // "a1b2c3d4e5f6..."
 * ```
 */
export function generateId(prefix: string = ''): string {
  if (typeof window !== 'undefined' && 'crypto' in window) {
    // Use crypto API for secure random values
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return prefix ? `${prefix}_${hex}` : hex;
  }

  // Fallback for server-side or older browsers
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const counter = Math.random().toString(36).substring(2, 7);
  return prefix ? `${prefix}_${timestamp}_${random}_${counter}` : `${timestamp}_${random}_${counter}`;
}

/**
 * Generate a unique message ID
 *
 * @returns {string} A unique message identifier
 *
 * @example
 * ```typescript
 * const messageId = generateMessageId(); // "msg_a1b2c3d4..."
 * ```
 */
export function generateMessageId(): string {
  return generateId('msg');
}

/**
 * Generate a unique quote ID
 *
 * @returns {string} A unique quote identifier
 *
 * @example
 * ```typescript
 * const quoteId = generateQuoteId(); // "custom_a1b2c3d4..."
 * ```
 */
export function generateQuoteId(): string {
  return generateId('custom');
}

/**
 * Generate a unique donation ID
 *
 * @returns {string} A unique donation identifier
 *
 * @example
 * ```typescript
 * const donationId = generateDonationId(); // "donation_a1b2c3d4..."
 * ```
 */
export function generateDonationId(): string {
  return generateId('donation');
}

/**
 * Generate a unique error log ID
 *
 * @returns {string} A unique error log identifier
 *
 * @example
 * ```typescript
 * const errorId = generateErrorLogId(); // "error_a1b2c3d4..."
 * ```
 */
export function generateErrorLogId(): string {
  return generateId('error');
}
