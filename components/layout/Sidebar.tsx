// components/layout/Sidebar.tsx - USING SIDEBAR BACKGROUND COLOR
'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Timer,
  BarChart3,
  Settings,
  History,
  Home,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Timer', icon: Timer },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = memo(function Sidebar({
  isCollapsed = false,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'h-screen flex flex-col transition-all duration-300',
        'border-r border-secondary-200 dark:border-secondary-700',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      style={{
        backgroundColor: 'rgb(var(--color-sidebar-bg))',
      }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <Timer size={18} className="text-white" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold gradient-text">TimeFlow</h1>
          )}
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={18} className="text-secondary-500" />
            ) : (
              <ChevronLeft size={18} className="text-secondary-500" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                'font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-secondary-100',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-500 dark:text-secondary-400">
              TimeFlow
            </span>
            <span className="text-xs text-primary-500 font-medium">v1.0</span>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-xs text-primary-500 font-medium">v1.0</span>
          </div>
        )}
      </div>
    </aside>
  );
});