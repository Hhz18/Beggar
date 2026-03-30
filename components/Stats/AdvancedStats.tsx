"use client";

import { useMemo, memo } from 'react';
import { getDonationRecords, getDonationStats } from '@/lib/storage';
import { DonutChart, LineChart, ProgressBar } from '@/components/Charts';

interface AdvancedStatsProps {
  className?: string;
}

/**
 * AdvancedStats组件
 * 高级统计分析面板
 */
function AdvancedStats({ className = '' }: AdvancedStatsProps) {
  const stats = getDonationStats();
  const records = getDonationRecords();

  // 月度统计
  const monthlyStats = useMemo(() => {
    const monthlyData = new Map<string, { count: number; amount: number }>();

    records.forEach(record => {
      const date = new Date(record.timestamp);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData.has(key)) {
        monthlyData.set(key, { count: 0, amount: 0 });
      }

      const data = monthlyData.get(key)!;
      data.count++;
      data.amount += record.amount;
    });

    return Array.from(monthlyData.entries())
      .map(([key, data]) => ({
        month: key,
        ...data,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // 最近6个月
  }, [records]);

  // 支付方式偏好
  const paymentPreference = useMemo(() => {
    const wechatTotal = records
      .filter(r => r.paymentMethod === 'wechat')
      .reduce((sum, r) => sum + r.amount, 0);

    const alipayTotal = records
      .filter(r => r.paymentMethod === 'alipay')
      .reduce((sum, r) => sum + r.amount, 0);

    const total = wechatTotal + alipayTotal;

    return [
      {
        label: '微信',
        value: wechatTotal,
        color: '#a8cda2',
        percentage: total > 0 ? Math.round((wechatTotal / total) * 100) : 0,
      },
      {
        label: '支付宝',
        value: alipayTotal,
        color: '#d0d3b2',
        percentage: total > 0 ? Math.round((alipayTotal / total) * 100) : 0,
      },
    ];
  }, [records]);

  // 施舍习惯分析
  const habits = useMemo(() => {
    const now = new Date();
    const hourCounts = new Array(24).fill(0);

    records.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      hourCounts[hour]++;
    });

    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

    const weekdayCounts = new Array(7).fill(0);

    records.forEach(record => {
      const day = new Date(record.timestamp).getDay();
      weekdayCounts[day]++;
    });

    const peakDay = weekdayCounts.indexOf(Math.max(...weekdayCounts));
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    return {
      peakHour: `${peakHour}:00-${peakHour + 1}:00`,
      peakDay: weekdays[peakDay],
      averageAmount: records.length > 0
        ? Math.round(stats.totalAmount / records.length)
        : 0,
    };
  }, [records, stats]);

  // 预测趋势
  const forecast = useMemo(() => {
    if (monthlyStats.length < 2) return null;

    const recent = monthlyStats.slice(-3);
    const avgAmount = recent.reduce((sum, m) => sum + m.amount, 0) / recent.length;
    const avgCount = recent.reduce((sum, m) => sum + m.count, 0) / recent.length;

    return {
      predictedMonthlyAmount: Math.round(avgAmount),
      predictedMonthlyCount: Math.round(avgCount),
      trend: recent[recent.length - 1].amount > recent[0].amount ? 'up' : 'down',
    };
  }, [monthlyStats]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 月度趋势 */}
      <div className="bg-[#d0d3b2] pixel-border p-4">
        <h3 className="text-base text-[#3d3d3d] mb-4 font-pixel">
          📅 月度趋势 (近6个月)
        </h3>
        <div className="overflow-x-auto">
          <LineChart
            data={monthlyStats.map(m => ({
              label: m.month.split('-')[1],
              value: Math.round(m.amount),
            }))}
            width={500}
            height={200}
            color="#a8cda2"
          />
        </div>
      </div>

      {/* 支付偏好分析 */}
      <div className="bg-[#d0d3b2] pixel-border p-4">
        <h3 className="text-base text-[#3d3d3d] mb-4 font-pixel">
          💳 支付偏好分析
        </h3>
        <div className="flex justify-center mb-4">
          <DonutChart
            data={paymentPreference}
            size={160}
            centerText={paymentPreference.length > 0 ? paymentPreference[0].percentage + '%' : '0%'}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {paymentPreference.map(p => (
            <div key={p.label} className="bg-[#ebf1d6] pixel-border p-3 text-center">
              <p className="text-xs text-[#5a5a5a] mb-1">{p.label}</p>
              <p className="text-xl font-bold text-[#3d3d3d]">¥{Math.round(p.value)}</p>
              <p className="text-xs text-[#5a5a5a]">{p.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* 施舍习惯 */}
      <div className="bg-[#d0d3b2] pixel-border p-4">
        <h3 className="text-base text-[#3d3d3d] mb-4 font-pixel">
          🎯 施舍习惯分析
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#ebf1d6] pixel-border p-3 text-center">
            <p className="text-xs text-[#5a5a5a] mb-1">高峰时段</p>
            <p className="text-sm font-bold text-[#3d3d3d]">{habits.peakHour}</p>
          </div>
          <div className="bg-[#ebf1d6] pixel-border p-3 text-center">
            <p className="text-xs text-[#5a5a5a] mb-1">高峰日期</p>
            <p className="text-sm font-bold text-[#3d3d3d]">{habits.peakDay}</p>
          </div>
          <div className="bg-[#ebf1d6] pixel-border p-3 text-center">
            <p className="text-xs text-[#5a5a5a] mb-1">平均金额</p>
            <p className="text-sm font-bold text-[#3d3d3d]">¥{habits.averageAmount}</p>
          </div>
        </div>
      </div>

      {/* 预测 */}
      {forecast && (
        <div className="bg-[#d0d3b2] pixel-border p-4">
          <h3 className="text-base text-[#3d3d3d] mb-4 font-pixel">
            🔮 下月预测
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#ebf1d6] pixel-border p-3 text-center">
              <p className="text-xs text-[#5a5a5a] mb-1">预测次数</p>
              <p className="text-2xl font-bold text-[#3d3d3d]">{forecast.predictedMonthlyCount}</p>
              <p className="text-xs text-[#5a5a5a]">次</p>
            </div>
            <div className="bg-[#ebf1d6] pixel-border p-3 text-center">
              <p className="text-xs text-[#5a5a5a] mb-1">预测金额</p>
              <p className="text-2xl font-bold text-[#3d3d3d]">¥{forecast.predictedMonthlyAmount}</p>
              <p className="text-xs text-[#5a5a5a]">元</p>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className={`text-xs px-2 py-1 rounded ${
              forecast.trend === 'up' ? 'bg-[#a8cda2] text-white' : 'bg-[#ff6b6b] text-white'
            }`}>
              {forecast.trend === 'up' ? '📈 趋势上升' : '📉 趋势下降'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(AdvancedStats);
