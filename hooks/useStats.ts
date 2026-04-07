import { useMemo } from 'react';
import type { Session, Stats, DailyActivity, WeeklyData, MonthlyData } from '@/types';
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  getLast7Days,
  getLast4Weeks,
  getLast12Months,
  formatDateShort,
  formatWeekRange,
  getDayName,
} from '@/lib/dateUtils';
import {
  format,
  startOfDay,
  endOfDay,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from 'date-fns';

// ============================================
// Helper: Calculate Streak
// ============================================

function calculateStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  // Get unique days with sessions, sorted descending (most recent first)
  const uniqueDays = Array.from(
    new Set(
      sessions.map((s) => format(new Date(s.startTime), 'yyyy-MM-dd'))
    )
  ).sort((a, b) => b.localeCompare(a));

  if (uniqueDays.length === 0) return 0;

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  // Check if streak is still active (session today or yesterday)
  const mostRecentDay = uniqueDays[0];
  if (mostRecentDay !== today && mostRecentDay !== yesterday) {
    return 0; // Streak broken
  }

  let streak = 1;
  
  for (let i = 1; i < uniqueDays.length; i++) {
    const currentDate = new Date(uniqueDays[i - 1]);
    const previousDate = new Date(uniqueDays[i]);
    
    const daysDiff = differenceInDays(currentDate, previousDate);
    
    if (daysDiff === 1) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  return streak;
}

// ============================================
// Main Hook
// ============================================

export function useStats(sessions: Session[]) {
  const stats = useMemo<Stats>(() => {
    const today = sessions
      .filter((s) => isToday(s.startTime))
      .reduce((acc, s) => acc + s.duration, 0);

    const thisWeek = sessions
      .filter((s) => isThisWeek(s.startTime))
      .reduce((acc, s) => acc + s.duration, 0);

    const thisMonth = sessions
      .filter((s) => isThisMonth(s.startTime))
      .reduce((acc, s) => acc + s.duration, 0);

    const thisYear = sessions
      .filter((s) => isThisYear(s.startTime))
      .reduce((acc, s) => acc + s.duration, 0);

    const totalAllTime = sessions.reduce((acc, s) => acc + s.duration, 0);
    const totalSessions = sessions.length;

    // Calculate average daily time (last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const last30DaysSessions = sessions.filter((s) => s.startTime >= thirtyDaysAgo);
    const uniqueDays = new Set(
      last30DaysSessions.map((s) =>
        format(new Date(s.startTime), 'yyyy-MM-dd')
      )
    );
    const averageDailyTime =
      uniqueDays.size > 0
        ? last30DaysSessions.reduce((acc, s) => acc + s.duration, 0) /
          uniqueDays.size
        : 0;

    // Find longest session
    const longestSession =
      sessions.length > 0
        ? sessions.reduce((max, s) => (s.duration > max.duration ? s : max))
        : null;

    // Find most active day
    const dayTotals: Record<string, number> = {};
    sessions.forEach((s) => {
      const day = getDayName(new Date(s.startTime));
      dayTotals[day] = (dayTotals[day] || 0) + s.duration;
    });
    const mostActiveDay =
      Object.entries(dayTotals).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    // Calculate streak
    const streak = calculateStreak(sessions);

    // Calculate average session length
    const averageSessionLength = totalSessions > 0 
      ? totalAllTime / totalSessions 
      : 0;

    return {
      today,
      thisWeek,
      thisMonth,
      thisYear,
      totalSessions,
      averageDailyTime,
      longestSession,
      mostActiveDay,
      totalAllTime,
      streak,
      averageSessionLength,
    };
  }, [sessions]);

  const dailyActivity = useMemo<DailyActivity[]>(() => {
    const last7Days = getLast7Days();

    return last7Days.map((date) => {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const daySessions = sessions.filter((s) =>
        isWithinInterval(new Date(s.startTime), { start: dayStart, end: dayEnd })
      );

      return {
        date: formatDateShort(date),
        duration: daySessions.reduce((acc, s) => acc + s.duration, 0),
        sessions: daySessions.length,
      };
    });
  }, [sessions]);

  const weeklyData = useMemo<WeeklyData[]>(() => {
    const last4Weeks = getLast4Weeks();

    return last4Weeks.map((weekStart) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekSessions = sessions.filter((s) =>
        isWithinInterval(new Date(s.startTime), {
          start: startOfDay(weekStart),
          end: endOfDay(weekEnd),
        })
      );

      return {
        week: formatWeekRange(weekStart),
        startDate: format(weekStart, 'yyyy-MM-dd'),
        endDate: format(weekEnd, 'yyyy-MM-dd'),
        duration: weekSessions.reduce((acc, s) => acc + s.duration, 0),
        sessions: weekSessions.length,
      };
    });
  }, [sessions]);

  const monthlyData = useMemo<MonthlyData[]>(() => {
    const last12Months = getLast12Months();

    return last12Months.map((monthDate) => {
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthSessions = sessions.filter((s) =>
        isWithinInterval(new Date(s.startTime), {
          start: monthStart,
          end: monthEnd,
        })
      );

      return {
        month: format(monthDate, 'MMM'),
        year: monthDate.getFullYear(),
        duration: monthSessions.reduce((acc, s) => acc + s.duration, 0),
        sessions: monthSessions.length,
      };
    });
  }, [sessions]);

  return {
    stats,
    dailyActivity,
    weeklyData,
    monthlyData,
  };
}