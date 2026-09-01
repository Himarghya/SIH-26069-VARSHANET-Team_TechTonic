import React, { useState, useEffect } from 'react';
import { Eye, Globe, RefreshCw, Sparkles, ShieldAlert } from 'lucide-react';
import { fetchInsatSatellite } from '../../services/api';
import { InsatSatelliteResponse } from '../../types';

export const InsatSatelliteViewer: React.FC = () => {
  const [insatData, setInsatData] = useState<InsatSatelliteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInsatSatellite();
      setInsatData(data);
    } catch (err) {
      console.error('INSAT Fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/40">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              INSAT-3D/3DR Geostationary Satellite Telemetry
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Thermal Infrared (TIR-1/2) & Cloud Top Temperature (CTT)
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
          title="Refresh Satellite Scans"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
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
                    ? 'bg-indigo-950/40 border-indigo-600/50 shadow-md shadow-indigo-950/20'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-white">{sec.sector}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {sec.cloud_type}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-black text-cyan-300">
                    CTT: {sec.ctt_celsius}°C
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    sec.hazard_flag.includes('CLOUDBURST') || sec.hazard_flag.includes('HIGH')
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-900 text-slate-400'
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