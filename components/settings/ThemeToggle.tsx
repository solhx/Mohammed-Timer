// components/settings/ThemeToggle.tsx - FIXED VERSION
'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { THEME_PRESETS } from '@/lib/theme-presets';
import { cn } from '@/lib/utils';

export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme, resolvedMode } = useThemeContext();
  const [showPanel, setShowPanel] = useState(false);

  const modes = [
    { id: 'light' as const, icon: Sun, label: 'Light' },
    { id: 'dark' as const, icon: Moon, label: 'Dark' },
    { id: 'system' as const, icon: Monitor, label: 'System' },
  ];

  const quickPresets = THEME_PRESETS.filter(p => !p.isPremium).slice(0, 6);

  return (
    <div className="relative">
      {/* Toggle button */}
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className={cn(
          'relative p-2.5 rounded-xl',
          'bg-muted/50 hover:bg-muted',
          'border border-border/50',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* FIXED: Use AnimatePresence for smooth icon swap without rotation */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={resolvedMode}
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {resolvedMode === 'dark' ? (
              <Moon size={18} className="text-foreground" />
            ) : (
              <Sun size={18} className="text-foreground" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Active indicator */}
        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPanel(false)}
            />

            {/* Panel content */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute right-0 top-full mt-2 z-50',
                'w-72 p-4',
                'bg-card/95 backdrop-blur-xl',
                'border border-border/50',
                'rounded-2xl shadow-2xl'
              )}
            >
              {/* Mode selector */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Appearance
                </p>
                <div className="flex gap-1 p-1 rounded-xl bg-muted/50">
                  {modes.map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setTheme({ mode: id })}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg',
                        'text-sm font-medium transition-all duration-200',
                        theme.mode === id
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon size={14} />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick presets */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Quick Presets
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setTheme({
                          id: preset.id,
                          ...preset.config,
                        });
                      }}
                      className={cn(
                        'relative p-2 rounded-xl',
                        'border-2 transition-all duration-200',
                        'hover:scale-105',
                        theme.id === preset.id
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-border/50 hover:border-primary-500/50'
                      )}
                    >
                      {/* Color preview */}
                      <div className="flex gap-1 mb-1.5">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.preview.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.preview.accent }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-foreground">
                        {preset.name}
                      </span>

                      {/* Check mark */}
                      {theme.id === preset.id && (
                        <div className="absolute top-1 right-1">
                          <Check size={10} className="text-primary-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* More options link */}
              <button
                onClick={() => setShowPanel(false)}
                className={cn(
                  'w-full mt-4 flex items-center justify-center gap-2',
                  'py-2 rounded-xl',
                  'bg-gradient-to-r from-primary-500/10 to-accent-500/10',
                  'border border-primary-500/20',
                  'text-sm font-medium text-primary-500',
                  'hover:from-primary-500/20 hover:to-accent-500/20',
                  'transition-all duration-200'
                )}
              >
                <Palette size={14} />
                More Customization
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});