import React from 'react';
import { Radio, ShieldCheck, AlertTriangle, Clock, MapPin, Eye, Hash } from 'lucide-react';
import { WeatherReport } from '../../types';

interface LiveFeedProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ reports, onSelectReport }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-wide">Live Multi-Source Ingestion</h3>
        </div>
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300">
          STREAM ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {reports.map((rep) => {
          const isVerified = rep.verification_status === 'VERIFIED';
          const isMisleading = rep.verification_status === 'LIKELY_MISLEADING';

          return (
            <div
              key={rep.id}
              onClick={() => onSelectReport(rep)}
              className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {rep.event_type}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    {rep.source_name || rep.source_type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    rep.credibility_score >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                    rep.credibility_score >= 60 ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50' :
                    'bg-rose-950 text-rose-300 border border-rose-800/50'
                  }`}>
                    {rep.credibility_score}% AI Trust
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2">
                {rep.text}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{rep.city || 'Region'}, {rep.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  {rep.is_duplicate && (
                    <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                      <Hash className="w-3 h-3" /> Near-Dup ({rep.duplicate_count})
                    </span>
                  )}
                  <span>{new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};