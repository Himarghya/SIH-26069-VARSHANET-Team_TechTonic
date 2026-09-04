import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Radio, Globe, Compass, ExternalLink, ShieldAlert, CircleDot, CloudRain, Zap, Newspaper, Tag, Eye, Flame, Shield, Play, Pause, FastForward, Anchor, LifeBuoy, Wind } from 'lucide-react';
import { EventCluster, WeatherReport, DwrStation } from '../../types';
import { fetchDwrRadarGrid } from '../../services/api';

interface IndiaWeatherMapProps {
  events: EventCluster[];
  reports?: WeatherReport[];
  selectedEventId?: string;
  onSelectEvent?: (event: EventCluster) => void;
  onSelectReport?: (report: WeatherReport) => void;
}

// NDRF Strategic Quick-Response Rescue Battalions across India
const NDRF_BATTALIONS = [
  { id: 'ndrf_01', name: '1st Bn NDRF (Guwahati)', lat: 26.1158, lon: 91.7086, state: 'Assam', teams: 18, boats: 42, divers: 36, commander: 'Commandant R. K. Sharma', readiness: 'RED ALERT (ACTIVE)' },
  { id: 'ndrf_04', name: '4th Bn NDRF (Arakkonam)', lat: 13.0784, lon: 79.6687, state: 'Tamil Nadu', teams: 16, boats: 38, divers: 30, commander: 'Commandant M. V. Nair', readiness: 'STANDBY (QRT 15m)' },
  { id: 'ndrf_05', name: '5th Bn NDRF (Pune)', lat: 18.7516, lon: 73.6842, state: 'Maharashtra', teams: 20, boats: 50, divers: 45, commander: 'Commandant S. B. Patil', readiness: 'DEPLOYED (MUMBAI/KONKAN)' },
  { id: 'ndrf_08', name: '8th Bn NDRF (Ghaziabad)', lat: 28.6692, lon: 77.4538, state: 'Uttar Pradesh / NCR', teams: 22, boats: 48, divers: 40, commander: 'Commandant P. K. Srivastava', readiness: 'HIGH ALERT (YAMUNA FLOODS)' },
  { id: 'ndrf_09', name: '9th Bn NDRF (Patna)', lat: 25.5941, lon: 85.1376, state: 'Bihar', teams: 18, boats: 44, divers: 35, commander: 'Commandant A. K. Rai', readiness: 'STANDBY (KOSI BASIN)' },
  { id: 'ndrf_11', name: '11th Bn NDRF (Varanasi)', lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh', teams: 16, boats: 36, divers: 28, commander: 'Commandant V. P. Singh', readiness: 'MONITORING (GANGA BASIN)' },
  { id: 'ndrf_03', name: '3rd Bn NDRF (Mundali/Cuttack)', lat: 20.4625, lon: 85.8830, state: 'Odisha', teams: 18, boats: 40, divers: 32, commander: 'Commandant D. K. Jena', readiness: 'CYCLONE QRT ACTIVE' },
  { id: 'ndrf_06', name: '6th Bn NDRF (Vadodara)', lat: 22.3072, lon: 73.1812, state: 'Gujarat', teams: 14, boats: 32, divers: 24, commander: 'Commandant N. K. Joshi', readiness: 'STANDBY' }
];

// CWC Critical River Inundation Corridors (Polyline coordinates)
const RIVER_FLOOD_CORRIDORS = [
  {
    name: 'Brahmaputra Flood Basin (Guwahati to Dhubri)',
    dangerLevel: '+1.85m Above Warning Level',
    discharge: '112,000 Cusecs',
    color: '#06b6d4',
    coords: [[26.1445, 91.7362], [26.1800, 91.5000], [26.1000, 90.8000], [26.0200, 89.9800]]
  },
  {
    name: 'Yamuna Floodplain Corridor (Delhi Wazirabad to Okhla)',
    dangerLevel: '+0.92m Above Warning Level',
    discharge: '45,000 Cusecs (Hathnikund Released)',
    color: '#38bdf8',
    coords: [[28.7100, 77.2300], [28.6600, 77.2400], [28.6100, 77.2500], [28.5300, 77.3000]]
  },
  {
    name: 'Mithi River Basin & Hindmata Channel (Mumbai)',
    dangerLevel: 'High Tide Storm Surge (4.2m)',
    discharge: 'Peak Inundation 3.5 ft Depth',
    color: '#0284c7',
    coords: [[19.0760, 72.8777], [19.0400, 72.8500], [19.0100, 72.8400], [18.9800, 72.8300]]
  },
  {
    name: 'Ganga Flood Basin (Varanasi to Patna)',
    dangerLevel: 'Approaching Warning Level (70.2m)',
    discharge: '88,000 Cusecs',
    color: '#0ea5e9',
    coords: [[25.3176, 82.9739], [25.4000, 83.5000], [25.5000, 84.3000], [25.5941, 85.1376]]
  }
];

// Real-Time Cloud-to-Ground Lightning Strikes (IITM / Damini Grid)
const LIGHTNING_STRIKES = [
  { lat: 19.1200, lon: 72.8900, city: 'Mumbai Suburbs', peakKa: -54, delayMs: '12s ago' },
  { lat: 26.1900, lon: 91.7600, city: 'Guwahati Hills', peakKa: -68, delayMs: '24s ago' },
  { lat: 30.3400, lon: 78.0500, city: 'Dehradun Valley', peakKa: -42, delayMs: '45s ago' },
  { lat: 23.2700, lon: 77.4300, city: 'Bhopal Upper Lake', peakKa: -38, delayMs: '1m ago' },
  { lat: 22.5800, lon: 88.3800, city: 'Kolkata Salt Lake', peakKa: -49, delayMs: '1m ago' }
];

// Active Cyclone Storm Track & Landfall Cone Forecaster
const CYCLONE_SYSTEM = {
  name: 'Cyclonic Storm VARSHA',
  stage: 'Very Severe Cyclonic Storm (VSCS)',
  windSpeed: '135-145 km/h gusts up to 160 km/h',
  eyeCoords: [17.8, 86.4],
  trackPoints: [
    { lat: 16.5, lon: 88.0, label: 'T-12h (Deep Depression)' },
    { lat: 17.8, lon: 86.4, label: 'LIVE EYE (VSCS 140 km/h)' },
    { lat: 19.2, lon: 85.2, label: '+12h Forecast (Puri Coast)' },
    { lat: 20.6, lon: 84.8, label: '+24h Forecast (Landfall Odisha)' }
  ],
  coneCoords: [
    [17.8, 86.4],
    [19.8, 86.2],
    [21.2, 85.6],
    [20.8, 83.8],
    [19.0, 84.4],
    [17.8, 86.4]
  ]
};

// Tactical Quick-Jump Cities
const QUICK_JUMP_CITIES = [
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, zoom: 11, tag: 'Red Alert' },
  { name: 'Delhi NCR', lat: 28.6139, lon: 77.2090, zoom: 11, tag: 'Yamuna Flood' },
  { name: 'Guwahati', lat: 26.1445, lon: 91.7362, zoom: 11, tag: 'Flash Flood' },
  { name: 'Bhopal', lat: 23.2599, lon: 77.4126, zoom: 11, tag: 'Cloudburst' },
  { name: 'Dehradun', lat: 30.3165, lon: 78.0322, zoom: 11, tag: 'Landslide' },
  { name: 'Odisha Coast', lat: 19.8135, lon: 85.8312, zoom: 8, tag: 'Cyclone Cone' }
];

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
  const ndrfLayerRef = useRef<L.LayerGroup | null>(null);
  const riverLayerRef = useRef<L.LayerGroup | null>(null);
  const lightningLayerRef = useRef<L.LayerGroup | null>(null);
  const cycloneLayerRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.LayerGroup | null>(null);
  
  // Layer states
  const [showInundationZones, setShowInundationZones] = useState(true);
  const [showDwrRadarEchoes, setShowDwrRadarEchoes] = useState(true);
  const [showNewsPinpoints, setShowNewsPinpoints] = useState(true);
  const [showNdrfDepots, setShowNdrfDepots] = useState(true);
  const [showRiverCorridors, setShowRiverCorridors] = useState(true);
  const [showLightningGrid, setShowLightningGrid] = useState(true);
  const [showCycloneCone, setShowCycloneCone] = useState(true);
  const [radarTimeline, setRadarTimeline] = useState<'T-1h' | 'LIVE' | '+1h' | '+3h'>('LIVE');
  const [isRadarPlaying, setIsRadarPlaying] = useState(false);

  const [selectedState, setSelectedState] = useState('All');
  const [selectedBaseMap, setSelectedBaseMap] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [dwrStations, setDwrStations] = useState<DwrStation[]>([]);

  // Load DWR radar stations
  useEffect(() => {
    fetchDwrRadarGrid()
      .then(res => setDwrStations(res.stations))
      .catch(err => console.warn('DWR Radar grid error', err));
  }, []);

  // Radar Timeline Auto-Play Loop
  useEffect(() => {
    if (!isRadarPlaying) return;
    const frames: ('T-1h' | 'LIVE' | '+1h' | '+3h')[] = ['T-1h', 'LIVE', '+1h', '+3h'];
    const timer = setInterval(() => {
      setRadarTimeline(prev => {
        const nextIdx = (frames.indexOf(prev) + 1) % frames.length;
        return frames[nextIdx];
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isRadarPlaying]);

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

      setTileLayer(map, selectedBaseMap);

      markersLayerRef.current = L.layerGroup().addTo(map);
      zonesLayerRef.current = L.layerGroup().addTo(map);
      newsLayerRef.current = L.layerGroup().addTo(map);
      radarEchoesLayerRef.current = L.layerGroup().addTo(map);
      ndrfLayerRef.current = L.layerGroup().addTo(map);
      riverLayerRef.current = L.layerGroup().addTo(map);
      lightningLayerRef.current = L.layerGroup().addTo(map);
      cycloneLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    } catch (e) {
      console.error('Error initializing Leaflet map', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTileLayer(mapInstanceRef.current, selectedBaseMap);
    }
  }, [selectedBaseMap]);

  // Render NDRF Rescue Battalions
  useEffect(() => {
    if (!mapInstanceRef.current || !ndrfLayerRef.current) return;
    ndrfLayerRef.current.clearLayers();

    if (showNdrfDepots) {
      NDRF_BATTALIONS.forEach(bn => {
        const ndrfHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-400 text-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-950/60 font-bold text-[10px] group-hover:scale-110 transition-transform">
              🚁
            </div>
            <div class="absolute -bottom-1 w-1.5 h-1.5 bg-emerald-400 rotate-45"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: ndrfHtml,
          className: 'custom-ndrf-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        });

        const marker = L.marker([bn.lat, bn.lon], { icon });
        const popupHtml = `
          <div class="p-3 space-y-2 min-w-[240px] font-sans">
            <div class="flex items-center justify-between border-b border-emerald-800 pb-1.5">
              <span class="text-xs font-bold text-white uppercase flex items-center gap-1">
                <span>🚁</span> ${bn.name}
              </span>
              <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                ${bn.readiness}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
              <div class="bg-slate-950 p-1 rounded border border-slate-800">
                <span class="text-slate-400 block text-[8px]">TEAMS</span>
                <span class="text-emerald-400 font-bold">${bn.teams} QRT</span>
              </div>
              <div class="bg-slate-950 p-1 rounded border border-slate-800">
                <span class="text-slate-400 block text-[8px]">IRB BOATS</span>
                <span class="text-cyan-400 font-bold">${bn.boats} Units</span>
              </div>
              <div class="bg-slate-950 p-1 rounded border border-slate-800">
                <span class="text-slate-400 block text-[8px]">DIVERS</span>
                <span class="text-amber-400 font-bold">${bn.divers}</span>
              </div>
            </div>
            <div class="text-[10px] font-mono text-slate-400">
              Command: <strong class="text-slate-200">${bn.commander}</strong>
            </div>
          </div>
        `;
        marker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
        ndrfLayerRef.current?.addLayer(marker);
      });
    }
  }, [showNdrfDepots]);

  // Render CWC River Corridors & Inundation Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !riverLayerRef.current) return;
    riverLayerRef.current.clearLayers();

    if (showRiverCorridors) {
      RIVER_FLOOD_CORRIDORS.forEach(riv => {
        const polyline = L.polyline(riv.coords as any, {
          color: riv.color,
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 8'
        });

        const popupHtml = `
          <div class="p-2.5 space-y-1.5 min-w-[220px] font-sans">
            <div class="flex items-center gap-1 border-b border-cyan-800 pb-1 text-cyan-300 font-bold text-xs">
              <span>🌊</span> ${riv.name}
            </div>
            <div class="text-[10px] font-mono space-y-1 bg-slate-950 p-1.5 rounded border border-slate-800">
              <div>Gauge Stage: <strong class="text-rose-400">${riv.dangerLevel}</strong></div>
              <div>River Discharge: <strong class="text-cyan-400">${riv.discharge}</strong></div>
            </div>
          </div>
        `;
        polyline.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
        riverLayerRef.current?.addLayer(polyline);
      });
    }
  }, [showRiverCorridors]);

  // Render Lightning Strikes
  useEffect(() => {
    if (!mapInstanceRef.current || !lightningLayerRef.current) return;
    lightningLayerRef.current.clearLayers();

    if (showLightningGrid) {
      LIGHTNING_STRIKES.forEach(lgt => {
        const lgtHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="w-5 h-5 rounded-full bg-amber-400/20 animate-ping absolute"></div>
            <div class="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[9px] shadow-lg shadow-amber-400/80">
              ⚡
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: lgtHtml,
          className: 'custom-lightning-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([lgt.lat, lgt.lon], { icon });
        const popupHtml = `
          <div class="p-2 space-y-1 font-sans text-xs min-w-[180px]">
            <div class="text-amber-400 font-bold flex items-center gap-1">⚡ Cloud-to-Ground Strike</div>
            <div class="text-[11px] text-white font-mono">${lgt.city}</div>
            <div class="text-[10px] font-mono text-slate-400">Peak Current: <strong class="text-rose-400">${lgt.peakKa} kA</strong> (${lgt.delayMs})</div>
          </div>
        `;
        marker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
        lightningLayerRef.current?.addLayer(marker);
      });
    }
  }, [showLightningGrid]);

  // Render Cyclone Cone & Landfall Vector
  useEffect(() => {
    if (!mapInstanceRef.current || !cycloneLayerRef.current) return;
    cycloneLayerRef.current.clearLayers();

    if (showCycloneCone) {
      // Cone Polygon
      const cone = L.polygon(CYCLONE_SYSTEM.coneCoords as any, {
        color: '#f43f5e',
        fillColor: '#f43f5e',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '4, 4'
      });
      cone.bindPopup(`
        <div class="p-2.5 font-sans space-y-1 text-xs">
          <div class="text-rose-400 font-bold">🌀 ${CYCLONE_SYSTEM.name} (${CYCLONE_SYSTEM.stage})</div>
          <div class="text-[10px] font-mono text-slate-300">Peak Sustained Wind: ${CYCLONE_SYSTEM.windSpeed}</div>
        </div>
      `, { className: 'custom-leaflet-popup' });
      cycloneLayerRef.current.addLayer(cone);

      // Track Line
      const trackCoords = CYCLONE_SYSTEM.trackPoints.map(p => [p.lat, p.lon]);
      const trackLine = L.polyline(trackCoords as any, {
        color: '#f43f5e',
        weight: 3
      });
      cycloneLayerRef.current.addLayer(trackLine);

      // Eye Marker with Rotating Animation
      const eyeHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full border-2 border-rose-400 border-t-transparent animate-spin"></div>
          <div class="absolute w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/80"></div>
        </div>
      `;
      const eyeIcon = L.divIcon({
        html: eyeHtml,
        className: 'custom-cyclone-eye',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      const eyeMarker = L.marker(CYCLONE_SYSTEM.eyeCoords as any, { icon: eyeIcon });
      eyeMarker.bindPopup(`
        <div class="p-2.5 font-sans space-y-1 text-xs">
          <div class="text-rose-400 font-black">🌀 LIVE CYCLONE EYE: ${CYCLONE_SYSTEM.name}</div>
          <div class="text-[10px] font-mono text-slate-200">Wind: ${CYCLONE_SYSTEM.windSpeed}</div>
          <div class="text-[10px] font-mono text-amber-300">Estimated Landfall: Odisha Coast in 24 hrs</div>
        </div>
      `, { className: 'custom-leaflet-popup' });
      cycloneLayerRef.current.addLayer(eyeMarker);
    }
  }, [showCycloneCone]);

  // Render DWR Doppler Radar Stations
  useEffect(() => {
    if (!mapInstanceRef.current || !radarEchoesLayerRef.current) return;
    radarEchoesLayerRef.current.clearLayers();

    if (showDwrRadarEchoes && dwrStations.length > 0) {
      dwrStations.forEach(st => {
        const radarColor = st.hydrometeor_classification.color || '#0284c7';
        
        // Animated Radar Beam Circle
        const radarRadius = st.range_km * 1000;
        const radarCircle = L.circle([st.latitude, st.longitude], {
          radius: radarRadius,
          color: radarColor,
          fillColor: radarColor,
          fillOpacity: radarTimeline === 'LIVE' ? 0.08 : 0.04,
          weight: 1.5,
          dashArray: '3, 6'
        });
        radarEchoesLayerRef.current?.addLayer(radarCircle);

        const dwrHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div style="background-color: ${radarColor};" class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] font-black border border-white/90 shadow-md">
              📡
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
          <div class="p-2.5 space-y-1.5 min-w-[200px] font-sans">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1">
              <span class="text-xs font-bold text-white uppercase">${st.station_name} DWR</span>
              <span style="color: ${radarColor};" class="text-[10px] font-mono font-bold">${st.peak_reflectivity_dbz} dBZ</span>
            </div>
            <p class="text-[11px] text-cyan-300 font-mono">${st.state} • ${st.range_km}km</p>
            <div class="text-[10px] font-mono text-slate-300 py-1 bg-slate-950 px-2 rounded border border-slate-800">
              <div>Rain Rate: <strong class="text-emerald-400">${st.estimated_rain_rate_mmh} mm/h</strong></div>
              <div>Echo: <strong style="color: ${radarColor};">${st.hydrometeor_classification.label}</strong></div>
              <div>Timeline Frame: <strong class="text-cyan-400">${radarTimeline}</strong></div>
            </div>
          </div>
        `;
        dwrMarker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
        radarEchoesLayerRef.current?.addLayer(dwrMarker);
      });
    }
  }, [dwrStations, showDwrRadarEchoes, radarTimeline]);

  // Render City-Grouped Clean News Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !newsLayerRef.current) return;
    newsLayerRef.current.clearLayers();

    if (showNewsPinpoints && reports.length > 0) {
      const newsReports = reports.filter(r => r.source_type === 'rss_news' && r.latitude && r.longitude);

      const cityNewsMap: Record<string, WeatherReport[]> = {};
      newsReports.forEach(r => {
        const cityKey = (r.city || r.state || 'India').toLowerCase();
        if (!cityNewsMap[cityKey]) cityNewsMap[cityKey] = [];
        cityNewsMap[cityKey].push(r);
      });

      Object.entries(cityNewsMap).forEach(([cityKey, cityReps]) => {
        const primaryRep = cityReps[0];
        const count = cityReps.length;
        
        const newsLat = primaryRep.latitude + 0.32;
        const newsLon = primaryRep.longitude + 0.32;

        const publisherClean = (primaryRep.source_name || 'News')
          .replace('The ', '')
          .replace(' News', '')
          .replace(' 24x7', '')
          .slice(0, 10);

        const countBadge = count > 1 ? ` (+${count - 1})` : '';

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
              ${primaryRep.credibility_score}/100 Rel
            </span>
          </div>
          <p class="text-xs text-slate-100 font-medium leading-snug line-clamp-3">${primaryRep.text}</p>
          <div class="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>By: ${primaryRep.source_name || 'Meteorological Desk'}</span>
            <span>${new Date(primaryRep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="pt-1">
            <a href="${streetViewUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/50 text-[10px] font-bold text-center flex items-center justify-center gap-1 transition-colors">
              <span>👁 Open Ground Street View</span>
            </a>
          </div>
        `;

        newsMarker.bindPopup(popupContent, { className: 'custom-leaflet-popup' });
        newsMarker.on('click', () => {
          if (onSelectReport) onSelectReport(primaryRep);
        });

        newsLayerRef.current?.addLayer(newsMarker);
      });
    }
  }, [reports, showNewsPinpoints, onSelectReport]);

  // Render Incident Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !zonesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    zonesLayerRef.current.clearLayers();

    const filteredEvents = selectedState === 'All'
      ? events
      : events.filter(e => e.state.toLowerCase() === selectedState.toLowerCase());

    filteredEvents.forEach(evt => {
      const isSelected = selectedEventId === evt.id;
      const isCritical = evt.severity === 'CRITICAL';
      const isHigh = evt.severity === 'HIGH';

      const color = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#06b6d4';
      const pulseColor = isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-cyan-400';

      if (showInundationZones) {
        const circle = L.circle([evt.latitude, evt.longitude], {
          radius: 15000,
          color: color,
          fillColor: color,
          fillOpacity: isSelected ? 0.28 : 0.14,
          weight: isSelected ? 2.5 : 1.2,
          dashArray: isSelected ? undefined : '4, 4',
        });
        zonesLayerRef.current?.addLayer(circle);
      }

      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <span class="absolute inline-flex h-10 w-10 rounded-full ${pulseColor} opacity-35 animate-ping"></span>
          <div style="background-color: ${color};" class="relative inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-xl shadow-black/80 text-white font-black text-[11px] transform transition-transform group-hover:scale-125">
            ${evt.total_reports}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-cluster-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([evt.latitude, evt.longitude], { icon: customIcon });
      const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${evt.latitude},${evt.longitude}`;

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 space-y-2 min-w-[240px] text-slate-200 font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5">
          <span class="text-xs font-black uppercase text-white">${evt.city || 'District'}, ${evt.state}</span>
          <span style="background-color: ${color};" class="text-[9px] font-bold font-mono px-2 py-0.5 rounded text-white shadow-sm">
            ${evt.severity}
          </span>
        </div>
        <div class="text-[11px] font-mono grid grid-cols-2 gap-1 py-1 bg-slate-950 p-2 rounded border border-slate-800">
          <div>Hazard: <strong class="text-white">${evt.event_type}</strong></div>
          <div>Reports: <strong class="text-amber-400">${evt.total_reports}</strong></div>
          <div>Confidence: <strong class="text-emerald-400">${evt.confidence_score}%</strong></div>
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

  // Tactical City Quick Jump Handler
  const handleQuickJump = (city: typeof QUICK_JUMP_CITIES[0]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lon], city.zoom, {
        duration: 1.5
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950 flex flex-col font-sans">
      {/* Tactical Quick-Jump City Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto z-10 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 shrink-0 font-mono">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>Tactical City Jump:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {QUICK_JUMP_CITIES.map((c, i) => (
            <button
              key={i}
              onClick={() => handleQuickJump(c)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-[11px] font-mono font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>📍 {c.name}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                {c.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Control Bar Overlay */}
      <div className="absolute top-14 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs shadow-2xl pointer-events-auto">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">National Weather Radar</span>
          <span className="text-[11px] text-cyan-400 font-mono font-semibold">({events.length} Clusters)</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto">
          {/* Map Layer Switcher */}
          <div className="flex items-center bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs shadow-2xl">
            <button
              onClick={() => setSelectedBaseMap('dark')}
              className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedBaseMap === 'dark' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cyber Dark
            </button>
            <button
              onClick={() => setSelectedBaseMap('satellite')}
              className={`px-2 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedBaseMap === 'satellite' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* NDRF Depots Toggle */}
          <button
            onClick={() => setShowNdrfDepots(!showNdrfDepots)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showNdrfDepots
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-md font-bold'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle NDRF Strategic Quick Response Battalions"
          >
            <span>🚁 NDRF Bases</span>
          </button>

          {/* River Flood Corridors Toggle */}
          <button
            onClick={() => setShowRiverCorridors(!showRiverCorridors)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showRiverCorridors
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 shadow-md font-bold'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle CWC River Basin Corridors"
          >
            <span>🌊 River Basins</span>
          </button>

          {/* Lightning Grid Toggle */}
          <button
            onClick={() => setShowLightningGrid(!showLightningGrid)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showLightningGrid
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/50 shadow-md font-bold'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle Cloud-to-Ground Lightning Sensor Network"
          >
            <span>⚡ Lightning</span>
          </button>

          {/* Cyclone Cone Toggle */}
          <button
            onClick={() => setShowCycloneCone(!showCycloneCone)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showCycloneCone
                ? 'bg-rose-600/30 text-rose-300 border-rose-500/50 shadow-md font-bold'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle Active Cyclone Forecast Cones"
          >
            <span>🌀 Cyclone</span>
          </button>

          {/* DWR Doppler Radar Toggle */}
          <button
            onClick={() => setShowDwrRadarEchoes(!showDwrRadarEchoes)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              showDwrRadarEchoes
                ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/50 shadow-md font-bold'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
            title="Toggle IMD Doppler Radar (DWR) station network"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">DWR Radar</span>
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
      <div ref={mapContainerRef} className="w-full flex-1" style={{ minHeight: '500px' }} />

      {/* Radar Playback & Timeline Scrubber Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-2 sm:gap-3 max-w-[calc(100%-24px)] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setIsRadarPlaying(!isRadarPlaying)}
          className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer shrink-0"
          title={isRadarPlaying ? 'Pause Radar Sweep' : 'Play Live Radar Sweep'}
        >
          {isRadarPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-xs shrink-0">
          {(['T-1h', 'LIVE', '+1h', '+3h'] as const).map(frame => (
            <button
              key={frame}
              onClick={() => setRadarTimeline(frame)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                radarTimeline === frame
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800'
              }`}
            >
              {frame === 'LIVE' ? '🔴 LIVE' : frame}
            </button>
          ))}
        </div>
      </div>

      {/* DWR Radar Reflectivity dBZ Scale Legend (Cleanly stacked above playback on mobile) */}
      <div className="absolute bottom-16 sm:bottom-3 right-3 z-[400] bg-slate-900/95 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[9px] space-y-1 shadow-2xl">
        <span className="font-bold text-slate-300 block uppercase tracking-wider text-[8px]">DWR Radar (dBZ)</span>
        <div className="flex items-center gap-1 font-mono">
          <span className="px-1 py-0.2 rounded bg-emerald-700 text-white font-bold text-[8px] sm:text-[9px]">15-25</span>
          <span className="px-1 py-0.2 rounded bg-cyan-700 text-white font-bold text-[8px] sm:text-[9px]">25-35</span>
          <span className="px-1 py-0.2 rounded bg-amber-600 text-white font-bold text-[8px] sm:text-[9px]">35-45</span>
          <span className="px-1 py-0.2 rounded bg-rose-600 text-white font-bold text-[8px] sm:text-[9px]">45-55</span>
          <span className="px-1 py-0.2 rounded bg-purple-700 text-white font-bold text-[8px] sm:text-[9px]">55+</span>
        </div>
      </div>

      {/* Tactical Layers Legend Badge */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/95 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[9px] space-y-1 shadow-2xl hidden lg:block">
        <span className="font-bold text-slate-300 block uppercase tracking-wider text-[8px]">Tactical Layers</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-slate-300">Critical</span></div>
          <div className="flex items-center gap-1"><span>🚁</span><span className="text-slate-300">NDRF</span></div>
          <div className="flex items-center gap-1"><span>🌊</span><span className="text-slate-300">CWC River</span></div>
          <div className="flex items-center gap-1"><span>⚡</span><span className="text-slate-300">Lightning</span></div>
          <div className="flex items-center gap-1"><span>🌀</span><span className="text-slate-300">Cyclone</span></div>
        </div>
      </div>
    </div>
  );
};
