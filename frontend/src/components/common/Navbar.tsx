import React, { useState, useEffect } from 'react';
import { CloudRain, Shield, Activity, Map, FileText, BarChart3, Users, Radio, RefreshCw, Command, UserCheck, Menu, X } from 'lucide-react';
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
  const [countdownSeconds, setCountdownSeconds] = useState(300);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 5-Minute Auto-Sync Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          handleSync();
          return 300;
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
      const count = res.new_reports_count || 0;
      setSyncMessage(count > 0 ? `+${count} New` : 'Live Fresh');
      setCountdownSeconds(300);
      if (onLiveSyncDone) onLiveSyncDone();
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err) {
      console.error('Live sync error', err);
      setSyncMessage('Error');
      setTimeout(() => setSyncMessage(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const minutesLeft = Math.floor(countdownSeconds / 60);
  const secondsLeft = countdownSeconds % 60;
  const timerDisplay = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;

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
    { id: 'citizen', label: 'Citizen Portal', icon: CloudRain, roles: ['citizen'] },
    { id: 'admin', label: 'Admin Ops', icon: Shield, badge: alertCount > 0 ? alertCount : undefined, roles: ['admin'] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-3 py-2 w-full font-sans">
      <div className="flex items-center justify-between gap-2 w-full max-w-7xl mx-auto">
        {/* Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => {
            setActiveTab('dashboard');
            setIsMobileMenuOpen(false);
          }}
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
              <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 uppercase hidden sm:inline">
                Nowcasting
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono leading-tight mt-0.5 hidden xs:block">
              National Disaster Support
            </p>
          </div>
        </div>

        {/* Desktop Nav Tabs (Hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 shrink-0">
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

        {/* Right Controls: Sync Live + Role Switcher + Mobile Menu Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Sync Live Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
            title={`Fetch live multi-channel news & weather. Auto-sync in ${timerDisplay}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono font-normal">
              {syncMessage || timerDisplay}
            </span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-800 text-xs shrink-0">
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

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-2 border-t border-slate-800 bg-slate-950/95 rounded-xl p-2 shadow-2xl space-y-1 animate-fade-in">
          <div className="grid grid-cols-2 gap-1.5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 px-2 text-[10px] text-slate-500 font-mono border-t border-slate-900">
            <span>WebSocket: <strong className={isLiveConnected ? 'text-emerald-400' : 'text-amber-400'}>{isLiveConnected ? 'CONNECTED' : 'OFFLINE'}</strong></span>
            <span>Role: <strong className="text-white uppercase">{userRole}</strong></span>
          </div>
        </div>
      )}
    </header>
  );
};