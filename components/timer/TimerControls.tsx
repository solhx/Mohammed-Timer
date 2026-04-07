'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Flag, Save, Coffee, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

interface TimerControlsProps {
  isRunning:     boolean;
  isPaused:      boolean;
  isBreak:       boolean;
  hasTime:       boolean;
  isSaving:      boolean;
  onStart:       () => void;
  onPause:       () => void;
  onResume:      () => void;
  onReset:       () => void;
  onLap:         () => void;
  onSave:        () => void;
  onBreakToggle: () => void;
  onStop:        () => void;
}

export const TimerControls = memo(function TimerControls({
  isRunning, isPaused, isBreak, hasTime, isSaving,
  onStart, onPause, onResume, onReset, onLap, onSave, onBreakToggle, onStop,
}: TimerControlsProps) {
  const mainAction = !isRunning ? onStart : isPaused ? onResume : onPause;
  const mainLabel  = isRunning && !isPaused ? 'Pause (Space)' : 'Start (Space)';
  const isActive   = isRunning && !isPaused;

  return (
    <div className="flex flex-col items-center gap-6">

      {/* ── Primary row ─────────────────────── */}
      <div className="flex items-center gap-4">

        {/* Reset */}
        <Tooltip content="Reset (R)">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={onReset}
              disabled={!hasTime && !isRunning}
              aria-label="Reset timer"
              className="w-14 h-14 rounded-full"
            >
              <RotateCcw size={24} />
            </Button>
          </motion.div>
        </Tooltip>

        {/* Play / Pause — uses theme accent on active state */}
        <Tooltip content={mainLabel}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={mainAction}
              aria-label={mainLabel}
              className={cn(
                'w-20 h-20 rounded-full shadow-lg transition-all duration-200',
                // When running: shift to accent color using CSS variable
                isActive && [
                  'bg-[rgb(var(--color-accent-500))]',
                  'hover:bg-[rgb(var(--color-accent-600))]',
                  'shadow-[0_0_20px_rgb(var(--color-accent-500)/0.4)]',
                ]
              )}
            >
              {isActive ? (
                <Pause size={32} className="text-white" />
              ) : (
                <Play size={32} className="text-white ml-1" />
              )}
            </Button>
          </motion.div>
        </Tooltip>

        {/* Lap */}
        <Tooltip content="Lap (L)">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={onLap}
              disabled={!isRunning || isPaused}
              aria-label="Record lap"
              className="w-14 h-14 rounded-full"
            >
              <Flag size={24} />
            </Button>
          </motion.div>
        </Tooltip>
      </div>

      {/* ── Secondary row ───────────────────── */}
      <div className="flex items-center gap-3 flex-wrap justify-center">

        {/* Break */}
        <Tooltip content={isBreak ? 'End Break (B)' : 'Take Break (B)'}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isBreak ? 'primary' : 'outline'}
              size="md"
              onClick={onBreakToggle}
              disabled={!isRunning}
              aria-label={isBreak ? 'End break' : 'Start break'}
              className={cn(
                'gap-2',
                isBreak && [
                  'bg-[rgb(var(--color-warning))]',
                  'hover:bg-[rgb(var(--color-warning)/0.9)]',
                  'border-[rgb(var(--color-warning))]',
                  'shadow-[0_0_12px_rgb(var(--color-warning)/0.3)]',
                ]
              )}
            >
              <Coffee size={18} />
              {isBreak ? 'End Break' : 'Break'}
            </Button>
          </motion.div>
        </Tooltip>

        {/* Stop */}
        <Tooltip content="Stop Session">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="danger"
              size="md"
              onClick={onStop}
              disabled={!isRunning && !hasTime}
              aria-label="Stop session"
              className="gap-2"
            >
              <Square size={18} />
              Stop
            </Button>
          </motion.div>
        </Tooltip>

        {/* Save */}
        <Tooltip content="Save Session (Ctrl+S)">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              size="md"
              onClick={onSave}
              disabled={!hasTime}
              isLoading={isSaving}
              aria-label="Save session"
              className="gap-2"
            >
              <Save size={18} />
              Save
            </Button>
          </motion.div>
        </Tooltip>
      </div>
    </div>
  );
});