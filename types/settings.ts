// types/settings.ts - NEW FILE
export interface TimerSettings {
  // Display
  showMilliseconds: boolean;
  use24HourFormat: boolean;
  
  // Session defaults
  defaultSessionName: string;
  rememberLastSessionName: boolean;
  
  // Auto-save
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // minutes, 0 = disabled
  
  // Sounds
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  soundOnStart: boolean;
  soundOnPause: boolean;
  soundOnLap: boolean;
  soundOnComplete: boolean;
  soundType: 'chime' | 'bell' | 'ding' | 'beep';
  
  // Pomodoro
  pomodoroEnabled: boolean;
  pomodoroWorkDuration: number; // minutes
  pomodoroShortBreak: number; // minutes
  pomodoroLongBreak: number; // minutes
  pomodoroSessionsBeforeLongBreak: number;
  pomodoroAutoStartBreak: boolean;
  pomodoroAutoStartWork: boolean;
  pomodoroShowNotification: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  
  // Break reminders
  breakReminders: boolean;
  breakReminderInterval: number; // minutes
  
  // Milestone alerts
  milestoneAlerts: boolean;
  milestoneIntervals: number[]; // minutes [30, 60, 120]
  
  // Goal notifications
  dailyGoalNotification: boolean;
  weeklyGoalNotification: boolean;
  
  // Sound
  notificationSound: 'none' | 'chime' | 'bell' | 'ding';
}

export interface GoalSettings {
  // Time goals
  dailyTimeGoal: number; // minutes, 0 = disabled
  weeklyTimeGoal: number; // minutes, 0 = disabled
  
  // Session goals
  dailySessionGoal: number; // 0 = disabled
  weeklySessionGoal: number; // 0 = disabled
  
  // Display
  showProgressInHeader: boolean;
  showProgressInDashboard: boolean;
  
  // Celebrations
  celebrateGoalCompletion: boolean;
  streakTracking: boolean;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  focusIndicators: boolean;
  screenReaderAnnouncements: boolean;
  keyboardNavigationHints: boolean;
}

export interface DataSettings {
  // Auto-backup
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackupDate: number | null;
  
  // Retention
  retentionEnabled: boolean;
  retentionDays: number; // 0 = forever
  
  // Export preferences
  defaultExportFormat: 'json' | 'csv';
  includeThemeInExport: boolean;
}

export interface AppSettings {
  timer: TimerSettings;
  notifications: NotificationSettings;
  goals: GoalSettings;
  accessibility: AccessibilitySettings;
  data: DataSettings;
  
  // Meta
  version: number;
  lastUpdated: number;
}

// Default settings
export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  showMilliseconds: true,
  use24HourFormat: false,
  defaultSessionName: '',
  rememberLastSessionName: true,
  autoSaveEnabled: false,
  autoSaveInterval: 5,
  soundEnabled: true,
  soundVolume: 50,
  soundOnStart: false,
  soundOnPause: false,
  soundOnLap: true,
  soundOnComplete: true,
  soundType: 'chime',
  pomodoroEnabled: false,
  pomodoroWorkDuration: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  pomodoroSessionsBeforeLongBreak: 4,
  pomodoroAutoStartBreak: false,
  pomodoroAutoStartWork: false,
  pomodoroShowNotification: true,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  breakReminders: false,
  breakReminderInterval: 60,
  milestoneAlerts: true,
  milestoneIntervals: [30, 60, 120],
  dailyGoalNotification: true,
  weeklyGoalNotification: true,
  notificationSound: 'chime',
};

export const DEFAULT_GOAL_SETTINGS: GoalSettings = {
  dailyTimeGoal: 0,
  weeklyTimeGoal: 0,
  dailySessionGoal: 0,
  weeklySessionGoal: 0,
  showProgressInHeader: false,
  showProgressInDashboard: true,
  celebrateGoalCompletion: true,
  streakTracking: true,
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  focusIndicators: true,
  screenReaderAnnouncements: true,
  keyboardNavigationHints: true,
};

export const DEFAULT_DATA_SETTINGS: DataSettings = {
  autoBackup: false,
  backupFrequency: 'weekly',
  lastBackupDate: null,
  retentionEnabled: false,
  retentionDays: 365,
  defaultExportFormat: 'json',
  includeThemeInExport: true,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  timer: DEFAULT_TIMER_SETTINGS,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  goals: DEFAULT_GOAL_SETTINGS,
  accessibility: DEFAULT_ACCESSIBILITY_SETTINGS,
  data: DEFAULT_DATA_SETTINGS,
  version: 1,
  lastUpdated: Date.now(),
};