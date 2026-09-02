import React, { useState, useEffect } from 'react';
import { Radio, Activity, RefreshCw, Gauge, Zap, Waves } from 'lucide-react';
import { fetchDwrRadarGrid } from '../../services/api';
import { RadarGridResponse, DwrStation } from '../../types';

export const RadarDwrViewer: React.FC = () => {
  const [radarData, setRadarData] = useState<RadarGridResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Live');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDwrRadarGrid();
      setRadarData(data);
      if (data.stations.length > 0 && !selectedStation) {
        setSelectedStation(data.stations[0].station_code);
      }
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('DWR Fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const activeStn = radarData?.stations.find(s => s.station_code === selectedStation) || radarData?.stations[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              IMD Doppler Weather Radar (DWR) Grid
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Polar S/C-Band Volume Reflectivity & Marshall-Palmer Z-R Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            Sweep: {lastUpdated}
          </span>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-300 transition-all cursor-pointer border border-slate-700 flex items-center gap-1 text-[11px] font-mono"
            title="Refresh Radar Sweeps"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden md:inline">{isLoading ? 'Sweeping...' : 'Reload Sweeps'}</span>
          </button>
        </div>
      </div>

      {/* DWR Stations Horizontal Selector */}
      {radarData && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {radarData.stations.map((st) => {
            const isSelected = st.station_code === selectedStation;
            return (
              <button
                key={st.station_code}
                onClick={() => setSelectedStation(st.station_code)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{st.station_code}</span>
                <span className="ml-1 text-[9px] opacity-75">({st.peak_reflectivity_dbz} dBZ)</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Station Deep Telemetry Card */}
      {activeStn && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-extrabold text-white">{activeStn.station_name}</span>
              <span className="text-xs text-slate-400 block font-mono">
                {activeStn.state} • {activeStn.range_km} km Synoptic Radius
              </span>
            </div>
            <span
              style={{ backgroundColor: `${activeStn.hydrometeor_classification.color}20`, color: activeStn.hydrometeor_classification.color, borderColor: `${activeStn.hydrometeor_classification.color}50` }}
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
            >
              {activeStn.hydrometeor_classification.label}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Peak Reflectivity (Z)</span>
              <span className="text-xl font-black font-mono text-cyan-300">
                {activeStn.peak_reflectivity_dbz} <span className="text-xs text-slate-400">dBZ</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Z-R Rain Intensity</span>
              <span className="text-xl font-black font-mono text-emerald-400">
                {activeStn.estimated_rain_rate_mmh} <span className="text-xs text-slate-400">mm/h</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Elevation Angle</span>
              <span className="text-xl font-black font-mono text-white">
                {activeStn.sweep_elevation_deg}° <span className="text-xs text-slate-400">PPI</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};