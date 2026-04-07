// components/dashboard/ProductivityInsights.tsx - UPDATED
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Clock, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { Stats } from '@/types';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductivityInsightsProps {
  stats: Stats;
}

export const ProductivityInsights = memo(function ProductivityInsights({
  stats,
}: ProductivityInsightsProps) {
  const insights = [
    {
      icon: <Calendar size={20} />,
      title: 'Most Active Day',
      value: stats.mostActiveDay,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      icon: <Clock size={20} />,
      title: 'Average Daily Time',
      value: formatDuration(stats.averageDailyTime),
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: <Trophy size={20} />,
      title: 'Longest Session',
      value: stats.longestSession
        ? formatDuration(stats.longestSession.duration)
        : 'N/A',
      subtitle: stats.longestSession?.name,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      icon: <Target size={20} />,
      title: 'Total Sessions',
      value: stats.totalSessions.toString(),
      subtitle: formatDuration(stats.totalAllTime) + ' total',
      color: 'text-primary-500',
      bg: 'bg-primary-500/10',
    },
  ];

  return (
    <Card variant="bordered" padding="md">
      <CardHeader>
        <CardTitle>Productivity Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30"
            >
              <div className={cn('p-3 rounded-full mb-3', insight.bg)}>
                <span className={insight.color}>{insight.icon}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {insight.title}
              </p>
              <p className="text-lg font-semibold text-foreground">
                {insight.value}
              </p>
              {insight.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.subtitle}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});