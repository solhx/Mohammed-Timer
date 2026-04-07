// app/providers.tsx - UPDATED
'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from '@/context/SessionContext';
import { SettingsProvider } from '@/context/SettingsContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <SessionProvider>
          {children}
        </SessionProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}