// components/timer/TimerDisplay.tsx - COMPLETE FIXED VERSION
'use client';

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '@/context/ThemeContext';
import { LiveClock } from './LiveClock';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  time: number;
  isRunning: boolean;
  isPaused: boolean;
  isBreak?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function formatTimeDisplay(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: milliseconds.toString().padStart(2, '0'),
    showHours: hours > 0,
  };
}

export const TimerDisplay = memo(function TimerDisplay({
  time,
  isRunning,
  isPaused,
  isBreak = false,
  size = 'lg',
}: TimerDisplayProps) {
  const { theme } = useThemeContext();
  const showMilliseconds = theme?.timer?.showMilliseconds ?? true;
  const pulseWhenRunning = theme?.timer?.pulseWhenRunning ?? true;
  const displayStyle = theme?.timer?.displayStyle ?? 'default';
  const reducedMotion = theme?.effects?.reducedMotion ?? false;

  const { hours, minutes, seconds, milliseconds, showHours } = useMemo(
    () => formatTimeDisplay(time),
    [time]
  );

  // Size configurations
  const sizeConfig = {
    sm: { fontSize: 'text-2xl', gap: 'gap-0' },
    md: { fontSize: 'text-4xl', gap: 'gap-0' },
    lg: { fontSize: 'text-5xl md:text-6xl', gap: 'gap-0' },
    xl: { fontSize: 'text-6xl md:text-7xl', gap: 'gap-0' },
  };

  const { fontSize } = sizeConfig[size];

  const shouldAnimate = isRunning && !isPaused && !reducedMotion;

  // Color based on state
  const textColorClass = isBreak
    ? 'text-amber-500'
    : 'text-[rgb(var(--color-primary-500))]';

  // Status indicator color
  const statusColor = isRunning && !isPaused
    ? isBreak
      ? 'bg-amber-500'
      : 'bg-green-500'
    : isPaused
    ? 'bg-amber-500'
    : 'bg-gray-400';

  const statusText = isRunning
    ? isPaused
      ? 'Paused'
      : isBreak
      ? 'On Break'
      : 'Running'
    : 'Ready';

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Live Clock */}
      <LiveClock
        format={12}
        showSeconds
        className="text-sm text-muted-foreground mb-2"
      />

      {/* Break badge */}
      <AnimatePresence>
        {isBreak && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="px-3 py-1 rounded-full text-xs font-medium mb-2 bg-amber-500/15 text-amber-500 border border-amber-500/30"
          >
            ☕ Break Time
          </motion.div>
        )}
      </AnimatePresence>

      {/* TIMER DIGITS - ALL ON ONE LINE */}
      <div
        className={cn(
          'font-mono font-bold tabular-nums tracking-tight',
          'flex items-baseline justify-center',
          'whitespace-nowrap', // IMPORTANT: Prevents wrapping
          fontSize,
          textColorClass,
          isPaused && 'opacity-60'
        )}
      >
        {/* Hours (if any) */}
        {showHours && (
          <>
            <span>{hours}</span>
            <span className="opacity-50 mx-1">:</span>
          </>
        )}

        {/* Minutes */}
        <span>{minutes}</span>

        {/* Colon separator */}
        <motion.span
          className="opacity-50 mx-1"
          animate={shouldAnimate ? { opacity: [0.5, 0.2, 0.5] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          :
        </motion.span>

        {/* Seconds */}
        <span>{seconds}</span>

        {/* Milliseconds */}
        {showMilliseconds && (
          <span className="text-[0.4em] opacity-50 ml-1 self-end mb-1">
            .{milliseconds}
          </span>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 mt-3">
        <motion.span
          className={cn('w-2 h-2 rounded-full', statusColor)}
          animate={
            shouldAnimate
              ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-sm text-muted-foreground">{statusText}</span>
      </div>
    </div>
  );
});