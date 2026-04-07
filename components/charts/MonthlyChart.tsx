// components/charts/MonthlyChart.tsx - FIXED VERSION
'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

interface MonthlyChartProps {
  sessions: Session[];
  months?: number;
  className?: string;
}

interface MonthData {
  month: string;
  monthLabel: string;
  duration: number;
  sessions: number;
  hours: number;
}

export const MonthlyChart = memo(function MonthlyChart({
  sessions = [],
  months = 6,
  className,
}: MonthlyChartProps) {
  const chartData = useMemo((): MonthData[] => {
    if (!sessions || !Array.isArray(sessions)) {
      return [];
    }

    const now = new Date();
    const data: MonthData[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const monthSessions = sessions.filter((s) => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });

      const totalDuration = monthSessions.reduce((acc, s) => acc + s.duration, 0);

      data.push({
        month: monthStart.toISOString(),
        monthLabel: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        duration: totalDuration,
        sessions: monthSessions.length,
        hours: totalDuration / 3_600_000,
      });
    }

    return data;
  }, [sessions, months]);

  const maxHours = useMemo(() => {
    if (chartData.length === 0) return 40;
    const max = Math.max(...chartData.map((d) => d.hours));
    return max > 0 ? Math.ceil(max / 10) * 10 : 40;
  }, [chartData]);

  const formatHours = (hours: number): string => {
    if (hours === 0) return '0h';
    return `${Math.round(hours)}h`;
  };

  if (chartData.length === 0 || chartData.every((d) => d.duration === 0)) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No monthly data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      <div className="flex-1 flex">
        <div className="w-10 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
          <span>{maxHours}h</span>
          <span>{maxHours / 2}h</span>
          <span>0</span>
        </div>

        <div className="flex-1 flex items-end justify-around gap-2 px-2 pb-2">
          {chartData.map((month, index) => {
            const heightPercent = maxHours > 0 ? (month.hours / maxHours) * 100 : 0;
            const isCurrentMonth = index === chartData.length - 1;

            return (
              <div
                key={month.month}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                <div className="relative">
                  <div
                    className={cn(
                      'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                      'px-2 py-1 rounded-lg text-xs font-medium',
                      'bg-foreground text-background',
                      'opacity-0 group-hover:opacity-100 transition-opacity',
                      'pointer-events-none whitespace-nowrap z-10'
                    )}
                  >
                    <div>{formatHours(month.hours)}</div>
                    <div className="text-[10px] opacity-70">
                      {month.sessions} sessions
                    </div>
                  </div>
                </div>

                <div className="w-full h-40 flex items-end">
                  <motion.div
                    className={cn(
                      'w-full rounded-t-lg transition-colors',
                      isCurrentMonth
                        ? 'bg-gradient-to-t from-green-500 to-emerald-400'
                        : 'bg-gradient-to-t from-green-500/50 to-emerald-400/50',
                      'group-hover:from-green-500 group-hover:to-cyan-500'
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercent, month.hours > 0 ? 5 : 0)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  />
                </div>

                <span
                  className={cn(
                    'text-xs',
                    isCurrentMonth
                      ? 'text-green-500 font-semibold'
                      : 'text-muted-foreground'
                  )}
                >
                  {month.monthLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});