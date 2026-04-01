"use client";

import { useEffect, useMemo } from "react";
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
import { initializeStats, updateLastVisit } from "@/lib/storage";
import { useTimeGreeting } from "@/hooks";
import { useI18n } from "@/contexts/I18nContext";
import { useAppState } from "@/hooks/useAppState";
import { useDonationHandler } from "@/hooks/useDonationHandler";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export default function Home() {
  const { t, locale } = useI18n();
  const timeGreeting = useTimeGreeting();
  const { state, actions } = useAppState();
  const { handleDonate } = useDonationHandler();
  const paymentMethods = usePaymentMethods();

  // Initialize on mount (only runs once)
  useEffect(() => {
    initializeStats();
    updateLastVisit();

    // Set initial cat emotion based on time
    actions.setCatEmotion(timeGreeting.emotion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  // Memoize current date display
  const currentDateDisplay = useMemo(
    () => new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    []
  );

  // Memoize footer message based on emotion
  const footerMessage = useMemo(() => {
    switch (state.catEmotion) {
      case 'normal':
        return timeGreeting.subGreeting;
      case 'happy':
        return '( =^･ω･^= ) 喵~ 太感谢了！';
      case 'excited':
        return '( =^･ω･^= ) 喵呜~ 感激不尽！';
      default:
        return timeGreeting.subGreeting;
    }
  }, [state.catEmotion, timeGreeting.subGreeting]);

  return (
    <div className="min-h-screen bg-[#ebf1d6]">
        {/* Dynamic Font Switcher */}
        <FontSwitcher />

        {/* Background Message Wall */}
        <MessageBackground aria-hidden="true" />

      {/* Main Container */}
      <div className="flex items-start min-h-screen" role="main">
        {/* Content Area */}
        <div className="flex-1 max-w-4xl p-3 md:p-8 pt-6 mx-auto">
          {/* Mobile Top Bar */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="时间图标">
                {timeGreeting.emoji}
              </span>
              <span className="text-xs text-[#5a5a5a] font-pixel">
                {currentDateDisplay}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <button
                onClick={actions.toggleMobileStats}
                className="pixel-button bg-[#d0d3b2] px-3 py-2 text-xs hover:bg-[#a8cda2]"
                aria-label="切换统计面板"
                aria-expanded={state.showMobileStats}
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

          {/* Pixel Cat */}
          <div className="flex justify-center mb-6 md:mb-12">
            <div className="w-48 md:w-64">
              <PixelCat
                emotion={state.catEmotion}
                onInteractionChange={actions.setCatEmotion}
              />
            </div>
          </div>

          {/* Mobile Stats Panel */}
          {state.showMobileStats && (
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

          {/* Feature Buttons */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8" role="region" aria-label="功能按钮">
            <button
              onClick={actions.showMessageWall}
              className="pixel-button bg-[#d0d3b2] px-4 md:px-6 py-3 text-xs md:text-sm text-[#3d3d3d] hover:bg-[#a8cda2] transition-colors flex flex-col items-center justify-center gap-1 md:gap-2"
              aria-label="打开留言墙"
            >
              <span aria-hidden="true" className="text-lg md:text-base">📝</span>
              <span className="text-xs md:text-sm">{t('home.messageWall')}</span>
            </button>
            <button
              onClick={actions.showCustomQuotes}
              className="pixel-button bg-[#d0d3b2] px-4 md:px-6 py-3 text-xs md:text-sm text-[#3d3d3d] hover:bg-[#a8cda2] transition-colors flex flex-col items-center justify-center gap-1 md:gap-2"
              aria-label="打开自定义语录编辑器"
            >
              <span aria-hidden="true" className="text-lg md:text-base">✨</span>
              <span className="text-xs md:text-sm">{t('home.customQuotes')}</span>
            </button>
          </div>

          {/* Footer */}
          <footer className="text-center mt-8 md:mt-12">
            <p className="text-xs text-[#5a5a5a] animate-blink" role="status" aria-live="polite">
              {footerMessage}
            </p>
            <p className="text-xs text-[#5a5a5a] mt-2 md:mt-4">
              Powered by Next.js + Tailwind CSS
            </p>
          </footer>
        </div>

        {/* Right Sidebar - Stats Panel */}
        <aside className="hidden lg:block w-80 flex-shrink-0 bg-[#ebf1d6] p-4 border-l-4 border-[#3d3d3d]" aria-label="统计面板">
          <div className="sticky top-4 space-y-8">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <StatsPanel />
          </div>
        </aside>
      </div>

      {/* Modals */}
      <ThankYouModal
        isOpen={state.showThankYou}
        onClose={actions.hideThankYou}
        amount={state.lastDonation?.amount}
        paymentMethod={state.lastDonation?.method}
      />

      <MessageWall
        isOpen={state.showMessageWall}
        onClose={actions.hideMessageWall}
      />

      <CustomQuoteEditor
        isOpen={state.showCustomQuotes}
        onClose={actions.hideCustomQuotes}
      />
    </div>
  );
}
