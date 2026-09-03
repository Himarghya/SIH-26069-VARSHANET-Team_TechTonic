import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CloudRain, Activity, Compass, ShieldAlert, ArrowRight, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { fetchSeverityForecast, fetchAnomalyDetection } from '../../services/api';

export const SeverityForecastRadar: React.FC = () => {
  const [clusterId, setClusterId] = useState('INC-07');
  const [eventType, setEventType] = useState('Urban Flooding');
  const [currentSeverity, setCurrentSeverity] = useState('MODERATE');
  const [rainfallRate, setRainfallRate] = useState(38.0);
  const [riverTrend, setRiverTrend] = useState('RISING');
  const [reportVelocity, setReportVelocity] = useState(4.2);
  const [drainageSusceptibility, setDrainageSusceptibility] = useState(0.85);

  const [forecastResult, setForecastResult] = useState<any>(null);
  const [anomalyResult, setAnomalyResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runPrediction = async () => {
    setLoading(true);
    try {
      const [fData, aData] = await Promise.all([
        fetchSeverityForecast({
          cluster_id: clusterId,
          event_type: eventType,
          current_severity: currentSeverity,
          rainfall_rate_mmh: rainfallRate,
          river_level_trend: riverTrend,
          report_velocity_per_min: reportVelocity,
          drainage_susceptibility: drainageSusceptibility
        }),
        fetchAnomalyDetection({
          city: 'Bhopal',
          zone: 'Zone 4 - Kolar Dam Basin',
          normal_hourly_rate: 3.5,
          current_10m_reports: 142,
          rainfall_dev_zscore: 3.8
        })
      ]);
      setForecastResult(fData);
      setAnomalyResult(aData);
    } catch (err) {
      console.error('Forecasting API error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/40">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Spatio-Temporal Severity Forecasting (1h &amp; 3h Lookahead)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Predictive Disaster Escalation &bull; Unsupervised Burst Anomaly Trigger
            </p>
          </div>
        </div>

        <button
          onClick={runPrediction}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold font-mono shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          <span>Recalculate 1h/3h Projections</span>
        </button>
      </div>

      {/* Top Banner: Unsupervised Anomaly Alert */}
      {anomalyResult && (
        <div className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
          anomalyResult.is_anomaly
            ? 'bg-rose-950/60 border-rose-600/60 text-rose-100'
            : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-900/80 text-rose-200">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  Unsupervised Isolation Forest Anomaly Trigger:
                </strong>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  Score: {anomalyResult.anomaly_score} / 1.0
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Surge of <strong>{anomalyResult.signals?.surge_ratio}</strong> &bull; <strong>{anomalyResult.signals?.rainfall_z_score}</strong>
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-rose-400 bg-black/40 px-3 py-1 rounded-lg border border-rose-900/80">
            {anomalyResult.trigger_action}
          </span>
        </div>
      )}

      {/* Main Grid: Forecast Evolution */}
      {forecastResult && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left: 3-Stage Horizon Cards */}
          <div className="md:col-span-8 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Incident Cluster #{forecastResult.cluster_id} Escalation Trajectory:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stage 0: Current */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Current (0h Now)
                </span>
                <div className="text-xl font-black font-mono text-cyan-400">
                  {forecastResult.current_severity}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Risk Index: <strong className="text-white">48%</strong>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  Local arterial water accumulation.
                </div>
              </div>

              {/* Stage 1: Predicted 1h */}
              <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 space-y-2 shadow-sm">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  Predicted 1-Hour Lookahead
                </span>
                <div className="text-xl font-black font-mono text-amber-400">
                  {forecastResult.predicted_1h_severity}
                </div>
                <div className="text-xs font-mono text-amber-300">
                  Risk Index: <strong className="text-white">{forecastResult.escalation_probability_1h}%</strong>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  Water crossing subway underpasses.
                </div>
              </div>

              {/* Stage 2: Predicted 3h */}
              <div className="bg-slate-950 border border-rose-500/60 rounded-xl p-4 space-y-2 shadow-lg">
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">
                  Predicted 3-Hour Lookahead
                </span>
                <div className="text-xl font-black font-mono text-rose-400">
                  {forecastResult.predicted_3h_severity}
                </div>
                <div className="text-xs font-mono text-rose-300">
                  Risk Index: <strong className="text-white">{forecastResult.escalation_probability_3h}%</strong>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  Critical saturation; river corridor breach.
                </div>
              </div>
            </div>

            {/* Operational Advisory Alert */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs font-sans leading-relaxed">
              <strong className="font-mono text-amber-300 block mb-1">
                🛡️ Predictive Action Plan (Model Confidence: {forecastResult.model_confidence_pct}%):
              </strong>
              {forecastResult.operational_advisory}
            </div>
          </div>

          {/* Right: Driving Feature Radar Telemetry */}
          <div className="md:col-span-4 bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-xs">
            <span className="text-[10px] uppercase text-slate-500 block tracking-wider">
              Driving Predictive Features
            </span>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Rainfall Intensity:</span>
                <strong className="text-cyan-400">{forecastResult.feature_contributions?.rainfall_intensity_mmh} mm/h</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">24h Accumulation:</span>
                <strong className="text-cyan-400">{forecastResult.feature_contributions?.rainfall_accumulation_24h_mm} mm</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Radar Reflectivity:</span>
                <strong className="text-amber-400">{forecastResult.feature_contributions?.radar_reflectivity_dbz} dBZ</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">River Level Trend:</span>
                <strong className="text-rose-400">{forecastResult.feature_contributions?.river_level_trend} &uarr;</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Report Velocity:</span>
                <strong className="text-indigo-400">{forecastResult.feature_contributions?.report_velocity_per_min} reps/min</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Drainage Susceptibility:</span>
                <strong className="text-purple-400">{forecastResult.feature_contributions?.drainage_susceptibility * 100}% Basin</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};