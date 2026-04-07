// components/charts/ChartWrapper.tsx - FIXED VERSION
'use client';

import { ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  loading?: boolean;
  error?: string;
}

export const ChartWrapper = memo(function ChartWrapper({
  title,
  subtitle,
  children,
  className,
  actions,
  loading = false,
  error,
}: ChartWrapperProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      {(title || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      {/* Content */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-xl">
            <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        )}

        {error ? (
          <div className="flex items-center justify-center h-40 text-sm text-red-500">
            {error}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
});