// components/ui/Toggle.tsx - UPDATED VERSION
'use client';

import { memo, useId } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const Toggle = memo(function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  id: providedId,
}: ToggleProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = `${id}-description`;

  const sizes = {
    sm: { 
      track: 'w-8 h-4', 
      thumb: 'w-3 h-3', 
      translate: 'translate-x-4',
      offset: 'left-0.5 top-0.5'
    },
    md: { 
      track: 'w-11 h-6', 
      thumb: 'w-5 h-5', 
      translate: 'translate-x-5',
      offset: 'left-0.5 top-0.5'
    },
    lg: { 
      track: 'w-14 h-7', 
      thumb: 'w-6 h-6', 
      translate: 'translate-x-7',
      offset: 'left-0.5 top-0.5'
    },
  };

  const { track, thumb, translate, offset } = sizes[size];

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          track,
          checked 
            ? 'bg-primary-500' 
            : 'bg-muted hover:bg-muted-foreground/20',
          disabled && 'cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute inline-block rounded-full bg-white shadow-sm',
            'transition-transform duration-200 ease-in-out',
            thumb,
            offset,
            checked && translate
          )}
        />
        <span className="sr-only">
          {label} {checked ? 'enabled' : 'disabled'}
        </span>
      </button>

      {(label || description) && (
        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'text-sm font-medium text-foreground cursor-pointer',
                disabled && 'cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={descriptionId}
              className="text-xs text-muted-foreground"
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});