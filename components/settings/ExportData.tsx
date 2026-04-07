'use client';

import { memo, useState } from 'react';
import { Download, Upload, Trash2, FileJson, FileSpreadsheet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { exportSessions } from '@/lib/exportUtils';
import { clearAllSessions, importData, exportAllData } from '@/lib/storage';
import type { Session } from '@/types';

interface ExportDataProps {
  sessions: Session[];
  onDataCleared: () => void;
  onDataImported: () => void;
}

export const ExportData = memo(function ExportData({
  sessions,
  onDataCleared,
  onDataImported,
}: ExportDataProps) {
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExportJSON = () => {
    exportSessions(sessions, 'json');
  };

  const handleExportCSV = () => {
    exportSessions(sessions, 'csv');
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearAllSessions();
      onDataCleared();
      setShowClearModal(false);
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (data.sessions && Array.isArray(data.sessions)) {
          await importData({ sessions: data.sessions });
          onDataImported();
          setImportError(null);
        } else {
          setImportError('Invalid file format. Please select a valid TimeFlow export file.');
        }
      } catch (error) {
        setImportError('Failed to parse file. Please ensure it is a valid JSON file.');
      }
    };
    input.click();
  };

  return (
    <>
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Section */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Export Data
            </label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleExportJSON}
                disabled={sessions.length === 0}
                className="gap-2"
              >
                <FileJson size={18} />
                Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={sessions.length === 0}
                className="gap-2"
              >
                <FileSpreadsheet size={18} />
                Export CSV
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} available for export
            </p>
          </div>

          {/* Import Section */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Import Data
            </label>
            <Button variant="outline" onClick={handleImport} className="gap-2">
              <Upload size={18} />
              Import from JSON
            </Button>
            {importError && (
              <p className="text-xs text-red-500 mt-2">{importError}</p>
            )}
          </div>

          {/* Clear Data Section */}
          <div className="pt-4 border-t border-border">
            <label className="block text-sm font-medium text-foreground mb-3">
              Danger Zone
            </label>
            <Button
              variant="danger"
              onClick={() => setShowClearModal(true)}
              disabled={sessions.length === 0}
              className="gap-2"
            >
              <Trash2 size={18} />
              Clear All Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This action cannot be undone. All sessions will be permanently deleted.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Data"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete all {sessions.length} session
            {sessions.length !== 1 ? 's' : ''}? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearAll}
              isLoading={isClearing}
            >
              Delete All
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
});