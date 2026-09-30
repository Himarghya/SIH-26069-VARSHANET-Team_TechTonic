import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  colorTheme?: 'cyan' | 'rose' | 'amber' | 'emerald' | 'blue' | 'purple';
  onClick?: () => void;
  actionLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  colorTheme = 'cyan',
  onClick,
  actionLabel
}) => {
  const { isDark } = useTheme();

  // Subtle theme accents that maintain a unified, clean card background
  const themeStyles = {
    cyan: {
      topBar: 'from-sky-500 to-cyan-400',
      iconBox: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400 border-sky-500/20',
      hoverBorder: 'hover:border-sky-300/80 dark:hover:border-sky-600/50',
      trendPill: 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40'
    },
    blue: {
      topBar: 'from-blue-600 to-indigo-500',
      iconBox: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 border-blue-500/20',
      hoverBorder: 'hover:border-blue-300/80 dark:hover:border-blue-600/50',
      trendPill: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40'
    },
    emerald: {
      topBar: 'from-emerald-600 to-teal-500',
      iconBox: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-300/80 dark:hover:border-emerald-600/50',
      trendPill: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40'
    },
    rose: {
      topBar: 'from-rose-600 to-red-500',
      iconBox: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border-rose-500/20',
      hoverBorder: 'hover:border-rose-300/80 dark:hover:border-rose-600/50',
      trendPill: 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40'
    },
    amber: {
      topBar: 'from-amber-500 to-orange-500',
      iconBox: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border-amber-500/20',
      hoverBorder: 'hover:border-amber-300/80 dark:hover:border-amber-600/50',
      trendPill: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40'
    },
    purple: {
      topBar: 'from-indigo-600 to-purple-500',
      iconBox: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 border-indigo-500/20',
      hoverBorder: 'hover:border-indigo-300/80 dark:hover:border-indigo-600/50',
      trendPill: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40'
    },
  };

  const style = themeStyles[colorTheme] || themeStyles.cyan;

  return (
    <div
      onClick={onClick}
      className={`group relative p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md ${style.hoverBorder} flex flex-col justify-between transition-all duration-200 select-none active:scale-[0.99] font-sans overflow-hidden w-full ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
      title={onClick ? (actionLabel || `Click to inspect ${title}`) : undefined}
    >
      {/* Refined Top Color Accent Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${style.topBar} opacity-90 group-hover:opacity-100 transition-opacity`} />

      {/* Header: Title & Refined Glass Icon */}
      <div className="flex items-start justify-between gap-1.5 mb-2.5 w-full min-w-0 pt-0.5">
        <div className="flex items-center gap-1 min-w-0 flex-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
          <span className="truncate leading-tight">{title}</span>
          {onClick && (
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          )}
        </div>
        <div className={`p-1.5 rounded-lg ${style.iconBox} border group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Metric Value & Subtext */}
      <div className="w-full min-w-0">
        <div 
          className="text-2xl sm:text-[26px] font-extrabold tracking-tight tabular-nums font-sans truncate text-slate-900 dark:text-white"
        >
          {value}
        </div>
        
        <div className="flex items-center justify-between mt-1.5 text-[11px] sm:text-xs gap-1.5 font-sans w-full min-w-0">
          {subtext && (
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate flex-1 min-w-0" title={subtext}>
              {subtext}
            </span>
          )}
          {trend && (
            <span className={`font-semibold whitespace-nowrap shrink-0 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md border ${
              trendPositive
                ? style.trendPill
                : 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40'
            }`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};