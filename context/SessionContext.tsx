'use client';

import {
  createContext, useContext, ReactNode, useMemo, useRef,
} from 'react';
import { useSessions } from '@/hooks/useSessions';
import { useStats }    from '@/hooks/useStats';
import type {
  Session, Stats, DailyActivity, WeeklyData, MonthlyData,
} from '@/types';

interface SessionContextType {
  sessions:        Session[];
  isLoading:       boolean;
  error:           Error | null;
  addSession:      (session: Session) => Promise<void>;
  updateSession:   (id: string, updates: Partial<Session>) => Promise<void>;
  deleteSession:   (id: string) => Promise<void>;
  refreshSessions: () => Promise<void>;
  stats:           Stats;
  dailyActivity:   DailyActivity[];
  weeklyData:      WeeklyData[];
  monthlyData:     MonthlyData[];
  todaySessionCount: number;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const {
    sessions,
    isLoading,
    error,
    addSession,
    updateSession,
    deleteSession,
    refreshSessions,
  } = useSessions();

  const { stats, dailyActivity, weeklyData, monthlyData } = useStats(sessions);

  // Stable today count — recalculates only when sessions change
  const todaySessionCount = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return sessions.filter((s) => s.startTime >= startOfDay.getTime()).length;
  }, [sessions]);

  // Build context value — each primitive/array is already memoised
  // by the hooks above; only rebuilds when any dep actually changes
  const value = useMemo<SessionContextType>(
    () => ({
      sessions,
      isLoading,
      error,
      addSession,
      updateSession,
      deleteSession,
      refreshSessions,
      stats,
      dailyActivity,
      weeklyData,
      monthlyData,
      todaySessionCount,
    }),
    [
      sessions, isLoading, error,
      addSession, updateSession, deleteSession, refreshSessions,
      stats, dailyActivity, weeklyData, monthlyData,
      todaySessionCount,
    ]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSessionContext must be used within SessionProvider');
  return ctx;
}