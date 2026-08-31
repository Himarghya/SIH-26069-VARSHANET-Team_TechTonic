import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, MapPin, Radio, Users, CloudRain, Shield } from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { IndiaWeatherMap } from '../components/map/IndiaWeatherMap';
import { LiveFeed } from '../components/dashboard/LiveFeed';
import { WeatherReport, EventCluster, Alert, AnalyticsOverview } from '../types';

interface DashboardPageProps {
  overview: AnalyticsOverview | null;
  events: EventCluster[];
  reports: WeatherReport[];
  alerts: Alert[];
  onSelectReport: (report: WeatherReport) => void;
  onSelectEvent: (event: EventCluster) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  overview,
  events,
  reports,
  alerts,
  onSelectReport,
  onSelectEvent
}) => {
  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Total Ingested"
          value={overview?.total_reports || reports.length}
          subtext="Multi-source posts"
          icon={Activity}
          trend="+18% 24h"
          colorTheme="cyan"
        />
        <MetricCard
          title="Active Clusters"
          value={overview?.active_events || events.length}
          subtext="Correlated incidents"
          icon={Radio}
          trend="8 Active"
          colorTheme="blue"
        />
        <MetricCard
          title="Verified Incidents"
          value={overview?.verified_events || 6}
          subtext="Ground truth confirmed"
          icon={ShieldCheck}
          trend="88% Rate"
          colorTheme="emerald"
        />
        <MetricCard
          title="Critical Alerts"
          value={overview?.critical_alerts || alerts.length}
          subtext="Emergency bulletins"
          icon={AlertTriangle}
          trend="Red warnings"
          trendPositive={false}
          colorTheme="rose"
        />
        <MetricCard
          title="States Affected"
          value={overview?.states_affected || 8}
          subtext="Across Indian Union"
          icon={MapPin}
          trend="Pan-India"
          colorTheme="amber"
        />
        <MetricCard
          title="Mean AI Trust"
          value={`${overview?.avg_credibility || 83.7}%`}
          subtext="Multi-factor score"
          icon={Shield}
          trend="High Accuracy"
          colorTheme="purple"
        />
      </div>

      {/* Main Grid: Interactive Map (8 cols) + Real-Time Live Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <IndiaWeatherMap
            events={events}
            reports={reports}
            onSelectEvent={onSelectEvent}
            onSelectReport={onSelectReport}
          />
        </div>
        <div className="lg:col-span-4">
          <LiveFeed
            reports={reports}
            onSelectReport={onSelectReport}
          />
        </div>
      </div>
    </div>
  );
};