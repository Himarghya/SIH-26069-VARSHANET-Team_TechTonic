import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Moon, 
  Sun, 
  CloudLightning, 
  CloudRain, 
  CloudSun,
  Wind,
  Droplets,
  Sparkles
} from 'lucide-react';

interface WeatherOverviewWidgetProps {
  onCitySearch?: (cityName: string, lat: number, lon: number) => void;
}

const CITY_WEATHER_DATA: Record<string, {
  temp: string;
  condition: string[];
  hourly: { time: string; temp: string; icon: 'sun' | 'moon' | 'cloud' | 'rain' }[];
  daily: { day: string; highLow: string; icon: 'thunder' | 'sun' | 'rain' }[];
  lat: number;
  lon: number;
}> = {
  'chakdehi': {
    temp: '31.4',
    condition: ['mainly', 'clear', 'sky'],
    hourly: [
      { time: '3:00 PM', temp: '25.55°', icon: 'sun' },
      { time: '4:00 PM', temp: '27.35°', icon: 'sun' },
      { time: '5:00 PM', temp: '29.3°', icon: 'sun' }
    ],
    daily: [
      { day: 'Today', highLow: '33.0° / 22.0°', icon: 'thunder' },
      { day: 'Tomorrow', highLow: '34.0° / 23.0°', icon: 'sun' },
      { day: 'Thursday', highLow: '31.0° / 21.0°', icon: 'rain' }
    ],
    lat: 23.1815,
    lon: 79.9864
  },
  'delhi': {
    temp: '34.2',
    condition: ['haze', 'warm', 'day'],
    hourly: [
      { time: '3:00 PM', temp: '34.2°', icon: 'sun' },
      { time: '4:00 PM', temp: '33.5°', icon: 'sun' },
      { time: '5:00 PM', temp: '31.8°', icon: 'sun' }
    ],
    daily: [
      { day: 'Today', highLow: '36.0° / 26.0°', icon: 'sun' },
      { day: 'Tomorrow', highLow: '35.0° / 25.0°', icon: 'thunder' },
      { day: 'Thursday', highLow: '33.0° / 24.0°', icon: 'rain' }
    ],
    lat: 28.6139,
    lon: 77.2090
  },
  'mumbai': {
    temp: '29.8',
    condition: ['scattered', 'clouds', 'humid'],
    hourly: [
      { time: '3:00 PM', temp: '29.8°', icon: 'sun' },
      { time: '4:00 PM', temp: '29.2°', icon: 'cloud' },
      { time: '5:00 PM', temp: '28.5°', icon: 'rain' }
    ],
    daily: [
      { day: 'Today', highLow: '31.0° / 25.0°', icon: 'rain' },
      { day: 'Tomorrow', highLow: '30.0° / 24.0°', icon: 'thunder' },
      { day: 'Thursday', highLow: '29.0° / 24.0°', icon: 'rain' }
    ],
    lat: 19.0760,
    lon: 72.8777
  },
  'kolkata': {
    temp: '32.0',
    condition: ['partly', 'cloudy', 'humid'],
    hourly: [
      { time: '3:00 PM', temp: '32.0°', icon: 'sun' },
      { time: '4:00 PM', temp: '30.8°', icon: 'cloud' },
      { time: '5:00 PM', temp: '29.4°', icon: 'rain' }
    ],
    daily: [
      { day: 'Today', highLow: '33.0° / 26.0°', icon: 'thunder' },
      { day: 'Tomorrow', highLow: '32.0° / 25.0°', icon: 'rain' },
      { day: 'Thursday', highLow: '31.0° / 25.0°', icon: 'sun' }
    ],
    lat: 22.5726,
    lon: 88.3639
  }
};

export const WeatherOverviewWidget: React.FC<WeatherOverviewWidgetProps> = ({
  onCitySearch
}) => {
  const [searchCity, setSearchCity] = useState('Chakdehi');
  
  const currentData = CITY_WEATHER_DATA[searchCity.toLowerCase().trim()] || CITY_WEATHER_DATA['chakdehi'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCitySearch && currentData) {
      onCitySearch(searchCity, currentData.lat, currentData.lon);
    }
  };

  return (
    <div className="bg-[#1e6bb8] text-white rounded-2xl overflow-hidden shadow-md flex flex-col h-full select-none font-sans border border-blue-400/30">
      
      {/* Top Blue Header: Weather Overview (Matching Screenshot) */}
      <div className="bg-[#18447e] text-white px-4 py-2.5 font-heading font-black text-sm uppercase tracking-wider shrink-0 border-b border-blue-300/30 shadow-xs">
        Weather Overview
      </div>

      {/* Main Content Area with Sky Blue Gradient (Matching Screenshot) */}
      <div className="flex-1 p-3.5 flex flex-col justify-between space-y-3 bg-gradient-to-b from-[#1e6bb8] via-[#2577c7] to-[#2c85d8] overflow-y-auto custom-scrollbar">
        
        {/* 1. Location Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative shrink-0">
          <MapPin className="w-4 h-4 text-slate-900 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city / district..."
            className="w-full pl-9 pr-9 py-2 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
            title="Search weather"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* 2. Current Temperature & Sky Condition Banner (Matching Screenshot) */}
        <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            {/* Crescent Moon Icon with Sparkles */}
            <div className="relative flex items-center justify-center">
              <Moon className="w-9 h-9 text-cyan-200 fill-cyan-200/40 drop-shadow-md" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1" />
            </div>
            {/* Temperature */}
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight drop-shadow-xs">
              {currentData.temp}<span className="text-xl">°C</span>
            </span>
          </div>

          {/* 3 Lines condition (mainly / clear / sky) */}
          <div className="text-right">
            {currentData.condition.map((line, idx) => (
              <p key={idx} className="text-xs font-black text-white lowercase leading-tight drop-shadow-xs">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* 3. Hourly Forecast Section (Matching Screenshot) */}
        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-2 shrink-0 shadow-xs">
          <h5 className="text-xs font-black uppercase tracking-wider text-white drop-shadow-xs">
            Hourly Forecast
          </h5>
          <div className="grid grid-cols-3 gap-2">
            {currentData.hourly.map((hr, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/30 rounded-xl p-2 text-center transition-transform hover:scale-105"
              >
                <span className="block text-[10px] font-mono text-blue-100 font-semibold">
                  {hr.time}
                </span>
                <Sun className="w-5 h-5 mx-auto my-1 text-yellow-300 fill-yellow-300/40 drop-shadow-sm" />
                <span className="block text-xs font-bold font-mono text-white">
                  {hr.temp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Daily Forecast Section (Matching Screenshot) */}
        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-2 shrink-0 shadow-xs">
          <h5 className="text-xs font-black uppercase tracking-wider text-white drop-shadow-xs">
            Daily Forecast
          </h5>
          <div className="space-y-1.5 text-xs">
            {currentData.daily.map((df, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-white/10 border border-white/15 font-bold"
              >
                <span className="text-xs font-semibold">{df.day}</span>
                {df.icon === 'thunder' ? (
                  <CloudLightning className="w-4 h-4 text-amber-300" />
                ) : df.icon === 'rain' ? (
                  <CloudRain className="w-4 h-4 text-cyan-200" />
                ) : (
                  <Sun className="w-4 h-4 text-yellow-300" />
                )}
                <span className="font-mono text-xs font-bold text-white">
                  {df.highLow}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
