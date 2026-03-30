import { CatEmotion } from './index';

/**
 * 配饰类型
 */
export type AccessoryType =
  | 'hat'
  | 'glasses'
  | 'necklace'
  | 'bow'
  | 'earring'
  | 'scarf'
  | 'wings'
  | 'crown';

/**
 * 配饰接口
 */
export interface Accessory {
  id: string;
  name: string;
  type: AccessoryType;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockLevel: number;
  price?: number;
  svg?: string;
}

/**
 * 所有配饰定义
 */
export const ACCESSORIES: Record<string, Accessory> = {
  // 帽子
  red_scarf: {
    id: 'red_scarf',
    name: '红领巾',
    type: 'scarf',
    icon: '🧣',
    description: '鲜艳的红领巾',
    rarity: 'common',
    unlockLevel: 2,
    svg: `<rect x="3" y="8" width="6" height="1" fill="#ff6b6b" />`,
  },

  top_hat: {
    id: 'top_hat',
    name: '高礼帽',
    type: 'hat',
    icon: '🎩',
    description: '优雅的高礼帽',
    rarity: 'rare',
    unlockLevel: 3,
    svg: `<rect x="3" y="0" width="6" height="3" fill="#333" /><rect x="2" y="3" width="8" height="1" fill="#ff69b4" />`,
  },

  party_hat: {
    id: 'party_hat',
    name: '派对帽',
    type: 'hat',
    icon: '🎉',
    description: '彩色的派对帽',
    rarity: 'common',
    unlockLevel: 2,
    svg: `<polygon points="6,0 3,4 9,4" fill="#ffd700" /><rect x="3" y="4" width="6" height="1" fill="#ff69b4" />`,
  },

  wizard_hat: {
    id: 'wizard_hat',
    name: '巫师帽',
    type: 'hat',
    icon: '🧙',
    description: '神秘的巫师帽',
    rarity: 'epic',
    unlockLevel: 4,
    svg: `<polygon points="6,0 2,5 10,5" fill="#4a0080" /><polygon points="6,2 4,4 8,4" fill="#ff69b4" />`,
  },

  crown: {
    id: 'crown',
    name: '皇冠',
    type: 'hat',
    icon: '👑',
    description: '金色的皇冠',
    rarity: 'legendary',
    unlockLevel: 5,
    svg: `<rect x="3" y="0" width="6" height="1" fill="#ffd700" /><rect x="4" y="1" width="1" height="2" fill="#ffd700" /><rect x="7" y="1" width="1" height="2" fill="#ffd700" /><rect x="5" y="2" width="2" height="1" fill="#ff69b4" />`,
  },

  // 眼镜
  sunglasses: {
    id: 'sunglasses',
    name: '墨镜',
    type: 'glasses',
    icon: '🕶️',
    description: '酷炫的墨镜',
    rarity: 'rare',
    unlockLevel: 3,
    svg: `<rect x="3" y="4" width="2" height="1" fill="#333" /><rect x="7" y="4" width="2" height="1" fill="#333" /><rect x="5" y="4" width="2" height="1" fill="#333" />`,
  },

  heart_glasses: {
    id: 'heart_glasses',
    name: '爱心眼镜',
    type: 'glasses',
    icon: '🤓',
    description: '可爱的心形眼镜',
    rarity: 'epic',
    unlockLevel: 4,
    svg: `<circle cx="4" cy="4" r="0.5" fill="#ff69b4" /><circle cx="8" cy="4" r="0.5" fill="#ff69b4" />`,
  },

  // 领结/蝴蝶结
  bow_tie: {
    id: 'bow_tie',
    name: '蝴蝶结',
    type: 'bow',
    icon: '🎀',
    description: '可爱的蝴蝶结',
    rarity: 'common',
    unlockLevel: 3,
    svg: `<ellipse cx="6" cy="7" rx="1.5" ry="0.8" fill="#ff69b4" /><ellipse cx="6" cy="7" rx="0.5" ry="0.4" fill="#ffb6c1" />`,
  },

  // 项链
  pearl_necklace: {
    id: 'pearl_necklace',
    name: '珍珠项链',
    type: 'necklace',
    icon: '📿',
    description: '优雅的珍珠项链',
    rarity: 'rare',
    unlockLevel: 4,
    svg: `<circle cx="4" cy="8" r="0.3" fill="#fff" /><circle cx="6" cy="8" r="0.3" fill="#fff" /><circle cx="8" cy="8" r="0.3" fill="#fff" />`,
  },

  // 翅膀
  angel_wings: {
    id: 'angel_wings',
    name: '天使翅膀',
    type: 'wings',
    icon: '👼',
    description: '洁白的天使翅膀',
    rarity: 'legendary',
    unlockLevel: 5,
    svg: `<rect x="1" y="4" width="2" height="3" fill="#fff" opacity="0.8" /><rect x="9" y="4" width="2" height="3" fill="#fff" opacity="0.8" />`,
  },

  // 耳环
  star_earring: {
    id: 'star_earring',
    name: '星星耳环',
    type: 'earring',
    icon: '⭐',
    description: '闪亮的星星耳环',
    rarity: 'rare',
    unlockLevel: 4,
    svg: `<text x="1.5" y="3" font-size="1">⭐</text><text x="9.5" y="3" font-size="1">⭐</text>`,
  },
};

/**
 * 配饰颜色配置
 */
export const ACCESSORY_RARITY_COLORS = {
  common: {
    bg: '#d0d3b2',
    border: '#3d3d3d',
    glow: 'rgba(168, 205, 162, 0.3)',
  },
  rare: {
    bg: '#7eb8ff',
    border: '#0066cc',
    glow: 'rgba(74, 158, 255, 0.5)',
  },
  epic: {
    bg: '#bb8fce',
    border: '#8e44ad',
    glow: 'rgba(155, 89, 182, 0.6)',
  },
  legendary: {
    bg: '#f5b041',
    border: '#d68910',
    glow: 'rgba(243, 156, 18, 0.7)',
  },
};

/**
 * 根据等级获取可用配饰
 */
export function getAccessoriesByLevel(level: number): Accessory[] {
  return Object.values(ACCESSORIES).filter(
    accessory => accessory.unlockLevel <= level
  );
}

/**
 * 获取配饰SVG
 */
export function getAccessorySVG(accessoryId: string): string | undefined {
  return ACCESSORIES[accessoryId]?.svg;
}
