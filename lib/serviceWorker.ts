/**
 * Service Worker 注册和管理
 */

const SW_URL = '/sw.js';

/**
 * 检查是否支持Service Worker
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * 注册Service Worker
 */
export function registerServiceWorker(): void {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Worker not supported');
    return;
  }

  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(SW_URL)
      .then((registration) => {
        console.log('Service Worker registered:', registration);

        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 新的Service Worker可用
                if (confirm('新版本可用，是否更新？')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

/**
 * 等待Service Worker激活
 */
export async function waitForServiceWorkerActivation(): Promise<ServiceWorkerRegistration> {
  if (!isServiceWorkerSupported()) {
    throw new Error('Service Worker not supported');
  }

  const registration = await navigator.serviceWorker.ready;
  return registration;
}

/**
 * 清除所有缓存
 */
export async function clearAllCaches(): Promise<void> {
  if (!isServiceWorkerSupported()) return;

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((cacheName) => caches.delete(cacheName))
  );
}

/**
 * 预缓存资源
 */
export async function precacheResources(urls: string[]): Promise<void> {
  if (!isServiceWorkerSupported()) return;

  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urls);
  } catch (error) {
    console.error('Error precaching resources:', error);
  }
}

/**
 * 检查离线状态
 */
export function isOffline(): boolean {
  if (typeof navigator === 'undefined') return false;
  return !navigator.onLine;
}

/**
 * 监听在线/离线状态
 */
export function setupNetworkStatusListener(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

const CACHE_NAME = 'cyber-beggar-v1';
