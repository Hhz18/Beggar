import { Quote } from '@/types';
import { getCustomQuotes } from '@/lib/storage';

export const quotes: Quote[] = [
  // 搞笑类
  {
    text: "感谢施舍！小猫今晚加鸡腿 🍗",
    category: 'funny'
  },
  {
    text: "老板大气！祝老板身体健康！",
    category: 'funny'
  },
  {
    text: "感谢老板！小猫给您磕头了 🙏",
    category: 'funny'
  },
  {
    text: "收到！小猫的猫粮有着落了 🐱",
    category: 'funny'
  },
  {
    text: "老板威武！小猫为您唱首赞歌 🎵",
    category: 'funny'
  },
  {
    text: "感谢施舍！老板好人一生平安 ❤️",
    category: 'funny'
  },
  {
    text: "哇！老板太慷慨了！小猫感动哭了 🥹",
    category: 'funny'
  },
  {
    text: "谢谢老板！小猫记住您的大恩大德！",
    category: 'funny'
  },
  {
    text: "收到！小猫的罐头有着落了 🐟",
    category: 'funny'
  },
  {
    text: "感谢老板！您就是小猫的再生父母！",
    category: 'funny'
  },

  // 感人类
  {
    text: "您的善意，温暖了整个互联网 🌟",
    category: 'touching'
  },
  {
    text: "感谢您的慷慨，世界因您而美好",
    category: 'touching'
  },
  {
    text: "每一份善意都值得被铭记 💝",
    category: 'touching'
  },
  {
    text: "谢谢您，让小猫相信人性的美好",
    category: 'touching'
  },
  {
    text: "您的善举，小猫永生难忘",
    category: 'touching'
  },
  {
    text: "感恩有您，温暖同行",
    category: 'touching'
  },
  {
    text: "您的支持，是小猫前进的动力",
    category: 'touching'
  },
  {
    text: "谢谢您，让这个世界多了一份温暖",
    category: 'touching'
  },

  // 可爱类
  {
    text: "喵~ 谢谢老板！( =^･ω･^= )",
    category: 'cute'
  },
  {
    text: "喵呜~ 感谢施舍！ (●'◡'●)",
    category: 'cute'
  },
  {
    text: "谢谢老板！小猫比心 ❤️ ( =^･ω･^= )❤️",
    category: 'cute'
  },
  {
    text: "喵~ 老板最好啦！🎀",
    category: 'cute'
  },
  {
    text: "收到！小猫开心得转圈圈 🌀",
    category: 'cute'
  },
  {
    text: "喵呜~ 感激不尽！🙏",
    category: 'cute'
  },
  {
    text: "谢谢老板！小猫为您比心 💝",
    category: 'cute'
  },
  {
    text: "喵~ 老板是小猫的偶像！⭐",
    category: 'cute'
  },

  // 哲理类
  {
    text: "施舍不仅是给予，更是爱的传递",
    category: 'philosophical'
  },
  {
    text: "感谢您的善意，它将传递给更多人",
    category: 'philosophical'
  },
  {
    text: "每一个善举，都在点亮这个世界",
    category: 'philosophical'
  },
  {
    text: "谢谢您，证明了网络世界的温暖",
    category: 'philosophical'
  },
  {
    text: "您的慷慨，是对善意的最好回应",
    category: 'philosophical'
  },
];

// 获取所有语录（包括系统语录和自定义语录）
function getAllQuotes(): Quote[] {
  const systemQuotes = [...quotes];
  const customQuotes = getCustomQuotes();

  // 合并系统语录和自定义语录
  return [...systemQuotes, ...customQuotes.map(q => ({
    text: q.text,
    category: q.category
  }))];
}

// 获取随机语录
export function getRandomQuote(): Quote {
  const allQuotes = getAllQuotes();

  if (allQuotes.length === 0) {
    // 如果没有任何语录（不太可能），返回默认语录
    return quotes[0];
  }

  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
}

// 根据分类获取语录
export function getQuoteByCategory(category: Quote['category']): Quote {
  const allQuotes = getAllQuotes();
  const categoryQuotes = allQuotes.filter(q => q.category === category);

  if (categoryQuotes.length === 0) {
    // 如果该分类没有语录，返回随机语录
    return getRandomQuote();
  }

  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
}
