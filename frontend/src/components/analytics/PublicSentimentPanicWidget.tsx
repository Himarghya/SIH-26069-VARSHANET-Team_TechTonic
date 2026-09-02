import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertOctagon, TrendingUp, RefreshCw, Hash, Users, Sparkles } from 'lucide-react';
import { fetchSentimentPanicMetrics } from '../../services/api';

export const PublicSentimentPanicWidget: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSentimentPanicMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Sentiment fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!metrics) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/40">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Real-Time Social Sentiment & Public Panic Index
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Live NLP analysis across #IMD, #MumbaiRains, and crowdsourced emergency chatter
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all cursor-pointer border border-slate-700"
          title="Refresh Sentiment Stream"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Metric 1: Panic Score */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">PANIC INDEX</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              {metrics.public_urgency_tier}
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-amber-400">
            {metrics.panic_index} <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Public sentiment: <strong className="text-white">{metrics.sentiment_classification.replace('_', ' ')}</strong>
          </p>
        </div>

        {/* Metric 2: SOS Intensity */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">EMERGENCY SOS INTENSITY</span>
            <span className="text-[10px] font-mono font-bold text-cyan-300">
              {metrics.social_chatter_volume_per_min} posts/min
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-cyan-300">
            {metrics.emergency_sos_intensity_pct}%
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Proportion of messages containing direct calls for rescue or waterlogging distress
          </p>
        </div>

        {/* Metric 3: Trending Hashtags */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-mono font-bold block">TOP TRENDING HASHTAGS</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {metrics.top_trending_hashtags.map((h: any, i: number) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1"
              >
                <Hash className="w-2.5 h-2.5 text-slate-500" />
                <span>{h.tag.replace('#', '')}</span>
                <span className="text-[9px] text-slate-500">({h.volume})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};