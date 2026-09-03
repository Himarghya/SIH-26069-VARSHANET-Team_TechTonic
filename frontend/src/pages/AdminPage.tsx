import React, { useState } from 'react';
import { VerificationQueue } from '../components/admin/VerificationQueue';
import { SystemHealthView } from '../components/admin/SystemHealthView';
import { AdminIncidentPostForm } from '../components/admin/AdminIncidentPostForm';
import { ActiveLearningConsole } from '../components/ml/ActiveLearningConsole';
import { WeatherReport, SystemHealth } from '../types';
import { ShieldCheck, Activity, Send, RefreshCw } from 'lucide-react';

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
  const [adminTab, setAdminTab] = useState<'post' | 'verification' | 'active_learning' | 'health'>('post');

  return (
    <div className="space-y-6">
      {/* Admin Navigation Sub-Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">National Operations Command &amp; Admin Panel</h1>
          <p className="text-xs text-slate-400">
            Publish pre-verified official incidents, review citizen verification queues, inspect active learning feedback loops, and monitor big data telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 flex-wrap">
          <button
            onClick={() => setAdminTab('post')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'post'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Official Incident Post (Pre-Verified)
          </button>

          <button
            onClick={() => setAdminTab('verification')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'verification'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
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
                : 'text-slate-400 hover:text-slate-200'
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
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Telemetry &amp; Pipeline
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