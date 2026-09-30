import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Moon, 
  Sun, 
  CloudLightning, 
  CloudRain, 
  CloudSun,
  Cloud,
  Wind,
  Droplets,
  Sparkles,
  Clock,
  Calendar,
  Eye,
  Compass,
  Gauge,
  Thermometer,
  ShieldAlert
} from 'lucide-react';

interface WeatherOverviewWidgetProps {
  onCitySearch?: (cityName: string, lat: number, lon: number) => void;
}

interface DayForecast {
  dayName: string;
  dateStr: string;
  climateText: string;
  icon: 'sun' | 'moon' | 'cloud' | 'rain' | 'thunder' | 'cloud-sun';
  maxTemp: number;
  minTemp: number;
  rainChance: string;
  humidity: string;
}

interface CityClimateProfile {
  name: string;
  state: string;
  lat: number;
  lon: number;
  baseTemp: number;
  condition: string[];
  humidity: string;
  windSpeed: string;
  windDir: string;
  pressure: string;
  visibility: string;
  uvIndex: string;
  rainChance: string;
  forecast7Days: DayForecast[];
}

// Generate dynamic 7-day forecast dates starting from today
const generate7DayForecast = (baseMax: number, baseMin: number, climatePattern: string): DayForecast[] => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const now = new Date();
  const list: DayForecast[] = [];

  const climateVariations: { climate: string; icon: 'sun' | 'moon' | 'cloud' | 'rain' | 'thunder' | 'cloud-sun'; rain: string; hum: string; maxDelta: number; minDelta: number }[] = [
    { climate: 'Mainly Clear Sky', icon: 'sun', rain: '10%', hum: '62%', maxDelta: 0, minDelta: 0 },
    { climate: 'Partly Cloudy & Warm', icon: 'cloud-sun', rain: '25%', hum: '68%', maxDelta: 1, minDelta: 1 },
    { climate: 'Afternoon Thunderstorm', icon: 'thunder', rain: '75%', hum: '84%', maxDelta: -2, minDelta: -1 },
    { climate: 'Moderate Monsoon Rain', icon: 'rain', rain: '85%', hum: '92%', maxDelta: -3, minDelta: -2 },
    { climate: 'Scattered Showers', icon: 'rain', rain: '60%', hum: '78%', maxDelta: -1, minDelta: -1 },
    { climate: 'Overcast & Humid', icon: 'cloud', rain: '30%', hum: '74%', maxDelta: 0, minDelta: 0 },
    { climate: 'Clear Sunny Sky', icon: 'sun', rain: '5%', hum: '58%', maxDelta: 2, minDelta: 1 },
  ];

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + i);

    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[targetDate.getDay()];
    const dateStr = `${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`;
    const variant = climateVariations[i % climateVariations.length];

    list.push({
      dayName,
      dateStr,
      climateText: variant.climate,
      icon: variant.icon,
      maxTemp: Math.round(baseMax + variant.maxDelta),
      minTemp: Math.round(baseMin + variant.minDelta),
      rainChance: variant.rain,
      humidity: variant.hum
    });
  }

  return list;
};

const CITY_CLIMATE_PROFILES: Record<string, CityClimateProfile> = {
  'chakdehi': {
    name: 'Chakdehi',
    state: 'Madhya Pradesh',
    lat: 23.1815,
    lon: 79.9864,
    baseTemp: 31.4,
    condition: ['mainly', 'clear', 'sky'],
    humidity: '68%',
    windSpeed: '14 km/h',
    windDir: 'WNW',
    pressure: '1008 hPa',
    visibility: '9.0 km',
    uvIndex: '6 (Moderate)',
    rainChance: '15%',
    forecast7Days: generate7DayForecast(33.0, 22.0, 'subtropical')
  },
  'delhi': {
    name: 'New Delhi',
    state: 'Delhi NCR',
    lat: 28.6139,
    lon: 77.2090,
    baseTemp: 34.2,
    condition: ['hazy', 'sunshine', 'warm'],
    humidity: '54%',
    windSpeed: '12 km/h',
    windDir: 'NW',
    pressure: '1012 hPa',
    visibility: '6.5 km',
    uvIndex: '7 (High)',
    rainChance: '10%',
    forecast7Days: generate7DayForecast(36.0, 25.0, 'dry')
  },
  'mumbai': {
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lon: 72.8777,
    baseTemp: 29.8,
    condition: ['scattered', 'clouds', 'humid'],
    humidity: '84%',
    windSpeed: '22 km/h',
    windDir: 'SW',
    pressure: '1006 hPa',
    visibility: '8.0 km',
    uvIndex: '5 (Moderate)',
    rainChance: '70%',
    forecast7Days: generate7DayForecast(31.0, 24.0, 'coastal')
  },
  'kolkata': {
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lon: 88.3639,
    baseTemp: 32.0,
    condition: ['partly', 'cloudy', 'humid'],
    humidity: '78%',
    windSpeed: '16 km/h',
    windDir: 'SE',
    pressure: '1007 hPa',
    visibility: '7.5 km',
    uvIndex: '6 (Moderate)',
    rainChance: '55%',
    forecast7Days: generate7DayForecast(33.0, 25.0, 'tropical')
  },
  'bengaluru': {
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    baseTemp: 26.5,
    condition: ['pleasant', 'breeze', 'clouds'],
    humidity: '72%',
    windSpeed: '18 km/h',
    windDir: 'W',
    pressure: '1014 hPa',
    visibility: '10 km',
    uvIndex: '5 (Moderate)',
    rainChance: '40%',
    forecast7Days: generate7DayForecast(28.0, 19.0, 'plateau')
  },
  'guwahati': {
    name: 'Guwahati',
    state: 'Assam',
    lat: 26.1445,
    lon: 91.7362,
    baseTemp: 28.2,
    condition: ['overcast', 'passing', 'rain'],
    humidity: '88%',
    windSpeed: '10 km/h',
    windDir: 'NE',
    pressure: '1009 hPa',
    visibility: '6.0 km',
    uvIndex: '4 (Moderate)',
    rainChance: '80%',
    forecast7Days: generate7DayForecast(29.0, 22.0, 'northeast')
  },
  'imphal': {
    name: 'Imphal',
    state: 'Manipur',
    lat: 24.8170,
    lon: 93.9368,
    baseTemp: 24.6,
    condition: ['valley', 'rain', 'mist'],
    humidity: '92%',
    windSpeed: '11 km/h',
    windDir: 'S',
    pressure: '1010 hPa',
    visibility: '5.5 km',
    uvIndex: '4 (Moderate)',
    rainChance: '85%',
    forecast7Days: generate7DayForecast(25.0, 18.0, 'hills')
  }
};

export const WeatherOverviewWidget: React.FC<WeatherOverviewWidgetProps> = ({
  onCitySearch
}) => {
  const [searchCity, setSearchCity] = useState('Chakdehi');
  const [activeSubTab, setActiveSubTab] = useState<'METRICS' | '7DAYS'>('METRICS');
  const [liveDate, setLiveDate] = useState<Date>(new Date());

  // 1. Real-Time Clock Loop (Updating live every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const profileKey = searchCity.toLowerCase().trim();
  const currentProfile = CITY_CLIMATE_PROFILES[profileKey] || {
    name: searchCity.charAt(0).toUpperCase() + searchCity.slice(1),
    state: 'India',
    lat: 23.0,
    lon: 82.0,
    baseTemp: 30.5,
    condition: ['scattered', 'clouds', 'warm'],
    humidity: '65%',
    windSpeed: '15 km/h',
    windDir: 'W',
    pressure: '1009 hPa',
    visibility: '8.0 km',
    uvIndex: '6 (Moderate)',
    rainChance: '30%',
    forecast7Days: generate7DayForecast(32.0, 22.0, 'general')
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCitySearch) {
      onCitySearch(currentProfile.name, currentProfile.lat, currentProfile.lon);
    }
  };

  // Format real-time clock
  const timeFormatted = liveDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const dateFormatted = liveDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Dynamic Hourly timeline based on live hour
  const currentHour = liveDate.getHours();
  const dynamicHourly = [1, 2, 3, 4, 5].map((offset) => {
    const hr = (currentHour + offset) % 24;
    const isPm = hr >= 12;
    const displayHr = hr % 12 === 0 ? 12 : hr % 12;
    const tempCalc = (currentProfile.baseTemp - offset * 0.75).toFixed(1);
    return {
      time: `${displayHr}:00 ${isPm ? 'PM' : 'AM'}`,
      temp: `${tempCalc}°`,
      isDay: hr >= 6 && hr <= 18
    };
  });

  return (
    <div className="bg-[#1e6bb8] text-white rounded-2xl overflow-hidden shadow-md flex flex-col h-full select-none font-sans border border-blue-400/30">
      
      {/* Top Blue Header: Weather Overview & Live Clock */}
      <div className="bg-[#18447e] text-white px-4 py-2.5 font-heading font-black text-sm uppercase tracking-wider shrink-0 border-b border-blue-300/30 shadow-xs flex items-center justify-between">
        <span>Weather Overview</span>
        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5"></span>
          <span>LIVE</span>
        </div>
      </div>

      {/* Main Content Area with Sky Blue Gradient (Matching Screenshot) */}
      <div className="flex-1 p-3.5 flex flex-col justify-between space-y-3 bg-gradient-to-b from-[#1e6bb8] via-[#2577c7] to-[#2c85d8] overflow-y-auto custom-scrollbar">
        
        {/* 1. Location Search Bar & Live Real-Time Clock Banner */}
        <div className="space-y-1.5 shrink-0">
          <form onSubmit={handleSearchSubmit} className="relative">
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

          {/* Real-time Clock display */}
          <div className="flex items-center justify-between text-[11px] font-mono text-blue-100 px-1 font-bold">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-200" />
              {timeFormatted}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-200" />
              {dateFormatted}
            </span>
          </div>
        </div>

        {/* 2. Sub-Tab Switcher: Today's Metrics vs 7-Day Climate */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-white/10 rounded-xl border border-white/20 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('METRICS')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
              activeSubTab === 'METRICS'
                ? 'bg-white text-[#18447e] shadow-sm font-black'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Today's Weather
          </button>
          <button
            onClick={() => setActiveSubTab('7DAYS')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
              activeSubTab === '7DAYS'
                ? 'bg-white text-[#18447e] shadow-sm font-black'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            7-Day Climate Forecast
          </button>
        </div>

        {/* 3. CONDITIONAL VIEW: METRICS vs 7-DAY FORECAST */}
        {activeSubTab === 'METRICS' ? (
          /* VIEW A: TODAY'S DETAILED WEATHER & ATMOSPHERIC METRICS */
          <div className="space-y-3 shrink-0">
            
            {/* Current Temperature & Sky Condition Banner (Matching Screenshot) */}
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                {/* Crescent Moon Icon with Sparkles */}
                <div className="relative flex items-center justify-center">
                  <Moon className="w-9 h-9 text-cyan-200 fill-cyan-200/40 drop-shadow-md" />
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1" />
                </div>
                {/* Temperature */}
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight drop-shadow-xs">
                  {currentProfile.baseTemp}<span className="text-xl">°C</span>
                </span>
              </div>

              {/* 3 Lines condition (mainly / clear / sky) */}
              <div className="text-right">
                {currentProfile.condition.map((line, idx) => (
                  <p key={idx} className="text-xs font-black text-white lowercase leading-tight drop-shadow-xs">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Today's Climate Parameters Grid (Distinct Metrics Section) */}
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-2 shadow-xs">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-white drop-shadow-xs flex items-center justify-between">
                <span>Today's Climate Parameters</span>
                <span className="text-[10px] font-mono text-cyan-200">{currentProfile.name}, {currentProfile.state}</span>
              </h5>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                {/* Humidity */}
                <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                  <Droplets className="w-4 h-4 text-cyan-200 mx-auto mb-1" />
                  <span className="text-[9px] block text-blue-100 font-sans">Humidity</span>
                  <strong className="text-xs text-white">{currentProfile.humidity}</strong>
                </div>

                {/* Wind */}
                <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                  <Wind className="w-4 h-4 text-amber-200 mx-auto mb-1" />
                  <span className="text-[9px] block text-blue-100 font-sans">Wind</span>
                  <strong className="text-xs text-white">{currentProfile.windSpeed}</strong>
                </div>

                {/* Rain Chance */}
                <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                  <CloudRain className="w-4 h-4 text-cyan-300 mx-auto mb-1" />
                  <span className="text-[9px] block text-blue-100 font-sans">Rain Chance</span>
                  <strong className="text-xs text-white">{currentProfile.rainChance}</strong>
                </div>

                {/* Visibility */}
                <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                  <Eye className="w-4 h-4 text-indigo-200 mx-auto mb-1" />
                  <span className="text-[9px] block text-blue-100 font-sans">Visibility</span>
                  <strong className="text-xs text-white">{currentProfile.visibility}</strong>
                </div>

                {/* UV Index */}
                <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                  <Sun className="w-4 h-4 text-yellow-300 mx-auto mb-1" />
                  <span className="text-[9px] block text-blue-100 font-sans">UV Index</span>
                  <strong className="text-xs text-white">{currentProfile.uvIndex.split(' ')[0]}</strong>
                </div>

                {/* Pressure */}
                <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                  <Gauge className="w-4 h-4 text-emerald-200 mx-auto mb-1" />
                  <span className="text-[9px] block text-blue-100 font-sans">Pressure</span>
                  <strong className="text-xs text-white">{currentProfile.pressure}</strong>
                </div>
              </div>
            </div>

            {/* Hourly Forecast Section (Matching Screenshot) */}
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-2 shadow-xs">
              <h5 className="text-xs font-black uppercase tracking-wider text-white drop-shadow-xs">
                Hourly Forecast
              </h5>
              <div className="grid grid-cols-3 gap-2">
                {dynamicHourly.slice(0, 3).map((hr, i) => (
                  <div
                    key={i}
                    className="bg-white/10 border border-white/30 rounded-xl p-2 text-center transition-transform hover:scale-105"
                  >
                    <span className="block text-[10px] font-mono text-blue-100 font-semibold">
                      {hr.time}
                    </span>
                    {hr.isDay ? (
                      <Sun className="w-5 h-5 mx-auto my-1 text-yellow-300 fill-yellow-300/40 drop-shadow-sm" />
                    ) : (
                      <Moon className="w-5 h-5 mx-auto my-1 text-cyan-200 fill-cyan-200/40 drop-shadow-sm" />
                    )}
                    <span className="block text-xs font-bold font-mono text-white">
                      {hr.temp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* VIEW B: FULL 7-DAY TEMPERATURE & CLIMATE FORECAST */
          <div className="space-y-2 shrink-0 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-white px-1">
              <span className="uppercase tracking-wider">7-Day Synoptic Outlook</span>
              <span className="text-[10px] font-mono text-cyan-200">{currentProfile.name}</span>
            </div>

            <div className="space-y-1.5">
              {currentProfile.forecast7Days.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border transition-all ${
                    idx === 0 
                      ? 'bg-white/20 border-white/40 shadow-sm' 
                      : 'bg-white/10 border-white/15 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Day & Date */}
                    <div className="w-24">
                      <span className="block text-xs font-black text-white">{day.dayName}</span>
                      <span className="block text-[9px] font-mono text-blue-100">{day.dateStr}</span>
                    </div>

                    {/* Weather Icon & Climate description */}
                    <div className="flex items-center gap-1.5 flex-1">
                      {day.icon === 'thunder' ? (
                        <CloudLightning className="w-4 h-4 text-amber-300 shrink-0" />
                      ) : day.icon === 'rain' ? (
                        <CloudRain className="w-4 h-4 text-cyan-300 shrink-0" />
                      ) : day.icon === 'cloud' ? (
                        <Cloud className="w-4 h-4 text-blue-200 shrink-0" />
                      ) : day.icon === 'cloud-sun' ? (
                        <CloudSun className="w-4 h-4 text-yellow-200 shrink-0" />
                      ) : (
                        <Sun className="w-4 h-4 text-yellow-300 shrink-0" />
                      )}
                      <span className="text-[10px] font-semibold text-white truncate max-w-[100px]">
                        {day.climateText}
                      </span>
                    </div>

                    {/* Temperature Max / Min */}
                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-white">
                        {day.maxTemp}° / {day.minTemp}°
                      </span>
                      <span className="block text-[9px] font-mono text-cyan-200">
                        Rain: {day.rainChance}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
