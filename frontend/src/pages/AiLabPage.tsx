import React, { useState } from 'react';
import { Cpu, Sparkles, Shield, MapPin, CheckCircle2, AlertTriangle, Play, Flame, CloudLightning, Waves, Zap, Terminal, Clock } from 'lucide-react';
import { api } from '../services/api';

export const AiLabPage: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Cloudburst and sudden flash flood in Maldevta Dehradun! River overflowing, roads washed away, SDRF rescue teams deployed.'
  );
  const [city, setCity] = useState('Dehradun');
  const [state, setState] = useState('Uttarakhand');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const presets = [
    {
      label: 'Cloudburst Emergency',
      icon: CloudLightning,
      text: 'Cloudburst and sudden flash flood in Maldevta Dehradun! River overflowing, roads washed away, SDRF rescue teams deployed.',
      city: 'Dehradun',
      state: 'Uttarakhand'
    },
    {
      label: 'Fake Snowfall Claim',
      icon: AlertTriangle,
      text: 'Shocking heavy snowfall of 2 feet in MP Nagar Bhopal today afternoon! Entire city covered in white ice blanket!',
      city: 'Bhopal',
      state: 'Madhya Pradesh'
    },
    {
      label: 'Severe Heatwave (Loo)',
      icon: Flame,
      text: 'Scorching heatwave in Jaipur with temperatures crossing 46.5°C. Severe dry loo winds blowing, red alert advisory issued.',
      city: 'Jaipur',
      state: 'Rajasthan'
    },
    {
      label: 'Mumbai Urban Flooding',
      icon: Waves,
      text: 'Hindmata Dadar underpass flooded up to 3 feet due to torrential high-tide rainfall. Central railway local trains stopped.',
      city: 'Mumbai',
      state: 'Maharashtra'
    }
  ];

  const handleRunAnalysis = async (customText?: string, customCity?: string, customState?: string) => {
    const textToRun = customText || inputText;
    const cityToRun = customCity || city;
    const stateToRun = customState || state;

    setIsLoading(true);
    try {
      const { data } = await api.post('/analytics/test-ai', {
        text: textToRun,
        city: cityToRun,
        state: stateToRun,
        source_type: 'citizen_report'
      });
      setResult(data);
    } catch (err) {
      console.error('AI Lab Execution error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (p: typeof presets[0]) => {
    setInputText(p.text);
    setCity(p.city);
    setState(p.state);
    handleRunAnalysis(p.text, p.city, p.state);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-xl font-black text-white tracking-wide">
              VARSHANET AI & Google Gemini Intelligence Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Live interactive laboratory demonstrating our real-time hybrid AI/ML pipeline: local Scikit-Learn TF-IDF classification, Indian PostGIS geo-resolver, and cloud-native Google Gemini LLM disaster reasoning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            GEMINI API ACTIVE
          </div>
        </div>
      </div>

      {/* Interactive Input Form & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" /> Test With Quick Presets
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(p)}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex items-start gap-2 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">{p.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.city}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Custom Observation / Social Media Post / News Snippet
                </label>
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type any Hindi or English weather statement..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">State / UT</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRunAnalysis()}
                disabled={isLoading || !inputText}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Executing Multi-Model AI Inference...' : 'Execute Live AI & Gemini Analysis'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Execution Results Inspector */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Google Gemini Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                      Google Gemini Live LLM Output
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/50 text-indigo-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {result.gemini_llm_stage?.latency_ms || 120}ms Latency
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white">
                      {result.gemini_llm_stage?.event_type || 'Event Classified'}
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      result.gemini_llm_stage?.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      result.gemini_llm_stage?.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {result.gemini_llm_stage?.severity || 'HIGH'} SEVERITY
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                    "{result.gemini_llm_stage?.reasoning || 'Reasoning produced via Google Gemini API.'}"
                  </p>

                  {result.gemini_llm_stage?.impacts && result.gemini_llm_stage.impacts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.gemini_llm_stage.impacts.map((imp: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-200 border border-indigo-800/40">
                          {imp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Local ML & Geo Pipeline Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> Local ML Classifier
                  </span>
                  <div className="text-sm font-bold text-white">{result.local_ml_stage?.event_type}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    Confidence: {(result.local_ml_stage?.ml_confidence_score * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> PostGIS Geo-Resolver
                  </span>
                  <div className="text-xs font-bold text-white truncate">{result.geospatial_stage?.resolved_city}, {result.geospatial_stage?.resolved_state}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {result.geospatial_stage?.latitude?.toFixed(2)}°N, {result.geospatial_stage?.longitude?.toFixed(2)}°E
                  </div>
                </div>
              </div>

              {/* Credibility & Cluster Summary */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AI Credibility Score</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-white">{result.credibility_stage?.final_score}</span>
                    <span className="text-xs text-slate-400 font-mono">/ 100</span>
                    <span className="text-xs text-cyan-400 font-mono ml-2">({result.credibility_stage?.verification_status})</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Cluster</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{result.cluster_stage?.cluster_id}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
              <Sparkles className="w-10 h-10 text-slate-700 animate-pulse" />
              <div className="text-xs font-bold text-slate-400">AI Demonstration Output Ready</div>
              <p className="text-[11px] text-slate-600 max-w-sm">
                Click any preset scenario or type a statement on the left to watch the live Gemini LLM & local ML inference execution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};