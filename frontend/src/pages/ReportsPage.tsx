import React from 'react';
import { ReportTable } from '../components/reports/ReportTable';
import { WeatherReport } from '../types';

interface ReportsPageProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
  initialStatusFilter?: string;
  initialSearchTerm?: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  reports,
  onSelectReport,
  initialStatusFilter = 'All',
  initialSearchTerm = ''
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide">Weather Observation & Report Explorer</h1>
        <p className="text-xs text-slate-400">
          Comprehensive search, inspection, and NLP intelligence query portal across millions of real-time Indian weather observations.
        </p>
      </div>
      <ReportTable
        reports={reports}
        onSelectReport={onSelectReport}
        initialStatusFilter={initialStatusFilter}
        initialSearchTerm={initialSearchTerm}
      />
    </div>
  );
};