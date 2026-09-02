import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, RefreshCw, AlertTriangle } from 'lucide-react';
import { fetchClimatologyAnomaly } from '../../services/api';
import { ClimatologyAnomalyResponse } from '../../types';

export const ClimatologyAnomalyCard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Bhopal');
  const [anomalyData, setAnomalyData] = useState<ClimatologyAnomalyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live');

  const loadData = async (city: string) => {
    setIsLoading(true);
    try {
      const data = await fetchClimatologyAnomaly(city, 118.0, 32.0);
      setAnomalyData(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Anomaly Fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedCity);
  }, [selectedCity]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/40">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              30-Year IMD Climatological Anomaly Engine
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              1991–2020 Gridded Normal Baseline Deviation (Z-Score σ)
            </p>
          </div>
        </div>

        {/* City Filter & Reload */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value="Bhopal">Bhopal</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Dehradun">Dehradun</option>
            <option value="Guwahati">Guwahati</option>
            <option value="Delhi">Delhi</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Patna">Patna</option>
            <option value="Chennai">Chennai</option>
          </select>

          <button
            onClick={() => loadData(selectedCity)}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-300 transition-all cursor-pointer border border-slate-700 flex items-center gap-1 text-[11px] font-mono"
            title="Recalculate 30-Year Anomaly"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {anomalyData && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono">
              Rainfall Deviation: <span className="text-rose-400 font-black">+{anomalyData.rain_anomaly_z_score}σ Standard Deviations</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              {anomalyData.rain_anomaly_classification}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Observed 24h Rainfall</span>
              <span className="text-xl font-black font-mono text-cyan-300">
                {anomalyData.observed_rain_mm} <span className="text-xs text-slate-400">mm</span>
              </span>
              <span className="text-[9px] text-slate-500 block font-mono mt-0.5">
                Baseline Normal: {anomalyData.historical_mean_daily_rain_mm} mm/day
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Observed Temperature</span>
              <span className="text-xl font-black font-mono text-amber-300">
                {anomalyData.observed_temp_c}°C
              </span>
              <span className="text-[9px] text-slate-500 block font-mono mt-0.5">
                Baseline Normal: {anomalyData.historical_mean_temp_c}°C
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};