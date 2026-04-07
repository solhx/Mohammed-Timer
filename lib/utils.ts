import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// Tailwind Class Merger
// ============================================

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================
// Time Formatting
// ============================================

/**
 * Formats milliseconds as MM:SS.ms  or  HH:MM:SS
 * Used for lap / split display.
 */
export function formatTime(ms: number): string {
  const totalSeconds  = Math.floor(ms / 1000);
  const hours         = Math.floor(totalSeconds / 3600);
  const minutes       = Math.floor((totalSeconds % 3600) / 60);
  const seconds       = totalSeconds % 60;
  const milliseconds  = Math.floor((ms % 1000) / 10);

  if (hours > 0) {
    return (
      `${hours.toString().padStart(2, '0')}:` +
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`
    );
  }

  return (
    `${minutes.toString().padStart(2, '0')}:` +
    `${seconds.toString().padStart(2, '0')}.` +
    `${milliseconds.toString().padStart(2, '0')}`
  );
}

/**
 * Human-readable short duration.
 * e.g. 3723000 ms → "1h 2m"
 */
export function formatDuration(ms: number): string {
  if (ms <= 0) return '0s';

  const totalSeconds = Math.floor(ms / 1000);
  const hours        = Math.floor(totalSeconds / 3600);
  const minutes      = Math.floor((totalSeconds % 3600) / 60);
  const seconds      = totalSeconds % 60;

  if (hours > 0)   return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/**
 * Long-form duration.
 * e.g. "1 hour, 2 minutes, 3 seconds"
 */
export function formatDurationLong(ms: number): string {
  if (ms <= 0) return '0 seconds';

  const totalSeconds = Math.floor(ms / 1000);
  const hours        = Math.floor(totalSeconds / 3600);
  const minutes      = Math.floor((totalSeconds % 3600) / 60);
  const seconds      = totalSeconds % 60;

  const parts: string[] = [];
  if (hours   > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  }

  return parts.join(', ');
}

// ============================================
// ID Generation
// ============================================

/**
 * Generates a cryptographically secure unique ID using Web Crypto API.
 * Collision-proof, stable across sessions, React key-friendly.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback (should never happen in modern browsers)
  return `${Date.now()}-${Math.random().toString(36).slice(2, 15)}`;
}

// ============================================
// Function Utilities
// ============================================

/**
 * Debounce — delays execution until `wait` ms after the last call.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Throttle — ensures `func` is called at most once per `limit` ms.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall  = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      lastCall = now;
      func(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall  = Date.now();
        timeoutId = null;
        func(...args);
      }, remaining);
    }
  };
}

// ============================================
// Deep Merge  — SINGLE SOURCE OF TRUTH
// (do NOT duplicate in useTheme.ts)
// ============================================

/**
 * Recursively merges `source` into `target`.
 * Arrays are replaced (not concatenated).
 * `undefined` / `null` values in source are ignored.
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    const sv = source[key];
    const tv = target[key];

    if (sv === undefined || sv === null) continue;

    if (
      typeof sv === 'object' &&
      !Array.isArray(sv) &&
      typeof tv === 'object' &&
      tv !== null &&
      !Array.isArray(tv)
    ) {
      result[key] = deepMerge(tv as Record<string, any>, sv as Record<string, any>) as T[typeof key];
    } else {
      result[key] = sv as T[typeof key];
    }
  }

  return result;
}

// ============================================
// Color Utilities  — SINGLE SOURCE OF TRUTH
// (imported by useTheme.ts — not redefined there)
// ============================================

/**
 * Converts a hex color string to { r, g, b } integers.
 * Supports 3-char shorthand (#fff → #ffffff).
 * Returns null if the input is invalid.
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  if (!hex) return null;

  let clean = hex.replace('#', '').trim();

  // Expand shorthand: #abc → #aabbcc
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }

  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clean);
  if (!match) return null;

  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

/**
 * Returns "R G B" space-separated string.
 * Compatible with Tailwind CSS variable format.
 * e.g.  rgbToSpacedString(99, 102, 241) → "99 102 241"
 */
export function rgbToSpacedString(r: number, g: number, b: number): string {
  return `${r} ${g} ${b}`;
}

/**
 * Converts a hex color to "R G B" space-separated format.
 * Returns `fallback` if conversion fails.
 *
 * @example
 * hexToSpacedRgb('#6366f1')           // "99 102 241"
 * hexToSpacedRgb('invalid', '0 0 0') // "0 0 0"
 */
export function hexToSpacedRgb(
  hex: string,
  fallback = '99 102 241'
): string {
  if (!hex) return fallback;
  const rgb = hexToRgb(hex);
  if (!rgb) return fallback;
  return rgbToSpacedString(rgb.r, rgb.g, rgb.b);
}

/**
 * Converts a hex color to an `rgb(r, g, b)` CSS string.
 * Useful when you need a full CSS value rather than space-separated components.
 *
 * @example
 * hexToRgbString('#6366f1') // "rgb(99, 102, 241)"
 */
export function hexToRgbString(
  hex: string,
  fallback = 'rgb(99, 102, 241)'
): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return fallback;
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Checks if a color is "dark" (luminance < 0.5).
 * Useful for deciding whether to use white or black text on a colored bg.
 */
export function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  // Relative luminance formula (WCAG)
  const { r, g, b } = rgb;
  const luminance =
    0.2126 * (r / 255) +
    0.7152 * (g / 255) +
    0.0722 * (b / 255);
  return luminance < 0.5;
}

/**
 * Returns `"#ffffff"` or `"#000000"` depending on which
 * has better contrast against the given background color.
 */
export function getContrastColor(hex: string): '#ffffff' | '#000000' {
  return isColorDark(hex) ? '#ffffff' : '#000000';
}

// ============================================
// Number / Math Utilities
// ============================================

/** Clamps a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation between two values. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

// ============================================
// String Utilities
// ============================================

/** Capitalises the first character of a string. */
export function capitalise(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Truncates a string and appends '…' if it exceeds maxLength. */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 1)}…`;
}