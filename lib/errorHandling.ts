/**
 * 全局错误处理工具
 */

/**
 * 捕获未处理的Promise错误
 */
export function setupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  // 捕获未处理的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // 保存错误日志
    try {
      const errorLog = {
        type: 'unhandledRejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
      };
      saveErrorLog(errorLog);
    } catch (e) {
      console.error('Failed to save error log:', e);
    }
  });

  // 捕获全局错误
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);

    try {
      const errorLog = {
        type: 'globalError',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
      };
      saveErrorLog(errorLog);
    } catch (e) {
      console.error('Failed to save error log:', e);
    }
  });
}

/**
 * 保存错误日志
 */
function saveErrorLog(errorLog: any): void {
  try {
    const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
    logs.push(errorLog);
    // 只保留最近20条错误
    if (logs.length > 20) {
      logs.shift();
    }
    localStorage.setItem('error_logs', JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save error log:', e);
  }
}

/**
 * 获取错误日志
 */
export function getErrorLogs(): any[] {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(localStorage.getItem('error_logs') || '[]');
  } catch (e) {
    console.error('Failed to read error logs:', e);
    return [];
  }
}

/**
 * 清除错误日志
 */
export function clearErrorLogs(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('error_logs');
  } catch (e) {
    console.error('Failed to clear error logs:', e);
  }
}
