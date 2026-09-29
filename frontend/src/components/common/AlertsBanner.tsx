import React, { useState, useEffect } from 'react';
import { AlertTriangle, BellRing, ArrowRight, ChevronLeft, ChevronRight, Flame, ShieldAlert, Sparkles, ExternalLink, Share2 } from 'lucide-react';
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

  // Detect incoming new live critical alert
  useEffect(() => {
    if (alerts.length > prevAlertsLength) {
      setCurrentIndex(0);
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

      // Open X / Twitter Web Intent in a new tab for instant 1-click posting
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
      className={`border-y px-3 sm:px-4 py-2 text-xs flex items-center justify-between gap-2 transition-all cursor-pointer select-none group shadow-xs ${
        isNewAlertFlash
          ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
          : isCritical
          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100 hover:bg-rose-100/80 dark:hover:bg-rose-950/90'
          : isHigh
          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-100 hover:bg-amber-100/80 dark:hover:bg-amber-950/90'
          : 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-900 text-cyan-900 dark:text-cyan-100 hover:bg-cyan-100/80 dark:hover:bg-cyan-950/90'
      }`}
      title="Click to open full AI nowcasting and response in Incident Command Room"
    >
      {/* Left: Severity Badge & Bulletin */}
      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
        {/* Severity Pill */}
        <span className={`font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] flex items-center gap-1 shrink-0 ${
          isNewAlertFlash
            ? 'bg-white text-rose-700 shadow-xs font-bold'
            : isCritical
            ? 'bg-rose-600 text-white shadow-xs'
            : isHigh
            ? 'bg-amber-600 text-white shadow-xs'
            : 'bg-cyan-600 text-white shadow-xs'
        }`}>
          {isNewAlertFlash ? (
            <>
              <Flame className="w-3 h-3 text-rose-600 animate-bounce" />
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
          <strong className="text-slate-900 dark:text-white font-bold">{currentAlert.title}:</strong>{' '}
          <span className="text-slate-700 dark:text-slate-200">{currentAlert.message}</span>
        </p>
      </div>

      {/* Right: Location, 1-Click Post to X Button & Carousel Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* 1-Click Post to X (Twitter) Button */}
        <button
          onClick={handlePostToX}
          disabled={isPostingToX}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-300 dark:border-slate-700 hover:border-cyan-500 transition-all text-[10px] font-mono font-semibold shadow-xs cursor-pointer shrink-0"
          title="Post this Red Alert immediately to X (Twitter)"
        >
          <span className="font-black text-xs leading-none">𝕏</span>
          <span className="hidden sm:inline">{postSuccess ? 'Posted ✓' : isPostingToX ? 'Posting...' : 'Post to 𝕏'}</span>
        </button>

        {/* Location (hidden on small mobile) */}
        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 hidden md:inline bg-white/60 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
          📍 {currentAlert.city || 'District'}, {currentAlert.state} | <strong className="text-cyan-700 dark:text-cyan-300 font-semibold">{currentAlert.reports_count} reports</strong>
        </span>

        {/* Carousel Pagination & Arrows */}
        {alerts.length > 1 && (
          <div className="flex items-center gap-0.5 bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 text-[10px] font-mono shrink-0">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Previous Alert"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="px-1 text-slate-700 dark:text-slate-300 font-semibold tabular-nums">
              {currentIndex + 1}/{alerts.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Next Alert"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Open in Incident Room CTA */}
        <div className="flex items-center gap-0.5 text-[11px] font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors shrink-0">
          <span className="hidden sm:inline">Inspect</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};