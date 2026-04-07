# Cyber Beggar - Claude Context

## 项目概述
赛博乞讨网站 - 一个赛博朋克风格的纯前端乞讨网站，支持多语言、多主题、留言墙、自定义语录等功能。

## 技术栈
- **Next.js 16.2.1** (App Router)
- **React 19.2.4**
- **Tailwind CSS 4**
- **TypeScript 5**
- **ESLint 9**
- **LocalStorage** (数据持久化)

## 关键路径
- 主页面: `app/page.tsx`
- 配置: `config/app.config.ts`, `config/payment.config.ts`
- 类型定义: `types/index.ts`
- 国际化: `lib/i18n.ts` (8种语言)
- 主题配置: `lib/themes.ts` (4种主题)
- 存储层: `lib/storage.ts`, `lib/storage/core.ts`
- 状态管理: `hooks/useAppState.ts`

## 开发命令
```bash
npm run dev     # 开发服务器 (端口 3000)
npm run build   # 构建
npm run start   # 生产服务器
npm run lint    # ESLint 检查
```

## 重要约定
- 所有组件使用 TypeScript 严格模式
- 使用 JSDoc 文档规范 (见 `docs/JSDOC_GUIDELINES.md`)
- 数据持久化统一通过 `lib/storage.ts` 封装
- 国际化通过 `contexts/I18nContext.tsx` 提供
- 主题通过 `contexts/ThemeContext.tsx` 提供

## 二维码配置
- 微信: `public/vx.jpg`
- 支付宝: `public/zfb.jpg`
- 配置路径: `config/payment.config.ts`
