import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  CloudRain, 
  Sun, 
  CloudLightning, 
  MapPin, 
  Search, 
  SlidersHorizontal,
  Maximize2,
  RefreshCw,
  Wind,
  Droplets,
  Eye,
  Layers
} from 'lucide-react';

export interface WeatherForecastItem {
  id: string;
  type: string;
  location: string;
  state: string;
  lat: number;
  lon: number;
  temp: string;
  humidity: string;
  windSpeed: string;
  rainProbability: string;
  advisory: string;
  iconType: 'rain' | 'thunder' | 'cloudy' | 'sunny';
}

export const FORECAST_ITEMS: WeatherForecastItem[] = [
  {
    id: 'fc-1',
    type: 'Rain',
    location: 'Bishnupur, Madhya Pradesh',
    state: 'Madhya Pradesh',
    lat: 22.0574,
    lon: 78.9382,
    temp: '28°C',
    humidity: '84%',
    windSpeed: '14 km/h',
    rainProbability: '78%',
    advisory: 'Moderate intermittent rain expected with overcast skies.',
    iconType: 'rain'
  },
  {
    id: 'fc-2',
    type: 'Rain',
    location: 'Chandel, Manipur',
    state: 'Manipur',
    lat: 24.3242,
    lon: 94.0371,
    temp: '24°C',
    humidity: '92%',
    windSpeed: '12 km/h',
    rainProbability: '85%',
    advisory: 'Continuous spells of rain over hilly terrain.',
    iconType: 'rain'
  },
  {
    id: 'fc-3',
    type: 'Rain',
    location: 'Churachandpur, Manipur',
    state: 'Manipur',
    lat: 24.3333,
    lon: 93.6833,
    temp: '23°C',
    humidity: '90%',
    windSpeed: '15 km/h',
    rainProbability: '88%',
    advisory: 'Heavy downpours likely during afternoon hours.',
    iconType: 'rain'
  },
  {
    id: 'fc-4',
    type: 'Rain',
    location: 'Imphal, Manipur',
    state: 'Manipur',
    lat: 24.8170,
    lon: 93.9368,
    temp: '25°C',
    humidity: '88%',
    windSpeed: '10 km/h',
    rainProbability: '80%',
    advisory: 'Valley-wide light to moderate precipitation.',
    iconType: 'rain'
  },
  {
    id: 'fc-5',
    type: 'Rain',
    location: 'Moirang, Manipur',
    state: 'Manipur',
    lat: 24.4960,
    lon: 93.7725,
    temp: '24°C',
    humidity: '89%',
    windSpeed: '11 km/h',
    rainProbability: '82%',
    advisory: 'Loktak Lake peripheral rain showers.',
    iconType: 'rain'
  },
  {
    id: 'fc-6',
    type: 'Rain',
    location: 'Moreh, Manipur',
    state: 'Manipur',
    lat: 24.2464,
    lon: 94.3052,
    temp: '26°C',
    humidity: '87%',
    windSpeed: '16 km/h',
    rainProbability: '75%',
    advisory: 'Passing thunderstorms with gusty winds.',
    iconType: 'rain'
  },
  {
    id: 'fc-7',
    type: 'Rain',
    location: 'Pherzawl, Manipur',
    state: 'Manipur',
    lat: 24.2500,
    lon: 93.2000,
    temp: '23°C',
    humidity: '93%',
    windSpeed: '13 km/h',
    rainProbability: '90%',
    advisory: 'Intense rain bands passing southwest corridor.',
    iconType: 'rain'
  },
  {
    id: 'fc-8',
    type: 'Rain',
    location: 'Senapati, Manipur',
    state: 'Manipur',
    lat: 25.2678,
    lon: 94.0189,
    temp: '22°C',
    humidity: '94%',
    windSpeed: '18 km/h',
    rainProbability: '92%',
    advisory: 'Mountain mist and active monsoonal precipitation.',
    iconType: 'rain'
  },
  {
    id: 'fc-9',
    type: 'Rain',
    location: 'Tamenglong, Manipur',
    state: 'Manipur',
    lat: 24.9858,
    lon: 93.4925,
    temp: '22°C',
    humidity: '95%',
    windSpeed: '14 km/h',
    rainProbability: '89%',
    advisory: 'Persistent showers over hillside settlements.',
    iconType: 'rain'
  },
  {
    id: 'fc-10',
    type: 'Rain',
    location: 'Nagpur, Maharashtra',
    state: 'Maharashtra',
    lat: 21.1458,
    lon: 79.0882,
    temp: '30°C',
    humidity: '76%',
    windSpeed: '18 km/h',
    rainProbability: '70%',
    advisory: 'Scattered convective thundercloud development.',
    iconType: 'rain'
  },
  {
    id: 'fc-11',
    type: 'Thunderstorm',
    location: 'Guwahati, Assam',
    state: 'Assam',
    lat: 26.1445,
    lon: 91.7362,
    temp: '27°C',
    humidity: '86%',
    windSpeed: '22 km/h',
    rainProbability: '80%',
    advisory: 'Brahmaputra valley thunderstorm with lightning.',
    iconType: 'thunder'
  },
  {
    id: 'fc-12',
    type: 'Rain',
    location: 'Dehradun, Uttarakhand',
    state: 'Uttarakhand',
    lat: 30.3165,
    lon: 78.0322,
    temp: '25°C',
    humidity: '82%',
    windSpeed: '12 km/h',
    rainProbability: '74%',
    advisory: 'Foot-hill rainfall and cloudy weather.',
    iconType: 'rain'
  }
];

export const ForecastWeatherView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IMD' | 'WEATHER'>('IMD');
  const [selectedState, setSelectedState] = useState<string>('PAN INDIA');
  const [selectedForecastItem, setSelectedForecastItem] = useState<WeatherForecastItem | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Filter items by state
  const filteredForecasts = useMemo(() => {
    if (selectedState === 'PAN INDIA' || selectedState === 'All') {
      return FORECAST_ITEMS;
    }
    return FORECAST_ITEMS.filter(f => f.state.toLowerCase() === selectedState.toLowerCase());
  }, [selectedState]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const indiaSouthWest = L.latLng(6.5, 68.0);
      const indiaNorthEast = L.latLng(37.2, 97.5);
      const indiaBounds = L.latLngBounds(indiaSouthWest, indiaNorthEast);

      const map = L.map(mapContainerRef.current, {
        center: [22.5, 82.5],
        zoom: 5,
        minZoom: 4.8,
        maxZoom: 14,
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true,
      });

      map.fitBounds(indiaBounds, { padding: [10, 10] });

      // Standard Street OSM Basemap matching screenshot
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } catch (e) {
      console.error('Error initializing Forecast Leaflet map', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render yellow weather icon pins on the map matching Screenshot
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    filteredForecasts.forEach((item) => {
      // Custom Yellow Cloud/Rain Icon Pin matching screenshot
      const isSelected = selectedForecastItem?.id === item.id;
      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isSelected ? '<span class="absolute inline-flex h-10 w-10 rounded-full bg-yellow-400 opacity-60 animate-ping"></span>' : ''}
          <div class="w-8 h-8 rounded-xl bg-[#fff500] border-2 border-slate-900 text-slate-950 flex flex-col items-center justify-center shadow-lg shadow-black/30 font-black text-xs transform transition-transform group-hover:scale-125 ${
            isSelected ? 'scale-125 ring-2 ring-blue-600' : ''
          }">
            <span>🌧️</span>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'custom-forecast-map-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([item.lat, item.lon], { icon });
      const popupHtml = `
        <div class="p-2.5 font-sans space-y-1.5 min-w-[200px]">
          <div class="bg-yellow-300 text-slate-950 font-black text-xs px-2 py-0.5 rounded text-center uppercase">
            ${item.type} Forecast
          </div>
          <div class="text-xs font-bold text-slate-900">${item.location}</div>
          <div class="grid grid-cols-2 gap-1 text-[10px] font-mono bg-slate-100 p-1.5 rounded border border-slate-200">
            <div>Temp: <strong>${item.temp}</strong></div>
            <div>Humidity: <strong>${item.humidity}</strong></div>
            <div>Rain Chance: <strong class="text-blue-600">${item.rainProbability}</strong></div>
            <div>Wind: <strong>${item.windSpeed}</strong></div>
          </div>
          <p class="text-[10px] text-slate-600 leading-snug">${item.advisory}</p>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
      marker.on('click', () => {
        setSelectedForecastItem(item);
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [filteredForecasts, selectedForecastItem]);

  const handleSelectForecastCard = (item: WeatherForecastItem) => {
    setSelectedForecastItem(item);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([item.lat, item.lon], 8, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-3 font-sans animate-fade-in">
      
      {/* 1. Forecast Controls Topbar (Matching Screenshot) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left Side: IMD Forecast pill button + Weather pill button + PAN INDIA selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* IMD Forecast button */}
          <button
            onClick={() => setActiveTab('IMD')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all border cursor-pointer ${
              activeTab === 'IMD'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-300 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
            }`}
          >
            IMD Forecast
          </button>

          {/* Weather button */}
          <button
            onClick={() => setActiveTab('WEATHER')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all border cursor-pointer ${
              activeTab === 'WEATHER'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-300 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
            }`}
          >
            Weather
          </button>

          {/* PAN INDIA Dropdown */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-blue-500 dark:border-blue-500 rounded-md px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-xs cursor-pointer min-w-[140px]"
          >
            <option value="PAN INDIA">PAN INDIA</option>
            <option value="Manipur">Manipur</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Assam">Assam</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>

        {/* Right Side: Grid / List View icon button */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs">
            <span className="font-mono text-sm leading-none font-black tracking-tighter">≡☰</span>
          </div>
        </div>

      </div>

      {/* 2. Main Forecast Grid: Map (Left 75%) + Yellow Forecast Cards Feed (Right 25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch lg:h-[660px]">
        
        {/* Left: Leaflet India Forecast Map (lg:col-span-8 or 9) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col h-[520px] lg:h-full relative">
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[480px] relative z-0"
          />
        </div>

        {/* Right: Weather Forecast List (lg:col-span-4 or 3) (Matching Screenshot) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col h-[520px] lg:h-full">
          
          {/* Blue Header: Weather Forecast */}
          <div className="bg-[#1e5aa8] dark:bg-[#18447e] text-white py-2.5 px-4 text-center font-black text-sm uppercase tracking-wider font-heading shadow-xs shrink-0">
            Weather Forecast
          </div>

          {/* Yellow Card Items Scrollable Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/40 custom-scrollbar">
            {filteredForecasts.map((fc) => (
              <div
                key={fc.id}
                onClick={() => handleSelectForecastCard(fc)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-150 text-center shadow-xs border ${
                  selectedForecastItem?.id === fc.id
                    ? 'bg-[#ffff00] border-slate-900 ring-2 ring-blue-600 scale-[1.02] shadow-md'
                    : 'bg-[#ffff00] dark:bg-[#ffea00] border-yellow-400 hover:scale-[1.01] hover:shadow-sm'
                }`}
              >
                <h4 className="text-xs font-black text-slate-950 tracking-tight uppercase">
                  {fc.type}
                </h4>
                <p className="text-[11px] font-bold text-slate-900 mt-0.5 leading-snug">
                  {fc.location}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
