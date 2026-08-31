import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, Send, Radio } from 'lucide-react';
import { InformationGap, VerificationRequestItem } from '../../types';
import { respondToVerificationRequest } from '../../services/api';

interface InformationGapPanelProps {
  gaps: InformationGap[];
  verificationRequests: VerificationRequestItem[];
  onVerificationDone?: () => void;
}

export const InformationGapPanel: React.FC<InformationGapPanelProps> = ({
  gaps,
  verificationRequests,
  onVerificationDone
}) => {
  const [resolvedIds, setResolvedIds] = useState<Record<string, boolean>>({});

  const handleResolve = async (reqId: string) => {
    try {
      await respondToVerificationRequest(reqId, { text: "Visual confirmation: road inundated 1.5ft", verified: true });
      setResolvedIds(prev => ({ ...prev, [reqId]: true }));
      if (onVerificationDone) onVerificationDone();
    } catch (err) {
      console.error('Resolution error', err);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400" /> Information Gaps & Citizen Verification Loop
        </h3>
        <span className="text-[10px] font-mono text-slate-400">
          AI Uncertainty Resolver Active
        </span>
      </div>

      <div className="space-y-3">
        {gaps.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No critical information gaps identified for this incident.</p>
        ) : (
          gaps.map((gap, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  MISSING INTELLIGENCE: {gap.missing_information}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  {gap.severity}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                <strong>Impact on Decision:</strong> {gap.affected_decision}
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-cyan-300 font-sans">
                  Action: {gap.recommended_action}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Active Citizen Verification Triggers */}
        {verificationRequests.map((req, idx) => {
          const isDone = resolvedIds[req.id];
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-700/40 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">{req.title}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5">{req.prompt}</p>
                <span className="text-[10px] text-cyan-400 font-mono">{req.target_area} ({req.radius_km}km radius)</span>
              </div>

              <button
                onClick={() => handleResolve(req.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isDone ? 'Verified' : 'Simulate Citizen Ground Reply'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};