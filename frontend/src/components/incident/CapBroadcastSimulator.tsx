import React, { useState } from 'react';
import { Smartphone, Send, BellRing, CheckCircle2, ShieldAlert, Sparkles, MessageSquare, Info, AlertTriangle, Radio, Share2, Mail, ExternalLink } from 'lucide-react';
import { broadcastAlertToX } from '../../services/api';

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
  const [activeTab, setActiveTab] = useState<'cell_broadcast' | 'x_twitter'>('cell_broadcast');
  const [isPostingX, setIsPostingX] = useState(false);
  const [xPostSuccess, setXPostSuccess] = useState(false);

  const normalizedSeverity = (severity || 'MODERATE').toUpperCase();
  const isCritical = normalizedSeverity === 'CRITICAL';
  const isHigh = normalizedSeverity === 'HIGH';
  const isModerate = normalizedSeverity === 'MODERATE';

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
    : 'मौसम की स्थिति पर नजर रखें एवं आधिकारिक निर्देशों का पालन करें।';

  const englishDirective = isCritical
    ? 'Evacuate low-lying submerged corridors immediately. Dial 112 for emergency rescue.'
    : isHigh
    ? 'Severe weather conditions expected. Avoid non-essential travel and monitor flood zones.'
    : 'Monitor official meteorological updates. Follow civic safety guidelines.';

  const hindiMessage = `📢 राष्ट्रीय आपदा प्रबंधन (NDMA) - ${alertTheme.title}\nस्थान: ${city}, ${state}\nघटना: ${eventType} (AI स्तर: ${normalizedSeverity})\nनिर्देश: ${hindiDirective}\nकार्रवाई: ${recommendations[0] || 'सतर्क रहें एवं आधिकारिक निर्देशों का पालन करें।'}`;
  const englishMessage = `📢 NDMA / SDMA ${alertTheme.title}\nLocation: ${city}, ${state}\nEvent: ${eventType} (AI Level: ${normalizedSeverity})\nDirective: ${englishDirective}\nImmediate Action: ${recommendations[0] || 'Follow standard civic safety guidelines.'}`;

  const currentMsg = language === 'hi' ? hindiMessage : englishMessage;

  // Formatted X (Twitter) Alert Tweet
  const cleanCity = (city || 'District').replace(/\s+/g, '');
  const xTweetText = `🚨 🔴 [VARSHANET 2.0 RED HIGH ALERT]\n📍 ${city}, ${state}\n⚠️ Hazard: ${eventType} (${normalizedSeverity})\n📢 Directive: ${englishDirective}\n⏱️ Live Broadcast | #IMD #${cleanCity}Weather #RedAlert #NDRF #VARSHANET`;
  const xIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xTweetText)}`;

  const handleSendCellBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 8000);
  };

  const handleBroadcastToX = async () => {
    setIsPostingX(true);
    try {
      await broadcastAlertToX({
        city,
        state,
        event_type: eventType,
        severity: normalizedSeverity,
        directive: englishDirective
      });

      // Open Twitter Web Intent
      window.open(xIntentUrl, '_blank', 'noopener,noreferrer');

      setXPostSuccess(true);
      setTimeout(() => setXPostSuccess(false), 8000);
    } catch (err) {
      console.error('X Broadcast error', err);
    } finally {
      setIsPostingX(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      {/* Top Header & Broadcast Channel Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              National Emergency Gateway & Social Broadcaster
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              CAP Cell Broadcast Siren & Automated 𝕏 (Twitter) Dispatch
            </p>
          </div>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1 text-xs">
          <button
            onClick={() => setActiveTab('cell_broadcast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'cell_broadcast' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Cell Broadcast</span>
          </button>
          <button
            onClick={() => setActiveTab('x_twitter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'x_twitter' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="font-black text-sm leading-none">𝕏</span>
            <span>Twitter / 𝕏 Gateway</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CAP Cell Broadcast */}
      {activeTab === 'cell_broadcast' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-mono">
              Language Select:
            </span>
            <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5 text-[11px]">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${language === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${language === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                English
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Mobile Device Mockup */}
            <div className="md:col-span-6 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pb-2 border-b border-slate-900">
                <span>BSNL / JIO / AIRTEL LTE-B</span>
                <span>EMERGENCY BROADCAST</span>
              </div>
              <div className="p-3 mt-3 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-100 text-xs leading-relaxed whitespace-pre-line font-mono">
                {currentMsg}
              </div>
            </div>

            {/* Broadcast Controls */}
            <div className="md:col-span-6 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Transmits geofenced siren alerts via C-DoT / SACHET towers directly to all mobile handsets in <strong>{city}, {state}</strong> without network congestion.
              </p>

              {broadcastSent ? (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cell Broadcast Dispatched to 184 Cell Towers!</span>
                </div>
              ) : (
                <button
                  onClick={handleSendCellBroadcast}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Cell Siren Alert</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Automated X (Twitter) Broadcaster */}
      {activeTab === 'x_twitter' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-mono">
                Emergency Dispatch Notification Address: <strong className="text-white">Somadas7803@gmail.com</strong>
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
              ✓ X DISPATCH ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Tweet Preview Card */}
            <div className="md:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner space-y-2">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                    VN
                  </div>
                  <div>
                    <strong className="text-white block leading-tight text-xs">VARSHANET National Early Warning</strong>
                    <span className="text-[10px] text-slate-500 font-mono">@VarshaNetIndia • Official</span>
                  </div>
                </div>
                <span className="font-black text-sm text-slate-400">𝕏</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-line">
                {xTweetText}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-5 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Broadcasts official Red Warning bulletins to <strong>X (Twitter)</strong> with verified hashtags and dispatches copies to <strong>Somadas7803@gmail.com</strong>.
              </p>

              {xPostSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-mono flex items-center gap-2 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Posted to 𝕏 & Notified Somadas7803@gmail.com!</span>
                </div>
              ) : (
                <button
                  onClick={handleBroadcastToX}
                  disabled={isPostingX}
                  className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-slate-900 border border-slate-700 hover:border-cyan-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="font-black text-sm">𝕏</span>
                  <span>{isPostingX ? 'Broadcasting...' : '1-Click Broadcast to 𝕏 (Twitter)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};