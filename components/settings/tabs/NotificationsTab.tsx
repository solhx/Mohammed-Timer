// components/settings/tabs/NotificationsTab.tsx - NEW FILE
'use client';

import { memo, useCallback } from 'react';
import { Bell, Clock, Target, Volume2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useSettingsContext } from '@/context/SettingsContext';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

export const NotificationsTab = memo(function NotificationsTab() {
  const { settings, setNotificationSettings, resetSection } = useSettingsContext();
  const notifications = settings.notifications;
  const { permission, requestPermission } = useNotifications();

  const handleRequestPermission = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      setNotificationSettings({ enabled: true });
    }
  }, [requestPermission, setNotificationSettings]);

  const toggleMilestone = useCallback((minutes: number) => {
    const current = notifications.milestoneIntervals;
    const newIntervals = current.includes(minutes)
      ? current.filter(m => m !== minutes)
      : [...current, minutes].sort((a, b) => a - b);
    setNotificationSettings({ milestoneIntervals: newIntervals });
  }, [notifications.milestoneIntervals, setNotificationSettings]);

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      {permission !== 'granted' && (
        <Card variant="bordered" padding="md" className="border-warning/50 bg-warning/5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Notifications Disabled</p>
              <p className="text-sm text-muted-foreground">
                Enable browser notifications to receive alerts
              </p>
            </div>
            <Button variant="primary" onClick={handleRequestPermission}>
              Enable Notifications
            </Button>
          </CardContent>
        </Card>
      )}

      {/* General Settings */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={18} className="text-primary-500" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={notifications.enabled}
            onChange={(checked) => setNotificationSettings({ enabled: checked })}
            label="Enable Notifications"
            disabled={permission !== 'granted'}
            size="md"
          />
          
          <Select
            label="Notification Sound"
            value={notifications.notificationSound}
            onChange={(value) => setNotificationSettings({ 
              notificationSound: value as typeof notifications.notificationSound 
            })}
            options={[
              { value: 'none', label: 'None' },
              { value: 'chime', label: 'Chime' },
              { value: 'bell', label: 'Bell' },
              { value: 'ding', label: 'Ding' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Break Reminders */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={18} className="text-primary-500" />
            Break Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={notifications.breakReminders}
            onChange={(checked) => setNotificationSettings({ breakReminders: checked })}
            label="Enable Break Reminders"
            disabled={!notifications.enabled}
            size="md"
          />
          
          {notifications.breakReminders && (
            <NumberInput
              label="Reminder Interval"
              value={notifications.breakReminderInterval}
              min={15}
              max={180}
              step={15}
              onChange={(value) => setNotificationSettings({ breakReminderInterval: value })}
              suffix="min"
            />
          )}
        </CardContent>
      </Card>

      {/* Milestone Alerts */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={18} className="text-primary-500" />
            Milestone Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={notifications.milestoneAlerts}
            onChange={(checked) => setNotificationSettings({ milestoneAlerts: checked })}
            label="Enable Milestone Alerts"
            disabled={!notifications.enabled}
            size="md"
          />
          
          {notifications.milestoneAlerts && (
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Alert at these intervals
              </label>
              <div className="flex flex-wrap gap-2">
                {[15, 30, 45, 60, 90, 120, 180, 240].map((minutes) => {
                  const isSelected = notifications.milestoneIntervals.includes(minutes);
                  const label = minutes >= 60 
                    ? `${minutes / 60}h` 
                    : `${minutes}m`;
                    
                  return (
                    <button
                      key={minutes}
                      onClick={() => toggleMilestone(minutes)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium',
                        'transition-colors duration-150',
                        isSelected
                          ? 'bg-primary-500 text-white'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goal Notifications */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={18} className="text-primary-500" />
            Goal Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={notifications.dailyGoalNotification}
            onChange={(checked) => setNotificationSettings({ dailyGoalNotification: checked })}
            label="Daily Goal Achieved"
            disabled={!notifications.enabled}
            size="md"
          />
          
          <Toggle
            checked={notifications.weeklyGoalNotification}
            onChange={(checked) => setNotificationSettings({ weeklyGoalNotification: checked })}
            label="Weekly Goal Achieved"
            disabled={!notifications.enabled}
            size="md"
          />
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => resetSection('notifications')}
          className="text-muted-foreground"
        >
          Reset Notification Settings
        </Button>
      </div>
    </div>
  );
});