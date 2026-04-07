// components/dashboard/StatCard.tsx - ENHANCED WITH ANIMATIONS
'use client';

import { ReactNode, memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'accent';
  index?: number; // For stagger animation
  animate?: boolean;
}

const colorMap = {
  default: {
    bg: '',
    icon: 'text-muted-foreground',
    glow: '',
  },
  primary: {
    bg: 'bg-[rgb(var(--color-primary-500)/0.08)]',
    icon: 'text-[rgb(var(--color-primary-500))]',
    glow: 'hover:shadow-[0_0_30px_rgb(var(--color-primary-500)/0.15)]',
  },
  success: {
    bg: 'bg-[rgb(var(--color-success)/0.08)]',
    icon: 'text-[rgb(var(--color-success))]',
    glow: 'hover:shadow-[0_0_30px_rgb(var(--color-success)/0.15)]',
  },
  warning: {
    bg: 'bg-[rgb(var(--color-warning)/0.08)]',
    icon: 'text-[rgb(var(--color-warning))]',
    glow: 'hover:shadow-[0_0_30px_rgb(var(--color-warning)/0.15)]',
  },
  danger: {
    bg: 'bg-[rgb(var(--color-destructive)/0.08)]',
    icon: 'text-[rgb(var(--color-destructive))]',
    glow: 'hover:shadow-[0_0_30px_rgb(var(--color-destructive)/0.15)]',
  },
  accent: {
    bg: 'bg-[rgb(var(--color-accent-500)/0.08)]',
    icon: 'text-[rgb(var(--color-accent-500))]',
    glow: 'hover:shadow-[0_0_30px_rgb(var(--color-accent-500)/0.15)]',
  },
} as const;

export const StatCard = memo(function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'default',
  index = 0,
  animate = true,
}: StatCardProps) {
  const { bg, icon: iconColor, glow } = colorMap[color];

  const cardContent = (
    <Card
      variant="bordered"
      padding="md"
      hover="lift"
      className={cn(
        'transition-all duration-300',
        bg,
        glow,
        'group'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {icon && (
          <motion.div
            className={cn(
              'p-2.5 rounded-xl bg-muted/50 transition-all duration-300',
              'group-hover:scale-110 group-hover:bg-muted',
              iconColor
            )}
            whileHover={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        )}
      </div>

      {trend && (
        <motion.div
          className="mt-4 flex items-center gap-1.5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {trend.value > 0 ? (
            <TrendingUp
              size={14}
              className="text-[rgb(var(--color-success))]"
            />
          ) : trend.value < 0 ? (
            <TrendingDown
              size={14}
              className="text-[rgb(var(--color-destructive))]"
            />
          ) : (
            <Minus size={14} className="text-muted-foreground" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              trend.value > 0
                ? 'text-[rgb(var(--color-success))]'
                : trend.value < 0
                ? 'text-[rgb(var(--color-destructive))]'
                : 'text-muted-foreground'
            )}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value}% {trend.label}
          </span>
        </motion.div>
      )}
    </Card>
  );

  if (!animate) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {cardContent}
    </motion.div>
  );
});