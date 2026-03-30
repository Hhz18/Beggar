import { DonationRecord, DonationStats, Message, CustomQuote } from '@/types';

const STORAGE_KEYS = {
  DONATION_RECORDS: 'cyber_beggar_donations',
  DONATION_STATS: 'cyber_beggar_stats',
  LAST_VISIT: 'cyber_beggar_last_visit',
  MESSAGES: 'cyber_beggar_messages',
  CUSTOM_QUOTES: 'cyber_beggar_custom_quotes',
};

// 获取所有施舍记录
export function getDonationRecords(): DonationRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.DONATION_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading donation records:', error);
    return [];
  }
}

// 保存施舍记录
export function saveDonationRecord(record: DonationRecord): void {
  if (typeof window === 'undefined') return;

  try {
    const records = getDonationRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.DONATION_RECORDS, JSON.stringify(records));

    // 更新统计数据
    updateStats(records);
  } catch (error) {
    console.error('Error saving donation record:', error);
  }
}

// 删除施舍记录
export function deleteDonationRecord(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const records = getDonationRecords().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.DONATION_RECORDS, JSON.stringify(records));

    // 更新统计数据
    updateStats(records);
  } catch (error) {
    console.error('Error deleting donation record:', error);
  }
}

// 清空所有记录
export function clearAllRecords(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.DONATION_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.DONATION_STATS);
  } catch (error) {
    console.error('Error clearing records:', error);
  }
}

// 获取统计数据
export function getDonationStats(): DonationStats {
  if (typeof window === 'undefined') {
    return {
      totalDonations: 0,
      totalAmount: 0,
      donationCount: 0,
      wechatCount: 0,
      alipayCount: 0,
      lastDonation: '',
      firstDonation: '',
    };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEYS.DONATION_STATS);
    return data ? JSON.parse(data) : {
      totalDonations: 0,
      totalAmount: 0,
      donationCount: 0,
      wechatCount: 0,
      alipayCount: 0,
      lastDonation: '',
      firstDonation: '',
    };
  } catch (error) {
    console.error('Error reading donation stats:', error);
    return {
      totalDonations: 0,
      totalAmount: 0,
      donationCount: 0,
      wechatCount: 0,
      alipayCount: 0,
      lastDonation: '',
      firstDonation: '',
    };
  }
}

// 更新统计数据
function updateStats(records: DonationRecord[]): void {
  if (typeof window === 'undefined') return;

  try {
    const stats: DonationStats = {
      totalDonations: records.length,
      totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
      donationCount: records.length,
      wechatCount: records.filter(r => r.paymentMethod === 'wechat').length,
      alipayCount: records.filter(r => r.paymentMethod === 'alipay').length,
      lastDonation: records.length > 0
        ? new Date(records[records.length - 1].timestamp).toLocaleString('zh-CN')
        : '',
      firstDonation: records.length > 0
        ? new Date(records[0].timestamp).toLocaleString('zh-CN')
        : '',
    };

    localStorage.setItem(STORAGE_KEYS.DONATION_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// 获取最后访问时间
export function getLastVisit(): string {
  if (typeof window === 'undefined') return '';

  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_VISIT) || '';
  } catch (error) {
    return '';
  }
}

// 更新最后访问时间
export function updateLastVisit(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, new Date().toISOString());
  } catch (error) {
    console.error('Error updating last visit:', error);
  }
}

// 初始化统计数据（从记录重建）
export function initializeStats(): void {
  if (typeof window === 'undefined') return;

  try {
    const records = getDonationRecords();
    const existingStats = localStorage.getItem(STORAGE_KEYS.DONATION_STATS);

    // 如果没有统计数据但有记录，重建统计
    if (!existingStats && records.length > 0) {
      updateStats(records);
    }
  } catch (error) {
    console.error('Error initializing stats:', error);
  }
}

// ============ 留言相关功能 ============

// 获取所有留言
export function getMessages(): Message[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading messages:', error);
    return [];
  }
}

// 保存留言
export function saveMessage(message: Omit<Message, 'id' | 'timestamp' | 'date' | 'likes'>): Message {
  if (typeof window === 'undefined') {
    return {} as Message;
  }

  try {
    const messages = getMessages();
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      likes: 0,
    };

    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));

    return newMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

// 点赞留言
export function likeMessage(messageId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const messages = getMessages();
    const messageIndex = messages.findIndex(m => m.id === messageId);

    if (messageIndex !== -1) {
      messages[messageIndex].likes += 1;
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  } catch (error) {
    console.error('Error liking message:', error);
  }
}

// 删除留言
export function deleteMessage(messageId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const messages = getMessages().filter(m => m.id !== messageId);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error('Error deleting message:', error);
  }
}

// ============ 自定义语录相关功能 ============

// 获取所有自定义语录
export function getCustomQuotes(): CustomQuote[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUOTES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading custom quotes:', error);
    return [];
  }
}

// 保存自定义语录
export function saveCustomQuote(quote: Omit<CustomQuote, 'id' | 'timestamp'>): CustomQuote {
  if (typeof window === 'undefined') {
    return {} as CustomQuote;
  }

  try {
    const quotes = getCustomQuotes();
    const newQuote: CustomQuote = {
      ...quote,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    quotes.push(newQuote);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUOTES, JSON.stringify(quotes));

    return newQuote;
  } catch (error) {
    console.error('Error saving custom quote:', error);
    throw error;
  }
}

// 删除自定义语录
export function deleteCustomQuote(quoteId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const quotes = getCustomQuotes().filter(q => q.id !== quoteId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUOTES, JSON.stringify(quotes));
  } catch (error) {
    console.error('Error deleting custom quote:', error);
  }
}

// 更新自定义语录
export function updateCustomQuote(quoteId: string, updates: Partial<Omit<CustomQuote, 'id' | 'timestamp'>>): void {
  if (typeof window === 'undefined') return;

  try {
    const quotes = getCustomQuotes();
    const quoteIndex = quotes.findIndex(q => q.id === quoteId);

    if (quoteIndex !== -1) {
      quotes[quoteIndex] = {
        ...quotes[quoteIndex],
        ...updates,
      };
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUOTES, JSON.stringify(quotes));
    }
  } catch (error) {
    console.error('Error updating custom quote:', error);
  }
}
