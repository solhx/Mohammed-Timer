// components/charts/YearlyChart.tsx - FIXED VERSION
'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

interface YearlyChartProps {
  sessions: Session[];
  className?: string;
}

export const YearlyChart = memo(function YearlyChart({
  sessions = [],
  className,
}: YearlyChartProps) {
  // Generate heatmap data for the year
  const heatmapData = useMemo(() => {
    if (!sessions || !Array.isArray(sessions)) {
      return [];
    }

    const now = new Date();
    const yearAgo = new Date(now);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const data: { date: string; value: number; level: number }[] = [];
    const current = new Date(yearAgo);

    while (current <= now) {
      const dateStr = current.toISOString().split('T')[0];
      const dayStart = new Date(current);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(current);
      dayEnd.setHours(23, 59, 59, 999);

      const dayDuration = sessions
        .filter((s) => {
          const sessionDate = new Date(s.startTime);
          return sessionDate >= dayStart && sessionDate <= dayEnd;
        })
        .reduce((acc, s) => acc + s.duration, 0);

      const hours = dayDuration / 3_600_000;
      let level = 0;
      if (hours > 0) level = 1;
      if (hours >= 1) level = 2;
      if (hours >= 2) level = 3;
      if (hours >= 4) level = 4;

      data.push({ date: dateStr, value: hours, level });

      current.setDate(current.getDate() + 1);
    }

    return data;
  }, [sessions]);

  // Group by weeks
  const weeks = useMemo(() => {
    const result: typeof heatmapData[] = [];
    let currentWeek: typeof heatmapData = [];

    heatmapData.forEach((day, index) => {
      const date = new Date(day.date);
      if (date.getDay() === 0 && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [heatmapData]);

  const levelColors = [
    'bg-muted/30',
    'bg-primary-200 dark:bg-primary-900',
    'bg-primary-300 dark:bg-primary-700',
    'bg-primary-400 dark:bg-primary-500',
    'bg-primary-500 dark:bg-primary-400',
  ];

  if (heatmapData.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <p className="text-sm text-muted-foreground">No yearly data</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      {/* Month labels */}
      <div className="flex gap-1 mb-1 pl-8">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
          (month) => (
            <span key={month} className="text-[10px] text-muted-foreground w-12">
              {month}
            </span>
          )
        )}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground pr-1">
          <span className="h-3">Mon</span>
          <span className="h-3"></span>
          <span className="h-3">Wed</span>
          <span className="h-3"></span>
          <span className="h-3">Fri</span>
          <span className="h-3"></span>
          <span className="h-3">Sun</span>
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-[2px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((day) => (
                <motion.div
                  key={day.date}
                  className={cn(
                    'w-3 h-3 rounded-sm cursor-pointer',
                    'transition-colors duration-200',
                    levelColors[day.level],
                    'hover:ring-1 hover:ring-foreground/20'
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: weekIndex * 0.01 }}
                  title={`${day.date}: ${day.value.toFixed(1)}h`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-muted-foreground">
        <span>Less</span>
        {levelColors.map((color, index) => (
          <div key={index} className={cn('w-3 h-3 rounded-sm', color)} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
});