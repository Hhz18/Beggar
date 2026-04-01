/**
 * Generic Storage Wrapper
 *
 * @description
 * Provides type-safe localStorage operations with consistent error handling,
 * caching, and serialization. Eliminates code duplication across storage functions.
 *
 * @template T - The type of data being stored
 */

interface StorageConfig<T> {
  /** localStorage key */
  key: string;
  /** Default value if storage is empty or error occurs */
  defaultValue: T;
  /** Custom serializer (defaults to JSON.stringify) */
  serializer?: (value: T) => string;
  /** Custom deserializer (defaults to JSON.parse) */
  deserializer?: (value: string) => T;
  /** Enable in-memory caching for better performance */
  enableCache?: boolean;
}

/**
 * Generic storage manager with error handling and caching
 *
 * @example
 * ```typescript
 * const storage = new StorageManager({
 *   key: 'user_data',
 *   defaultValue: { name: '', age: 0 },
 *   enableCache: true,
 * });
 *
 * const data = storage.get(); // Returns type-safe data
 * storage.set({ name: 'John', age: 30 });
 * storage.update(user => ({ ...user, age: user.age + 1 }));
 * ```
 */
export class StorageManager<T> {
  private cache: Map<string, T> = new Map();
  private config: Required<StorageConfig<T>>;

  constructor(config: StorageConfig<T>) {
    this.config = {
      enableCache: true,
      serializer: config.serializer || ((value: T) => JSON.stringify(value)),
      deserializer: config.deserializer || ((value: string) => {
        // Try to parse as JSON first
        try {
          return JSON.parse(value);
        } catch {
          // If parsing fails, return the value as-is (for simple strings)
          return value as T;
        }
      }),
      ...config,
    };
  }

  /**
   * Check if running on client side
   */
  private isClientSide(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get value from storage or cache
   *
   * @returns {T} The stored value or default value
   */
  get(): T {
    if (!this.isClientSide()) {
      return this.config.defaultValue;
    }

    try {
      // Return cached value if available
      if (this.config.enableCache && this.cache.has(this.config.key)) {
        return this.cache.get(this.config.key)!;
      }

      const data = localStorage.getItem(this.config.key);
      if (data === null) {
        return this.config.defaultValue;
      }

      const value = this.config.deserializer(data);

      // Cache the value
      if (this.config.enableCache) {
        this.cache.set(this.config.key, value);
      }

      return value;
    } catch (error) {
      console.error(`Error reading from storage (${this.config.key}):`, error);
      return this.config.defaultValue;
    }
  }

  /**
   * Set value in storage and update cache
   *
   * @param {T} value - The value to store
   * @throws {Error} If storage operation fails
   */
  set(value: T): void {
    if (!this.isClientSide()) {
      return;
    }

    try {
      const serialized = this.config.serializer(value);
      localStorage.setItem(this.config.key, serialized);

      // Update cache
      if (this.config.enableCache) {
        this.cache.set(this.config.key, value);
      }
    } catch (error) {
      console.error(`Error writing to storage (${this.config.key}):`, error);
      throw error;
    }
  }

  /**
   * Update stored value using a function
   *
   * @param {(current: T) => T} updater - Function that receives current value and returns updated value
   *
   * @example
   * ```typescript
   * storage.update(count => count + 1);
   * storage.update(user => ({ ...user, age: user.age + 1 }));
   * ```
   */
  update(updater: (current: T) => T): void {
    const current = this.get();
    const updated = updater(current);
    this.set(updated);
  }

  /**
   * Remove value from storage and cache
   */
  clear(): void {
    if (!this.isClientSide()) {
      return;
    }

    try {
      localStorage.removeItem(this.config.key);
      this.cache.delete(this.config.key);
    } catch (error) {
      console.error(`Error clearing storage (${this.config.key}):`, error);
    }
  }

  /**
   * Invalidate cached value (useful when external changes occur)
   */
  invalidateCache(): void {
    this.cache.delete(this.config.key);
  }

  /**
   * Check if value exists in storage
   *
   * @returns {boolean} True if value exists in storage
   */
  exists(): boolean {
    if (!this.isClientSide()) {
      return false;
    }

    try {
      return localStorage.getItem(this.config.key) !== null;
    } catch (error) {
      console.error(`Error checking storage (${this.config.key}):`, error);
      return false;
    }
  }
}

export type { StorageConfig };
