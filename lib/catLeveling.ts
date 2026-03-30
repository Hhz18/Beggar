import { UserCatData } from '@/types/leveling';
import { calculateLevel } from '@/types/leveling';

const STORAGE_KEY = 'cyber_beggar_cat_data';

/**
 * 获取小猫数据
 */
export function getCatData(): UserCatData {
  if (typeof window === 'undefined') {
    return {
      level: 1,
      exp: 0,
      selectedAccessory: null,
      totalDonations: 0,
      lastInteraction: Date.now(),
    };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading cat data:', error);
  }

  return {
    level: 1,
    exp: 0,
    selectedAccessory: null,
    totalDonations: 0,
    lastInteraction: Date.now(),
  };
}

/**
 * 保存小猫数据
 */
export function saveCatData(data: UserCatData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving cat data:', error);
  }
}

/**
 * 添加经验值
 * 返回是否升级
 */
export function addExp(amount: number): boolean {
  const catData = getCatData();
  const currentLevel = calculateLevel(catData.exp);

  const newExp = catData.exp + amount;
  const newLevel = calculateLevel(newExp);

  catData.exp = newExp;
  catData.level = newLevel.level;
  catData.lastInteraction = Date.now();

  saveCatData(catData);

  return newLevel.level > currentLevel.level;
}

/**
 * 更新小猫互动
 */
export function updateCatInteraction(): void {
  const catData = getCatData();
  catData.lastInteraction = Date.now();
  catData.totalDonations++;
  saveCatData(catData);
}

/**
 * 选择配饰
 */
export function selectAccessory(accessory: string | null): void {
  const catData = getCatData();
  catData.selectedAccessory = accessory;
  saveCatData(catData);
}
