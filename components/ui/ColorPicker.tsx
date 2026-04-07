'use client';

import { useState, useCallback, memo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRIMARY_COLORS } from '@/lib/constants';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  colors?: Array<{ name: string; value: string }>;
}

export const ColorPicker = memo(function ColorPicker({
  value,
  onChange,
  label,
  colors = PRIMARY_COLORS,
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);

  const handleCustomColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  }, [onChange]);

  const handlePresetClick = useCallback((colorValue: string) => {
    setCustomColor(colorValue);
    onChange(colorValue);
  }, [onChange]);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = value.toLowerCase() === color.value.toLowerCase();
          
          return (
            <button
              key={color.value}
              type="button"
              onClick={() => handlePresetClick(color.value)}
              className={cn(
                'w-9 h-9 rounded-full transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
                'hover:scale-110 active:scale-95',
                'flex items-center justify-center',
                isSelected && 'ring-2 ring-offset-2 ring-foreground scale-110'
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
              aria-label={`Select ${color.name}`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <Check 
                  size={16} 
                  className="text-white drop-shadow-sm" 
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className={cn(
              'w-10 h-10 rounded-lg cursor-pointer',
              'border-2 border-border hover:border-primary-400',
              'transition-all duration-200',
              'appearance-none bg-transparent',
              '[&::-webkit-color-swatch-wrapper]:p-0',
              '[&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none'
            )}
            aria-label="Choose custom color"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Custom color</span>
          <span className="text-xs text-muted-foreground/70 font-mono">
            {customColor.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
});