/**
 * Enhanced error handling system with logging and analytics
 * @module lib/errorHandling
 */

import { StorageManager } from './storage/core';

/**
 * Error log entry structure
 */
interface ErrorLog {
  /** Type of error */
  type: 'unhandledRejection' | 'globalError' | 'componentError';
  /** Error message */
  message: string;
  /** Error stack trace */
  stack?: string;
  /** File where error occurred (for global errors) */
  filename?: string;
  /** Line number (for global errors) */
  lineno?: number;
  /** Column number (for global errors) */
  colno?: number;
  /** Component stack (for React errors) */
  componentStack?: string;
  /** ISO timestamp */
  timestamp: string;
  /** User agent string */
  userAgent?: string;
  /** URL where error occurred */
  url?: string;
}

/**
 * Error statistics
 */
interface ErrorStats {
  /** Total number of errors */
  total: number;
  /** Error count by type */
  byType: Record<string, number>;
  /** Recent errors (last 5) */
  recent: ErrorLog[];
}

/** Maximum number of error logs to keep */
const MAX_ERROR_LOGS = 20;

/** Error retention period in milliseconds (7 days) */
const ERROR_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Storage manager for error logs
 */
const errorLogsStorage = new StorageManager<ErrorLog[]>({
  key: 'error_logs',
  defaultValue: [],
});

/**
 * Setup global error handlers for unhandled errors and promise rejections
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   setupGlobalErrorHandlers();
 * }, []);
 * ```
 */
export function setupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorLog: ErrorLog = {
      type: 'unhandledRejection',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    saveErrorLog(errorLog);
  });

  // Capture global errors
  window.addEventListener('error', (event) => {
    const errorLog: ErrorLog = {
      type: 'globalError',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    saveErrorLog(errorLog);
  });
}

/**
 * Save error log with automatic cleanup of old logs
 *
 * @param errorLog - Error log entry to save
 */
function saveErrorLog(errorLog: ErrorLog): void {
  try {
    const logs = errorLogsStorage.get();
    logs.push(errorLog);

    // Remove old logs based on retention period
    const cutoffTime = Date.now() - ERROR_RETENTION_MS;
    const filteredLogs = logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime > cutoffTime;
    });

    // Keep only the most recent MAX_ERROR_LOGS entries
    const trimmedLogs = filteredLogs.slice(-MAX_ERROR_LOGS);
    errorLogsStorage.set(trimmedLogs);
  } catch (error) {
    console.error('Failed to save error log:', error);
  }
}

/**
 * Get all stored error logs
 *
 * @returns Array of error log entries
 *
 * @example
 * ```typescript
 * const errors = getErrorLogs();
 * console.log(`Found ${errors.length} errors`);
 * ```
 */
export function getErrorLogs(): ErrorLog[] {
  return errorLogsStorage.get();
}

/**
 * Clear all error logs
 *
 * @example
 * ```typescript
 * clearErrorLogs();
 * console.log('Error logs cleared');
 * ```
 */
export function clearErrorLogs(): void {
  errorLogsStorage.clear();
}

/**
 * Log a component error (for use with ErrorBoundary)
 *
 * @param error - The error object
 * @param componentStack - React component stack trace
 *
 * @example
 * ```typescript
 * componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
 *   logComponentError(error, errorInfo.componentStack);
 * }
 * ```
 */
export function logComponentError(error: Error, componentStack: string): void {
  const errorLog: ErrorLog = {
    type: 'componentError',
    message: error.message,
    stack: error.stack,
    componentStack,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };
  saveErrorLog(errorLog);
}

/**
 * Get error statistics
 *
 * @returns Error statistics including total count, breakdown by type, and recent errors
 *
 * @example
 * ```typescript
 * const stats = getErrorStats();
 * console.log(`Total errors: ${stats.total}`);
 * console.log(`By type:`, stats.byType);
 * console.log(`Recent errors:`, stats.recent);
 * ```
 */
export function getErrorStats(): ErrorStats {
  const logs = getErrorLogs();

  const byType = logs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: logs.length,
    byType,
    recent: logs.slice(-5),
  };
}

/**
 * Get errors by type
 *
 * @param type - The type of error to filter by
 * @returns Array of error logs of the specified type
 *
 * @example
 * ```typescript
 * const componentErrors = getErrorsByType('componentError');
 * console.log(`Found ${componentErrors.length} component errors`);
 * ```
 */
export function getErrorsByType(type: ErrorLog['type']): ErrorLog[] {
  const logs = getErrorLogs();
  return logs.filter(log => log.type === type);
}

/**
 * Get recent errors within a time window
 *
 * @param hours - Number of hours to look back (default: 24)
 * @returns Array of error logs within the time window
 *
 * @example
 * ```typescript
 * const recentErrors = getRecentErrors(1); // Last hour
 * console.log(`Found ${recentErrors.length} recent errors`);
 * ```
 */
export function getRecentErrors(hours: number = 24): ErrorLog[] {
  const logs = getErrorLogs();
  const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);

  return logs.filter(log => {
    const logTime = new Date(log.timestamp).getTime();
    return logTime > cutoffTime;
  });
}
