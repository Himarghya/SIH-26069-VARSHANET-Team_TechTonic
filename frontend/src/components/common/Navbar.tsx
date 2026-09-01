import React, { useState, useEffect } from 'react';
import { CloudRain, Shield, Activity, Map, FileText, BarChart3, Users, Radio, RefreshCw, Command, UserCheck, Clock } from 'lucide-react';
import { triggerLiveSync } from '../../services/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLiveConnected: boolean;
  alertCount: number;
  userRole: string;
  setUserRole: (role: string) => void;
  onLiveSyncDone?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLiveConnected,
  alertCount,
  userRole,
  setUserRole,
  onLiveSyncDone
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(1800); // 30 minutes in seconds

  // 30-Minute Auto-Sync Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          handleSync();
          return 1800;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await triggerLiveSync();
      setSyncMessage(`+${res.new_reports_count || 0}`);
      setCountdownSeconds(1800); // Reset 30-min timer on manual sync
      if (onLiveSyncDone) onLiveSyncDone();
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err) {
      console.error('Live sync error', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const minutesLeft = Math.floor(countdownSeconds / 60);
  const secondsLeft = countdownSeconds % 60;

  const handleRoleChange = (newRole: string) => {
    setUserRole(newRole);
    if (newRole === 'admin') {
      setActiveTab('admin');
    } else if (newRole === 'citizen') {
      setActiveTab('citizen');
    } else if (newRole === 'analyst' && (activeTab === 'citizen' || activeTab === 'admin')) {
      setActiveTab('incident');
    }
  };

  // Role-filtered navigation items
  const allNavItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity, roles: ['citizen', 'analyst', 'admin'] },
    { id: 'incident', label: 'Incident Room', icon: Command, roles: ['analyst', 'admin'] },
    { id: 'map', label: 'Map', icon: Map, roles: ['citizen', 'analyst', 'admin'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['citizen', 'analyst', 'admin'] },
    { id: 'events', label: 'Events', icon: Radio, roles: ['citizen', 'analyst', 'admin'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['analyst', 'admin'] },
    { id: 'citizen', label: 'Citizen Portal', icon: CloudRain, roles: ['citizen', 'admin'] },
    { id: 'admin', label: 'Admin', icon: Shield, badge: alertCount > 0 ? alertCount : undefined, roles: ['admin'] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-3 py-2 w-full">
      <div className="flex items-center justify-between gap-2 w-full">
        {/* Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-md shadow-cyan-500/20 text-white font-bold shrink-0">
            <CloudRain className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveConnected ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-sm font-black tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                VARSHANET 2.0
              </span>
              <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 uppercase">
                Nowcasting
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono leading-tight mt-0.5">
              National Disaster Support
            </p>
          </div>
        </div>

        {/* Dynamic Role-Based Nav Tabs */}
        <nav className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 shrink-0">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-0.5 px-1 py-0.2 text-[8px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Sync Live (30-min timer) + Stream Status + Role Switcher */}
        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          {/* Sync Live Button & 30-min Auto Countdown */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
            title={`Fetch live weather & news across India. Auto-syncs every 30 mins (Next in ${minutesLeft}m ${secondsLeft}s).`}
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono font-normal">
              {syncMessage || `${minutesLeft}m`}
            </span>
          </button>

          {/* WebSocket Status */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span className="text-slate-300">{isLiveConnected ? 'LIVE' : 'OFFLINE'}</span>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs shrink-0">
            <UserCheck className={`w-3.5 h-3.5 shrink-0 ${
              userRole === 'admin' ? 'text-rose-400' :
              userRole === 'analyst' ? 'text-cyan-400' : 'text-emerald-400'
            }`} />
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="citizen" className="bg-slate-900 text-white">Citizen</option>
              <option value="analyst" className="bg-slate-900 text-white">Analyst</option>
              <option value="admin" className="bg-slate-900 text-white">Admin</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};