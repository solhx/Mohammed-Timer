// hooks/useTheme.ts - FIXED VERSION (removed duplicate deepMerge)
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ThemeConfig, ThemeMode } from '@/types';
import { DEFAULT_THEME } from '@/lib/theme-presets';
import { saveThemeConfig, getThemeConfig } from '@/lib/storage';
// ✅ FIXED: Import from utils instead of defining locally
import { deepMerge, hexToRgb, rgbToSpacedString, hexToSpacedRgb } from '@/lib/utils';

const STORAGE_KEY = 'timeflow_theme';

// ============================================
// Color Shade Generator for Primary/Accent
// ============================================

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  return { r: f(0), g: f(8), b: f(4) };
}

function generateColorShades(hex: string): Record<string, string> {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    // Fallback to indigo
    return {
      '50': '238 242 255',
      '100': '224 231 255',
      '200': '199 210 254',
      '300': '165 180 252',
      '400': '129 140 248',
      '500': '99 102 241',
      '600': '79 70 229',
      '700': '67 56 202',
      '800': '55 48 163',
      '900': '49 46 129',
      '950': '30 27 75',
    };
  }

  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const shadesConfig = [
    { key: '50', satMult: 0.25, lightness: 97 },
    { key: '100', satMult: 0.35, lightness: 94 },
    { key: '200', satMult: 0.5, lightness: 86 },
    { key: '300', satMult: 0.7, lightness: 74 },
    { key: '400', satMult: 0.9, lightness: 62 },
    { key: '500', satMult: 1.0, lightness: 50 },
    { key: '600', satMult: 1.05, lightness: 42 },
    { key: '700', satMult: 1.1, lightness: 34 },
    { key: '800', satMult: 1.15, lightness: 26 },
    { key: '900', satMult: 1.2, lightness: 18 },
    { key: '950', satMult: 1.25, lightness: 10 },
  ];

  const result: Record<string, string> = {};
  shadesConfig.forEach(({ key, satMult, lightness }) => {
    if (key === '500') {
      result[key] = rgbToSpacedString(rgb.r, rgb.g, rgb.b);
    } else {
      const newSat = Math.min(Math.max(s * satMult, 5), 100);
      const { r, g, b } = hslToRgb(h, newSat, lightness);
      result[key] = rgbToSpacedString(r, g, b);
    }
  });
  return result;
}

// ============================================
// Secondary Color Shades Generator
// ============================================

function generateSecondaryShades(isDark: boolean): Record<string, string> {
  if (isDark) {
    return {
      '50': '2 6 23',
      '100': '15 23 42',
      '200': '30 41 59',
      '300': '51 65 85',
      '400': '71 85 105',
      '500': '100 116 139',
      '600': '148 163 184',
      '700': '203 213 225',
      '800': '226 232 240',
      '900': '241 245 249',
      '950': '248 250 252',
    };
  }
  return {
    '50': '248 250 252',
    '100': '241 245 249',
    '200': '226 232 240',
    '300': '203 213 225',
    '400': '148 163 184',
    '500': '100 116 139',
    '600': '71 85 105',
    '700': '51 65 85',
    '800': '30 41 59',
    '900': '15 23 42',
    '950': '2 6 23',
  };
}

// ============================================
// CSS Variable names map
// ============================================

const cssVarName = {
  background: '--color-background',
  foreground: '--color-foreground',
  card: '--color-card',
  cardForeground: '--color-card-foreground',
  popover: '--color-popover',
  popoverForeground: '--color-popover-foreground',
  muted: '--color-muted',
  mutedForeground: '--color-muted-foreground',
  border: '--color-border',
  input: '--color-input',
  ring: '--color-ring',
} as const;

type SurfaceKey = keyof typeof cssVarName;

// ============================================
// Apply Theme to DOM
// ============================================

function applyThemeToDOM(theme: ThemeConfig): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Mode
  const isDark =
    theme.mode === 'dark' ||
    (theme.mode === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  root.classList.remove('light', 'dark');
  root.classList.add(isDark ? 'dark' : 'light');

  // Surface defaults
  const surfaceDefaults: Record<SurfaceKey, string> = isDark
    ? {
        background: '15 23 42',
        foreground: '248 250 252',
        card: '30 41 59',
        cardForeground: '248 250 252',
        popover: '30 41 59',
        popoverForeground: '248 250 252',
        muted: '30 41 59',
        mutedForeground: '148 163 184',
        border: '51 65 85',
        input: '51 65 85',
        ring: '99 102 241',
      }
    : {
        background: '255 255 255',
        foreground: '15 23 42',
        card: '255 255 255',
        cardForeground: '15 23 42',
        popover: '255 255 255',
        popoverForeground: '15 23 42',
        muted: '241 245 249',
        mutedForeground: '100 116 139',
        border: '226 232 240',
        input: '226 232 240',
        ring: '99 102 241',
      };

  // Surface colors
  const surfaces = isDark ? theme.surfacesDark : theme.surfaces;

  (Object.keys(cssVarName) as SurfaceKey[]).forEach((key) => {
    const surfaceValue: string = surfaces[key] ?? '';
    const defaultValue: string = surfaceDefaults[key];

    root.style.setProperty(
      cssVarName[key],
      hexToSpacedRgb(surfaceValue, defaultValue)
    );
  });

  // Primary shades
  const primaryShades = generateColorShades(theme.primary);
  Object.entries(primaryShades).forEach(([shade, rgb]) => {
    root.style.setProperty(`--color-primary-${shade}`, rgb);
  });
  root.style.setProperty('--color-primary-rgb', hexToSpacedRgb(theme.primary));
  root.style.setProperty('--color-primary-foreground', '255 255 255');

  // Secondary shades
  const secondaryShades = generateSecondaryShades(isDark);
  Object.entries(secondaryShades).forEach(([shade, rgb]) => {
    root.style.setProperty(`--color-secondary-${shade}`, rgb);
  });
  root.style.setProperty('--color-secondary-rgb', secondaryShades['500']);
  root.style.setProperty(
    '--color-secondary-foreground',
    isDark ? '15 23 42' : '255 255 255'
  );

  // Accent shades
  const accentShades = generateColorShades(theme.accent);
  Object.entries(accentShades).forEach(([shade, rgb]) => {
    root.style.setProperty(`--color-accent-${shade}`, rgb);
  });
  root.style.setProperty('--color-accent', hexToSpacedRgb(theme.accent));
  root.style.setProperty('--color-accent-rgb', hexToSpacedRgb(theme.accent));
  root.style.setProperty('--color-accent-foreground', '255 255 255');

  // Semantic colors
  const sem = theme.semantic ?? {};
  const semanticMap: Array<[string, string | undefined, string]> = [
    ['--color-destructive', sem.destructive, '239 68 68'],
    ['--color-destructive-foreground', sem.destructiveForeground, '255 255 255'],
    ['--color-success', sem.success, '34 197 94'],
    ['--color-success-foreground', sem.successForeground, '255 255 255'],
    ['--color-warning', sem.warning, '245 158 11'],
    ['--color-warning-foreground', sem.warningForeground, '255 255 255'],
    ['--color-info', sem.info, '59 130 246'],
    ['--color-info-foreground', sem.infoForeground, '255 255 255'],
  ];
  semanticMap.forEach(([varName, value, fallback]) => {
    root.style.setProperty(varName, hexToSpacedRgb(value ?? '', fallback));
  });

  // Component background colors
  const cc = theme.componentColors ?? DEFAULT_THEME.componentColors;

  const componentDefaults: Record<keyof typeof cc, string> = isDark
    ? {
        sidebarBg: '15 23 42',
        headerBg: '15 23 42',
        timerBg: '30 41 59',
        contentBg: '15 23 42',
        dashboardCardBg: '30 41 59',
        navBg: '15 23 42',
      }
    : {
        sidebarBg: '255 255 255',
        headerBg: '255 255 255',
        timerBg: '255 255 255',
        contentBg: '248 250 252',
        dashboardCardBg: '255 255 255',
        navBg: '255 255 255',
      };

  const componentVarMap: Record<keyof typeof cc, string> = {
    sidebarBg: '--color-sidebar-bg',
    headerBg: '--color-header-bg',
    timerBg: '--color-timer-bg',
    contentBg: '--color-content-bg',
    dashboardCardBg: '--color-dashboard-card-bg',
    navBg: '--color-nav-bg',
  };

  (Object.keys(componentVarMap) as Array<keyof typeof cc>).forEach((key) => {
    root.style.setProperty(
      componentVarMap[key],
      hexToSpacedRgb(cc[key] ?? '', componentDefaults[key])
    );
  });

  // Effects
  const fx = theme.effects ?? {};
  root.style.setProperty('--blur-amount', `${fx.blur ?? 12}px`);
  root.style.setProperty(
    '--glow-intensity',
    String((fx.glowIntensity ?? 30) / 100)
  );
  root.style.setProperty(
    '--shadow-intensity',
    String((fx.shadowIntensity ?? 50) / 100)
  );

  const radiusMap: Record<string, string> = {
    none: '0px',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  };
  root.style.setProperty(
    '--radius',
    radiusMap[fx.borderRadius ?? 'lg'] ?? '0.75rem'
  );

  const speedMap: Record<string, string> = {
    slow: '500ms',
    normal: '300ms',
    fast: '150ms',
  };
  root.style.setProperty(
    '--animation-speed',
    speedMap[fx.animationSpeed ?? 'normal'] ?? '300ms'
  );

  fx.reducedMotion
    ? root.classList.add('reduce-motion')
    : root.classList.remove('reduce-motion');

  // Background
  const premiumBg = document.querySelector('.premium-bg');
  if (premiumBg) {
    premiumBg.classList.remove(
      'animated-gradient',
      'bg-pattern-dots',
      'bg-pattern-grid',
      'bg-pattern-noise'
    );
  }

  const bg = theme.background ?? {};
  const bgType = bg.type ?? 'solid';
  const gradient = bg.gradient;

  if (bgType === 'gradient' && gradient?.enabled) {
    const colorStops =
      gradient.colors?.length > 0
        ? gradient.colors.join(', ')
        : `${theme.primary}, ${theme.accent}`;

    let gradientValue = '';
    switch (gradient.type) {
      case 'radial':
        gradientValue = `radial-gradient(circle at center, ${colorStops})`;
        break;
      case 'conic':
        gradientValue = `conic-gradient(from ${gradient.angle ?? 0}deg, ${colorStops})`;
        break;
      default:
        gradientValue = `linear-gradient(${gradient.angle ?? 135}deg, ${colorStops})`;
    }

    root.style.setProperty('--bg-gradient', gradientValue);
    root.style.setProperty(
      '--bg-gradient-opacity',
      String((gradient.opacity ?? 100) / 100)
    );

    if (premiumBg && gradient.animated) {
      premiumBg.classList.add('animated-gradient');
    }
  } else {
    root.style.setProperty('--bg-gradient', 'none');
    root.style.setProperty('--bg-gradient-opacity', '0');
  }

  // Pattern
  const pattern = bg.pattern;
  root.style.setProperty(
    '--bg-pattern-opacity',
    String((bg.patternOpacity ?? 5) / 100)
  );
  if (premiumBg && pattern && pattern !== 'none') {
    premiumBg.classList.add(`bg-pattern-${pattern}`);
  }

  // Data attributes
  root.style.setProperty(
    '--timer-glow',
    hexToSpacedRgb(theme.timer?.glowColor || theme.primary)
  );
  root.setAttribute('data-timer-style', theme.timer?.displayStyle ?? 'default');
  root.setAttribute('data-timer-font', theme.timer?.fontFamily ?? 'mono');
  root.setAttribute('data-card-style', theme.cards?.style ?? 'default');
  root.setAttribute('data-card-hover', theme.cards?.hoverEffect ?? 'none');
  root.setAttribute('data-button-style', theme.buttons?.style ?? 'default');
  root.setAttribute('data-button-hover', theme.buttons?.hoverEffect ?? 'none');
  root.setAttribute(
    'data-button-gradient',
    String(theme.buttons?.primaryGradient ?? false)
  );
  root.setAttribute('data-sidebar-style', theme.sidebar?.style ?? 'default');
  root.setAttribute(
    'data-sidebar-active',
    theme.sidebar?.activeItemStyle ?? 'filled'
  );
  root.setAttribute('data-chart-style', theme.charts?.style ?? 'default');

  // Chart colors
  root.style.setProperty(
    '--chart-grid-opacity',
    String((theme.charts?.gridOpacity ?? 10) / 100)
  );
  const chartColors = theme.charts?.colors ?? [theme.primary, theme.accent];
  chartColors.forEach((color, i) => {
    root.style.setProperty(`--chart-color-${i + 1}`, color);
    root.style.setProperty(`--chart-color-${i + 1}-rgb`, hexToSpacedRgb(color));
  });
}

// ============================================
// Sync Storage Read
// ============================================

function getStoredThemeSync(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return deepMerge(DEFAULT_THEME, JSON.parse(stored));
  } catch (e) {
    console.error('Failed to read theme from localStorage:', e);
  }
  return DEFAULT_THEME;
}

// ============================================
// Main Hook
// ============================================

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeConfig>(DEFAULT_THEME);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load & apply on mount
  useEffect(() => {
    if (!isMounted) return;
    let cancelled = false;

    const load = async () => {
      try {
        // Fast sync read
        const syncTheme = getStoredThemeSync();
        if (!cancelled) {
          setThemeState(syncTheme);
          applyThemeToDOM(syncTheme);
        }

        // Async read (IndexedDB fallback)
        const storedTheme = await getThemeConfig();
        if (!cancelled && storedTheme) {
          const merged = deepMerge(DEFAULT_THEME, storedTheme);
          setThemeState(merged);
          applyThemeToDOM(merged);
        }
      } catch (err) {
        console.error('Failed to load theme:', err);
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isMounted]);

  // System preference listener
  useEffect(() => {
    if (!isMounted || theme.mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyThemeToDOM(theme);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, isMounted]);

  // Cleanup save timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Persist
  const saveToStorage = useCallback((config: ThemeConfig) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('localStorage write failed:', e);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveThemeConfig(config).catch(console.error);
    }, 500);
  }, []);

  // Public API
  const setTheme = useCallback(
    (updates: Partial<ThemeConfig>) => {
      setThemeState((prev) => {
        const updated = deepMerge(prev, updates);
        if (isMounted) {
          applyThemeToDOM(updated);
          saveToStorage(updated);
        }
        return updated;
      });
    },
    [isMounted, saveToStorage]
  );

  const setFullTheme = useCallback(
    (newTheme: ThemeConfig) => {
      const merged = deepMerge(DEFAULT_THEME, newTheme);
      setThemeState(merged);
      if (isMounted) {
        applyThemeToDOM(merged);
        saveToStorage(merged);
      }
    },
    [isMounted, saveToStorage]
  );

  const toggleMode = useCallback(() => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    setThemeState((prev) => {
      const next = modes[(modes.indexOf(prev.mode) + 1) % modes.length];
      const updated = { ...prev, mode: next };
      if (isMounted) {
        applyThemeToDOM(updated);
        saveToStorage(updated);
      }
      return updated;
    });
  }, [isMounted, saveToStorage]);

  const resetTheme = useCallback(() => {
    setThemeState(DEFAULT_THEME);
    if (isMounted) {
      applyThemeToDOM(DEFAULT_THEME);
      saveToStorage(DEFAULT_THEME);
    }
  }, [isMounted, saveToStorage]);

  const resolvedMode = useMemo((): 'light' | 'dark' => {
    if (!isMounted) return 'light';
    if (theme.mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme.mode;
  }, [theme.mode, isMounted]);

  return useMemo(
    () => ({
      theme,
      isLoaded: isLoaded && isMounted,
      resolvedMode,
      setTheme,
      setFullTheme,
      toggleMode,
      resetTheme,
    }),
    [
      theme,
      isLoaded,
      isMounted,
      resolvedMode,
      setTheme,
      setFullTheme,
      toggleMode,
      resetTheme,
    ]
  );
}