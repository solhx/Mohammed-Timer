// components/settings/tabs/GoalsTab.tsx - NEW FILE
'use client';

import { memo } from 'react';
import { Target, TrendingUp, Flame, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { NumberInput } from '@/components/ui/NumberInput';
import { Button } from '@/components/ui/Button';
import { useSettingsContext } from '@/context/SettingsContext';
import { useSessionContext } from '@/context/SessionContext';
import { cn } from '@/lib/utils';

export const GoalsTab = memo(function GoalsTab() {
  const { settings, setGoalSettings, resetSection } = useSettingsContext();
  const { stats } = useSessionContext();
  const goals = settings.goals;

  // Calculate progress
  const dailyTimeProgress = goals.dailyTimeGoal > 0 
    ? Math.min((stats.today / (goals.dailyTimeGoal * 60 * 1000)) * 100, 100)
    : 0;
  
  const weeklyTimeProgress = goals.weeklyTimeGoal > 0
    ? Math.min((stats.thisWeek / (goals.weeklyTimeGoal * 60 * 1000)) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {(goals.dailyTimeGoal > 0 || goals.weeklyTimeGoal > 0) && (
        <Card variant="bordered" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-500" />
              Current Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.dailyTimeGoal > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Daily Goal</span>
                  <span className="font-medium text-foreground">
                    {Math.round(stats.today / 60000)}m / {goals.dailyTimeGoal}m
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      dailyTimeProgress >= 100 ? 'bg-success' : 'bg-primary-500'
                    )}
                    style={{ width: `${dailyTimeProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {goals.weeklyTimeGoal > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Weekly Goal</span>
                  <span className="font-medium text-foreground">
                    {Math.round(stats.thisWeek / 60000)}m / {goals.weeklyTimeGoal}m
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      weeklyTimeProgress >= 100 ? 'bg-success' : 'bg-accent-500'
                    )}
                    style={{ width: `${weeklyTimeProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {goals.streakTracking && stats.streak > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <Flame size={20} className="text-orange-500" />
                <span className="font-medium text-foreground">
                  {stats.streak} day streak!
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Time Goals */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={18} className="text-primary-500" />
            Time Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberInput
            label="Daily Time Goal"
            value={goals.dailyTimeGoal}
            min={0}
            max={1440}
            step={15}
            onChange={(value) => setGoalSettings({ dailyTimeGoal: value })}
            suffix="min"
          />
          <p className="text-xs text-muted-foreground -mt-2">
            Set to 0 to disable
          </p>
          
          <NumberInput
            label="Weekly Time Goal"
            value={goals.weeklyTimeGoal}
            min={0}
            max={10080}
            step={60}
            onChange={(value) => setGoalSettings({ weeklyTimeGoal: value })}
            suffix="min"
          />
        </CardContent>
      </Card>

      {/* Session Goals */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-500" />
            Session Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberInput
            label="Daily Session Goal"
            value={goals.dailySessionGoal}
            min={0}
            max={50}
            onChange={(value) => setGoalSettings({ dailySessionGoal: value })}
            suffix="sessions"
          />
          
          <NumberInput
            label="Weekly Session Goal"
            value={goals.weeklySessionGoal}
            min={0}
            max={200}
            onChange={(value) => setGoalSettings({ weeklySessionGoal: value })}
            suffix="sessions"
          />
        </CardContent>
      </Card>

      {/* Display & Celebrations */}
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame size={18} className="text-primary-500" />
            Display & Celebrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            checked={goals.showProgressInHeader}
            onChange={(checked) => setGoalSettings({ showProgressInHeader: checked })}
            label="Show Progress in Header"
            size="md"
          />
          
          <Toggle
            checked={goals.showProgressInDashboard}
            onChange={(checked) => setGoalSettings({ showProgressInDashboard: checked })}
            label="Show Progress in Dashboard"
            size="md"
          />
          
          <Toggle
            checked={goals.celebrateGoalCompletion}
            onChange={(checked) => setGoalSettings({ celebrateGoalCompletion: checked })}
            label="Celebrate Goal Completion"
            size="md"
          />
          
          <Toggle
            checked={goals.streakTracking}
            onChange={(checked) => setGoalSettings({ streakTracking: checked })}
            label="Track Daily Streak"
            size="md"
          />
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => resetSection('goals')}
          className="text-muted-foreground"
        >
          Reset Goal Settings
        </Button>
      </div>
    </div>
  );
});