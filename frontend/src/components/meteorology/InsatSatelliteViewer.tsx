import React, { useState, useEffect } from 'react';
import { Eye, Globe, RefreshCw, Sparkles, ShieldAlert } from 'lucide-react';
import { fetchInsatSatellite } from '../../services/api';
import { InsatSatelliteResponse } from '../../types';

export const InsatSatelliteViewer: React.FC = () => {
  const [insatData, setInsatData] = useState<InsatSatelliteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInsatSatellite();
      setInsatData(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('INSAT Fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800/40">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              INSAT-3D/3DR Geostationary Satellite Telemetry
            </h3>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
              Thermal Infrared (TIR-1/2) & Cloud Top Temperature (CTT)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            Scanned: {lastUpdated}
          </span>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-cyan-700 dark:text-cyan-300 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1 text-[11px] font-mono"
            title="Refresh Satellite Scans"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-600 dark:text-cyan-400' : ''}`} />
            <span className="hidden md:inline">{isLoading ? 'Scanning...' : 'Reload Scans'}</span>
          </button>
        </div>
      </div>

      {insatData && (
        <div className="space-y-2.5">
          {insatData.monitored_sectors.map((sec, idx) => {
            const isSevere = sec.ctt_celsius <= -65.0;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  isSevere
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-600/50 shadow-xs dark:shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{sec.sector}</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-mono">
                    {sec.cloud_type}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-black text-cyan-700 dark:text-cyan-300">
                    CTT: {sec.ctt_celsius}°C
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    sec.hazard_flag.includes('CLOUDBURST') || sec.hazard_flag.includes('HIGH')
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}>
                    {sec.hazard_flag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};