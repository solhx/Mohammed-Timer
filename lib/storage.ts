// lib/storage.ts - UPDATED (remove duplicate deepMerge)
import { get, set, del, keys, clear } from 'idb-keyval';
import type { Session, ThemeConfig } from '@/types';
import { DEFAULT_THEME } from '@/lib/theme-presets';
import { deepMerge } from '@/lib/utils'; // ← Import from utils

const SESSIONS_KEY = 'timeflow_sessions';
const THEME_KEY = 'timeflow_theme';
const SETTINGS_KEY = 'timeflow_settings';

// ============================================
// Core Storage Utilities
// ============================================

async function getFromStorage<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const value = await get(key);
    return value !== undefined ? value : defaultValue;
  } catch {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

async function setToStorage<T>(key: string, value: T): Promise<void> {
  try {
    await set(key, value);
  } catch {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
}

async function removeFromStorage(key: string): Promise<void> {
  try {
    await del(key);
  } catch {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage removal error:', e);
    }
  }
}

// ============================================
// Sessions
// ============================================

export async function getSessions(): Promise<Session[]> {
  return getFromStorage<Session[]>(SESSIONS_KEY, []);
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  return setToStorage(SESSIONS_KEY, sessions);
}

export async function addSession(session: Session): Promise<void> {
  const sessions = await getSessions();
  sessions.push(session);
  await saveSessions(sessions);
}

export async function updateSession(
  id: string,
  updates: Partial<Session>
): Promise<void> {
  const sessions = await getSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates, updatedAt: Date.now() };
    await saveSessions(sessions);
  }
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await getSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  await saveSessions(filtered);
}

export async function clearAllSessions(): Promise<void> {
  await saveSessions([]);
}

// ============================================
// Theme (Async - IndexedDB + localStorage)
// ============================================

export async function getThemeConfig(): Promise<ThemeConfig> {
  const stored = await getFromStorage<Partial<ThemeConfig> | null>(THEME_KEY, null);
  
  if (stored) {
    return deepMerge(DEFAULT_THEME, stored);
  }
  
  return DEFAULT_THEME;
}

export async function saveThemeConfig(config: ThemeConfig): Promise<void> {
  // Write to localStorage FIRST for instant access
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('localStorage theme write failed:', e);
  }
  
  return setToStorage(THEME_KEY, config);
}

// ============================================
// Theme (Sync - localStorage only)
// ============================================

export function getThemeConfigSync(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  
  try {
    const item = localStorage.getItem(THEME_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      return deepMerge(DEFAULT_THEME, parsed);
    }
  } catch (e) {
    console.error('Sync theme read failed:', e);
  }
  
  return DEFAULT_THEME;
}

export function saveThemeConfigSync(config: ThemeConfig): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Sync theme write failed:', e);
  }
}

// ============================================
// Export / Import
// ============================================

export async function exportAllData(): Promise<{
  sessions: Session[];
  theme: ThemeConfig;
  exportedAt: string;
}> {
  const sessions = await getSessions();
  const theme = await getThemeConfig();

  return {
    sessions,
    theme,
    exportedAt: new Date().toISOString(),
  };
}

export async function importData(data: {
  sessions?: Session[];
  theme?: ThemeConfig;
}): Promise<void> {
  if (data.sessions) {
    await saveSessions(data.sessions);
  }
  if (data.theme) {
    await saveThemeConfig(data.theme);
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await clear();
  } catch {
    // Ignore
  }
  
  try {
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch {
    // Ignore
  }
}