import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Sparkles, CheckCircle2, AlertTriangle, Layers, Database, Cpu, Activity, RefreshCw, BarChart2 } from 'lucide-react';
import { fetchDataQualityMetrics } from '../../services/api';

export const VayuScoreAndQualityDashboard: React.FC = () => {
  const [dataQuality, setDataQuality] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchDataQualityMetrics();
      setDataQuality(res);
    } catch (err) {
      console.error('Data quality fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!dataQuality) return null;

  const { model_performance, vayu_score_metrics, source_reliability_ranking } = dataQuality;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner: VayuScore™ & Model Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* VayuScore Composite Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span>VayuScore™ Multi-Modal Metric</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                      PROPRIETARY
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fused Weather Event Confidence Index (0–100) across 5 verification vectors
                  </p>
                </div>
              </div>

              <button
                onClick={loadData}
                disabled={isLoading}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all cursor-pointer border border-slate-700 shadow-sm"
                title="Refresh VayuScore Analysis"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-4xl font-black font-mono text-cyan-300">
                {vayu_score_metrics.composite_vayuscore}
              </span>
              <span className="text-xs font-mono text-slate-400">/ 100 Composite Confidence</span>
              <span className="ml-auto text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-sm">
                ✓ HIGHLY CORROBORATED
              </span>
            </div>

            {/* 5 Sub-Vectors */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              {[
                { label: 'Source Historical Reliability', score: vayu_score_metrics.source_reliability, gradient: 'from-cyan-500 to-blue-500' },
                { label: 'Cross-Platform Corroboration', score: vayu_score_metrics.cross_platform_corroboration, gradient: 'from-indigo-500 to-purple-500' },
                { label: 'Image / Video Optical Authenticity (DHash)', score: vayu_score_metrics.image_video_authenticity, gradient: 'from-emerald-500 to-teal-500' },
                { label: 'Spatio-Temporal Physics Consistency', score: vayu_score_metrics.spatiotemporal_consistency, gradient: 'from-amber-500 to-orange-500' },
                { label: 'Community Peer Validation & Triangulation', score: vayu_score_metrics.community_validation, gradient: 'from-purple-500 to-pink-500' },
              ].map((v, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{v.label}</span>
                    <strong className="text-white font-mono text-xs">{v.score}%</strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800/80 p-0.5">
                    <div className={`h-full rounded-full bg-gradient-to-r ${v.gradient} transition-all duration-700`} style={{ width: `${v.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Performance & Precision/Recall */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/60 shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    ML Model Performance & Precision Audit
                  </h3>
                  <p className="text-xs text-slate-400">
                    Automated benchmark metrics tracking Simhash deduplication and optical accuracy
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-700/60 shadow-sm">
                F1: {model_performance.f1_score_pct}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5 shadow-sm">
                <span className="text-[10px] text-slate-500 block font-mono">PRECISION</span>
                <span className="text-lg font-black font-mono text-cyan-300">{model_performance.precision_pct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5 shadow-sm">
                <span className="text-[10px] text-slate-500 block font-mono">RECALL RATE</span>
                <span className="text-lg font-black font-mono text-indigo-300">{model_performance.recall_pct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5 shadow-sm">
                <span className="text-[10px] text-slate-500 block font-mono">SIMHASH DEDUP</span>
                <span className="text-lg font-black font-mono text-emerald-400">{model_performance.duplicate_detection_rate_pct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5 shadow-sm">
                <span className="text-[10px] text-slate-500 block font-mono">FALSE POSITIVE</span>
                <span className="text-lg font-black font-mono text-amber-400">{model_performance.false_positive_rate_pct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5 shadow-sm">
                <span className="text-[10px] text-slate-500 block font-mono">FALSE NEGATIVE</span>
                <span className="text-lg font-black font-mono text-rose-400">{model_performance.false_negative_rate_pct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5 shadow-sm">
                <span className="text-[10px] text-slate-500 block font-mono">AUDITED RECORDS</span>
                <span className="text-lg font-black font-mono text-white">{dataQuality.total_audited_records}</span>
              </div>
            </div>
          </div>

          {/* Source Reliability Ranking */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Source Reliability Hierarchy
            </span>
            <div className="space-y-1.5">
              {source_reliability_ranking.map((s: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[10px] font-bold">#{idx + 1}</span>
                    <span className="text-slate-200 font-medium">{s.source}</span>
                  </div>
                  <span className="text-cyan-300 font-mono font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                    {s.reliability}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};