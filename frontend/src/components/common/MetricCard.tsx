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
    cyan: 'border-slate-800 text-cyan-400 hover:border-cyan-500',
    rose: 'border-slate-800 text-rose-400 hover:border-rose-500',
    amber: 'border-slate-800 text-amber-400 hover:border-amber-500',
    emerald: 'border-slate-800 text-emerald-400 hover:border-emerald-500',
    blue: 'border-slate-800 text-blue-400 hover:border-blue-500',
    purple: 'border-slate-800 text-purple-400 hover:border-purple-500',
  };

  const iconBgMap = {
    cyan: 'bg-slate-800 text-cyan-400 border border-slate-700',
    rose: 'bg-slate-800 text-rose-400 border border-slate-700',
    amber: 'bg-slate-800 text-amber-400 border border-slate-700',
    emerald: 'bg-slate-800 text-emerald-400 border border-slate-700',
    blue: 'bg-slate-800 text-blue-400 border border-slate-700',
    purple: 'bg-slate-800 text-purple-400 border border-slate-700',
  };

  return (
    <div
      onClick={onClick}
      className={`p-3.5 sm:p-4 rounded-xl bg-slate-900 ${colorMap[colorTheme]} border flex flex-col justify-between transition-colors select-none ${
        onClick ? 'cursor-pointer hover:bg-slate-850 group' : ''
      }`}
      title={onClick ? (actionLabel || `Click to inspect ${title}`) : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1 group-hover:text-white transition-colors">
          <span className="truncate">{title}</span>
          {onClick && (
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          )}
        </span>
        <div className={`p-1.5 sm:p-2 rounded-lg ${iconBgMap[colorTheme]} group-hover:scale-110 transition-transform shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-black text-white tracking-tight font-mono">{value}</div>
        <div className="flex items-center justify-between mt-1 text-[11px] gap-1">
          {subtext && <span className="text-slate-400 truncate" title={subtext}>{subtext}</span>}
          {trend && (
            <span className={`font-mono font-bold whitespace-nowrap shrink-0 ${trendPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};