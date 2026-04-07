// components/timer/LapList.tsx - ENHANCED DESIGN
'use client';

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lap } from '@/types';

interface LapListProps {
  laps: Lap[];
  maxVisible?: number;
}

function formatLapTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
}

export const LapList = memo(function LapList({
  laps,
  maxVisible = 5,
}: LapListProps) {
  // Calculate lap statistics
  const lapStats = useMemo(() => {
    if (laps.length === 0) return null;

    const splitTimes = laps.map((lap) => lap.splitTime);
    const fastest = Math.min(...splitTimes);
    const slowest = Math.max(...splitTimes);
    const average = splitTimes.reduce((a, b) => a + b, 0) / splitTimes.length;

    return { fastest, slowest, average };
  }, [laps]);

  // Get visible laps (most recent first)
  const visibleLaps = useMemo(() => {
    return [...laps].reverse().slice(0, maxVisible);
  }, [laps, maxVisible]);

  const hiddenCount = laps.length - maxVisible;

  if (laps.length === 0) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flag size={16} className="text-primary-500" />
          <span className="text-sm font-semibold text-foreground">
            Laps ({laps.length})
          </span>
        </div>

        {/* Stats summary */}
        {lapStats && laps.length > 1 && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy size={12} className="text-green-500" />
              Best: {formatLapTime(lapStats.fastest)}
            </span>
            <span>Avg: {formatLapTime(lapStats.average)}</span>
          </div>
        )}
      </div>

      {/* Lap list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {visibleLaps.map((lap, index) => {
            const isFastest = lapStats && lap.splitTime === lapStats.fastest && laps.length > 1;
            const isSlowest = lapStats && lap.splitTime === lapStats.slowest && laps.length > 1;
            const isLatest = index === 0;

            // Compare with previous lap
            const currentIndex = laps.length - index - 1;
            const prevLap = currentIndex > 0 ? laps[currentIndex - 1] : null;
            const diff = prevLap ? lap.splitTime - prevLap.splitTime : 0;

            return (
              <motion.div
                key={lap.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex items-center justify-between',
                  'px-4 py-3 rounded-xl',
                  'transition-colors duration-200',
                  isLatest
                    ? 'bg-primary-500/10 border border-primary-500/20'
                    : 'bg-muted/30 border border-transparent',
                  isFastest && 'bg-green-500/10 border-green-500/20',
                  isSlowest && 'bg-red-500/10 border-red-500/20'
                )}
              >
                {/* Lap number */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                      isFastest
                        ? 'bg-green-500 text-white'
                        : isSlowest
                        ? 'bg-red-500 text-white'
                        : isLatest
                        ? 'bg-primary-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {lap.lapNumber}
                  </div>

                  {/* Badge */}
                  {isFastest && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium">
                      <Trophy size={10} />
                      Fastest
                    </span>
                  )}
                  {isSlowest && laps.length > 2 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
                      Slowest
                    </span>
                  )}
                </div>

                {/* Times */}
                <div className="flex items-center gap-6">
                  {/* Split time (lap duration) */}
                  <div className="text-right">
                    <div className="text-sm font-mono font-semibold text-foreground">
                      {formatLapTime(lap.splitTime)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">split</div>
                  </div>

                  {/* Total time */}
                  <div className="text-right">
                    <div className="text-sm font-mono text-muted-foreground">
                      {formatLapTime(lap.time)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">total</div>
                  </div>

                  {/* Difference from previous */}
                  {prevLap && (
                    <div className="w-20 text-right">
                      <div
                        className={cn(
                          'flex items-center justify-end gap-1 text-xs font-medium',
                          diff > 0
                            ? 'text-red-500'
                            : diff < 0
                            ? 'text-green-500'
                            : 'text-muted-foreground'
                        )}
                      >
                        {diff > 0 ? (
                          <TrendingUp size={12} />
                        ) : diff < 0 ? (
                          <TrendingDown size={12} />
                        ) : (
                          <Minus size={12} />
                        )}
                        {diff > 0 ? '+' : ''}
                        {formatLapTime(Math.abs(diff))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Hidden laps indicator */}
        {hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2 text-xs text-muted-foreground"
          >
            +{hiddenCount} more lap{hiddenCount > 1 ? 's' : ''}
          </motion.div>
        )}
      </div>
    </div>
  );
});