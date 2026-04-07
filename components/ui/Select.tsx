// components/ui/Select.tsx - FIXED with smart positioning
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<'down' | 'up'>('down');
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // ✅ Calculate whether to open up or down based on available space
  const calculateDirection = useCallback(() => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const dropdownHeight = Math.min(options.length * 44 + 8, 240);
    
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setOpenDirection('up');
    } else {
      setOpenDirection('down');
    }
  }, [options.length]);

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      calculateDirection();
    }
    setIsOpen(!isOpen);
  }, [isOpen, calculateDirection]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // ✅ Recalculate on scroll or resize while open
  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => calculateDirection();
    
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    
    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen, calculateDirection]);

  return (
    <div className={cn('space-y-2', className)} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl bg-muted border border-transparent',
            'flex items-center justify-between gap-2',
            'text-left text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'transition-all duration-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(!selectedOption && 'text-muted-foreground')}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            size={18}
            className={cn(
              'text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: openDirection === 'down' ? -10 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: openDirection === 'down' ? -10 : 10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute z-[100] w-full py-1',
                'bg-card rounded-xl shadow-lg border border-border',
                'max-h-60 overflow-auto',
                // ✅ Position based on direction
                openDirection === 'down' ? 'mt-2 top-full' : 'mb-2 bottom-full'
              )}
              role="listbox"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 flex items-center justify-between gap-2',
                    'text-left text-foreground hover:bg-muted',
                    'transition-colors duration-150',
                    option.value === value && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                  {option.value === value && (
                    <Check size={16} className="text-primary-500" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}