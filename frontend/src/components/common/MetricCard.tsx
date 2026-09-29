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

  const colorMap = {
    cyan: 'bg-cyan-50/80 dark:bg-cyan-950/20 border-cyan-300 dark:border-cyan-500/30 hover:border-cyan-500/60 shadow-xs',
    blue: 'bg-blue-50/80 dark:bg-blue-950/20 border-blue-300 dark:border-blue-500/30 hover:border-blue-500/60 shadow-xs',
    emerald: 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-500/60 shadow-xs',
    rose: 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/30 hover:border-rose-500/60 shadow-xs',
    amber: 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/30 hover:border-amber-500/60 shadow-xs',
    purple: 'bg-purple-50/80 dark:bg-purple-950/20 border-purple-300 dark:border-purple-500/30 hover:border-purple-500/60 shadow-xs',
  };

  const iconBgMap = {
    cyan: 'bg-cyan-600 text-white dark:bg-cyan-950/80 dark:text-cyan-400 border border-cyan-500 dark:border-cyan-700/50',
    blue: 'bg-blue-600 text-white dark:bg-blue-950/80 dark:text-blue-400 border border-blue-500 dark:border-blue-700/50',
    emerald: 'bg-emerald-600 text-white dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-700/50',
    rose: 'bg-rose-600 text-white dark:bg-rose-950/80 dark:text-rose-400 border border-rose-500 dark:border-rose-700/50',
    amber: 'bg-amber-600 text-white dark:bg-amber-950/80 dark:text-amber-400 border border-amber-500 dark:border-amber-700/50',
    purple: 'bg-purple-600 text-white dark:bg-purple-950/80 dark:text-purple-400 border border-purple-500 dark:border-purple-700/50',
  };

  return (
    <div
      onClick={onClick}
      className={`p-3.5 sm:p-4 rounded-lg ${colorMap[colorTheme]} border backdrop-blur-sm shadow-xs flex flex-col justify-between transition-all select-none active:scale-[0.99] font-sans ${
        onClick ? 'cursor-pointer group' : ''
      }`}
      title={onClick ? (actionLabel || `Click to inspect ${title}`) : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 tracking-wider uppercase flex items-center gap-1 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
          <span className="truncate">{title}</span>
          {onClick && (
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          )}
        </span>
        <div className={`p-1.5 sm:p-2 rounded-md ${iconBgMap[colorTheme]} group-hover:scale-105 transition-transform shrink-0 shadow-xs`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-1">
        <div 
          className="text-3xl font-black tracking-tight tabular-nums font-sans"
          style={{ color: isDark ? '#ffffff' : '#0f172a' }}
        >
          {value}
        </div>
        <div className="flex items-center justify-between mt-1 text-xs gap-1 font-sans">
          {subtext && <span className="text-slate-600 dark:text-slate-400 font-semibold truncate" title={subtext}>{subtext}</span>}
          {trend && (
            <span className={`font-bold whitespace-nowrap shrink-0 ${
              trendPositive
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-rose-700 dark:text-rose-400'
            }`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};