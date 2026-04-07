// app/page.tsx - FIXED VERSION
'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Sparkles,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { Stopwatch } from '@/components/timer/Stopwatch';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { useSessionContext } from '@/context/SessionContext';
import { useThemeContext } from '@/context/ThemeContext';
import { useSettingsContext } from '@/context/SettingsContext';
import { useFullscreen } from '@/hooks/useFullscreen';
import { cn } from '@/lib/utils';
import type { Session } from '@/types';

type Tab = 'track' | 'dashboard' | 'settings';

const navItems = [
  { 
    id: 'track' as Tab,
    label: 'Track', 
    icon: Timer,
    description: 'Track your time',
    gradient: 'from-blue-500 to-cyan-500',
  },
  { 
    id: 'dashboard' as Tab, 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    description: 'View analytics',
    gradient: 'from-purple-500 to-pink-500',
  },
  { 
    id: 'settings' as Tab, 
    label: 'Settings', 
    icon: Settings,
    description: 'Customize app',
    gradient: 'from-orange-500 to-red-500',
  },
] as const;

// ✅ NEW: Goal Progress Component for Header
const GoalProgress = ({ sessions, stats }: { sessions: Session[]; stats: any }) => {
  const { settings } = useSettingsContext();
  const goals = settings.goals;
  
  // Don't show if disabled
  if (!goals.showProgressInHeader) return null;
  
  // Calculate today's time
  const todayMs = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return sessions
      .filter(s => s.startTime >= startOfDay.getTime())
      .reduce((acc, s) => acc + s.duration, 0);
  }, [sessions]);
  
  const dailyGoalMs = goals.dailyTimeGoal * 60 * 1000;
  const dailyProgress = dailyGoalMs > 0 
    ? Math.min((todayMs / dailyGoalMs) * 100, 100) 
    : 0;
  
  const weeklyGoalMs = goals.weeklyTimeGoal * 60 * 1000;
  const weeklyProgress = weeklyGoalMs > 0 && stats?.thisWeek
    ? Math.min((stats.thisWeek / weeklyGoalMs) * 100, 100)
    : 0;
  
  // Only show if there's at least one goal set
  if (goals.dailyTimeGoal === 0 && goals.weeklyTimeGoal === 0) return null;
  
  return (
    <div className="hidden lg:flex items-center gap-4">
      {/* Daily Progress */}
      {goals.dailyTimeGoal > 0 && (
        <Tooltip content={`Daily: ${Math.round(todayMs / 60000)}m / ${goals.dailyTimeGoal}m`}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Target size={14} className="text-primary-500" />
              <span className="text-xs text-muted-foreground">Daily</span>
            </div>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  dailyProgress >= 100 
                    ? 'bg-green-500' 
                    : 'bg-gradient-to-r from-primary-500 to-accent-500'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            {dailyProgress >= 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <Sparkles size={14} />
              </motion.div>
            )}
          </div>
        </Tooltip>
      )}
      
      {/* Weekly Progress */}
      {goals.weeklyTimeGoal > 0 && (
        <Tooltip content={`Weekly: ${Math.round((stats?.thisWeek || 0) / 60000)}m / ${goals.weeklyTimeGoal}m`}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-accent-500" />
              <span className="text-xs text-muted-foreground">Weekly</span>
            </div>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  weeklyProgress >= 100 
                    ? 'bg-green-500' 
                    : 'bg-gradient-to-r from-accent-500 to-pink-500'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${weeklyProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            {weeklyProgress >= 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <Sparkles size={14} />
              </motion.div>
            )}
          </div>
        </Tooltip>
      )}
      
      {/* Streak */}
      {goals.streakTracking && stats?.streak > 0 && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
          <Flame size={14} className="text-orange-500" />
          <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
            {stats.streak} day{stats.streak !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

// Quick stats for header
const QuickStats = ({ sessions }: { sessions: Session[] }) => {
  const todayTotal = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions
      .filter(s => s.startTime >= today.getTime())
      .reduce((acc, s) => acc + s.duration, 0);
  }, [sessions]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
        <Clock size={14} className="text-primary-500" />
        <span className="text-sm font-medium text-foreground">
          Today: <span className="text-primary-500">{formatTime(todayTotal)}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20">
        <Target size={14} className="text-accent-500" />
        <span className="text-sm font-medium text-foreground">
          Sessions: <span className="text-accent-500">{sessions.length}</span>
        </span>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('track');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme } = useThemeContext();
  const { settings } = useSettingsContext();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const {
    sessions,
    isLoading,
    stats,
    addSession,
    updateSession,
    deleteSession,
    refreshSessions,
  } = useSessionContext();

  // Mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Responsive
  useEffect(() => {
    if (!mounted) return;

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
      if (mobile) setIsSidebarCollapsed(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if ((e.key === 'f' || e.key === 'F') && !isTyping) {
        e.preventDefault();
        toggleFullscreen();
      }

      // Tab shortcuts: 1, 2, 3
      if (!isTyping && ['1', '2', '3'].includes(e.key)) {
        const tabs: Tab[] = ['track', 'dashboard', 'settings'];
        setActiveTab(tabs[parseInt(e.key) - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, mounted]);

  // Handlers
  const handleSessionSaved = useCallback(
    async (session: Session) => {
      await addSession(session);
    },
    [addSession]
  );

  const handleDataCleared = useCallback(() => {
    refreshSessions();
  }, [refreshSessions]);

  const handleDataImported = useCallback(() => {
    refreshSessions();
  }, [refreshSessions]);

  const handleNavClick = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      if (isMobile) setIsSidebarOpen(false);
    },
    [isMobile]
  );

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center animate-pulse">
              <Timer size={32} className="text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold gradient-text">Mohammed's Tracker</h1>
            <p className="text-sm text-muted-foreground">Loading your workspace...</p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary-500"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const sidebarWidth = isSidebarCollapsed ? 'w-20' : 'w-72';

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground 
        variant={theme.background.type === 'gradient' ? 'mesh' : 'none'} 
      />

      {/* ════════════════════════════════════════
          HEADER
          ════════════════════════════════════════ */}
      <header
        className={cn(
          'fixed top-0 right-0 z-50 h-16',
          'border-b border-border/50',
          'bg-background/60 backdrop-blur-xl',
          'transition-all duration-300',
          !isMobile && (isSidebarCollapsed ? 'left-20' : 'left-72'),
          isMobile && 'left-0'
        )}
      >
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            {/* Page title with icon */}
            <div className="flex items-center gap-3">
              <motion.div
                key={activeTab}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  'bg-gradient-to-br',
                  navItems.find(n => n.id === activeTab)?.gradient
                )}
              >
                {(() => {
                  const Icon = navItems.find(n => n.id === activeTab)?.icon || Timer;
                  return <Icon size={20} className="text-white" />;
                })()}
              </motion.div>
              <div>
                <motion.h1
                  key={activeTab}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-lg font-semibold text-foreground capitalize"
                >
                  {activeTab}
                </motion.h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {navItems.find(n => n.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Center - Goal Progress (NEW!) + Quick Stats */}
          <div className="flex items-center gap-6">
            {/* ✅ NEW: Goal Progress in Header */}
            <GoalProgress sessions={sessions} stats={stats} />
            
            {/* Quick Stats (only show if goal progress is hidden) */}
            {!settings.goals.showProgressInHeader && (
              <QuickStats sessions={sessions} />
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Tooltip content={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="hover:bg-primary-500/10"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </Button>
            </Tooltip>

            <ThemeToggle />

            {/* Premium badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                PRO
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════
          SIDEBAR
          ════════════════════════════════════════ */}
      
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full',
          'flex flex-col',
          'bg-card/80 backdrop-blur-xl',
          'border-r border-border/50',
          'transition-all duration-300 ease-out',
          isMobile && (isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'),
          !isMobile && 'translate-x-0',
          !isMobile && sidebarWidth
        )}
      >
        {/* Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border/50">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <Timer size={22} className="text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur-lg opacity-40 -z-10" />
            </div>
            {(!isSidebarCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-x font-bold gradient-text">Mohammed's Tracker</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">
                  Personal Session Tracker by Hossam Hassan
                </p>
              </motion.div>
            )}
          </motion.div>

          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hover:bg-primary-500/10"
            >
              {isSidebarCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
          {(!isSidebarCollapsed || isMobile) && (
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </p>
          )}

          {navItems.map(({ id, label, icon: Icon, description, gradient }, index) => {
            const isActive = activeTab === id;

            return (
              <Tooltip
                key={id}
                content={isSidebarCollapsed && !isMobile ? label : ''}
                position="right"
              >
                <motion.button
                  onClick={() => handleNavClick(id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-xl',
                    'transition-all duration-200',
                    'group relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r ' + gradient + ' text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    isSidebarCollapsed && !isMobile && 'justify-center px-2'
                  )}
                  whileHover={{ scale: isActive ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layoutId="activeTab"
                    />
                  )}

                  <div
                    className={cn(
                      'relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all',
                      isActive
                        ? 'bg-white/20'
                        : 'bg-muted group-hover:bg-primary-500/10'
                    )}
                  >
                    <Icon
                      size={20}
                      className={cn(
                        'transition-colors',
                        isActive ? 'text-white' : 'group-hover:text-primary-500'
                      )}
                    />
                  </div>

                  {(!isSidebarCollapsed || isMobile) && (
                    <div className="relative z-10 flex-1 text-left">
                      <span className="font-medium">{label}</span>
                      <p
                        className={cn(
                          'text-xs mt-0.5 transition-colors',
                          isActive ? 'text-white/70' : 'text-muted-foreground'
                        )}
                      >
                        {description}
                      </p>
                    </div>
                  )}

                  {(!isSidebarCollapsed || isMobile) && (
                    <span
                      className={cn(
                        'relative z-10 px-2 py-0.5 text-xs rounded-md',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </motion.button>
              </Tooltip>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-border/50">
          {(!isSidebarCollapsed || isMobile) && (
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-primary-500" />
                <span className="text-sm font-medium text-foreground">Quick Start</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Space</kbd> to start/stop your session. Dear Mohammed, stay productive! Made with ❤️ by Hossam.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab('track')}
              >
                Start Session
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between px-2">
            {(!isSidebarCollapsed || isMobile) ? (
              <>
                <span className="text-xs text-muted-foreground">Mohammed's Tracker</span>
                <span className="text-xs font-semibold text-primary-500">v2.0</span>
              </>
            ) : (
              <span className="text-xs font-semibold text-primary-500 mx-auto">v2.0</span>
            )}
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════════ */}
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300',
          !isMobile && (isSidebarCollapsed ? 'pl-20' : 'pl-72'),
          isMobile && 'pl-0',
          'pb-24 lg:pb-8'
        )}
      >
        <div className="p-4 lg:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* ✅ FIX: Keep Stopwatch ALWAYS mounted to preserve timer state */}
              <div style={{ display: activeTab === 'track' ? 'block' : 'none' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
                    <Stopwatch onSessionSaved={handleSessionSaved} />
                  </div>
                </motion.div>
              </div>

              {/* Dashboard - only render when active */}
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard
                      sessions={sessions}
                      onDeleteSession={deleteSession}
                      onUpdateSession={updateSession}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Settings - only render when active */}
              <AnimatePresence mode="wait">
                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SettingsPage
                      sessions={sessions}
                      onDataCleared={handleDataCleared}
                      onDataImported={handleDataImported}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </main>

      {/* ════════════════════════════════════════
          MOBILE BOTTOM NAV
          ════════════════════════════════════════ */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
          'bg-card/80 backdrop-blur-xl',
          'border-t border-border/50',
          'safe-area-bottom'
        )}
      >
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map(({ id, label, icon: Icon, gradient }) => {
            const isActive = activeTab === id;

            return (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl min-w-[72px]',
                  'transition-all duration-200',
                  isActive && 'bg-gradient-to-br ' + gradient
                )}
                whileTap={{ scale: 0.95 }}
              >
                <Icon
                  size={22}
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-white' : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-white' : 'text-muted-foreground'
                  )}
                >
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}