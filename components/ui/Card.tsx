// components/ui/Card.tsx - ENHANCED WITH ANIMATIONS
'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'gradient' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean | 'lift' | 'glow' | 'scale' | 'border';
  animate?: boolean | 'fade' | 'slide' | 'scale';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = true,
      animate = false,
      children,
      ...props
    },
    ref
  ) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variants = {
      default: cn(
        'bg-card',
        'border border-secondary-200 dark:border-secondary-700'
      ),
      bordered: cn(
        'bg-card',
        'border-2 border-secondary-300 dark:border-secondary-600'
      ),
      elevated: cn(
        'bg-card',
        'border border-secondary-200 dark:border-secondary-700',
        'shadow-lg'
      ),
      glass: cn(
        'glass glass-border',
        'backdrop-blur-md'
      ),
      gradient: cn(
        'bg-gradient-to-br from-card to-primary-500/5',
        'border border-secondary-200 dark:border-secondary-700'
      ),
      glow: cn(
        'bg-card',
        'border border-primary-500/30',
        'shadow-[0_0_30px_rgb(var(--color-primary-500)/0.15)]'
      ),
    };

    const hoverEffects = {
      true: 'hover:shadow-md',
      lift: 'hover:-translate-y-1 hover:shadow-lg',
      glow: 'hover:shadow-[0_0_30px_rgb(var(--color-primary-500)/0.3)]',
      scale: 'hover:scale-[1.02]',
      border: 'hover:border-primary-500',
      false: '',
    };

    const animateClasses = {
      true: 'animate-fade-in',
      fade: 'animate-fade-in',
      slide: 'animate-slide-up',
      scale: 'animate-scale-in',
      false: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300',
          'themed-card',
          variants[variant],
          paddings[padding],
          hoverEffects[hover as keyof typeof hoverEffects] || '',
          animateClasses[animate as keyof typeof animateClasses] || '',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-secondary-500 dark:text-secondary-400', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center pt-4 border-t border-secondary-200 dark:border-secondary-700',
      className
    )}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';