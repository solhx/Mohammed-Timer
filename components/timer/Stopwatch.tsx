// components/timer/Stopwatch.tsx - FIXED VERSION WITH SETTINGS INTEGRATION
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Flag,
  Save,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { TimerDisplay } from './TimerDisplay';
import { SessionNameInput } from './SessionNameInput';
import { LapList } from './LapList';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotifications } from '@/hooks/useNotifications';
import { useThemeContext } from '@/context/ThemeContext';
import { useSettingsContext } from '@/context/SettingsContext';
import { soundManager } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';
import type { Session } from '@/types';

interface StopwatchProps {
  onSessionSaved?: (session: Session) => void;
}

// Circular progress indicator
const CircularProgress = ({
  progress,
  size = 280,
  strokeWidth = 6,
  isRunning,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isRunning: boolean;
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      className="absolute top-0 left-0"
      style={{ transform: 'rotate(-90deg)' }}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        className="stroke-border/30 dark:stroke-border/20"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(var(--color-primary-500))" />
          <stop offset="100%" stopColor="rgb(var(--color-accent-500))" />
        </linearGradient>
      </defs>
      {isRunning && (
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgb(var(--color-primary-500))"
          strokeWidth={strokeWidth * 3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          opacity={0.15}
          filter="blur(10px)"
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </svg>
  );
};

// Tooltip component
const Tooltip = ({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative group">
      {children}
      {content && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {content}
        </div>
      )}
    </div>
  );
};

// Control button component
const ControlButton = ({
  onClick,
  icon: Icon,
  label,
  variant = 'secondary',
  size = 'default',
  disabled = false,
  className,
}: {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  className?: string;
}) => {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25',
    secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-700 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25',
  };

  const sizes = {
    sm: 'w-12 h-12',
    default: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 18,
    default: 22,
    lg: 26,
  };

  return (
    <Tooltip content={label}>
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'rounded-full flex items-center justify-center',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <Icon size={iconSizes[size]} />
      </motion.button>
    </Tooltip>
  );
};

export function Stopwatch({ onSessionSaved }: StopwatchProps) {
  const [isBreak, setIsBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // ✅ FIXED: Get settings from SettingsContext
  const { settings } = useSettingsContext();
  const timerSettings = settings.timer;
  const notificationSettings = settings.notifications;
  
  const { theme } = useThemeContext();
  const { notifySessionEnd, requestPermission, notify } = useNotifications();
  
  // Auto-save interval ref
  const autoSaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMilestoneRef = useRef<number>(0);

  const timer = useSessionTimer({
    onSessionSaved: (session) => {
      // Play completion sound
      if (timerSettings.soundEnabled && timerSettings.soundOnComplete) {
        soundManager.playSuccess();
      }
      
      notifySessionEnd(session.name, formatDuration(session.duration));
      onSessionSaved?.(session);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    },
  });

  // ✅ Configure sound manager when settings change
  useEffect(() => {
    soundManager.setVolume(timerSettings.soundVolume);
    soundManager.setEnabled(timerSettings.soundEnabled);
  }, [timerSettings.soundVolume, timerSettings.soundEnabled]);

  // ✅ Auto-save functionality
  useEffect(() => {
    if (timerSettings.autoSaveEnabled && timer.isRunning && !timer.isPaused) {
      const intervalMs = timerSettings.autoSaveInterval * 60 * 1000;
      
      autoSaveIntervalRef.current = setInterval(() => {
        // Auto-save logic - could save to localStorage as backup
        console.log('Auto-saving session backup...');
        try {
          localStorage.setItem('timeflow_autosave', JSON.stringify({
            sessionName: timer.sessionName,
            elapsedTime: timer.elapsedTime,
            laps: timer.laps,
            timestamp: Date.now(),
          }));
        } catch (e) {
          console.error('Auto-save failed:', e);
        }
      }, intervalMs);
    }
    
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [timerSettings.autoSaveEnabled, timerSettings.autoSaveInterval, timer.isRunning, timer.isPaused, timer.sessionName, timer.elapsedTime, timer.laps]);

  // ✅ Break reminder notifications
  useEffect(() => {
    if (!notificationSettings.enabled || !notificationSettings.breakReminders) return;
    if (!timer.isRunning || timer.isPaused || isBreak) return;
    
    const intervalMs = notificationSettings.breakReminderInterval * 60 * 1000;
    
    const interval = setInterval(() => {
      notify('Time for a break! 🧘', {
        body: `You've been working for ${notificationSettings.breakReminderInterval} minutes. Take a short break!`,
        tag: 'break-reminder',
      });
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [
    notificationSettings.enabled,
    notificationSettings.breakReminders,
    notificationSettings.breakReminderInterval,
    timer.isRunning,
    timer.isPaused,
    isBreak,
    notify,
  ]);

  // ✅ Milestone alerts
  useEffect(() => {
    if (!notificationSettings.enabled || !notificationSettings.milestoneAlerts) return;
    if (!timer.isRunning || timer.isPaused) return;
    
    const elapsedMinutes = Math.floor(timer.elapsedTime / 60000);
    
    notificationSettings.milestoneIntervals.forEach((milestone) => {
      if (elapsedMinutes === milestone && lastMilestoneRef.current !== milestone) {
        lastMilestoneRef.current = milestone;
        
        const hours = Math.floor(milestone / 60);
        const mins = milestone % 60;
        const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        
        notify(`🎉 Milestone reached!`, {
          body: `You've been working for ${timeStr}. Great focus!`,
          tag: 'milestone',
        });
        
        if (timerSettings.soundEnabled) {
          soundManager.playSuccess();
        }
      }
    });
  }, [
    notificationSettings.enabled,
    notificationSettings.milestoneAlerts,
    notificationSettings.milestoneIntervals,
    timer.isRunning,
    timer.isPaused,
    timer.elapsedTime,
    timerSettings.soundEnabled,
    notify,
  ]);

  // Reset milestone tracker when session resets
  useEffect(() => {
    if (timer.elapsedTime === 0) {
      lastMilestoneRef.current = 0;
    }
  }, [timer.elapsedTime]);

  // Break time tracking
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isBreak && timer.isRunning && !timer.isPaused) {
      interval = setInterval(() => setBreakTime((p) => p + 100), 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreak, timer.isRunning, timer.isPaused]);

  // ✅ Handlers with sound effects
  const handleStart = useCallback(() => {
    const sessionName = timer.sessionName || timerSettings.defaultSessionName || 'Work Session';
    timer.startSession(sessionName);
    requestPermission();
    
    // Play start sound
    if (timerSettings.soundEnabled && timerSettings.soundOnStart) {
      soundManager.playStart(timerSettings.soundType);
    }
  }, [timer, requestPermission, timerSettings]);

  const handlePause = useCallback(() => {
    timer.pause();
    
    // Play pause sound
    if (timerSettings.soundEnabled && timerSettings.soundOnPause) {
      soundManager.playPause(timerSettings.soundType);
    }
  }, [timer, timerSettings]);

  const handleResume = useCallback(() => {
    timer.resume();
    
    // Play resume sound (same as start)
    if (timerSettings.soundEnabled && timerSettings.soundOnStart) {
      soundManager.playStart(timerSettings.soundType);
    }
  }, [timer, timerSettings]);

  const handleLap = useCallback(() => {
    timer.lap();
    
    // Play lap sound
    if (timerSettings.soundEnabled && timerSettings.soundOnLap) {
      soundManager.playLap(timerSettings.soundType);
    }
  }, [timer, timerSettings]);

  const handleBreakToggle = useCallback(() => {
    if (!timer.isRunning) return;
    if (isBreak) {
      handleLap(); // Record break as a lap
    }
    setIsBreak((v) => !v);
  }, [isBreak, timer.isRunning, handleLap]);

  const handleStop = useCallback(() => {
    if (timer.isRunning) handlePause();
    if (timer.elapsedTime > 0) setShowSaveModal(true);
  }, [timer, handlePause]);

  const handleSave = useCallback(async () => {
    await timer.saveSession();
    setShowSaveModal(false);
    setIsBreak(false);
    setBreakTime(0);
    
    // Clear auto-save backup
    try {
      localStorage.removeItem('timeflow_autosave');
    } catch (e) {
      // Ignore
    }
  }, [timer]);

  const handleDiscard = useCallback(() => {
    timer.discardSession();
    setShowDiscardModal(false);
    setShowSaveModal(false);
    setIsBreak(false);
    setBreakTime(0);
    lastMilestoneRef.current = 0;
    
    // Clear auto-save backup
    try {
      localStorage.removeItem('timeflow_autosave');
    } catch (e) {
      // Ignore
    }
  }, [timer]);

  const handleReset = useCallback(() => {
    if (timer.elapsedTime > 0) {
      setShowDiscardModal(true);
    } else {
      timer.reset();
      setIsBreak(false);
      setBreakTime(0);
      lastMilestoneRef.current = 0;
    }
  }, [timer]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: ' ',
      description: 'Start/Pause',
      action: () => {
        if (!timer.isRunning) handleStart();
        else if (timer.isPaused) handleResume();
        else handlePause();
      },
    },
    { key: 'r', description: 'Reset', action: handleReset },
    { key: 'l', description: 'Lap', action: handleLap },
    { key: 'b', description: 'Toggle Break', action: handleBreakToggle },
    { key: 's', ctrl: true, description: 'Save', action: handleStop },
  ]);

  // Calculate progress (loops every minute)
  const progressPercent = ((timer.elapsedTime % 60000) / 60000) * 100;

  const circleSize = 300;
  const reducedMotion = settings.accessibility.reducedMotion;

  return (
    <>
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && !reducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex flex-col items-center gap-4 p-8"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles size={64} className="text-yellow-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Session Saved!</h2>
              <p className="text-white/70">Great work! Keep it up!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-xl mx-auto">
        {/* Main timer card */}
        <Card
          variant="glass"
          padding="none"
          hover={false}
          className={cn(
            'relative overflow-hidden',
            'border-2',
            timer.isRunning && !timer.isPaused
              ? isBreak
                ? 'border-warning/30'
                : 'border-primary-500/30'
              : 'border-border/50'
          )}
        >
          {/* Background glow effect when running */}
          {timer.isRunning && !timer.isPaused && !reducedMotion && (
            <motion.div
              className={cn(
                'absolute inset-0 opacity-10',
                isBreak
                  ? 'bg-gradient-to-br from-warning to-orange-500'
                  : 'bg-gradient-to-br from-primary-500 to-accent-500'
              )}
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          <div className="relative p-6 lg:p-10">
            {/* Session name input */}
            <div className="mb-6">
              <SessionNameInput
                value={timer.sessionName}
                onChange={timer.setSessionName}
                disabled={timer.isRunning && !timer.isPaused}
                defaultValue={timerSettings.defaultSessionName}
              />
            </div>

            {/* Timer display with circular progress */}
            <div className="flex items-center justify-center py-6">
              <div 
                className="relative"
                style={{ 
                  width: circleSize, 
                  height: circleSize 
                }}
              >
                <CircularProgress
                  progress={progressPercent}
                  size={circleSize}
                  strokeWidth={6}
                  isRunning={timer.isRunning && !timer.isPaused}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <TimerDisplay
                    time={timer.elapsedTime}
                    isRunning={timer.isRunning}
                    isPaused={timer.isPaused}
                    isBreak={isBreak}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            {/* Break time indicator */}
            <AnimatePresence>
              {breakTime > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 mb-4"
                >
                  <Coffee size={16} className="text-warning" />
                  <span className="text-sm text-muted-foreground">
                    Break time: <span className="text-warning font-medium">{formatDuration(breakTime)}</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <ControlButton
                onClick={handleReset}
                icon={RotateCcw}
                label="Reset (R)"
                variant="secondary"
                disabled={timer.elapsedTime === 0}
              />

              <motion.button
                onClick={() => {
                  if (!timer.isRunning) handleStart();
                  else if (timer.isPaused) handleResume();
                  else handlePause();
                }}
                className={cn(
                  'w-18 h-18 rounded-full flex items-center justify-center',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-4 focus:ring-offset-2',
                  timer.isRunning && !timer.isPaused
                    ? 'bg-gradient-to-br from-red-500 to-orange-500 focus:ring-red-500/50 shadow-lg shadow-red-500/30'
                    : 'bg-gradient-to-br from-primary-500 to-accent-500 focus:ring-primary-500/50 shadow-lg shadow-primary-500/30'
                )}
                style={{ width: 72, height: 72 }}
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
              >
                {timer.isRunning && !timer.isPaused ? (
                  <Pause size={30} className="text-white" />
                ) : (
                  <Play size={30} className="text-white ml-1" />
                )}
              </motion.button>

              <ControlButton
                onClick={handleLap}
                icon={Flag}
                label="Lap (L)"
                variant="secondary"
                disabled={!timer.isRunning}
              />
            </div>

            {/* Secondary controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant={isBreak ? 'accent' : 'outline'}
                size="sm"
                onClick={handleBreakToggle}
                disabled={!timer.isRunning}
                className="gap-2"
              >
                <Coffee size={16} />
                {isBreak ? 'End Break' : 'Take Break'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleStop}
                disabled={timer.elapsedTime === 0}
                className="gap-2"
                glow
              >
                <Save size={16} />
                Save Session
              </Button>
            </div>

            {/* Laps */}
            <AnimatePresence>
              {timer.laps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <LapList laps={timer.laps} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard hints - controlled by accessibility settings */}
            {settings.accessibility.keyboardNavigationHints && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-muted font-mono text-[10px]">Space</kbd>
                  Start/Pause
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-muted font-mono text-[10px]">R</kbd>
                  Reset
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-muted font-mono text-[10px]">L</kbd>
                  Lap
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-muted font-mono text-[10px]">B</kbd>
                  Break
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Session"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Session</span>
              <span className="font-medium">{timer.sessionName || 'Unnamed Session'}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="font-medium text-primary-500">{formatDuration(timer.elapsedTime)}</span>
            </div>
            {breakTime > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Break time</span>
                <span className="font-medium text-warning">{formatDuration(breakTime)}</span>
              </div>
            )}
            {timer.laps.length > 0 && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Laps</span>
                <span className="font-medium">{timer.laps.length}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowSaveModal(false)}>
              Continue Timer
            </Button>
            <Button variant="danger" onClick={handleDiscard}>
              Discard
            </Button>
            <Button variant="primary" onClick={handleSave} isLoading={timer.isSaving} glow>
              <Save size={16} className="mr-2" />
              Save Session
            </Button>
          </div>
        </div>
      </Modal>

      {/* Discard Modal */}
      <Modal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        title="Discard Session?"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to discard this session? This cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowDiscardModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDiscard}>
              Discard
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}