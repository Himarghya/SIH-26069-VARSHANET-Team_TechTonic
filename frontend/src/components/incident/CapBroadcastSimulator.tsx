import React, { useState } from 'react';
import { Smartphone, Send, BellRing, CheckCircle2, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

interface CapBroadcastProps {
  city: string;
  state: string;
  severity: string;
  eventType: string;
  recommendations: string[];
}

export const CapBroadcastSimulator: React.FC<CapBroadcastProps> = ({
  city,
  state,
  severity,
  eventType,
  recommendations
}) => {
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  const hindiMessage = `🚨 राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA) - आपातकालीन चेतावनी 🚨\nस्थान: ${city}, ${state}\nघटना: ${eventType} (${severity} अलर्ट)\nनिर्देश: जलभराव एवं बाढ़ संभावित क्षेत्रों से तुरंत सुरक्षित स्थान पर जाएं। आपातकालीन सहायता के लिए 112 डायल करें।\nकार्रवाई: ${recommendations[0] || 'सतर्क रहें एवं आधिकारिक निर्देशों का पालन करें।'}`;
  const englishMessage = `🚨 NDMA / SDMA EMERGENCY CELL BROADCAST 🚨\nLocation: ${city}, ${state}\nEvent: ${eventType} (${severity} ALERT)\nDirective: Evacuate low-lying submerged areas immediately. Dial 112 for emergency rescue.\nImmediate Action: ${recommendations[0] || 'Take shelter on higher ground.'}`;

  const currentMsg = language === 'hi' ? hindiMessage : englishMessage;

  const handleSendBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 8000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/40">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Common Alerting Protocol (CAP) Cell Broadcast
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              National Early Warning Mobile Dissemination Gateway
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5 text-[11px]">
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded font-bold transition-all ${language === 'hi' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded font-bold transition-all ${language === 'en' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            English
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Mobile Device Mockup */}
        <div className="md:col-span-6 bg-slate-950 rounded-2xl p-3.5 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pb-2 border-b border-slate-900">
            <span>🔴 EMERGENCY BROADCAST</span>
            <span>CELL TOWER: {city.toUpperCase()}</span>
          </div>

          <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-rose-950/80 to-slate-900 border border-rose-500/60 shadow-lg space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-black">
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
              <span>SEVERE WEATHER WARNING</span>
            </div>
            <p className="text-[11px] text-slate-200 font-sans leading-relaxed whitespace-pre-line font-medium">
              {currentMsg}
            </p>
          </div>
        </div>

        {/* Transmission Controls */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Target Telephony Grid</span>
            <div className="font-mono text-emerald-400 font-bold">Pan-District Geo-Fenced Cell Towers</div>
            <div className="text-[11px] text-slate-400">Estimated Reach: ~150,000 active mobile subscribers in buffer zone.</div>
          </div>

          <button
            onClick={handleSendBroadcast}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {broadcastSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span>Dispatched to Telecom Gateways!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Transmit Geo-Fenced Cell Broadcast</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};