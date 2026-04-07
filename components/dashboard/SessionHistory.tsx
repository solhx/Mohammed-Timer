// components/dashboard/SessionHistory.tsx - FIXED VERSION
'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar,
  MoreVertical,
  Trash2,
  Edit2,
  Flag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDuration, cn } from '@/lib/utils';
import type { Session } from '@/types';

interface SessionHistoryProps {
  sessions: Session[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Session>) => Promise<void>;
}

const SessionCard = memo(function SessionCard({
  session,
  onDelete,
  onUpdate,
  index,
}: {
  session: Session;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Session>) => Promise<void>;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const date = new Date(session.startTime);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleDelete = () => {
    onDelete?.(session.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          'group relative p-4 rounded-xl',
          'border border-border/50',
          'bg-card/50 hover:bg-card',
          'transition-all duration-200',
          'hover:shadow-md hover:border-primary-500/30'
        )}
      >
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Duration badge */}
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
              <span className="text-lg font-bold text-primary-500">
                {Math.floor(session.duration / 60000)}
              </span>
              <span className="text-[10px] text-muted-foreground">min</span>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-semibold text-foreground">{session.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formattedTime}
                </span>
                {session.laps && session.laps.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Flag size={12} />
                    {session.laps.length} laps
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Duration */}
            <div className="hidden sm:block text-right mr-2">
              <span className="text-lg font-semibold text-foreground">
                {formatDuration(session.duration)}
              </span>
            </div>

            {/* Expand button */}
            {session.laps && session.laps.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="opacity-0 group-hover:opacity-100"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            )}

            {/* Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100"
              >
                <MoreVertical size={16} />
              </Button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 z-50 w-36 py-1 bg-card border border-border rounded-xl shadow-lg"
                    >
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          // Handle edit - you can add edit modal here
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Expanded laps */}
        <AnimatePresence>
          {isExpanded && session.laps && session.laps.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                  <span>Lap</span>
                  <span className="text-center">Split</span>
                  <span className="text-right">Total</span>
                </div>
                {session.laps.map((lap) => (
                  <div
                    key={lap.id}
                    className="grid grid-cols-3 gap-2 py-1.5 text-sm"
                  >
                    <span className="font-medium">Lap {lap.lapNumber}</span>
                    <span className="text-center text-muted-foreground font-mono">
                      {formatDuration(lap.splitTime)}
                    </span>
                    <span className="text-right text-muted-foreground font-mono">
                      {formatDuration(lap.time)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Session"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete "{session.name}"? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
});

export const SessionHistory = memo(function SessionHistory({
  sessions,
  onDelete,
  onUpdate,
}: SessionHistoryProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <Clock size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          No sessions yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start your first timer session to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, index) => (
        <SessionCard
          key={session.id}
          session={session}
          onDelete={onDelete}
          onUpdate={onUpdate}
          index={index}
        />
      ))}
    </div>
  );
});