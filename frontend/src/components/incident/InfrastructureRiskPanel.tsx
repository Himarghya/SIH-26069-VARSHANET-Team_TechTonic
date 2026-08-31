import React from 'react';
import { Building2, ShieldAlert, HeartPulse, GraduationCap, Train, Anchor } from 'lucide-react';
import { InfrastructureRisk } from '../../types';

interface InfrastructureRiskPanelProps {
  infrastructure: InfrastructureRisk;
}

export const InfrastructureRiskPanel: React.FC<InfrastructureRiskPanelProps> = ({ infrastructure }) => {
  const getIcon = (type: string) => {
    if (type.includes('HOSPITAL')) return HeartPulse;
    if (type.includes('SCHOOL')) return GraduationCap;
    if (type.includes('RAILWAY') || type.includes('AIRPORT')) return Train;
    return Building2;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Critical Infrastructure Inundation Risk
        </h3>
        <span className="text-xs font-mono font-bold text-amber-400">
          Risk Index: {infrastructure.infrastructure_risk_score} / 100
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
        {infrastructure.at_risk_assets.map((asset, idx) => {
          const Icon = getIcon(asset.type);
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-slate-900 text-amber-400 border border-slate-800 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{asset.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {asset.type} • {asset.distance_km} km away
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-amber-400 block">
                  {asset.asset_risk_score} Risk
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  {(asset.vulnerability * 100).toFixed(0)}% Vuln
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};