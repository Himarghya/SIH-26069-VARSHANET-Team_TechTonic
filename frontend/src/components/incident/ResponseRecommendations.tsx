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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" /> AI-Recommended Operational Decisions & SOPs
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/40 text-cyan-300">
          Powered by Google Gemini & NDRF SOP Engine
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
                  ? 'bg-rose-950/20 border-rose-800/40'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    rec.priority_label === 'P1' ? 'bg-rose-950 text-rose-300 border border-rose-700/60' :
                    rec.priority_label === 'P2' ? 'bg-amber-950 text-amber-300 border border-amber-700/60' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                  }`}>
                    {rec.priority_label} Action
                  </span>
                  <h4 className="text-xs font-bold text-white">{rec.action}</h4>
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

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                <strong>Operational Reason:</strong> {rec.reason}
              </p>

              {rec.supporting_evidence && rec.supporting_evidence.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/60">
                  {rec.supporting_evidence.map((ev, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      • {ev}
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