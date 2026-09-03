import React, { useState } from 'react';
import { Cpu, Network, TrendingUp, ShieldCheck, RefreshCw, Layers, Compass, Sparkles } from 'lucide-react';
import { MlArchitectureDiagram } from '../components/ml/MlArchitectureDiagram';
import { MultimodalFusionInspector } from '../components/ml/MultimodalFusionInspector';
import { SeverityForecastRadar } from '../components/ml/SeverityForecastRadar';
import { ShapWaterfallInspector } from '../components/ml/ShapWaterfallInspector';
import { ActiveLearningConsole } from '../components/ml/ActiveLearningConsole';

export const MlIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'multimodal' | 'forecasting' | 'shap' | 'active_learning'>('architecture');

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Banner & Sub-Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">
              VARSHANET 2.0 Enterprise ML Intelligence Layer
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Multimodal Verification &bull; 1–3h Predictive Escalation &bull; Explainable VayuScore™ &bull; Active Learning
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ML Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('multimodal')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'multimodal' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Multimodal Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('forecasting')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'forecasting' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Severity Forecasting</span>
          </button>

          <button
            onClick={() => setActiveTab('shap')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'shap' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VayuScore™ SHAP</span>
          </button>

          <button
            onClick={() => setActiveTab('active_learning')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'active_learning' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Active Learning &amp; Sources</span>
          </button>
        </div>
      </div>

      {/* Render Active Sub-View */}
      {activeTab === 'architecture' && <MlArchitectureDiagram />}
      {activeTab === 'multimodal' && <MultimodalFusionInspector />}
      {activeTab === 'forecasting' && <SeverityForecastRadar />}
      {activeTab === 'shap' && <ShapWaterfallInspector />}
      {activeTab === 'active_learning' && <ActiveLearningConsole />}
    </div>
  );
};