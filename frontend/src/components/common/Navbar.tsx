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
  X,
  Sun,
  Moon
} from 'lucide-react';
import { triggerLiveSync } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();
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
      setActiveTab('dashboard');
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
    <header className="bg-[#18447e] dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-[#123666] dark:border-slate-800 sticky top-0 z-50 px-3 sm:px-6 lg:px-8 xl:px-10 py-2 w-full font-sans transition-colors text-white shadow-md">
      <div className="flex items-center justify-between gap-3 lg:gap-6 w-full mx-auto">
        {/* Brand with Devanagari 'सचेत' & National Disaster Alert Portal Tagline */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => {
            setActiveTab('dashboard');
            setIsMobileMenuOpen(false);
          }}
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-white text-[#18447e] dark:bg-gradient-to-br dark:from-cyan-500 dark:via-blue-600 dark:to-indigo-700 shadow-md shadow-black/20 font-bold shrink-0 transition-transform hover:scale-105">
            <CloudRain className="w-5 h-5 text-[#18447e] dark:text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow-xs font-serif leading-none mr-0.5">
                सचेत
              </span>
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white font-sans">
                VARSHANET
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/60 dark:bg-cyan-950/80 text-yellow-300 dark:text-cyan-300 border border-blue-400/40 dark:border-cyan-700/60 font-mono font-bold">
                SIH'26
              </span>
            </div>
            <div className="text-[8px] sm:text-[9px] text-blue-200 dark:text-slate-400 font-mono tracking-widest uppercase -mt-0.5 font-bold">
              National Disaster Alert Portal &amp; Radar
            </div>
          </div>
        </div>

        {/* Center / Primary Nav Items (Desktop) - Royal Blue Government Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center max-w-4xl mx-2 lg:mx-4 bg-[#123666] dark:bg-slate-950/70 p-1 rounded-lg border border-[#1f4a85] dark:border-slate-800/80 shadow-inner">
          <div className="flex items-center justify-between w-full gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 lg:px-2.5 rounded text-[12px] uppercase tracking-wider transition-all cursor-pointer select-none font-bold ${
                    isActive
                      ? 'bg-[#0a2344] text-yellow-300 dark:text-white shadow-xs border-b-2 border-yellow-400 dark:border-cyan-400'
                      : 'text-white/90 hover:text-white hover:bg-white/10 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-yellow-300 dark:text-white' : 'text-blue-200 dark:text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold font-mono rounded bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Sync Trigger & Countdown Badge */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="h-8 flex items-center gap-1.5 px-2.5 rounded bg-[#123666] dark:bg-slate-950 border border-[#1f4a85] dark:border-slate-800 hover:border-yellow-400/50 text-white dark:text-slate-300 transition-all text-xs font-mono shadow-xs cursor-pointer shrink-0"
            title="Auto-cycles every 5 minutes. Click to force instant live sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-yellow-300 dark:text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="text-[11px] hidden sm:inline text-yellow-200 dark:text-cyan-400 font-bold tabular-nums">
              {syncMessage ? syncMessage : timerDisplay}
            </span>
          </button>

          {/* Bright (White) / Dark Mode Toggle Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="h-8 flex items-center gap-1.5 px-2.5 rounded bg-[#123666] dark:bg-slate-950 border border-[#1f4a85] dark:border-slate-800 hover:border-yellow-400/60 text-white transition-all shadow-xs cursor-pointer group select-none"
            aria-label={`Switch to ${theme === 'dark' ? 'Bright (White)' : 'Dark'} mode`}
            title={`Current: ${theme === 'dark' ? 'Dark' : 'Bright (White)'} Mode. Click to toggle.`}
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                <span className="text-[11px] font-bold hidden sm:inline text-slate-200">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-45 transition-transform" />
                <span className="text-[11px] font-bold hidden sm:inline text-white">Bright</span>
              </>
            )}
          </button>

          {/* Sleek Custom User Role Switcher Dropdown */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(prev => !prev)}
              className="h-8 flex items-center gap-1.5 px-2.5 rounded bg-[#123666] dark:bg-slate-950 border border-[#1f4a85] dark:border-slate-800 hover:border-yellow-400/60 text-white transition-all shadow-xs cursor-pointer text-xs font-bold"
              aria-haspopup="true"
              aria-expanded={isRoleDropdownOpen}
              title="Switch platform operational role / persona"
            >
              <CurrentRoleIcon className="w-3.5 h-3.5 text-yellow-300 dark:text-cyan-400" />
              <span className="capitalize">{currentRoleConfig.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-blue-200 transition-transform duration-200 ${
                isRoleDropdownOpen ? 'rotate-180 text-yellow-300' : ''
              }`} />
            </button>

            {/* Glassmorphic Dropdown Popover */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/90 p-1.5 shadow-xl dark:shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 font-sans divide-y divide-slate-100 dark:divide-slate-800/60">
                <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Operational Persona</span>
                  <span className="text-[9px] text-cyan-600 dark:text-cyan-400 lowercase font-mono">3 roles</span>
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
                        className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white shadow-xs'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${role.iconBg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                              <span>{role.label}</span>
                              {isSelected && (
                                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-snug mt-0.5 font-sans">
                              {role.tagline}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-500/60 flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
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
            className="lg:hidden p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-2 border-t border-slate-800 bg-slate-950/95 rounded-xl p-2 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile Bright / Dark Mode Switcher */}
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Theme Mode</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-950 text-indigo-300 border-indigo-700/50'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Bright (White)'}
            </button>
          </div>

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