/**
 * 通知系统类型定义
 */

export type NotificationType = 'achievement' | 'level' | 'donation' | 'message' | 'error' | 'info' | 'success' | 'warning';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: NotificationPriority;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  data?: Record<string, unknown>;
  expiresAt?: number;
}

export interface NotificationSettings {
  enabled: boolean;
  browserNotifications: boolean;
  inAppNotifications: boolean;
  soundEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
  preferences: {
    [key in NotificationType]?: boolean;
  };
}

export interface NotificationHistory {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  browserNotifications: false,
  inAppNotifications: true,
  soundEnabled: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  preferences: {
    achievement: true,
    level: true,
    donation: true,
    message: true,
    error: true,
    info: true,
    success: true,
    warning: true,
  },
};
