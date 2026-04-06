import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  easing?: (t: number) => number;
  onComplete?: () => void;
}

/**
 * 缓动函数集合
 */
const easing = {
  linear: (t: number) => t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutBounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};

/**
 * useCountUp Hook
 * 数字滚动动画效果
 *
 * @param options - 配置选项
 * @returns 当前显示的数字
 *
 * @example
 * ```tsx
 * const count = useCountUp({ end: 100, duration: 2000 });
 * <span>{count}</span>
 * ```
 */
function useCountUp({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  decimals = 0,
  easing: easingFn = easing.easeOutExpo,
  onComplete,
}: UseCountUpOptions): number {
  const [count, setCount] = useState(start);
  const requestRef = useRef<number>(undefined);
  const startTimeRef = useRef<number>(undefined);
  const previousEndRef = useRef<number>(end);

  useEffect(() => {
    // 只在end值真正改变时才重新触发动画
    if (previousEndRef.current === end) {
      return;
    }

    previousEndRef.current = end;

    const timer = setTimeout(() => {
      startTimeRef.current = performance.now();

      const animate = (currentTime: number) => {
        const startTime = startTimeRef.current!;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = easingFn(progress);
        const currentCount = start + (end - start) * easedProgress;

        setCount(currentCount);

        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };

      requestRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [start, end, duration, delay, easingFn, onComplete]);

  // 格式化数字，保留指定小数位数
  const formattedCount = Number(count.toFixed(decimals));

  return formattedCount;
}

export { useCountUp, easing };
export default useCountUp;
