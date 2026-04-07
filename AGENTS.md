<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cyber Beggar - Agent Guidelines

## 项目概述
赛博乞讨网站 - 一个赛博朋克风格的纯前端乞讨网站。

## 技术栈
- Next.js 16.2.1 (App Router)
- React 19.2.4
- Tailwind CSS 4
- TypeScript 5
- ESLint 9

## 开发命令
```bash
npm run dev     # 开发 (端口 3000)
npm run build   # 构建
npm run start   # 生产
npm run lint    # 检查
```

## 代码规范
- TypeScript 严格模式
- 所有导出函数/组件使用 JSDoc (见 `docs/JSDOC_GUIDELINES.md`)
- 组件使用函数式组件 + hooks
- 数据持久化统一通过 `lib/storage.ts`
- 国际化通过 `contexts/I18nContext.tsx`
- 主题通过 `contexts/ThemeContext.tsx`

## 重要约定
1. **不要**直接在组件中访问 localStorage，使用 `lib/storage.ts`
2. **不要**硬编码翻译文本，使用 `useI18n()` hook
3. **不要**硬编码颜色值，使用 `lib/themes.ts` 或 Tailwind 类
4. 二维码路径配置在 `config/payment.config.ts`
5. 应用常量配置在 `config/app.config.ts`

## 项目结构
```
app/          - Next.js 页面和布局
components/   - React 组件
config/       - 应用配置
contexts/     - React Context (I18n, Theme, Language)
data/         - 静态数据 (quotes)
hooks/        - 自定义 Hooks
lib/          - 工具库 (storage, i18n, themes, errorHandling)
types/        - TypeScript 类型定义
public/       - 静态资源
scripts/      - 脚本文件
```
