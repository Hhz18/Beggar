"use client";

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { DonationStats } from '@/types';
import { getDonationRecords } from '@/lib/storage';
import { DonutChart, LineChart, ProgressBar } from '@/components/Charts';

interface EnhancedStatsPanelProps {
  stats: DonationStats | null;
}

/**
 * EnhancedStatsPanel组件
 * 增强的统计面板，包含数据可视化
 */
function EnhancedStatsPanel({ stats }: EnhancedStatsPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 准备支付方式分布数据
  const paymentDistribution = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: '微信',
        value: stats.wechatCount,
        color: '#a8cda2',
      },
      {
        label: '支付宝',
        value: stats.alipayCount,
        color: '#d0d3b2',
      },
    ];
  }, [stats]);

  // 准备趋势数据
  const trendData = useMemo(() => {
    const records = getDonationRecords();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyTotals = last7Days.map(day => {
      const dayRecords = records.filter(r => {
        const recordDate = new Date(r.timestamp).toISOString().split('T')[0];
        return recordDate === day;
      });
      const total = dayRecords.reduce((sum, r) => sum + r.amount, 0);
      return {
        label: new Date(day).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
        value: Math.round(total),
      };
    });

    return dailyTotals;
  }, []);

  if (!mounted || !stats) return null;

  return (
    <div className="mt-8 space-y-6">
      {/* 展开图表按钮 */}
      <button
        onClick={() => setShowCharts(!showCharts)}
        className="pixel-button bg-[#d0d3b2] px-4 py-2 text-sm w-full"
      >
        {showCharts ? '📊 收起图表' : '📊 查看详细图表'}
      </button>

      {showCharts && (
        <>
          {/* 支付方式分布 */}
          <div className="bg-[#d0d3b2] pixel-border p-4">
            <h3 className="text-base text-[#3d3d3d] mb-4 font-pixel">
              支付方式分布
            </h3>
            <div className="flex justify-center">
              <DonutChart
                data={paymentDistribution}
                size={180}
                centerText={`${stats.donationCount}次`}
              />
            </div>
          </div>

          {/* 7日趋势 */}
          <div className="bg-[#d0d3b2] pixel-border p-4">
            <h3 className="text-base text-[#3d3d3d] mb-4 font-pixel">
              近7日施舍趋势
            </h3>
            <div className="overflow-x-auto">
              <LineChart data={trendData} width={500} height={200} />
            </div>
          </div>

          {/* 目标进度 */}
          <div className="bg-[#d0d3b2] pixel-border p-4">
            <h3 className="text-base text-[#3d3d3d] mb-4 font-pixel">
              目标进度
            </h3>
            <div className="space-y-4">
              <ProgressBar
                value={stats.donationCount}
                max={100}
                label="施舍次数目标 (100次)"
                color="#a8cda2"
              />
              <ProgressBar
                value={stats.totalAmount}
                max={1000}
                label="累计金额目标 (1000元)"
                color="#ff69b4"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(EnhancedStatsPanel);
