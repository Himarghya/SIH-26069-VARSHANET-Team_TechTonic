import React, { useState, useEffect } from 'react';
import { Zap, Flame, ShieldAlert, CloudLightning, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchExtremeWeatherMl } from '../../services/api';
import { ExtremeWeatherMlResponse } from '../../types';

export const ExtremeWeatherAlerts: React.FC = () => {
  const [extData, setExtData] = useState<ExtremeWeatherMlResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExtremeWeatherMl({
        radar_dbz: 58.5,
        cloud_top_temp_c: -74.0,
        rainfall_rate_mmh: 75.0,
        temp_c: 44.5,
        humidity_pct: 58.0
      });
      setExtData(data);
    } catch (err) {
      console.error('Extreme ML Fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
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

        <button
          onClick={loadData}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
          title="Rerun Extreme Predictor"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
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
              <span className="text-3xl font-black font-mono text-white">
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
              <span className="text-3xl font-black font-mono text-white">
                {extData.heatwave_wbgt_prediction.heat_index_c}°C
              </span>
              <span className="text-xs text-slate-400 font-mono">Heat Index (HI)</span>
              <span className="text-xs text-orange-400 font-mono ml-auto">
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