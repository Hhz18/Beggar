"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PixelCat from "@/components/Cat/PixelCat";
import ThankYouModal from "@/components/Feedback/ThankYouModal";
import DonationInput from "@/components/Feedback/DonationInput";
import StatsPanel from "@/components/Stats/StatsPanel";
import MessageWall from "@/components/Feedback/MessageWall";
import MessageBackground from "@/components/Feedback/MessageBackground";
import CustomQuoteEditor from "@/components/Feedback/CustomQuoteEditor";
import ThemeSwitcher from "@/components/Theme/ThemeSwitcher";
import LanguageSwitcher from "@/components/I18n/LanguageSwitcherClient";
import FontSwitcher from "@/components/I18n/FontSwitcher";
import QuickPaymentButton from "@/components/Payment/QuickPaymentButton";
import { CatEmotion, PaymentMethod } from "@/types";
import { saveDonationRecord, initializeStats, updateLastVisit } from "@/lib/storage";
import { useTimeGreeting } from "@/hooks";
import { useI18n } from "@/contexts/I18nContext";

export default function Home() {
  const { t, locale } = useI18n();
  const [selectedQr, setSelectedQr] = useState<PaymentMethod | null>(null);
  const [catEmotion, setCatEmotion] = useState<CatEmotion>("normal");
  const [showThankYou, setShowThankYou] = useState(false);
  const [showMessageWall, setShowMessageWall] = useState(false);
  const [showCustomQuotes, setShowCustomQuotes] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [lastDonation, setLastDonation] = useState<{ amount: number; method: string } | null>(null);

  // 使用时间段问候Hook
  const timeGreeting = useTimeGreeting();

  const paymentMethods = [
    {
      id: "wechat" as PaymentMethod,
      name: t('payment.wechat'),
      color: "#a8cda2",
      qrCode: "/vx.jpg",
    },
    {
      id: "alipay" as PaymentMethod,
      name: t('payment.alipay'),
      color: "#d0d3b2",
      qrCode: "/zfb.jpg",
    },
  ];

  useEffect(() => {
    // 初始化统计数据
    initializeStats();
    updateLastVisit();

    // 设置小猫的初始情绪为时间段对应的情绪
    setCatEmotion(timeGreeting.emotion);
  }, []);

  const handleDonate = (amount: number, methodId: PaymentMethod) => {
    // 保存施舍记录
    const record = {
      id: Date.now().toString(),
      amount,
      paymentMethod: methodId,
      timestamp: Date.now(),
      date: new Date().toLocaleString(locale),
    };
    saveDonationRecord(record);

    // 设置小猫情绪
    const emotions: CatEmotion[] = ['happy', 'excited'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCatEmotion(randomEmotion);

    // 显示感谢弹窗
    setLastDonation({
      amount,
      method: paymentMethods.find(m => m.id === methodId)?.name || '',
    });
    setShowThankYou(true);

    // 3秒后重置小猫情绪
    setTimeout(() => {
      setCatEmotion('normal');
    }, 3000);
  };

  const handleCloseModal = () => {
    setShowThankYou(false);
  };

  return (
    <div className="min-h-screen bg-[#ebf1d6]">
        {/* 动态字体切换器 */}
        <FontSwitcher />

        {/* 背景留言墙 */}
        <MessageBackground aria-hidden="true" />

      {/* 主容器 */}
      <div className="flex items-start min-h-screen" role="main">
        {/* 内容区域 */}
        <div className="flex-1 max-w-4xl p-3 md:p-8 pt-6 mx-auto">
          {/* 移动端顶部栏 */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="时间图标">
                {timeGreeting.emoji}
              </span>
              <span className="text-xs text-[#5a5a5a] font-pixel">
                {new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <button
                onClick={() => setShowMobileStats(!showMobileStats)}
                className="pixel-button bg-[#d0d3b2] px-3 py-2 text-xs hover:bg-[#a8cda2]"
                aria-label="切换统计面板"
                aria-expanded={showMobileStats}
              >
                📊
              </button>
            </div>
          </div>

          {/* 标题区域 */}
          <header className="text-center mb-6 md:mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl" role="img" aria-label="时间图标">
                {timeGreeting.emoji}
              </span>
              <h1 className="text-2xl md:text-4xl text-[#3d3d3d] animate-glitter font-pixel">
                {t('home.title')}
              </h1>
            </div>
            <p className="text-sm md:text-base text-[#5a5a5a] mb-2 font-pixel">
              {t('home.subtitle')}
            </p>
            <p className="text-xs md:text-sm text-[#5a5a5a] leading-relaxed font-pixel">
              {timeGreeting.greeting} • {timeGreeting.subGreeting}
            </p>
          </header>

          {/* 像素小猫 */}
          <div className="flex justify-center mb-6 md:mb-12">
            <div className="w-48 md:w-64">
              <PixelCat
                emotion={catEmotion}
                onInteractionChange={(emotion) => setCatEmotion(emotion)}
              />
            </div>
          </div>

          {/* 移动端统计面板 */}
          {showMobileStats && (
            <div className="lg:hidden mb-6">
              <StatsPanel />
            </div>
          )}

          {/* 收款码展示区域 */}
          <div className="mb-6 md:mb-8" role="region" aria-label="收款码">
            <h2 className="text-center text-base md:text-xl text-[#3d3d3d] mb-4 md:mb-6" id="qr-heading">
              {t('home.selectPayment')}
            </h2>

            {/* 两个收款码并排显示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-[#d0d3b2] pixel-border p-4 md:p-6 animate-bounce-in"
                  role="region"
                  aria-label={`${method.name}收款码`}
                >
                  {/* 支付方式标题 */}
                  <h3 className="text-center text-sm md:text-base text-[#3d3d3d] mb-3 md:mb-4">
                    {method.name} {t('home.qrCode')}
                  </h3>

                  {/* 二维码 */}
                  <div className="bg-white pixel-border p-3 md:p-4 mb-3 md:mb-4">
                    <div className="aspect-square relative w-full">
                      <Image
                        src={method.qrCode}
                        alt={`${method.name}收款码`}
                        fill
                        className="object-contain"
                        unoptimized
                        priority={method.id === 'wechat'} // 优先加载微信二维码
                      />
                    </div>
                  </div>

                  {/* 施舍输入 */}
                  <div className="mb-3 md:mb-4">
                    <DonationInput
                      onSubmit={(amount) => handleDonate(amount, method.id)}
                      paymentMethod={method.name}
                    />
                  </div>

                  {/* 快速支付按钮 */}
                  <div className="mt-2 md:mt-4">
                    <QuickPaymentButton
                      onPaymentComplete={(result) => {
                        // 处理支付完成
                        console.log('Payment completed:', result);
                      }}
                      className="w-full text-xs md:text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 功能按钮区域 */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8" role="region" aria-label="功能按钮">
            <button
              onClick={() => setShowMessageWall(true)}
              className="pixel-button bg-[#d0d3b2] px-4 md:px-6 py-3 text-xs md:text-sm text-[#3d3d3d] hover:bg-[#a8cda2] transition-colors flex flex-col items-center justify-center gap-1 md:gap-2"
              aria-label="打开留言墙"
            >
              <span aria-hidden="true" className="text-lg md:text-base">📝</span>
              <span className="text-xs md:text-sm">{t('home.messageWall')}</span>
            </button>
            <button
              onClick={() => setShowCustomQuotes(true)}
              className="pixel-button bg-[#d0d3b2] px-4 md:px-6 py-3 text-xs md:text-sm text-[#3d3d3d] hover:bg-[#a8cda2] transition-colors flex flex-col items-center justify-center gap-1 md:gap-2"
              aria-label="打开自定义语录编辑器"
            >
              <span aria-hidden="true" className="text-lg md:text-base">✨</span>
              <span className="text-xs md:text-sm">{t('home.customQuotes')}</span>
            </button>
          </div>

          {/* 底部文字 */}
          <footer className="text-center mt-8 md:mt-12">
            <p className="text-xs text-[#5a5a5a] animate-blink" role="status" aria-live="polite">
              {catEmotion === 'normal'
                ? timeGreeting.subGreeting
                : catEmotion === 'happy'
                ? "( =^･ω･^= ) 喵~ 太感谢了！"
                : "( =^･ω･^= ) 喵呜~ 感激不尽！"}
            </p>
            <p className="text-xs text-[#5a5a5a] mt-2 md:mt-4">
              Powered by Next.js + Tailwind CSS
            </p>
          </footer>
        </div>

        {/* 右侧边栏 - 统计面板 */}
        <aside className="hidden lg:block w-80 flex-shrink-0 bg-[#ebf1d6] p-4 border-l-4 border-[#3d3d3d]" aria-label="统计面板">
          <div className="sticky top-4 space-y-8">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <StatsPanel />
          </div>
        </aside>
      </div>

      {/* 感谢弹窗 */}
      <ThankYouModal
        isOpen={showThankYou}
        onClose={handleCloseModal}
        amount={lastDonation?.amount}
        paymentMethod={lastDonation?.method}
      />

      {/* 留言墙 */}
      <MessageWall
        isOpen={showMessageWall}
        onClose={() => setShowMessageWall(false)}
      />

      {/* 自定义语录编辑器 */}
      <CustomQuoteEditor
        isOpen={showCustomQuotes}
        onClose={() => setShowCustomQuotes(false)}
      />
    </div>
  );
}
