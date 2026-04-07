import { NextRequest, NextResponse } from 'next/server';
import { getSessions, exportAllData } from '@/lib/storage';
import type { Session } from '@/types';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formatParam = searchParams.get('format') as 'json' | 'csv' | null;

    const sessions = await getSessions();
    const exportedAt = new Date().toISOString();

    if (formatParam === 'csv') {
      // Generate CSV
      const headers = ['ID', 'Name', 'Start Time', 'End Time', 'Duration', 'Laps Count', 'Created At'];
      const rows = sessions.map((session: Session) => [
        session.id,
        `"${session.name.replace(/"/g, '""')}"`,
        format(new Date(session.startTime), 'yyyy-MM-dd HH:mm:ss'),
        session.endTime ? format(new Date(session.endTime), 'yyyy-MM-dd HH:mm:ss') : '',
        `${Math.floor(session.duration / 1000 / 60)}:${((session.duration / 1000) % 60).toString().padStart(2, '0')}`,
        session.laps.length.toString(),
        format(new Date(session.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      ]);

      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\\n');
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="timeflow-export-${format(new Date(), 'yyyy-MM-dd')}.csv"`,
        },
      });
    } else {
      // Default JSON
      const data = {
        exportedAt,
        version: '1.0.0',
        sessions,
      };

      return NextResponse.json(data, {
        status: 200,
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

