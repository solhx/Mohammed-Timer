// components/charts/WeeklyChart.tsx - FIXED VERSION
'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

interface WeeklyChartProps {
  sessions: Session[];
  weeks?: number;
  className?: string;
}

interface WeekData {
  weekStart: string;
  weekLabel: string;
  duration: number;
  sessions: number;
  hours: number;
}

export const WeeklyChart = memo(function WeeklyChart({
  sessions = [],
  weeks = 8,
  className,
}: WeeklyChartProps) {
  // Generate weekly data
  const chartData = useMemo((): WeekData[] => {
    if (!sessions || !Array.isArray(sessions)) {
      return [];
    }

    const now = new Date();
    const data: WeekData[] = [];

    for (let i = weeks - 1; i >= 0; i--) {
      // Calculate week start (Sunday)
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      // Filter sessions for this week
      const weekSessions = sessions.filter((s) => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });

      const totalDuration = weekSessions.reduce((acc, s) => acc + s.duration, 0);

      // Format week label
      const monthDay = weekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      data.push({
        weekStart: weekStart.toISOString(),
        weekLabel: i === 0 ? 'This Week' : i === 1 ? 'Last Week' : monthDay,
        duration: totalDuration,
        sessions: weekSessions.length,
        hours: totalDuration / 3_600_000,
      });
    }

    return data;
  }, [sessions, weeks]);

  const maxHours = useMemo(() => {
    if (chartData.length === 0) return 20;
    const max = Math.max(...chartData.map((d) => d.hours));
    return max > 0 ? Math.ceil(max / 5) * 5 : 20;
  }, [chartData]);

  const formatHours = (hours: number): string => {
    if (hours === 0) return '0h';
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours.toFixed(1)}h`;
  };

  if (chartData.length === 0 || chartData.every((d) => d.duration === 0)) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted/50 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">No weekly data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      <div className="flex-1 flex">
        {/* Y-axis */}
        <div className="w-10 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
          <span>{maxHours}h</span>
          <span>{maxHours / 2}h</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end justify-around gap-1 px-1 pb-2">
          {chartData.map((week, index) => {
            const heightPercent = maxHours > 0 ? (week.hours / maxHours) * 100 : 0;
            const isCurrentWeek = index === chartData.length - 1;

            return (
              <div
                key={week.weekStart}
                className="flex-1 flex flex-col items-center gap-1 group max-w-12"
              >
                {/* Tooltip */}
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
                    <div>{formatHours(week.hours)}</div>
                    <div className="text-[10px] opacity-70">
                      {week.sessions} sessions
                    </div>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-40 flex items-end">
                  <motion.div
                    className={cn(
                      'w-full rounded-t-md transition-colors',
                      isCurrentWeek
                        ? 'bg-gradient-to-t from-accent-500 to-accent-400'
                        : 'bg-gradient-to-t from-accent-500/50 to-accent-400/50',
                      'group-hover:from-accent-500 group-hover:to-primary-500'
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercent, week.hours > 0 ? 3 : 0)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-[10px] text-center leading-tight',
                    isCurrentWeek
                      ? 'text-accent-500 font-semibold'
                      : 'text-muted-foreground'
                  )}
                >
                  {week.weekLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});