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
  onNavigateTab?: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  overview,
  events = [],
  reports = [],
  alerts = [],
  onSelectReport,
  onSelectEvent,
  onNavigateTab
}) => {
  // 1. Live Dynamic Calculations from current datasets
  const totalIngested = overview?.total_reports || reports.length;
  
  // Active vs Total Clusters
  const activeEventsCount = events.filter(e => e.status === 'ACTIVE' || e.status === 'VERIFIED').length;
  
  // Verified Incidents count & percentage
  const verifiedCount = events.filter(e => e.status === 'VERIFIED').length;
  const verifiedRate = events.length > 0 ? Math.round((verifiedCount / events.length) * 100) : 100;

  // Active Critical / High Alerts
  const criticalCount = alerts.filter(a => (a.severity === 'CRITICAL' || a.severity === 'HIGH') && a.is_active !== false).length;

  // Unique Indian States affected
  const statesSet = new Set(
    [...events.map(e => e.state), ...reports.map(r => r.state)].filter(Boolean)
  );
  const statesAffectedCount = overview?.states_affected || statesSet.size || 12;

  // Real-time Mean AI Credibility Score
  const avgTrust = reports.length > 0
    ? (reports.reduce((sum, r) => sum + (r.credibility_score || 0), 0) / reports.length).toFixed(1)
    : (overview?.avg_credibility ? overview.avg_credibility.toFixed(1) : '85.4');

  // Reports ingested in past 24h
  const nowMs = Date.now();
  const past24hCount = reports.filter(r => (nowMs - new Date(r.timestamp).getTime()) <= 24 * 3600 * 1000).length;

  return (
    <div className="space-y-6">
      {/* 6 Clickable Live Interactive Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Total Ingested"
          value={totalIngested}
          subtext="Multi-source stream"
          icon={Activity}
          trend={`+${past24hCount} 24h`}
          colorTheme="cyan"
          onClick={() => onNavigateTab && onNavigateTab('reports')}
        />
        <MetricCard
          title="Active Clusters"
          value={activeEventsCount || events.length}
          subtext="Spatiotemporal grids"
          icon={Radio}
          trend={`${activeEventsCount} Live`}
          colorTheme="blue"
          onClick={() => onNavigateTab && onNavigateTab('events')}
        />
        <MetricCard
          title="Verified Incidents"
          value={verifiedCount}
          subtext="Ground truth confirmed"
          icon={ShieldCheck}
          trend={`${verifiedRate}% Rate`}
          colorTheme="emerald"
          onClick={() => onNavigateTab && onNavigateTab('admin')}
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalCount}
          subtext="Emergency red bulletins"
          icon={AlertTriangle}
          trend={criticalCount > 0 ? `${criticalCount} Red Warning` : 'Clear'}
          trendPositive={criticalCount === 0}
          colorTheme="rose"
          onClick={() => onNavigateTab && onNavigateTab('incident')}
        />
        <MetricCard
          title="States Affected"
          value={statesAffectedCount}
          subtext="Across Indian Union"
          icon={MapPin}
          trend="Pan-India"
          colorTheme="amber"
          onClick={() => onNavigateTab && onNavigateTab('map')}
        />
        <MetricCard
          title="Mean AI Trust"
          value={`${avgTrust}%`}
          subtext="Multi-factor score"
          icon={Shield}
          trend="High Accuracy"
          colorTheme="purple"
          onClick={() => onNavigateTab && onNavigateTab('analytics')}
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