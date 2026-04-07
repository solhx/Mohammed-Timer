// components/ui/Slider.tsx - NEW FILE (extracted from PremiumThemeCustomizer)
'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
  disabled?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Slider = memo(function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
  disabled = false,
  showValue = true,
  size = 'md',
  className,
}: SliderProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const thumbSizes = {
    sm: '[&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3',
    md: '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
    lg: '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm text-muted-foreground tabular-nums">
              {value}{suffix}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={cn(
          'w-full rounded-lg appearance-none cursor-pointer',
          'bg-muted transition-opacity',
          sizeClasses[size],
          '[&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:bg-primary-500',
          '[&::-webkit-slider-thumb]:shadow-md',
          '[&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:transition-transform',
          '[&::-webkit-slider-thumb]:hover:scale-110',
          '[&::-webkit-slider-thumb]:active:scale-95',
          thumbSizes[size],
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
    </div>
  );
});