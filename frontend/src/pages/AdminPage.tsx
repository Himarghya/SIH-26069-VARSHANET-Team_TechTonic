import React, { useState } from 'react';
import { VerificationQueue } from '../components/admin/VerificationQueue';
import { SystemHealthView } from '../components/admin/SystemHealthView';
import { AdminIncidentPostForm } from '../components/admin/AdminIncidentPostForm';
import { AdminDosDontsManager } from '../components/admin/AdminDosDontsManager';
import { AdminSubmissionTracker } from '../components/admin/AdminSubmissionTracker';
import { ActiveLearningConsole } from '../components/ml/ActiveLearningConsole';
import { WeatherReport, SystemHealth } from '../types';
import { ShieldCheck, Activity, Send, RefreshCw, BookOpen, Search, Sparkles } from 'lucide-react';

interface AdminPageProps {
  pendingReports: WeatherReport[];
  systemHealth: SystemHealth | null;
  onRefreshData: () => void;
  onSelectReport: (report: WeatherReport) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  pendingReports,
  systemHealth,
  onRefreshData,
  onSelectReport,
  onNavigateToTab
}) => {
  const [adminTab, setAdminTab] = useState<'post' | 'tracking' | 'dos_donts' | 'verification' | 'active_learning' | 'health'>('post');

  return (
    <div className="space-y-6 font-sans">
      {/* Admin Navigation Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              National Operations Command &amp; Admin Hub
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              NDMA Ops
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Publish official alerts, track citizen submission dossiers, author disaster Do's &amp; Don'ts guidelines, audit active learning, and monitor telemetry.
          </p>
        </div>

        {/* Enhanced Standout Action Navigation Bar */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-950/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex-wrap shadow-inner">
          
          {/* 🔍 STANDOUT TRACK SUBMISSIONS ACTION */}
          <button
            onClick={() => setAdminTab('tracking')}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer shrink-0 ${
              adminTab === 'tracking'
                ? 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 text-white shadow-md shadow-cyan-900/25 ring-2 ring-cyan-400/40 scale-[1.02]'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 shadow-xs'
            }`}
          >
            <span className={`p-1 rounded-lg ${adminTab === 'tracking' ? 'bg-white/20 text-white' : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'}`}>
              <Search className="w-3.5 h-3.5" />
            </span>
            <span className="tracking-tight uppercase font-mono text-[11px]">Track Submissions</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </button>

          {/* Official Incident Post */}
          <button
            onClick={() => setAdminTab('post')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              adminTab === 'post'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-rose-500 group-hover:text-rose-400" />
            <span>Official Post</span>
          </button>

          {/* Do's & Don'ts Hub */}
          <button
            onClick={() => setAdminTab('dos_donts')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              adminTab === 'dos_donts'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Do's &amp; Don'ts</span>
          </button>

          {/* Citizen Queue */}
          <button
            onClick={() => setAdminTab('verification')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              adminTab === 'verification'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Citizen Queue ({pendingReports.length})</span>
          </button>

          {/* Active Learning & Dynamic Sources */}
          <button
            onClick={() => setAdminTab('active_learning')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              adminTab === 'active_learning'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-500" />
            <span>Active Learning</span>
          </button>

          {/* Telemetry & Pipeline */}
          <button
            onClick={() => setAdminTab('health')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              adminTab === 'health'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Sub-view switcher */}
      {adminTab === 'post' && (
        <AdminIncidentPostForm
          onReportPublished={onRefreshData}
          onNavigateToMap={() => onNavigateToTab && onNavigateToTab('map')}
        />
      )}

      {adminTab === 'tracking' && (
        <AdminSubmissionTracker
          onSelectReport={onSelectReport}
          onNavigateToMap={() => onNavigateToTab && onNavigateToTab('map')}
        />
      )}

      {adminTab === 'dos_donts' && (
        <AdminDosDontsManager />
      )}

      {adminTab === 'verification' && (
        <VerificationQueue
          pendingReports={pendingReports}
          onReportActionDone={onRefreshData}
          onSelectReport={onSelectReport}
        />
      )}

      {adminTab === 'active_learning' && (
        <ActiveLearningConsole />
      )}

      {adminTab === 'health' && (
        <SystemHealthView health={systemHealth} />
      )}
    </div>
  );
};