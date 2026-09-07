import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Shield,
  Activity,
  Map,
  FileText,
  BarChart3,
  Radio,
  RefreshCw,
  Command,
  UserCheck,
  Menu,
  X,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';
import { triggerLiveSync } from '../../services/api';
import { useNetwork } from '../../context/NetworkContext';

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

  const {
    networkStatus,
    liteMode,
    toggleLiteMode,
    outboxCount,
    isSyncingOutbox,
    syncOutbox
  } = useNetwork();

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

  // Role-filtered navigation items (clean core operational suite)
  const allNavItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity, roles: ['citizen', 'analyst', 'admin'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['citizen', 'analyst', 'admin'] },
    { id: 'map', label: 'Map', icon: Map, roles: ['citizen', 'analyst', 'admin'] },
    { id: 'incident', label: 'Incident Room', icon: Command, roles: ['analyst', 'admin'] },
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold font-mono rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools: 2G/3G Lite Mode, Outbox Sync, Countdown, Role Switcher, Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ⚡ 2G/3G Lite Mode (Data Saver) Toggle */}
          <button
            onClick={toggleLiteMode}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer shrink-0 shadow-sm ${
              liteMode
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 hover:bg-amber-900/80 ring-1 ring-amber-500/30'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={`Click to toggle 2G/3G Data Saver Mode. Current: ${liteMode ? 'LITE ON' : 'FULL SPEED'} (${networkStatus.effectiveType.toUpperCase()})`}
          >
            <Zap className={`w-3 h-3 ${liteMode ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="font-bold text-[10px]">
              {liteMode ? '2G Lite' : '2G/3G'}
            </span>
          </button>

          {/* Offline Outbox Queue Status Pill */}
          {outboxCount > 0 && (
            <button
              onClick={() => syncOutbox()}
              disabled={isSyncingOutbox || !networkStatus.isOnline}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-950/90 border border-orange-500/60 text-orange-300 text-[10px] font-mono font-bold animate-pulse cursor-pointer shrink-0"
              title="Reports queued locally offline. Click to sync now"
            >
              <RefreshCw className={`w-3 h-3 text-orange-400 ${isSyncingOutbox ? 'animate-spin' : ''}`} />
              <span>Outbox: {outboxCount}</span>
            </button>
          )}

          {/* Network Connection Pill (if offline or 2G) */}
          {!networkStatus.isOnline && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-mono shrink-0">
              <WifiOff className="w-3 h-3 text-rose-400" />
              <span className="hidden sm:inline">Offline (PWA)</span>
            </div>
          )}

          {/* Live Sync Trigger & Countdown Badge */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all text-[11px] font-mono shadow-sm cursor-pointer shrink-0"
            title="Auto-cycles every 5 minutes. Click to force instant live sync"
          >
            <RefreshCw className={`w-3 h-3 text-cyan-400 ${isSyncing ? 'animate-spin text-cyan-300' : ''}`} />
            <span className="text-[10px] hidden xs:inline text-cyan-400 font-bold">
              {syncMessage ? syncMessage : timerDisplay}
            </span>
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1 hidden xs:inline" />
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent text-[11px] font-mono font-semibold text-cyan-300 focus:outline-none cursor-pointer pr-1 py-1"
            >
              <option value="analyst" className="bg-slate-900 text-white">Analyst</option>
              <option value="admin" className="bg-slate-900 text-white">Admin</option>
              <option value="citizen" className="bg-slate-900 text-white">Citizen</option>
            </select>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-2 border-t border-slate-800 bg-slate-950/95 rounded-xl p-2 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile 2G/3G Data Saver & PWA Status Card */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${liteMode ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-slate-200 font-bold">2G/3G Lite Mode</div>
                <div className="text-[10px] text-slate-400">
                  {networkStatus.isOnline ? `Net: ${networkStatus.effectiveType.toUpperCase()}` : 'Offline Cached PWA'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleLiteMode}
              className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                liteMode
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {liteMode ? 'ON' : 'OFF'}
            </button>
          </div>

          {outboxCount > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-orange-950/60 border border-orange-700/60 text-xs font-mono text-orange-200">
              <span>{outboxCount} offline report(s) pending sync</span>
              <button
                onClick={() => syncOutbox()}
                disabled={isSyncingOutbox}
                className="px-2 py-0.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold text-[10px]"
              >
                {isSyncingOutbox ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1">
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all w-full text-left ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto px-1.5 py-0.2 text-[9px] font-bold font-mono rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};