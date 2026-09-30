import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, Send, ArrowRight } from 'lucide-react';
import { ResponseRecommendation } from '../../types';

interface ResponseRecommendationsProps {
  recommendations: ResponseRecommendation[];
}

export const ResponseRecommendations: React.FC<ResponseRecommendationsProps> = ({ recommendations }) => {
  const [dispatched, setDispatched] = useState<Record<number, boolean>>({});

  const handleDispatch = (idx: number) => {
    setDispatched(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> AI-Recommended Operational Decisions &amp; SOPs
        </h3>
        <span className="text-[11px] font-sans px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-semibold">
          Powered by Google Gemini &amp; NDRF SOP Engine
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => {
          const isDone = dispatched[idx];
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                rec.priority_label === 'P1'
                  ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/40 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded ${
                    rec.priority_label === 'P1' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700/60' :
                    rec.priority_label === 'P2' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60' :
                    'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60'
                  }`}>
                    {rec.priority_label} Action
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rec.action}</h4>
                </div>

                <button
                  onClick={() => handleDispatch(idx)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/30'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isDone ? 'Dispatched' : 'Dispatch SOP'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100">Operational Reason:</strong> {rec.reason}
              </p>

              {rec.supporting_evidence && rec.supporting_evidence.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                  {rec.supporting_evidence.map((ev, i) => (
                    <span key={i} className="text-[11px] font-sans px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-normal">
                      {ev}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};