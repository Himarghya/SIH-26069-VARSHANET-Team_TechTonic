import React, { useState, useEffect } from 'react';
import { Bell, Radio, ShieldCheck, AlertTriangle, Clock, MapPin, Eye, Flame, Sparkles, Filter, Users, CheckCircle2, Shield, Navigation } from 'lucide-react';
import { WeatherReport } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface LiveFeedProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
  dashboardFilter?: 'ALL' | 'VERIFIED' | 'CRITICAL' | '24H';
  onClearDashboardFilter?: () => void;
}

// Robust timestamp parser supporting ISO, UTC, SQLite format, and numeric epoch
const parseReportTime = (ts: any): number => {
  if (!ts) return 0;
  if (typeof ts === 'number') return ts;
  if (ts instanceof Date) return ts.getTime();
  const str = String(ts).trim();
  let parsed = new Date(str).getTime();
  if (!isNaN(parsed)) return parsed;
  parsed = new Date(str.replace(' ', 'T')).getTime();
  if (!isNaN(parsed)) return parsed;
  parsed = new Date(str.replace(' ', 'T') + 'Z').getTime();
  return isNaN(parsed) ? 0 : parsed;
};

export const LiveFeed: React.FC<LiveFeedProps> = ({ 
  reports = [], 
  onSelectReport,
  dashboardFilter = 'ALL',
  onClearDashboardFilter,
}) => {
  const { t } = useLanguage();
  const [filterMode, setFilterMode] = useState<'all' | 'verified' | 'citizen' | 'recent'>('all');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [dismissLocationBanner, setDismissLocationBanner] = useState(false);

  // Tick clock every minute to keep 6-hour countdowns live and accurate
  useEffect(() => {
    const ticker = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(ticker);
  }, []);

  const SIX_HOURS_MS = 6 * 3600 * 1000;

  // Filter reports according to strict 6-hour rule
  const isReportRecent = (timestampStr: string) => {
    const repTime = parseReportTime(timestampStr);
    if (repTime === 0) return false;
    const diff = currentTime - repTime;
    return diff >= 0 && diff <= SIX_HOURS_MS;
  };

  const isReportVerified = (r: WeatherReport) => 
    r.verification_status === 'VERIFIED' || 
    r.verification_status === 'LIKELY_AUTHENTIC' ||
    (r.credibility_score && r.credibility_score >= 80);

  const recentCount = reports.filter(r => isReportRecent(r.timestamp)).length;
  const verifiedCount = reports.filter(isReportVerified).length;
  const citizenCount = reports.filter(r => r.source_type === 'citizen_report').length;
  const verifiedCitizenCount = reports.filter(r => r.source_type === 'citizen_report' && isReportVerified(r)).length;

  const displayReports = reports.filter(r => {
    if (filterMode === 'verified') return isReportVerified(r);
    if (filterMode === 'citizen') return r.source_type === 'citizen_report';
    if (filterMode === 'recent') return isReportRecent(r.timestamp);
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col h-[580px] shadow-sm dark:shadow-xl font-sans overflow-hidden">
      {/* SACHET Official Blue Header Banner */}
      <div className="bg-[#18447e] text-white px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-amber-300 shrink-0">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black tracking-wider uppercase text-white font-heading truncate">
              {t('feed_title')}
            </h3>
            <p className="text-[10px] text-blue-200 font-mono tracking-wide truncate">
              {t('feed_subtitle')} ({reports.length})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider whitespace-nowrap">{t('live_fresh')}</span>
        </div>
      </div>

      {/* Secondary Controls & Filter Row */}
      <div className="p-3 pb-2 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 space-y-2">
        {/* Synced Dashboard GIS Filter Indicator */}
        {dashboardFilter && dashboardFilter !== 'ALL' && (
          <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-cyan-950/40 border border-blue-200 dark:border-cyan-800/60 text-[10px] font-mono text-blue-900 dark:text-cyan-300">
            <span className="flex items-center gap-1.5">
              <span>
                {t('filter_active_label')} <strong className="text-slate-900 dark:text-white">
                  {dashboardFilter === 'VERIFIED' && t('filter_verified')}
                  {dashboardFilter === 'CRITICAL' && t('filter_critical')}
                  {dashboardFilter === '24H' && t('filter_24h')}
                </strong> ({reports.length})
              </span>
            </span>
            {onClearDashboardFilter && (
              <button
                onClick={onClearDashboardFilter}
                className="text-blue-700 hover:text-blue-900 dark:text-slate-400 dark:hover:text-white underline cursor-pointer text-[9px] font-bold"
              >
                {t('filter_reset')}
              </button>
            )}
          </div>
        )}

        {/* Stream Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 font-mono text-[10px]">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#18447e] text-white shadow-xs'
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t('filter_all')} ({reports.length})
          </button>
          <button
            onClick={() => setFilterMode('verified')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              filterMode === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{t('filter_verified')} ({verifiedCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('citizen')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              filterMode === 'citizen'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>{t('role_citizen')} ({citizenCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('recent')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              filterMode === 'recent'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-500" />
            <span>&lt;6h ({recentCount})</span>
          </button>
        </div>
      </div>

      {/* Reports List with SACHET Card Design */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-sans bg-slate-50/50 dark:bg-slate-950/40">
        {/* SACHET Location Permission Advisory Card */}
        {!dismissLocationBanner && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-xl p-3 shadow-xs flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <div className="w-7 h-7 rounded-full bg-amber-200/80 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-950 dark:text-amber-100 text-[11px] uppercase tracking-wide">
                  Location Permission
                </h4>
                <button
                  onClick={() => setDismissLocationBanner(true)}
                  className="text-amber-700 hover:text-amber-950 dark:text-amber-400 dark:hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[10px] text-amber-800 dark:text-amber-300/90 leading-tight mt-0.5">
                Know localized CAP alerts for your area by enabling GPS or selecting your state above.
              </p>
            </div>
          </div>
        )}

        {displayReports.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono space-y-2">
            <Clock className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-600 animate-pulse" />
            <p>{t('feed_no_reports')}</p>
            <button
              onClick={() => setFilterMode('all')}
              className="text-blue-700 dark:text-cyan-400 hover:underline text-[11px] cursor-pointer font-bold"
            >
              {t('filter_reset')}
            </button>
          </div>
        ) : (
          displayReports.map((rep) => {
            const repTime = parseReportTime(rep.timestamp);
            const ageMs = currentTime - repTime;
            const isWithin6Hours = ageMs >= 0 && ageMs <= SIX_HOURS_MS;
            
            const remainingMs = Math.max(0, SIX_HOURS_MS - ageMs);
            const remainingHours = Math.floor(remainingMs / (3600 * 1000));
            const remainingMins = Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000));

            const isCitizen = rep.source_type === 'citizen_report';
            const isAdminVerified = rep.verification_status === 'VERIFIED';
            const isCitizenVerified = isCitizen && isAdminVerified;
            const isCritical = rep.risk_level === 'CRITICAL' || rep.risk_level === 'HIGH' || rep.text.toLowerCase().includes('flood') || rep.text.toLowerCase().includes('cloudburst');

            const trustPercent = typeof rep.credibility_score === 'number' 
              ? rep.credibility_score.toFixed(0) 
              : Math.round(Number(rep.credibility_score) || 0);

            // Format SACHET timestamp (e.g. 20-09-2024 15:30 IST)
            const dateObj = repTime > 0 ? new Date(repTime) : new Date();
            const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST';

            return (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer group border relative shadow-xs ${
                  isCritical
                    ? 'bg-red-50 hover:bg-red-100/90 dark:bg-red-950/40 dark:hover:bg-red-950/60 border-red-300 dark:border-red-700/80 text-red-950 dark:text-red-100'
                    : isCitizenVerified
                    ? 'bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600/80 text-emerald-950 dark:text-emerald-100'
                    : isCitizen
                    ? 'bg-indigo-50/90 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/40 border-indigo-200 dark:border-indigo-700/80 text-indigo-950 dark:text-indigo-100'
                    : 'bg-[#fef9c3] hover:bg-[#fef08a] dark:bg-amber-950/30 dark:hover:bg-amber-950/40 border-[#fde047] dark:border-amber-700/60 text-amber-950 dark:text-amber-100'
                }`}
              >
                {/* Left Colored Accent Stripe */}
                <div className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-r ${
                  isCritical
                    ? 'bg-red-600'
                    : isCitizenVerified
                    ? 'bg-emerald-600'
                    : isCitizen
                    ? 'bg-indigo-600'
                    : 'bg-amber-500'
                }`}></div>

                {/* Header: Hazard Title & Timestamp */}
                <div className="flex items-start justify-between gap-2 pl-2 mb-1.5">
                  <div>
                    <h4 className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase leading-snug group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
                      {rep.event_type || 'Weather Advisory'}
                    </h4>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                      {formattedDate}
                    </span>
                  </div>

                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-md border shrink-0 ${
                    (Number(rep.credibility_score) || 0) >= 80 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/50' :
                    (Number(rep.credibility_score) || 0) >= 60 
                      ? 'bg-blue-100 dark:bg-cyan-950 text-blue-800 dark:text-cyan-300 border-blue-300 dark:border-cyan-800/50' :
                      'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800/50'
                  }`}>
                    {trustPercent}% Trust
                  </span>
                </div>

                {/* Advisory / Report Text */}
                <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed mb-2.5 pl-2 font-sans">
                  {rep.text}
                </p>

                {/* Footer Metadata (Location & Source) */}
                <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-300/60 dark:border-slate-800/80 pl-2">
                  <div className="flex items-center gap-1 text-blue-800 dark:text-blue-300 font-bold">
                    <MapPin className="w-3 h-3 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="truncate max-w-[140px]">{rep.city || 'District'}, {rep.state}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold bg-white/70 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-[9px]">
                    <span>{isCitizen ? `Citizen (${rep.author || 'Citizen'})` : (rep.source_name || 'IMD / NDMA CAP')}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
