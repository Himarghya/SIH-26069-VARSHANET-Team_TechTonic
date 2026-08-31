import React from 'react';
import { IndiaWeatherMap } from '../components/map/IndiaWeatherMap';
import { EventCluster, WeatherReport } from '../types';

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
  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">National Geospatial Intelligence Radar</h1>
          <p className="text-xs text-slate-400">
            High-precision pan-India interactive map with live cluster intensity, radar pulses, and multi-layer satellite view.
          </p>
        </div>
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