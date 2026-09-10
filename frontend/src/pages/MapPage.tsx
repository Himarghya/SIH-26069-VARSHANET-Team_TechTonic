import React, { useState } from 'react';
import { IndiaWeatherMap } from '../components/map/IndiaWeatherMap';
import { EventCluster, WeatherReport } from '../types';
import { Download, Loader2 } from 'lucide-react';
import { fetchTacticalGeoJson } from '../services/api';

interface MapPageProps {
  events: EventCluster[];
  reports: WeatherReport[];
  onSelectEvent: (event: EventCluster) => void;
  onSelectReport: (report: WeatherReport) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  events,
  reports,
  onSelectEvent,
  onSelectReport
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExportGeoJson = async () => {
    try {
      setExporting(true);
      const data = await fetchTacticalGeoJson('all');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VARSHANET_Tactical_Disaster_Layers_${new Date().toISOString().slice(0, 10)}.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export GeoJSON:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">National Geospatial Intelligence Radar</h1>
          <p className="text-xs text-slate-400">
            High-precision pan-India interactive map with live cluster intensity, radar pulses, and multi-layer satellite view.
          </p>
        </div>
        <button
          onClick={handleExportGeoJson}
          disabled={exporting}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
          title="Export standard RFC 7946 GeoJSON layers for QGIS and ArcGIS"
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Export GIS (GeoJSON)
        </button>
      </div>
      <div className="flex-1 w-full min-h-[580px] rounded-2xl overflow-hidden shadow-2xl">
        <IndiaWeatherMap
          events={events}
          reports={reports}
          onSelectEvent={onSelectEvent}
          onSelectReport={onSelectReport}
        />
      </div>
    </div>
  );
};