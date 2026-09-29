import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

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
  const colorMap = {
    cyan: 'bg-white dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-blue-500/5 border-slate-200 dark:border-cyan-500/30 hover:border-cyan-500/60 shadow-xs dark:shadow-cyan-950/40',
    rose: 'bg-white dark:bg-gradient-to-br dark:from-rose-500/10 dark:to-red-500/5 border-slate-200 dark:border-rose-500/30 hover:border-rose-500/60 shadow-xs dark:shadow-rose-950/40',
    amber: 'bg-white dark:bg-gradient-to-br dark:from-amber-500/10 dark:to-yellow-500/5 border-slate-200 dark:border-amber-500/30 hover:border-amber-500/60 shadow-xs dark:shadow-amber-950/40',
    emerald: 'bg-white dark:bg-gradient-to-br dark:from-emerald-500/10 dark:to-teal-500/5 border-slate-200 dark:border-emerald-500/30 hover:border-emerald-500/60 shadow-xs dark:shadow-emerald-950/40',
    blue: 'bg-white dark:bg-gradient-to-br dark:from-blue-500/10 dark:to-indigo-500/5 border-slate-200 dark:border-blue-500/30 hover:border-blue-500/60 shadow-xs dark:shadow-blue-950/40',
    purple: 'bg-white dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-pink-500/5 border-slate-200 dark:border-purple-500/30 hover:border-purple-500/60 shadow-xs dark:shadow-purple-950/40',
  };

  const iconBgMap = {
    cyan: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-700/50',
    rose: 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-700/50',
    amber: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50',
    blue: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700/50',
    purple: 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700/50',
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
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase flex items-center gap-1 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
          <span className="truncate">{title}</span>
          {onClick && (
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          )}
        </span>
        <div className={`p-1.5 sm:p-2 rounded-md ${iconBgMap[colorTheme]} group-hover:scale-105 transition-transform shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight tabular-nums font-sans">{value}</div>
        <div className="flex items-center justify-between mt-1 text-[11px] gap-1 font-sans">
          {subtext && <span className="text-slate-500 dark:text-slate-400 truncate" title={subtext}>{subtext}</span>}
          {trend && (
            <span className={`font-semibold whitespace-nowrap shrink-0 ${
              trendPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};