import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Radio, Globe, Compass, ExternalLink, ShieldAlert, CircleDot } from 'lucide-react';
import { EventCluster, WeatherReport } from '../../types';

interface IndiaWeatherMapProps {
  events: EventCluster[];
  reports?: WeatherReport[];
  selectedEventId?: string;
  onSelectEvent?: (event: EventCluster) => void;
  onSelectReport?: (report: WeatherReport) => void;
}

export const IndiaWeatherMap: React.FC<IndiaWeatherMapProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.LayerGroup | null>(null);
  
  const [radarOverlayActive, setRadarOverlayActive] = useState(true);
  const [showInundationZones, setShowInundationZones] = useState(true);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedBaseMap, setSelectedBaseMap] = useState<'dark' | 'satellite' | 'street'>('dark');

  // Tile layer configurations (100% free, zero API key watermark)
  const setTileLayer = (map: L.Map, type: 'dark' | 'satellite' | 'street') => {
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }
    const group = L.layerGroup();

    if (type === 'dark') {
      const base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &copy; OpenStreetMap',
        maxZoom: 16,
      });
      const labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
      });
      group.addLayer(base);
      group.addLayer(labels);
    } else if (type === 'satellite') {
      const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Imagery',
        maxZoom: 18,
      });
      group.addLayer(sat);
    } else {
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      });
      group.addLayer(osm);
    }

    group.addTo(map);
    baseTileLayerRef.current = group;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [22.0, 82.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 16,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      map.fitBounds([
        [7.0, 68.0],
        [37.0, 97.5]
      ], { padding: [15, 15] });

      setTileLayer(map, selectedBaseMap);

      const zonesGroup = L.layerGroup().addTo(map);
      zonesLayerRef.current = zonesGroup;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      
      mapInstanceRef.current = map;
    } catch (err) {
      console.warn('Map initialization:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, []);

  // Update base map layer on toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    setTileLayer(mapInstanceRef.current, selectedBaseMap);
  }, [selectedBaseMap]);

  // Update Markers & Inundation Buffer Zones
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !zonesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    zonesLayerRef.current.clearLayers();

    const filteredEvents = selectedState === 'All'
      ? events
      : events.filter(e => e.state.toLowerCase().includes(selectedState.toLowerCase()));

    filteredEvents.forEach(evt => {
      const isSelected = evt.id === selectedEventId;
      const severityColors: Record<string, string> = {
        CRITICAL: '#f43f5e',
        HIGH: '#f97316',
        MODERATE: '#06b6d4',
        LOW: '#10b981'
      };
      const color = severityColors[evt.severity] || '#06b6d4';

      // 1. Inundation Zones (5km Core Zone & 15km Impact Buffer)
      if (showInundationZones) {
        const outerBuffer = L.circle([evt.latitude, evt.longitude], {
          radius: 15000,
          color: color,
          weight: 1,
          dashArray: '4, 6',
          fillColor: color,
          fillOpacity: 0.08
        });
        const innerZone = L.circle([evt.latitude, evt.longitude], {
          radius: 5000,
          color: color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: 0.2
        });
        zonesLayerRef.current?.addLayer(outerBuffer);
        zonesLayerRef.current?.addLayer(innerZone);
      }

      // 2. Incident Marker Badge
      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div style="background-color: ${color}; width: ${isSelected ? '32px' : '26px'}; height: ${isSelected ? '32px' : '26px'};" class="rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-lg shadow-black/60 border-2 border-white transition-transform group-hover:scale-125">
            ${evt.total_reports}
          </div>
          <span style="border-color: ${color};" class="absolute w-11 h-11 rounded-full border-2 animate-ping opacity-50 pointer-events-none"></span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-weather-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([evt.latitude, evt.longitude], { icon: customIcon });

      const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${evt.latitude},${evt.longitude}`;

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 space-y-2 min-w-[240px] text-slate-200 font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5">
          <span class="text-xs font-extrabold text-white uppercase tracking-wide">${evt.event_type}</span>
          <span style="color: ${color};" class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">${evt.severity}</span>
        </div>
        <p class="text-xs font-bold text-cyan-300">${evt.city || 'Region'}, ${evt.state}</p>
        <div class="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-300 py-1.5 bg-slate-950/80 px-2 rounded-lg border border-slate-800/80">
          <div>Reports: <strong class="text-white">${evt.total_reports}</strong></div>
          <div>Evidence: <strong class="text-emerald-400">${evt.overall_credibility}%</strong></div>
          <div>Sources: <strong class="text-white">${evt.independent_sources_count}</strong></div>
          <div>Status: <strong class="text-cyan-400">${evt.status}</strong></div>
        </div>
        <p class="text-[11px] text-slate-400 leading-snug">${evt.summary || 'Corroborated multi-source incident cluster.'}</p>
        
        <div class="pt-2 flex flex-col gap-1.5">
          <button id="btn-inspect-${evt.id}" class="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
            <span>⚡ Open in Incident Command Room</span>
          </button>
          <a href="${streetViewUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-[10px] font-bold text-center flex items-center justify-center gap-1">
            <span>👁 Pinpoint in Google Street View</span>
          </a>
        </div>
      `;

      setTimeout(() => {
        const btn = document.getElementById(`btn-inspect-${evt.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectEvent) onSelectEvent(evt);
          };
        }
      }, 50);

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup',
        closeButton: true,
      });

      marker.on('click', () => {
        if (onSelectEvent) onSelectEvent(evt);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [events, selectedState, selectedEventId, showInundationZones, onSelectEvent]);

  return (
    <div className="relative w-full h-full min-h-[540px] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs shadow-2xl pointer-events-auto">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">National Weather Map</span>
          <span className="text-[11px] text-cyan-400 font-mono font-semibold">({events.length} Active Incident Clusters)</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Map Layer Switcher */}
          <div className="flex items-center bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs shadow-2xl">
            <button
              onClick={() => setSelectedBaseMap('dark')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedBaseMap === 'dark' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cyber Dark
            </button>
            <button
              onClick={() => setSelectedBaseMap('satellite')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedBaseMap === 'satellite' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setSelectedBaseMap('street')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedBaseMap === 'street' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Standard
            </button>
          </div>

          {/* Inundation Zones Toggle */}
          <button
            onClick={() => setShowInundationZones(!showInundationZones)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showInundationZones
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle 5km/15km Inundation & Buffer footprints"
          >
            <CircleDot className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Impact Zones</span>
          </button>

          {/* Radar Overlay Toggle */}
          <button
            onClick={() => setRadarOverlayActive(!radarOverlayActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              radarOverlayActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${radarOverlayActive ? 'animate-pulse text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Radar Pulse</span>
          </button>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-900/95 backdrop-blur-md text-xs text-slate-200 font-medium px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none cursor-pointer shadow-2xl"
          >
            <option value="All">All Indian States</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Odisha">Odisha</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>
      </div>

      {/* Simulated Radar Overlay Ring */}
      {radarOverlayActive && (
        <div className="absolute inset-0 pointer-events-none z-[300] overflow-hidden opacity-25">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/40 radar-glow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-400/30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-cyan-300/20"></div>
        </div>
      )}

      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '520px' }} />

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1.5 shadow-2xl">
        <span className="font-bold text-slate-300 block uppercase tracking-wider text-[9px]">Cluster Severity</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-slate-300">Critical</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-slate-300">High</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span><span className="text-slate-300">Moderate</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span className="text-slate-300">Low</span></div>
        </div>
      </div>
    </div>
  );
};