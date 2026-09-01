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
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  colorTheme = 'cyan',
  onClick
}) => {
  const colorMap = {
    cyan: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/30 text-cyan-400 shadow-cyan-500/5 hover:border-cyan-400 hover:shadow-cyan-950/40',
    rose: 'from-rose-500/10 to-red-500/5 border-rose-500/30 text-rose-400 shadow-rose-500/5 hover:border-rose-400 hover:shadow-rose-950/40',
    amber: 'from-amber-500/10 to-yellow-500/5 border-amber-500/30 text-amber-400 shadow-amber-500/5 hover:border-amber-400 hover:shadow-amber-950/40',
    emerald: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5 hover:border-emerald-400 hover:shadow-emerald-950/40',
    blue: 'from-blue-500/10 to-indigo-500/5 border-blue-500/30 text-blue-400 shadow-blue-500/5 hover:border-blue-400 hover:shadow-blue-950/40',
    purple: 'from-purple-500/10 to-pink-500/5 border-purple-500/30 text-purple-400 shadow-purple-500/5 hover:border-purple-400 hover:shadow-purple-950/40',
  };

  const iconBgMap = {
    cyan: 'bg-cyan-950/80 text-cyan-400 border border-cyan-700/50',
    rose: 'bg-rose-950/80 text-rose-400 border border-rose-700/50',
    amber: 'bg-amber-950/80 text-amber-400 border border-amber-700/50',
    emerald: 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50',
    blue: 'bg-blue-950/80 text-blue-400 border border-blue-700/50',
    purple: 'bg-purple-950/80 text-purple-400 border border-purple-700/50',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[colorTheme]} border backdrop-blur-sm shadow-lg flex flex-col justify-between transition-all select-none ${
        onClick ? 'cursor-pointer hover:scale-[1.03] group' : ''
      }`}
      title={onClick ? `Click to inspect ${title}` : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1 group-hover:text-white transition-colors">
          <span>{title}</span>
          {onClick && <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </span>
        <div className={`p-2 rounded-lg ${iconBgMap[colorTheme]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-black text-white tracking-tight font-mono">{value}</div>
        <div className="flex items-center justify-between mt-1 text-[11px]">
          {subtext && <span className="text-slate-400">{subtext}</span>}
          {trend && (
            <span className={`font-mono font-bold ${trendPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};