// hooks/useSettings.ts - FIXED VERSION
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { 
  AppSettings, 
  TimerSettings, 
  NotificationSettings, 
  GoalSettings, 
  AccessibilitySettings, 
  DataSettings 
} from '@/types/settings';
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
  
  // ✅ Use ref to always have access to latest settings for accessibility
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

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
    root.classList.toggle('reduce-motion', accessibility.reducedMotion);
    
    // High contrast
    root.classList.toggle('high-contrast', accessibility.highContrast);
    
    // Large text
    root.classList.toggle('large-text', accessibility.largeText);
  }, []);

  // ✅ FIXED: Use functional update to always get latest state
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

  // ✅ FIXED: Section setters now use functional updates - NO stale closures!
  const setTimerSettings = useCallback((updates: Partial<TimerSettings>) => {
    setSettingsState(prev => {
      const updated: AppSettings = {
        ...prev,
        timer: { ...prev.timer, ...updates },
        lastUpdated: Date.now(),
      };
      saveSettings(updated);
      return updated;
    });
  }, []); // ✅ No dependencies needed!

  const setNotificationSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setSettingsState(prev => {
      const updated: AppSettings = {
        ...prev,
        notifications: { ...prev.notifications, ...updates },
        lastUpdated: Date.now(),
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const setGoalSettings = useCallback((updates: Partial<GoalSettings>) => {
    setSettingsState(prev => {
      const updated: AppSettings = {
        ...prev,
        goals: { ...prev.goals, ...updates },
        lastUpdated: Date.now(),
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const setAccessibilitySettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettingsState(prev => {
      const updatedAccessibility = { ...prev.accessibility, ...updates };
      const updated: AppSettings = {
        ...prev,
        accessibility: updatedAccessibility,
        lastUpdated: Date.now(),
      };
      saveSettings(updated);
      applyAccessibilitySettings(updatedAccessibility);
      return updated;
    });
  }, [applyAccessibilitySettings]);

  const setDataSettings = useCallback((updates: Partial<DataSettings>) => {
    setSettingsState(prev => {
      const updated: AppSettings = {
        ...prev,
        data: { ...prev.data, ...updates },
        lastUpdated: Date.now(),
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    const defaults = {
      ...DEFAULT_APP_SETTINGS,
      lastUpdated: Date.now(),
    };
    setSettingsState(defaults);
    saveSettings(defaults);
    applyAccessibilitySettings(defaults.accessibility);
  }, [applyAccessibilitySettings]);

  const resetSection = useCallback((section: keyof AppSettings) => {
    const sectionDefaults: Record<string, unknown> = {
      timer: DEFAULT_APP_SETTINGS.timer,
      notifications: DEFAULT_APP_SETTINGS.notifications,
      goals: DEFAULT_APP_SETTINGS.goals,
      accessibility: DEFAULT_APP_SETTINGS.accessibility,
      data: DEFAULT_APP_SETTINGS.data,
    };
    
    if (sectionDefaults[section]) {
      setSettingsState(prev => {
        const updated: AppSettings = {
          ...prev,
          [section]: sectionDefaults[section],
          lastUpdated: Date.now(),
        };
        saveSettings(updated);
        
        if (section === 'accessibility') {
          applyAccessibilitySettings(updated.accessibility);
        }
        
        return updated;
      });
    }
  }, [applyAccessibilitySettings]);

  // ✅ Memoize return value - dependencies are stable now
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