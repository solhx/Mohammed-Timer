// components/settings/tabs/AccessibilityTab.tsx - NEW FILE
'use client';

import { memo } from 'react';
import { Accessibility, Eye, Move, Keyboard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { useSettingsContext } from '@/context/SettingsContext';

export const AccessibilityTab = memo(function AccessibilityTab() {
  const { settings, setAccessibilitySettings, resetSection } = useSettingsContext();
  const accessibility = settings.accessibility;

  return (
    <div className="space-y-6">
      {/* Motion */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move size={18} className="text-primary-500" />
            Motion & Animations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={accessibility.reducedMotion}
            onChange={(checked) => setAccessibilitySettings({ reducedMotion: checked })}
            label="Reduce Motion"
            size="md"
          />
          <p className="text-xs text-muted-foreground">
            Minimizes animations and transitions for users who prefer reduced motion
          </p>
        </CardContent>
      </Card>

      {/* Visual */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={18} className="text-primary-500" />
            Visual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={accessibility.highContrast}
            onChange={(checked) => setAccessibilitySettings({ highContrast: checked })}
            label="High Contrast"
            size="md"
          />
          <p className="text-xs text-muted-foreground">
            Increases contrast for better visibility
          </p>
          
          <Toggle
            checked={accessibility.largeText}
            onChange={(checked) => setAccessibilitySettings({ largeText: checked })}
            label="Large Text"
            size="md"
          />
          <p className="text-xs text-muted-foreground">
            Increases text size throughout the application
          </p>
          
          <Toggle
            checked={accessibility.focusIndicators}
            onChange={(checked) => setAccessibilitySettings({ focusIndicators: checked })}
            label="Enhanced Focus Indicators"
            size="md"
          />
          <p className="text-xs text-muted-foreground">
            Shows more visible focus rings for keyboard navigation
          </p>
        </CardContent>
      </Card>

      {/* Screen Reader */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility size={18} className="text-primary-500" />
            Screen Reader
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={accessibility.screenReaderAnnouncements}
            onChange={(checked) => setAccessibilitySettings({ screenReaderAnnouncements: checked })}
            label="Screen Reader Announcements"
            size="md"
          />
          <p className="text-xs text-muted-foreground">
            Announces timer updates and status changes to screen readers
          </p>
        </CardContent>
      </Card>

      {/* Keyboard */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard size={18} className="text-primary-500" />
            Keyboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={accessibility.keyboardNavigationHints}
            onChange={(checked) => setAccessibilitySettings({ keyboardNavigationHints: checked })}
            label="Show Keyboard Hints"
            size="md"
          />
          <p className="text-xs text-muted-foreground">
            Displays keyboard shortcut hints in the interface
          </p>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => resetSection('accessibility')}
          className="text-muted-foreground"
        >
          Reset Accessibility Settings
        </Button>
      </div>
    </div>
  );
});