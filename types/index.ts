// 支付方式类型
export type PaymentMethod = 'wechat' | 'alipay';

// 施舍记录类型
export interface DonationRecord {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  timestamp: number;
  date: string;
}

// 统计数据类型
export interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  donationCount: number;
  wechatCount: number;
  alipayCount: number;
  lastDonation: string;
  firstDonation: string;
}

// 感谢语录类型
export interface Quote {
  text: string;
  category: 'funny' | 'touching' | 'cute' | 'philosophical';
}

// 小猫状态类型
export type CatEmotion = 'happy' | 'excited' | 'normal' | 'sad' | 'sleepy';

// 主题类型
export type Theme = 'light' | 'dark' | 'rainbow' | 'cyberpunk';

// 留言类型
export interface Message {
  id: string;
  content: string;
  nickname: string;
  timestamp: number;
  date: string;
  likes: number;
}

// 自定义语录类型
export interface CustomQuote {
  id: string;
  text: string;
  category: Quote['category'];
  timestamp: number;
}
