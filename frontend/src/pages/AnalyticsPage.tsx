import React from 'react';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { AnalyticsOverview } from '../types';

interface AnalyticsPageProps {
  overview: AnalyticsOverview | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ overview }) => {
  return (
    <div className="space-y-4">
      <AnalyticsDashboard overview={overview} />
    </div>
  );
};