// components/timer/SessionNameInput.tsx - ENHANCED DESIGN
'use client';

import { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Check, X, Clock, Briefcase, BookOpen, Code, Dumbbell, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

const presetNames = [
  { name: 'Work', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
  { name: 'Study', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  { name: 'Coding', icon: Code, color: 'from-green-500 to-emerald-500' },
  { name: 'Exercise', icon: Dumbbell, color: 'from-orange-500 to-red-500' },
  { name: 'Break', icon: Coffee, color: 'from-amber-500 to-yellow-500' },
];

interface SessionNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SessionNameInput = memo(function SessionNameInput({
  value,
  onChange,
  disabled = false,
}: SessionNameInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [showPresets, setShowPresets] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = useCallback(() => {
    if (disabled) return;
    setEditValue(value);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [disabled, value]);

  const handleConfirm = useCallback(() => {
    onChange(editValue.trim() || 'Work Session');
    setIsEditing(false);
    setShowPresets(false);
  }, [editValue, onChange]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
    setShowPresets(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleConfirm();
      if (e.key === 'Escape') handleCancel();
    },
    [handleConfirm, handleCancel]
  );

  const handlePresetSelect = useCallback(
    (name: string) => {
      onChange(name);
      setEditValue(name);
      setIsEditing(false);
      setShowPresets(false);
    },
    [onChange]
  );

  const currentPreset = presetNames.find(
    (p) => p.name.toLowerCase() === value.toLowerCase()
  );

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Input field */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Session name..."
                  className={cn(
                    'w-full px-4 py-3 text-lg font-medium text-center',
                    'bg-muted/50 border-2 border-primary-500/50',
                    'rounded-xl outline-none',
                    'focus:border-primary-500 focus:bg-background',
                    'transition-all duration-200',
                    'placeholder:text-muted-foreground'
                  )}
                />
              </div>
              <motion.button
                onClick={handleConfirm}
                className="p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Check size={20} />
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="p-3 rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Preset suggestions */}
            <div className="flex flex-wrap justify-center gap-2">
              {presetNames.map(({ name, icon: Icon, color }) => (
                <motion.button
                  key={name}
                  onClick={() => handlePresetSelect(name)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full',
                    'text-sm font-medium text-white',
                    'bg-gradient-to-r',
                    color,
                    'hover:opacity-90 transition-opacity'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={14} />
                  {name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="display"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={handleStartEdit}
            disabled={disabled}
            className={cn(
              'group flex items-center justify-center gap-3 w-full',
              'px-6 py-3 rounded-xl',
              'transition-all duration-200',
              disabled
                ? 'cursor-not-allowed opacity-60'
                : 'hover:bg-muted/50 cursor-pointer'
            )}
          >
            {/* Icon */}
            {currentPreset ? (
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  'bg-gradient-to-br',
                  currentPreset.color
                )}
              >
                <currentPreset.icon size={20} className="text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted">
                <Clock size={20} className="text-muted-foreground" />
              </div>
            )}

            {/* Name */}
            <span className="text-xl font-semibold text-foreground">
              {value || 'Work Session'}
            </span>

            {/* Edit indicator */}
            {!disabled && (
              <Pencil
                size={16}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});