import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  BellRing, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  ExternalLink, 
  Share2,
  Radio,
  MapPin
} from 'lucide-react';
import { Alert } from '../../types';
import { broadcastAlertToX } from '../../services/api';

interface AlertsBannerProps {
  alerts: Alert[];
  onSelectAlert?: (alert: Alert) => void;
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({ alerts = [], onSelectAlert }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isNewAlertFlash, setIsNewAlertFlash] = useState(false);
  const [prevAlertsLength, setPrevAlertsLength] = useState(alerts.length);
  const [isPostingToX, setIsPostingToX] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const isInitialMount = useRef(true);

  // Detect incoming new live critical alert (skip on initial load / refresh)
  useEffect(() => {
    if (isInitialMount.current) {
      if (alerts.length > 0) {
        isInitialMount.current = false;
        setPrevAlertsLength(alerts.length);
      }
      return;
    }

    if (alerts.length > prevAlertsLength) {
      setCurrentIndex(0);
      setIsNewAlertFlash(true);
      const timer = setTimeout(() => setIsNewAlertFlash(false), 4500);
      return () => clearTimeout(timer);
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

  const handlePostToX = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPostingToX(true);
    try {
      const res = await broadcastAlertToX({
        city: currentAlert.city || 'District',
        state: currentAlert.state || 'India',
        event_type: currentAlert.title || 'Extreme Weather Warning',
        severity: severity,
        directive: currentAlert.message,
        event_id: currentAlert.event_cluster_id
      });

      if (res?.dispatch_details?.web_intent_url) {
        window.open(res.dispatch_details.web_intent_url, '_blank', 'noopener,noreferrer');
      }

      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 4000);
    } catch (err) {
      console.error('X Broadcast error', err);
    } finally {
      setIsPostingToX(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => onSelectAlert && onSelectAlert(currentAlert)}
      className={`relative border-y py-2.5 px-3 sm:px-6 text-xs flex items-center justify-between gap-3 transition-all cursor-pointer select-none group shadow-md z-40 overflow-hidden ${
        isNewAlertFlash
          ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
          : isCritical
          ? 'bg-gradient-to-r from-red-50 via-rose-50 to-red-100/60 dark:from-red-950/70 dark:via-slate-900 dark:to-red-950/50 border-red-300/80 dark:border-red-900/80 text-red-950 dark:text-red-100 hover:border-red-500'
          : isHigh
          ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 dark:from-amber-950/70 dark:via-slate-900 dark:to-amber-950/50 border-amber-300/80 dark:border-amber-900/80 text-amber-950 dark:text-amber-100 hover:border-amber-500'
          : 'bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-100/60 dark:from-cyan-950/70 dark:via-slate-900 dark:to-cyan-950/50 border-cyan-300/80 dark:border-cyan-900/80 text-cyan-950 dark:text-cyan-100 hover:border-cyan-500'
      }`}
      title="Click to inspect this emergency alert in Incident Command Room"
    >
      {/* Left Glowing Accent Border Line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        isCritical ? 'bg-red-600 animate-pulse' : isHigh ? 'bg-amber-500' : 'bg-cyan-500'
      }`} />

      {/* Left: Severity Badge & Bulletin Details */}
      <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0 pl-1.5">
        
        {/* Severity Pill Badge */}
        <div className={`font-mono font-black tracking-wider uppercase px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] flex items-center gap-1.5 shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
          isNewAlertFlash
            ? 'bg-rose-950 text-rose-200 border border-rose-400 shadow-lg font-black'
            : isCritical
            ? 'bg-red-600 text-white shadow-red-900/30'
            : isHigh
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-900/30'
            : 'bg-cyan-600 text-white'
        }`}>
          {isNewAlertFlash ? (
            <>
              <Flame className="w-3.5 h-3.5 text-rose-300 animate-bounce" />
              <span className="text-rose-100 font-bold">FLASH ALERT</span>
            </>
          ) : (
            <>
              <AlertTriangle className={`w-3.5 h-3.5 ${isCritical ? 'animate-bounce text-white' : 'text-white'}`} />
              <span className="text-white font-bold">{severity === 'HIGH' ? 'HIGH ALERT' : severity}</span>
            </>
          )}
        </div>

        {/* Headline & Directive Message */}
        <div className="font-sans flex items-center gap-2 truncate text-xs sm:text-[13px] min-w-0">
          <strong className={`font-extrabold uppercase tracking-tight shrink-0 ${
            isNewAlertFlash ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}>
            {currentAlert.title}:
          </strong>
          <span className={`font-medium truncate ${
            isNewAlertFlash ? 'text-rose-100' : 'text-slate-700 dark:text-slate-200'
          }`}>
            {currentAlert.message}
          </span>
        </div>
      </div>

      {/* Right: Metadata, 1-Click Broadcast, Carousel Controls & CTA */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* 1-Click Post to X (Twitter) Broadcast Button */}
        <button
          onClick={handlePostToX}
          disabled={isPostingToX}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-500 transition-all text-[11px] font-mono font-bold shadow-sm cursor-pointer shrink-0 active:scale-95"
          title="Post this verified alert to X (Twitter)"
        >
          <span className="font-black text-xs leading-none">𝕏</span>
          <span className="hidden sm:inline">
            {postSuccess ? 'Posted ✓' : isPostingToX ? 'Posting...' : 'Post to 𝕏'}
          </span>
        </button>

        {/* Location & Report Counter Badge (Pill Container) */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-[11px] font-mono shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[130px]">
            {currentAlert.city || 'District'}, {currentAlert.state}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-700 dark:text-cyan-300 font-bold">
            {currentAlert.reports_count} reports
          </span>
        </div>

        {/* Carousel Pagination & Arrow Controls */}
        {alerts.length > 1 && (
          <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 text-[11px] font-mono shadow-xs">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Previous Alert"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-slate-900 dark:text-white font-bold tabular-nums">
              {currentIndex + 1}/{alerts.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Next Alert"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Inspect CTA Link */}
        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors pl-1">
          <span className="hidden sm:inline">Inspect</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};