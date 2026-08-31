import React, { useState } from 'react';
import { Volume2, VolumeX, Radio, Play, Square, Languages } from 'lucide-react';

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
  severity,
  priority,
  recommendations
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  const getBroadcastText = () => {
    if (language === 'hi') {
      return `चेतावनी! राष्ट्रीय मौसम आपदा नियंत्रण कक्ष। ${city}, ${state} में ${severity} स्तर की गंभीर मौसम आपदा। प्राथमिकता ${priority}। नागरिकों से अनुरोध है कि जलभराव वाले क्षेत्रों से दूर रहें और राज्य आपदा प्रबंधन प्राधिकरण के निर्देशों का पालन करें। त्वरित कार्रवाई: ${recommendations[0] || 'सुरक्षित स्थान पर रहें।'}`;
    }
    return `EMERGENCY ALERT! National Weather Disaster Control Grid. ${severity} severity weather emergency active in ${city}, ${state}. Priority ${priority}. Citizens are advised to avoid flooded underpasses and stay tuned to SDMA directives. Immediate Action: ${recommendations[0] || 'Take immediate shelter.'}`;
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
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
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
    <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-800/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-lg ${isPlaying ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 text-rose-400 border border-rose-900/50'}`}>
          <Radio className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              Emergency Radio Broadcast (TTS)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              AIR / DD News Style
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans">
            Synthesizes instant multi-lingual voice warning bulletin for radio & cell-broadcast.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Broadcast Siren & Audio</span>
          </button>
        )}
      </div>
    </div>
  );
};