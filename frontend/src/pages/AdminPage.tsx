import React, { useState } from 'react';
import { VerificationQueue } from '../components/admin/VerificationQueue';
import { SystemHealthView } from '../components/admin/SystemHealthView';
import { AdminIncidentPostForm } from '../components/admin/AdminIncidentPostForm';
import { AdminDosDontsManager } from '../components/admin/AdminDosDontsManager';
import { AdminSubmissionTracker } from '../components/admin/AdminSubmissionTracker';
import { ActiveLearningConsole } from '../components/ml/ActiveLearningConsole';
import { WeatherReport, SystemHealth } from '../types';
import { ShieldCheck, Activity, Send, RefreshCw, BookOpen, Search } from 'lucide-react';

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
  const [adminTab, setAdminTab] = useState<'dispatch_tracker' | 'dos_donts' | 'verification' | 'active_learning' | 'health'>('dispatch_tracker');
  const [dispatchSubTab, setDispatchSubTab] = useState<'post' | 'tracking'>('post');

  return (
    <div className="space-y-6 font-sans">
      {/* Admin Navigation Sub-Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">National Operations Command &amp; Admin Panel</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Publish pre-verified official incidents, track &amp; verify citizen submissions, author disaster Do's &amp; Don'ts guidelines, audit active learning loops, and monitor big data telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex-wrap">
          <button
            onClick={() => setAdminTab('dispatch_tracker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'dispatch_tracker'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Official Incident Post &amp; Tracker
          </button>

          <button
            onClick={() => setAdminTab('dos_donts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'dos_donts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Do's &amp; Don'ts Hub
          </button>

          <button
            onClick={() => setAdminTab('verification')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'verification'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Citizen Queue ({pendingReports.length})
          </button>

          <button
            onClick={() => setAdminTab('active_learning')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'active_learning'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Active Learning &amp; Dynamic Sources
          </button>

          <button
            onClick={() => setAdminTab('health')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'health'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Telemetry &amp; Pipeline
          </button>
        </div>
      </div>

      {/* Sub-view switcher */}
      {adminTab === 'dispatch_tracker' && (
        <div className="space-y-4">
          {/* Sub-navigation to easily switch between Post Form and Track Submissions */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDispatchSubTab('post')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dispatchSubTab === 'post'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Official Incident Post (Pre-Verified)</span>
              </button>

              <button
                onClick={() => setDispatchSubTab('tracking')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dispatchSubTab === 'tracking'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Submissions &amp; Audit</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 pr-2 hidden md:block font-medium">
              Publish official incident alerts &amp; audit live citizen submissions together
            </div>
          </div>

          {dispatchSubTab === 'post' ? (
            <AdminIncidentPostForm
              onReportPublished={onRefreshData}
              onNavigateToMap={() => onNavigateToTab && onNavigateToTab('map')}
              onViewTracking={() => setDispatchSubTab('tracking')}
            />
          ) : (
            <AdminSubmissionTracker
              onSelectReport={onSelectReport}
              onNavigateToMap={() => onNavigateToTab && onNavigateToTab('map')}
            />
          )}
        </div>
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