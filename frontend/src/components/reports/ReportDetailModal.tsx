import React, { useState } from 'react';
import { X, Shield, ShieldCheck, AlertTriangle, MapPin, CheckCircle2, XCircle, Cpu, Eye, ExternalLink, Camera, Image as ImageIcon, Video } from 'lucide-react';
import { WeatherReport } from '../../types';
import { performVerificationAction } from '../../services/api';
import { StreetViewPin } from '../incident/StreetViewPin';
import { ShapWaterfallInspector } from '../ml/ShapWaterfallInspector';
import { LiveMlForensicInspector } from '../ml/LiveMlForensicInspector';

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
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  const isFakeVisual = report.credibility_score < 20 || (report.verification_notes && report.verification_notes.includes('< 20%'));
  const photos = report.media_urls || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
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

          {/* 📸 CITIZEN PHOTO & VIDEO EVIDENCE GALLERY & AI VISUAL VERDICT */}
          {photos.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                  <Camera className="w-4 h-4" /> Attached Ground Media Proofs ({photos.length})
                </span>
                
                {isFakeVisual ? (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700/60 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>FLAGGED FAKE VISUAL (&lt; 20% Authenticity)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>VARSHANET-VisionGuard VERIFIED</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {photos.map((url, idx) => {
                  const isVid = url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('video');

                  return (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center shadow-lg"
                    >
                      {isVid ? (
                        <video
                          src={url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div onClick={() => setSelectedPhoto(url)} className="w-full h-full cursor-pointer">
                          <img
                            src={url}
                            alt={`Evidence ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <span className="text-[10px] text-white font-mono flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Inspect High-Res
                            </span>
                          </div>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300 pointer-events-none">
                        {isVid ? '🎥 Field Video' : `Photo #${idx + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 🤖 Two-Stage In-House ML Disaster Model Audit for Admin */}
          {photos.length > 0 && (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <span>🤖 In-House ML Disaster Model Audit</span>
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                  report.image_analysis_results?.is_weather_related === false || report.credibility_score < 70
                    ? 'bg-rose-950 text-rose-300 border-rose-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}>
                  {report.image_analysis_results?.admin_recommendation || (report.credibility_score < 70 ? '❌ RECOMMEND REJECT' : '✅ RECOMMEND VERIFY')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Stage 1 (Disaster Detector)</span>
                  <strong className={report.image_analysis_results?.is_weather_related === false ? "text-rose-300" : "text-emerald-300"}>
                    {report.image_analysis_results?.stage1_result || (report.credibility_score < 70 ? 'Normal Everyday Scene (Non-Disaster)' : 'Disaster Detected')}
                  </strong>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Stage 2 (Disaster Type Classifier)</span>
                  <strong className="text-cyan-300">
                    {report.image_analysis_results?.detected_category || report.event_type}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div>Model Verdict: <strong className={report.image_analysis_results?.is_weather_related === false ? "text-rose-400" : "text-emerald-400"}>
                  {report.image_analysis_results?.model_verdict || report.image_analysis_results?.admin_verdict || (report.credibility_score < 70 ? 'FALSE: NOT A DISASTER PHOTO' : 'TRUE: DISASTER PHOTO')}
                </strong></div>
                <div>Verdict Rationale: <span className="text-slate-400 font-sans">{report.image_analysis_results?.verdict_reason || report.verification_notes || 'Evaluated by two-stage deep vision neural backbone.'}</span></div>
              </div>
            </div>
          )}

          {/* 🤖 Live Custom ML Forensic Inspector (VARSHANET-VisionGuard & TextGuard v2.1) */}
          <LiveMlForensicInspector
            mediaUrls={photos}
            reportText={report.text}
            credibilityScore={report.credibility_score}
            isFakeFlag={isFakeVisual}
          />

          {/* Explainable ML for VayuScore TreeSHAP Waterfall (Embedded) */}
          <ShapWaterfallInspector />

          {/* Geolocation with Google Street View Pinpoint */}
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

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Full Proof" className="max-w-full max-h-[85vh] rounded-xl object-contain border border-slate-700 shadow-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 text-white font-mono text-xs font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              ✕ Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};