import React from 'react';
import { Activity, Database, Server, Cpu, Radio, CheckCircle2, Zap } from 'lucide-react';
import { SystemHealth } from '../../types';

interface SystemHealthViewProps {
  health: SystemHealth | null;
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({ health }) => {
  if (!health) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Big Data Pipeline & Distributed Cluster Observability
          </h2>
          <p className="text-xs text-slate-400">
            Real-time health telemetry across Apache Kafka message brokers, PostGIS spatial clusters, Redis cache and AI worker pools.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4" />
          SYSTEM OPERATIONAL
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>POSTGIS DATABASE</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">{health.database}</div>
          <p className="text-[11px] text-slate-500">Spatial index R-Tree active (SRID 4326)</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>REDIS CACHE</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">{health.redis}</div>
          <p className="text-[11px] text-slate-500">Sub-millisecond geospatial query cache</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>KAFKA EVENT STREAM</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">{health.kafka}</div>
          <p className="text-[11px] text-slate-500">7 Topic partitions running asynchronous</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AI/ML INFERENCE</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">{health.ai_workers}</div>
          <p className="text-[11px] text-slate-500">Rule + TF-IDF ML + Vision scoring</p>
        </div>
      </div>

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
          <span className="text-slate-500 block text-[10px]">FAIL-SAFE FALLBACK</span>
          <strong className="text-emerald-400 text-base">ENABLED</strong>
        </div>
      </div>
    </div>
  );
};