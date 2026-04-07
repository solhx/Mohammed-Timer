// components/settings/PremiumThemeCustomizer.tsx - FIXED VERSION
'use client';

import { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Layers,
  Zap,
  Layout,
  Timer,
  BarChart3,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Lock,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
// ✅ FIXED: Import shared UI components instead of defining locally
import { Slider } from '@/components/ui/Slider';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { useThemeContext } from '@/context/ThemeContext';
import { THEME_PRESETS, COLOR_PALETTES, DEFAULT_THEME } from '@/lib/theme-presets';
import type { ThemeConfig, ThemePreset } from '@/types';
import { cn } from '@/lib/utils';

// ============================================
// Section Component
// ============================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section = memo(function Section({
  title,
  icon,
  children,
  defaultOpen = false,
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'bg-muted/30 hover:bg-muted/60 transition-colors duration-150',
          isOpen && 'border-b border-border'
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-primary-500">{icon}</span>
          <span className="font-medium text-foreground">{title}</span>
        </div>
        <span className="text-muted-foreground">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="section-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            // ✅ FIXED: Remove overflow-hidden, add overflow-visible when open
            style={{ overflow: 'visible' }}
          >
            <div className="p-4 space-y-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ============================================
// Preset Card
// ============================================

interface PresetCardProps {
  preset: ThemePreset;
  isActive: boolean;
  onSelect: () => void;
}

const PresetCard = memo(function PresetCard({
  preset,
  isActive,
  onSelect,
}: PresetCardProps) {
  return (
    <button
      onClick={onSelect}
      // ✅ REMOVED: disabled={preset.isPremium}
      className={cn(
        'relative p-3 rounded-xl border-2 transition-all duration-200 text-left',
        'hover:scale-[1.02] focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-primary-500',
        isActive
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-border hover:border-primary-400',
        // ✅ REMOVED: preset.isPremium && 'opacity-60 cursor-not-allowed'
      )}
    >
      {/* Color dots preview */}
      <div className="flex gap-1.5 mb-2">
        <div
          className="w-5 h-5 rounded-full shadow-sm"
          style={{ backgroundColor: preset.preview.primary }}
        />
        <div
          className="w-5 h-5 rounded-full shadow-sm"
          style={{ backgroundColor: preset.preview.accent }}
        />
        <div
          className="w-5 h-5 rounded shadow-sm border border-border"
          style={{ backgroundColor: preset.preview.background }}
        />
      </div>

      {/* Name + description */}
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-sm font-semibold text-foreground">
          {preset.name}
        </span>
        {/* ✅ REMOVED: Premium lock icon */}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-1">
        {preset.description}
      </p>

      {/* Active check */}
      {isActive && (
        <div className="absolute top-2 right-2">
          <Check size={15} className="text-primary-500" />
        </div>
      )}

      {/* ✅ CHANGED: Show "PRO" as a badge, not a lock */}
      {preset.isPremium && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border border-amber-500/30">
            <Sparkles size={9} />
            PRO
          </span>
        </div>
      )}
    </button>
  );
});
// ============================================
// Component Color Row
// ============================================

interface ComponentColorRowProps {
  label: string;
  description?: string;
  value: string;
  onChange: (color: string) => void;
}

const ComponentColorRow = memo(function ComponentColorRow({
  label,
  description,
  value,
  onChange,
}: ComponentColorRowProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      {/* Quick palette */}
      <div className="flex flex-wrap gap-2">
        {COLOR_PALETTES.component.map((color) => {
          const isSelected =
            value.toLowerCase() === color.value.toLowerCase();
          return (
            <button
              key={color.value}
              onClick={() => onChange(color.value)}
              title={color.name}
              aria-label={`Set ${label} to ${color.name}`}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all duration-150',
                'hover:scale-110 active:scale-95 focus:outline-none',
                'focus-visible:ring-2 focus-visible:ring-offset-1',
                'focus-visible:ring-primary-500',
                isSelected
                  ? 'border-primary-500 scale-110'
                  : 'border-border'
              )}
              style={{ backgroundColor: color.value }}
            >
              {isSelected && (
                <Check
                  size={14}
                  className="mx-auto"
                  style={{ color: color.value < '#888888' ? '#fff' : '#000' }}
                />
              )}
            </button>
          );
        })}

        {/* Native color picker */}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            title="Custom color"
            aria-label={`Custom color for ${label}`}
            className={cn(
              'w-8 h-8 rounded-full cursor-pointer border-2 border-border',
              'hover:border-primary-400',
              'transition-all duration-150',
              '[&::-webkit-color-swatch-wrapper]:p-0',
              '[&::-webkit-color-swatch]:rounded-full',
              '[&::-webkit-color-swatch]:border-none'
            )}
          />
        </div>
      </div>

      {/* Current value display */}
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded border border-border shadow-sm shrink-0"
          style={{ backgroundColor: value }}
        />
        <span className="text-xs text-muted-foreground font-mono">
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
});

// ============================================
// Main Component
// ============================================

export const PremiumThemeCustomizer = memo(function PremiumThemeCustomizer() {
  const { theme, setTheme, setFullTheme, resetTheme } = useThemeContext();

  const modeOptions = [
    { id: 'light',  label: 'Light',  icon: Sun     },
    { id: 'dark',   label: 'Dark',   icon: Moon    },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const;

  // Handlers
  const handlePresetSelect = useCallback(
  (preset: ThemePreset) => {
  
    setFullTheme({
      ...DEFAULT_THEME,
      ...preset.config,
      id:   preset.id,
      name: preset.name,
    } as ThemeConfig);
  },
  [setFullTheme]
);

  const handleModeChange = useCallback(
    (mode: 'light' | 'dark' | 'system') => { setTheme({ mode }); },
    [setTheme]
  );

  const handlePrimaryChange = useCallback(
    (color: string) => { setTheme({ primary: color }); },
    [setTheme]
  );

  const handleAccentChange = useCallback(
    (color: string) => { setTheme({ accent: color }); },
    [setTheme]
  );

  const handleBackgroundChange = useCallback(
    (color: string) => {
      setTheme({
        surfaces:   { ...theme.surfaces,   background: color },
        background: { ...theme.background, solid: color },
      });
    },
    [setTheme, theme.surfaces, theme.background]
  );

  const handleEffectsChange = useCallback(
    (updates: Partial<ThemeConfig['effects']>) => {
      setTheme({ effects: { ...theme.effects, ...updates } });
    },
    [setTheme, theme.effects]
  );

  const handleBackgroundTypeChange = useCallback(
    (type: 'solid' | 'gradient') => {
      setTheme({
        background: {
          ...theme.background,
          type,
          gradient: {
            ...theme.background.gradient,
            enabled: type === 'gradient',
          },
        },
      });
    },
    [setTheme, theme.background]
  );

  const handleGradientChange = useCallback(
    (updates: Partial<ThemeConfig['background']['gradient']>) => {
      setTheme({
        background: {
          ...theme.background,
          type: 'gradient',
          gradient: {
            ...theme.background.gradient,
            ...updates,
            enabled: true,
          },
        },
      });
    },
    [setTheme, theme.background]
  );

  const handleTimerChange = useCallback(
    (updates: Partial<ThemeConfig['timer']>) => {
      setTheme({ timer: { ...theme.timer, ...updates } });
    },
    [setTheme, theme.timer]
  );

  const handleCardsChange = useCallback(
    (updates: Partial<ThemeConfig['cards']>) => {
      setTheme({ cards: { ...theme.cards, ...updates } });
    },
    [setTheme, theme.cards]
  );

  const handleButtonsChange = useCallback(
    (updates: Partial<ThemeConfig['buttons']>) => {
      setTheme({ buttons: { ...theme.buttons, ...updates } });
    },
    [setTheme, theme.buttons]
  );

  const handleComponentColorChange = useCallback(
    (key: keyof ThemeConfig['componentColors'], color: string) => {
      setTheme({
        componentColors: {
          ...theme.componentColors,
          [key]: color,
        },
      });
    },
    [setTheme, theme.componentColors]
  );

  // Component color fields config
  const componentColorFields: Array<{
    key: keyof ThemeConfig['componentColors'];
    label: string;
    description: string;
  }> = [
    {
      key:         'sidebarBg',
      label:       'Sidebar Background',
      description: 'Left navigation panel background',
    },
    {
      key:         'headerBg',
      label:       'Header Background',
      description: 'Top bar with logo and controls',
    },
    {
      key:         'timerBg',
      label:       'Timer Card Background',
      description: 'The stopwatch and controls card',
    },
    {
      key:         'contentBg',
      label:       'Content Area Background',
      description: 'Main page background behind cards',
    },
    {
      key:         'dashboardCardBg',
      label:       'Dashboard Cards Background',
      description: 'Stat cards and chart containers',
    },
    {
      key:         'navBg',
      label:       'Mobile Navigation Background',
      description: 'Bottom nav bar on mobile devices',
    },
  ];

  // Border radius options for Select
  const borderRadiusOptions = [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
    { value: '2xl', label: '2X Large' },
    { value: 'full', label: 'Full (Pill)' },
  ];

  const animationSpeedOptions = [
    { value: 'slow', label: 'Slow' },
    { value: 'normal', label: 'Normal' },
    { value: 'fast', label: 'Fast' },
  ];

  // Render
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Palette className="text-primary-500" />
            Theme Customizer
          </h2>
          <p className="text-muted-foreground mt-1">
            Personalize every aspect of your experience
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetTheme}>
          <RotateCcw size={15} className="mr-2" />
          Reset
        </Button>
      </div>

      {/* Theme Presets */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary-500" />
            Theme Presets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {THEME_PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isActive={theme.id === preset.id}
                onSelect={() => handlePresetSelect(preset)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mode selector */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun size={18} className="text-primary-500" />
            Appearance Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {modeOptions.map(({ id, label, icon: Icon }) => {
              const isActive = theme.mode === id;
              return (
                <button
                  key={id}
                  onClick={() => handleModeChange(id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
                    'border-2 font-medium text-sm transition-all duration-200',
                    'hover:scale-[1.02] active:scale-[0.98]',
                    'focus:outline-none focus-visible:ring-2',
                    'focus-visible:ring-primary-500',
                    isActive
                      ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                      : 'border-border hover:border-primary-300 text-foreground'
                  )}
                >
                  <Icon size={17} />
                  {label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Collapsible sections */}
      <div className="space-y-3">

        {/* Colors */}
        <Section title="Colors" icon={<Palette size={18} />} defaultOpen>
          <ColorPicker
            label="Primary Color"
            value={theme.primary}
            onChange={handlePrimaryChange}
          />

          <ColorPicker
            label="Accent Color"
            value={theme.accent}
            onChange={handleAccentChange}
          />

          <ColorPicker
            label="Background Color"
            value={theme.surfaces.background}
            onChange={handleBackgroundChange}
            colors={COLOR_PALETTES.background}
          />

          {/* Live Preview */}
          <div className="mt-2 p-4 rounded-xl border border-border bg-muted/20">
            <p className="text-sm font-medium text-foreground mb-3">
              Live Preview
            </p>

            <div className="flex items-center gap-3 flex-wrap mb-3">
              <button
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-transform hover:scale-105"
                style={{ backgroundColor: theme.primary }}
              >
                Primary
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-transform hover:scale-105"
                style={{ backgroundColor: theme.accent }}
              >
                Accent
              </button>
              <div
                className="flex-1 h-10 rounded-lg border min-w-[80px]"
                style={{
                  backgroundColor: theme.surfaces.background,
                  borderColor: theme.surfaces.border,
                }}
              />
            </div>

            <div
              className="h-10 rounded-lg mb-3 transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
              }}
            />
          </div>
        </Section>

        {/* Component Colors */}
        <Section
          title="Component Colors"
          icon={<Layout size={18} />}
          defaultOpen={false}
        >
          <p className="text-xs text-muted-foreground -mt-1">
            Override the background color of individual UI components.
          </p>

          <div className="space-y-6 divide-y divide-border">
            {componentColorFields.map(({ key, label, description }, idx) => (
              <div key={key} className={idx > 0 ? 'pt-5' : ''}>
                <ComponentColorRow
                  label={label}
                  description={description}
                  value={
                    theme.componentColors?.[key] ??
                    DEFAULT_THEME.componentColors[key]
                  }
                  onChange={(color) => handleComponentColorChange(key, color)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              setTheme({ componentColors: DEFAULT_THEME.componentColors })
            }
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            <RotateCcw size={13} />
            Reset component colors to default
          </button>
        </Section>

        {/* Background */}
        <Section title="Background" icon={<Layers size={18} />}>
          <Select
            label="Background Type"
            value={theme.background.type}
            options={[
              { value: 'solid', label: 'Solid Color' },
              { value: 'gradient', label: 'Gradient' },
            ]}
            onChange={(v) =>
              handleBackgroundTypeChange(v as 'solid' | 'gradient')
            }
          />

          {theme.background.type === 'gradient' && (
            <>
              <Select
                label="Gradient Type"
                value={theme.background.gradient.type}
                options={[
                  { value: 'linear', label: 'Linear' },
                  { value: 'radial', label: 'Radial' },
                  { value: 'conic', label: 'Conic' },
                ]}
                onChange={(v) =>
                  handleGradientChange({
                    type: v as 'linear' | 'radial' | 'conic',
                  })
                }
              />

              {theme.background.gradient.type === 'linear' && (
                <Slider
                  label="Gradient Angle"
                  value={theme.background.gradient.angle}
                  min={0}
                  max={360}
                  onChange={(v) => handleGradientChange({ angle: v })}
                  suffix="°"
                />
              )}

              <Slider
                label="Gradient Opacity"
                value={theme.background.gradient.opacity}
                min={0}
                max={100}
                onChange={(v) => handleGradientChange({ opacity: v })}
                suffix="%"
              />

              {/* Gradient color pickers */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Gradient Colors
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Start
                    </label>
                    <input
                      type="color"
                      value={
                        theme.background.gradient.colors?.[0] ?? theme.primary
                      }
                      onChange={(e) => {
                        const colors = [
                          ...(theme.background.gradient.colors ?? [
                            theme.primary,
                            theme.accent,
                          ]),
                        ];
                        colors[0] = e.target.value;
                        handleGradientChange({ colors });
                      }}
                      className="w-full h-10 rounded-lg cursor-pointer border border-border transition-all hover:border-primary-400 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-muted-foreground">
                      End
                    </label>
                    <input
                      type="color"
                      value={
                        theme.background.gradient.colors?.[1] ?? theme.accent
                      }
                      onChange={(e) => {
                        const colors = [
                          ...(theme.background.gradient.colors ?? [
                            theme.primary,
                            theme.accent,
                          ]),
                        ];
                        colors[1] = e.target.value;
                        handleGradientChange({ colors });
                      }}
                      className="w-full h-10 rounded-lg cursor-pointer border border-border transition-all hover:border-primary-400 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                    />
                  </div>
                </div>
              </div>

              <Toggle
                label="Animated Gradient"
                description="Slowly shift gradient colors over time"
                checked={theme.background.gradient.animated}
                onChange={(v) => handleGradientChange({ animated: v })}
              />
            </>
          )}

          <Select
            label="Background Pattern"
            value={theme.background.pattern ?? 'none'}
            options={[
              { value: 'none', label: 'None' },
              { value: 'dots', label: 'Dots' },
              { value: 'grid', label: 'Grid' },
              { value: 'noise', label: 'Noise' },
            ]}
            onChange={(v) =>
              setTheme({
                background: {
                  ...theme.background,
                  pattern: v as 'dots' | 'grid' | 'noise' | 'none',
                },
              })
            }
          />

          {theme.background.pattern && theme.background.pattern !== 'none' && (
            <Slider
              label="Pattern Opacity"
              value={theme.background.patternOpacity}
              min={1}
              max={20}
              onChange={(v) =>
                setTheme({
                  background: { ...theme.background, patternOpacity: v },
                })
              }
              suffix="%"
            />
          )}
        </Section>

        {/* Effects */}
        <Section title="Effects" icon={<Zap size={18} />}>
          <Slider
            label="Glass Blur"
            value={theme.effects.blur}
            min={0}
            max={20}
            onChange={(v) => handleEffectsChange({ blur: v })}
            suffix="px"
          />
          <Slider
            label="Glow Intensity"
            value={theme.effects.glowIntensity}
            min={0}
            max={100}
            onChange={(v) => handleEffectsChange({ glowIntensity: v })}
            suffix="%"
          />
          <Slider
            label="Shadow Intensity"
            value={theme.effects.shadowIntensity}
            min={0}
            max={100}
            onChange={(v) => handleEffectsChange({ shadowIntensity: v })}
            suffix="%"
          />
          <Select
            label="Border Radius"
            value={theme.effects.borderRadius}
            options={borderRadiusOptions}
            onChange={(v) =>
              handleEffectsChange({ borderRadius: v as ThemeConfig['effects']['borderRadius'] })
            }
          />
          <Select
            label="Animation Speed"
            value={theme.effects.animationSpeed}
            options={animationSpeedOptions}
            onChange={(v) =>
              handleEffectsChange({ animationSpeed: v as ThemeConfig['effects']['animationSpeed'] })
            }
          />
          <Toggle
            label="Reduced Motion"
            description="Minimize animations for accessibility"
            checked={theme.effects.reducedMotion}
            onChange={(v) => handleEffectsChange({ reducedMotion: v })}
          />
        </Section>

        {/* Cards */}
        <Section title="Cards" icon={<Layout size={18} />}>
          <Select
            label="Card Style"
            value={theme.cards.style}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'glass', label: 'Glass' },
              { value: 'bordered', label: 'Bordered' },
              { value: 'elevated', label: 'Elevated' },
              { value: 'gradient', label: 'Gradient' },
            ]}
            onChange={(v) => handleCardsChange({ style: v as ThemeConfig['cards']['style'] })}
          />
          <Select
            label="Hover Effect"
            value={theme.cards.hoverEffect}
            options={[
              { value: 'none', label: 'None' },
              { value: 'lift', label: 'Lift' },
              { value: 'glow', label: 'Glow' },
              { value: 'scale', label: 'Scale' },
              { value: 'border', label: 'Border Highlight' },
            ]}
            onChange={(v) => handleCardsChange({ hoverEffect: v as ThemeConfig['cards']['hoverEffect'] })}
          />
        </Section>

        {/* Buttons */}
        <Section title="Buttons" icon={<Layout size={18} />}>
          <Select
            label="Button Style"
            value={theme.buttons.style}
            options={[
              { value: 'default', label: 'Default (Rounded)' },
              { value: 'pill', label: 'Pill' },
              { value: 'square', label: 'Square' },
            ]}
            onChange={(v) => handleButtonsChange({ style: v as ThemeConfig['buttons']['style'] })}
          />
          <Toggle
            label="Primary Gradient"
            description="Use gradient fill for primary buttons"
            checked={theme.buttons.primaryGradient}
            onChange={(v) => handleButtonsChange({ primaryGradient: v })}
          />
          <Select
            label="Hover Effect"
            value={theme.buttons.hoverEffect}
            options={[
              { value: 'none', label: 'None' },
              { value: 'glow', label: 'Glow' },
              { value: 'scale', label: 'Scale' },
              { value: 'shine', label: 'Shine' },
            ]}
            onChange={(v) => handleButtonsChange({ hoverEffect: v as ThemeConfig['buttons']['hoverEffect'] })}
          />
        </Section>

        {/* Timer */}
        <Section title="Timer Display" icon={<Timer size={18} />}>
          <Select
            label="Display Style"
            value={theme.timer.displayStyle}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'minimal', label: 'Minimal' },
              { value: 'neon', label: 'Neon Glow' },
              { value: 'gradient', label: 'Gradient Text' },
            ]}
            onChange={(v) => handleTimerChange({ displayStyle: v as ThemeConfig['timer']['displayStyle'] })}
          />
          <Select
            label="Font Family"
            value={theme.timer.fontFamily}
            options={[
              { value: 'mono', label: 'Monospace' },
              { value: 'sans', label: 'Sans-serif' },
              { value: 'digital', label: 'Digital' },
            ]}
            onChange={(v) => handleTimerChange({ fontFamily: v as ThemeConfig['timer']['fontFamily'] })}
          />
          <Toggle
            label="Show Milliseconds"
            checked={theme.timer.showMilliseconds}
            onChange={(v) => handleTimerChange({ showMilliseconds: v })}
          />
          <Toggle
            label="Pulse When Running"
            description="Subtle pulse animation while the timer runs"
            checked={theme.timer.pulseWhenRunning}
            onChange={(v) => handleTimerChange({ pulseWhenRunning: v })}
          />
          <ColorPicker
            label="Timer Glow Color"
            value={theme.timer.glowColor}
            onChange={(v) => handleTimerChange({ glowColor: v })}
          />
        </Section>

        {/* Charts */}
        <Section title="Charts" icon={<BarChart3 size={18} />}>
          <Select
            label="Chart Style"
            value={theme.charts.style}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'gradient', label: 'Gradient Fill' },
              { value: 'neon', label: 'Neon Glow' },
            ]}
            onChange={(v) =>
              setTheme({ charts: { ...theme.charts, style: v as ThemeConfig['charts']['style'] } })
            }
          />
          <Slider
            label="Grid Opacity"
            value={theme.charts.gridOpacity}
            min={0}
            max={30}
            onChange={(v) =>
              setTheme({ charts: { ...theme.charts, gridOpacity: v } })
            }
            suffix="%"
          />
        </Section>
      </div>
    </div>
  );
});