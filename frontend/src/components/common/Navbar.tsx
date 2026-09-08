import React, { useState, useEffect, useRef } from 'react';
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
  Users,
  ChevronDown,
  Check,
  Menu,
  X
} from 'lucide-react';
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

export const ROLES_CONFIG = [
  {
    id: 'citizen',
    label: 'Citizen',
    tagline: 'Citizen Portal & Ground Reports',
    icon: Users,
    dotColor: 'bg-emerald-400 shadow-emerald-400/50',
    iconBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400',
  },
  {
    id: 'analyst',
    label: 'Analyst',
    tagline: 'Disaster GIS Command & Forecaster',
    icon: Activity,
    dotColor: 'bg-cyan-400 shadow-cyan-400/50',
    iconBg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400',
  },
  {
    id: 'admin',
    label: 'Admin',
    tagline: 'NDMA Verification & System Ops',
    icon: Shield,
    dotColor: 'bg-purple-400 shadow-purple-400/50',
    iconBg: 'bg-purple-950/80 border-purple-500/40 text-purple-400',
  },
] as const;

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
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close role dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsRoleDropdownOpen(false);
    };

    if (isRoleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRoleDropdownOpen]);

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
  const currentRoleConfig = ROLES_CONFIG.find(r => r.id === userRole) || ROLES_CONFIG[0];
  const CurrentRoleIcon = currentRoleConfig.icon;

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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 font-sans">
                VARSHANET
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-mono font-bold">
                SIH'24
              </span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono -mt-0.5 hidden xs:block">
              AI Monsoon Hazard & GIS Radar
            </div>
          </div>
        </div>

        {/* Center / Primary Nav Items (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs shadow-inner">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold font-mono rounded-full bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
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

          {/* Sleek Custom User Role Switcher Dropdown */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(prev => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border transition-all shadow-sm cursor-pointer group ${
                isRoleDropdownOpen
                  ? 'border-cyan-500/80 ring-1 ring-cyan-500/40 bg-slate-900 shadow-cyan-950/40'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
              aria-haspopup="true"
              aria-expanded={isRoleDropdownOpen}
              title="Switch platform operational role / persona"
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${currentRoleConfig.dotColor} shadow-sm animate-pulse`}></span>
                <CurrentRoleIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-300 transition-colors" />
                <span className="font-mono text-xs font-bold text-slate-100 group-hover:text-white">
                  {currentRoleConfig.label}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isRoleDropdownOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-slate-200'
              }`} />
            </button>

            {/* Glassmorphic Dropdown Popover */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950/98 backdrop-blur-2xl border border-slate-800/90 p-1.5 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans divide-y divide-slate-800/60">
                <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  <span>Operational Persona</span>
                  <span className="text-[9px] text-cyan-400 lowercase font-mono">3 roles</span>
                </div>

                <div className="pt-1 space-y-1">
                  {ROLES_CONFIG.map((role) => {
                    const Icon = role.icon;
                    const isSelected = userRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          handleRoleChange(role.id);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-slate-900 border border-slate-700/80 text-white shadow-inner'
                            : 'hover:bg-slate-900/60 text-slate-300 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${role.iconBg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                              <span>{role.label}</span>
                              {isSelected && (
                                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate leading-snug mt-0.5 font-sans">
                              {role.tagline}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 text-cyan-400" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
          {/* Mobile Role Switcher */}
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              Select Operational Role
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {ROLES_CONFIG.map((role) => {
                const Icon = role.icon;
                const isSelected = userRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      handleRoleChange(role.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-center font-mono text-[11px] font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-600/30 border-cyan-500 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

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