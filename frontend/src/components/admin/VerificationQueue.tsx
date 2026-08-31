import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Eye, RefreshCw, Hash } from 'lucide-react';
import { WeatherReport } from '../../types';
import { performVerificationAction } from '../../services/api';

interface VerificationQueueProps {
  pendingReports: WeatherReport[];
  onReportActionDone: () => void;
  onSelectReport: (report: WeatherReport) => void;
}

export const VerificationQueue: React.FC<VerificationQueueProps> = ({
  pendingReports,
  onReportActionDone,
  onSelectReport
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: string) => {
    setProcessingId(id);
    try {
      await performVerificationAction(id, action, `Action ${action} taken via Admin Verification Queue`);
      onReportActionDone();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            National Weather Incident Verification Queue
          </h2>
          <p className="text-xs text-slate-400">
            High-priority citizen submissions, unverified social alerts, and conflicting signals awaiting human meteorological sign-off.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-700/50 text-amber-300">
          {pendingReports.length} PENDING DECISION
        </span>
      </div>

      {pendingReports.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs">
          All reports verified! No pending items in the active moderation queue.
        </div>
      ) : (
        <div className="space-y-3">
          {pendingReports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rep.event_type}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {rep.city || 'District'}, {rep.state}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                    rep.credibility_score >= 80 ? 'bg-emerald-950 text-emerald-300' :
                    rep.credibility_score >= 60 ? 'bg-cyan-950 text-cyan-300' :
                    'bg-rose-950 text-rose-300'
                  }`}>
                    {rep.credibility_score}% AI Trust
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{rep.text}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Report ID: {rep.id} • Source: {rep.source_name || rep.source_type} • Time: {new Date(rep.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  disabled={processingId === rep.id}
                  onClick={() => onSelectReport(rep)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
                  title="Inspect Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  disabled={processingId === rep.id}
                  onClick={() => handleAction(rep.id, 'VERIFY')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verify
                </button>
                <button
                  disabled={processingId === rep.id}
                  onClick={() => handleAction(rep.id, 'FLAG_MISINFORMATION')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/20"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Flag Fake
                </button>
                <button
                  disabled={processingId === rep.id}
                  onClick={() => handleAction(rep.id, 'MARK_DUPLICATE')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold"
                >
                  Duplicate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};