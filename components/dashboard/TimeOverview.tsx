// components/dashboard/TimeOverview.tsx - UPDATED
'use client';

import { memo } from 'react';
import { Clock, Calendar, CalendarDays, CalendarRange, Flame } from 'lucide-react';
import { StatCard } from './StatCard';
import type { Stats } from '@/types';
import { formatDuration } from '@/lib/utils';
import { useSessionContext } from '@/context/SessionContext';

interface TimeOverviewProps {
  stats: Stats;
}

export const TimeOverview = memo(function TimeOverview({ stats }: TimeOverviewProps) {
  const { todaySessionCount } = useSessionContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Today"
        value={formatDuration(stats.today)}
        subtitle={`${todaySessionCount} session${todaySessionCount !== 1 ? 's' : ''} today`}
        icon={<Clock size={20} />}
        color="primary"
      />
      <StatCard
        title="This Week"
        value={formatDuration(stats.thisWeek)}
        subtitle="Week starts Saturday"
        icon={<Calendar size={20} />}
        color="success"
      />
      <StatCard
        title="This Month"
        value={formatDuration(stats.thisMonth)}
        icon={<CalendarDays size={20} />}
        color="warning"
      />
      <StatCard
        title="This Year"
        value={formatDuration(stats.thisYear)}
        icon={<CalendarRange size={20} />}
        color="default"
      />
      <StatCard
        title="Streak"
        value={`${stats.streak} day${stats.streak !== 1 ? 's' : ''}`}
        subtitle="Keep it going!"
        icon={<Flame size={20} />}
        color="primary"
      />
    </div>
  );
});