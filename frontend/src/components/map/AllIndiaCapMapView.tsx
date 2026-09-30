import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OfficialCapAlert } from './CapAlertDetailModal';
import { WeatherOverviewWidget } from './WeatherOverviewWidget';
import { MapPin, Maximize2, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

interface AllIndiaCapMapViewProps {
  alerts: OfficialCapAlert[];
  onSelectAlert: (alert: OfficialCapAlert) => void;
}

export const AllIndiaCapMapView: React.FC<AllIndiaCapMapViewProps> = ({
  alerts,
  onSelectAlert
}) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
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
        maxZoom: 15,
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true,
        scrollWheelZoom: false,
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
      console.error('Error initializing All India CAP Leaflet map', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render CAP Alert Markers on Map matching screenshot
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    alerts.forEach((alert) => {
      const isSelected = selectedAlertId === alert.id;
      const isFlood = alert.event.toLowerCase().includes('flood');
      const isThunder = alert.event.toLowerCase().includes('lightning') || alert.event.toLowerCase().includes('thunder');
      const isCyclone = alert.event.toLowerCase().includes('cyclon');

      const emojiIcon = isFlood ? '🌊' : isThunder ? '⛈️' : isCyclone ? '🌀' : '⚠️';
      const bgColor = alert.warningColor === 'orange' ? '#ff9800' : alert.warningColor === 'red' ? '#f44336' : '#ffff00';
      const textColor = alert.warningColor === 'orange' || alert.warningColor === 'red' ? '#ffffff' : '#0f172a';

      // Custom Yellow/Orange CAP Pin matching screenshot
      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isSelected ? '<span class="absolute inline-flex h-10 w-10 rounded-full bg-amber-400 opacity-60 animate-ping"></span>' : ''}
          <div style="background-color: ${bgColor}; color: ${textColor};" class="w-8 h-8 rounded-full border-2 border-slate-900 flex flex-col items-center justify-center shadow-lg shadow-black/40 font-black text-xs transform transition-transform group-hover:scale-125 ${
            isSelected ? 'scale-125 ring-2 ring-blue-600' : ''
          }">
            <span class="text-xs">${emojiIcon}</span>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'custom-cap-map-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([alert.lat, alert.lon], { icon });

      // Impact Zone circle
      const circle = L.circle([alert.lat, alert.lon], {
        radius: alert.radiusKm * 800,
        color: alert.warningColor === 'orange' ? '#ea580c' : alert.warningColor === 'red' ? '#dc2626' : '#eab308',
        fillColor: alert.warningColor === 'orange' ? '#ea580c' : alert.warningColor === 'red' ? '#dc2626' : '#eab308',
        fillOpacity: 0.20,
        weight: 1.5,
        dashArray: '3, 3'
      });
      markersGroupRef.current?.addLayer(circle);

      const popupHtml = `
        <div class="p-2.5 font-sans space-y-1.5 min-w-[220px]">
          <div style="background-color: ${bgColor}; color: ${textColor};" class="font-black text-xs px-2 py-0.5 rounded text-center uppercase shadow-xs">
            ${alert.event}
          </div>
          <div class="text-xs font-bold text-slate-900">${alert.location}</div>
          <div class="text-[10px] font-mono text-slate-600 bg-slate-100 p-1.5 rounded border border-slate-200">
            <div>Issued By: <strong>${alert.issuedBy}</strong></div>
            <div>Valid Upto: <strong>${alert.validUpto}</strong></div>
            <div>Severity: <strong class="text-rose-600">${alert.warningLevel} Warning</strong></div>
          </div>
          <button id="btn-cap-${alert.id}" class="w-full py-1.5 mt-1 rounded-lg bg-[#18447e] hover:bg-[#153a6b] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-colors">
            <span>Open Action Bulletin &amp; Do's/Don'ts</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
      
      marker.on('click', () => {
        setSelectedAlertId(alert.id);
        setTimeout(() => {
          const btn = document.getElementById(`btn-cap-${alert.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectAlert(alert);
            };
          }
        }, 50);
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [alerts, selectedAlertId, onSelectAlert]);

  const handleAlertCardClick = (alert: OfficialCapAlert) => {
    setSelectedAlertId(alert.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([alert.lat, alert.lon], 7, { duration: 1.0 });
    }
    onSelectAlert(alert);
  };

  const handleCitySearchFlyTo = (cityName: string, lat: number, lon: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 8, { duration: 1.2 });
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter(item => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return item.event.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) || item.state.toLowerCase().includes(q);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch lg:h-[680px] animate-fade-in font-sans">
      
      {/* Column 1: Full Interactive Leaflet All India CAP Map (6 cols on lg) */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col h-[540px] lg:h-full relative">
        <div
          ref={mapContainerRef}
          className="w-full h-full min-h-[480px] relative z-0"
        />
      </div>

      {/* Column 2: ALERT LIST (3 cols on lg) (Matching Screenshot) */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col h-[540px] lg:h-full">
        
        {/* Blue Header: ALERT LIST */}
        <div className="bg-[#18447e] text-white py-2.5 px-3 flex items-center justify-between font-black text-sm uppercase tracking-wider font-heading shadow-xs shrink-0">
          <span className="text-center w-full">ALERT LIST ({alerts.length})</span>
        </div>

        {/* Quick Search Filter */}
        <div className="p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <input
            type="text"
            placeholder="Search alerts / location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2.5 py-1 text-xs rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Scrollable Alert List Items */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 bg-slate-50/50 dark:bg-slate-950/40 custom-scrollbar">
          {filteredAlerts.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 font-semibold">
              No matching alerts found.
            </div>
          ) : (
            filteredAlerts.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAlertCardClick(item)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-150 text-center shadow-xs border ${
                  item.warningColor === 'orange'
                    ? 'bg-[#ff9800] text-white border-amber-600 font-bold hover:scale-[1.01]'
                    : item.warningColor === 'red'
                    ? 'bg-[#f44336] text-white border-rose-600 font-bold hover:scale-[1.01]'
                    : 'bg-[#ffff00] text-[#000000] border-yellow-400 font-bold hover:scale-[1.01]'
                } ${selectedAlertId === item.id ? 'ring-2 ring-blue-600 scale-[1.02] shadow-md' : ''}`}
              >
                <h4 className={`text-xs font-black tracking-tight uppercase leading-tight ${
                  item.warningColor === 'orange' || item.warningColor === 'red' ? 'text-white' : 'text-[#000000]'
                }`}>
                  {item.event}
                </h4>
                <p className={`text-[11px] font-bold mt-1 leading-snug ${
                  item.warningColor === 'orange' || item.warningColor === 'red' ? 'text-white/95' : 'text-[#000000]/90'
                }`}>
                  {item.location}
                </p>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Column 3: Weather Overview Widget (3 cols on lg) (Matching Screenshot media_1790757655868.png) */}
      <div className="lg:col-span-3 h-[540px] lg:h-full">
        <WeatherOverviewWidget onCitySearch={handleCitySearchFlyTo} />
      </div>

    </div>
  );
};
