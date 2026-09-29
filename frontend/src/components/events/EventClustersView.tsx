import React, { useState, useMemo } from 'react';
import { Radio, MapPin, Search, Filter, ShieldCheck, AlertTriangle, ArrowRight, Activity, Users, Shield, Clock } from 'lucide-react';
import { EventCluster } from '../../types';

interface EventClustersViewProps {
  events: EventCluster[];
  onSelectEvent?: (event: EventCluster) => void;
}

export const EventClustersView: React.FC<EventClustersViewProps> = ({ events, onSelectEvent }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Dynamic statistics
  const totalClusters = events.length;
  const criticalCount = events.filter(e => e.severity === 'CRITICAL').length;
  const highCount = events.filter(e => e.severity === 'HIGH').length;
  const moderateCount = events.filter(e => e.severity === 'MODERATE').length;
  const lowCount = events.filter(e => e.severity === 'LOW').length;
  const totalUnderlyingReports = events.reduce((acc, e) => acc + (e.total_reports || 0), 0);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSeverity = selectedSeverity === 'ALL' || e.severity === selectedSeverity;
      const matchesSearch = searchTerm === '' ||
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.city && e.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.state && e.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.summary && e.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSeverity && matchesSearch;
    });
  }, [events, selectedSeverity, searchTerm]);

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Header & Live Intelligence Stats Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 shadow-xs dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60 shadow-xs shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Disaster Event Clusters
              </h1>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60">
                LIVE SPATIOTEMPORAL GRID
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-source sensor fusion deduplicating raw hazard streams into verified incident units.
            </p>
          </div>
        </div>

        {/* Real-Time Quick Stats Pill */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Clusters: </span>
            <strong className="text-slate-900 dark:text-white font-bold tabular-nums">{totalClusters}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Aggregated: </span>
            <strong className="text-cyan-700 dark:text-cyan-400 font-bold tabular-nums">{totalUnderlyingReports} Reports</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
            <span className="font-bold">⚡ 99.2% Noise Filtered</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Severity Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All', count: totalClusters },
            { id: 'CRITICAL', label: 'Critical', count: criticalCount, color: 'text-rose-600 dark:text-rose-400' },
            { id: 'HIGH', label: 'High', count: highCount, color: 'text-amber-600 dark:text-amber-400' },
            { id: 'MODERATE', label: 'Moderate', count: moderateCount, color: 'text-cyan-600 dark:text-cyan-400' },
            { id: 'LOW', label: 'Low', count: lowCount, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSeverity(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedSeverity === tab.id
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                selectedSeverity === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by city, state, event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* 3. Cluster Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No event clusters match your selected filters.</p>
          <button
            onClick={() => { setSelectedSeverity('ALL'); setSearchTerm(''); }}
            className="mt-3 px-3 py-1.5 rounded-md bg-cyan-600 text-white text-xs font-bold shadow-xs cursor-pointer hover:bg-cyan-500"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((cluster) => {
            const isCritical = cluster.severity === 'CRITICAL';
            const isHigh = cluster.severity === 'HIGH';
            const isModerate = cluster.severity === 'MODERATE';

            const cardBorder = isCritical
              ? 'border-rose-200 dark:border-rose-500/30 hover:border-rose-400 shadow-rose-500/5'
              : isHigh
              ? 'border-amber-200 dark:border-amber-500/30 hover:border-amber-400 shadow-amber-500/5'
              : isModerate
              ? 'border-cyan-200 dark:border-cyan-500/30 hover:border-cyan-400 shadow-cyan-500/5'
              : 'border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 shadow-emerald-500/5';

            const badgeTheme = isCritical
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-700'
              : isHigh
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700'
              : isModerate
              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';

            return (
              <div
                key={cluster.id}
                onClick={() => onSelectEvent && onSelectEvent(cluster)}
                className={`p-4 sm:p-5 rounded-lg bg-white dark:bg-slate-900/90 border ${cardBorder} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  {/* Top Bar: Cluster ID & Severity Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {cluster.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border font-mono tracking-wider ${badgeTheme}`}>
                      {cluster.severity}
                    </span>
                  </div>

                  {/* Incident Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {cluster.title}
                  </h3>

                  {/* Location Pin */}
                  <div className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5 font-mono mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{cluster.city || 'District'}, {cluster.state}</span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {cluster.summary || 'Correlated cross-source incident unit aggregated from real-time streams.'}
                  </p>
                </div>

                {/* Bottom Section: Metrics & Action */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold">REPORTS</span>
                      <strong className="text-slate-900 dark:text-white text-sm font-bold tabular-nums">{cluster.total_reports}</strong>
                    </div>
                    <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold">CITIZENS</span>
                      <strong className="text-cyan-700 dark:text-cyan-400 text-sm font-bold tabular-nums">{cluster.citizen_reports_count}</strong>
                    </div>
                    <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold">AI TRUST</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-bold tabular-nums">{cluster.overall_credibility}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors pt-1">
                    <span>Open Command Room & SitRep</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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