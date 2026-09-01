import React, { useState } from 'react';
import { Radio, ShieldCheck, AlertTriangle, Clock, MapPin, Eye, Hash, Flame, Sparkles, Filter } from 'lucide-react';
import { WeatherReport } from '../../types';

interface LiveFeedProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ reports, onSelectReport }) => {
  const [filterLatestOnly, setFilterLatestOnly] = useState(false);

  const nowMs = new Date().getTime();
  const SIX_HOURS_MS = 6 * 3600 * 1000;

  const displayReports = filterLatestOnly
    ? reports.filter(r => (nowMs - new Date(r.timestamp).getTime()) <= SIX_HOURS_MS)
    : reports;

  const latestCount = reports.filter(r => (nowMs - new Date(r.timestamp).getTime()) <= SIX_HOURS_MS).length;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px] shadow-xl">
      {/* Header with Live Status & Filter */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">Multi-Source Live Stream</h3>
            <span className="text-[9px] text-cyan-400 font-mono">30-Min Auto Ingestion</span>
          </div>
        </div>

        {/* Latest <6h Filter Toggle */}
        <button
          onClick={() => setFilterLatestOnly(!filterLatestOnly)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
            filterLatestOnly
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle news active within last 6 hours"
        >
          <Flame className={`w-3 h-3 ${filterLatestOnly ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
          <span>Latest (&lt;6h): {latestCount}</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-sans">
        {displayReports.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono">
            No breaking reports within the past 6 hours.
          </div>
        ) : (
          displayReports.map((rep) => {
            const reportAgeMs = nowMs - new Date(rep.timestamp).getTime();
            const isWithin6Hours = reportAgeMs <= SIX_HOURS_MS;
            const remainingHours = Math.max(0, Math.floor((SIX_HOURS_MS - reportAgeMs) / (3600 * 1000)));
            const remainingMins = Math.max(0, Math.floor(((SIX_HOURS_MS - reportAgeMs) % (3600 * 1000)) / (60 * 1000)));

            return (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className={`p-3 rounded-xl transition-all cursor-pointer group border ${
                  isWithin6Hours
                    ? 'bg-slate-950/90 border-indigo-900/60 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-950/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-cyan-500/40'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* 6-Hour Active Badge */}
                    {isWithin6Hours && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 text-amber-400" />
                        <span>LATEST ({remainingHours}h {remainingMins}m left)</span>
                      </span>
                    )}
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {rep.event_type}
                    </span>
                  </div>
                  
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    rep.credibility_score >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                    rep.credibility_score >= 60 ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50' :
                    'bg-rose-950 text-rose-300 border border-rose-800/50'
                  }`}>
                    {rep.credibility_score}% Trust
                  </span>
                </div>

                {/* News / Observation Headline */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2">
                  {rep.text}
                </p>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-900">
                  <div className="flex items-center gap-1 text-cyan-400">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[130px]">{rep.city || 'District'}, {rep.state}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    <span>{rep.source_name || rep.source_type}</span>
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