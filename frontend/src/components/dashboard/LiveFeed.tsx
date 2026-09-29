import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, AlertTriangle, Clock, MapPin, Eye, Hash, Flame, Sparkles, Filter, Users, CheckCircle2, Shield } from 'lucide-react';
import { WeatherReport } from '../../types';

interface LiveFeedProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
  dashboardFilter?: 'ALL' | 'VERIFIED' | 'CRITICAL' | '24H';
  onClearDashboardFilter?: () => void;
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

export const LiveFeed: React.FC<LiveFeedProps> = ({ 
  reports = [], 
  onSelectReport,
  dashboardFilter = 'ALL',
  onClearDashboardFilter,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'citizen' | 'recent'>('all');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Tick clock every minute to keep 6-hour countdowns live and accurate
  useEffect(() => {
    const ticker = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(ticker);
  }, []);

  const SIX_HOURS_MS = 6 * 3600 * 1000;

  // Filter reports according to strict 6-hour rule
  const isReportRecent = (timestampStr: string) => {
    const repTime = parseReportTime(timestampStr);
    if (repTime === 0) return false;
    const diff = currentTime - repTime;
    return diff >= 0 && diff <= SIX_HOURS_MS;
  };

  const recentCount = reports.filter(r => isReportRecent(r.timestamp)).length;
  const verifiedCount = reports.filter(r => r.verification_status === 'VERIFIED').length;
  const citizenCount = reports.filter(r => r.source_type === 'citizen_report').length;
  const verifiedCitizenCount = reports.filter(r => r.source_type === 'citizen_report' && r.verification_status === 'VERIFIED').length;

  const displayReports = reports.filter(r => {
    if (filterMode === 'verified') return r.verification_status === 'VERIFIED';
    if (filterMode === 'citizen') return r.source_type === 'citizen_report';
    if (filterMode === 'recent') return isReportRecent(r.timestamp);
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col h-[560px] shadow-sm dark:shadow-xl font-sans">
      {/* Header */}
      <div className="flex flex-col gap-2.5 mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <Radio className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">Multi-Source Live Stream</h3>
              <span className="text-[9px] text-cyan-700 dark:text-cyan-400 font-mono font-semibold">Real-Time Ingestion & Verification</span>
            </div>
          </div>

          {verifiedCitizenCount > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px] flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{verifiedCitizenCount} Citizen Verified</span>
            </span>
          )}
        </div>

        {/* Synced Dashboard GIS Filter Indicator */}
        {dashboardFilter && dashboardFilter !== 'ALL' && (
          <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-[10px] font-mono text-cyan-900 dark:text-cyan-300">
            <span className="flex items-center gap-1.5">
              <span>
                GIS Synced: <strong className="text-slate-900 dark:text-white">
                  {dashboardFilter === 'VERIFIED' && 'Verified Incidents'}
                  {dashboardFilter === 'CRITICAL' && 'Critical Alerts'}
                  {dashboardFilter === '24H' && 'Past 24h'}
                </strong> ({reports.length} in stream)
              </span>
            </span>
            {onClearDashboardFilter && (
              <button
                onClick={onClearDashboardFilter}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline cursor-pointer text-[9px]"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {/* Stream Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 font-mono text-[10px]">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              filterMode === 'all'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setFilterMode('verified')}
            className={`px-2 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              filterMode === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Verified ({verifiedCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('citizen')}
            className={`px-2 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              filterMode === 'citizen'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Citizen ({citizenCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('recent')}
            className={`px-2 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              filterMode === 'recent'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-500" />
            <span>&lt;6h ({recentCount})</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-sans">
        {displayReports.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono space-y-2">
            <Clock className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-600 animate-pulse" />
            <p>No observations found in selected stream filter.</p>
            <button
              onClick={() => setFilterMode('all')}
              className="text-cyan-600 dark:text-cyan-400 hover:underline text-[11px] cursor-pointer"
            >
              Reset to all feeds
            </button>
          </div>
        ) : (
          displayReports.map((rep) => {
            const repTime = parseReportTime(rep.timestamp);
            const ageMs = currentTime - repTime;
            const isWithin6Hours = ageMs >= 0 && ageMs <= SIX_HOURS_MS;
            
            const remainingMs = Math.max(0, SIX_HOURS_MS - ageMs);
            const remainingHours = Math.floor(remainingMs / (3600 * 1000));
            const remainingMins = Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000));

            const isCitizen = rep.source_type === 'citizen_report';
            const isAdminVerified = rep.verification_status === 'VERIFIED';
            const isCitizenVerified = isCitizen && isAdminVerified;

            const trustPercent = typeof rep.credibility_score === 'number' 
              ? rep.credibility_score.toFixed(0) 
              : Math.round(Number(rep.credibility_score) || 0);

            return (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className={`p-3 rounded-xl transition-all cursor-pointer group border relative ${
                  isCitizenVerified
                    ? 'bg-emerald-50/90 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/80 shadow-xs dark:shadow-lg dark:shadow-emerald-950/40'
                    : isAdminVerified
                    ? 'bg-white hover:bg-emerald-50/40 dark:bg-slate-950/95 dark:hover:bg-slate-900 border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-500 shadow-xs'
                    : isCitizen
                    ? 'bg-indigo-50/80 hover:bg-indigo-100/70 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/40 border-indigo-300 dark:border-indigo-500/40 hover:border-indigo-500 shadow-xs'
                    : isWithin6Hours
                    ? 'bg-amber-50/70 hover:bg-amber-100/60 dark:bg-slate-950/95 dark:hover:bg-slate-900 border-amber-300 dark:border-amber-500/40 hover:border-amber-500 shadow-xs'
                    : 'bg-white hover:bg-slate-50 dark:bg-slate-950/60 dark:hover:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-500/40 shadow-xs'
                }`}
              >
                {/* Highlight line for admin verified citizen reports */}
                {isCitizenVerified && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-emerald-500 dark:bg-emerald-400"></div>
                )}

                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5 pl-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Verified Citizen Highlight Badge */}
                    {isCitizenVerified ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-400 text-[9px] font-mono font-extrabold flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>VERIFIED BY ADMIN (CITIZEN)</span>
                      </span>
                    ) : isAdminVerified ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[9px] font-mono font-bold flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>VERIFIED</span>
                      </span>
                    ) : isCitizen ? (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 text-[9px] font-mono font-semibold flex items-center gap-1">
                        <Users className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
                        <span>CITIZEN INTAKE</span>
                      </span>
                    ) : isWithin6Hours ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 text-[9px] font-mono font-bold flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                        <span>LATEST ({remainingHours}h {remainingMins}m left)</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-[9px] font-mono">
                        ARCHIVED
                      </span>
                    )}

                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {rep.event_type}
                    </span>
                  </div>
                  
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
                    (Number(rep.credibility_score) || 0) >= 80 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/50' :
                    (Number(rep.credibility_score) || 0) >= 60 
                      ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800/50' :
                      'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800/50'
                  }`}>
                    {trustPercent}% Trust
                  </span>
                </div>

                {/* News Headline / Content */}
                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed mb-2 pl-1.5 font-sans">
                  {rep.text}
                </p>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-200 dark:border-slate-900/80 pl-1.5">
                  <div className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400 font-semibold">
                    <MapPin className="w-3 h-3 shrink-0 text-cyan-600 dark:text-cyan-400" />
                    <span className="truncate max-w-[130px]">{rep.city || 'District'}, {rep.state}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-800 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 text-[10px]">
                    <span>{isCitizen ? `👤 Citizen (${rep.author || 'PWA'})` : (rep.source_name || rep.source_type)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
