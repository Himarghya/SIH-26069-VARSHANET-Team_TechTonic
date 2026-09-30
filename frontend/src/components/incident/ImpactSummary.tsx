import React from 'react';
import { Users, AlertTriangle, Building2, Home, Compass } from 'lucide-react';
import { PopulationExposure } from '../../types';

interface ImpactSummaryProps {
  exposure: PopulationExposure;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({ exposure }) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Population &amp; Demographic Exposure
        </h3>
        <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-semibold">
          Radius: {exposure.impact_radius_km} km buffer
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase block">Total Exposed</span>
          <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {exposure.total_population_exposed.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Citizens in Zone</span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
          <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase block">Vulnerable Count</span>
          <span className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">
            {exposure.vulnerable_population_exposed.toLocaleString()}
          </span>
          <span className="text-[11px] text-rose-700/80 dark:text-rose-300/80 block font-medium">Infants / Elderly / Slums</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase block">Urban Population</span>
          <span className="text-xl font-black font-mono text-cyan-600 dark:text-cyan-400">
            {exposure.urban_population.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Municipal Wards</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase block">Population Density</span>
          <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {exposure.population_density_per_sqkm.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Persons / km²</span>
        </div>
      </div>
    </div>
  );
};