import React, { useState } from 'react';
import { ShieldAlert, Send, MapPin, Camera, Upload, Trash2, ArrowDownCircle, CheckCircle2, AlertTriangle, Radio, Sparkles, Navigation, Globe } from 'lucide-react';
import { publishAdminVerifiedReport } from '../../services/api';
import { WeatherReport } from '../../types';

// Preset prominent city coordinates for instantaneous auto-fill
const PRESET_CITY_COORDS: Record<string, { lat: number; lon: number; state: string }> = {
  'Bhopal': { lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh' },
  'Mumbai': { lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
  'Guwahati': { lat: 26.1445, lon: 91.7362, state: 'Assam' },
  'Delhi': { lat: 28.6139, lon: 77.2090, state: 'Delhi' },
  'Bengaluru': { lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
  'Kolkata': { lat: 22.5726, lon: 88.3639, state: 'West Bengal' },
  'Chennai': { lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
  'Dehradun': { lat: 30.3165, lon: 78.0322, state: 'Uttarakhand' },
  'Shimla': { lat: 31.1048, lon: 77.1734, state: 'Himachal Pradesh' },
  'Patna': { lat: 25.5941, lon: 85.1376, state: 'Bihar' },
  'Lucknow': { lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh' },
  'Jaipur': { lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  'Bhubaneswar': { lat: 20.2961, lon: 85.8245, state: 'Odisha' },
  'Kochi': { lat: 9.9312, lon: 76.2673, state: 'Kerala' },
  'Srinagar': { lat: 34.0837, lon: 74.7973, state: 'Jammu and Kashmir' },
};

const SAMPLE_OFFICIAL_PHOTOS = [
  { name: 'Arterial Inundation', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80' },
  { name: 'Underpass Submersion', url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80' },
  { name: 'Storm Front & Radar', url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80' }
];

interface AdminIncidentPostFormProps {
  onReportPublished?: () => void;
  onNavigateToMap?: () => void;
}

export const AdminIncidentPostForm: React.FC<AdminIncidentPostFormProps> = ({
  onReportPublished,
  onNavigateToMap
}) => {
  const [eventType, setEventType] = useState('Urban Flooding');
  const [severity, setSeverity] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [city, setCity] = useState('Bhopal');
  const [state, setState] = useState('Madhya Pradesh');
  const [latitude, setLatitude] = useState<number>(23.2599);
  const [longitude, setLongitude] = useState<number>(77.4126);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('National Emergency Operations Command');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedReport, setPublishedReport] = useState<WeatherReport | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto update coordinates when city selection changes
  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    if (PRESET_CITY_COORDS[cityName]) {
      setLatitude(PRESET_CITY_COORDS[cityName].lat);
      setLongitude(PRESET_CITY_COORDS[cityName].lon);
      setState(PRESET_CITY_COORDS[cityName].state);
    }
  };

  const handleAutoGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(4)));
          setLongitude(Number(pos.coords.longitude.toFixed(4)));
        },
        () => {
          setLatitude(23.2599);
          setLongitude(77.4126);
        }
      );
    }
  };

  const processFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const remainingSlots = 3 - photos.length;
    if (remainingSlots <= 0) return;

    Array.from(files).slice(0, remainingSlots).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setPhotos(prev => [...prev, loadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    setIsSubmitting(true);
    try {
      const res = await publishAdminVerifiedReport({
        title: title || `${eventType} Advisory - ${city}`,
        event_type: eventType,
        description,
        city,
        state,
        severity,
        latitude,
        longitude,
        media_urls: photos,
        author
      });

      setPublishedReport(res);
      setDescription('');
      setTitle('');
      if (onReportPublished) onReportPublished();
    } catch (err) {
      console.error('Failed to publish verified report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/40">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Official Incident Dispatch & Pre-Verified Post</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-mono font-bold">
                100% PRE-VERIFIED (ZERO QUEUE MODERATION)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Publishes official ground intelligence or warnings directly onto the National Weather Map & Incident Grid with immediate cluster placement.
            </p>
          </div>
        </div>

        {onNavigateToMap && (
          <button
            onClick={onNavigateToMap}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Globe className="w-4 h-4" />
            <span>View Live Map</span>
          </button>
        )}
      </div>

      {publishedReport ? (
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/40 text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            <h3 className="text-base font-bold text-white">Official Incident Published & Mapped to National Grid</h3>
          </div>

          <p className="text-xs text-emerald-300 font-mono">
            Direct Dispatch Code: <strong className="text-white text-sm underline">{publishedReport.source_id}</strong>
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs font-mono text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>Hazard: <strong className="text-white font-sans">{publishedReport.event_type}</strong></div>
              <div>Severity Level: <strong className="text-rose-400">{publishedReport.risk_level}</strong></div>
              <div>Map Location: <strong className="text-cyan-300 font-sans">{publishedReport.city}, {publishedReport.state}</strong></div>
              <div>Coordinates: <strong className="text-slate-200">{publishedReport.latitude}° N, {publishedReport.longitude}° E</strong></div>
              <div>Verification Status: <strong className="text-emerald-400">100% PRE-VERIFIED (OFFICIAL)</strong></div>
              <div>Authority: <strong className="text-white font-sans">{publishedReport.author}</strong></div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-slate-400 font-sans">
              "{publishedReport.text}"
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setPublishedReport(null);
                setPhotos([]);
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Post Another Verified Incident
            </button>

            {onNavigateToMap && (
              <button
                onClick={onNavigateToMap}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                <span>Jump to Incident on Map</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Event Type, Severity, Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Hazard Event Category</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="Urban Flooding">Urban Flooding (Waterlogging)</option>
                <option value="Cloudburst">Cloudburst & Flash Deluge</option>
                <option value="Heavy Rainfall">Heavy Rainfall</option>
                <option value="Severe Cyclone Alert">Severe Cyclone Alert</option>
                <option value="Flash Flood">Flash Flood</option>
                <option value="Thunderstorm">Thunderstorm & Lightning</option>
                <option value="Heatwave">Severe Heatwave</option>
                <option value="Landslide">Landslide & Highway Block</option>
                <option value="Dense Fog">Dense Fog (Visibility &lt; 50m)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Threat Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-bold"
              >
                <option value="CRITICAL" className="text-rose-400">🔴 CRITICAL (Red Alert)</option>
                <option value="HIGH" className="text-amber-400">🟠 HIGH (Orange Warning)</option>
                <option value="MODERATE" className="text-yellow-400">🟡 MODERATE (Yellow Advisory)</option>
                <option value="LOW" className="text-cyan-400">🔵 LOW (Green Monitoring)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Publishing Authority</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Row 2: Location Presets & Coordinates (Auto-Implemented in Map) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono uppercase">
                <MapPin className="w-4 h-4" />
                <span>Geographic Location & Map Placement Coordinates</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                Auto-Pins Incident on National Weather Map
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Select Preset Landmark / City</label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-semibold"
                >
                  {Object.keys(PRESET_CITY_COORDS).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">State / UT</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Longitude (°E)</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAutoGPS}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                    title="Auto-Locate GPS"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Title & Operational Description */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Official Advisory Headline</label>
              <input
                type="text"
                placeholder="e.g. Red Alert: Inundation & Severe Waterlogging along MP Nagar Zone 2 Corridor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Official Incident Briefing & Public Directives</label>
              <textarea
                rows={3}
                required
                placeholder="Detail current inundation depth, emergency shelter locations, power status, road diversions, and SDMA operational response..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Row 4: Official Photo Evidence & Drag and Drop */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5 font-mono uppercase">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Attach 2-3 Verified Field Photographs</span>
              </label>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                {photos.length} / 3 Photos Attached
              </span>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photoUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-emerald-500/50 bg-slate-900 aspect-video shadow-md">
                    <img src={photoUrl} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-rose-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-emerald-300">
                      Verified Photo #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Drag & Drop Zone */}
            {photos.length < 3 && (
              <div className="space-y-2">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                    isDragging ? 'border-cyan-400 bg-cyan-950/60' : 'border-slate-700 bg-slate-900/60 hover:bg-slate-900/90'
                  }`}
                >
                  <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                    <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-300">
                      Drag & Drop official photos here, or <span className="text-cyan-400 underline">browse files</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset sample proofs */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">Quick Pick:</span>
                  {SAMPLE_OFFICIAL_PHOTOS.map((sample, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setPhotos(prev => prev.length < 3 ? [...prev, sample.url] : prev)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                      + {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600 hover:from-rose-500 hover:to-emerald-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono uppercase"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Publishing & Mapping to National Grid...' : '⚡ Publish Pre-Verified Incident & Pin on Map'}
          </button>
        </form>
      )}
    </div>
  );
};