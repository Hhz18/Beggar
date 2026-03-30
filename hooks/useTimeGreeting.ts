import { useMemo, useCallback } from 'react';
import { CatEmotion } from '@/types';

/**
 * 时间段类型
 */
export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'midnight';

/**
 * 时间段信息
 */
interface TimePeriodInfo {
  period: TimePeriod;
  emotion: CatEmotion;
  greeting: string;
  subGreeting: string;
  emoji: string;
}

/**
 * useTimeGreeting Hook
 * 根据当前时间获取对应的问候语和小猫情绪
 *
 * @returns 时间段信息对象
 *
 * @example
 * ```tsx
 * const { emotion, greeting, period } = useTimeGreeting();
 * <PixelCat emotion={emotion} />
 * <p>{greeting}</p>
 * ```
 */
function useTimeGreeting(): TimePeriodInfo {
  const getTimePeriod = useCallback((): TimePeriodInfo => {
    const hour = new Date().getHours();

    // 深夜 (0:00 - 6:00)
    if (hour >= 0 && hour < 6) {
      return {
        period: 'midnight',
        emotion: 'normal',
        greeting: '夜深了',
        subGreeting: '( =^･ω･^= ) 还没睡吗...',
        emoji: '🌙',
      };
    }

    // 早上 (6:00 - 12:00)
    if (hour >= 6 && hour < 12) {
      return {
        period: 'morning',
        emotion: 'happy',
        greeting: '早上好',
        subGreeting: '( =^･ω･^= ) 新的一天！',
        emoji: '☀️',
      };
    }

    // 下午 (12:00 - 18:00)
    if (hour >= 12 && hour < 18) {
      return {
        period: 'afternoon',
        emotion: 'excited',
        greeting: '下午好',
        subGreeting: '( =^･ω･^= ) 继续加油！',
        emoji: '🌤️',
      };
    }

    // 晚上 (18:00 - 24:00)
    return {
      period: 'evening',
      emotion: 'happy',
      greeting: '晚上好',
      subGreeting: '( =^･ω･^= ) 辛苦了一天',
      emoji: '🌆',
    };
  }, []);

  return useMemo(() => getTimePeriod(), [getTimePeriod]);
}

export { useTimeGreeting };
export default useTimeGreeting;
