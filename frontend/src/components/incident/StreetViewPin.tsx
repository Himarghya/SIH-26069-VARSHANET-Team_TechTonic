import React from 'react';
import { ExternalLink, Navigation, Eye, MapPin } from 'lucide-react';

interface StreetViewPinProps {
  latitude: number;
  longitude: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StreetViewPin: React.FC<StreetViewPinProps> = ({
  latitude,
  longitude,
  label = 'Pinpoint in Google Street View',
  size = 'md'
}) => {
  // Direct Google Street View Panoramics + Maps Query URL
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const sizeClasses = {
    sm: 'px-2 py-1 text-[10px] gap-1',
    md: 'px-3 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2 font-bold'
  };

  return (
    <div className="flex items-center gap-1.5">
      <a
        href={streetViewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-semibold shadow-lg shadow-orange-950/40 border border-amber-400/40 transition-all cursor-pointer ${sizeClasses[size]}`}
        title="Open exact ground panorama in Google Street View"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>{label}</span>
        <ExternalLink className="w-3 h-3 opacity-70" />
      </a>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all ${sizeClasses[size]}`}
        title="Open GPS location in Google Maps satellite view"
      >
        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Google Maps</span>
      </a>
    </div>
  );
};