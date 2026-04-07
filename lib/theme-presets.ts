// lib/theme-presets.ts - ENHANCED VERSION WITH 15+ PRESETS
import type { ThemeConfig, ThemeMode } from '@/types';

// ============================================
// Default component colors
// ============================================

const DEFAULT_COMPONENT_COLORS = {
  sidebarBg: '#ffffff',
  headerBg: '#ffffff',
  timerBg: '#ffffff',
  contentBg: '#f8fafc',
  dashboardCardBg: '#ffffff',
  navBg: '#ffffff',
};

const DARK_COMPONENT_COLORS = {
  sidebarBg: '#0f172a',
  headerBg: '#0f172a',
  timerBg: '#1e293b',
  contentBg: '#0f172a',
  dashboardCardBg: '#1e293b',
  navBg: '#0f172a',
};

// ============================================
// Default Theme
// ============================================

export const DEFAULT_THEME: ThemeConfig = {
  id: 'default',
  name: 'Default',
  mode: 'system',

  primary: '#6366f1',
  secondary: '#64748b',
  accent: '#8b5cf6',

  componentColors: DEFAULT_COMPONENT_COLORS,

  surfaces: {
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    cardForeground: '#0f172a',
    popover: '#ffffff',
    popoverForeground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#6366f1',
  },

  surfacesDark: {
    background: '#0f172a',
    foreground: '#f8fafc',
    card: '#1e293b',
    cardForeground: '#f8fafc',
    popover: '#1e293b',
    popoverForeground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    border: '#334155',
    input: '#334155',
    ring: '#6366f1',
  },

  semantic: {
    primary: '#6366f1',
    primaryForeground: '#ffffff',
    secondary: '#64748b',
    secondaryForeground: '#ffffff',
    accent: '#8b5cf6',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    success: '#22c55e',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff',
    info: '#3b82f6',
    infoForeground: '#ffffff',
  },

  background: {
    type: 'solid',
    solid: '#ffffff',
    gradient: {
      enabled: false,
      type: 'linear',
      angle: 135,
      colors: ['#6366f1', '#8b5cf6'],
      opacity: 10,
      animated: false,
    },
    pattern: 'none',
    patternOpacity: 5,
  },

  effects: {
    blur: 12,
    glowIntensity: 30,
    shadowIntensity: 50,
    borderRadius: 'lg',
    animationSpeed: 'normal',
    reducedMotion: false,
  },

  typography: {
    fontFamily: 'inter',
    fontSize: 'base',
    fontWeight: 'normal',
  },

  sidebar: {
    style: 'default',
    background: '#ffffff',
    activeItemStyle: 'filled',
  },

  cards: {
    style: 'default',
    background: '#ffffff',
    borderColor: '#e2e8f0',
    hoverEffect: 'lift',
  },

  buttons: {
    style: 'default',
    primaryGradient: false,
    hoverEffect: 'scale',
  },

  timer: {
    displayStyle: 'default',
    fontFamily: 'mono',
    showMilliseconds: true,
    pulseWhenRunning: true,
    glowColor: '#6366f1',
  },

  charts: {
    style: 'default',
    colors: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'],
    gridOpacity: 10,
  },
};

// ============================================
// Color Palettes
// ============================================

export const COLOR_PALETTES = {
  primary: [
    { name: 'Slate', value: '#64748b' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Zinc', value: '#71717a' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Lime', value: '#84cc16' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Sky', value: '#0ea5e9' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Fuchsia', value: '#d946ef' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Rose', value: '#f43f5e' },
  ],
  secondary: [
    { name: 'Slate', value: '#64748b' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Zinc', value: '#71717a' },
    { name: 'Neutral', value: '#737373' },
    { name: 'Stone', value: '#78716c' },
  ],
  background: [
    { name: 'White', value: '#ffffff' },
    { name: 'Snow', value: '#fafafa' },
    { name: 'Cream', value: '#fffbeb' },
    { name: 'Rose Mist', value: '#fdf2f8' },
    { name: 'Lavender', value: '#f5f3ff' },
    { name: 'Ice Blue', value: '#f0f9ff' },
    { name: 'Mint', value: '#f0fdf4' },
    { name: 'Charcoal', value: '#18181b' },
    { name: 'Slate Dark', value: '#0f172a' },
    { name: 'Navy', value: '#020617' },
    { name: 'Deep Purple', value: '#0f0515' },
    { name: 'Midnight', value: '#0a0a0f' },
  ],
  component: [
    { name: 'White', value: '#ffffff' },
    { name: 'Snow', value: '#fafafa' },
    { name: 'Light Gray', value: '#f1f5f9' },
    { name: 'Soft Blue', value: '#eff6ff' },
    { name: 'Soft Purple', value: '#faf5ff' },
    { name: 'Soft Green', value: '#f0fdf4' },
    { name: 'Charcoal', value: '#18181b' },
    { name: 'Slate', value: '#0f172a' },
    { name: 'Dark Blue', value: '#0c1a2e' },
    { name: 'Dark Purple', value: '#12071f' },
    { name: 'Dark Green', value: '#052e16' },
    { name: 'Near Black', value: '#09090b' },
  ],
};

// ============================================
// Theme Presets - 15+ Premium Options
// ============================================

export const THEME_PRESETS: Array<{
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  config: Partial<ThemeConfig>;
  isPremium: boolean;
  category?: 'light' | 'dark' | 'colorful' | 'minimal';
}> = [
  // ============ LIGHT THEMES ============
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and minimal design',
    category: 'light',
    preview: {
      primary: '#6366f1',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: '#ffffff',
    },
    config: {},
    isPremium: false,
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Calm blue tones inspired by the sea',
    category: 'light',
    preview: {
      primary: '#0ea5e9',
      secondary: '#64748b',
      accent: '#06b6d4',
      background: '#f0f9ff',
    },
    config: {
      primary: '#0ea5e9',
      accent: '#06b6d4',
      componentColors: {
        sidebarBg: '#e0f2fe',
        headerBg: '#f0f9ff',
        timerBg: '#ffffff',
        contentBg: '#f0f9ff',
        dashboardCardBg: '#ffffff',
        navBg: '#e0f2fe',
      },
      timer: {
        displayStyle: 'default',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#0ea5e9',
      },
    },
    isPremium: false,
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green palette for focus',
    category: 'light',
    preview: {
      primary: '#22c55e',
      secondary: '#64748b',
      accent: '#10b981',
      background: '#f0fdf4',
    },
    config: {
      primary: '#22c55e',
      accent: '#10b981',
      componentColors: {
        sidebarBg: '#dcfce7',
        headerBg: '#f0fdf4',
        timerBg: '#ffffff',
        contentBg: '#f0fdf4',
        dashboardCardBg: '#ffffff',
        navBg: '#dcfce7',
      },
      timer: {
        displayStyle: 'default',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#22c55e',
      },
    },
    isPremium: false,
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm orange and amber tones',
    category: 'colorful',
    preview: {
      primary: '#f97316',
      secondary: '#78716c',
      accent: '#ef4444',
      background: '#fffbeb',
    },
    config: {
      primary: '#f97316',
      accent: '#ef4444',
      componentColors: {
        sidebarBg: '#fef3c7',
        headerBg: '#fffbeb',
        timerBg: '#ffffff',
        contentBg: '#fffbeb',
        dashboardCardBg: '#ffffff',
        navBg: '#fef3c7',
      },
      background: {
        type: 'gradient',
        solid: '#fffbeb',
        gradient: {
          enabled: true,
          type: 'linear',
          angle: 135,
          colors: ['#fef3c7', '#fed7aa'],
          opacity: 30,
          animated: false,
        },
        pattern: 'none',
        patternOpacity: 5,
      },
      timer: {
        displayStyle: 'gradient',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#f97316',
      },
    },
    isPremium: false,
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    description: 'Elegant pink and rose theme',
    category: 'colorful',
    preview: {
      primary: '#ec4899',
      secondary: '#64748b',
      accent: '#f43f5e',
      background: '#fdf2f8',
    },
    config: {
      primary: '#ec4899',
      accent: '#f43f5e',
      componentColors: {
        sidebarBg: '#fce7f3',
        headerBg: '#fdf2f8',
        timerBg: '#ffffff',
        contentBg: '#fdf2f8',
        dashboardCardBg: '#ffffff',
        navBg: '#fce7f3',
      },
      timer: {
        displayStyle: 'default',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#ec4899',
      },
    },
    isPremium: false,
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Soft purple and violet hues',
    category: 'light',
    preview: {
      primary: '#8b5cf6',
      secondary: '#64748b',
      accent: '#a855f7',
      background: '#f5f3ff',
    },
    config: {
      primary: '#8b5cf6',
      accent: '#a855f7',
      componentColors: {
        sidebarBg: '#ede9fe',
        headerBg: '#f5f3ff',
        timerBg: '#ffffff',
        contentBg: '#f5f3ff',
        dashboardCardBg: '#ffffff',
        navBg: '#ede9fe',
      },
      timer: {
        displayStyle: 'default',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#8b5cf6',
      },
    },
    isPremium: false,
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean grayscale minimalist design',
    category: 'minimal',
    preview: {
      primary: '#18181b',
      secondary: '#71717a',
      accent: '#3f3f46',
      background: '#fafafa',
    },
    config: {
      primary: '#18181b',
      accent: '#3f3f46',
      componentColors: {
        sidebarBg: '#f4f4f5',
        headerBg: '#fafafa',
        timerBg: '#ffffff',
        contentBg: '#fafafa',
        dashboardCardBg: '#ffffff',
        navBg: '#f4f4f5',
      },
      timer: {
        displayStyle: 'minimal',
        fontFamily: 'sans',
        showMilliseconds: false,
        pulseWhenRunning: false,
        glowColor: '#18181b',
      },
      effects: {
        blur: 8,
        glowIntensity: 10,
        shadowIntensity: 30,
        borderRadius: 'md',
        animationSpeed: 'fast',
        reducedMotion: false,
      },
    },
    isPremium: false,
  },

  // ============ DARK THEMES ============
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep dark theme for night owls',
    category: 'dark',
    preview: {
      primary: '#818cf8',
      secondary: '#64748b',
      accent: '#a78bfa',
      background: '#0f172a',
    },
    config: {
      mode: 'dark' as ThemeMode,
      primary: '#818cf8',
      accent: '#a78bfa',
      componentColors: DARK_COMPONENT_COLORS,
      timer: {
        displayStyle: 'default',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#818cf8',
      },
    },
    isPremium: false,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon lights on dark streets',
    category: 'dark',
    preview: {
      primary: '#f0abfc',
      secondary: '#71717a',
      accent: '#22d3ee',
      background: '#0a0a0f',
    },
    config: {
      mode: 'dark' as ThemeMode,
      primary: '#f0abfc',
      accent: '#22d3ee',
      componentColors: {
        sidebarBg: '#18181b',
        headerBg: '#0a0a0f',
        timerBg: '#18181b',
        contentBg: '#0a0a0f',
        dashboardCardBg: '#18181b',
        navBg: '#18181b',
      },
      effects: {
        blur: 16,
        glowIntensity: 70,
        shadowIntensity: 60,
        borderRadius: 'lg',
        animationSpeed: 'normal',
        reducedMotion: false,
      },
      timer: {
        displayStyle: 'neon',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#f0abfc',
      },
      cards: {
        style: 'glass',
        background: '#18181b',
        borderColor: '#27272a',
        hoverEffect: 'glow',
      },
      buttons: {
        style: 'default',
        primaryGradient: true,
        hoverEffect: 'glow',
      },
    },
    isPremium: true,
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Northern lights inspired gradients',
    category: 'dark',
    preview: {
      primary: '#34d399',
      secondary: '#64748b',
      accent: '#818cf8',
      background: '#0f172a',
    },
    config: {
      mode: 'dark' as ThemeMode,
      primary: '#34d399',
      accent: '#818cf8',
      componentColors: {
        sidebarBg: '#0f172a',
        headerBg: '#0f172a',
        timerBg: '#1e293b',
        contentBg: '#0f172a',
        dashboardCardBg: '#1e293b',
        navBg: '#0f172a',
      },
      background: {
        type: 'gradient',
        solid: '#0f172a',
        gradient: {
          enabled: true,
          type: 'linear',
          angle: 135,
          colors: ['#0f172a', '#1e1b4b', '#0f172a'],
          opacity: 100,
          animated: true,
        },
        pattern: 'none',
        patternOpacity: 5,
      },
      effects: {
        blur: 16,
        glowIntensity: 50,
        shadowIntensity: 50,
        borderRadius: 'xl',
        animationSpeed: 'slow',
        reducedMotion: false,
      },
      timer: {
        displayStyle: 'gradient',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#34d399',
      },
      cards: {
        style: 'glass',
        background: '#1e293b',
        borderColor: '#334155',
        hoverEffect: 'glow',
      },
    },
    isPremium: true,
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Classic dark theme with purple accents',
    category: 'dark',
    preview: {
      primary: '#bd93f9',
      secondary: '#6272a4',
      accent: '#ff79c6',
      background: '#282a36',
    },
    config: {
      mode: 'dark' as ThemeMode,
      primary: '#bd93f9',
      accent: '#ff79c6',
      componentColors: {
        sidebarBg: '#21222c',
        headerBg: '#282a36',
        timerBg: '#21222c',
        contentBg: '#282a36',
        dashboardCardBg: '#21222c',
        navBg: '#21222c',
      },
      timer: {
        displayStyle: 'default',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#bd93f9',
      },
    },
    isPremium: false,
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    description: 'Inspired by Tokyo city lights',
    category: 'dark',
    preview: {
      primary: '#7aa2f7',
      secondary: '#565f89',
      accent: '#bb9af7',
      background: '#1a1b26',
    },
    config: {
      mode: 'dark' as ThemeMode,
      primary: '#7aa2f7',
      accent: '#bb9af7',
      componentColors: {
        sidebarBg: '#16161e',
        headerBg: '#1a1b26',
        timerBg: '#16161e',
        contentBg: '#1a1b26',
        dashboardCardBg: '#16161e',
        navBg: '#16161e',
      },
      timer: {
        displayStyle: 'neon',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#7aa2f7',
      },
      effects: {
        blur: 12,
        glowIntensity: 60,
        shadowIntensity: 50,
        borderRadius: 'lg',
        animationSpeed: 'normal',
        reducedMotion: false,
      },
    },
    isPremium: true,
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic, north-bluish color palette',
    category: 'dark',
    preview: {
      primary: '#88c0d0',
      secondary: '#4c566a',
      accent: '#81a1c1',
      background: '#2e3440',
    },
    config: {
      mode: 'dark' as ThemeMode,
      primary: '#88c0d0',
      accent: '#81a1c1',
      componentColors: {
        sidebarBg: '#2e3440',
        headerBg: '#2e3440',
        timerBg: '#3b4252',
        contentBg: '#2e3440',
        dashboardCardBg: '#3b4252',
        navBg: '#2e3440',
      },
      timer: {
        displayStyle: 'minimal',
        fontFamily: 'mono',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#88c0d0',
      },
    },
    isPremium: false,
  },

  // ============ COLORFUL / SPECIAL THEMES ============
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Green digital rain aesthetic',
    category: 'dark',
    preview: {
      primary: '#22c55e',
      secondary: '#166534',
      accent: '#4ade80',
      background: '#030712',
    },
    config: {
      mode: 'dark' as ThemeMode,
      primary: '#22c55e',
      accent: '#4ade80',
      componentColors: {
        sidebarBg: '#030712',
        headerBg: '#030712',
        timerBg: '#0a0a0a',
        contentBg: '#030712',
        dashboardCardBg: '#0a0a0a',
        navBg: '#030712',
      },
      timer: {
        displayStyle: 'neon',
        fontFamily: 'digital',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#22c55e',
      },
      effects: {
        blur: 12,
        glowIntensity: 80,
        shadowIntensity: 40,
        borderRadius: 'sm',
        animationSpeed: 'fast',
        reducedMotion: false,
      },
      background: {
        type: 'solid',
        solid: '#030712',
        gradient: {
          enabled: false,
          type: 'linear',
          angle: 135,
          colors: ['#030712', '#052e16'],
          opacity: 100,
          animated: false,
        },
        pattern: 'grid',
        patternOpacity: 3,
      },
    },
    isPremium: true,
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: '80s retro futuristic vibes',
    category: 'dark',
    preview: {
      primary: '#f472b6',
      secondary: '#7c3aed',
      accent: '#06b6d4',
      background: '#0f0f23',
    },
    config: {
      mode: 'dark' as ThemeMode,
      primary: '#f472b6',
      accent: '#06b6d4',
      componentColors: {
        sidebarBg: '#0f0f23',
        headerBg: '#0f0f23',
        timerBg: '#1a1a2e',
        contentBg: '#0f0f23',
        dashboardCardBg: '#1a1a2e',
        navBg: '#0f0f23',
      },
      background: {
        type: 'gradient',
        solid: '#0f0f23',
        gradient: {
          enabled: true,
          type: 'linear',
          angle: 180,
          colors: ['#0f0f23', '#1a1a2e', '#2d1f3d'],
          opacity: 100,
          animated: true,
        },
        pattern: 'grid',
        patternOpacity: 5,
      },
      timer: {
        displayStyle: 'neon',
        fontFamily: 'digital',
        showMilliseconds: true,
        pulseWhenRunning: true,
        glowColor: '#f472b6',
      },
      effects: {
        blur: 16,
        glowIntensity: 80,
        shadowIntensity: 60,
        borderRadius: 'lg',
        animationSpeed: 'normal',
        reducedMotion: false,
      },
      buttons: {
        style: 'default',
        primaryGradient: true,
        hoverEffect: 'glow',
      },
    },
    isPremium: true,
  },
  {
    id: 'coffee',
    name: 'Coffee Shop',
    description: 'Warm browns and creams',
    category: 'light',
    preview: {
      primary: '#a16207',
      secondary: '#78716c',
      accent: '#ca8a04',
      background: '#fefce8',
    },
    config: {
      primary: '#a16207',
      accent: '#ca8a04',
      componentColors: {
        sidebarBg: '#fef9c3',
        headerBg: '#fefce8',
        timerBg: '#ffffff',
        contentBg: '#fefce8',
        dashboardCardBg: '#ffffff',
        navBg: '#fef9c3',
      },
      timer: {
        displayStyle: 'minimal',
        fontFamily: 'sans',
        showMilliseconds: false,
        pulseWhenRunning: true,
        glowColor: '#a16207',
      },
    },
    isPremium: false,
  },
];

// ============================================
// Gradient Presets for Background
// ============================================

export const GRADIENT_PRESETS = [
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#f97316', '#ef4444', '#ec4899'],
    angle: 135,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#06b6d4', '#3b82f6', '#8b5cf6'],
    angle: 135,
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#22c55e', '#10b981', '#14b8a6'],
    angle: 135,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    colors: ['#34d399', '#818cf8', '#f472b6'],
    angle: 135,
  },
  {
    id: 'fire',
    name: 'Fire',
    colors: ['#fbbf24', '#f97316', '#ef4444'],
    angle: 180,
  },
  {
    id: 'royal',
    name: 'Royal',
    colors: ['#6366f1', '#8b5cf6', '#a855f7'],
    angle: 135,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: ['#1e1b4b', '#312e81', '#4c1d95'],
    angle: 135,
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    colors: ['#f9a8d4', '#c4b5fd', '#93c5fd'],
    angle: 135,
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: ['#f0abfc', '#22d3ee', '#4ade80'],
    angle: 135,
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    colors: ['#0f172a', '#581c87', '#0f172a'],
    angle: 180,
  },
];

// ============================================
// Animation Presets
// ============================================

export const ANIMATION_PRESETS = {
  none: {
    name: 'None',
    gradient: false,
    particles: false,
    blur: false,
  },
  subtle: {
    name: 'Subtle',
    gradient: true,
    gradientSpeed: 'slow',
    particles: false,
    blur: false,
  },
  moderate: {
    name: 'Moderate',
    gradient: true,
    gradientSpeed: 'normal',
    particles: true,
    particleCount: 20,
    blur: true,
  },
  vibrant: {
    name: 'Vibrant',
    gradient: true,
    gradientSpeed: 'fast',
    particles: true,
    particleCount: 50,
    blur: true,
  },
};

// ============================================
// Helper to get theme by ID
// ============================================

export function getThemePresetById(id: string): typeof THEME_PRESETS[0] | undefined {
  return THEME_PRESETS.find(preset => preset.id === id);
}

// ============================================
// Helper to filter themes by category
// ============================================

export function getThemesByCategory(category: 'light' | 'dark' | 'colorful' | 'minimal') {
  return THEME_PRESETS.filter(preset => preset.category === category);
}