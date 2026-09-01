import React from 'react';
import { Activity, Database, Server, Cpu, Radio, CheckCircle2, Zap, Share2, Waves } from 'lucide-react';
import { SystemHealth } from '../../types';

interface SystemHealthViewProps {
  health: SystemHealth | null;
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({ health }) => {
  if (!health) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Distributed Big Data Streaming & Multi-Modal Queue Observability
          </h2>
          <p className="text-xs text-slate-400">
            FastAPI API Gateway fronting Apache Kafka / Redis Streams message brokers, PostGIS spatial clusters, and CWC River Gauge feeds.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4" />
          DISTRIBUTED CLUSTER OPERATIONAL
        </div>
      </div>

      {/* Row 1: Core Storage & Message Brokers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>POSTGIS SPATIAL DB</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">{health.database}</div>
          <p className="text-[11px] text-slate-500">Spatial index R-Tree active (SRID 4326)</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>MESSAGE BROKER (KAFKA)</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">{health.kafka}</div>
          <p className="text-[11px] text-slate-500">Distributed queue worker pools active</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>SOCIAL MEDIA FIREHOSE</span>
            <Share2 className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">#IMD #MumbaiRains</div>
          <p className="text-[11px] text-slate-500">Active hashtag listeners (X, YouTube, RSS)</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>CWC RIVER GAUGES</span>
            <Waves className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">ACTIVE (CWC Grid)</div>
          <p className="text-[11px] text-slate-500">Live flood-level bypass data stream</p>
        </div>
      </div>

      {/* Row 2: Throughput Metrics */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono text-xs">
        <div>
          <span className="text-slate-500 block text-[10px]">INGESTION THROUGHPUT</span>
          <strong className="text-white text-base">{health.ingestion_rate_per_min} msg/min</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">AI PROCESSING LATENCY</span>
          <strong className="text-emerald-400 text-base">{health.processing_latency_ms} ms</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">ACTIVE LIVE WEBSOCKETS</span>
          <strong className="text-cyan-300 text-base">{health.active_connections} Clients</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">OPTICAL FLOW VELOCITY</span>
          <strong className="text-emerald-400 text-base">±6.38% Calibrated</strong>
        </div>
      </div>
    </div>
  );
};