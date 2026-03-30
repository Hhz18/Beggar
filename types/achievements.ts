import { DonationStats, DonationRecord } from './index';

/**
 * 成就类型
 */
export type AchievementType =
  | 'first_donation'
  | 'donation_count_10'
  | 'donation_count_50'
  | 'donation_count_100'
  | 'amount_100'
  | 'amount_500'
  | 'amount_1000'
  | 'streak_7'
  | 'streak_30'
  | 'wechat_master'
  | 'alipay_master'
  | 'early_bird'
  | 'night_owl'
  | 'generous'
  | 'legendary';

/**
 * 成就稀有度
 */
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * 成就接口
 */
export interface Achievement {
  id: AchievementType;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: 'milestone' | 'challenge' | 'special';
  requirement: string;
  unlocked?: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

/**
 * 成就进度接口
 */
export interface AchievementProgress {
  unlockedAchievements: AchievementType[];
  totalAchievements: number;
  currentLevel: number;
  nextLevelAchievements: number;
}

/**
 * 所有成就定义
 */
export const ACHIEVEMENTS: Record<AchievementType, Achievement> = {
  // 里程碑成就
  first_donation: {
    id: 'first_donation',
    name: '第一次施舍',
    description: '迈出第一步，开始你的施舍之旅',
    icon: '🎉',
    rarity: 'common',
    category: 'milestone',
    requirement: '完成1次施舍',
  },
  donation_count_10: {
    id: 'donation_count_10',
    name: '小有名气',
    description: '累计施舍10次，小猫开始认识你了',
    icon: '⭐',
    rarity: 'common',
    category: 'milestone',
    requirement: '累计施舍10次',
  },
  donation_count_50: {
    id: 'donation_count_50',
    name: '慷慨赞助商',
    description: '累计施舍50次，小猫的好朋友',
    icon: '🌟',
    rarity: 'rare',
    category: 'milestone',
    requirement: '累计施舍50次',
  },
  donation_count_100: {
    id: 'donation_count_100',
    name: '顶级金主',
    description: '累计施舍100次，小猫的VIP',
    icon: '👑',
    rarity: 'epic',
    category: 'milestone',
    requirement: '累计施舍100次',
  },

  // 金额成就
  amount_100: {
    id: 'amount_100',
    name: '百元俱乐部',
    description: '累计施舍达到100元',
    icon: '💰',
    rarity: 'rare',
    category: 'challenge',
    requirement: '累计金额100元',
  },
  amount_500: {
    id: 'amount_500',
    name: '五百元俱乐部',
    description: '累计施舍达到500元',
    icon: '💎',
    rarity: 'epic',
    category: 'challenge',
    requirement: '累计金额500元',
  },
  amount_1000: {
    id: 'amount_1000',
    name: '千元俱乐部',
    description: '累计施舍达到1000元，传说级金主',
    icon: '🏆',
    rarity: 'legendary',
    category: 'challenge',
    requirement: '累计金额1000元',
  },

  // 连续成就
  streak_7: {
    id: 'streak_7',
    name: '连续打卡7天',
    description: '连续7天都有施舍记录',
    icon: '📅',
    rarity: 'rare',
    category: 'challenge',
    requirement: '连续7天施舍',
  },
  streak_30: {
    id: 'streak_30',
    name: '月度坚持者',
    description: '连续30天都有施舍记录',
    icon: '🔥',
    rarity: 'epic',
    category: 'challenge',
    requirement: '连续30天施舍',
  },

  // 支付方式成就
  wechat_master: {
    id: 'wechat_master',
    name: '微信达人',
    description: '使用微信支付超过20次',
    icon: '💬',
    rarity: 'common',
    category: 'special',
    requirement: '微信支付20次',
  },
  alipay_master: {
    id: 'alipay_master',
    name: '支付宝达人',
    description: '使用支付宝支付超过20次',
    icon: '💙',
    rarity: 'common',
    category: 'special',
    requirement: '支付宝支付20次',
  },

  // 特殊成就
  early_bird: {
    id: 'early_bird',
    name: '早起的鸟儿',
    description: '在早上6-8点之间施舍',
    icon: '🐦',
    rarity: 'rare',
    category: 'special',
    requirement: '6-8点施舍',
  },
  night_owl: {
    id: 'night_owl',
    name: '夜猫子',
    description: '在晚上22点-凌晨2点之间施舍',
    icon: '🦉',
    rarity: 'rare',
    category: 'special',
    requirement: '22点-2点施舍',
  },
  generous: {
    id: 'generous',
    name: '超级慷慨',
    description: '单次施舍超过100元',
    icon: '🎁',
    rarity: 'epic',
    category: 'special',
    requirement: '单次>100元',
  },
  legendary: {
    id: 'legendary',
    name: '传说级赞助',
    description: '单次施舍超过500元，真正的传说',
    icon: '🌈',
    rarity: 'legendary',
    category: 'special',
    requirement: '单次>500元',
  },
};

/**
 * 成就稀有度配置
 */
export const RARITY_CONFIG: Record<AchievementRarity, {
  color: string;
  bgColor: string;
  borderColor: string;
  glow: string;
}> = {
  common: {
    color: '#a8cda2',
    bgColor: '#d0d3b2',
    borderColor: '#3d3d3d',
    glow: 'rgba(168, 205, 162, 0.3)',
  },
  rare: {
    color: '#4a9eff',
    bgColor: '#7eb8ff',
    borderColor: '#0066cc',
    glow: 'rgba(74, 158, 255, 0.5)',
  },
  epic: {
    color: '#9b59b6',
    bgColor: '#bb8fce',
    borderColor: '#8e44ad',
    glow: 'rgba(155, 89, 182, 0.6)',
  },
  legendary: {
    color: '#f39c12',
    bgColor: '#f5b041',
    borderColor: '#d68910',
    glow: 'rgba(243, 156, 18, 0.7)',
  },
};

/**
 * 计算成就进度
 */
export function calculateAchievementProgress(
  stats: DonationStats,
  records: DonationRecord[]
): Record<AchievementType, Achievement> {
  const achievements = { ...ACHIEVEMENTS };

  // 首次施舍
  if (stats.donationCount >= 1) {
    achievements.first_donation.unlocked = true;
  }

  // 施舍次数
  if (stats.donationCount >= 10) {
    achievements.donation_count_10.unlocked = true;
  }
  if (stats.donationCount >= 50) {
    achievements.donation_count_50.unlocked = true;
  }
  if (stats.donationCount >= 100) {
    achievements.donation_count_100.unlocked = true;
  }

  // 累计金额
  if (stats.totalAmount >= 100) {
    achievements.amount_100.unlocked = true;
  }
  if (stats.totalAmount >= 500) {
    achievements.amount_500.unlocked = true;
  }
  if (stats.totalAmount >= 1000) {
    achievements.amount_1000.unlocked = true;
  }

  // 支付方式
  if (stats.wechatCount >= 20) {
    achievements.wechat_master.unlocked = true;
  }
  if (stats.alipayCount >= 20) {
    achievements.alipay_master.unlocked = true;
  }

  // 特殊成就 - 需要检查记录
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  // 计算连续天数
  const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);
  let streak = 0;
  let checkDate = now;

  for (const record of sortedRecords) {
    const recordDate = new Date(record.timestamp).toDateString();
    const checkDateStr = new Date(checkDate).toDateString();

    if (recordDate === checkDateStr) {
      streak++;
      checkDate -= dayInMs;
    } else if (recordDate !== new Date(checkDate - dayInMs).toDateString()) {
      break;
    }
  }

  if (streak >= 7) {
    achievements.streak_7.unlocked = true;
  }
  if (streak >= 30) {
    achievements.streak_30.unlocked = true;
  }

  // 时间特殊成就
  records.forEach(record => {
    const hour = new Date(record.timestamp).getHours();

    // 早上6-8点
    if (hour >= 6 && hour < 8) {
      achievements.early_bird.unlocked = true;
    }

    // 晚上22点-凌晨2点
    if (hour >= 22 || hour < 2) {
      achievements.night_owl.unlocked = true;
    }

    // 大额施舍
    if (record.amount >= 100) {
      achievements.generous.unlocked = true;
    }
    if (record.amount >= 500) {
      achievements.legendary.unlocked = true;
    }
  });

  return achievements;
}

/**
 * 获取新解锁的成就
 */
export function getNewlyUnlockedAchievements(
  oldAchievements: Record<AchievementType, Achievement>,
  newAchievements: Record<AchievementType, Achievement>
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  Object.values(newAchievements).forEach(achievement => {
    if (
      achievement.unlocked &&
      !oldAchievements[achievement.id].unlocked
    ) {
      newlyUnlocked.push(achievement);
    }
  });

  return newlyUnlocked;
}
