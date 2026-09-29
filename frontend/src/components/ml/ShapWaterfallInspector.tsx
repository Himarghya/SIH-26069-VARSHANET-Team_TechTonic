import React, { useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle, BarChart3, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles, Sliders, Layers } from 'lucide-react';
import { fetchVayuScoreShap } from '../../services/api';

export interface ShapWaterfallInspectorProps {
  reportText?: string;
  credibilityScore?: number;
  isFake?: boolean;
  corroboratingCount?: number;
  rainfallRate?: number;
  imageAuth?: number;
  sourceReliability?: number;
  reportId?: string;
  isEmbeddedInModal?: boolean;
}

export const ShapWaterfallInspector: React.FC<ShapWaterfallInspectorProps> = ({
  reportText: initialReportText,
  credibilityScore,
  isFake = false,
  corroboratingCount,
  rainfallRate: initialRainfallRate,
  imageAuth: initialImageAuth,
  sourceReliability: initialSourceReliability,
  reportId,
  isEmbeddedInModal = false
}) => {
  // Compute contextual defaults based on report metadata
  const defaultText = initialReportText || 'Water has crossed the road near Andheri station';
  const defaultReports = corroboratingCount ?? (credibilityScore && credibilityScore > 75 ? 4 : (isFake ? 1 : 2));
  const defaultRainfall = initialRainfallRate ?? (isFake ? 1.5 : (credibilityScore && credibilityScore > 70 ? 46.0 : 18.0));
  const defaultImageAuth = initialImageAuth ?? (isFake ? 18.0 : (credibilityScore && credibilityScore > 70 ? 92.0 : 62.0));
  const defaultSourceRel = initialSourceReliability ?? (isFake ? 24.0 : (credibilityScore && credibilityScore > 70 ? 94.0 : 76.0));

  const [reportText, setReportText] = useState(defaultText);
  const [independentReports, setIndependentReports] = useState(defaultReports);
  const [rainfallRate, setRainfallRate] = useState(defaultRainfall);
  const [imageAuth, setImageAuth] = useState(defaultImageAuth);
  const [sourceReliability, setSourceReliability] = useState(defaultSourceRel);
  const [showSliders, setShowSliders] = useState(!isEmbeddedInModal);

  const [shapData, setShapData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Synchronize with prop changes if the user selects a new report
  useEffect(() => {
    if (initialReportText) setReportText(initialReportText);
    setIndependentReports(defaultReports);
    setRainfallRate(defaultRainfall);
    setImageAuth(defaultImageAuth);
    setSourceReliability(defaultSourceRel);
  }, [initialReportText, credibilityScore, isFake, corroboratingCount, initialRainfallRate, initialImageAuth, initialSourceReliability]);

  const loadShap = async (targetCredOverride?: number) => {
    setLoading(true);
    try {
      const data = await fetchVayuScoreShap({
        report_text: reportText,
        independent_reports_count: independentReports,
        rainfall_correlation_rate: rainfallRate,
        image_authenticity_score: imageAuth,
        source_reliability_score: sourceReliability,
        target_credibility: targetCredOverride !== undefined ? targetCredOverride : credibilityScore
      });
      setShapData(data);
    } catch (err) {
      console.error('Error fetching SHAP waterfall', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShap();
  }, [independentReports, rainfallRate, imageAuth, sourceReliability, reportText, credibilityScore]);

  const applyPreset = (preset: 'verified' | 'moderate' | 'fake') => {
    if (preset === 'verified') {
      setIndependentReports(5);
      setRainfallRate(52.0);
      setImageAuth(95.0);
      setSourceReliability(98.0);
    } else if (preset === 'moderate') {
      setIndependentReports(2);
      setRainfallRate(14.0);
      setImageAuth(70.0);
      setSourceReliability(75.0);
    } else {
      setIndependentReports(1);
      setRainfallRate(0.0);
      setImageAuth(12.0);
      setSourceReliability(25.0);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs dark:shadow-xl space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span>Explainable ML for VayuScore™</span>
              {reportId && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-cyan-800 dark:text-cyan-300 border border-slate-300 dark:border-slate-700 font-mono">
                  Report #{reportId}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Dynamic Gradient Boosted TreeSHAP Waterfall | 6-Vector Attribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEmbeddedInModal && (
            <button
              onClick={() => setShowSliders(!showSliders)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{showSliders ? 'Hide Sliders' : 'Simulate Features'}</span>
            </button>
          )}

          <button
            onClick={() => loadShap()}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Selector Buttons (Always available when simulating or standalone) */}
      {showSliders && (
        <div className="p-4 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Instant Scenario Simulators (Inspect How VayuScore™ Changes):
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('verified')}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Disaster (5 Sources | Doppler Match)</span>
            </button>

            <button
              onClick={() => applyPreset('moderate')}
              className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Emerging / Moderate (2 Sources | Light Rain)</span>
            </button>

            <button
              onClick={() => applyPreset('fake')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700/60 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Fake / Recycled Photo Hoax (0 Rain | Low Trust)</span>
            </button>
          </div>

          {/* Feature Range Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="space-y-1 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Independent Reports</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-bold">{independentReports}</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={independentReports}
                onChange={(e) => setIndependentReports(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Rainfall Correlation</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-bold">{rainfallRate} mm/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                step="1"
                value={rainfallRate}
                onChange={(e) => setRainfallRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Vision Authenticity</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-bold">{imageAuth}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="98"
                step="1"
                value={imageAuth}
                onChange={(e) => setImageAuth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Source Reliability</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-bold">{sourceReliability}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="99"
                step="1"
                value={sourceReliability}
                onChange={(e) => setSourceReliability(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Primary Score Summary Banner */}
      {shapData && (
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4 shadow-xs dark:shadow-inner">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
              Dynamic VayuScore™ Verification Rating
            </span>
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl font-black font-mono ${
                shapData.vayu_score >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
                shapData.vayu_score >= 50 ? 'text-cyan-600 dark:text-cyan-400' :
                shapData.vayu_score >= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {shapData.vayu_score}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                / 100 | Baseline Prior: <strong className="text-slate-900 dark:text-white">E[f(x)] = {shapData.base_value}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                shapData.vayu_score >= 75 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60' :
                shapData.vayu_score >= 50 ? 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-700/60' :
                shapData.vayu_score >= 30 ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/60' :
                'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/60'
              }`}>
                {shapData.vayu_score >= 75 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>Verdict: {shapData.verdict}</span>
              </span>

              <span className={`text-xs font-mono font-bold ${
                shapData.sum_shap_deltas.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                (Total Net SHAP: {shapData.sum_shap_deltas} pts)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 max-w-md shadow-xs">
            <strong className="text-cyan-700 dark:text-cyan-400 block mb-0.5 font-bold">Defensible to Incident Authorities:</strong>
            {shapData.defensibility_statement}
          </div>
        </div>
      )}

      {/* SHAP Waterfall Bars List */}
      {shapData && shapData.shap_waterfall && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              SHAP Waterfall Decomposition (Why did the model assign {shapData.vayu_score}?):
            </h4>
            <span className="text-[11px] font-mono text-slate-500">
              f(x) = E[f(x)] + &Sigma; &phi;<sub>i</sub>
            </span>
          </div>

          <div className="space-y-2">
            {shapData.shap_waterfall.map((item: any, idx: number) => {
              const isPositive = item.val_num >= 0;
              const absVal = Math.abs(item.val_num);
              const widthPct = Math.min(100, Math.max(8, (absVal / 20) * 100));

              return (
                <div
                  key={idx}
                  className={`bg-white dark:bg-slate-950 rounded-xl p-3.5 border space-y-2 transition-colors shadow-xs ${
                    isPositive ? 'border-slate-200 hover:border-emerald-500 dark:border-slate-800 dark:hover:border-emerald-500/40' : 'border-rose-200 hover:border-rose-500 dark:border-rose-950/60 dark:hover:border-rose-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                        isPositive ? 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-800' : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
                      }`}>
                        {idx + 1}
                      </span>
                      <strong className="text-slate-900 dark:text-white">{item.feature}</strong>
                      <span className="text-slate-500 text-[11px]">({item.raw_value})</span>
                    </div>

                    <div className={`flex items-center gap-1 font-bold font-mono px-2 py-0.5 rounded text-xs border ${
                      isPositive
                        ? 'text-emerald-800 bg-emerald-50 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-950/70 dark:border-emerald-800/60'
                        : 'text-rose-800 bg-rose-50 border-rose-300 dark:text-rose-300 dark:bg-rose-950/70 dark:border-rose-800/60'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{item.shap_value} pts</span>
                    </div>
                  </div>

                  {/* Progress Bar with Positive / Negative Gradient */}
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPositive
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                          : 'bg-gradient-to-r from-amber-500 to-rose-500'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>

                  {/* Explanation text */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                    {item.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};