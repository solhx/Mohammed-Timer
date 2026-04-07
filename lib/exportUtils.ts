// lib/exportUtils.ts - NEW FILE
import type { Session, ExportFormat } from '@/types';
import { format } from 'date-fns';
import { formatDuration } from './utils';

export function exportSessions(sessions: Session[], exportFormat: ExportFormat): void {
  if (exportFormat === 'json') {
    exportAsJSON(sessions);
  } else {
    exportAsCSV(sessions);
  }
}

function exportAsJSON(sessions: Session[]): void {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    sessions,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `timeflow-export-${format(new Date(), 'yyyy-MM-dd')}.json`);
}

function exportAsCSV(sessions: Session[]): void {
  const headers = ['ID', 'Name', 'Start Time', 'End Time', 'Duration', 'Laps Count', 'Created At'];
  
  const rows = sessions.map(session => [
    session.id,
    `"${session.name.replace(/"/g, '""')}"`,
    format(new Date(session.startTime), 'yyyy-MM-dd HH:mm:ss'),
    session.endTime ? format(new Date(session.endTime), 'yyyy-MM-dd HH:mm:ss') : '',
    formatDuration(session.duration),
    session.laps.length.toString(),
    format(new Date(session.createdAt), 'yyyy-MM-dd HH:mm:ss'),
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `timeflow-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}