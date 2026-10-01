import React, { useState, useMemo } from 'react';
import {
  Radio,
  MapPin,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Activity,
  Users,
  Clock,
  CloudRain,
  Wind,
  Flame,
  Waves,
  Zap,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { EventCluster } from '../../types';

interface EventClustersViewProps {
  events: EventCluster[];
  onSelectEvent?: (event: EventCluster) => void;
}

type SortOption = 'SEVERITY' | 'REPORTS' | 'TRUST' | 'NEWEST';

// Helper to get hazard icon according to event type or title
const getHazardIcon = (type?: string, title?: string) => {
  const text = `${type || ''} ${title || ''}`.toLowerCase();
  if (text.includes('rain') || text.includes('downpour')) return CloudRain;
  if (text.includes('flood') || text.includes('water') || text.includes('surge')) return Waves;
  if (text.includes('cyclone') || text.includes('storm') || text.includes('wind') || text.includes('gale')) return Wind;
  if (text.includes('fire') || text.includes('heat') || text.includes('burn')) return Flame;
  if (text.includes('lightning') || text.includes('thunder') || text.includes('power')) return Zap;
  return AlertCircle;
};

export const EventClustersView: React.FC<EventClustersViewProps> = ({ events, onSelectEvent }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('SEVERITY');

  // Dynamic statistics
  const totalClusters = events.length;
  const criticalCount = events.filter(e => e.severity === 'CRITICAL').length;
  const highCount = events.filter(e => e.severity === 'HIGH').length;
  const moderateCount = events.filter(e => e.severity === 'MODERATE').length;
  const lowCount = events.filter(e => e.severity === 'LOW').length;
  const totalUnderlyingReports = events.reduce((acc, e) => acc + (e.total_reports || 0), 0);
  const totalCitizenReports = events.reduce((acc, e) => acc + (e.citizen_reports_count || 0), 0);

  const severityOrder: Record<string, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MODERATE: 2,
    LOW: 1
  };

  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter(e => {
      const matchesSeverity = selectedSeverity === 'ALL' || e.severity === selectedSeverity;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = term === '' ||
        e.id.toLowerCase().includes(term) ||
        e.title.toLowerCase().includes(term) ||
        (e.city && e.city.toLowerCase().includes(term)) ||
        (e.state && e.state.toLowerCase().includes(term)) ||
        (e.event_type && e.event_type.toLowerCase().includes(term)) ||
        (e.summary && e.summary.toLowerCase().includes(term));
      return matchesSeverity && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'SEVERITY') {
        const diff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
        if (diff !== 0) return diff;
        return (b.total_reports || 0) - (a.total_reports || 0);
      }
      if (sortBy === 'REPORTS') {
        return (b.total_reports || 0) - (a.total_reports || 0);
      }
      if (sortBy === 'TRUST') {
        return (b.overall_credibility || 0) - (a.overall_credibility || 0);
      }
      if (sortBy === 'NEWEST') {
        const timeA = new Date(a.last_reported_at || a.started_at || 0).getTime();
        const timeB = new Date(b.last_reported_at || b.started_at || 0).getTime();
        return timeB - timeA;
      }
      return 0;
    });
  }, [events, selectedSeverity, searchTerm, sortBy]);

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Mission Control Header Bar */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        {/* Subtle Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cyan-500/5 via-blue-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Disaster Event Clusters
                </h1>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Fusion Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Spatiotemporal sensor fusion correlating cross-channel telemetry, weather radar, and citizen ground reports into unified incident clusters.
              </p>
            </div>
          </div>

          {/* Key Intelligence Stats Bar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Clusters</span>
              <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">{totalClusters} Active</span>
            </div>

            <div className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">High/Critical</span>
              <span className="text-base font-bold text-rose-600 dark:text-rose-400 tabular-nums">{criticalCount + highCount} Hotspots</span>
            </div>

            <div className="px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Corroborated</span>
              <span className="text-base font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">{totalUnderlyingReports} Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Severity Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All', count: totalClusters, color: 'text-slate-700 dark:text-slate-300' },
            { id: 'CRITICAL', label: 'Critical', count: criticalCount, badgeBg: 'bg-rose-500 text-white', color: 'text-rose-600 dark:text-rose-400' },
            { id: 'HIGH', label: 'High', count: highCount, badgeBg: 'bg-amber-500 text-white', color: 'text-amber-600 dark:text-amber-400' },
            { id: 'MODERATE', label: 'Moderate', count: moderateCount, badgeBg: 'bg-cyan-600 text-white', color: 'text-cyan-600 dark:text-cyan-400' },
            { id: 'LOW', label: 'Low', count: lowCount, badgeBg: 'bg-emerald-600 text-white', color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((tab) => {
            const isSelected = selectedSeverity === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSeverity(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-cyan-600 dark:text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold tabular-nums ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Sort & Search */}
        <div className="flex items-center gap-2.5">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 hidden sm:inline font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort event clusters"
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="SEVERITY">Severity Priority</option>
              <option value="REPORTS">Most Reports</option>
              <option value="TRUST">Highest AI Trust</option>
              <option value="NEWEST">Recently Reported</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] sm:min-w-[260px] w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city, state, disaster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Cluster Cards Grid */}
      {filteredAndSortedEvents.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Event Clusters Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto mb-4">
            No active disaster clusters match the current filter or search criteria.
          </p>
          <button
            onClick={() => { setSelectedSeverity('ALL'); setSearchTerm(''); }}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredAndSortedEvents.map((cluster) => {
            const isCritical = cluster.severity === 'CRITICAL';
            const isHigh = cluster.severity === 'HIGH';
            const isModerate = cluster.severity === 'MODERATE';

            const HazardIcon = getHazardIcon(cluster.event_type, cluster.title);

            // Severity Top Bar & Glow Accents
            const topBarGradient = isCritical
              ? 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-600'
              : isHigh
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
              : isModerate
              ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-600'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600';

            const cardBorder = isCritical
              ? 'border-rose-300/80 dark:border-rose-900/60 hover:border-rose-500 dark:hover:border-rose-500/80 hover:shadow-rose-500/10'
              : isHigh
              ? 'border-amber-300/80 dark:border-amber-900/60 hover:border-amber-500 dark:hover:border-amber-500/80 hover:shadow-amber-500/10'
              : isModerate
              ? 'border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/70 hover:shadow-cyan-500/10'
              : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/70 hover:shadow-emerald-500/10';

            const severityBadge = isCritical
              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
              : isHigh
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
              : isModerate
              ? 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-800'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';

            const severityDot = isCritical
              ? 'bg-rose-500 shadow-rose-500/50'
              : isHigh
              ? 'bg-amber-500 shadow-amber-500/50'
              : isModerate
              ? 'bg-cyan-500 shadow-cyan-500/50'
              : 'bg-emerald-500 shadow-emerald-500/50';

            // AI Trust Color styling
            const trustScore = cluster.overall_credibility || 0;
            const trustColor = trustScore >= 80
              ? 'text-emerald-600 dark:text-emerald-400'
              : trustScore >= 50
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-rose-600 dark:text-rose-400';

            const trustBg = trustScore >= 80
              ? 'bg-emerald-500'
              : trustScore >= 50
              ? 'bg-amber-500'
              : 'bg-rose-500';

            return (
              <div
                key={cluster.id}
                onClick={() => onSelectEvent && onSelectEvent(cluster)}
                className={`relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border ${cardBorder} shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group`}
              >
                {/* Top Severity Indicator Stripe */}
                <div className={`h-1.5 w-full ${topBarGradient}`} />

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header Row: ID + Hazard Type + Severity Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          {cluster.id}
                        </span>
                        {cluster.event_type && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/60 capitalize">
                            <HazardIcon className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                            {cluster.event_type.replace('_', ' ')}
                          </span>
                        )}
                      </div>

                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border font-mono tracking-wider shadow-xs ${severityBadge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${severityDot} ${isCritical ? 'animate-ping' : ''}`} />
                        {cluster.severity}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {cluster.title}
                    </h3>

                    {/* Location Tag */}
                    <div className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5 font-mono mb-2.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                      <span>{cluster.city || 'District Area'}, {cluster.state}</span>
                    </div>

                    {/* Summary Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {cluster.summary || 'Correlated cross-source incident unit aggregated from real-time streams.'}
                    </p>
                  </div>

                  {/* Corroboration Metrics & Action Footer */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    {/* 3 Corroboration Data Metric Tiles */}
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      {/* Total Reports */}
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                          <Activity className="w-3 h-3" />
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">REPORTS</span>
                        </div>
                        <strong className="text-slate-900 dark:text-white text-sm font-black tabular-nums">
                          {cluster.total_reports}
                        </strong>
                      </div>

                      {/* Citizen Reports */}
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                          <Users className="w-3 h-3 text-cyan-500" />
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">CITIZENS</span>
                        </div>
                        <strong className="text-cyan-600 dark:text-cyan-400 text-sm font-black tabular-nums">
                          {cluster.citizen_reports_count}
                        </strong>
                      </div>

                      {/* AI Trust Score */}
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">AI TRUST</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <strong className={`text-sm font-black tabular-nums ${trustColor}`}>
                            {trustScore}%
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Trust Meter Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${trustBg}`}
                        style={{ width: `${Math.min(100, Math.max(5, trustScore))}%` }}
                      />
                    </div>

                    {/* Command Room Action Button / Callout */}
                    <div className="flex items-center justify-between pt-1 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-125 transition-transform" />
                        Open Command Room & SitRep
                      </span>
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-cyan-600 group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};