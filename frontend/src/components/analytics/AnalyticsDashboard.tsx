import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, ShieldAlert, Layers } from 'lucide-react';
import { AnalyticsOverview } from '../../types';

interface AnalyticsDashboardProps {
  overview: AnalyticsOverview | null;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ overview }) => {
  if (!overview) return null;

  const eventData = Object.entries(overview.event_distribution || {}).map(([name, value]) => ({
    name,
    count: value
  }));

  const sourceData = Object.entries(overview.source_distribution || {}).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value
  }));

  const stateData = Object.entries(overview.state_activity || {}).map(([name, value]) => ({
    state: name,
    reports: value
  }));

  const verificationData = Object.entries(overview.verification_distribution || {}).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value
  }));

  const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            National Weather Big Data Analytics & Pattern Mining
          </h2>
          <p className="text-xs text-slate-400">
            Real-time statistical distributions, regional vulnerability indices, and source reliability telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Activity Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> State-Wise Weather Incident Density
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <XAxis dataKey="state" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', fontSize: '11px' }}
                />
                <Bar dataKey="reports" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Type Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Event Category Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution Donut */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-400" /> Multi-Source Channel Ingestion Mix
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Status Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> AI Credibility & Verification Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={verificationData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {verificationData.map((entry, index) => (
                    <Cell key={`cell-v-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};