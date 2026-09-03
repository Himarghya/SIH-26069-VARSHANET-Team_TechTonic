import React from 'react';
import { Cpu, Network, ShieldCheck, Sparkles, Eye, Layers, Compass, TrendingUp, AlertTriangle, ArrowDown, Activity, Database, RefreshCw, CheckCircle2 } from 'lucide-react';

export const MlArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Title & Badge */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              VARSHANET 2.0 Machine Learning Intelligence Layer
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Fused Multimodal Transformers • 1–3h Severity Forecasting • SHAP Explainability • Active Learning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-700/60 shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>8 ML Pillars Active</span>
          </span>
        </div>
      </div>

      {/* Layer 1: The 3 Base Encoders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: NLP Transformer Engine */}
        <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-4 space-y-2 hover:border-indigo-400/60 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              1. NLP Transformer Engine
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              RoBERTa-Indic
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Multilingual Indian NLP (Hindi, Marathi, Bengali, Tamil) with semantic token embeddings and urgency extraction.
          </p>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
            P(Disaster) Tensor • 384-dim Dense
          </div>
        </div>

        {/* Pillar 2: Computer Vision Forensics */}
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-2 hover:border-emerald-400/60 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              2. CLIP Vision Forensics
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              CLIP-ViT-B/32
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Deep forensic comparison against historical disaster archives (Kerala/Chennai) & HSV water turbidity analysis.
          </p>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
            Recycled Photo Filter • 92% Forensic Auth
          </div>
        </div>

        {/* Pillar 3: Synoptic Time-Series ML */}
        <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 space-y-2 hover:border-cyan-400/60 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              3. Synoptic Time-Series ML
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              LSTM-XGBoost
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            IMD AWS rainfall accumulation, Doppler radar dBZ reflectivity, river gauge surges, and climatological z-score anomalies.
          </p>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
            Rainfall Velocity • Radar Extrapolation
          </div>
        </div>
      </div>

      {/* Connective Arrows */}
      <div className="flex items-center justify-center gap-8 text-slate-500">
        <ArrowDown className="w-4 h-4 animate-bounce text-indigo-400" />
        <ArrowDown className="w-4 h-4 animate-bounce text-emerald-400" />
        <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
      </div>

      {/* Layer 2: Multimodal Fusion & Unsupervised Anomaly Detection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Multimodal Fusion */}
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/40 rounded-xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-indigo-400" />
              4. Multimodal Incident Fusion Model
            </span>
            <span className="text-[10px] font-mono font-bold text-indigo-400">P(Incident): 0–100%</span>
          </div>
          <p className="text-xs text-slate-300">
            Fuses Text NLP + Vision Forensics + Weather Telemetry + PostGIS Basin + Temporal Velocity into a single incident verification probability.
          </p>
          <div className="text-[11px] font-mono text-indigo-300/80 bg-black/40 p-2 rounded-lg border border-indigo-900/60">
            P = 0.28·Text + 0.22·Vision + 0.22·Weather + 0.14·PostGIS + 0.14·Temporal
          </div>
        </div>

        {/* Unsupervised Anomaly Detection */}
        <div className="bg-gradient-to-br from-slate-950 via-rose-950/40 to-slate-950 border border-rose-500/40 rounded-xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              5. Isolation Forest Anomaly Detector
            </span>
            <span className="text-[10px] font-mono font-bold text-rose-400">Outlier Score &gt; 0.65</span>
          </div>
          <p className="text-xs text-slate-300">
            Detects abnormal spatial-temporal surges in citizen reports, river level spikes, and localized rainfall bursts before thresholds trigger.
          </p>
          <div className="text-[11px] font-mono text-rose-300/80 bg-black/40 p-2 rounded-lg border border-rose-900/60">
            Surge Ratio + Climatology σ-Dev + Social Panic Spike
          </div>
        </div>
      </div>

      {/* Connective Arrows */}
      <div className="flex items-center justify-center text-slate-500">
        <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
      </div>

      {/* Layer 3: Semantic HDBSCAN & 1-3h Severity Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Semantic HDBSCAN Clustering */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              6. Semantic + Spatio-Temporal HDBSCAN
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              1,000 &rarr; 8 Clusters
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Semantic embeddings + spatial coordinates transform heterogeneous citizen complaints into geographically cohesive incident clusters.
          </p>
        </div>

        {/* 1-3h Severity Escalation Forecaster */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              7. Spatio-Temporal Severity Forecasting
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              1h &amp; 3h Lookahead
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Projects incident evolution (e.g. Current MODERATE &rarr; 1h HIGH &rarr; 3h CRITICAL at 87% confidence) for predictive disaster management.
          </p>
        </div>
      </div>

      {/* Layer 4: Explainable VayuScore & Active Learning Loop */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              8. Explainable ML VayuScore™ (TreeSHAP) &amp; Active Learning Loop
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Operational Feedback Retraining Active (Epoch 14)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
          <div>
            <strong className="text-white block font-mono text-[11px]">TreeSHAP Feature Attributions:</strong>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Inspectable feature-level contributions behind every verification decision (+21 Reports, +18 Rain, +16 Image, +14 Source, +11 Geo, +7 Time).
            </p>
          </div>
          <div>
            <strong className="text-white block font-mono text-[11px]">Active Learning Loop:</strong>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Human reviewer decisions on borderline cases generate high-value labeled samples, continuously boosting model F1 from 91.4% to 96.8%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};