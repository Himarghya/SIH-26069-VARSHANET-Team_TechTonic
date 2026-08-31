import React from 'react';
import { Radio, ShieldCheck, MapPin, Users, Activity, ArrowUpRight } from 'lucide-react';
import { EventCluster } from '../../types';

interface EventClustersViewProps {
  events: EventCluster[];
  onSelectEvent?: (event: EventCluster) => void;
}

export const EventClustersView: React.FC<EventClustersViewProps> = ({ events, onSelectEvent }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Active Correlated Weather Event Clusters
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            AI-grouped multi-source incidents synthesizing citizen observations, meteorological radar, and news feeds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((cluster) => {
          const severityColors: Record<string, string> = {
            CRITICAL: 'from-rose-500/20 via-slate-900 to-slate-950 border-rose-500/40 text-rose-400',
            HIGH: 'from-amber-500/20 via-slate-900 to-slate-950 border-amber-500/40 text-amber-400',
            MODERATE: 'from-cyan-500/20 via-slate-900 to-slate-950 border-cyan-500/40 text-cyan-400',
            LOW: 'from-emerald-500/20 via-slate-900 to-slate-950 border-emerald-500/40 text-emerald-400'
          };
          const theme = severityColors[cluster.severity] || severityColors.MODERATE;

          return (
            <div
              key={cluster.id}
              onClick={() => onSelectEvent && onSelectEvent(cluster)}
              className={`p-5 rounded-2xl bg-gradient-to-br ${theme} border backdrop-blur-md shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300">
                    {cluster.id}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-950/80 font-mono">
                    {cluster.severity}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 leading-snug">{cluster.title}</h3>
                <p className="text-xs text-cyan-300 flex items-center gap-1 font-mono mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {cluster.city || 'District'}, {cluster.state}
                </p>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {cluster.summary || 'Correlated cross-source incident unit.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono text-[10px]">
                <div className="p-1.5 rounded-lg bg-slate-950/60">
                  <span className="text-slate-500 block">REPORTS</span>
                  <strong className="text-white text-xs">{cluster.total_reports}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/60">
                  <span className="text-slate-500 block">CITIZENS</span>
                  <strong className="text-cyan-300 text-xs">{cluster.citizen_reports_count}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-950/60">
                  <span className="text-slate-500 block">AI TRUST</span>
                  <strong className="text-emerald-400 text-xs">{cluster.overall_credibility}%</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};