import React from 'react';
import { AnalyticsOverview } from '../types';
import { BarChart3, Database, Shield, Zap, TrendingUp, PieChart, Activity, Globe, Cpu } from 'lucide-react';
import { RadarDwrViewer } from '../components/meteorology/RadarDwrViewer';
import { InsatSatelliteViewer } from '../components/meteorology/InsatSatelliteViewer';
import { ClimatologyAnomalyCard } from '../components/meteorology/ClimatologyAnomalyCard';
import { ExtremeWeatherAlerts } from '../components/meteorology/ExtremeWeatherAlerts';
import { BigDataStreamGauge } from '../components/meteorology/BigDataStreamGauge';

interface AnalyticsPageProps {
  overview: AnalyticsOverview | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ overview }) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-wide">
          Ministry of Earth Sciences (MoES) Big Data Weather & Radar Analytics Grid
        </h1>
        <p className="text-xs text-slate-400">
          Real-time Doppler radar volume sweeps, INSAT-3D thermal cloud telemetry, 30-year IMD climatology anomalies, and extreme event ML predictors.
        </p>
      </div>

      {/* 1. Real-Time Kafka Stream Gauge */}
      <BigDataStreamGauge />

      {/* 2. Extreme Weather ML (Cloudburst CPI & Heatwave WBGT) */}
      <ExtremeWeatherAlerts />

      {/* 3. Doppler Weather Radar & INSAT-3D Satellite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <RadarDwrViewer />
        </div>
        <div className="lg:col-span-6">
          <InsatSatelliteViewer />
        </div>
      </div>

      {/* 4. 30-Year Historical Climate Anomaly Engine */}
      <ClimatologyAnomalyCard />

      {/* 5. National Ingestion & Source Breakdown */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Source Distribution */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Source Ingestion Mix</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(overview.source_distribution || {}).map(([src, count]) => (
                <div key={src} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 capitalize">{src.replace(/_/g, ' ')}</span>
                  <span className="text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {count} records
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Classification Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Hazard Classification</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(overview.event_distribution || {}).map(([evt, count]) => (
                <div key={evt} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 capitalize">{evt.replace(/_/g, ' ')}</span>
                  <span className="text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* State Activity Ranking */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active State Corridors</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(overview.state_activity || {}).slice(0, 5).map(([st, count]) => (
                <div key={st} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{st}</span>
                  <span className="text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {count} reports
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};