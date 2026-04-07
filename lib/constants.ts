export const DEFAULT_SESSION_NAMES = [
  'Study',
  'Work',
  'Coding',
  'Workout',
  'Reading',
  'Meeting',
  'Break',
  'Project',
];

export const PRIMARY_COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
];

export const KEYBOARD_SHORTCUTS = {
  START_STOP: { key: ' ', description: 'Start/Stop timer' },
  RESET: { key: 'r', description: 'Reset timer' },
  LAP: { key: 'l', description: 'Record lap' },
  SAVE: { key: 's', ctrl: true, description: 'Save session' },
  TOGGLE_THEME: { key: 'd', ctrl: true, description: 'Toggle dark mode' },
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const CHART_COLORS = {
  primary: 'var(--color-primary-500)',
  secondary: 'var(--color-accent)',
  grid: 'var(--color-border)',
  text: 'var(--color-muted-foreground)',
};