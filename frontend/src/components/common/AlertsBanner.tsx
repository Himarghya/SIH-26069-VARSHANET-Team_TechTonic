import React, { useState, useEffect } from 'react';
import { AlertTriangle, BellRing, ArrowRight, ChevronLeft, ChevronRight, Flame, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsBannerProps {
  alerts: Alert[];
  onSelectAlert?: (alert: Alert) => void;
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({ alerts = [], onSelectAlert }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isNewAlertFlash, setIsNewAlertFlash] = useState(false);
  const [prevAlertsLength, setPrevAlertsLength] = useState(alerts.length);

  // Detect incoming new live critical alert
  useEffect(() => {
    if (alerts.length > prevAlertsLength) {
      setCurrentIndex(0); // Jump directly to the newest alert
      setIsNewAlertFlash(true);
      setTimeout(() => setIsNewAlertFlash(false), 4500);
    }
    setPrevAlertsLength(alerts.length);
  }, [alerts.length, prevAlertsLength]);

  // Auto-rotating timer: cycles every 5 seconds unless paused on hover
  useEffect(() => {
    if (!alerts || alerts.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % alerts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [alerts.length, isPaused]);

  if (!alerts || alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex] || alerts[0];
  const severity = (currentAlert.severity || 'CRITICAL').toUpperCase();
  const isCritical = severity === 'CRITICAL';
  const isHigh = severity === 'HIGH';

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % alerts.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + alerts.length) % alerts.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => onSelectAlert && onSelectAlert(currentAlert)}
      className={`border-y px-3 sm:px-4 py-2 text-xs flex items-center justify-between gap-2 transition-all cursor-pointer select-none group shadow-lg ${
        isNewAlertFlash
          ? 'bg-gradient-to-r from-red-600 via-rose-700 to-red-950 border-red-400 text-white animate-pulse'
          : isCritical
          ? 'bg-gradient-to-r from-rose-950 via-red-950/90 to-slate-950 border-rose-800/80 text-rose-100 hover:bg-rose-950/90'
          : isHigh
          ? 'bg-gradient-to-r from-amber-950 via-orange-950/90 to-slate-950 border-amber-800/80 text-amber-100 hover:bg-amber-950/90'
          : 'bg-gradient-to-r from-cyan-950 via-blue-950/90 to-slate-950 border-cyan-800/80 text-cyan-100 hover:bg-cyan-950/90'
      }`}
      title="Click to open full AI nowcasting and response in Incident Command Room"
    >
      {/* Left: Indicator, Severity Badge & Bulletin */}
      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
        {/* Pulsing Beacon */}
        <span className="flex h-2.5 w-2.5 relative shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isCritical ? 'bg-rose-400' : isHigh ? 'bg-amber-400' : 'bg-cyan-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-cyan-500'
          }`}></span>
        </span>

        {/* Severity Pill */}
        <span className={`font-mono font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] flex items-center gap-1 shrink-0 ${
          isNewAlertFlash
            ? 'bg-white text-red-700 shadow-md font-black'
            : isCritical
            ? 'bg-rose-600 text-white shadow-sm'
            : isHigh
            ? 'bg-amber-600 text-white shadow-sm'
            : 'bg-cyan-600 text-white shadow-sm'
        }`}>
          {isNewAlertFlash ? (
            <>
              <Flame className="w-3 h-3 text-red-600 animate-bounce" />
              <span>JUST IN</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3" />
              <span>{severity}</span>
            </>
          )}
        </span>

        {/* Headline & Message */}
        <p className="font-sans font-medium truncate text-[11px] sm:text-xs">
          <strong className="text-white font-bold">{currentAlert.title}:</strong>{' '}
          <span className="opacity-90">{currentAlert.message}</span>
        </p>
      </div>

      {/* Right: Location & Interactive Carousel Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Location (hidden on very small screens) */}
        <span className="text-[10px] font-mono text-slate-300 hidden md:inline bg-black/40 px-2 py-0.5 rounded border border-white/10">
          📍 {currentAlert.city || 'District'}, {currentAlert.state} • <strong className="text-cyan-300">{currentAlert.reports_count} reports</strong>
        </span>

        {/* Carousel Pagination & Arrows */}
        {alerts.length > 1 && (
          <div className="flex items-center gap-0.5 bg-black/50 px-1 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono shrink-0">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-white/20 rounded transition-colors text-slate-300 hover:text-white cursor-pointer"
              title="Previous Alert"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="px-0.5 text-slate-300 font-bold">
              {currentIndex + 1}/{alerts.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-white/20 rounded transition-colors text-slate-300 hover:text-white cursor-pointer"
              title="Next Alert"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Open in Incident Room CTA */}
        <div className="flex items-center gap-0.5 text-[11px] font-bold text-white group-hover:text-cyan-300 transition-colors shrink-0">
          <span className="hidden sm:inline">Inspect</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};