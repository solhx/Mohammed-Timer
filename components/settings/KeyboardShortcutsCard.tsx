'use client';

import { memo } from 'react';
import { Keyboard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const shortcuts = [
  { keys: ['Space'], description: 'Start / Pause timer' },
  { keys: ['R'], description: 'Reset timer' },
  { keys: ['L'], description: 'Record lap' },
  { keys: ['B'], description: 'Toggle break' },
  { keys: ['Ctrl', 'S'], description: 'Save session' },
  { keys: ['F'], description: 'Toggle fullscreen' },
  { keys: ['Ctrl', 'D'], description: 'Toggle dark mode' },
];

export const KeyboardShortcutsCard = memo(function KeyboardShortcutsCard() {
  return (
    <Card variant="bordered" padding="md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Keyboard size={20} />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <span className="text-sm text-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex} className="flex items-center">
                    <kbd
                      className={cn(
                        'px-2.5 py-1.5 text-xs font-mono font-medium',
                        'bg-muted rounded-md border border-border',
                        'text-foreground shadow-sm'
                      )}
                    >
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground mx-1 text-xs">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});