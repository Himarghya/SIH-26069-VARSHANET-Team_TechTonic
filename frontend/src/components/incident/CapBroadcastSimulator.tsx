import React, { useState } from 'react';
import { Smartphone, Send, BellRing, CheckCircle2, ShieldAlert, Sparkles, MessageSquare, Info, AlertTriangle } from 'lucide-react';

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
  severity = 'MODERATE',
  eventType,
  recommendations
}) => {
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');

  const normalizedSeverity = (severity || 'MODERATE').toUpperCase();
  const isCritical = normalizedSeverity === 'CRITICAL';
  const isHigh = normalizedSeverity === 'HIGH';
  const isModerate = normalizedSeverity === 'MODERATE';
  const isLow = normalizedSeverity === 'LOW';

  // AI-judged header badge & color schemes
  const alertTheme = isCritical
    ? { title: 'CRITICAL DISASTER EMERGENCY ALERT', color: 'rose', bg: 'from-rose-950/80 to-slate-900', border: 'border-rose-500/60', text: 'text-rose-400', icon: BellRing }
    : isHigh
    ? { title: 'SEVERE WEATHER WARNING', color: 'amber', bg: 'from-amber-950/80 to-slate-900', border: 'border-amber-500/60', text: 'text-amber-400', icon: AlertTriangle }
    : isModerate
    ? { title: 'WEATHER WATCH BULLETIN', color: 'cyan', bg: 'from-cyan-950/80 to-slate-900', border: 'border-cyan-500/60', text: 'text-cyan-400', icon: Info }
    : { title: 'ROUTINE WEATHER ADVISORY', color: 'emerald', bg: 'from-emerald-950/80 to-slate-900', border: 'border-emerald-500/60', text: 'text-emerald-400', icon: CheckCircle2 };

  const hindiDirective = isCritical
    ? 'जलभराव एवं बाढ़ संभावित क्षेत्रों से तुरंत सुरक्षित स्थान पर जाएं। आपातकालीन सहायता के लिए 112 डायल करें।'
    : isHigh
    ? 'भारी वर्षा एवं जलभराव की संभावना है। अनावश्यक यात्रा से बचें एवं सावधान रहें।'
    : isModerate
    ? 'मौसम सामान्य है परंतु जल निकासी की निगरानी रखें। आधिकारिक मौसम अपडेट देखते रहें।'
    : 'मौसम की स्थिति सामान्य है। कोई आपातकालीन खतरा नहीं है।';

  const englishDirective = isCritical
    ? 'Evacuate low-lying submerged areas immediately. Dial 112 for emergency rescue.'
    : isHigh
    ? 'Severe weather conditions expected. Avoid non-essential travel and monitor flood zones.'
    : isModerate
    ? 'Moderate weather activity observed. Keep municipal drainage clear and monitor updates.'
    : 'Routine conditions. No immediate emergency hazard detected.';

  const hindiMessage = `📢 राष्ट्रीय आपदा प्रबंधन (NDMA) - ${alertTheme.title}\nस्थान: ${city}, ${state}\nघटना: ${eventType} (AI स्तर: ${normalizedSeverity})\nनिर्देश: ${hindiDirective}\nकार्रवाई: ${recommendations[0] || 'सतर्क रहें एवं आधिकारिक निर्देशों का पालन करें।'}`;
  const englishMessage = `📢 NDMA / SDMA ${alertTheme.title}\nLocation: ${city}, ${state}\nEvent: ${eventType} (AI Level: ${normalizedSeverity})\nDirective: ${englishDirective}\nImmediate Action: ${recommendations[0] || 'Follow standard civic safety guidelines.'}`;

  const currentMsg = language === 'hi' ? hindiMessage : englishMessage;
  const AlertIcon = alertTheme.icon;

  const handleSendBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 8000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl bg-${alertTheme.color}-950 text-${alertTheme.color}-400 border border-${alertTheme.color}-800/40`}>
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Common Alerting Protocol (CAP) Cell Broadcast
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              National Early Warning Mobile Gateway • <strong className={alertTheme.text}>AI Judged: {normalizedSeverity}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5 text-[11px]">
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${language === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${language === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            English
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Mobile Device Mockup */}
        <div className="md:col-span-6 bg-slate-950 rounded-2xl p-3.5 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pb-2 border-b border-slate-900">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-500 animate-ping' : isHigh ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
              <span>{isCritical ? 'EMERGENCY BROADCAST' : 'CIVIC ALERT BROADCAST'}</span>
            </span>
            <span>CELL TOWER: {city.toUpperCase()}</span>
          </div>

          <div className={`mt-2.5 p-3 rounded-xl bg-gradient-to-r ${alertTheme.bg} border ${alertTheme.border} shadow-lg space-y-1.5`}>
            <div className={`flex items-center gap-1.5 ${alertTheme.text} text-xs font-black`}>
              <AlertIcon className="w-3.5 h-3.5 animate-pulse" />
              <span>{alertTheme.title}</span>
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
            <div className="font-mono text-emerald-400 font-bold">Pan-District Geo-Fenced Cell Towers ({city})</div>
            <div className="text-[11px] text-slate-400">Estimated Reach: ~150,000 active mobile subscribers in buffer zone.</div>
          </div>

          <button
            onClick={handleSendBroadcast}
            className={`w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCritical ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-rose-950/40' :
              isHigh ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-950/40' :
              'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-950/40'
            }`}
          >
            {broadcastSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span>Dispatched to Telecom Gateways!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Transmit Geo-Fenced {normalizedSeverity} Alert</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};