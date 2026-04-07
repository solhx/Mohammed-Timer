// components/timer/LiveClock.tsx - ENHANCED DESIGN
'use client';

import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiveClockProps {
  format?: 12 | 24;
  showSeconds?: boolean;
  showDate?: boolean;
  className?: string;
}

export const LiveClock = memo(function LiveClock({
  format = 12,
  showSeconds = true,
  showDate = false,
  className,
}: LiveClockProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const displayHours = format === 12 ? hours % 12 || 12 : hours;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Date */}
      {showDate && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground mb-1"
        >
          {dateStr}
        </motion.div>
      )}

      {/* Time */}
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-sm font-medium text-muted-foreground">
          {formatNumber(displayHours)}
        </span>
        <motion.span
          className="text-sm text-muted-foreground/50"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          :
        </motion.span>
        <span className="text-sm font-medium text-muted-foreground">
          {formatNumber(minutes)}
        </span>
        {showSeconds && (
          <>
            <motion.span
              className="text-sm text-muted-foreground/50"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              :
            </motion.span>
            <span className="text-sm font-medium text-muted-foreground">
              {formatNumber(seconds)}
            </span>
          </>
        )}
        {format === 12 && (
          <span className="text-[10px] font-semibold text-muted-foreground/70 ml-1">
            {ampm}
          </span>
        )}
      </div>
    </div>
  );
});