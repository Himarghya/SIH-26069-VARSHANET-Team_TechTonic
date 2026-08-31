import React, { useState } from 'react';
import { CloudRain, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, Shield, Eye } from 'lucide-react';
import { submitCitizenReport, trackCitizenReport, api } from '../../services/api';
import { WeatherReport } from '../../types';
import { StreetViewPin } from '../incident/StreetViewPin';

export const CitizenReportForm: React.FC = () => {
  const [eventType, setEventType] = useState('Urban Flooding');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Madhya Pradesh');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [contact, setContact] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<WeatherReport | null>(null);
  const [geminiAdvice, setGeminiAdvice] = useState<any>(null);

  // Tracking state
  const [trackingId, setTrackingId] = useState('');
  const [trackedReport, setTrackedReport] = useState<WeatherReport | null>(null);
  const [trackError, setTrackError] = useState('');

  const handleAutoGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setIsLocating(false);
        },
        () => {
          setLatitude(23.2599);
          setLongitude(77.4126);
          setIsLocating(false);
        }
      );
    } else {
      setLatitude(23.2599);
      setLongitude(77.4126);
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    setIsSubmitting(true);
    setGeminiAdvice(null);
    try {
      const repCity = city || 'Bhopal';
      const repLat = latitude || 23.2599;
      const repLon = longitude || 77.4126;

      const [res, aiRes] = await Promise.all([
        submitCitizenReport({
          event_type: eventType,
          description,
          city: repCity,
          state,
          latitude: repLat,
          longitude: repLon,
          author_contact: contact || 'citizen_reporter'
        }),
        api.post('/analytics/test-ai', {
          text: description,
          city: repCity,
          state: state,
          source_type: 'citizen_report'
        })
      ]);

      setSubmittedReport(res);
      setGeminiAdvice(aiRes.data);
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async () => {
    if (!trackingId) return;
    setTrackError('');
    try {
      const res = await trackCitizenReport(trackingId.trim());
      setTrackedReport(res);
    } catch (err) {
      setTrackError('Ticket ID not found. Please verify your VR tracking code.');
      setTrackedReport(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Submission Form */}
      <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Citizen Weather Intelligence & AI Response Submission</h2>
            <p className="text-xs text-slate-400">
              Submit ground observations, flood hotspots, or severe storms. Google Gemini AI will immediately evaluate the situation and provide life-safety guidance.
            </p>
          </div>
        </div>

        {submittedReport ? (
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Report Ingested into National Grid</h3>
            </div>
            
            <p className="text-xs text-emerald-300 font-mono">
              Tracking Ticket ID: <strong className="text-white text-sm underline">{submittedReport.source_id}</strong>
            </p>

            {/* Google Gemini Immediate Action Recommendation */}
            {geminiAdvice && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/50 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    Google Gemini Live Safety Guidance
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    geminiAdvice.gemini_llm_stage?.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {geminiAdvice.gemini_llm_stage?.severity || 'HIGH'} PRIORITY
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  <strong>AI Assessment:</strong> "{geminiAdvice.gemini_llm_stage?.reasoning || 'Incident evaluated by Google Gemini model.'}"
                </p>

                {/* Ground Pinpoint */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-sans">Ground Pinpoint:</span>
                  <StreetViewPin latitude={submittedReport.latitude} longitude={submittedReport.longitude} size="sm" />
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left font-mono text-xs space-y-1 text-slate-300">
              <div>Event: <strong className="text-white">{submittedReport.event_type}</strong></div>
              <div>Location: <strong className="text-cyan-300">{submittedReport.city}, {submittedReport.state}</strong></div>
              <div>AI Initial Trust: <strong className="text-emerald-400">{submittedReport.credibility_score}%</strong></div>
              <div>Assigned Cluster: <strong className="text-cyan-400">{submittedReport.event_cluster_id || 'Active'}</strong></div>
            </div>

            <button
              onClick={() => {
                setSubmittedReport(null);
                setGeminiAdvice(null);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Submit Another Observation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Event Category</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Urban Flooding">Urban Flooding (Waterlogging)</option>
                  <option value="Heavy Rainfall">Heavy Rainfall</option>
                  <option value="Flash Flood">Flash Flood</option>
                  <option value="Thunderstorm">Thunderstorm & Lightning</option>
                  <option value="Hailstorm">Hailstorm</option>
                  <option value="Cloudburst">Cloudburst</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Heatwave">Heatwave</option>
                  <option value="Fog">Dense Fog</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">State / UT</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">City / District / Landmark</label>
              <input
                type="text"
                placeholder="e.g. MP Nagar Zone-2 Bhopal, Dadar Hindmata Mumbai..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Observation Details (English, Hindi, or Hinglish)</label>
              <textarea
                rows={3}
                required
                placeholder="Describe road water depth, traffic halts, river overflowing, power outage..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* GPS & Location Assistant */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>
                  {latitude ? `${latitude.toFixed(4)}° N, ${longitude?.toFixed(4)}° E` : 'GPS not captured yet'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoGPS}
                disabled={isLocating}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                {isLocating ? 'Detecting...' : 'Auto-Locate GPS'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Analyzing with Google Gemini & Transmitting...' : 'Submit & Receive Instant AI Guidance'}
            </button>
          </form>
        )}
      </div>

      {/* Tracking Portal */}
      <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Track Citizen Submission</h3>
          <p className="text-xs text-slate-400 mb-4">
            Enter your VR report code to view real-time AI credibility analysis, clustering state, and meteorological verification status.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. VR-2026-AB12CD"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleTrack}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Track
            </button>
          </div>

          {trackError && (
            <p className="text-xs text-rose-400 mt-2 font-mono">{trackError}</p>
          )}

          {trackedReport && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-white font-bold">{trackedReport.event_type}</span>
                <span className="text-cyan-400">{trackedReport.verification_status}</span>
              </div>
              <p className="text-slate-300 font-sans text-xs py-1">{trackedReport.text}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div>Credibility: <strong className="text-emerald-400">{trackedReport.credibility_score}%</strong></div>
                <div>Risk: <strong className="text-cyan-300">{trackedReport.risk_level}</strong></div>
                <div>Cluster: <strong className="text-slate-200">{trackedReport.event_cluster_id || 'Queued'}</strong></div>
                <div>Duplicates: <strong className="text-amber-400">{trackedReport.duplicate_count}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Public Service Notice */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-cyan-200 space-y-1">
          <strong className="block font-bold">National Safety Directive:</strong>
          <p className="text-[11px] leading-relaxed text-cyan-300/80">
            For active life-threatening emergencies, call State Disaster Management Authority (SDMA: 1070) or National Emergency Number 112 immediately.
          </p>
        </div>
      </div>
    </div>
  );
};