import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@/types';
import {
  getSessions,
  saveSessions,
  addSession as addSessionToStorage,
  deleteSession as deleteSessionFromStorage,
  updateSession as updateSessionInStorage,
} from '@/lib/storage';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load sessions on mount
  useEffect(() => {
    async function loadSessions() {
      try {
        const stored = await getSessions();
        setSessions(stored.sort((a, b) => b.createdAt - a.createdAt));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load sessions'));
      } finally {
        setIsLoading(false);
      }
    }
    loadSessions();
  }, []);

  const addSession = useCallback(async (session: Session) => {
    try {
      await addSessionToStorage(session);
      setSessions((prev) => [session, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add session'));
    }
  }, []);

  const updateSession = useCallback(
    async (id: string, updates: Partial<Session>) => {
      try {
        await updateSessionInStorage(id, updates);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update session'));
      }
    },
    []
  );

  const deleteSession = useCallback(async (id: string) => {
    try {
      await deleteSessionFromStorage(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete session'));
    }
  }, []);

  const refreshSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await getSessions();
      setSessions(stored.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh sessions'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sessions,
    isLoading,
    error,
    addSession,
    updateSession,
    deleteSession,
    refreshSessions,
  };
}