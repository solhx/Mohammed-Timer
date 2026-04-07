// components/timer/TimerDisplay.tsx - FIXED with theme integration
'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSettingsContext } from '@/context/SettingsContext';
import { useThemeContext } from '@/context/ThemeContext';
import { cn, hexToRgb } from '@/lib/utils';

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
  const { theme } = useThemeContext();
  
  // ✅ Get timer settings from THEME (not just settings)
  const timerTheme = theme.timer;
  const displayStyle = timerTheme?.displayStyle || 'default';
  const fontFamily = timerTheme?.fontFamily || 'mono';
  const showMilliseconds = timerTheme?.showMilliseconds ?? settings.timer.showMilliseconds;
  const pulseWhenRunning = timerTheme?.pulseWhenRunning ?? false;
  const glowColor = timerTheme?.glowColor || theme.primary;
  const reducedMotion = settings.accessibility.reducedMotion;

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

  // ✅ Size configurations
  const sizeConfig = {
    sm: {
      digits: 'text-4xl',
      separator: 'text-3xl',
      milliseconds: 'text-xl',
      status: 'text-xs',
    },
    md: {
      digits: hasHours ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl',
      separator: hasHours ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl',
      milliseconds: 'text-xl sm:text-2xl',
      status: 'text-sm',
    },
    lg: {
      digits: hasHours ? 'text-5xl sm:text-6xl' : 'text-6xl sm:text-7xl',
      separator: hasHours ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl',
      milliseconds: 'text-2xl sm:text-3xl',
      status: 'text-sm',
    },
  };

  const config = sizeConfig[size];

  // ✅ Font family classes
  const fontFamilyClass = {
    mono: 'font-mono',
    sans: 'font-sans',
    digital: 'font-mono tracking-wider',
  }[fontFamily];

  // ✅ Get display style classes and inline styles
  const getDisplayStyles = () => {
    const baseColor = isBreak 
      ? 'text-warning' 
      : isPaused 
        ? 'text-muted-foreground' 
        : '';

    switch (displayStyle) {
      case 'minimal':
        return {
          className: cn(baseColor || 'text-foreground', 'font-light'),
          style: {},
        };
      
      case 'neon':
        const rgb = hexToRgb(glowColor);
        const glowRgb = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '99, 102, 241';
        return {
          className: '',
          style: {
            color: glowColor,
            textShadow: isRunning && !isPaused && !reducedMotion
              ? `0 0 5px rgba(${glowRgb}, 0.8),
                 0 0 10px rgba(${glowRgb}, 0.6),
                 0 0 20px rgba(${glowRgb}, 0.4),
                 0 0 40px rgba(${glowRgb}, 0.2)`
              : `0 0 5px rgba(${glowRgb}, 0.5),
                 0 0 10px rgba(${glowRgb}, 0.3)`,
          } as React.CSSProperties,
        };
      
      case 'gradient':
        return {
          className: cn(
            'bg-clip-text text-transparent',
            'bg-gradient-to-r from-primary-400 via-accent-500 to-primary-500'
          ),
          style: isRunning && !isPaused && !reducedMotion
            ? {
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s ease infinite',
              } as React.CSSProperties
            : {},
        };
      
      case 'default':
      default:
        if (isRunning && !isPaused && !isBreak) {
          return {
            className: 'bg-gradient-to-b from-primary-400 to-primary-600 bg-clip-text text-transparent',
            style: {},
          };
        }
        return {
          className: baseColor || 'text-foreground',
          style: {},
        };
    }
  };

  const displayStyles = getDisplayStyles();

  // ✅ Pulse animation when running
  const getPulseClass = () => {
    if (!pulseWhenRunning || reducedMotion || !isRunning || isPaused) {
      return '';
    }
    return 'animate-pulse';
  };

  // Digit component
  const Digit = ({ value }: { value: string }) => (
    <motion.span
      key={value}
      initial={{ opacity: 0.7, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        config.digits,
        fontFamilyClass,
        'font-bold tabular-nums leading-none',
        displayStyles.className,
        getPulseClass()
      )}
      style={displayStyles.style}
    >
      {value}
    </motion.span>
  );

  // Separator component
  const Separator = () => (
    <motion.span
      animate={
        isRunning && !isPaused && !reducedMotion
          ? { opacity: [1, 0.3, 1] }
          : { opacity: 1 }
      }
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        config.separator,
        fontFamilyClass,
        'font-bold mx-0.5 leading-none',
        displayStyles.className
      )}
      style={displayStyles.style}
    >
      :
    </motion.span>
  );

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Main timer display */}
      <div className="flex items-baseline justify-center gap-1">
        {/* Hours (only if > 0) */}
        {hasHours && (
          <>
            <Digit value={hours.toString().padStart(2, '0')} />
            <Separator />
          </>
        )}

        {/* Minutes */}
        <Digit value={minutes.toString().padStart(2, '0')} />
        <Separator />

        {/* Seconds */}
        <Digit value={seconds.toString().padStart(2, '0')} />

        {/* Milliseconds - only show if enabled and no hours */}
        {showMilliseconds && !hasHours && (
          <span
            className={cn(
              config.milliseconds,
              fontFamilyClass,
              'font-medium tabular-nums ml-1 self-end mb-1',
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
            animate={
              isPaused || reducedMotion
                ? {}
                : {
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span
            className={cn(
              config.status,
              'font-medium',
              isPaused
                ? 'text-warning'
                : isBreak
                ? 'text-warning'
                : 'text-muted-foreground'
            )}
          >
            {isPaused ? 'Paused' : isBreak ? 'On Break' : 'Running'}
          </span>
        </motion.div>
      )}
    </div>
  );
});