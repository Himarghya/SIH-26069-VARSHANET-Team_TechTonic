import React from 'react';
import { Building2, ShieldAlert, HeartPulse, GraduationCap, Train, Waves, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { InfrastructureRisk } from '../../types';

interface InfrastructureRiskPanelProps {
  infrastructure: InfrastructureRisk;
}

export const InfrastructureRiskPanel: React.FC<InfrastructureRiskPanelProps> = ({ infrastructure }) => {
  const getIcon = (type: string) => {
    const t = (type || '').toUpperCase();
    if (t.includes('HOSPITAL')) return HeartPulse;
    if (t.includes('SCHOOL') || t.includes('COLLEGE')) return GraduationCap;
    if (t.includes('RAILWAY') || t.includes('TRAIN') || t.includes('STATION')) return Train;
    if (t.includes('BRIDGE') || t.includes('RIVER') || t.includes('DRAINAGE')) return Waves;
    return Building2;
  };

  const atRiskAssets = infrastructure?.at_risk_assets || [];
  const riskScore = infrastructure?.infrastructure_risk_score ?? 0;

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Critical Infrastructure Inundation Risk
        </h3>
        <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50">
          Risk Index: <strong className="font-mono">{riskScore}</strong> / 100
        </span>
      </div>

      {atRiskAssets.length === 0 ? (
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-2 my-auto">
          <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            No Critical Assets at High Inundation Risk
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            All regional hospitals, arterial flyovers, and rail nodes within the 25km buffer remain structurally uncompromised.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {atRiskAssets.map((asset, idx) => {
            const Icon = getIcon(asset.type);
            const isHighRisk = asset.asset_risk_score >= 70;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 shadow-xs transition-all ${
                  isHighRisk
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 hover:border-rose-300 dark:hover:border-rose-700'
                    : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    isHighRisk
                      ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate" title={asset.name}>
                      {asset.name}
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <span>{asset.type.replace(/_/g, ' ')}</span>
                      <span>•</span>
                      <span>{asset.distance_km} km away</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-mono font-bold block ${
                    isHighRisk ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    {asset.asset_risk_score} Risk
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {(asset.vulnerability * 100).toFixed(0)}% Vuln
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
        <span>GIS PostGIS Terrain Proximity Buffer: 25 km</span>
        <span>{atRiskAssets.length} Monitored Assets</span>
      </div>
    </div>
  );
};