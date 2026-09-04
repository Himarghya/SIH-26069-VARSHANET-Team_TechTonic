import React from 'react';
import { GitCommit, CheckCircle2, Radio, Database, CloudRain } from 'lucide-react';
import { EvidenceChainItem } from '../../types';

interface EvidenceChainProps {
  evidenceChain: EvidenceChainItem[];
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({ evidenceChain }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <GitCommit className="w-4 h-4 text-cyan-400" /> Explainable AI Multi-Source Evidence Tree
      </h3>

      <div className="space-y-2.5">
        {evidenceChain.map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 shrink-0">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-white">{item.title}</span>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">{item.detail}</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0 self-start sm:self-auto bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              {item.impact_weight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};