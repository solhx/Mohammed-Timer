// components/charts/DailyActivityChart.tsx - FIXED VERSION
'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

interface DailyActivityChartProps {
  sessions: Session[];
  days?: number;
  className?: string;
}

interface DayData {
  date: string;
  dayName: string;
  duration: number;
  sessions: number;
  hours: number;
}

export const DailyActivityChart = memo(function DailyActivityChart({
  sessions = [], // Default to empty array
  days = 7,
  className,
}: DailyActivityChartProps) {
  // Generate chart data from sessions
  const chartData = useMemo((): DayData[] => {
    // Safety check
    if (!sessions || !Array.isArray(sessions)) {
      return [];
    }

    const now = new Date();
    const data: DayData[] = [];

    // Generate last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Filter sessions for this day
      const daySessions = sessions.filter((s) => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= date && sessionDate < nextDate;
      });

      const totalDuration = daySessions.reduce((acc, s) => acc + s.duration, 0);

      data.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        duration: totalDuration,
        sessions: daySessions.length,
        hours: totalDuration / 3_600_000,
      });
    }

    return data;
  }, [sessions, days]);

  // Calculate max for scaling
  const maxHours = useMemo(() => {
    if (chartData.length === 0) return 4; // Default max
    const max = Math.max(...chartData.map((d) => d.hours));
    return max > 0 ? Math.ceil(max) : 4;
  }, [chartData]);

  // Format hours for display
  const formatHours = (hours: number): string => {
    if (hours === 0) return '0m';
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours.toFixed(1)}h`;
  };

  // Empty state
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
          <p className="text-sm text-muted-foreground">No activity data yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start tracking to see your chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      {/* Y-axis labels */}
      <div className="flex-1 flex">
        <div className="w-8 flex flex-col justify-between text-xs text-muted-foreground py-2">
          <span>{maxHours}h</span>
          <span>{Math.round(maxHours / 2)}h</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end justify-around gap-2 px-2 pb-2">
          {chartData.map((day, index) => {
            const heightPercent = maxHours > 0 ? (day.hours / maxHours) * 100 : 0;
            const isToday = index === chartData.length - 1;

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                {/* Tooltip on hover */}
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
                    <div>{formatHours(day.hours)}</div>
                    <div className="text-[10px] opacity-70">
                      {day.sessions} session{day.sessions !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-40 flex items-end">
                  <motion.div
                    className={cn(
                      'w-full rounded-t-lg transition-colors',
                      isToday
                        ? 'bg-gradient-to-t from-primary-500 to-primary-400'
                        : 'bg-gradient-to-t from-primary-500/60 to-primary-400/60',
                      'group-hover:from-primary-500 group-hover:to-accent-500'
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercent, day.hours > 0 ? 5 : 0)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                </div>

                {/* Day label */}
                <span
                  className={cn(
                    'text-xs',
                    isToday
                      ? 'text-primary-500 font-semibold'
                      : 'text-muted-foreground'
                  )}
                >
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});