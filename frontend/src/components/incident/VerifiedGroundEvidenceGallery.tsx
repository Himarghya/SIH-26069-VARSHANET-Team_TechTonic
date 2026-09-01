import React, { useState } from 'react';
import { Camera, CheckCircle2, ShieldCheck, Eye, X, MapPin, Clock, ExternalLink, Sparkles, Image as ImageIcon } from 'lucide-react';
import { VerifiedGroundPhoto } from '../../types';
import { StreetViewPin } from './StreetViewPin';

interface VerifiedGroundEvidenceGalleryProps {
  photos?: VerifiedGroundPhoto[];
  city?: string;
  state?: string;
  eventType?: string;
}

export const VerifiedGroundEvidenceGallery: React.FC<VerifiedGroundEvidenceGalleryProps> = ({
  photos = [],
  city = 'Bhopal',
  state = 'Madhya Pradesh',
  eventType = 'Urban Flooding'
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<VerifiedGroundPhoto | null>(null);

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span>Verified Ground Truth & Citizen Photo Evidence</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Corroborated optical proof for: <strong className="text-cyan-300">{city}, {state}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{photos.length} Verified Photo Proof{photos.length > 1 ? 's' : ''}</span>
          </span>
        </div>
      </div>

      {/* Grid of Verified Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-cyan-500/80 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={item.image_url}
                alt={`Ground evidence ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold font-mono">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Inspect Proof</span>
              </div>

              {/* Top status tag */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-emerald-300 border border-emerald-500/50 text-[9px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>VERIFIED PROOF</span>
                </span>
              </div>

              {/* AI Trust Pill */}
              <div className="absolute top-2 right-2">
                <span className="px-1.5 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/50 text-[9px] font-mono font-bold">
                  {Math.round(item.credibility_score)}% Trust
                </span>
              </div>
            </div>

            {/* Bottom Caption & Metadata */}
            <div className="p-3 space-y-1.5 bg-slate-950/90">
              <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed font-sans font-medium">
                "{item.caption}"
              </p>
              
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-900">
                <span className="text-cyan-300 font-bold truncate max-w-[120px]">
                  📍 {item.city}
                </span>
                <span className="text-slate-500">
                  {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 text-slate-200 cursor-default"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white font-mono uppercase">
                    Official Ground Proof • {selectedPhoto.event_type}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Report Reference: <strong className="text-cyan-300">{selectedPhoto.report_id}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Image Preview + Metadata */}
            <div className="p-5 space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 max-h-[55vh] flex items-center justify-center">
                <img
                  src={selectedPhoto.image_url}
                  alt="Full Evidence"
                  className="max-w-full max-h-[55vh] object-contain"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-sans">
                    Citizen Observation Log:
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
                    {selectedPhoto.credibility_score}% AI OPTICAL AUTHENTICITY
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  "{selectedPhoto.caption}"
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Sector: {selectedPhoto.city}, {selectedPhoto.state}</span>
                  <span>Logged: {selectedPhoto.timestamp ? new Date(selectedPhoto.timestamp).toLocaleString() : 'Recent'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};