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
  differenceInDays,
} from 'date-fns';

export function isToday(timestamp: number): boolean {
  return fnsIsToday(new Date(timestamp));
}

export function isThisWeek(timestamp: number): boolean {
  return fnsIsThisWeek(new Date(timestamp), { weekStartsOn: 6 }); // Saturday
}

export function isThisMonth(timestamp: number): boolean {
  return fnsIsThisMonth(new Date(timestamp));
}

export function isThisYear(timestamp: number): boolean {
  return fnsIsThisYear(new Date(timestamp));
}

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
    weeks.push(startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 6 }));
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

export function formatDateShort(date: Date): string {
  return format(date, 'EEE');
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = subDays(weekStart, -6);
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
}

export function getDayName(date: Date): string {
  return format(date, 'EEEE');
}

export function getRelativeDay(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = differenceInDays(now, date);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return format(date, 'EEEE');
  return format(date, 'MMM d, yyyy');
}