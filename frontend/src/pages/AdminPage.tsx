import React, { useState } from 'react';
import { VerificationQueue } from '../components/admin/VerificationQueue';
import { SystemHealthView } from '../components/admin/SystemHealthView';
import { WeatherReport, SystemHealth } from '../types';
import { ShieldCheck, Activity, Database, Server } from 'lucide-react';

interface AdminPageProps {
  pendingReports: WeatherReport[];
  systemHealth: SystemHealth | null;
  onRefreshData: () => void;
  onSelectReport: (report: WeatherReport) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  pendingReports,
  systemHealth,
  onRefreshData,
  onSelectReport
}) => {
  const [adminTab, setAdminTab] = useState<'verification' | 'health'>('verification');

  return (
    <div className="space-y-6">
      {/* Admin Navigation Sub-Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">National Operations Command & Admin Panel</h1>
          <p className="text-xs text-slate-400">
            Administrative verification queue, big data pipeline health, and real-time Kafka / AI worker telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAdminTab('verification')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              adminTab === 'verification'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verification Queue ({pendingReports.length})
          </button>
          <button
            onClick={() => setAdminTab('health')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              adminTab === 'health'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            System Health & Kafka
          </button>
        </div>
      </div>

      {adminTab === 'verification' ? (
        <VerificationQueue
          pendingReports={pendingReports}
          onReportActionDone={onRefreshData}
          onSelectReport={onSelectReport}
        />
      ) : (
        <SystemHealthView health={systemHealth} />
      )}
    </div>
  );
};