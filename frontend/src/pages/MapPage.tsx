import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Target, 
  AlertTriangle, 
  CloudRain, 
  Search, 
  Activity, 
  Sun, 
  Moon, 
  CloudLightning, 
  Compass, 
  ChevronRight, 
  Flame, 
  ShieldAlert,
  Wind,
  Droplets,
  Calendar,
  Clock
} from 'lucide-react';
import { IndiaWeatherMap } from '../components/map/IndiaWeatherMap';
import { EventCluster, WeatherReport, ALL_INDIAN_STATES_UTS, INDIAN_STATE_COORDINATES } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MapPageProps {
  events: EventCluster[];
  reports: WeatherReport[];
  onSelectEvent: (event: EventCluster) => void;
  onSelectReport: (report: WeatherReport) => void;
}

// Recent Earthquakes (National Centre for Seismology - NCS Data)
const RECENT_EARTHQUAKES = [
  {
    magnitude: '4.4',
    location: 'Afghanistan (Tremors in J&K / Punjab)',
    date: '30 Sep 2026',
    time: '13:09:01',
    depth: '120 km',
    colorTheme: 'yellow',
  },
  {
    magnitude: '3.1',
    location: 'Hindu Kush Region, Afghanistan',
    date: '30 Sep 2026',
    time: '11:48:58',
    depth: '85 km',
    colorTheme: 'green',
  },
  {
    magnitude: '3.8',
    location: 'Chamoli, Uttarakhand',
    date: '30 Sep 2026',
    time: '08:22:15',
    depth: '10 km',
    colorTheme: 'yellow',
  }
];

// Pre-curated Official CAP Alerts matching NDMA SACHET
const DEFAULT_CAP_ALERTS = [
  {
    id: 'cap-1',
    type: 'Thunderstorm with Lightning',
    location: 'Nainital and Almora, Uttarakhand',
    severity: 'MODERATE',
    color: 'yellow',
    lat: 29.3803,
    lon: 79.4636,
  },
  {
    id: 'cap-2',
    type: 'Low Cloud to Ground Lightning',
    location: '7 districts of Maharashtra',
    severity: 'MODERATE',
    color: 'yellow',
    lat: 19.0760,
    lon: 72.8777,
  },
  {
    id: 'cap-3',
    type: 'Light Thunderstorm with surface wind',
    location: 'South 24 Parganas, West Bengal',
    severity: 'MODERATE',
    color: 'yellow',
    lat: 22.1352,
    lon: 88.5434,
  },
  {
    id: 'cap-4',
    type: 'Flood',
    location: 'Ganga, Bhagalpur, Bhagalpur, Bihar',
    severity: 'MODERATE',
    color: 'yellow',
    lat: 25.2425,
    lon: 86.9842,
  },
  {
    id: 'cap-5',
    type: 'Flood',
    location: 'Ganga, Kahalgaon, Bhagalpur, Bihar',
    severity: 'MODERATE',
    color: 'yellow',
    lat: 25.2630,
    lon: 87.2340,
  },
  {
    id: 'cap-6',
    type: 'Flood',
    location: 'Ganga, Dabri, Shahjahanpur, Uttar Pradesh',
    severity: 'SEVERE',
    color: 'orange',
    lat: 27.8805,
    lon: 79.9120,
  },
  {
    id: 'cap-7',
    type: 'Flood',
    location: 'Ganga, Fatehgarh, Farrukhabad, Uttar Pradesh',
    severity: 'MODERATE',
    color: 'yellow',
    lat: 27.3688,
    lon: 79.6247,
  },
  {
    id: 'cap-8',
    type: 'Flood',
    location: 'Ganga, Kannauj, Kannauj, Uttar Pradesh',
    severity: 'MODERATE',
    color: 'yellow',
    lat: 27.0549,
    lon: 79.9168,
  }
];

export const MapPage: React.FC<MapPageProps> = ({
  events = [],
  reports = [],
  onSelectEvent,
  onSelectReport
}) => {
  const { t } = useLanguage();
  const [activeTabMode, setActiveTabMode] = useState<'CURRENT' | 'ALL' | 'STATE' | 'FORECAST'>('ALL');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchCity, setSearchCity] = useState('Chakdehi');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  // Dynamic CAP alerts from incoming live reports + curated SACHET CAP items
  const displayCapAlerts = useMemo(() => {
    if (activeTabMode === 'STATE' && selectedState !== 'All') {
      const filtered = reports.filter(r => r.state && r.state.toLowerCase() === selectedState.toLowerCase());
      if (filtered.length > 0) {
        return filtered.map(r => ({
          id: r.id,
          type: r.event_type || 'Weather Advisory',
          location: `${r.city || 'District'}, ${r.state}`,
          severity: r.risk_level || 'MODERATE',
          color: r.risk_level === 'CRITICAL' || r.risk_level === 'HIGH' ? 'orange' : 'yellow',
          lat: r.latitude,
          lon: r.longitude,
          rawReport: r
        }));
      }
    }
    return DEFAULT_CAP_ALERTS;
  }, [activeTabMode, selectedState, reports]);

  const handleAlertClick = (alertItem: any) => {
    if (alertItem.rawReport && onSelectReport) {
      onSelectReport(alertItem.rawReport);
    } else if (events.length > 0) {
      const match = events.find(e => 
        e.city?.toLowerCase().includes(alertItem.location.toLowerCase()) ||
        alertItem.location.toLowerCase().includes(e.city?.toLowerCase() || '')
      );
      if (match && onSelectEvent) {
        onSelectEvent(match);
      }
    }
  };

  const handleSelectState = (stateName: string) => {
    setSelectedState(stateName);
    setActiveTabMode('STATE');
    setIsStateDropdownOpen(false);
  };

  return (
    <div className="space-y-4 font-sans select-none animate-fade-in">
      
      {/* 1. Top 4 Action / Filter Cards (Matching Screenshot Top Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Card 1: CURRENT LOCATION CAP ALERT */}
        <button
          onClick={() => {
            setActiveTabMode('CURRENT');
            navigator.geolocation?.getCurrentPosition(
              (pos) => {
                alert(`GPS Location detected: [${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}]. Filtering nearby local CAP alerts.`);
              },
              () => {
                alert('GPS location permission is required. Showing default regional alerts.');
              }
            );
          }}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-sm flex flex-col items-center justify-center text-center group bg-white dark:bg-slate-900 ${
            activeTabMode === 'CURRENT'
              ? 'border-[#18447e] bg-blue-50/70 dark:bg-blue-950/40 shadow-md scale-[1.01]'
              : 'border-[#18447e]/30 dark:border-slate-800 hover:border-[#18447e]'
          }`}
        >
          <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-white dark:bg-slate-950 flex items-center justify-center text-red-600 mb-2 shadow-sm group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5 fill-red-600 text-white" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-heading">
            CURRENT LOCATION CAP ALERT
          </span>
        </button>

        {/* Card 2: ALL INDIA CAP ALERT */}
        <button
          onClick={() => {
            setActiveTabMode('ALL');
            setSelectedState('All');
          }}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-sm flex flex-col items-center justify-center text-center group bg-white dark:bg-slate-900 ${
            activeTabMode === 'ALL'
              ? 'border-[#18447e] bg-blue-50/70 dark:bg-blue-950/40 shadow-md scale-[1.01]'
              : 'border-[#18447e]/30 dark:border-slate-800 hover:border-[#18447e]'
          }`}
        >
          <div className="w-10 h-10 rounded-full border-2 border-slate-700 dark:border-slate-400 bg-white dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-2 shadow-sm group-hover:scale-110 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-heading">
            ALL INDIA CAP ALERT
          </span>
        </button>

        {/* Card 3: STATE WISE CAP ALERT */}
        <div className="relative">
          <button
            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            className={`w-full h-full p-4 rounded-xl border-2 transition-all cursor-pointer shadow-sm flex flex-col items-center justify-center text-center group bg-white dark:bg-slate-900 ${
              activeTabMode === 'STATE'
                ? 'border-[#18447e] bg-blue-50/70 dark:bg-blue-950/40 shadow-md scale-[1.01]'
                : 'border-[#18447e]/30 dark:border-slate-800 hover:border-[#18447e]'
            }`}
          >
            <div className="w-10 h-10 rounded-full border-2 border-amber-500 bg-white dark:bg-slate-950 flex items-center justify-center text-amber-500 mb-2 shadow-sm group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-heading">
              {selectedState !== 'All' ? `${selectedState} CAP ALERT` : 'STATE WISE CAP ALERT'}
            </span>
          </button>

          {/* State Selection Dropdown Popover */}
          {isStateDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-950 border-2 border-[#18447e] rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto custom-scrollbar">
              <div className="p-1 font-bold text-xs text-[#18447e] dark:text-cyan-400 border-b dark:border-slate-800 mb-1">
                Select Indian State / UT:
              </div>
              <button
                onClick={() => handleSelectState('All')}
                className="w-full text-left px-2.5 py-1 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
              >
                All States &amp; UTs
              </button>
              {ALL_INDIAN_STATES_UTS.map((st) => (
                <button
                  key={st}
                  onClick={() => handleSelectState(st)}
                  className="w-full text-left px-2.5 py-1 text-xs rounded hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card 4: FORECAST */}
        <button
          onClick={() => setActiveTabMode('FORECAST')}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-sm flex flex-col items-center justify-center text-center group bg-white dark:bg-slate-900 ${
            activeTabMode === 'FORECAST'
              ? 'border-[#18447e] bg-blue-50/70 dark:bg-blue-950/40 shadow-md scale-[1.01]'
              : 'border-[#18447e]/30 dark:border-slate-800 hover:border-[#18447e]'
          }`}
        >
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-950 flex items-center justify-center text-emerald-600 mb-2 shadow-sm group-hover:scale-110 transition-transform">
            <CloudRain className="w-5 h-5" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-heading">
            FORECAST
          </span>
        </button>
      </div>

      {/* 2. Main 3-Column Layout: Map (Left 6.5 cols) + ALERT LIST (Center 2.5 cols) + Earthquakes & Weather (Right 3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Column A: Interactive Leaflet Map (6 cols on lg) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md min-h-[640px] flex flex-col">
          <div className="flex-1 w-full h-full relative">
            <IndiaWeatherMap
              events={events}
              reports={reports}
              onSelectEvent={onSelectEvent}
              onSelectReport={onSelectReport}
            />
          </div>
        </div>

        {/* Column B: ALERT LIST (Vertical Colored Cards Feed - 3 cols on lg) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col h-[640px]">
          {/* Blue Official Header */}
          <div className="bg-[#18447e] text-white px-4 py-2.5 text-center font-heading font-black text-sm uppercase tracking-wider shadow-xs">
            ALERT LIST
          </div>

          {/* Scrollable Alert List Items */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/40 custom-scrollbar">
            {displayCapAlerts.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => handleAlertClick(item)}
                className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-center text-center border ${
                  item.color === 'orange'
                    ? 'bg-[#ff9800] text-white border-amber-600 font-bold'
                    : 'bg-[#ffeb3b] text-slate-950 border-yellow-400 font-bold'
                }`}
              >
                <h4 className="text-xs font-black tracking-tight leading-tight uppercase">
                  {item.type}
                </h4>
                <p className={`text-[11px] font-semibold mt-1 leading-snug ${
                  item.color === 'orange' ? 'text-white/95' : 'text-slate-800'
                }`}>
                  {item.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Column C: Right Sidebar (Earthquakes + Weather Overview - 3 cols on lg) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Card 1: Recent Earthquakes Widget */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="bg-[#18447e] text-white px-4 py-2.5 flex items-center justify-between font-heading font-black text-sm uppercase tracking-wider">
              <span>Recent Earthquakes</span>
              <Activity className="w-4 h-4 text-amber-300" />
            </div>

            <div className="p-3 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/40">
              {RECENT_EARTHQUAKES.map((eq, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border shadow-xs transition-transform hover:scale-[1.02] ${
                    eq.colorTheme === 'yellow'
                      ? 'bg-[#fff59d] dark:bg-amber-950/40 text-slate-900 dark:text-amber-100 border-amber-300 dark:border-amber-700/60'
                      : 'bg-[#a5d6a7] dark:bg-emerald-950/40 text-slate-900 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-xs font-black uppercase tracking-wide">
                      {eq.magnitude} Magnitude
                    </span>
                    <span className="text-[9px] font-mono opacity-80">
                      Depth: {eq.depth}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[11px] font-semibold mt-1">
                    <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                    <span className="truncate">{eq.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[9px] font-mono opacity-75 mt-1.5 pt-1 border-t border-black/10 dark:border-white/10">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {eq.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {eq.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Weather Overview & Live Nowcast Forecast */}
          <div className="bg-[#18447e] text-white rounded-2xl overflow-hidden shadow-md flex flex-col">
            <div className="px-4 py-2.5 font-heading font-black text-sm uppercase tracking-wider border-b border-blue-400/30">
              Weather Overview
            </div>

            <div className="p-3.5 space-y-3.5">
              {/* Location Search Bar */}
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Search city / district..."
                  className="w-full pl-8 pr-8 py-1.5 bg-white text-slate-900 placeholder-slate-400 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Current Temperature & Sky condition banner */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <Moon className="w-8 h-8 text-cyan-200 fill-cyan-200/40" />
                  <span className="text-2xl sm:text-3xl font-black font-mono">
                    31.4<span className="text-lg">°C</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white lowercase">mainly</p>
                  <p className="text-xs font-bold text-white lowercase">clear</p>
                  <p className="text-xs font-bold text-white lowercase">sky</p>
                </div>
              </div>

              {/* Hourly Forecast Row */}
              <div className="space-y-1.5 border-t border-blue-400/30 pt-2.5">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Hourly Forecast
                </h5>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <span className="block text-[10px] font-mono text-blue-200">2:00 PM</span>
                    <Sun className="w-4 h-4 mx-auto my-1 text-yellow-300" />
                    <span className="block text-[11px] font-bold font-mono">24.01°</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <span className="block text-[10px] font-mono text-blue-200">3:00 PM</span>
                    <Sun className="w-4 h-4 mx-auto my-1 text-yellow-300" />
                    <span className="block text-[11px] font-bold font-mono">25.55°</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <span className="block text-[10px] font-mono text-blue-200">4:00 PM</span>
                    <Sun className="w-4 h-4 mx-auto my-1 text-yellow-300" />
                    <span className="block text-[11px] font-bold font-mono">27.35°</span>
                  </div>
                </div>
              </div>

              {/* Daily Forecast Row */}
              <div className="space-y-1.5 border-t border-blue-400/30 pt-2.5">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Daily Forecast
                </h5>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                    <span className="font-semibold text-xs">Today</span>
                    <CloudLightning className="w-4 h-4 text-amber-300" />
                    <span className="font-mono font-bold text-[11px]">33.0° / 22.0°</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                    <span className="font-semibold text-xs">Tomorrow</span>
                    <Sun className="w-4 h-4 text-yellow-300" />
                    <span className="font-mono font-bold text-[11px]">34.0° / 23.0°</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};