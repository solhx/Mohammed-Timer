// components/ui/NumberInput.tsx - FIXED VERSION
'use client';

import { memo, useCallback, useRef } from 'react';
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
  // ✅ Use ref to always have latest value
  const valueRef = useRef(value);
  valueRef.current = value;

  // ✅ FIXED: Use ref to get latest value, avoid stale closure
  const handleIncrement = useCallback(() => {
    const currentValue = valueRef.current;
    const newValue = Math.min(currentValue + step, max);
    onChange(newValue);
  }, [step, max, onChange]);

  const handleDecrement = useCallback(() => {
    const currentValue = valueRef.current;
    const newValue = Math.max(currentValue - step, min);
    onChange(newValue);
  }, [step, min, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow empty input for easier editing
    if (rawValue === '') {
      onChange(min);
      return;
    }
    
    const newValue = parseInt(rawValue, 10);
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
            'text-foreground disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-primary-500'
          )}
          aria-label="Decrease value"
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
              disabled && 'opacity-50 cursor-not-allowed',
              suffix && 'pr-12' // Add padding for suffix
            )}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
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
            'text-foreground disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-primary-500'
          )}
          aria-label="Increase value"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
});