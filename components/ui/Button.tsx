// components/ui/Button.tsx - ENHANCED WITH RIPPLE & ANIMATIONS
'use client';

import { forwardRef, ButtonHTMLAttributes, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface RippleStyle {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'accent' | 'outline-secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  ripple?: boolean;
  glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      disabled,
      ripple = true,
      glow = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleRef = useRef<HTMLSpanElement>(null);

    const createRipple = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || disabled || isLoading) return;
      
      const button = buttonRef.current || (ref as React.RefObject<HTMLButtonElement>)?.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const rippleElement = document.createElement('span');
      rippleElement.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
      `;

      button.appendChild(rippleElement);

      setTimeout(() => {
        rippleElement.remove();
      }, 600);
    }, [ripple, disabled, isLoading, ref]);

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      onClick?.(event);
    }, [createRipple, onClick]);

    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'themed-btn',
      'relative overflow-hidden'
    );

    const variants = {
      primary: cn(
        'bg-primary-500 text-white',
        'hover:bg-primary-600 active:bg-primary-700',
        'focus:ring-primary-500',
        'shadow-sm hover:shadow-md',
        'themed-btn-primary',
        glow && 'hover:shadow-[0_0_20px_rgb(var(--color-primary-500)/0.5)]'
      ),
      secondary: cn(
        'bg-secondary-100 text-secondary-700',
        'hover:bg-secondary-200 active:bg-secondary-300',
        'focus:ring-secondary-500',
        'dark:bg-secondary-800 dark:text-secondary-200',
        'dark:hover:bg-secondary-700 dark:active:bg-secondary-600'
      ),
      ghost: cn(
        'bg-transparent text-foreground',
        'hover:bg-secondary-100 active:bg-secondary-200',
        'dark:hover:bg-secondary-800 dark:active:bg-secondary-700',
        'focus:ring-secondary-500'
      ),
      danger: cn(
        'bg-destructive text-white',
        'hover:opacity-90 active:opacity-80',
        'focus:ring-destructive',
        'shadow-sm'
      ),
      outline: cn(
        'bg-transparent text-primary-500',
        'border-2 border-primary-500',
        'hover:bg-primary-50 active:bg-primary-100',
        'dark:hover:bg-primary-950 dark:active:bg-primary-900',
        'focus:ring-primary-500'
      ),
      'outline-secondary': cn(
        'bg-transparent text-secondary-600',
        'border-2 border-secondary-300',
        'hover:bg-secondary-50 active:bg-secondary-100',
        'dark:text-secondary-400 dark:border-secondary-600',
        'dark:hover:bg-secondary-900 dark:active:bg-secondary-800',
        'focus:ring-secondary-500'
      ),
      accent: cn(
        'bg-accent-500 text-white',
        'hover:bg-accent-600 active:bg-accent-700',
        'focus:ring-accent-500',
        'shadow-sm hover:shadow-md',
        glow && 'hover:shadow-[0_0_20px_rgb(var(--color-accent-500)/0.5)]'
      ),
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-base rounded-xl',
      lg: 'px-6 py-3 text-lg rounded-xl',
      icon: 'p-2 rounded-xl',
    };

    return (
      <button
        ref={ref || buttonRef}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';