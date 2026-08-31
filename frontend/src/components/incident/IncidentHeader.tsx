import React from 'react';
import { Shield, AlertCircle, Radio, Clock, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import { EventImpactResponse } from '../../types';
import { StreetViewPin } from './StreetViewPin';

interface IncidentHeaderProps {
  incident: EventImpactResponse;
}

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({ incident }) => {
  const { scores } = incident.impact_evaluation;

  const priorityColors = {
    P1: 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-rose-500/20',
    P2: 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-amber-500/20',
    P3: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-cyan-500/20',
    P4: 'bg-slate-800 text-slate-300 border-slate-700 shadow-slate-900/20',
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-800/60">
              {incident.event_id}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 uppercase">
              {incident.event_type}
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 font-sans">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {incident.city ? `${incident.city}, ${incident.state}` : incident.state}
            </span>
          </div>
          <h1 className="text-xl font-black text-white mt-1 tracking-wide">
            {incident.event_title}
          </h1>
        </div>

        {/* Pinpoint & Google Street View Integration */}
        <div className="flex items-center gap-2">
          <StreetViewPin latitude={incident.latitude} longitude={incident.longitude} size="md" />
        </div>
      </div>

      {/* The 3 Core Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
        {/* Metric 1: Evidence Confidence */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              1. Evidence Confidence
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {scores.evidence_confidence}%
              </span>
              <span className="text-[11px] text-slate-500 font-mono">/ 100</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Multi-source consensus & AWS verification
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Impact Risk */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              2. Impact Risk Index
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-rose-400">
                {scores.impact_risk}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">/ 100</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Population, rainfall & infrastructure risk
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/50 text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Response Priority */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              3. Response Priority
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-black font-mono px-3 py-0.5 rounded-lg border shadow-lg ${priorityColors[scores.response_priority]}`}>
                {scores.response_priority}
              </span>
              <span className="text-xs font-bold text-white uppercase font-sans">
                {scores.response_priority === 'P1' ? 'CRITICAL DISASTER' :
                 scores.response_priority === 'P2' ? 'HIGH PRIORITY' :
                 scores.response_priority === 'P3' ? 'MODERATE' : 'MONITOR'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Escalation Prob: {(scores.escalation_probability * 100).toFixed(0)}%
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/50 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};