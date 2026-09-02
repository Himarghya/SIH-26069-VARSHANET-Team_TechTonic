import React, { useState } from 'react';
import { AnalyticsOverview } from '../types';
import { BarChart3, Database, Shield, Zap, TrendingUp, PieChart, Activity, Globe, Cpu, Terminal, Award, MessageSquare } from 'lucide-react';
import { RadarDwrViewer } from '../components/meteorology/RadarDwrViewer';
import { InsatSatelliteViewer } from '../components/meteorology/InsatSatelliteViewer';
import { ClimatologyAnomalyCard } from '../components/meteorology/ClimatologyAnomalyCard';
import { ExtremeWeatherAlerts } from '../components/meteorology/ExtremeWeatherAlerts';
import { BigDataStreamGauge } from '../components/meteorology/BigDataStreamGauge';
import { CustomSqlConsole } from '../components/analytics/CustomSqlConsole';
import { VayuScoreAndQualityDashboard } from '../components/analytics/VayuScoreCard';
import { PublicSentimentPanicWidget } from '../components/analytics/PublicSentimentPanicWidget';

interface AnalyticsPageProps {
  overview: AnalyticsOverview | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ overview }) => {
  const [subTab, setSubTab] = useState<'radar_ml' | 'vayuscore' | 'sql_explorer' | 'sentiment'>('radar_ml');

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">
            Big Data Weather Analytics & Multi-Modal Intelligence Grid
          </h1>
          <p className="text-xs text-slate-400">
            Real-time Doppler radar volume sweeps, INSAT-3D thermal cloud telemetry, VayuScore™ confidence analytics, and interactive SQL query explorer.
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 flex-wrap gap-1">
          <button
            onClick={() => setSubTab('radar_ml')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'radar_ml' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Radar & Extreme ML
          </button>
          <button
            onClick={() => setSubTab('vayuscore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'vayuscore' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            VayuScore™ & Data Quality
          </button>
          <button
            onClick={() => setSubTab('sql_explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'sql_explorer' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            SQL Query Explorer
          </button>
          <button
            onClick={() => setSubTab('sentiment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'sentiment' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Social Sentiment & Panic
          </button>
        </div>
      </div>

      {/* View 1: Radar, Extreme ML & Ingestion */}
      {subTab === 'radar_ml' && (
        <div className="space-y-6">
          {/* Real-Time Kafka Stream Gauge */}
          <BigDataStreamGauge />

          {/* Extreme Weather ML (Cloudburst CPI & Heatwave WBGT) */}
          <ExtremeWeatherAlerts />

          {/* Doppler Weather Radar & INSAT-3D Satellite */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <RadarDwrViewer />
            </div>
            <div className="lg:col-span-6">
              <InsatSatelliteViewer />
            </div>
          </div>

          {/* 30-Year Historical Climate Anomaly Engine */}
          <ClimatologyAnomalyCard />

          {/* National Ingestion & Source Breakdown */}
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
      )}

      {/* View 2: VayuScore™ & Model Quality */}
      {subTab === 'vayuscore' && (
        <VayuScoreAndQualityDashboard />
      )}

      {/* View 3: Interactive SQL Query Console */}
      {subTab === 'sql_explorer' && (
        <CustomSqlConsole />
      )}

      {/* View 4: Social Sentiment & Panic */}
      {subTab === 'sentiment' && (
        <div className="space-y-6">
          <PublicSentimentPanicWidget />
          <CustomSqlConsole />
        </div>
      )}
    </div>
  );
};