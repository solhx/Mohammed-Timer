// lib/dateUtils.ts - NEW FILE
import {
  format,
  isToday as fnsIsToday,
  isThisWeek as fnsIsThisWeek,
  isThisMonth as fnsIsThisMonth,
  isThisYear as fnsIsThisYear,
  startOfWeek,
  subDays,
  subWeeks,
  subMonths,
  getDay,
} from 'date-fns';

// ============================================
// Date Checkers
// ============================================

export function isToday(timestamp: number): boolean {
  return fnsIsToday(new Date(timestamp));
}

export function isThisWeek(timestamp: number): boolean {
  return fnsIsThisWeek(new Date(timestamp), { weekStartsOn: 1 });
}

export function isThisMonth(timestamp: number): boolean {
  return fnsIsThisMonth(new Date(timestamp));
}

export function isThisYear(timestamp: number): boolean {
  return fnsIsThisYear(new Date(timestamp));
}

// ============================================
// Date Generators
// ============================================

export function getLast7Days(): Date[] {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(subDays(new Date(), i));
  }
  return days;
}

export function getLast4Weeks(): Date[] {
  const weeks: Date[] = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
    weeks.push(weekStart);
  }
  return weeks;
}

export function getLast12Months(): Date[] {
  const months: Date[] = [];
  for (let i = 11; i >= 0; i--) {
    months.push(subMonths(new Date(), i));
  }
  return months;
}

// ============================================
// Formatters
// ============================================

export function formatDateShort(date: Date): string {
  return format(date, 'EEE');
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
}

export function getDayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[getDay(date)];
}

export function formatDate(date: Date, formatStr: string = 'PPP'): string {
  return format(date, formatStr);
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatDateTime(date: Date): string {
  return format(date, 'PPP p');
}