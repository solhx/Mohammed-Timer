// components/timer/LiveClock.tsx - NORMAL SIZE
'use client';

import { memo, useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useSettingsContext } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';

interface LiveClockProps {
  className?: string;
  showIcon?: boolean;
  showSeconds?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LiveClock = memo(function LiveClock({
  className,
  showIcon = true,
  showSeconds = true,
  size = 'md',
}: LiveClockProps) {
  const [time, setTime] = useState<Date | null>(null);
  const { settings } = useSettingsContext();
  const use24Hour = settings.timer.use24HourFormat;

  useEffect(() => {
    setTime(new Date());

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        {showIcon && <Clock size={size === 'lg' ? 16 : size === 'md' ? 14 : 12} />}
        <span className="font-mono">--:--</span>
      </div>
    );
  }

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    let period = '';

    if (!use24Hour) {
      period = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12 || 12;
    }

    const timeStr = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      ...(showSeconds ? [seconds.toString().padStart(2, '0')] : []),
    ].join(' : ');

    return { timeStr, period };
  };

  const { timeStr, period } = formatTime();

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-muted-foreground',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Clock size={iconSizes[size]} className="opacity-60" />
      )}
      <div className="flex items-baseline gap-1">
        <span className="font-mono font-medium tabular-nums tracking-wide">
          {timeStr}
        </span>
        {period && (
          <span className="text-[0.8em] text-muted-foreground/70">
            {period.trim()}
          </span>
        )}
      </div>
    </div>
  );
});