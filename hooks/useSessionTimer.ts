import { useCallback, useState } from 'react';
import type { Session, Lap } from '@/types';
import { generateId } from '@/lib/utils';
import { addSession } from '@/lib/storage';
import { useStopwatch } from './useStopwatch';

interface UseSessionTimerOptions {
  onSessionSaved?: (session: Session) => void;
  onSessionStart?: () => void;
}

export function useSessionTimer(options: UseSessionTimerOptions = {}) {
  const { onSessionSaved, onSessionStart } = options;
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const stopwatch = useStopwatch({
    onTick: undefined, // Can add progress tracking here
  });

  const startSession = useCallback((name?: string) => {
    const sessionId = generateId();
    setCurrentSessionId(sessionId);
    if (name) {
      stopwatch.setSessionName(name);
    }
    stopwatch.start();
    onSessionStart?.();
  }, [stopwatch, onSessionStart]);

  const saveSession = useCallback(async () => {
    if (!currentSessionId || stopwatch.elapsedTime === 0) return null;

    setIsSaving(true);
    
    const session: Session = {
      id: currentSessionId,
      name: stopwatch.sessionName || 'Unnamed Session',
      startTime: Date.now() - stopwatch.elapsedTime,
      endTime: Date.now(),
      duration: stopwatch.elapsedTime,
      laps: stopwatch.laps,
      createdAt: Date.now() - stopwatch.elapsedTime,
      updatedAt: Date.now(),
    };

    try {
      await addSession(session);
      onSessionSaved?.(session);
      stopwatch.reset();
      setCurrentSessionId(null);
      return session;
    } catch (error) {
      console.error('Failed to save session:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [currentSessionId, stopwatch, onSessionSaved]);

  const discardSession = useCallback(() => {
    stopwatch.reset();
    setCurrentSessionId(null);
  }, [stopwatch]);

  return {
    ...stopwatch,
    currentSessionId,
    isSaving,
    startSession,
    saveSession,
    discardSession,
  };
}