// hooks/useSettings.ts - NEW FILE
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AppSettings, TimerSettings, NotificationSettings, GoalSettings, AccessibilitySettings, DataSettings } from '@/types/settings';
import { DEFAULT_APP_SETTINGS } from '@/types/settings';
import { deepMerge } from '@/lib/utils';

const SETTINGS_KEY = 'timeflow_settings';

function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return deepMerge(DEFAULT_APP_SETTINGS, parsed);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  
  return DEFAULT_APP_SETTINGS;
}

function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      ...settings,
      lastUpdated: Date.now(),
    }));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const stored = getStoredSettings();
    setSettingsState(stored);
    setIsLoaded(true);
    
    // Apply accessibility settings
    applyAccessibilitySettings(stored.accessibility);
  }, []);

  // Apply accessibility settings to DOM
  const applyAccessibilitySettings = useCallback((accessibility: AccessibilitySettings) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Reduced motion
    if (accessibility.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // High contrast
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text
    if (accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, []);

  // Update entire settings object
  const setSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettingsState(prev => {
      const updated = deepMerge(prev, updates);
      saveSettings(updated);
      
      // Apply accessibility if changed
      if (updates.accessibility) {
        applyAccessibilitySettings(updated.accessibility);
      }
      
      return updated;
    });
  }, [applyAccessibilitySettings]);

  // Update specific sections
  const setTimerSettings = useCallback((updates: Partial<TimerSettings>) => {
    setSettings({ timer: { ...settings.timer, ...updates } });
  }, [settings.timer, setSettings]);

  const setNotificationSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setSettings({ notifications: { ...settings.notifications, ...updates } });
  }, [settings.notifications, setSettings]);

  const setGoalSettings = useCallback((updates: Partial<GoalSettings>) => {
    setSettings({ goals: { ...settings.goals, ...updates } });
  }, [settings.goals, setSettings]);

  const setAccessibilitySettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettings({ accessibility: { ...settings.accessibility, ...updates } });
  }, [settings.accessibility, setSettings]);

  const setDataSettings = useCallback((updates: Partial<DataSettings>) => {
    setSettings({ data: { ...settings.data, ...updates } });
  }, [settings.data, setSettings]);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_APP_SETTINGS);
    saveSettings(DEFAULT_APP_SETTINGS);
    applyAccessibilitySettings(DEFAULT_APP_SETTINGS.accessibility);
  }, [applyAccessibilitySettings]);

  const resetSection = useCallback((section: keyof AppSettings) => {
    const defaults: Record<string, unknown> = {
      timer: DEFAULT_APP_SETTINGS.timer,
      notifications: DEFAULT_APP_SETTINGS.notifications,
      goals: DEFAULT_APP_SETTINGS.goals,
      accessibility: DEFAULT_APP_SETTINGS.accessibility,
      data: DEFAULT_APP_SETTINGS.data,
    };
    
    if (defaults[section]) {
      setSettings({ [section]: defaults[section] } as Partial<AppSettings>);
    }
  }, [setSettings]);

  return useMemo(() => ({
    settings,
    isLoaded,
    setSettings,
    setTimerSettings,
    setNotificationSettings,
    setGoalSettings,
    setAccessibilitySettings,
    setDataSettings,
    resetSettings,
    resetSection,
  }), [
    settings,
    isLoaded,
    setSettings,
    setTimerSettings,
    setNotificationSettings,
    setGoalSettings,
    setAccessibilitySettings,
    setDataSettings,
    resetSettings,
    resetSection,
  ]);
}