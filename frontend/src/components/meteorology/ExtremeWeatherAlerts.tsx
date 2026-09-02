import React, { useState, useEffect } from 'react';
import { Zap, Flame, ShieldAlert, CloudLightning, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchExtremeWeatherMl } from '../../services/api';
import { ExtremeWeatherMlResponse } from '../../types';

export const ExtremeWeatherAlerts: React.FC = () => {
  const [extData, setExtData] = useState<ExtremeWeatherMlResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live');
  const [reloadCount, setReloadCount] = useState<number>(0);

  const loadData = async (variationSeed = 0) => {
    setIsLoading(true);
    try {
      // Dynamic meteorological parameters on each reload
      const dbzVariations = [58.5, 61.2, 56.0, 59.8, 62.4];
      const cttVariations = [-74.0, -76.5, -71.8, -75.2, -77.1];
      const rainVariations = [75.0, 84.0, 68.0, 78.5, 92.0];
      const tempVariations = [44.5, 45.2, 43.8, 46.0, 44.1];
      const humidVariations = [58.0, 62.0, 55.0, 60.0, 64.0];

      const idx = variationSeed % dbzVariations.length;

      const data = await fetchExtremeWeatherMl({
        radar_dbz: dbzVariations[idx],
        cloud_top_temp_c: cttVariations[idx],
        rainfall_rate_mmh: rainVariations[idx],
        temp_c: tempVariations[idx],
        humidity_pct: humidVariations[idx]
      });
      setExtData(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Extreme ML Fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(0);
  }, []);

  const handleReload = () => {
    const nextSeed = reloadCount + 1;
    setReloadCount(nextSeed);
    loadData(nextSeed);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/40">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Extreme Anomaly AI Predictor (MoES ML Models)
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Cloudburst CPI & Severe Heatwave WBGT Thermal Stress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            Synced: {lastUpdated}
          </span>
          <button
            onClick={handleReload}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-300 transition-all cursor-pointer border border-slate-700 flex items-center gap-1 text-[11px] font-mono"
            title="Rerun Extreme Anomaly ML Prediction"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden md:inline">{isLoading ? 'Predicting...' : 'Reload ML'}</span>
          </button>
        </div>
      </div>

      {extData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cloudburst CPI Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-950 border border-indigo-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <CloudLightning className="w-4 h-4 text-cyan-400" /> Cloudburst Prediction Index (CPI)
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                {extData.cloudburst_prediction.alert_level}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-white transition-all">
                {extData.cloudburst_prediction.cloudburst_prediction_index}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100 CPI Score</span>
              <span className="text-xs text-amber-400 font-mono ml-auto">
                Lead Time: ~{extData.cloudburst_prediction.estimated_lead_time_minutes} mins
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-snug">
              {extData.cloudburst_prediction.meteorological_rationale}
            </p>
          </div>

          {/* Heatwave WBGT Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" /> Severe Heatwave & WBGT Index
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                {extData.heatwave_wbgt_prediction.severity_classification}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-white transition-all">
                {extData.heatwave_wbgt_prediction.heat_index_c}°C
              </span>
              <span className="text-xs text-slate-400 font-mono">Heat Index (HI)</span>
              <span className="text-xs text-rose-400 font-mono ml-auto">
                Wet-Bulb: {extData.heatwave_wbgt_prediction.wet_bulb_temperature_c}°C
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-snug">
              {extData.heatwave_wbgt_prediction.biometeorological_impact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};