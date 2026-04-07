// components/settings/SettingsPage.tsx - FIXED VERSION
'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Palette,
  Timer,
  Bell,
  Target,
  Accessibility,
  Keyboard,
  Download,
  Info,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { PremiumThemeCustomizer } from './PremiumThemeCustomizer';
import { TimerSettingsTab } from './tabs/TimerSettingsTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { GoalsTab } from './tabs/GoalsTab';
import { AccessibilityTab } from './tabs/AccessibilityTab';
import { KeyboardShortcutsCard } from './KeyboardShortcutsCard';
import { ExportData } from './ExportData';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

interface SettingsPageProps {
  sessions: Session[];
  onDataCleared: () => void;
  onDataImported: () => void;
}

// ✅ FIXED: Changed 'track' to 'timer' to match TabsContent value
const tabs = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'timer', label: 'Timer', icon: Timer },  // ✅ FIXED: was 'track'
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  { id: 'data', label: 'Data', icon: Download },
  { id: 'about', label: 'About', icon: Info },
] as const;

export const SettingsPage = memo(function SettingsPage({
  sessions,
  onDataCleared,
  onDataImported,
}: SettingsPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="text-primary-500" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your Mohammed's Tracker experience
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              icon={<tab.icon size={16} />}
            >
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="appearance">
          <PremiumThemeCustomizer />
        </TabsContent>

        <TabsContent value="timer">
          <TimerSettingsTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="goals">
          <GoalsTab />
        </TabsContent>

        <TabsContent value="accessibility">
          <AccessibilityTab />
        </TabsContent>

        <TabsContent value="shortcuts">
          <KeyboardShortcutsCard />
        </TabsContent>

        <TabsContent value="data">
          <ExportData
            sessions={sessions}
            onDataCleared={onDataCleared}
            onDataImported={onDataImported}
          />
        </TabsContent>

        <TabsContent value="about">
          <AboutSection />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
});

// About Section
const AboutSection = memo(function AboutSection() {
  return (
    <div className="space-y-6">
      {/* App Info Card */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Settings className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Mohammed's Tracker</h2>
            <p className="text-muted-foreground mb-4">
              Dear Mohammed Hassan, your brother Hossam made this beautiful time tracking app specially for you. Track your sessions, monitor productivity, and achieve your goals with style!
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Version:</span>{' '}
                <span className="text-primary-500 font-mono">2.0.0</span>
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Made with:</span>{' '}
                ❤️ by Hossam Hassan using Next.js, React, TypeScript, Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Card */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          Features
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            'Precision session tracking with laps',
            'Complete session history and management',
            'Beautiful productivity charts & insights',
            'Premium customizable themes',
            'Pomodoro timer support',
            'Daily/weekly goal tracking with streaks',
            'Smart break reminders & notifications',
            'Keyboard shortcuts for power users',
            'Full data export/import (JSON/CSV)',
            'Offline PWA support',
            'Full accessibility features',
            'Perfect dark/light mode support',
          ].map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <span className="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border/50 pt-6">
        <p className="text-sm text-muted-foreground mb-2">
          Made with {'\u2764\uFE0F'} especially for you, Mohammed!
        </p>
        <p className="text-xs text-muted-foreground/70">
          © 2024 Hossam Hassan. All rights reserved.
        </p>
      </div>
    </div>
  );
});