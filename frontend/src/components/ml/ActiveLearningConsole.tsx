import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, UserCheck, Shield, Award, BarChart, Database, Sparkles, Send } from 'lucide-react';
import { fetchActiveLearningTelemetry, submitActiveLearningFeedback, fetchDynamicSources } from '../../services/api';

export const ActiveLearningConsole: React.FC = () => {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tData, sData] = await Promise.all([
        fetchActiveLearningTelemetry(),
        fetchDynamicSources()
      ]);
      setTelemetry(tData);
      setSources(sData);
    } catch (err) {
      console.error('Active learning error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateReview = async (label: string) => {
    try {
      await submitActiveLearningFeedback({
        report_id: `rep_${Date.now()}`,
        human_label: label,
        initial_confidence: 64.0,
        reviewer_notes: 'Verified against local municipal telemetry'
      });
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 3000);
      loadData();
    } catch (err) {
      console.error('Feedback error', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card: Active Learning Pipeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/40">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Active Learning &amp; Online Fine-Tuning Loop
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Human-in-the-Loop Decisions &bull; Uncertainty Sampling &bull; Continual Model Evolution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
              Epoch 14 Converged (F1: 0.965)
            </span>
          </div>
        </div>

        {/* Telemetry Metrics */}
        {telemetry && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Total Labeled Samples</span>
              <div className="text-2xl font-bold text-white mt-1">
                {telemetry.total_active_learning_samples}
              </div>
              <span className="text-[10px] text-purple-400">High-Entropy Edge Cases</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Current Model Accuracy</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {telemetry.current_accuracy_pct}%
              </div>
              <span className="text-[10px] text-emerald-500 font-bold">{telemetry.accuracy_gain_since_baseline} since baseline</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Pending Retraining Buffer</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                {telemetry.pending_queue_size} batches
              </div>
              <span className="text-[10px] text-slate-400">Triggers at 200 items</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Sampling Strategy</span>
              <div className="text-xs font-bold text-slate-200 mt-1">
                Uncertainty Margin
              </div>
              <span className="text-[10px] text-slate-400">Entropy Minimization</span>
            </div>
          </div>
        )}

        {/* Retraining History Table */}
        {telemetry && telemetry.retraining_history && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Continuous Retraining Epoch Convergence:
            </h4>
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 text-left">
                    <th className="p-3">Retraining Cycle</th>
                    <th className="p-3">Samples Added</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">F1 Score</th>
                    <th className="p-3">Cross-Entropy Loss</th>
                    <th className="p-3">Date Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {telemetry.retraining_history.map((h: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-cyan-400">{h.cycle}</td>
                      <td className="p-3 text-slate-400">+{h.samples_added} samples</td>
                      <td className="p-3 font-bold text-emerald-400">{h.accuracy}%</td>
                      <td className="p-3 text-indigo-300">{h.f1_score}</td>
                      <td className="p-3 text-purple-400">{h.loss}</td>
                      <td className="p-3 text-slate-500">{h.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Card: Dynamic ML Source Reliability */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Dynamic ML Data Source Reliability (Empirical Bayesian Scores)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Learned dynamically from historical accuracy &amp; false-alarm penalties
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-all font-mono"
            >
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs truncate max-w-[160px]">{src.name}</strong>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                  {src.status}
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-black text-cyan-400">{src.dynamic_reliability_score}%</span>
                <span className="text-[10px] text-slate-500">reliability score</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <div>Verified: <strong className="text-emerald-400">{src.verified_true}</strong></div>
                <div>False: <strong className="text-rose-400">{src.false_alarms}</strong></div>
                <div>Corroboration: <strong className="text-indigo-300">{src.corroboration_rate * 100}%</strong></div>
                <div>Spatial Match: <strong className="text-cyan-300">{src.spatial_consistency * 100}%</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};