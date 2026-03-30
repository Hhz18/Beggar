import { CatEmotion } from './index';

/**
 * 小猫等级配置
 */
export interface CatLevel {
  level: number;
  name: string;
  minExp: number;
  maxExp: number;
  unlockedEmotions: CatEmotion[];
  unlockedAccessories: string[];
  bonusMultiplier: number;
  color: string;
}

/**
 * 所有等级配置
 */
export const CAT_LEVELS: CatLevel[] = [
  {
    level: 1,
    name: '流浪小猫',
    minExp: 0,
    maxExp: 100,
    unlockedEmotions: ['normal'],
    unlockedAccessories: [],
    bonusMultiplier: 1.0,
    color: '#d0d3b2',
  },
  {
    level: 2,
    name: '开心小猫',
    minExp: 100,
    maxExp: 300,
    unlockedEmotions: ['normal', 'happy'],
    unlockedAccessories: ['红领巾'],
    bonusMultiplier: 1.1,
    color: '#a8cda2',
  },
  {
    level: 3,
    name: '活力小猫',
    minExp: 300,
    maxExp: 600,
    unlockedEmotions: ['normal', 'happy', 'excited'],
    unlockedAccessories: ['红领巾', '蝴蝶结'],
    bonusMultiplier: 1.2,
    color: '#ffd700',
  },
  {
    level: 4,
    name: '活力小猫',
    minExp: 600,
    maxExp: 1000,
    unlockedEmotions: ['normal', 'happy', 'excited'],
    unlockedAccessories: ['红领巾', '蝴蝶结', '小帽子'],
    bonusMultiplier: 1.3,
    color: '#4a9eff',
  },
  {
    level: 5,
    name: '传说小猫',
    minExp: 1000,
    maxExp: Infinity,
    unlockedEmotions: ['normal', 'happy', 'excited'],
    unlockedAccessories: ['红领巾', '蝴蝶结', '小帽子', '皇冠', '墨镜'],
    bonusMultiplier: 1.5,
    color: '#9b59b6',
  },
];

/**
 * 用户小猫数据
 */
export interface UserCatData {
  level: number;
  exp: number;
  selectedAccessory: string | null;
  totalDonations: number;
  lastInteraction: number;
}

/**
 * 根据经验值计算等级
 */
export function calculateLevel(exp: number): CatLevel {
  for (let i = CAT_LEVELS.length - 1; i >= 0; i--) {
    if (exp >= CAT_LEVELS[i].minExp) {
      return CAT_LEVELS[i];
    }
  }
  return CAT_LEVELS[0];
}

/**
 * 获取下一级所需经验
 */
export function getExpToNextLevel(currentExp: number): number {
  const currentLevel = calculateLevel(currentExp);
  if (currentLevel.level >= CAT_LEVELS.length) {
    return 0; // 已达最高等级
  }
  const nextLevel = CAT_LEVELS[currentLevel.level]; // level是1-based，但数组是0-based
  return nextLevel.maxExp - currentExp;
}

/**
 * 计算当前等级进度百分比
 */
export function getLevelProgress(exp: number): number {
  const currentLevel = calculateLevel(exp);
  if (currentLevel.level >= CAT_LEVELS.length) {
    return 100;
  }
  const levelRange = currentLevel.maxExp - currentLevel.minExp;
  const currentLevelExp = exp - currentLevel.minExp;
  return Math.min((currentLevelExp / levelRange) * 100, 100);
}

/**
 * 计算获得的经验值
 */
export function calculateExpGained(
  amount: number,
  currentLevel: CatLevel
): number {
  const baseExp = Math.floor(amount * 10);
  return Math.floor(baseExp * currentLevel.bonusMultiplier);
}
