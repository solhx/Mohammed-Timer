// app/layout.tsx - UPDATED
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TimeFlow - Premium Time Tracking',
  description: 'A beautiful, premium time tracking application with customizable themes.',
  keywords: ['time tracking', 'stopwatch', 'productivity', 'premium', 'themes'],
  authors: [{ name: 'TimeFlow' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

// Theme initialization script - runs before React hydrates
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('timeflow_theme');
    var config = stored ? JSON.parse(stored) : null;
    var mode = config?.mode || 'system';
    var root = document.documentElement;
    
    // Apply dark mode
    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) root.classList.add('dark');
    else root.classList.add('light');
    
    // Helper to convert hex to RGB
    var hexToRgb = function(hex) {
      if (!hex) return null;
      var r = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
      return r ? parseInt(r[1],16)+' '+parseInt(r[2],16)+' '+parseInt(r[3],16) : null;
    };
    
    if (config) {
      // Apply primary color
      if (config.primary) {
        var pRgb = hexToRgb(config.primary);
        if (pRgb) {
          root.style.setProperty('--color-primary-500', pRgb);
          root.style.setProperty('--color-primary-rgb', pRgb);
        }
      }
      
      // Apply accent color
      if (config.accent) {
        var aRgb = hexToRgb(config.accent);
        if (aRgb) {
          root.style.setProperty('--color-accent', aRgb);
          root.style.setProperty('--color-accent-500', aRgb);
          root.style.setProperty('--color-accent-rgb', aRgb);
        }
      }

      // Apply effects
      if (config.effects) {
        if (config.effects.borderRadius) {
          var radiusMap = { none: '0px', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', full: '9999px' };
          root.style.setProperty('--radius', radiusMap[config.effects.borderRadius] || '0.75rem');
        }
      }
      
      // Apply background gradient
      if (config.background && config.background.type === 'gradient' && config.background.gradient && config.background.gradient.enabled) {
        var g = config.background.gradient;
        var colors = g.colors && g.colors.length ? g.colors.join(', ') : (config.primary + ', ' + config.accent);
        var gradient = '';
        if (g.type === 'linear') gradient = 'linear-gradient(' + (g.angle || 135) + 'deg, ' + colors + ')';
        else if (g.type === 'radial') gradient = 'radial-gradient(circle at center, ' + colors + ')';
        else if (g.type === 'conic') gradient = 'conic-gradient(from ' + (g.angle || 0) + 'deg, ' + colors + ')';
        
        if (gradient) {
          root.style.setProperty('--bg-gradient', gradient);
          root.style.setProperty('--bg-gradient-opacity', String((g.opacity || 100) / 100));
        }
      }
    }
  } catch (e) {
    console.error('Theme init error:', e);
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <Providers>
          <div className="premium-bg">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}