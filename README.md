# 赛博乞讨网站 🐱💰

一个纯前端的赛博朋克风格乞讨网站，支持展示多个收款二维码。

## 🎨 设计特色

- **像素风格 UI**：使用像素字体和像素化设计
- **像素小猫**：可爱的像素小猫动画
- **多二维码支持**：支持微信、支付宝等多个支付平台
- **响应式设计**：完美适配手机和电脑
- **淡橙黄色系**：温暖舒适的配色方案

## 🚀 快速开始

### 1. 开发环境运行

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果

### 2. 添加你的二维码

将你的收款二维码图片放到 `public` 文件夹中：

- 微信收款码：命名为 `qr-wechat.png`
- 支付宝收款码：命名为 `qr-alipay.png`

如果你有其他支付方式，可以在 `app/page.tsx` 中的 `paymentMethods` 数组添加：

```typescript
{
  id: "your-payment-id",
  name: "显示名称",
  color: "#d0d3b2",
  qrCode: "/your-qr-image.png",
}
```

### 3. 修改二维码显示

在 `app/page.tsx` 中，找到二维码显示区域（第 105 行左右），将占位文本替换为：

```tsx
<Image
  src={paymentMethods.find((m) => m.id === selectedQr)?.qrCode || ""}
  alt="收款二维码"
  width={200}
  height={200}
  className="w-full h-full"
/>
```

### 4. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

或者直接在 [Vercel](https://vercel.com) 上导入你的 GitHub 仓库。

## 🎨 自定义配色

当前使用的配色方案：

- 主背景色：`#ebf1d6` (淡黄绿)
- 辅助色 1：`#a8cda2` (浅绿)
- 辅助色 2：`#d0d3b2` (米黄)
- 文字色：`#3d3d3d` (深灰)

你可以在 `app/globals.css` 中修改这些颜色。

## 📦 技术栈

- **Next.js 16** - React 框架
- **React 19** - UI 库
- **Tailwind CSS 4** - 样式框架
- **TypeScript** - 类型安全
- **Google Fonts** - 像素字体 (Press Start 2P)

## 📝 许可证

MIT License - 自由使用和修改

---

Made with ❤️ for cyber beggars everywhere
