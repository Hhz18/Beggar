/**
 * Application Configuration
 *
 * @description
 * Centralizes app-wide constants and settings.
 * Provides a single source of truth for application behavior.
 *
 * @module config/app.config
 */

/**
 * Application-wide configuration constants
 */
export const APP_CONFIG = {
  /**
   * Timeout and duration constants (milliseconds)
   */
  MODAL_ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 200,

  /**
   * Error handling settings
   */
  ERROR_LOG_MAX_SIZE: 20,
  ERROR_LOG_RETENTION_DAYS: 7,
  ERROR_DISPLAY_DURATION: 5000,

  /**
   * UI constraints
   */
  MAX_MESSAGE_LENGTH: 500,
  MAX_NICKNAME_LENGTH: 50,
  MAX_QUOTE_LENGTH: 200,

  /**
   * Pagination settings
   */
  MESSAGES_PER_PAGE: 20,
  QUOTES_PER_PAGE: 15,
  DONATIONS_PER_PAGE: 10,

  /**
   * Animation settings
   */
  ENABLE_ANIMATIONS: true,
  REDUCED_MOTION: false, // Can be overridden by user preferences

  /**
   * Feature flags
   */
  FEATURES: {
    SPEECH_RECOGNITION: true,
    VOICE_COMMANDS: true,
    PARTICLE_EFFECTS: true,
    CUSTOM_QUOTES: true,
    MESSAGE_WALL: true,
    STATISTICS: true,
    SHARING: true,
    THEMES: true,
    I18N: true,
  } as const,

  /**
   * Storage settings
   */
  STORAGE: {
    ENABLE_CACHE: true,
    CACHE_TTL: 5 * 60 * 1000, // 5 minutes
    AUTO_CLEANUP: true,
  } as const,

  /**
   * Performance settings
   */
  PERFORMANCE: {
    ENABLE_PROFILING: false,
    LOG_RENDER_TIMES: false,
    THRESHOLD_SLOW_RENDER: 100, // milliseconds
  } as const,

  /**
   * Development settings
   */
  DEVELOPMENT: {
    ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
    LOG_STATE_CHANGES: false,
    SHOW_COMPONENT_NAMES: false,
  } as const,
} as const;

/**
 * Feature flag type
 */
export type FeatureFlag = keyof typeof APP_CONFIG.FEATURES;

/**
 * Check if a feature is enabled
 *
 * @param {FeatureFlag} feature - Feature to check
 * @returns {boolean} True if feature is enabled
 *
 * @example
 * ```typescript
 * if (isFeatureEnabled('SPEECH_RECOGNITION')) {
 *   // Initialize speech recognition
 * }
 * ```
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return APP_CONFIG.FEATURES[feature];
}

/**
 * Get all enabled features
 *
 * @returns {FeatureFlag[]} Array of enabled feature names
 *
 * @example
 * ```typescript
 * const enabled = getEnabledFeatures();
 * console.log('Enabled features:', enabled);
 * ```
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return Object.entries(APP_CONFIG.FEATURES)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature as FeatureFlag);
}

/**
 * Validate input against constraints
 *
 * @param {string} type - Input type ('message', 'nickname', 'quote')
 * @param {string} value - Value to validate
 * @returns {boolean} True if value is within constraints
 *
 * @example
 * ```typescript
 * const isValid = validateInput('message', userMessage);
 * if (!isValid) {
 *   console.error('Message too long');
 * }
 * ```
 */
export function validateInput(type: 'message' | 'nickname' | 'quote', value: string): boolean {
  const maxLength = {
    message: APP_CONFIG.MAX_MESSAGE_LENGTH,
    nickname: APP_CONFIG.MAX_NICKNAME_LENGTH,
    quote: APP_CONFIG.MAX_QUOTE_LENGTH,
  }[type];

  return value.length <= maxLength;
}
