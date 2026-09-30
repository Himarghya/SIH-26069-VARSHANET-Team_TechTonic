import React, { useState, useMemo } from 'react';
import { Activity, AlertTriangle, ShieldCheck, MapPin, Radio, Shield, Filter, Eye, Clock, X, Sparkles } from 'lucide-react';
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

      {/* Interactive Modern In-Dashboard GIS & Live Feed Filter Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-2 px-3 sm:px-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-sans">
        
        {/* Left: Filter Icon, Title & Live Status Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-xs">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-[13px] tracking-tight">
                {t('filter_label')}
              </span>
              {dashboardFilter !== 'ALL' && (
                <div className="flex items-center gap-1.5 animate-fadeIn">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                    <span>{displayEvents.length} {t('map_clusters')}</span>
                    <span>•</span>
                    <span>{displayReports.length} {t('nav_reports')}</span>
                  </span>
                  <button
                    onClick={() => setDashboardFilter('ALL')}
                    className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                    title="Reset Filter to All"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Segmented Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-950/80 rounded-xl border border-slate-200/90 dark:border-slate-800/90 overflow-x-auto scrollbar-none">
          
          {/* 1. All Reports */}
          <button
            onClick={() => setDashboardFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              dashboardFilter === 'ALL'
                ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 shadow-sm font-bold border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-900/50'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${dashboardFilter === 'ALL' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
            <span>{t('filter_all')}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              dashboardFilter === 'ALL'
                ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {reports.length}
            </span>
          </button>

          {/* 2. Verified Incidents */}
          <button
            onClick={() => setDashboardFilter('VERIFIED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              dashboardFilter === 'VERIFIED'
                ? 'bg-emerald-600 text-white shadow-sm font-bold shadow-emerald-900/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${dashboardFilter === 'VERIFIED' ? 'text-emerald-200' : 'text-emerald-500'}`} />
            <span>{t('filter_verified')}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              dashboardFilter === 'VERIFIED'
                ? 'bg-emerald-800/80 text-white'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            }`}>
              {verifiedCount}
            </span>
          </button>

          {/* 3. Critical Red Alerts */}
          <button
            onClick={() => setDashboardFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              dashboardFilter === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-sm font-bold shadow-rose-900/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${dashboardFilter === 'CRITICAL' ? 'text-rose-200' : 'text-rose-500'}`} />
            <span>{t('filter_critical')}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              dashboardFilter === 'CRITICAL'
                ? 'bg-rose-800/80 text-white'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
            }`}>
              {criticalCount}
            </span>
          </button>

          {/* 4. Past 24 Hours */}
          <button
            onClick={() => setDashboardFilter('24H')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              dashboardFilter === '24H'
                ? 'bg-blue-600 text-white shadow-sm font-bold shadow-blue-900/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${dashboardFilter === '24H' ? 'text-blue-200' : 'text-blue-500'}`} />
            <span>{t('filter_24h')}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              dashboardFilter === '24H'
                ? 'bg-blue-800/80 text-white'
                : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
            }`}>
              +{past24hCount}
            </span>
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