import React, { useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle, BarChart3, CheckCircle2, ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles } from 'lucide-react';
import { fetchVayuScoreShap } from '../../services/api';

export const ShapWaterfallInspector: React.FC = () => {
  const [reportText, setReportText] = useState('Water has crossed the road near Andheri station');
  const [independentReports, setIndependentReports] = useState(4);
  const [rainfallRate, setRainfallRate] = useState(48.0);
  const [imageAuth, setImageAuth] = useState(92.0);
  const [sourceReliability, setSourceReliability] = useState(94.0);

  const [shapData, setShapData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadShap = async () => {
    setLoading(true);
    try {
      const data = await fetchVayuScoreShap({
        report_text: reportText,
        independent_reports_count: independentReports,
        rainfall_correlation_rate: rainfallRate,
        image_authenticity_score: imageAuth,
        source_reliability_score: sourceReliability,
        geographic_consistency_km: 0.4,
        temporal_window_minutes: 18
      });
      setShapData(data);
    } catch (err) {
      console.error('SHAP API error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShap();
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Explainable ML for VayuScore™ (TreeSHAP Feature Attribution)
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Trained Gradient Boosted Trees &bull; Transparent Feature Attribution Waterfall
            </p>
          </div>
        </div>

        <button
          onClick={loadShap}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Recalculate SHAP Decomposition</span>
        </button>
      </div>

      {/* Primary Score Summary Banner */}
      {shapData && (
        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex items-center justify-between flex-wrap gap-4 shadow-inner">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
              Trained Model VayuScore™ Output
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black font-mono text-cyan-400">
                {shapData.vayu_score}
              </span>
              <span className="text-xs font-mono text-slate-400">
                / 100 &bull; Base Prior: <strong className="text-white">E[f(x)] = {shapData.base_value}</strong>
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verdict: {shapData.verdict} (Sum SHAP: +{shapData.sum_shap_deltas})</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 max-w-md">
            <strong className="text-cyan-400 block mb-0.5">Defensible to Audit Authorities:</strong>
            {shapData.defensibility_statement}
          </div>
        </div>
      )}

      {/* SHAP Waterfall Bars List */}
      {shapData && shapData.shap_waterfall && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            SHAP Waterfall Decomposition (Why did the model assign {shapData.vayu_score}?):
          </h4>

          <div className="space-y-2">
            {shapData.shap_waterfall.map((item: any, idx: number) => {
              const widthPct = Math.min(100, (item.val_num / 25) * 100);
              return (
                <div
                  key={idx}
                  className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-[10px] font-bold border border-cyan-800">
                        {idx + 1}
                      </span>
                      <strong className="text-white">{item.feature}</strong>
                      <span className="text-slate-500 text-[11px]">({item.raw_value})</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{item.shap_value} pts</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>

                  {/* Explanation text */}
                  <p className="text-[11px] text-slate-400 font-sans">
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