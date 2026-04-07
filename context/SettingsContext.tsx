// context/SettingsContext.tsx - FIXED VERSION
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSettings } from '@/hooks/useSettings';
import type { 
  AppSettings, 
  TimerSettings, 
  NotificationSettings, 
  GoalSettings, 
  AccessibilitySettings, 
  DataSettings 
} from '@/types/settings';

interface SettingsContextType {
  settings: AppSettings;
  isLoaded: boolean;
  setSettings: (updates: Partial<AppSettings>) => void;
  setTimerSettings: (updates: Partial<TimerSettings>) => void;
  setNotificationSettings: (updates: Partial<NotificationSettings>) => void;
  setGoalSettings: (updates: Partial<GoalSettings>) => void;
  setAccessibilitySettings: (updates: Partial<AccessibilitySettings>) => void;
  setDataSettings: (updates: Partial<DataSettings>) => void;
  resetSettings: () => void;
  resetSection: (section: keyof AppSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // ✅ useSettings already returns a memoized value
  const value = useSettings();

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
}