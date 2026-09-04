import React, { useState } from 'react';
import { Volume2, VolumeX, Radio, Play, Square, Languages, Info, AlertTriangle, BellRing } from 'lucide-react';

interface AudioBroadcastProps {
  eventTitle: string;
  city: string;
  state: string;
  severity: string;
  priority: string;
  recommendations: string[];
}

export const AudioEmergencyBroadcast: React.FC<AudioBroadcastProps> = ({
  eventTitle,
  city,
  state,
  severity = 'MODERATE',
  priority,
  recommendations
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  const normalizedSeverity = (severity || 'MODERATE').toUpperCase();
  const isCritical = normalizedSeverity === 'CRITICAL';
  const isHigh = normalizedSeverity === 'HIGH';
  const isModerate = normalizedSeverity === 'MODERATE';

  const getBroadcastText = () => {
    if (language === 'hi') {
      if (isCritical) {
        return `आपातकालीन चेतावनी! राष्ट्रीय मौसम आपदा नियंत्रण कक्ष। ${city}, ${state} में गंभीर आपातकालीन स्थिति। प्राथमिकता ${priority}। जलभराव वाले क्षेत्रों से तुरंत सुरक्षित स्थान पर जाएं। त्वरित कार्रवाई: ${recommendations[0] || 'आपातकाल हेतु 112 डायल करें।'}`;
      } else if (isHigh) {
        return `मौसम चेतावनी! राष्ट्रीय मौसम नियंत्रण कक्ष। ${city}, ${state} में भारी मौसमी चेतावनी। प्राथमिकता ${priority}। जलभराव की संभावना है। नागरिक सतर्क रहें। त्वरित कार्रवाई: ${recommendations[0] || 'सावधानी बरतें।'}`;
      } else if (isModerate) {
        return `मौसम निगरानी बुलेटिन! ${city}, ${state} में मध्यम स्तर की मौसम गतिविधि दर्ज की गई है। प्राथमिकता ${priority}। नागरिक सामान्य सावधानियां बरतें।`;
      } else {
        return `मौसम अद्यतन। ${city}, ${state} में स्थिति सामान्य है। कोई आपातकालीन खतरा नहीं है।`;
      }
    }
    
    // English
    if (isCritical) {
      return `CRITICAL EMERGENCY ALERT! National Weather Disaster Control Grid. Critical weather emergency active in ${city}, ${state}. Priority ${priority}. Evacuate low-lying areas immediately. Action: ${recommendations[0] || 'Dial 112 for emergency rescue.'}`;
    } else if (isHigh) {
      return `SEVERE WEATHER WARNING! National Weather Control Grid. High weather alert in ${city}, ${state}. Priority ${priority}. Exercise caution around waterlogged zones. Action: ${recommendations[0] || 'Follow local safety guidelines.'}`;
    } else if (isModerate) {
      return `WEATHER WATCH BULLETIN. Moderate weather activity observed in ${city}, ${state}. Priority ${priority}. Maintain municipal drainage awareness.`;
    } else {
      return `ROUTINE WEATHER ADVISORY. Weather conditions in ${city}, ${state} are normal. No emergency hazard detected.`;
    }
  };

  const playSirenAndSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    // Play synthetic radar chime via Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isCritical ? 880 : isHigh ? 660 : 520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio Context tone:', e);
    }

    const utterance = new SpeechSynthesisUtterance(getBroadcastText());
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopBroadcast = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg ${
      isCritical ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border-rose-800/40' :
      isHigh ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border-amber-800/40' :
      'bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border-cyan-800/40'
    }`}>
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <div className={`p-2 rounded-lg shrink-0 mt-0.5 sm:mt-0 ${
          isPlaying ? 'bg-rose-600 text-white animate-pulse' : 
          isCritical ? 'bg-slate-900 text-rose-400 border border-rose-900/50' :
          isHigh ? 'bg-slate-900 text-amber-400 border border-amber-900/50' :
          'bg-slate-900 text-cyan-400 border border-cyan-900/50'
        }`}>
          <Radio className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              {isCritical ? 'Emergency Radio Broadcast (TTS)' : 'Radio Bulletin Broadcast (TTS)'}
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
              isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' :
              isHigh ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-cyan-950 text-cyan-300 border border-cyan-800'
            }`}>
              AI Judged: {normalizedSeverity}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans mt-0.5">
            Synthesizes dynamic voice bulletins tailored to actual AI risk severity.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
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

        {isPlaying ? (
          <button
            onClick={stopBroadcast}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Audio</span>
          </button>
        ) : (
          <button
            onClick={playSirenAndSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold transition-all shadow-md cursor-pointer ${
              isCritical ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-rose-950/40' :
              isHigh ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-950/40' :
              'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-950/40'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Broadcast Siren & Audio</span>
          </button>
        )}
      </div>
    </div>
  );
};