import React, { useState } from 'react';
import { X, Shield, ShieldCheck, AlertTriangle, MapPin, CheckCircle2, XCircle, Cpu, Eye, ExternalLink } from 'lucide-react';
import { WeatherReport } from '../../types';
import { performVerificationAction } from '../../services/api';
import { StreetViewPin } from '../incident/StreetViewPin';

interface ReportDetailModalProps {
  report: WeatherReport | null;
  onClose: () => void;
  onReportUpdated?: (updated: WeatherReport) => void;
  onOpenIncidentRoom?: (clusterId: string) => void;
  userRole?: string;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onReportUpdated,
  onOpenIncidentRoom,
  userRole = 'citizen'
}) => {
  const [actionReason, setActionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) return null;

  const handleAction = async (action: string) => {
    setIsSubmitting(true);
    try {
      const updated = await performVerificationAction(report.id, action, actionReason);
      if (onReportUpdated) onReportUpdated(updated);
      onClose();
    } catch (err) {
      console.error('Verification action error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{report.event_type}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  report.verification_status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' :
                  report.verification_status === 'LIKELY_MISLEADING' ? 'bg-rose-950 text-rose-300 border border-rose-700/50' :
                  'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
                }`}>
                  {report.verification_status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Report ID: {report.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Text Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Observation Content</span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">{report.text}</p>
            {report.hashtags && report.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {report.hashtags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI Intelligence & Geolocation with Google Street View Pinpoint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> AI Credibility Matrix
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-white">{report.credibility_score}</span>
                <span className="text-xs text-slate-400 font-mono">/ 100 Score</span>
              </div>
              <p className="text-xs text-slate-400 leading-tight">
                {report.verification_notes || 'Assessed through multi-modal spatiotemporal corroboration & meteorological consistency.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Geolocation & Ground Pinpoint
              </span>
              <div className="text-sm font-semibold text-white">
                {report.city || 'Unknown District'}, {report.state}
              </div>
              <div className="text-xs font-mono text-slate-400">
                GPS: {report.latitude.toFixed(4)}° N, {report.longitude.toFixed(4)}° E
              </div>
              <div className="pt-1">
                <StreetViewPin latitude={report.latitude} longitude={report.longitude} size="sm" />
              </div>
            </div>
          </div>

          {/* Quick Incident Command Room Navigation Button */}
          {report.event_cluster_id && onOpenIncidentRoom && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-700/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Active Incident Cluster</span>
                <span className="text-[11px] font-mono text-cyan-300">{report.event_cluster_id}</span>
              </div>
              <button
                onClick={() => {
                  onOpenIncidentRoom(report.event_cluster_id!);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                ⚡ View in Incident Command Room
              </button>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">SOURCE TYPE</span>
              <span className="text-slate-200 font-medium">{report.source_type}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">EVENT CLUSTER</span>
              <span className="text-cyan-400 font-medium">{report.event_cluster_id || 'Standalone'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">TIMESTAMP</span>
              <span className="text-slate-200">{new Date(report.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">NEAR-DUPLICATES</span>
              <span className="text-amber-400 font-medium">{report.duplicate_count} Grouped</span>
            </div>
          </div>

          {/* Admin Verification Controls */}
          {(userRole === 'admin' || userRole === 'analyst') && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Operational Verification Decision
              </span>
              <input
                type="text"
                placeholder="Reason or meteorological bulletin reference (optional)..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={isSubmitting}
                  onClick={() => handleAction('VERIFY')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verify Official
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => handleAction('FLAG_MISINFORMATION')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Flag Misinformation
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => handleAction('MARK_DUPLICATE')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Mark Duplicate
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => handleAction('REJECT')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};