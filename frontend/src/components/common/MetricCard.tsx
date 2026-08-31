import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  colorTheme?: 'cyan' | 'rose' | 'amber' | 'emerald' | 'blue' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  colorTheme = 'cyan'
}) => {
  const colorMap = {
    cyan: 'from-cyan-500/10 to-blue-500/5 border-cyan-500/20 text-cyan-400 shadow-cyan-500/5',
    rose: 'from-rose-500/10 to-red-500/5 border-rose-500/20 text-rose-400 shadow-rose-500/5',
    amber: 'from-amber-500/10 to-yellow-500/5 border-amber-500/20 text-amber-400 shadow-amber-500/5',
    emerald: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5',
    blue: 'from-blue-500/10 to-indigo-500/5 border-blue-500/20 text-blue-400 shadow-blue-500/5',
    purple: 'from-purple-500/10 to-pink-500/5 border-purple-500/20 text-purple-400 shadow-purple-500/5',
  };

  const iconBgMap = {
    cyan: 'bg-cyan-950/80 text-cyan-400 border border-cyan-700/40',
    rose: 'bg-rose-950/80 text-rose-400 border border-rose-700/40',
    amber: 'bg-amber-950/80 text-amber-400 border border-amber-700/40',
    emerald: 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/40',
    blue: 'bg-blue-950/80 text-blue-400 border border-blue-700/40',
    purple: 'bg-purple-950/80 text-purple-400 border border-purple-700/40',
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[colorTheme]} border backdrop-blur-sm shadow-lg flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        <div className={`p-2 rounded-lg ${iconBgMap[colorTheme]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-black text-white tracking-tight font-mono">{value}</div>
        <div className="flex items-center justify-between mt-1 text-[11px]">
          {subtext && <span className="text-slate-400">{subtext}</span>}
          {trend && (
            <span className={`font-mono font-medium ${trendPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};