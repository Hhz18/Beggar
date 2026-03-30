/**
 * Keyboard Shortcuts Manager
 * 键盘快捷键管理系统
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  category: 'navigation' | 'action' | 'toggle' | 'special';
  action: () => void;
}

class KeyboardShortcutManager {
  private shortcuts: KeyboardShortcut[] = [
    {
      key: '?',
      description: '显示快捷键帮助',
      category: 'special',
      action: () => {
        // 这个快捷键由使用此管理器的组件处理
      },
    },
    {
      key: 'd',
      description: '切换施舍输入',
      category: 'toggle',
      action: () => {},
    },
    {
      key: 'h',
      description: '打开/关闭统计面板',
      category: 'toggle',
      action: () => {},
    },
    {
      key: 'm',
      description: '打开/关闭留言墙',
      category: 'toggle',
      action: () => {},
    },
    {
      key: 's',
      description: '打开分享面板',
      category: 'action',
      action: () => {},
    },
    {
      key: 't',
      description: '切换主题',
      category: 'toggle',
      action: () => {},
    },
    {
      key: 'l',
      description: '切换语言',
      category: 'toggle',
      action: () => {},
    },
  ];

  getAllShortcuts(): KeyboardShortcut[] {
    return this.shortcuts;
  }

  getShortcutsByCategory(category: KeyboardShortcut['category']): KeyboardShortcut[] {
    return this.shortcuts.filter(s => s.category === category);
  }

  registerShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
  }

  unregisterShortcut(key: string): void {
    this.shortcuts = this.shortcuts.filter(s => s.key !== key);
  }
}

export const keyboardShortcutManager = new KeyboardShortcutManager();

/**
 * 格式化快捷键显示
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.metaKey) parts.push('Meta');

  parts.push(shortcut.key.toUpperCase());

  return parts.join(' + ');
}

/**
 * 检查事件是否匹配快捷键
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    !!event.ctrlKey === !!shortcut.ctrlKey &&
    !!event.shiftKey === !!shortcut.shiftKey &&
    !!event.altKey === !!shortcut.altKey &&
    !!event.metaKey === !!shortcut.metaKey
  );
}
