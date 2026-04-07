// types/index.ts - COMPLETE FIXED VERSION

// ============================================
// Session Types
// ============================================

export interface Session {
  id: string;
  name: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  laps: Lap[];
  tags?: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Lap {
  id: string;
  lapNumber: number;
  time: number;
  splitTime: number;
  timestamp: number;
}

export interface StopwatchState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedTime: number;
  laps: Lap[];
  sessionName: string;
}

// ============================================
// Premium Theme Types
// ============================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface GradientConfig {
  enabled: boolean;
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  colors: string[];
  opacity: number;
  animated: boolean;
}

export interface SurfaceColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface SemanticColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

export interface EffectsConfig {
  blur: number;
  glowIntensity: number;
  shadowIntensity: number;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  animationSpeed: 'slow' | 'normal' | 'fast';
  reducedMotion: boolean;
}

export interface TypographyConfig {
  fontFamily: 'inter' | 'system' | 'mono' | 'serif';
  fontSize: 'sm' | 'base' | 'lg';
  fontWeight: 'normal' | 'medium' | 'semibold';
}

// ============================================
// Per-component Background Colors
// ============================================

export interface ComponentColors {
  /** Sidebar background color (hex) */
  sidebarBg: string;
  /** Header background color (hex) */
  headerBg: string;
  /** Timer card background color (hex) */
  timerBg: string;
  /** Main content area background color (hex) */
  contentBg: string;
  /** Dashboard cards background color (hex) */
  dashboardCardBg: string;
  /** Navigation bar background color (hex) */
  navBg: string;
}

export interface ThemeConfig {
  // Basic
  id: string;
  name: string;
  mode: ThemeMode;

  // Core Colors
  primary: string;
  secondary?: string; // Optional - uses slate by default
  accent: string;

  // Surface colors (light mode)
  surfaces: SurfaceColors;

  // Surface colors (dark mode)
  surfacesDark: SurfaceColors;

  // Semantic colors
  semantic: SemanticColors;

  // Per-component background overrides
  componentColors: ComponentColors;

  // Background
  background: {
    type: 'solid' | 'gradient' | 'mesh' | 'animated';
    solid: string;
    gradient: GradientConfig;
    pattern?: 'dots' | 'grid' | 'noise' | 'none';
    patternOpacity: number;
  };

  // Effects
  effects: EffectsConfig;

  // Typography
  typography: TypographyConfig;

  // Sidebar
  sidebar: {
    style: 'default' | 'glass' | 'solid' | 'bordered';
    background: string;
    activeItemStyle: 'filled' | 'bordered' | 'underline' | 'glow';
  };

  // Cards
  cards: {
    style: 'default' | 'glass' | 'bordered' | 'elevated' | 'gradient';
    background: string;
    borderColor: string;
    hoverEffect: 'none' | 'lift' | 'glow' | 'scale' | 'border';
  };

  // Buttons
  buttons: {
    style: 'default' | 'pill' | 'square' | 'ghost';
    primaryGradient: boolean;
    hoverEffect: 'none' | 'glow' | 'scale' | 'shine';
  };

  // Timer specific
  timer: {
    displayStyle: 'default' | 'minimal' | 'neon' | 'gradient';
    fontFamily: 'mono' | 'sans' | 'digital';
    showMilliseconds: boolean;
    pulseWhenRunning: boolean;
    glowColor: string;
  };

  // Charts
  charts: {
    style: 'default' | 'gradient' | 'neon';
    colors: string[];
    gridOpacity: number;
  };

  customCSS?: string;
}

// ============================================
// Preset Themes
// ============================================

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary?: string;
    accent: string;
    background: string;
  };
  config: Partial<ThemeConfig>;
  isPremium: boolean;
}

// ============================================
// Stats Types
// ============================================

export interface Stats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  totalSessions: number;
  averageDailyTime: number;
  longestSession: Session | null;
  mostActiveDay: string;
  totalAllTime: number;
  streak: number;
  averageSessionLength: number;
}

export interface DailyActivity {
  date: string;
  duration: number;
  sessions: number;
}

export interface WeeklyData {
  week: string;
  startDate: string;
  endDate: string;
  duration: number;
  sessions: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  duration: number;
  sessions: number;
}

// ============================================
// Misc Types
// ============================================

export type ExportFormat = 'json' | 'csv';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
export * from './settings';