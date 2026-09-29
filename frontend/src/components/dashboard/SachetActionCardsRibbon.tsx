import React from 'react';
import { MapPin, Target, AlertTriangle, CloudSun, Radio } from 'lucide-react';

interface SachetActionCardsRibbonProps {
  activeCard: 'current_loc' | 'all_india' | 'state_wise' | 'forecast';
  onSelectCard: (card: 'current_loc' | 'all_india' | 'state_wise' | 'forecast') => void;
  onAutoLocate?: () => void;
  isLocating?: boolean;
}

export const SachetActionCardsRibbon: React.FC<SachetActionCardsRibbonProps> = ({
  activeCard = 'all_india',
  onSelectCard,
  onAutoLocate,
  isLocating = false
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-sans select-none">
      {/* 1. CURRENT LOCATION CAP ALERT */}
      <button
        type="button"
        onClick={() => {
          onSelectCard('current_loc');
          if (onAutoLocate) onAutoLocate();
        }}
        className={`p-3.5 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer border ${
          activeCard === 'current_loc'
            ? 'bg-blue-50/80 dark:bg-slate-900 border-[#1976d2] ring-2 ring-[#1976d2]/30 shadow-md'
            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-xs'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <MapPin className={`w-4.5 h-4.5 ${isLocating ? 'animate-bounce' : ''}`} />
        </div>
        <span className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-white leading-tight">
          {isLocating ? 'Locating GPS...' : 'Current Location CAP Alert'}
        </span>
      </button>

      {/* 2. ALL INDIA CAP ALERT (Default active in SACHET) */}
      <button
        type="button"
        onClick={() => onSelectCard('all_india')}
        className={`p-3.5 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer border ${
          activeCard === 'all_india'
            ? 'bg-blue-50/80 dark:bg-slate-900 border-[#1976d2] ring-2 ring-[#1976d2]/30 shadow-md'
            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-xs'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-[#1976d2] dark:text-cyan-400">
          <Target className="w-4.5 h-4.5" />
        </div>
        <span className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-white leading-tight">
          All India CAP Alert
        </span>
      </button>

      {/* 3. STATE WISE CAP ALERT */}
      <button
        type="button"
        onClick={() => onSelectCard('state_wise')}
        className={`p-3.5 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer border ${
          activeCard === 'state_wise'
            ? 'bg-blue-50/80 dark:bg-slate-900 border-[#1976d2] ring-2 ring-[#1976d2]/30 shadow-md'
            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-xs'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-4.5 h-4.5" />
        </div>
        <span className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-white leading-tight">
          State Wise CAP Alert
        </span>
      </button>

      {/* 4. FORECAST & NOWCAST */}
      <button
        type="button"
        onClick={() => onSelectCard('forecast')}
        className={`p-3.5 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer border ${
          activeCard === 'forecast'
            ? 'bg-blue-50/80 dark:bg-slate-900 border-[#1976d2] ring-2 ring-[#1976d2]/30 shadow-md'
            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-xs'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CloudSun className="w-4.5 h-4.5" />
        </div>
        <span className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-white leading-tight">
          Forecast &amp; Nowcast
        </span>
      </button>
    </div>
  );
};
