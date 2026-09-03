import React, { useState } from 'react';
import { Network, Sparkles, Layers, Eye, Activity, Compass, Clock, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchMultimodalVerify } from '../../services/api';

export const MultimodalFusionInspector: React.FC = () => {
  const [textInput, setTextInput] = useState('Water has crossed the road near Andheri station and cars are stuck');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [rainfallRate, setRainfallRate] = useState(48.5);
  const [radarDbz, setRadarDbz] = useState(43.0);
  const [elevationM, setElevationM] = useState(12.0);
  const [coLocatedCount, setCoLocatedCount] = useState(9);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRunFusion = async () => {
    setLoading(true);
    try {
      const data = await fetchMultimodalVerify({
        text: textInput,
        city,
        state,
        rainfall_mmh: rainfallRate,
        radar_dbz: radarDbz,
        elevation_m: elevationM,
        co_located_reports: coLocatedCount
      });
      setResult(data);
    } catch (err) {
      console.error('Multimodal verify error', err);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount once if not run
  React.useEffect(() => {
    handleRunFusion();
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/40">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Multimodal Incident Verification Model
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Fused Transformer NLP • CLIP Forensics • IMD Synoptics • PostGIS Terrain • Temporal Horizon
            </p>
          </div>
        </div>

        <button
          onClick={handleRunFusion}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold font-mono shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Run Multimodal Fusion</span>
        </button>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Input Form Controls */}
        <div className="md:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
              1. Citizen / Social Text Report:
            </label>
            <textarea
              rows={2}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                City / Location:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                State:
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Sliders for Multimodal Context */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>IMD Rainfall Intensity:</span>
                <strong className="text-cyan-400">{rainfallRate} mm/h</strong>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="1"
                value={rainfallRate}
                onChange={(e) => setRainfallRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Doppler Radar Reflectivity:</span>
                <strong className="text-cyan-400">{radarDbz} dBZ</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="0.5"
                value={radarDbz}
                onChange={(e) => setRadarDbz(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Co-Located Reports in 30-Min Window:</span>
                <strong className="text-indigo-400">{coLocatedCount} reports</strong>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={coLocatedCount}
                onChange={(e) => setCoLocatedCount(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Real-time Fused Output Card */}
        <div className="md:col-span-6 bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 shadow-inner">
          {result ? (
            <>
              {/* Primary Gauge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Multimodal Model Output
                  </span>
                  <div className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300">
                    {result.incident_verification_probability}%
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verdict: {result.verification_verdict}</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 block">Model Engine</span>
                  <span className="text-xs font-mono font-bold text-slate-300">TVMS-v2 Ensemble</span>
                  <span className="text-[10px] font-mono text-cyan-400 block mt-1">Calibrated Weights</span>
                </div>
              </div>

              {/* 5 Fused Dimension Bars */}
              <div className="space-y-2.5 text-xs">
                {/* 1. Text NLP */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-indigo-300 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Text Transformer NLP (28%)
                    </span>
                    <strong className="text-white">{result.dimensions?.text_nlp?.score}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.dimensions?.text_nlp?.score}%` }}
                    />
                  </div>
                </div>

                {/* 2. Vision Forensics */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Vision Forensics CLIP (22%)
                    </span>
                    <strong className="text-white">{result.dimensions?.vision_forensics?.score}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.dimensions?.vision_forensics?.score}%` }}
                    />
                  </div>
                </div>

                {/* 3. Synoptic Weather */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-cyan-300 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Synoptic Radar &amp; Rain (22%)
                    </span>
                    <strong className="text-white">{result.dimensions?.synoptic_weather?.score}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.dimensions?.synoptic_weather?.score}%` }}
                    />
                  </div>
                </div>

                {/* 4. PostGIS Geospatial */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-amber-300 flex items-center gap-1">
                      <Compass className="w-3 h-3" /> PostGIS Basin Susceptibility (14%)
                    </span>
                    <strong className="text-white">{result.dimensions?.postgis_geospatial?.score}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.dimensions?.postgis_geospatial?.score}%` }}
                    />
                  </div>
                </div>

                {/* 5. Temporal Velocity */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-purple-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Spatio-Temporal Cluster Velocity (14%)
                    </span>
                    <strong className="text-white">{result.dimensions?.temporal_velocity?.score}%</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.dimensions?.temporal_velocity?.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Mathematical Formulation Badge */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                P(Incident) = 0.28·Text + 0.22·Vision + 0.22·Weather + 0.14·PostGIS + 0.14·Temporal
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500 text-xs font-mono">
              Loading Multimodal Fusion Model...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};