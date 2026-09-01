import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Eye, RefreshCw, Hash, Camera } from 'lucide-react';
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
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            National Weather Incident Verification Queue
          </h2>
          <p className="text-xs text-slate-400">
            Citizen submissions with 2-3 photo proofs, social alerts, and AI-flagged fake media (&lt;20% authenticity) awaiting operational review.
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
          {pendingReports.map((rep) => {
            const isFake = rep.credibility_score < 20 || (rep.verification_notes && rep.verification_notes.includes('< 20%'));
            const hasPhotos = rep.media_urls && rep.media_urls.length > 0;

            return (
              <div
                key={rep.id}
                className={`p-4 rounded-xl bg-slate-950/80 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isFake ? 'border-rose-800/80 bg-rose-950/10' : 'border-slate-800/80'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{rep.event_type}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {rep.city || 'District'}, {rep.state}
                    </span>
                    
                    {/* AI Trust / Authenticity Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono flex items-center gap-1 ${
                      isFake ? 'bg-rose-950 text-rose-300 border border-rose-800 font-black animate-pulse' :
                      rep.credibility_score >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      rep.credibility_score >= 60 ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {isFake && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                      <span>{rep.credibility_score}% AI Trust {isFake ? '• FAKE (<20%)' : ''}</span>
                    </span>

                    {hasPhotos && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
                        <Camera className="w-2.5 h-2.5" />
                        <span>{rep.media_urls!.length} Photos</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{rep.text}</p>

                  {/* Photo Thumbnails in Queue Row */}
                  {hasPhotos && (
                    <div className="flex items-center gap-2 pt-1">
                      {rep.media_urls!.map((pUrl, pIndex) => (
                        <div
                          key={pIndex}
                          onClick={() => onSelectReport(rep)}
                          className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-400 bg-slate-900 cursor-pointer shrink-0"
                          title="Click to inspect photo in detail"
                        >
                          <img src={pUrl} alt="Queue Evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {isFake ? '⚠️ AI Flagged: Fake/Unrelated Visual' : '✓ Visual Proof Attached'}
                      </span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono">
                    Report ID: {rep.id} • Source: {rep.source_name || rep.source_type} • Time: {new Date(rep.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    disabled={processingId === rep.id}
                    onClick={() => onSelectReport(rep)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
                    title="Inspect Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    disabled={processingId === rep.id}
                    onClick={() => handleAction(rep.id, 'VERIFY')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify
                  </button>
                  <button
                    disabled={processingId === rep.id}
                    onClick={() => handleAction(rep.id, 'FLAG_MISINFORMATION')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/20 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Flag Fake
                  </button>
                  <button
                    disabled={processingId === rep.id}
                    onClick={() => handleAction(rep.id, 'MARK_DUPLICATE')}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Duplicate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};