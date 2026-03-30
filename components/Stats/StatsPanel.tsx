"use client";

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { DonationStats, DonationRecord } from '@/types';
import {
  getDonationStats,
  getDonationRecords,
  deleteDonationRecord,
  clearAllRecords,
} from '@/lib/storage';
import { useCountUp } from '@/hooks';

interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  delay: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const StatCard = memo(function StatCard({
  label,
  value,
  color,
  delay,
  prefix = '',
  suffix = '',
  decimals = 0,
}: StatCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const animatedValue = useCountUp({
    end: numericValue,
    start: 0,
    duration: 1500,
    delay: delay * 100,
    decimals,
    easing: (t) => {
      // easeOutExpo
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },
  });

  return (
    <div
      className={`${color} pixel-border p-2 md:p-3 text-center`}
      style={{
        animation: `fadeIn 0.5s ease-out ${delay}s both`
      }}
    >
      <p className="text-xs text-[#5a5a5a] mb-1">{label}</p>
      <p className="text-base md:text-xl lg:text-2xl text-[#3d3d3d] font-bold">
        {prefix}
        {decimals > 0 ? animatedValue.toFixed(decimals) : animatedValue}
        {suffix}
      </p>
    </div>
  );
});

interface HistoryRecordProps {
  record: DonationRecord;
  index: number;
  onDelete: (id: string) => void;
}

const HistoryRecord = memo(function HistoryRecord({
  record,
  index,
  onDelete,
}: HistoryRecordProps) {
  const handleDelete = useCallback(() => {
    onDelete(record.id);
  }, [record.id, onDelete]);

  return (
    <div
      className="bg-[#ebf1d6] pixel-border p-2 md:p-3 flex items-center justify-between animate-bounce-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 md:gap-2 mb-1">
          <span className="text-base md:text-lg" role="img" aria-label={record.paymentMethod}>
            {record.paymentMethod === 'wechat' ? '💬' : '💙'}
          </span>
          <span className="text-xs md:text-sm text-[#3d3d3d] font-bold truncate">
            ¥{record.amount.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-[#5a5a5a] truncate">
          {record.date}
        </p>
      </div>
      <button
        onClick={handleDelete}
        className="pixel-button bg-red-200 px-2 md:px-3 py-1 text-xs hover:bg-red-300 ml-2 flex-shrink-0"
        aria-label={`删除 ${record.date} 的施舍记录`}
      >
        删除
      </button>
    </div>
  );
});

function StatsPanel() {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [records, setRecords] = useState<DonationRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = useCallback(() => {
    setStats(getDonationStats());
    setRecords(getDonationRecords().reverse());
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteDonationRecord(id);
      loadData();
    }
  }, [loadData]);

  const handleClearAll = useCallback(() => {
    if (confirm('确定要清空所有记录吗？此操作不可恢复！')) {
      clearAllRecords();
      loadData();
    }
  }, [loadData]);

  const toggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  // 使用useMemo优化计算
  const hasNoData = useMemo(() => !stats || stats.donationCount === 0, [stats]);

  if (!mounted) return null;

  return (
    <div className="mt-6 md:mt-8 lg:mt-12" role="region" aria-label="施舍统计面板">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-base md:text-xl text-[#3d3d3d]">
          📊 施舍统计
        </h2>
        {records.length > 0 && (
          <button
            onClick={toggleHistory}
            className="pixel-button bg-[#d0d3b2] px-3 md:px-4 py-2 text-xs hover:bg-[#a8cda2]"
            aria-expanded={showHistory}
            aria-controls="history-panel"
          >
            {showHistory ? '隐藏' : '查看'}历史
          </button>
        )}
      </div>

      {/* 统计卡片 */}
      {hasNoData ? (
        <div className="bg-[#d0d3b2] pixel-border p-4 md:p-8 text-center">
          <p className="text-xs md:text-sm text-[#5a5a5a] mb-2">
            还没有施舍记录
          </p>
          <p className="text-xs text-[#5a5a5a]">
            ( =^･ω･^= ) 等待第一次施舍...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
            <StatCard
              label="总次数"
              value={stats!.donationCount}
              color="bg-[#d0d3b2]"
              delay={0}
            />
            <StatCard
              label="总金额"
              value={stats!.totalAmount}
              color="bg-[#a8cda2]"
              delay={0.2}
              prefix="¥"
              decimals={2}
            />
            <StatCard
              label="微信"
              value={stats!.wechatCount}
              color="bg-[#ebf1d6]"
              delay={0.4}
            />
            <StatCard
              label="支付宝"
              value={stats!.alipayCount}
              color="bg-[#ebf1d6]"
              delay={0.6}
            />
          </div>

          {/* 首次和最后施舍时间 */}
          <div className="bg-[#ebf1d6] pixel-border p-3 md:p-4 mb-4 md:mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs">
              <div>
                <span className="text-[#5a5a5a]">首次施舍：</span>
                <span className="text-[#3d3d3d] break-all">{stats!.firstDonation}</span>
              </div>
              <div>
                <span className="text-[#5a5a5a]">最近施舍：</span>
                <span className="text-[#3d3d3d] break-all">{stats!.lastDonation}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 历史记录 */}
      {showHistory && records.length > 0 && (
        <div
          id="history-panel"
          className="bg-[#d0d3b2] pixel-border p-3 md:p-6"
          role="region"
          aria-label="施舍历史记录"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-sm md:text-base text-[#3d3d3d]">
              📜 施舍历史
            </h3>
            <button
              onClick={handleClearAll}
              className="pixel-button bg-red-300 px-2 md:px-3 py-1 text-xs hover:bg-red-400"
              aria-label="清空所有施舍记录"
            >
              清空全部
            </button>
          </div>

          <div className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto">
            {records.map((record, index) => (
              <HistoryRecord
                key={record.id}
                record={record}
                index={index}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

StatsPanel.displayName = 'StatsPanel';

export default StatsPanel;
