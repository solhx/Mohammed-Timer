import { useState, useRef, useCallback, useEffect } from 'react';
import type { Lap, StopwatchState } from '@/types';
import { generateId } from '@/lib/utils';

interface UseStopwatchOptions {
  onTick?: (elapsed: number) => void;
  onLap?:  (lap: Lap) => void;
  onStop?: (elapsed: number) => void;
}

interface UseStopwatchReturn extends StopwatchState {
  start:          () => void;
  pause:          () => void;
  resume:         () => void;
  reset:          () => void;
  lap:            () => void;
  setSessionName: (name: string) => void;
}

export function useStopwatch(
  options: UseStopwatchOptions = {}
): UseStopwatchReturn {
  // Store callbacks in refs so the RAF loop never goes stale
  const onTickRef = useRef(options.onTick);
  const onLapRef  = useRef(options.onLap);
  const onStopRef = useRef(options.onStop);
  useEffect(() => { onTickRef.current = options.onTick; }, [options.onTick]);
  useEffect(() => { onLapRef.current  = options.onLap;  }, [options.onLap]);
  useEffect(() => { onStopRef.current = options.onStop; }, [options.onStop]);

  const [isRunning,    setIsRunning]    = useState(false);
  const [isPaused,     setIsPaused]     = useState(false);
  const [elapsedTime,  setElapsedTime]  = useState(0);
  const [laps,         setLaps]         = useState<Lap[]>([]);
  const [sessionName,  setSessionName]  = useState('');

  // Refs that survive renders without causing re-renders
  const startTimeRef    = useRef(0);   // performance.now() at start/resume
  const pausedTimeRef   = useRef(0);   // accumulated paused ms
  const elapsedRef      = useRef(0);   // mirror of elapsedTime for callbacks
  const lastLapTimeRef  = useRef(0);
  const lapsLengthRef   = useRef(0);   // avoid stale closure in lap()
  const rafIdRef        = useRef<number | null>(null);
  const isRunningRef    = useRef(false);
  const isPausedRef     = useRef(false);

  // ── RAF tick (never recreated) ───────────
  const tick = useCallback(() => {
    const elapsed =
      performance.now() - startTimeRef.current + pausedTimeRef.current;
    elapsedRef.current = elapsed;
    setElapsedTime(elapsed);
    onTickRef.current?.(elapsed);
    rafIdRef.current = requestAnimationFrame(tick);
  }, []); // ← empty deps: safe because all mutable state is in refs

  const stopRaf = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // ── Start ────────────────────────────────
  const start = useCallback(() => {
    if (isRunningRef.current) return;

    startTimeRef.current   = performance.now();
    pausedTimeRef.current  = 0;
    lastLapTimeRef.current = 0;
    elapsedRef.current     = 0;
    lapsLengthRef.current  = 0;

    isRunningRef.current = true;
    isPausedRef.current  = false;

    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);
    setLaps([]);

    rafIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // ── Pause ────────────────────────────────
  const pause = useCallback(() => {
    if (!isRunningRef.current || isPausedRef.current) return;

    stopRaf();
    pausedTimeRef.current = elapsedRef.current;
    isPausedRef.current   = true;

    setIsPaused(true);
    onStopRef.current?.(elapsedRef.current);
  }, [stopRaf]);

  // ── Resume ───────────────────────────────
  const resume = useCallback(() => {
    if (!isRunningRef.current || !isPausedRef.current) return;

    startTimeRef.current = performance.now();
    isPausedRef.current  = false;

    setIsPaused(false);
    rafIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // ── Reset ─────────────────────────────────
  const reset = useCallback(() => {
    stopRaf();

    isRunningRef.current   = false;
    isPausedRef.current    = false;
    startTimeRef.current   = 0;
    pausedTimeRef.current  = 0;
    elapsedRef.current     = 0;
    lastLapTimeRef.current = 0;
    lapsLengthRef.current  = 0;

    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setLaps([]);
  }, [stopRaf]);

  // ── Lap ──────────────────────────────────
  const lap = useCallback(() => {
    if (!isRunningRef.current || isPausedRef.current) return;

    const current   = elapsedRef.current;
    const splitTime = current - lastLapTimeRef.current;
    lastLapTimeRef.current = current;
    lapsLengthRef.current += 1;

    const newLap: Lap = {
      id:        generateId(),
      lapNumber: lapsLengthRef.current,
      time:      current,
      splitTime,
      timestamp: Date.now(),
    };

    setLaps((prev) => [...prev, newLap]);
    onLapRef.current?.(newLap);
  }, []);

  // ── Cleanup ───────────────────────────────
  useEffect(() => () => stopRaf(), [stopRaf]);

  return {
    isRunning,
    isPaused,
    elapsedTime,
    laps,
    sessionName,
    start,
    pause,
    resume,
    reset,
    lap,
    setSessionName,
  };
}