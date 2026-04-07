// components/ui/NumberInput.tsx - NEW FILE
'use client';

import { memo, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
  disabled?: boolean;
  className?: string;
}

export const NumberInput = memo(function NumberInput({
  label,
  value,
  min = 0,
  max = Infinity,
  step = 1,
  onChange,
  suffix,
  disabled = false,
  className,
}: NumberInputProps) {
  const handleIncrement = useCallback(() => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  }, [value, step, max, onChange]);

  const handleDecrement = useCallback(() => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  }, [value, step, min, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(Math.max(newValue, min), max));
    }
  }, [min, max, onChange]);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            'bg-muted hover:bg-muted/80 transition-colors',
            'text-foreground disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Decrease"
        >
          <Minus size={16} />
        </button>
        
        <div className="relative flex-1">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={cn(
              'w-full h-10 px-3 rounded-lg text-center tabular-nums',
              'bg-muted border-none text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              '[appearance:textfield]',
              '[&::-webkit-outer-spin-button]:appearance-none',
              '[&::-webkit-inner-spin-button]:appearance-none',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            'bg-muted hover:bg-muted/80 transition-colors',
            'text-foreground disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Increase"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
});