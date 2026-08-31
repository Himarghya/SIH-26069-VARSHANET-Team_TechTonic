import React from 'react';
import { AlertTriangle, BellRing, ArrowRight } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsBannerProps {
  alerts: Alert[];
  onSelectAlert?: (alert: Alert) => void;
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({ alerts, onSelectAlert }) => {
  if (!alerts || alerts.length === 0) return null;
  const activeAlert = alerts[0];

  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-red-900/60 to-slate-950 border-y border-rose-800/60 px-4 py-2 text-xs flex items-center justify-between text-rose-200">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        </span>
        <span className="font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {activeAlert.severity} ALERT
        </span>
        <p className="font-medium truncate">
          <strong className="text-white">{activeAlert.title}:</strong> {activeAlert.message}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[11px] font-mono text-rose-300/80">
          {activeAlert.city}, {activeAlert.state} • {activeAlert.reports_count} reports
        </span>
      </div>
    </div>
  );
};