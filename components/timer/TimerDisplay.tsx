// components/timer/TimerDisplay.tsx - BALANCED SIZES
'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSettingsContext } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  time: number;
  isRunning: boolean;
  isPaused: boolean;
  isBreak?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

export const TimerDisplay = memo(function TimerDisplay({
  time,
  isRunning,
  isPaused,
  isBreak = false,
  size = 'md',
  showStatus = true,
}: TimerDisplayProps) {
  const { settings } = useSettingsContext();
  const showMilliseconds = settings.timer.showMilliseconds;

  // Parse time into components
  const timeComponents = useMemo(() => {
    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((time % 1000) / 10);

    return { hours, minutes, seconds, milliseconds };
  }, [time]);

  const { hours, minutes, seconds, milliseconds } = timeComponents;
  const hasHours = hours > 0;

  // ✅ BALANCED size configurations
  const sizeConfig = {
    sm: {
      digits: 'text-4xl',
      separator: 'text-3xl',
      milliseconds: 'text-xl',
      status: 'text-xs',
    },
    md: {
      // When NO hours: nice big display
      // When HAS hours: slightly smaller to fit
      digits: hasHours ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl',
      separator: hasHours ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl',
      milliseconds: 'text-xl sm:text-2xl',
      status: 'text-sm',
    },
    lg: {
      // For when circle is larger (with hours)
      digits: hasHours ? 'text-5xl sm:text-6xl' : 'text-6xl sm:text-7xl',
      separator: hasHours ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl',
      milliseconds: 'text-2xl sm:text-3xl',
      status: 'text-sm',
    },
  };

  const config = sizeConfig[size];

  // Determine text color based on state
  const getTextColor = () => {
    if (isBreak) return 'text-warning';
    if (isPaused) return 'text-muted-foreground';
    return '';
  };

  // Get gradient class for running state
  const getGradientClass = () => {
    if (isRunning && !isPaused && !isBreak) {
      return 'bg-gradient-to-b from-primary-400 via-primary-500 to-accent-500 bg-clip-text text-transparent';
    }
    return getTextColor();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Main timer display */}
      <div className="flex items-baseline justify-center gap-1">
        {/* Hours (only if > 0) */}
        {hasHours && (
          <>
            <motion.span
              key={`h-${hours}`}
              initial={{ opacity: 0.7, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                config.digits,
                'font-mono font-bold tabular-nums leading-none',
                getGradientClass()
              )}
            >
              {hours.toString().padStart(2, '0')}
            </motion.span>
            <motion.span
              animate={isRunning && !isPaused ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                config.separator,
                'font-mono font-bold mx-0.5 leading-none',
                getGradientClass()
              )}
            >
              :
            </motion.span>
          </>
        )}

        {/* Minutes */}
        <motion.span
          key={`m-${minutes}`}
          initial={{ opacity: 0.7, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            config.digits,
            'font-mono font-bold tabular-nums leading-none',
            getGradientClass()
          )}
        >
          {minutes.toString().padStart(2, '0')}
        </motion.span>

        {/* Separator */}
        <motion.span
          animate={isRunning && !isPaused ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className={cn(
            config.separator,
            'font-mono font-bold mx-0.5 leading-none',
            getGradientClass()
          )}
        >
          :
        </motion.span>

        {/* Seconds */}
        <motion.span
          key={`s-${seconds}`}
          initial={{ opacity: 0.7, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            config.digits,
            'font-mono font-bold tabular-nums leading-none',
            getGradientClass()
          )}
        >
          {seconds.toString().padStart(2, '0')}
        </motion.span>

        {/* Milliseconds - only show if no hours and setting enabled */}
        {showMilliseconds && !hasHours && (
          <span
            className={cn(
              config.milliseconds,
              'font-mono font-medium tabular-nums ml-1 self-end mb-1',
              'text-muted-foreground/70'
            )}
          >
            .{milliseconds.toString().padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Status indicator */}
      {showStatus && isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-3"
        >
          <motion.div
            className={cn(
              'w-2 h-2 rounded-full',
              isPaused
                ? 'bg-warning'
                : isBreak
                ? 'bg-warning'
                : 'bg-green-500'
            )}
            animate={isPaused ? {} : { 
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className={cn(config.status, 'font-medium', getTextColor() || 'text-muted-foreground')}>
            {isPaused ? 'Paused' : isBreak ? 'On Break' : 'Running'}
          </span>
        </motion.div>
      )}
    </div>
  );
});