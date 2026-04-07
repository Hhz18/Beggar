# 赛博乞讨网站 🐱💰

一个赛博朋克风格的乞讨网站，支持多语言、多主题、留言墙、自定义语录等功能。

## 🎨 设计特色

- **像素风格 UI**：使用像素字体和像素化设计
- **像素小猫**：可爱的像素小猫动画，支持多种情绪状态和点击互动
- **多支付方式**：支持微信、支付宝等多个支付平台
- **4 种主题**：Light / Dark / Rainbow / Cyberpunk
- **8 种语言**：中文 / English / 日本語 / 한국어 / Français / Español / Deutsch / Português
- **响应式设计**：完美适配手机和电脑，支持 PWA

## 🚀 快速开始

### 1. 开发环境运行

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果

### 2. 添加你的二维码

将你的收款二维码图片放到 `public` 文件夹中：

- 微信收款码：命名为 `vx.jpg`
- 支付宝收款码：命名为 `zfb.jpg`

如需修改二维码文件名，在 `config/payment.config.ts` 中更新 `PAYMENT_METHODS` 配置：

```typescript
export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'wechat',
    nameKey: 'payment.wechat',
    color: '#a8cda2',
    qrCode: '/vx.jpg',  // 修改为你的微信二维码路径
    priority: 1,
  },
  {
    id: 'alipay',
    nameKey: 'payment.alipay',
    color: '#d0d3b2',
    qrCode: '/zfb.jpg',  // 修改为你的支付宝二维码路径
    priority: 2,
  },
];
```

### 3. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

或者直接在 [Vercel](https://vercel.com) 上导入你的 GitHub 仓库。

## 📦 技术栈

- **Next.js 16** (App Router) - React 框架
- **React 19** - UI 库
- **Tailwind CSS 4** - 样式框架
- **TypeScript 5** - 类型安全
- **Google Fonts** - 像素字体 (Press Start 2P)
- **LocalStorage** - 数据持久化

## 📁 项目结构

```
cyber-beggar/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 主页面
│   ├── layout.tsx          # 布局
│   ├── providers.tsx       # 全局 Provider
│   ├── globals.css         # 全局样式
│   └── manifest.json       # PWA 配置
├── components/             # React 组件
│   ├── Cat/                # 像素小猫
│   ├── Feedback/           # 感谢弹窗、施舍输入、留言墙、自定义语录
│   ├── I18n/               # 语言切换、字体切换
│   ├── Payment/            # 快速支付按钮
│   ├── Stats/              # 统计面板
│   └── Theme/              # 主题切换
├── config/                 # 应用配置
│   ├── app.config.ts       # 应用常量、功能开关
│   └── payment.config.ts   # 支付方式配置
├── contexts/               # React Context
│   ├── I18nContext.tsx     # 国际化上下文
│   ├── LanguageContext.tsx # 语言上下文
│   └── ThemeContext.tsx    # 主题上下文
├── data/
│   └── quotes.ts           # 感谢语录库
├── hooks/                  # 自定义 Hooks
│   ├── useAppState.ts      # 应用状态管理
│   ├── useCountUp.ts       # 数字滚动
│   ├── useDonationHandler.ts # 施舍处理
│   ├── usePaymentMethods.ts  # 支付方式
│   └── useTimeGreeting.ts    # 时间问候
├── lib/                    # 工具库
│   ├── errorHandling.ts    # 错误处理
│   ├── i18n.ts             # 翻译管理器（8种语言）
│   ├── storage.ts          # LocalStorage 封装
│   ├── themes.ts           # 主题配置（4种主题）
│   └── utils/              # 工具函数
├── types/
│   └── index.ts            # TypeScript 类型定义
├── public/                 # 静态资源（二维码图片等）
└── scripts/
    └── verify-refactoring.sh # 重构验证脚本
```

## 🎯 功能清单

### ✅ 已实现

- **施舍系统**：多支付方式、自定义金额、预设金额快捷选项、施舍记录存储
- **像素小猫**：SVG 像素化绘制、多种情绪状态、点击互动、时间段自动状态
- **统计数据**：基础统计面板、数据持久化、实时数据更新
- **主题系统**：4 种主题（Light/Dark/Rainbow/Cyberpunk）、实时切换、持久化存储
- **留言系统**：留言输入、留言墙展示、点赞功能、背景留言
- **语录系统**：50+ 内置语录、4 种分类、自定义语录编辑
- **国际化**：8 种语言支持、语言切换器、字体切换器
- **响应式设计**：移动端适配、PWA 配置、移动端统计面板

## 📝 许可证

MIT License - 自由使用和修改

---

Made with ❤️ for cyber beggars everywhere
