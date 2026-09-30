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
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 h-full flex flex-col justify-between font-sans">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Spatio-Temporal Severity Forecasting (1h &amp; 3h Lookahead)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Predictive Disaster Escalation | Unsupervised Burst Anomaly Trigger
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
        <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          anomalyResult.is_anomaly
            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-600/60 text-slate-900 dark:text-rose-100'
            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300'
        }`}>
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-200 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Unsupervised Isolation Forest Anomaly Trigger:
                </strong>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shrink-0 font-bold">
                  Score: {anomalyResult.anomaly_score} / 1.0
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                Surge of <strong className="text-rose-700 dark:text-rose-300 font-mono">{anomalyResult.signals?.surge_ratio}</strong> | <strong className="text-rose-700 dark:text-rose-300 font-mono">{anomalyResult.signals?.rainfall_z_score}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-100/90 dark:bg-rose-900/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-[11px] font-mono font-bold shrink-0 self-start md:self-auto shadow-xs">
            <Zap className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="whitespace-normal sm:whitespace-nowrap">
              {anomalyResult.trigger_action ? anomalyResult.trigger_action.replace(/_/g, ' ') : 'Auto Incident Clustering Triggered'}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Forecast Evolution */}
      {forecastResult && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left: 3-Stage Horizon Cards */}
          <div className="md:col-span-8 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
              Incident Cluster #{forecastResult.cluster_id} Escalation Trajectory:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stage 0: Current */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                  Current (0h Now)
                </span>
                <div className="text-xl font-black font-mono text-cyan-600 dark:text-cyan-400">
                  {forecastResult.current_severity}
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  Risk Index: <strong className="text-slate-900 dark:text-white">48%</strong>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 font-sans">
                  Local arterial water accumulation.
                </div>
              </div>

              {/* Stage 1: Predicted 1h */}
              <div className="bg-amber-50/50 dark:bg-slate-950 border border-amber-300 dark:border-amber-500/40 rounded-xl p-4 space-y-2 shadow-sm">
                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wider block font-bold">
                  Predicted 1-Hour Lookahead
                </span>
                <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {forecastResult.predicted_1h_severity}
                </div>
                <div className="text-xs font-mono text-amber-800 dark:text-amber-300">
                  Risk Index: <strong className="text-slate-900 dark:text-white">{forecastResult.escalation_probability_1h}%</strong>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 font-sans">
                  Water crossing subway underpasses.
                </div>
              </div>

              {/* Stage 2: Predicted 3h */}
              <div className="bg-rose-50/50 dark:bg-slate-950 border border-rose-300 dark:border-rose-500/60 rounded-xl p-4 space-y-2 shadow-sm">
                <span className="text-[10px] font-mono text-rose-700 dark:text-rose-400 uppercase tracking-wider block font-bold">
                  Predicted 3-Hour Lookahead
                </span>
                <div className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">
                  {forecastResult.predicted_3h_severity}
                </div>
                <div className="text-xs font-mono text-rose-800 dark:text-rose-300">
                  Risk Index: <strong className="text-slate-900 dark:text-white">{forecastResult.escalation_probability_3h}%</strong>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 font-sans">
                  Critical saturation; river corridor breach.
                </div>
              </div>
            </div>

            {/* Operational Advisory Alert */}
            <div className="p-3.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/40 text-amber-900 dark:text-amber-200 text-xs font-sans leading-relaxed">
              <strong className="font-mono text-amber-800 dark:text-amber-300 block mb-1">
                🛡️ Predictive Action Plan (Model Confidence: {forecastResult.model_confidence_pct}%):
              </strong>
              {forecastResult.operational_advisory}
            </div>
          </div>

          {/* Right: Driving Feature Radar Telemetry */}
          <div className="md:col-span-4 bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs shadow-sm">
            <span className="text-[10px] uppercase text-slate-600 dark:text-slate-500 block tracking-wider font-semibold">
              Driving Predictive Features
            </span>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900">
                <span className="text-slate-600 dark:text-slate-400">Rainfall Intensity:</span>
                <strong className="text-cyan-600 dark:text-cyan-400">{forecastResult.feature_contributions?.rainfall_intensity_mmh} mm/h</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900">
                <span className="text-slate-600 dark:text-slate-400">24h Accumulation:</span>
                <strong className="text-cyan-600 dark:text-cyan-400">{forecastResult.feature_contributions?.rainfall_accumulation_24h_mm} mm</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900">
                <span className="text-slate-600 dark:text-slate-400">Radar Reflectivity:</span>
                <strong className="text-amber-600 dark:text-amber-400">{forecastResult.feature_contributions?.radar_reflectivity_dbz} dBZ</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900">
                <span className="text-slate-600 dark:text-slate-400">River Level Trend:</span>
                <strong className="text-rose-600 dark:text-rose-400">{forecastResult.feature_contributions?.river_level_trend} &uarr;</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900">
                <span className="text-slate-600 dark:text-slate-400">Report Velocity:</span>
                <strong className="text-indigo-600 dark:text-indigo-300">{forecastResult.feature_contributions?.report_velocity_per_min} reps/min</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Drainage Susceptibility:</span>
                <strong className="text-purple-600 dark:text-purple-400">{((forecastResult.feature_contributions?.drainage_susceptibility || 0.85) * 100).toFixed(0)}% Basin</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};