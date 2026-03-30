/**
 * Developer Tools System
 * 企业级开发者工具系统
 */

export interface ComponentTreeNode {
  name: string;
  props: Record<string, unknown>;
  state: Record<string, unknown>;
  children: ComponentTreeNode[];
  renderTime?: number;
  memo?: boolean;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export interface LogEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: unknown;
}

class DeveloperToolsManager {
  private static instance: DeveloperToolsManager;
  private logs: LogEntry[] = [];
  private metrics: PerformanceMetric[] = [];
  private componentTree: ComponentTreeNode[] = [];
  private isEnabled = false;
  private maxLogs = 1000;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  static getInstance(): DeveloperToolsManager {
    if (!DeveloperToolsManager.instance) {
      DeveloperToolsManager.instance = new DeveloperToolsManager();
    }
    return DeveloperToolsManager.instance;
  }

  private initialize(): void {
    // Hook into console
    this.hookConsole();

    // Track performance
    this.trackPerformance();

    // Listen to storage events
    this.trackStorage();
  }

  private hookConsole(): void {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args: unknown[]) => {
      this.addLog('info', args.join(' '));
      originalLog.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      const messages = args.map(arg => {
        if (arg instanceof Error) {
          return arg.stack || arg.message;
        }
        return String(arg);
      });
      this.addLog('warn', messages.join(' '));
      originalWarn.apply(console, args);
    };

    console.error = (...args: unknown[]) => {
      // 保留原始错误堆栈信息
      const errorMessages = args.map(arg => {
        if (arg instanceof Error) {
          return arg.stack || arg.message;
        }
        return String(arg);
      });
      this.addLog('error', errorMessages.join(' '));
      originalError.apply(console, args);
    };
  }

  private trackPerformance(): void {
    if ('PerformanceObserver' in window) {
      // Track Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.addMetric({
              name: 'TTFB',
              value: navEntry.responseStart - navEntry.requestStart,
              rating: this.getRating('TTFB', navEntry.responseStart - navEntry.requestStart),
              timestamp: Date.now(),
            });
          } else if (entry.entryType === 'paint') {
            this.addMetric({
              name: entry.name === 'first-paint' ? 'FP' : 'FCP',
              value: entry.startTime,
              rating: this.getRating(entry.name === 'first-paint' ? 'FP' : 'FCP', entry.startTime),
              timestamp: Date.now(),
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });
    }
  }

  private trackStorage(): void {
    if (typeof window === 'undefined') return;

    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;

    localStorage.setItem = (key: string, value: string) => {
      this.addLog('debug', `localStorage.setItem: ${key}`);
      originalSetItem.apply(localStorage, [key, value]);
    };

    localStorage.getItem = (key: string) => {
      this.addLog('debug', `localStorage.getItem: ${key}`);
      return originalGetItem.apply(localStorage, [key]);
    };
  }

  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'FP': { good: 1000, poor: 3000 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 },
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  addLog(level: LogEntry['level'], message: string, data?: unknown): void {
    if (!this.isEnabled) return;

    this.logs.unshift({
      timestamp: Date.now(),
      level,
      message,
      data,
    });

    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  setComponentTree(tree: ComponentTreeNode[]): void {
    this.componentTree = tree;
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  getComponentTree(): ComponentTreeNode[] {
    return this.componentTree;
  }

  getLocalStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    if (typeof window === 'undefined') return data;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    return data;
  }

  getSessionStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    if (typeof window === 'undefined') return data;

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        data[key] = sessionStorage.getItem(key) || '';
      }
    }
    return data;
  }

  getPerformanceData(): {
    memory?: any;
    timing: PerformanceTiming;
    navigation: PerformanceNavigation;
  } {
    if (typeof performance === 'undefined') {
      return { timing: {} as PerformanceTiming, navigation: {} as PerformanceNavigation };
    }

    return {
      memory: (performance as any).memory,
      timing: performance.timing,
      navigation: performance.navigation,
    };
  }

  clearLogs(): void {
    this.logs = [];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  enable(): void {
    this.isEnabled = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('devtools_enabled', 'true');
    }
  }

  disable(): void {
    this.isEnabled = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devtools_enabled');
    }
  }

  isEnabledState(): boolean {
    if (typeof window !== 'undefined') {
      return this.isEnabled || localStorage.getItem('devtools_enabled') === 'true';
    }
    return this.isEnabled;
  }

  exportData(): string {
    const data = {
      logs: this.logs,
      metrics: this.metrics,
      localStorage: this.getLocalStorageData(),
      sessionStorage: this.getSessionStorageData(),
      performance: this.getPerformanceData(),
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);

      if (data.logs) this.logs = data.logs;
      if (data.metrics) this.metrics = data.metrics;

      return true;
    } catch (error) {
      console.error('Failed to import devtools data:', error);
      return false;
    }
  }
}

export const developerToolsManager = DeveloperToolsManager.getInstance();

/**
 * Utility function to track component render time
 */
export function trackComponentRender(
  componentName: string,
  props: Record<string, unknown>,
  state: Record<string, unknown>,
  memo = false
): () => void {
  const startTime = performance.now();

  return () => {
    const renderTime = performance.now() - startTime;

    const node: ComponentTreeNode = {
      name: componentName,
      props,
      state,
      children: [],
      renderTime,
      memo,
    };

    // Add to component tree (simplified)
    const manager = DeveloperToolsManager.getInstance();
    const tree = manager.getComponentTree();
    tree.push(node);
    manager.setComponentTree(tree);
  };
}

/**
 * Get all React roots for component tree inspection
 */
export function getReactRoots(): Element[] {
  const roots: Element[] = [];

  if (typeof document !== 'undefined') {
    const rootElements = document.querySelectorAll('[__nextroot], [data-reactroot], #__next');
    rootElements.forEach(el => roots.push(el));
  }

  return roots;
}

/**
 * Measure component render performance
 */
export function measureRenderPerformance(componentName: string) {
  if (typeof performance === 'undefined') return () => {};

  const markStart = `${componentName}-render-start`;
  const markEnd = `${componentName}-render-end`;

  performance.mark(markStart);

  return () => {
    performance.mark(markEnd);
    performance.measure(componentName, markStart, markEnd);

    const measure = performance.getEntriesByName(componentName)[0];
    if (measure) {
      developerToolsManager.addMetric({
        name: `Render: ${componentName}`,
        value: measure.duration,
        rating: measure.duration < 16.67 ? 'good' : measure.duration < 100 ? 'needs-improvement' : 'poor',
        timestamp: Date.now(),
      });
    }

    // Cleanup
    performance.clearMarks(markStart);
    performance.clearMarks(markEnd);
    performance.clearMeasures(componentName);
  };
}
