import React from 'react';
import { Users, AlertTriangle, Building2, Home, Compass } from 'lucide-react';
import { PopulationExposure } from '../../types';

interface ImpactSummaryProps {
  exposure: PopulationExposure;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({ exposure }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-cyan-400" /> Population & Demographic Exposure
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
          Radius: {exposure.impact_radius_km} km buffer
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Exposed</span>
          <span className="text-xl font-black font-mono text-white">
            {exposure.total_population_exposed.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block font-mono">Citizens in Zone</span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40">
          <span className="text-[10px] font-bold text-rose-300 uppercase block">Vulnerable Count</span>
          <span className="text-xl font-black font-mono text-rose-400">
            {exposure.vulnerable_population_exposed.toLocaleString()}
          </span>
          <span className="text-[10px] text-rose-400/70 block font-mono">Infants / Elderly / Slums</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Urban Population</span>
          <span className="text-xl font-black font-mono text-cyan-300">
            {exposure.urban_population.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block font-mono">Municipal Wards</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Population Density</span>
          <span className="text-xl font-black font-mono text-white">
            {exposure.population_density_per_sqkm.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block font-mono">Persons / km²</span>
        </div>
      </div>
    </div>
  );
};