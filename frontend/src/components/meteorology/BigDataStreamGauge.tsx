import React, { useState, useEffect } from 'react';
import { Cpu, Server, Activity, Database, Zap, RefreshCw } from 'lucide-react';
import { fetchStreamTelemetry } from '../../services/api';
import { StreamTelemetryResponse } from '../../types';

export const BigDataStreamGauge: React.FC = () => {
  const [streamData, setStreamData] = useState<StreamTelemetryResponse | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchStreamTelemetry();
      setStreamData(data);
    } catch (err) {
      console.error('Stream Fetch error', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Big Data Stream Processing & Kafka Pipeline Telemetry
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Real-Time Spark Streaming Micro-Batch Windowing
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
          STREAM ACTIVE
        </span>
      </div>

      {streamData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Throughput Rate</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {streamData.records_per_second.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-500 font-mono block">records / sec</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Total Ingested</span>
            <span className="text-xl font-black font-mono text-cyan-300">
              {streamData.total_records_ingested.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-500 font-mono block">synoptic records</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Sliding Latency</span>
            <span className="text-xl font-black font-mono text-white">
              {streamData.sliding_processing_latency_ms}
            </span>
            <span className="text-[9px] text-slate-500 font-mono block">milliseconds</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Broker Partitions</span>
            <span className="text-xl font-black font-mono text-amber-300">
              {streamData.kafka_broker_partitions}
            </span>
            <span className="text-[9px] text-slate-500 font-mono block">Kafka Topics</span>
          </div>
        </div>
      )}
    </div>
  );
};