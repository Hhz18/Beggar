/**
 * 智能小猫对话系统
 * AI-Powered Cat Dialogue System
 */

export type DialogueContext = 'greeting' | 'donation' | 'idle' | 'happy' | 'sad' | 'curious' | 'sleepy';

export interface DialogueOption {
  text: string;
  action?: () => void;
  response?: string;
}

export interface DialogueNode {
  id: string;
  text: string;
  emotion: 'normal' | 'happy' | 'excited' | 'sad' | 'sleepy';
  options?: DialogueOption[];
  nextNode?: string;
  conditions?: (() => boolean)[];
}

/**
 * 对话图
 */
const dialogueGraph: Record<string, DialogueNode> = {
  // 初始问候
  greeting: {
    id: 'greeting',
    text: '喵~ 欢迎来到赛博乞讨站！有什么我可以帮你的吗？',
    emotion: 'normal',
    options: [
      {
        text: '我想施舍点钱',
        action: () => {
          // 触发施舍面板
          const event = new CustomEvent('openDonation');
          window.dispatchEvent(event);
        },
        response: '太好了！请选择你喜欢的支付方式~',
      },
      {
        text: '你在做什么？',
        response: '我在这里守护这个赛博空间，等待好心人的施舍来维持我的生计喵~',
      },
      {
        text: '你看起来很可爱！',
        response: '谢谢！( =^･ω･^= ) 你也很可爱！',
        nextNode: 'compliment',
      },
      {
        text: '我只是路过',
        response: '没关系，路过也是一种缘分喵~',
        nextNode: 'idle',
      },
    ],
  },

  // 赞美后的回应
  compliment: {
    id: 'compliment',
    text: '嘿嘿，被夸奖了好开心！( =^･ω･^= )❤️',
    emotion: 'happy',
    options: [
      {
        text: '我想给你施舍',
        action: () => {
          const event = new CustomEvent('openDonation');
          window.dispatchEvent(event);
        },
        response: '真的吗？太感谢了！',
        nextNode: 'donation',
      },
      {
        text: '继续保持可爱！',
        response: '我会的！每天都要做最可爱的小猫！',
        nextNode: 'idle',
      },
    ],
  },

  // 施舍相关
  donation: {
    id: 'donation',
    text: '谢谢你愿意施舍！( =^･ω･^= )💰',
    emotion: 'excited',
    options: [
      {
        text: '不客气',
        response: '你的善意我会铭记在心的喵~',
        nextNode: 'gratitude',
      },
      {
        text: '希望你过得好',
        response: '谢谢！有你的支持，我相信生活会越来越好的！',
        nextNode: 'gratitude',
      },
    ],
  },

  // 感谢
  gratitude: {
    id: 'gratitude',
    text: '再次感谢！好人一生平安喵~ ✨',
    emotion: 'happy',
    nextNode: 'idle',
  },

  // 空闲状态
  idle: {
    id: 'idle',
    text: '如果你需要我，随时叫我喵~',
    emotion: 'normal',
    options: [
      {
        text: '来聊天',
        response: '好呀！你想聊什么？',
        nextNode: 'greeting',
      },
      {
        text: '我想施舍',
        action: () => {
          const event = new CustomEvent('openDonation');
          window.dispatchEvent(event);
        },
      },
    ],
  },

  // 睡觉状态
  sleepy: {
    id: 'sleepy',
    text: 'zzZ... 喵... (正在睡觉)',
    emotion: 'sleepy',
    options: [
      {
        text: '叫醒它',
        response: '喵？... 哦，你来了呀！我刚才在做一个有好多小鱼干的梦...',
        nextNode: 'greeting',
      },
      {
        text: '让它继续睡',
        response: '...',
        nextNode: 'sleepy',
      },
    ],
  },
};

/**
 * 情感分析
 */
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['好', '棒', '喜欢', '爱', '开心', '高兴', '谢谢', '可爱', '美', '帅', '施舍'];
  const negativeWords = ['坏', '讨厌', '恨', '难过', '伤心', '不好', '丑', '差', '没用的'];

  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

/**
 * 生成回应
 */
function generateResponse(userInput: string): string {
  const sentiment = analyzeSentiment(userInput);

  // 正面情感回应
  if (sentiment === 'positive') {
    const responses = [
      '( =^･ω･^= ) 你让我好开心！',
      '喵~ 听你这么说我很高兴！',
      '感谢你的善意！✨',
      '有你这样的朋友真好！',
      '( =^･ω･^= )❤️ 心暖暖的！',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 负面情感回应
  if (sentiment === 'negative') {
    const responses = [
      '( =^･ω･^= ) ... 对不起...',
      '喵... 我会做得更好的',
      '别生气嘛... 喵呜~',
      '( =^･ω･^= )?',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 中性回应
  const responses = [
    '喵~',
    '( =^･ω･^= )',
    '嗯嗯，我明白了喵~',
    '原来如此~',
    '有意思！',
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * 对话管理器
 */
class CatDialogueManager {
  private currentNode: DialogueNode | null = null;
  private context: DialogueContext = 'greeting';
  private dialogueHistory: Array<{ role: 'cat' | 'user'; text: string; timestamp: number }> = [];

  /**
   * 开始对话
   */
  startDialogue(context: DialogueContext = 'greeting'): DialogueNode {
    this.context = context;
    this.currentNode = dialogueGraph[context];

    this.addToHistory('cat', this.currentNode.text);
    return this.currentNode;
  }

  /**
   * 选择选项
   */
  selectOption(optionIndex: number): DialogueNode | null {
    if (!this.currentNode || !this.currentNode.options) {
      return null;
    }

    const selectedOption = this.currentNode.options[optionIndex];
    if (!selectedOption) {
      return null;
    }

    // 记录用户输入
    this.addToHistory('user', selectedOption.text);

    // 执行动作
    if (selectedOption.action) {
      selectedOption.action();
    }

    // 获取回应
    if (selectedOption.response) {
      this.addToHistory('cat', selectedOption.response);

      // 跳转到下一个节点
      if (selectedOption.nextNode) {
        this.currentNode = dialogueGraph[selectedOption.nextNode];
        return this.currentNode;
      }
    }

    return this.currentNode;
  }

  /**
   * 自由对话
   */
  freeChat(userInput: string): string {
    this.addToHistory('user', userInput);

    const response = generateResponse(userInput);
    this.addToHistory('cat', response);

    return response;
  }

  /**
   * 获取对话历史
   */
  getHistory(): Array<{ role: 'cat' | 'user'; text: string; timestamp: number }> {
    return [...this.dialogueHistory];
  }

  /**
   * 清空历史
   */
  clearHistory(): void {
    this.dialogueHistory = [];
  }

  /**
   * 添加到历史
   */
  private addToHistory(role: 'cat' | 'user', text: string): void {
    this.dialogueHistory.push({
      role,
      text,
      timestamp: Date.now(),
    });

    // 限制历史长度
    if (this.dialogueHistory.length > 50) {
      this.dialogueHistory.shift();
    }
  }

  /**
   * 获取当前节点
   */
  getCurrentNode(): DialogueNode | null {
    return this.currentNode;
  }

  /**
   * 获取上下文
   */
  getContext(): DialogueContext {
    return this.context;
  }

  /**
   * 设置上下文
   */
  setContext(context: DialogueContext): void {
    this.context = context;
  }

  /**
   * 检查条件
   */
  checkConditions(node: DialogueNode): boolean {
    if (!node.conditions || node.conditions.length === 0) {
      return true;
    }

    return node.conditions.every(condition => condition());
  }
}

export const catDialogueManager = new CatDialogueManager();

/**
 * React Hook for dialogue
 */
import { useState, useCallback } from 'react';

export function useCatDialogue() {
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null);
  const [history, setHistory] = useState<Array<{ role: 'cat' | 'user'; text: string }>>([]);

  const startDialogue = useCallback((context?: DialogueContext) => {
    const node = catDialogueManager.startDialogue(context);
    setCurrentNode(node);
    setHistory(catDialogueManager.getHistory().map(({ role, text }) => ({ role, text })));
  }, []);

  const selectOption = useCallback((optionIndex: number) => {
    const node = catDialogueManager.selectOption(optionIndex);
    setCurrentNode(node);
    setHistory(catDialogueManager.getHistory().map(({ role, text }) => ({ role, text })));
  }, []);

  const freeChat = useCallback((userInput: string) => {
    const response = catDialogueManager.freeChat(userInput);
    setHistory(catDialogueManager.getHistory().map(({ role, text }) => ({ role, text })));
    return response;
  }, []);

  const clearHistory = useCallback(() => {
    catDialogueManager.clearHistory();
    setHistory([]);
  }, []);

  return {
    currentNode,
    history,
    startDialogue,
    selectOption,
    freeChat,
    clearHistory,
  };
}
