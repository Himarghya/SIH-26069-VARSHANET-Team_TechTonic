import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Languages, 
  Volume2, 
  VolumeX, 
  Info, 
  Clock, 
  Building2, 
  MapPin, 
  Check, 
  ShieldAlert,
  Download,
  Share2,
  Maximize2
} from 'lucide-react';

export interface OfficialCapAlert {
  id: string;
  issuedBy: string;
  state: string;
  event: string;
  warningLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  warningColor: 'yellow' | 'orange' | 'red';
  location: string;
  validUpto: string;
  issuedAt: string;
  lat: number;
  lon: number;
  radiusKm: number;
  descriptionHi: string;
  descriptionEn: string;
  dos: { text: string; icon: string }[];
  donts: { text: string; icon: string }[];
}

interface CapAlertDetailModalProps {
  alert: OfficialCapAlert | null;
  onClose: () => void;
}

export const CapAlertDetailModal: React.FC<CapAlertDetailModalProps> = ({
  alert,
  onClose
}) => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState(142);
  const [notHelpfulVotes, setNotHelpfulVotes] = useState(8);
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLegendModal, setShowLegendModal] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize mini Leaflet map focusing on this specific alert zone
  useEffect(() => {
    if (!alert || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [alert.lat, alert.lon],
        zoom: 9,
        minZoom: 4,
        maxZoom: 15,
        zoomControl: true,
      });

      // Standard OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Warning Zone Circle Polygon
      const circleColor = alert.warningColor === 'red' ? '#dc2626' : alert.warningColor === 'orange' ? '#ea580c' : '#f59e0b';
      const circle = L.circle([alert.lat, alert.lon], {
        radius: alert.radiusKm * 1000,
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 0.35,
        weight: 2.5
      }).addTo(map);

      // Center Marker with Pulsing Pin
      const pinHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-red-500/30 animate-ping absolute"></div>
          <div class="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
            📍
          </div>
        </div>
      `;
      const customPin = L.divIcon({
        html: pinHtml,
        className: 'custom-alert-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([alert.lat, alert.lon], { icon: customPin }).addTo(map);
      marker.bindPopup(`
        <div class="p-2 font-sans text-xs">
          <strong class="text-rose-600 block text-sm font-black">${alert.event}</strong>
          <span class="text-slate-700 font-semibold block">${alert.location}</span>
          <span class="text-slate-500 text-[10px] block mt-1">Valid Upto: ${alert.validUpto}</span>
        </div>
      `, { className: 'custom-leaflet-popup' }).openPopup();

      mapInstanceRef.current = map;

      // Ensure proper sizing in modal
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.error('Error rendering Leaflet mini-map', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [alert]);

  if (!alert) return null;

  // Text-To-Speech handler
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = isEnglish ? alert.descriptionEn : alert.descriptionHi;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isEnglish ? 'en-IN' : 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleHelpfulClick = () => {
    if (userVote === 'UP') {
      setUserVote(null);
      setHelpfulVotes(prev => prev - 1);
    } else {
      if (userVote === 'DOWN') setNotHelpfulVotes(prev => prev - 1);
      setUserVote('UP');
      setHelpfulVotes(prev => prev + 1);
    }
  };

  const handleNotHelpfulClick = () => {
    if (userVote === 'DOWN') {
      setUserVote(null);
      setNotHelpfulVotes(prev => prev - 1);
    } else {
      if (userVote === 'UP') setHelpfulVotes(prev => prev - 1);
      setUserVote('DOWN');
      setNotHelpfulVotes(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-blue-900/30 flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Dark Blue Header Bar */}
        <div className="bg-[#18447e] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black tracking-wide font-heading">
              CAP DISASTER BULLETIN &amp; EARLY WARNING ACTION
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close Alert Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 custom-scrollbar">
          
          {/* Top 2-Column Split: Alert Box (Left) + Do's & Don'ts (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            
            {/* Left Card: Yellow/Amber Alert Advisory Box (6 cols) */}
            <div className="lg:col-span-6 bg-[#fff9c4] dark:bg-amber-950/30 border-2 border-yellow-400 dark:border-amber-700/60 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm">
              
              <div>
                {/* Yellow Event Banner */}
                <div className="bg-[#ffeb3b] dark:bg-amber-500 text-slate-950 px-4 py-2 text-center font-black text-sm sm:text-base uppercase tracking-tight shadow-xs">
                  {alert.event}
                </div>

                {/* Metadata Row: Valid Upto & Issued By */}
                <div className="p-3 pb-1 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-800 dark:text-amber-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-600 dark:text-amber-300" />
                    <span>Valid Upto: <span className="font-normal font-mono">{alert.validUpto}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-600 dark:text-amber-300" />
                    <span>Issued By: <span className="font-semibold">{alert.issuedBy}</span></span>
                  </div>
                </div>

                {/* Location Line */}
                <div className="px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-amber-200">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{alert.location}</span>
                </div>

                {/* Description Box */}
                <div className="p-3 pt-2">
                  <p className="text-xs sm:text-[13px] font-bold text-slate-950 dark:text-white leading-relaxed bg-white/60 dark:bg-black/40 p-3 rounded-lg border border-yellow-300 dark:border-amber-800">
                    {isEnglish ? alert.descriptionEn : alert.descriptionHi}
                  </p>
                </div>
              </div>

              {/* Bottom Interactive Action Toolbar */}
              <div className="border-t-2 border-emerald-600 bg-white dark:bg-slate-900 px-3 py-2 flex items-center justify-around gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                {/* Helpful Button */}
                <button
                  onClick={handleHelpfulClick}
                  className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-colors cursor-pointer ${
                    userVote === 'UP' ? 'text-emerald-600 font-black' : 'hover:text-emerald-600'
                  }`}
                  title="Mark as helpful"
                >
                  <ThumbsUp className={`w-4 h-4 ${userVote === 'UP' ? 'fill-emerald-600' : ''}`} />
                  <span className="text-[10px]">Helpful ({helpfulVotes})</span>
                </button>

                {/* Not Helpful Button */}
                <button
                  onClick={handleNotHelpfulClick}
                  className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-colors cursor-pointer ${
                    userVote === 'DOWN' ? 'text-rose-600 font-black' : 'hover:text-rose-600'
                  }`}
                  title="Mark as not helpful"
                >
                  <ThumbsDown className={`w-4 h-4 ${userVote === 'DOWN' ? 'fill-rose-600' : ''}`} />
                  <span className="text-[10px]">Not Helpful ({notHelpfulVotes})</span>
                </button>

                {/* Translate Button */}
                <button
                  onClick={() => setIsEnglish(prev => !prev)}
                  className="flex flex-col items-center gap-1 p-1 rounded-lg hover:text-blue-600 transition-colors cursor-pointer"
                  title="Toggle translation (Hindi / English)"
                >
                  <div className="w-5 h-5 rounded bg-blue-500 text-white flex items-center justify-center font-serif text-[11px] font-bold">
                    {isEnglish ? 'हि' : 'En'}
                  </div>
                  <span className="text-[10px]">{isEnglish ? 'हिंदी' : 'Translate'}</span>
                </button>

                {/* Read Out Loud TTS Button */}
                <button
                  onClick={handleToggleSpeech}
                  className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-colors cursor-pointer ${
                    isSpeaking ? 'text-amber-500 animate-pulse font-black' : 'hover:text-amber-600'
                  }`}
                  title="Read alert message aloud"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-[10px]">{isSpeaking ? 'Stop Voice' : 'Read Out Loud'}</span>
                </button>

                {/* Legend Button */}
                <button
                  onClick={() => setShowLegendModal(!showLegendModal)}
                  className="flex flex-col items-center gap-1 p-1 rounded-lg hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="View alert warning level legend"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px]">Legend</span>
                </button>
              </div>

            </div>

            {/* Right Card: Do's & Don'ts Matching Screenshot 2 (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
              
              {/* Arrow Headers Row */}
              <div className="grid grid-cols-2 gap-2 p-3 pb-1">
                {/* Green Do's Banner */}
                <div className="relative bg-[#2e7d32] text-white py-1.5 px-4 font-black text-xs uppercase flex items-center justify-center gap-1.5 rounded-l-md shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Do's</span>
                  {/* Arrow Point Right */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[14px] border-y-transparent border-l-[10px] border-l-[#2e7d32] z-10"></div>
                </div>

                {/* Red Don'ts Banner */}
                <div className="relative bg-[#b71c1c] text-white py-1.5 px-4 font-black text-xs uppercase flex items-center justify-center gap-1.5 rounded-r-md shadow-sm">
                  {/* Arrow Point Left */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[14px] border-y-transparent border-r-[10px] border-r-[#b71c1c] z-10"></div>
                  <span>Don'ts</span>
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Do's and Don'ts 2-Column Side-by-Side Points */}
              <div className="flex-1 grid grid-cols-2 gap-3 p-3 divide-x divide-slate-200 dark:divide-slate-800">
                
                {/* Left Side: Do's List */}
                <div className="space-y-3 pr-1">
                  {alert.dos.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-emerald-500">
                        {item.icon}
                      </div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight pt-1">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Right Side: Don'ts List */}
                <div className="space-y-3 pl-3">
                  {alert.donts.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight pt-1 flex-1 text-right">
                        {item.text}
                      </p>
                      <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-red-500">
                        {item.icon}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Section: Interactive Leaflet Google/OSM Map for this specific Alert zone */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                Alert Impact Zone Map: {alert.location}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Coordinates: [{alert.lat.toFixed(4)}, {alert.lon.toFixed(4)}] • Radius ~{alert.radiusKm} km
              </span>
            </div>
            <div
              ref={mapContainerRef}
              className="w-full h-64 sm:h-72 bg-slate-200 dark:bg-slate-950 relative z-0"
            />
          </div>

        </div>

        {/* Legend Popover Modal */}
        {showLegendModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-4 max-w-sm w-full border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <h4 className="font-heading font-black text-xs uppercase text-[#18447e] dark:text-cyan-400">
                  NDMA Warning Severity Legend
                </h4>
                <button
                  onClick={() => setShowLegendModal(false)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-4 h-4 rounded bg-emerald-500 shrink-0"></span>
                  <div>
                    <strong className="block text-emerald-800 dark:text-emerald-300 font-bold">Green (No Warning)</strong>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">No action needed. Safe conditions.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800">
                  <span className="w-4 h-4 rounded bg-[#ffeb3b] shrink-0"></span>
                  <div>
                    <strong className="block text-yellow-800 dark:text-yellow-300 font-bold">Yellow (Watch / Low)</strong>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Be updated. Weather condition may worsen.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
                  <span className="w-4 h-4 rounded bg-[#ff9800] shrink-0"></span>
                  <div>
                    <strong className="block text-orange-800 dark:text-orange-300 font-bold">Orange (Alert / Moderate)</strong>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Be prepared. Severe weather conditions likely.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <span className="w-4 h-4 rounded bg-rose-600 shrink-0"></span>
                  <div>
                    <strong className="block text-rose-800 dark:text-rose-300 font-bold">Red (Warning / Take Action)</strong>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Take action immediately. Life threatening risk.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
