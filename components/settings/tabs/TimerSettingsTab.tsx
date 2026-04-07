// components/settings/tabs/TimerSettingsTab.tsx - NEW FILE
'use client';

import { memo } from 'react';
import { Timer, Volume2, Coffee, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Slider } from '@/components/ui/Slider';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSettingsContext } from '@/context/SettingsContext';
import { DEFAULT_TIMER_SETTINGS } from '@/types/settings';
import { cn } from '@/lib/utils';

export const TimerSettingsTab = memo(function TimerSettingsTab() {
  const { settings, setTimerSettings, resetSection } = useSettingsContext();
  const timer = settings.timer;

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer size={18} className="text-primary-500" />
            Display Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={timer.showMilliseconds}
            onChange={(checked) => setTimerSettings({ showMilliseconds: checked })}
            label="Show Milliseconds"
            size="md"
          />
          
          <Toggle
            checked={timer.use24HourFormat}
            onChange={(checked) => setTimerSettings({ use24HourFormat: checked })}
            label="Use 24-Hour Format"
            size="md"
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Default Session Name
            </label>
            <Input
              value={timer.defaultSessionName}
              onChange={(e) => setTimerSettings({ defaultSessionName: e.target.value })}
              placeholder="Leave empty for no default"
            />
          </div>
          
          <Toggle
            checked={timer.rememberLastSessionName}
            onChange={(checked) => setTimerSettings({ rememberLastSessionName: checked })}
            label="Remember Last Session Name"
            size="md"
          />
        </CardContent>
      </Card>

      {/* Auto-Save Settings */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save size={18} className="text-primary-500" />
            Auto-Save
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={timer.autoSaveEnabled}
            onChange={(checked) => setTimerSettings({ autoSaveEnabled: checked })}
            label="Enable Auto-Save"
            size="md"
          />
          
          {timer.autoSaveEnabled && (
            <NumberInput
              label="Auto-Save Interval"
              value={timer.autoSaveInterval}
              min={1}
              max={60}
              onChange={(value) => setTimerSettings({ autoSaveInterval: value })}
              suffix="min"
            />
          )}
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 size={18} className="text-primary-500" />
            Sound Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={timer.soundEnabled}
            onChange={(checked) => setTimerSettings({ soundEnabled: checked })}
            label="Enable Sound Effects"
            size="md"
          />
          
          {timer.soundEnabled && (
            <>
              <Slider
                label="Volume"
                value={timer.soundVolume}
                min={0}
                max={100}
                onChange={(value) => setTimerSettings({ soundVolume: value })}
                suffix="%"
              />
              
              <Select
                label="Sound Type"
                value={timer.soundType}
                onChange={(value) => setTimerSettings({ soundType: value as typeof timer.soundType })}
                options={[
                  { value: 'chime', label: 'Chime' },
                  { value: 'bell', label: 'Bell' },
                  { value: 'ding', label: 'Ding' },
                  { value: 'beep', label: 'Beep' },
                ]}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Toggle
                  checked={timer.soundOnStart}
                  onChange={(checked) => setTimerSettings({ soundOnStart: checked })}
                  label="On Start"
                  size="sm"
                />
                <Toggle
                  checked={timer.soundOnPause}
                  onChange={(checked) => setTimerSettings({ soundOnPause: checked })}
                  label="On Pause"
                  size="sm"
                />
                <Toggle
                  checked={timer.soundOnLap}
                  onChange={(checked) => setTimerSettings({ soundOnLap: checked })}
                  label="On Lap"
                  size="sm"
                />
                <Toggle
                  checked={timer.soundOnComplete}
                  onChange={(checked) => setTimerSettings({ soundOnComplete: checked })}
                  label="On Complete"
                  size="sm"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pomodoro Settings */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee size={18} className="text-primary-500" />
            Pomodoro Technique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={timer.pomodoroEnabled}
            onChange={(checked) => setTimerSettings({ pomodoroEnabled: checked })}
            label="Enable Pomodoro Mode"
            size="md"
          />
          
          {timer.pomodoroEnabled && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Work Duration"
                  value={timer.pomodoroWorkDuration}
                  min={1}
                  max={120}
                  onChange={(value) => setTimerSettings({ pomodoroWorkDuration: value })}
                  suffix="min"
                />
                
                <NumberInput
                  label="Short Break"
                  value={timer.pomodoroShortBreak}
                  min={1}
                  max={30}
                  onChange={(value) => setTimerSettings({ pomodoroShortBreak: value })}
                  suffix="min"
                />
                
                <NumberInput
                  label="Long Break"
                  value={timer.pomodoroLongBreak}
                  min={1}
                  max={60}
                  onChange={(value) => setTimerSettings({ pomodoroLongBreak: value })}
                  suffix="min"
                />
                
                <NumberInput
                  label="Sessions Before Long Break"
                  value={timer.pomodoroSessionsBeforeLongBreak}
                  min={1}
                  max={10}
                  onChange={(value) => setTimerSettings({ pomodoroSessionsBeforeLongBreak: value })}
                />
              </div>
              
              <div className="space-y-3 pt-2">
                <Toggle
                  checked={timer.pomodoroAutoStartBreak}
                  onChange={(checked) => setTimerSettings({ pomodoroAutoStartBreak: checked })}
                  label="Auto-start Breaks"
                  size="sm"
                />
                <Toggle
                  checked={timer.pomodoroAutoStartWork}
                  onChange={(checked) => setTimerSettings({ pomodoroAutoStartWork: checked })}
                  label="Auto-start Work Sessions"
                  size="sm"
                />
                <Toggle
                  checked={timer.pomodoroShowNotification}
                  onChange={(checked) => setTimerSettings({ pomodoroShowNotification: checked })}
                  label="Show Notifications"
                  size="sm"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => resetSection('timer')}
          className="text-muted-foreground"
        >
          Reset Timer Settings
        </Button>
      </div>
    </div>
  );
});