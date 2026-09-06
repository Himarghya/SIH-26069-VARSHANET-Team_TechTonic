import React, { useState, useMemo } from 'react';
import { Activity, AlertTriangle, ShieldCheck, MapPin, Radio, Shield, Filter, Eye } from 'lucide-react';
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
  onNavigateTab?: (tab: string, filter?: { status?: string; eventId?: string; search?: string }) => void;
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
  const [dashboardFilter, setDashboardFilter] = useState<'ALL' | 'VERIFIED' | 'CRITICAL' | '24H'>('ALL');

  // 1. Live Dynamic Calculations from current datasets
  const totalIngested = overview?.total_reports || reports.length;
  
  // Active vs Total Clusters
  const activeEventsCount = events.filter(e => e.status === 'ACTIVE' || e.status === 'VERIFIED').length;
  
  // Verified Incidents count & percentage
  const verifiedCount = events.filter(e => e.status === 'VERIFIED').length;
  const verifiedRate = events.length > 0 ? Math.round((verifiedCount / events.length) * 100) : 100;

  // Active Critical / High Alerts
  const criticalCount = alerts.filter(a => (a.severity === 'CRITICAL' || a.severity === 'HIGH') && a.is_active !== false).length;
  const firstCriticalAlert = alerts.find(a => (a.severity === 'CRITICAL' || a.severity === 'HIGH') && a.is_active !== false);

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

  // In-Dashboard Filtering for Map & Live Feed
  const displayReports = useMemo(() => {
    if (dashboardFilter === 'VERIFIED') {
      return reports.filter(r => r.verification_status === 'VERIFIED' || r.verification_status === 'LIKELY_AUTHENTIC');
    }
    if (dashboardFilter === 'CRITICAL') {
      return reports.filter(r => 
        r.credibility_score >= 80 || 
        r.text.toLowerCase().includes('flood') || 
        r.text.toLowerCase().includes('cloudburst') ||
        r.text.toLowerCase().includes('waterlog') ||
        r.text.toLowerCase().includes('warning')
      );
    }
    if (dashboardFilter === '24H') {
      return reports.filter(r => (nowMs - new Date(r.timestamp).getTime()) <= 24 * 3600 * 1000);
    }
    return reports;
  }, [reports, dashboardFilter, nowMs]);

  const displayEvents = useMemo(() => {
    if (dashboardFilter === 'VERIFIED') {
      return events.filter(e => e.status === 'VERIFIED');
    }
    if (dashboardFilter === 'CRITICAL') {
      return events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH');
    }
    return events;
  }, [events, dashboardFilter]);

  return (
    <div className="space-y-5">
      {/* 6 Clickable Live Interactive Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Total Ingested"
          value={totalIngested}
          subtext="Multi-source stream"
          icon={Activity}
          trend={`+${past24hCount} 24h`}
          colorTheme="cyan"
          actionLabel="Click to view all Ingested Reports"
          onClick={() => onNavigateTab && onNavigateTab('reports', { status: 'All' })}
        />
        <MetricCard
          title="Active Clusters"
          value={activeEventsCount || events.length}
          subtext="Spatiotemporal grids"
          icon={Radio}
          trend={`${activeEventsCount} Live`}
          colorTheme="blue"
          actionLabel="Click to inspect Active Disaster Clusters"
          onClick={() => onNavigateTab && onNavigateTab('events')}
        />
        <MetricCard
          title="Verified Incidents"
          value={verifiedCount}
          subtext="Ground truth confirmed"
          icon={ShieldCheck}
          trend={`${verifiedRate}% Rate`}
          colorTheme="emerald"
          actionLabel="Click to inspect Verified Incidents in Reports Explorer"
          onClick={() => onNavigateTab && onNavigateTab('reports', { status: 'VERIFIED' })}
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalCount}
          subtext="Emergency red bulletins"
          icon={AlertTriangle}
          trend={criticalCount > 0 ? `${criticalCount} Red Warning` : 'Clear'}
          trendPositive={criticalCount === 0}
          colorTheme="rose"
          actionLabel="Click to open Incident Command Room"
          onClick={() => onNavigateTab && onNavigateTab('incident', { eventId: firstCriticalAlert?.event_cluster_id })}
        />
        <MetricCard
          title="States Affected"
          value={statesAffectedCount}
          subtext="Across Indian Union"
          icon={MapPin}
          trend="Pan-India"
          colorTheme="amber"
          actionLabel="Click to open National Weather GIS Map"
          onClick={() => onNavigateTab && onNavigateTab('map')}
        />
        <MetricCard
          title="Mean AI Trust"
          value={`${avgTrust}%`}
          subtext="Multi-factor score"
          icon={Shield}
          trend="High Accuracy"
          colorTheme="purple"
          actionLabel="Click to inspect AI Trust Analytics & Models"
          onClick={() => onNavigateTab && onNavigateTab('analytics')}
        />
      </div>

      {/* Interactive In-Dashboard GIS & Live Feed Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/80 p-2.5 px-3 rounded-xl border border-slate-800 text-xs font-sans">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dashboard GIS & Feed Filter:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setDashboardFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer border ${
              dashboardFilter === 'ALL'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setDashboardFilter('VERIFIED')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              dashboardFilter === 'VERIFIED'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-emerald-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Only ({verifiedCount})
          </button>
          <button
            onClick={() => setDashboardFilter('CRITICAL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
              dashboardFilter === 'CRITICAL'
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Critical Alerts ({criticalCount})
          </button>
          <button
            onClick={() => setDashboardFilter('24H')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer border ${
              dashboardFilter === '24H'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-blue-400'
            }`}
          >
            Past 24 Hours (+{past24hCount})
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map (8 cols) + Real-Time Live Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <IndiaWeatherMap
            events={displayEvents}
            reports={displayReports}
            onSelectEvent={onSelectEvent}
            onSelectReport={onSelectReport}
          />
        </div>
        <div className="lg:col-span-4">
          <LiveFeed
            reports={displayReports}
            onSelectReport={onSelectReport}
          />
        </div>
      </div>
    </div>
  );
};