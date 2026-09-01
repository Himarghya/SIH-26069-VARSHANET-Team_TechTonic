import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Radio, Globe, Compass, ExternalLink, ShieldAlert, CircleDot, CloudRain, Zap, Newspaper, Tag, Eye, Flame } from 'lucide-react';
import { EventCluster, WeatherReport, DwrStation } from '../../types';
import { fetchDwrRadarGrid } from '../../services/api';

interface IndiaWeatherMapProps {
  events: EventCluster[];
  reports?: WeatherReport[];
  selectedEventId?: string;
  onSelectEvent?: (event: EventCluster) => void;
  onSelectReport?: (report: WeatherReport) => void;
}

export const IndiaWeatherMap: React.FC<IndiaWeatherMapProps> = ({
  events,
  reports = [],
  selectedEventId,
  onSelectEvent,
  onSelectReport,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const newsLayerRef = useRef<L.LayerGroup | null>(null);
  const radarEchoesLayerRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.LayerGroup | null>(null);
  
  const [radarOverlayActive, setRadarOverlayActive] = useState(false);
  const [showInundationZones, setShowInundationZones] = useState(false);
  const [showDwrRadarEchoes, setShowDwrRadarEchoes] = useState(true);
  const [showNewsPinpoints, setShowNewsPinpoints] = useState(true);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedBaseMap, setSelectedBaseMap] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [dwrStations, setDwrStations] = useState<DwrStation[]>([]);

  // Load DWR radar stations
  useEffect(() => {
    fetchDwrRadarGrid()
      .then(res => setDwrStations(res.stations))
      .catch(err => console.warn('DWR Radar grid error', err));
  }, []);

  // Tile layer configurations
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

      const radarEchoesGroup = L.layerGroup().addTo(map);
      radarEchoesLayerRef.current = radarEchoesGroup;

      const zonesGroup = L.layerGroup().addTo(map);
      zonesLayerRef.current = zonesGroup;

      const newsGroup = L.layerGroup().addTo(map);
      newsLayerRef.current = newsGroup;

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

  // Render DWR Doppler Radar Stations (Clean minimal dots)
  useEffect(() => {
    if (!mapInstanceRef.current || !radarEchoesLayerRef.current) return;
    radarEchoesLayerRef.current.clearLayers();

    if (showDwrRadarEchoes && dwrStations.length > 0) {
      dwrStations.forEach(st => {
        const radarColor = st.hydrometeor_classification.color || '#0284c7';
        
        const dwrHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div style="background-color: ${radarColor};" class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] font-black border border-white/90 shadow-md">
              ⚡
            </div>
          </div>
        `;

        const dwrIcon = L.divIcon({
          html: dwrHtml,
          className: 'custom-dwr-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const dwrMarker = L.marker([st.latitude, st.longitude], { icon: dwrIcon });
        
        const popupHtml = `
          <div class="p-2.5 space-y-1.5 min-w-[190px] font-sans">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1">
              <span class="text-xs font-bold text-white uppercase">${st.station_name} DWR</span>
              <span style="color: ${radarColor};" class="text-[10px] font-mono font-bold">${st.peak_reflectivity_dbz} dBZ</span>
            </div>
            <p class="text-[11px] text-cyan-300 font-mono">${st.state} • ${st.range_km}km</p>
            <div class="text-[10px] font-mono text-slate-300 py-1 bg-slate-950 px-2 rounded border border-slate-800">
              <div>Rain Rate: <strong class="text-emerald-400">${st.estimated_rain_rate_mmh} mm/h</strong></div>
              <div>Echo: <strong style="color: ${radarColor};">${st.hydrometeor_classification.label}</strong></div>
            </div>
          </div>
        `;
        dwrMarker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
        radarEchoesLayerRef.current?.addLayer(dwrMarker);
      });
    }
  }, [dwrStations, showDwrRadarEchoes]);

  // Render City-Grouped Clean News Pins (Zero Overlap)
  useEffect(() => {
    if (!mapInstanceRef.current || !newsLayerRef.current) return;
    newsLayerRef.current.clearLayers();

    if (showNewsPinpoints && reports.length > 0) {
      const newsReports = reports.filter(r => r.source_type === 'rss_news' && r.latitude && r.longitude);

      // Group news by City to eliminate duplicate stacking
      const cityNewsMap: Record<string, WeatherReport[]> = {};
      newsReports.forEach(r => {
        const cityKey = (r.city || r.state || 'India').toLowerCase();
        if (!cityNewsMap[cityKey]) cityNewsMap[cityKey] = [];
        cityNewsMap[cityKey].push(r);
      });

      Object.entries(cityNewsMap).forEach(([cityKey, cityReps]) => {
        const primaryRep = cityReps[0];
        const count = cityReps.length;
        
        // Offset news pin slightly north-east (+0.35 deg lat, +0.35 deg lon) so it never collides with incident circle
        const newsLat = primaryRep.latitude + 0.35;
        const newsLon = primaryRep.longitude + 0.35;

        const publisherClean = (primaryRep.source_name || 'News')
          .replace('The ', '')
          .replace(' News', '')
          .replace(' 24x7', '')
          .slice(0, 10);

        const countBadge = count > 1 ? ` (+${count - 1})` : '';

        // Ultra-sleek compact glassmorphic pill
        const newsPinHtml = `
          <div class="relative flex flex-col items-center justify-center cursor-pointer group">
            <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-950/95 backdrop-blur-md text-indigo-200 text-[8px] font-mono font-bold border border-indigo-500/70 shadow-md shadow-indigo-950/80 transition-transform group-hover:scale-110 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span>📰 ${publisherClean}${countBadge}</span>
            </div>
            <div class="w-1 h-1 bg-indigo-400 rotate-45 -mt-0.5"></div>
          </div>
        `;

        const newsIcon = L.divIcon({
          html: newsPinHtml,
          className: 'custom-news-marker',
          iconSize: [65, 20],
          iconAnchor: [32, 18]
        });

        const newsMarker = L.marker([newsLat, newsLon], { icon: newsIcon });
        const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${primaryRep.latitude},${primaryRep.longitude}`;

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 space-y-2 min-w-[260px] max-w-[320px] text-slate-200 font-sans';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 border-b border-indigo-800/60 pb-1.5">
            <span class="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wide flex items-center gap-1">
              <span>📰</span> ${primaryRep.city || 'Regional'} News Feed (${count})
            </span>
            <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              ${primaryRep.credibility_score}% Trust
            </span>
          </div>

          <div class="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            ${cityReps.slice(0, 3).map((r, i) => `
              <div class="text-[11px] text-white font-semibold leading-snug border-l-2 border-indigo-500 pl-1.5 py-0.5 bg-slate-950/60 rounded-r">
                <p class="line-clamp-2">${r.text}</p>
                <span class="text-[9px] font-mono text-indigo-300 block mt-0.5">${r.source_name || 'News Source'}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="pt-1.5 flex flex-col gap-1">
            <a href="${streetViewUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-[10px] font-bold text-center flex items-center justify-center gap-1">
              <span>👁 Pinpoint in Google Street View</span>
            </a>
          </div>
        `;

        newsMarker.bindPopup(popupContent, {
          className: 'custom-leaflet-popup',
          closeButton: true
        });

        newsMarker.on('click', () => {
          if (onSelectReport) onSelectReport(primaryRep);
        });

        newsLayerRef.current?.addLayer(newsMarker);
      });
    }
  }, [reports, showNewsPinpoints, onSelectReport]);

  // Update Incident Markers & Optional Inundation Buffer Zones
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

      if (showInundationZones) {
        const outerBuffer = L.circle([evt.latitude, evt.longitude], {
          radius: 12000,
          color: color,
          weight: 1,
          dashArray: '3, 6',
          fillColor: color,
          fillOpacity: 0.05
        });
        zonesLayerRef.current?.addLayer(outerBuffer);
      }

      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div style="background-color: ${color}; width: ${isSelected ? '28px' : '22px'}; height: ${isSelected ? '28px' : '22px'};" class="rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-black/80 border-2 border-white transition-transform group-hover:scale-125">
            ${evt.total_reports}
          </div>
          <span style="border-color: ${color};" class="absolute w-8 h-8 rounded-full border animate-ping opacity-40 pointer-events-none"></span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-weather-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
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
          <span className="text-[11px] text-cyan-400 font-mono font-semibold">({events.length} Clusters)</span>
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

          {/* Live News Pins Toggle */}
          <button
            onClick={() => setShowNewsPinpoints(!showNewsPinpoints)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showNewsPinpoints
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-md font-bold'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle Live News & Media City Pinpoints"
          >
            <Newspaper className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">News Pins</span>
          </button>

          {/* DWR Doppler Radar Layer Toggle */}
          <button
            onClick={() => setShowDwrRadarEchoes(!showDwrRadarEchoes)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showDwrRadarEchoes
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-md'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle IMD Doppler Radar (DWR) station network"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">DWR Radar</span>
          </button>

          {/* Inundation Zones Toggle */}
          <button
            onClick={() => setShowInundationZones(!showInundationZones)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showInundationZones
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle Impact Zones"
          >
            <CircleDot className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Impact Zones</span>
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

      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '520px' }} />

      {/* DWR Radar Reflectivity dBZ Scale Legend */}
      <div className="absolute bottom-3 right-3 z-[400] bg-slate-900/95 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[9px] space-y-1 shadow-2xl">
        <span className="font-bold text-slate-300 block uppercase tracking-wider text-[8px]">DWR Radar (dBZ)</span>
        <div className="flex items-center gap-1 font-mono">
          <span className="px-1 py-0.2 rounded bg-emerald-700 text-white font-bold">15-25</span>
          <span className="px-1 py-0.2 rounded bg-cyan-700 text-white font-bold">25-35</span>
          <span className="px-1 py-0.2 rounded bg-amber-600 text-white font-bold">35-45</span>
          <span className="px-1 py-0.2 rounded bg-rose-600 text-white font-bold">45-55</span>
          <span className="px-1 py-0.2 rounded bg-purple-700 text-white font-bold">55+</span>
        </div>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/95 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[9px] space-y-1 shadow-2xl">
        <span className="font-bold text-slate-300 block uppercase tracking-wider text-[8px]">Layers Legend</span>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-slate-300">Critical</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-slate-300">High</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span><span className="text-slate-300">Cluster</span></div>
          <div className="flex items-center gap-1"><span className="px-1 py-0.2 rounded bg-indigo-950 border border-indigo-500 text-indigo-200 font-mono text-[7px]">📰 News</span></div>
        </div>
      </div>
    </div>
  );
};