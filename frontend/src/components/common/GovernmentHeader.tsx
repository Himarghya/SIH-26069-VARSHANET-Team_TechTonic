import React, { useState } from 'react';
import { Bell, Search, Globe, ChevronDown, Check, Volume2, Shield } from 'lucide-react';

interface GovernmentHeaderProps {
  onSubscribeClick?: () => void;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({ onSubscribeClick }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showSubscribedToast, setShowSubscribedToast] = useState(false);

  const handleSubscribe = () => {
    setShowSubscribedToast(true);
    setTimeout(() => setShowSubscribedToast(false), 4000);
    if (onSubscribeClick) onSubscribeClick();
  };

  return (
    <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 font-sans transition-colors">
      {/* Top Utility & Accessibility Strip */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-[11px] py-1 px-3 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between text-slate-600 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Official National Disaster Alert Grid</span>
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden md:inline">Ministry of Earth Sciences / NDMA Govt of India</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <a href="#main-content" className="hover:text-blue-700 dark:hover:text-cyan-400 hidden sm:inline">
            Skip to main content
          </a>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          
          {/* Font Resizer */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setFontSize('normal');
                document.documentElement.style.fontSize = '15px';
              }}
              className={`px-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 font-bold ${fontSize === 'normal' ? 'text-blue-700 dark:text-cyan-400' : ''}`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => {
                setFontSize('large');
                document.documentElement.style.fontSize = '16px';
              }}
              className={`px-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 font-bold ${fontSize === 'large' ? 'text-blue-700 dark:text-cyan-400' : ''}`}
              title="Large Font Size"
            >
              A+
            </button>
          </div>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 hover:text-blue-700 dark:hover:text-cyan-400 font-semibold cursor-pointer"
            title="Change Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>{language === 'en' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      {/* Main Government Authority Emblem Bar */}
      <div className="px-3 sm:px-6 lg:px-8 xl:px-10 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        {/* Left: NDMA Official Emblem + Department Title */}
        <div className="flex items-center gap-3">
          {/* Circular NDMA / State Emblem Representation */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-sm shrink-0">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-amber-400/80">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-black text-blue-900 dark:text-cyan-400 leading-none tracking-tighter">NDMA</span>
                <span className="text-[6px] font-bold text-amber-700 dark:text-amber-400 leading-none">INDIA</span>
              </div>
            </div>
          </div>

          {/* Official Bilingual Title Hierarchy */}
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-[#0f2942] dark:text-white uppercase tracking-wider leading-tight">
              National Disaster Management Authority
            </h1>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              Government of India
            </p>
          </div>
        </div>

        {/* Right: 75th Azadi Amrit Mahotsav, National Seal & Subscribe Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* 75 Azadi Ka Amrit Mahotsav Badge */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-center font-serif leading-none">
              <span className="text-xs font-black text-amber-600 block">75</span>
              <span className="text-[7px] text-slate-600 dark:text-slate-400 font-sans font-bold">Azadi Ka</span>
            </div>
            <div className="text-[9px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
              <div>Amrit Mahotsav</div>
            </div>
          </div>

          {/* National Ashoka Lion Emblem Representation */}
          <div className="hidden sm:flex flex-col items-center justify-center text-center border-l border-r border-slate-200 dark:border-slate-800 px-3">
            <span className="text-sm font-black text-slate-700 dark:text-slate-300 leading-none">🏛️</span>
            <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 tracking-tighter">सत्यमेव जयते</span>
          </div>

          {/* SACHET Blue Subscribe Button */}
          <div className="relative">
            <button
              onClick={handleSubscribe}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1976d2] hover:bg-[#1565c0] text-white text-xs font-bold shadow-sm transition-all cursor-pointer select-none uppercase tracking-wide font-sans"
            >
              <Bell className="w-3.5 h-3.5 fill-white" />
              <span>Subscribe</span>
            </button>

            {showSubscribedToast && (
              <div className="absolute right-0 top-11 z-50 bg-emerald-700 text-white text-xs font-mono font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap animate-fade-in flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Subscribed to National CAP Alerts!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
