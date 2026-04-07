// components/dashboard/Dashboard.tsx - FIXED VERSION WITH SETTINGS INTEGRATION
'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  TrendingUp,
  Award,
  Flame,
  Target,
  BarChart3,
  Timer,
  Zap,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from './StatCard';
import { SessionHistory } from './SessionHistory';
import { DailyActivityChart } from '@/components/charts/DailyActivityChart';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { useSettingsContext } from '@/context/SettingsContext';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

interface DashboardProps {
  sessions: Session[];
  onDeleteSession?: (id: string) => void;
  onUpdateSession?: (id: string, updates: Partial<Session>) => Promise<void>;
}

type TimeRange = 'today' | 'week' | 'month' | 'all';

// ✅ Goal Progress Component
const GoalProgress = memo(function GoalProgress({
  label,
  current,
  goal,
  unit,
  color = 'primary',
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color?: 'primary' | 'accent' | 'success';
}) {
  if (goal <= 0) return null;
  
  const progress = Math.min((current / goal) * 100, 100);
  const isComplete = progress >= 100;
  
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-green-500 to-emerald-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground flex items-center gap-1">
          {isComplete && <CheckCircle2 size={14} className="text-green-500" />}
          {label}
        </span>
        <span className={cn('font-medium', isComplete ? 'text-green-500' : 'text-foreground')}>
          {unit === 'time' ? formatDuration(current) : current} / {unit === 'time' ? formatDuration(goal) : goal}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            isComplete ? 'from-green-500 to-emerald-500' : colorClasses[color]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      {isComplete && (
        <p className="text-xs text-green-500 font-medium">🎉 Goal achieved!</p>
      )}
    </div>
  );
});

export const Dashboard = memo(function Dashboard({
  sessions,
  onDeleteSession,
  onUpdateSession,
}: DashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [activeChart, setActiveChart] = useState<'daily' | 'weekly'>('daily');

  // ✅ FIXED: Get goals from SettingsContext
  const { settings } = useSettingsContext();
  const goalSettings = settings.goals;

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todaySessions = sessions.filter(
      (s) => new Date(s.startTime) >= today
    );
    const weekSessions = sessions.filter(
      (s) => new Date(s.startTime) >= weekStart
    );
    const monthSessions = sessions.filter(
      (s) => new Date(s.startTime) >= monthStart
    );

    const todayTotal = todaySessions.reduce((acc, s) => acc + s.duration, 0);
    const weekTotal = weekSessions.reduce((acc, s) => acc + s.duration, 0);
    const monthTotal = monthSessions.reduce((acc, s) => acc + s.duration, 0);
    const allTimeTotal = sessions.reduce((acc, s) => acc + s.duration, 0);

    // Calculate streak
    let streak = 0;
    const checkDate = new Date(today);
    while (true) {
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const hasSessions = sessions.some((s) => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= dayStart && sessionDate < dayEnd;
      });

      if (hasSessions) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate average
    const daysWithSessions = new Set(
      sessions.map((s) => new Date(s.startTime).toDateString())
    ).size;
    const averageDaily = daysWithSessions > 0 ? allTimeTotal / daysWithSessions : 0;

    // Find longest session
    const longestSession =
      sessions.length > 0
        ? sessions.reduce((max, s) => (s.duration > max.duration ? s : max))
        : null;

    // Week over week change
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekSessions = sessions.filter((s) => {
      const date = new Date(s.startTime);
      return date >= lastWeekStart && date < weekStart;
    });
    const lastWeekTotal = lastWeekSessions.reduce((acc, s) => acc + s.duration, 0);
    const weekChange =
      lastWeekTotal > 0
        ? Math.round(((weekTotal - lastWeekTotal) / lastWeekTotal) * 100)
        : 0;

    return {
      today: todayTotal,
      todaySessions: todaySessions.length,
      week: weekTotal,
      weekSessions: weekSessions.length,
      month: monthTotal,
      monthSessions: monthSessions.length,
      allTime: allTimeTotal,
      totalSessions: sessions.length,
      streak,
      averageDaily,
      longestSession,
      weekChange,
    };
  }, [sessions]);

  const timeRangeOptions: { id: TimeRange; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  // Check if any goals are set
  const hasGoals = goalSettings.dailyTimeGoal > 0 || 
                   goalSettings.weeklyTimeGoal > 0 ||
                   goalSettings.dailySessionGoal > 0 ||
                   goalSettings.weeklySessionGoal > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your productivity and analyze your time
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50">
          {timeRangeOptions.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTimeRange(id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                timeRange === id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today"
          value={formatDuration(stats.today)}
          subtitle={`${stats.todaySessions} session${stats.todaySessions !== 1 ? 's' : ''}`}
          icon={<Clock size={24} />}
          color="primary"
          index={0}
        />
        <StatCard
          title="This Week"
          value={formatDuration(stats.week)}
          subtitle={`${stats.weekSessions} sessions`}
          icon={<Calendar size={24} />}
          trend={
            stats.weekChange !== 0
              ? { value: stats.weekChange, label: 'vs last week' }
              : undefined
          }
          color="accent"
          index={1}
        />
        <StatCard
          title="Current Streak"
          value={`${stats.streak} day${stats.streak !== 1 ? 's' : ''}`}
          subtitle={goalSettings.streakTracking ? "Keep it going!" : "Streak tracking enabled"}
          icon={<Flame size={24} />}
          color={stats.streak >= 7 ? 'success' : 'warning'}
          index={2}
        />
        <StatCard
          title="Daily Average"
          value={formatDuration(stats.averageDaily)}
          subtitle="per active day"
          icon={<TrendingUp size={24} />}
          color="default"
          index={3}
        />
      </div>

      {/* ✅ Goals Progress Section - Only show if enabled in settings */}
      {goalSettings.showProgressInDashboard && hasGoals && (
        <Card variant="gradient" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} className="text-primary-500" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Daily Time Goal */}
              {goalSettings.dailyTimeGoal > 0 && (
                <GoalProgress
                  label="Daily Time Goal"
                  current={stats.today}
                  goal={goalSettings.dailyTimeGoal * 60 * 1000} // Convert minutes to ms
                  unit="time"
                  color="primary"
                />
              )}
              
              {/* Weekly Time Goal */}
              {goalSettings.weeklyTimeGoal > 0 && (
                <GoalProgress
                  label="Weekly Time Goal"
                  current={stats.week}
                  goal={goalSettings.weeklyTimeGoal * 60 * 1000}
                  unit="time"
                  color="accent"
                />
              )}
              
              {/* Daily Session Goal */}
              {goalSettings.dailySessionGoal > 0 && (
                <GoalProgress
                  label="Daily Sessions"
                  current={stats.todaySessions}
                  goal={goalSettings.dailySessionGoal}
                  unit="sessions"
                  color="primary"
                />
              )}
              
              {/* Weekly Session Goal */}
              {goalSettings.weeklySessionGoal > 0 && (
                <GoalProgress
                  label="Weekly Sessions"
                  current={stats.weekSessions}
                  goal={goalSettings.weeklySessionGoal}
                  unit="sessions"
                  color="accent"
                />
              )}
            </div>
            
            {/* Streak indicator */}
            {goalSettings.streakTracking && stats.streak > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
                <Flame size={20} className="text-orange-500" />
                <span className="font-medium text-foreground">
                  {stats.streak} day streak!
                </span>
                {stats.streak >= 7 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium">
                    🔥 On fire!
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main chart */}
        <Card variant="bordered" padding="md" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} className="text-primary-500" />
                Activity Overview
              </CardTitle>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                <button
                  onClick={() => setActiveChart('daily')}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all',
                    activeChart === 'daily'
                      ? 'bg-primary-500 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Daily
                </button>
                <button
                  onClick={() => setActiveChart('weekly')}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all',
                    activeChart === 'weekly'
                      ? 'bg-primary-500 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Weekly
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {activeChart === 'daily' ? (
                <DailyActivityChart sessions={sessions} />
              ) : (
                <WeeklyChart sessions={sessions} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Side stats */}
        <div className="space-y-4">
          {/* Quick insights */}
          <Card variant="gradient" padding="md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap size={18} className="text-accent-500" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most productive</span>
                <span className="text-sm font-medium text-foreground">Morning</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Best day</span>
                <span className="text-sm font-medium text-foreground">Tuesday</span>
              </div>
              {stats.longestSession && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Longest session</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatDuration(stats.longestSession.duration)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card variant="bordered" padding="md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award size={18} className="text-amber-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.streak >= 7 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
                    <Flame size={12} />
                    7 Day Streak
                  </div>
                )}
                {stats.totalSessions >= 10 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                    <Timer size={12} />
                    10 Sessions
                  </div>
                )}
                {stats.allTime >= 10 * 3600000 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                    <TrendingUp size={12} />
                    10 Hours
                  </div>
                )}
                {stats.streak === 0 && stats.totalSessions < 10 && stats.allTime < 10 * 3600000 && (
                  <p className="text-xs text-muted-foreground">
                    Start tracking to earn achievements!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Session history */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Timer size={20} className="text-primary-500" />
              Recent Sessions
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ChevronRight size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SessionHistory
            sessions={sessions.slice(-10).reverse()}
            onDelete={onDeleteSession}
            onUpdate={onUpdateSession}
          />
        </CardContent>
      </Card>
    </div>
  );
});