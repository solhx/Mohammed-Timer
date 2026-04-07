// components/timer/SessionNameInput.tsx - FIXED
'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionNameInputProps {
  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
  defaultValue?: string; // ✅ Added missing prop
  placeholder?: string;
}

export const SessionNameInput = memo(function SessionNameInput({
  value,
  onChange,
  disabled = false,
  defaultValue = '',
  placeholder = 'Session name...',
}: SessionNameInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Sync temp value when value changes externally
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  // Use default value if value is empty
  useEffect(() => {
    if (!value && defaultValue && !disabled) {
      onChange(defaultValue);
    }
  }, [defaultValue, value, onChange, disabled]);

  const handleSave = useCallback(() => {
    onChange(tempValue.trim() || defaultValue);
    setIsEditing(false);
  }, [tempValue, onChange, defaultValue]);

  const handleCancel = useCallback(() => {
    setTempValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (isEditing && !disabled) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
          className={cn(
            'flex-1 px-3 py-2 rounded-lg',
            'bg-muted border border-border',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'text-center font-medium'
          )}
        />
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            'p-2 rounded-lg bg-primary-500 text-white',
            'hover:bg-primary-600 transition-colors'
          )}
          aria-label="Save"
        >
          <Check size={16} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={cn(
            'p-2 rounded-lg bg-muted text-muted-foreground',
            'hover:bg-muted/80 transition-colors'
          )}
          aria-label="Cancel"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => !disabled && setIsEditing(true)}
      disabled={disabled}
      className={cn(
        'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
        'bg-muted/50 hover:bg-muted transition-colors',
        'text-foreground font-medium',
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
        disabled && 'cursor-default opacity-70'
      )}
    >
      <span className={cn(!value && 'text-muted-foreground')}>
        {value || defaultValue || placeholder}
      </span>
      {!disabled && (
        <Edit3 size={14} className="text-muted-foreground" />
      )}
    </button>
  );
});