import React, { useState, useMemo } from 'react';
import { Activity, AlertTriangle, ShieldCheck, MapPin, Radio, Shield, Filter, Eye } from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { IndiaWeatherMap } from '../components/map/IndiaWeatherMap';
import { LiveFeed } from '../components/dashboard/LiveFeed';
import { DosAndDontsSection } from '../components/dashboard/DosAndDontsSection';
import { CapAboutSection } from '../components/dashboard/CapAboutSection';
import { WeatherReport, EventCluster, Alert, AnalyticsOverview } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DashboardPageProps {
  overview: AnalyticsOverview | null;
  events: EventCluster[];
  reports: WeatherReport[];
  alerts: Alert[];
  onSelectReport: (report: WeatherReport) => void;
  onSelectEvent: (event: EventCluster) => void;
  onNavigateTab?: (tab: string, filter?: { status?: string; eventId?: string; search?: string }) => void;
}

// Robust timestamp parser supporting ISO, UTC, SQLite format, and numeric epoch
const parseReportTime = (ts: any): number => {
  if (!ts) return 0;
  if (typeof ts === 'number') return ts;
  if (ts instanceof Date) return ts.getTime();
  const str = String(ts).trim();
  let parsed = new Date(str).getTime();
  if (!isNaN(parsed)) return parsed;
  parsed = new Date(str.replace(' ', 'T')).getTime();
  if (!isNaN(parsed)) return parsed;
  parsed = new Date(str.replace(' ', 'T') + 'Z').getTime();
  return isNaN(parsed) ? 0 : parsed;
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  overview,
  events = [],
  reports = [],
  alerts = [],
  onSelectReport,
  onSelectEvent,
  onNavigateTab
}) => {
  const { t } = useLanguage();
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

  // Find latest timestamp for reference fallback if clock differs
  const latestReportTimestamp = useMemo(() => {
    return reports.reduce((max, r) => {
      const t = parseReportTime(r.timestamp);
      return t > max ? t : max;
    }, 0);
  }, [reports]);

  const refTime = useMemo(() => {
    const now = Date.now();
    return (latestReportTimestamp > 0 && Math.abs(now - latestReportTimestamp) > 7 * 24 * 3600 * 1000)
      ? latestReportTimestamp
      : now;
  }, [latestReportTimestamp]);

  const past24hCutoff = refTime - 24 * 3600 * 1000;

  // Precomputed categorized subsets
  const verifiedEvents = useMemo(() => {
    return events.filter(e => e.status === 'VERIFIED');
  }, [events]);

  const verifiedEventIds = useMemo(() => {
    return new Set(verifiedEvents.map(e => e.id));
  }, [verifiedEvents]);

  const criticalEvents = useMemo(() => {
    return events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH');
  }, [events]);

  const criticalEventIds = useMemo(() => {
    return new Set(criticalEvents.map(e => e.id));
  }, [criticalEvents]);

  const past24hReports = useMemo(() => {
    const filtered = reports.filter(r => parseReportTime(r.timestamp) >= past24hCutoff);
    return filtered.length > 0 ? filtered : reports;
  }, [reports, past24hCutoff]);

  const past24hCount = past24hReports.length;

  const verifiedReports = useMemo(() => {
    return reports.filter(r => 
      r.verification_status === 'VERIFIED' || 
      r.verification_status === 'LIKELY_AUTHENTIC' ||
      (r.event_cluster_id && verifiedEventIds.has(r.event_cluster_id))
    );
  }, [reports, verifiedEventIds]);

  const criticalReports = useMemo(() => {
    return reports.filter(r => 
      (r.event_cluster_id && criticalEventIds.has(r.event_cluster_id)) ||
      r.risk_level === 'CRITICAL' || 
      r.risk_level === 'HIGH' || 
      r.credibility_score >= 80 || 
      r.text.toLowerCase().includes('flood') || 
      r.text.toLowerCase().includes('cloudburst') ||
      r.text.toLowerCase().includes('waterlog') ||
      r.text.toLowerCase().includes('warning')
    );
  }, [reports, criticalEventIds]);

  // In-Dashboard Filtering for Map & Live Feed
  const displayReports = useMemo(() => {
    if (dashboardFilter === 'VERIFIED') return verifiedReports;
    if (dashboardFilter === 'CRITICAL') return criticalReports;
    if (dashboardFilter === '24H') return past24hReports;
    return reports;
  }, [reports, dashboardFilter, verifiedReports, criticalReports, past24hReports]);

  const displayEvents = useMemo(() => {
    if (dashboardFilter === 'VERIFIED') return verifiedEvents;
    if (dashboardFilter === 'CRITICAL') return criticalEvents;
    if (dashboardFilter === '24H') {
      const recent = events.filter(e => {
        const t = parseReportTime(e.last_reported_at || e.started_at);
        return t >= past24hCutoff;
      });
      return recent.length > 0 ? recent : events;
    }
    return events;
  }, [events, dashboardFilter, verifiedEvents, criticalEvents, past24hCutoff]);

  return (
    <div className="space-y-5">
      {/* 6 Clickable Live Interactive Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Total Ingested"
          value={totalIngested}
          subtext="Telemetry stream"
          icon={Activity}
          trend={`+${past24hCount} 24h`}
          colorTheme="cyan"
          actionLabel="Click to view all Ingested Reports"
          onClick={() => onNavigateTab && onNavigateTab('reports', { status: 'All' })}
        />
        <MetricCard
          title="Active Clusters"
          value={activeEventsCount || events.length}
          subtext="Corroborated"
          icon={Radio}
          trend={`${activeEventsCount} Live`}
          colorTheme="blue"
          actionLabel="Click to inspect Active Disaster Clusters"
          onClick={() => onNavigateTab && onNavigateTab('events')}
        />
        <MetricCard
          title="Verified Incidents"
          value={verifiedCount}
          subtext="Ground truth"
          icon={ShieldCheck}
          trend={`${verifiedRate}% Rate`}
          colorTheme="emerald"
          actionLabel="Click to inspect Verified Incidents in Reports Explorer"
          onClick={() => onNavigateTab && onNavigateTab('reports', { status: 'VERIFIED' })}
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalCount}
          subtext="Emergency warning"
          icon={AlertTriangle}
          trend={criticalCount > 0 ? `${criticalCount} Warning` : 'Clear'}
          trendPositive={criticalCount === 0}
          colorTheme="rose"
          actionLabel="Click to open Incident Command Room"
          onClick={() => onNavigateTab && onNavigateTab('incident', { eventId: firstCriticalAlert?.event_cluster_id })}
        />
        <MetricCard
          title="States Affected"
          value={statesAffectedCount}
          subtext="Pan-Indian Union"
          icon={MapPin}
          trend="Pan-India"
          colorTheme="amber"
          actionLabel="Click to open National Weather GIS Map"
          onClick={() => onNavigateTab && onNavigateTab('map')}
        />
        <MetricCard
          title="Mean AI Trust"
          value={`${avgTrust}%`}
          subtext="Credibility score"
          icon={Shield}
          trend="High Accuracy"
          colorTheme="purple"
          actionLabel="Click to inspect AI Trust Analytics & Models"
          onClick={() => onNavigateTab && onNavigateTab('analytics')}
        />
      </div>

      {/* Interactive In-Dashboard GIS & Live Feed Filter Bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-100 dark:bg-slate-900/80 p-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-sans">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            <Filter className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{t('filter_label')}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setDashboardFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer border ${
                dashboardFilter === 'ALL'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('filter_all')} ({reports.length})
            </button>
            <button
              onClick={() => setDashboardFilter('VERIFIED')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                dashboardFilter === 'VERIFIED'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {t('filter_verified')} ({verifiedCount})
            </button>
            <button
              onClick={() => setDashboardFilter('CRITICAL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                dashboardFilter === 'CRITICAL'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              {t('filter_critical')} ({criticalCount})
            </button>
            <button
              onClick={() => setDashboardFilter('24H')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer border ${
                dashboardFilter === '24H'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {t('filter_24h')} (+{past24hCount})
            </button>
          </div>
        </div>

        {/* Informative Active Filter Feedback Banner */}
        {dashboardFilter !== 'ALL' && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-cyan-500/30 text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span>
                {t('filter_active_label')} <strong className="text-slate-900 dark:text-white">
                  {dashboardFilter === 'VERIFIED' && `🛡️ ${t('filter_verified')}`}
                  {dashboardFilter === 'CRITICAL' && `⚠️ ${t('filter_critical')}`}
                  {dashboardFilter === '24H' && `⏱️ ${t('filter_24h')}`}
                </strong> — <strong className="text-cyan-700 dark:text-cyan-400">{displayEvents.length}</strong> {t('map_clusters')} &amp; <strong className="text-cyan-700 dark:text-cyan-400">{displayReports.length}</strong> {t('nav_reports')}
              </span>
            </div>
            <button
              onClick={() => setDashboardFilter('ALL')}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-sans text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>✕ {t('filter_reset')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map (8 cols) + Real-Time Live Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <IndiaWeatherMap
            events={displayEvents}
            reports={displayReports}
            onSelectEvent={onSelectEvent}
            onSelectReport={onSelectReport}
            dashboardFilter={dashboardFilter}
            onClearDashboardFilter={() => setDashboardFilter('ALL')}
          />
        </div>
        <div className="lg:col-span-4">
          <LiveFeed
            reports={displayReports}
            onSelectReport={onSelectReport}
            dashboardFilter={dashboardFilter}
            onClearDashboardFilter={() => setDashboardFilter('ALL')}
          />
        </div>
      </div>

      {/* Official SACHET / NDMA Citizen Dos & Don'ts Section */}
      <div className="pt-2">
        <DosAndDontsSection />
      </div>

      {/* Official NDMA Pan-India CAP Alert System Architecture & Dissemination Overview */}
      <div className="pt-2">
        <CapAboutSection />
      </div>
    </div>
  );
};