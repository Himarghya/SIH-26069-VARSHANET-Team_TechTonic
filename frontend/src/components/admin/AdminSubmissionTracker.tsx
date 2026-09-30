import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Camera,
  ShieldCheck,
  ShieldAlert,
  Send,
  RefreshCw,
  Eye,
  Check,
  X,
  ExternalLink,
  Copy,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  PhoneCall,
  Radio,
  FileText
} from 'lucide-react';
import { WeatherReport, ALL_INDIAN_STATES_UTS } from '../../types';
import { getCitizenSubmissions, trackCitizenReport, updateCitizenSubmissionStatus } from '../../services/api';

interface AdminSubmissionTrackerProps {
  onSelectReport?: (report: WeatherReport) => void;
  onNavigateToMap?: () => void;
}

export const AdminSubmissionTracker: React.FC<AdminSubmissionTrackerProps> = ({
  onSelectReport,
  onNavigateToMap
}) => {
  const [submissions, setSubmissions] = useState<WeatherReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [activeReport, setActiveReport] = useState<WeatherReport | null>(null);
  
  // Quick Search by Ticket Code
  const [lookupTicketInput, setLookupTicketInput] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Status Action state
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Image lightbox preview
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  // Load submissions from backend
  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const reports = await getCitizenSubmissions({
        search: searchQuery || undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        event_type: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        state: selectedState !== 'ALL' ? selectedState : undefined,
        limit: 100
      });
      setSubmissions(reports);
      if (reports.length > 0 && !activeReport) {
        setActiveReport(reports[0]);
      } else if (activeReport) {
        // Refresh active report reference if it exists in latest list
        const updatedActive = reports.find(r => r.id === activeReport.id || r.source_id === activeReport.source_id);
        if (updatedActive) setActiveReport(updatedActive);
      }
    } catch (err) {
      console.warn('Failed to load citizen submissions from API, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [selectedStatus, selectedCategory, selectedState]);

  // Handle direct single ticket lookup
  const handleLookupTicket = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lookupTicketInput.trim()) return;

    setIsLookingUp(true);
    setLookupError('');
    try {
      const report = await trackCitizenReport(lookupTicketInput.trim());
      if (report) {
        setActiveReport(report);
        // If not already in list, prepend it
        setSubmissions(prev => {
          if (!prev.some(r => r.id === report.id || r.source_id === report.source_id)) {
            return [report, ...prev];
          }
          return prev;
        });
        setLookupError('');
      }
    } catch (err: any) {
      setLookupError(`No submission found for ticket code "${lookupTicketInput}".`);
    } finally {
      setIsLookingUp(false);
    }
  };

  // Update submission verification status
  const handleStatusUpdate = async (newStatus: string) => {
    if (!activeReport) return;
    setIsUpdatingStatus(true);
    setActionSuccess(null);

    try {
      const updated = await updateCitizenSubmissionStatus(
        activeReport.id || activeReport.source_id || '',
        newStatus,
        adminNotes.trim() || undefined
      );

      setActiveReport(updated);
      setSubmissions(prev => prev.map(r => (r.id === updated.id || r.source_id === updated.source_id ? updated : r)));
      setActionSuccess(`Status successfully updated to "${newStatus}"!`);
      setAdminNotes('');
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update submission status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const copyTicketCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    const q = searchQuery.toLowerCase();
    return submissions.filter(s =>
      s.source_id?.toLowerCase().includes(q) ||
      s.id?.toLowerCase().includes(q) ||
      s.text?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.state?.toLowerCase().includes(q) ||
      s.event_type?.toLowerCase().includes(q) ||
      s.author?.toLowerCase().includes(q)
    );
  }, [submissions, searchQuery]);

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner & Quick Direct Tracker Lookup Bar */}
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-xs">
                <Search className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Citizen Submission Tracking &amp; Verification Console
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lookup live ticket dossiers, inspect uploaded ground evidence, audit VisionGuard ML forensics, and update operational dispatch status.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSubmissions}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-500' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
          </div>
        </div>

        {/* Direct VR Ticket Fast-Search Bar */}
        <form onSubmit={handleLookupTicket} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="relative flex-1">
            <input
              type="text"
              value={lookupTicketInput}
              onChange={(e) => setLookupTicketInput(e.target.value)}
              placeholder="Search or Paste Exact Ticket Code (e.g. VR-2026-XXXXXX or Report ID)..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 dark:text-white uppercase placeholder-slate-400 font-mono focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <button
            type="submit"
            disabled={isLookingUp || !lookupTicketInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            {isLookingUp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Track Dossier</span>
          </button>
        </form>

        {lookupError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-mono flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{lookupError}</span>
          </div>
        )}
      </div>

      {/* Main 2-Panel Layout: Ledger on Left, Detailed Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column (5 Cols): Searchable Filterable Submissions Queue */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Submissions Feed ({filteredSubmissions.length})
              </span>
            </div>
          </div>

          {/* Quick Filter Controls */}
          <div className="space-y-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword, city, or district..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="LIKELY_MISLEADING">Flagged / Misleading</option>
                <option value="DISPATCHED_TO_NDRF">Dispatched to NDRF</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer truncate"
              >
                <option value="ALL">All Hazards</option>
                <option value="Urban Flooding">Urban Flooding</option>
                <option value="Heavy Rainfall">Heavy Rainfall</option>
                <option value="Flash Flood">Flash Flood</option>
                <option value="Landslide">Landslide</option>
                <option value="Thunderstorm">Thunderstorm</option>
                <option value="Cloudburst">Cloudburst</option>
                <option value="Hailstorm">Hailstorm</option>
              </select>
            </div>
          </div>

          {/* Submissions Cards List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-500" />
                <span>Fetching submissions...</span>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <span>No citizen submissions matched your filter.</span>
              </div>
            ) : (
              filteredSubmissions.map((report) => {
                const isSelected = activeReport?.id === report.id || (activeReport?.source_id && activeReport.source_id === report.source_id);
                const hasPhotos = report.media_urls && report.media_urls.length > 0;

                return (
                  <div
                    key={report.id || report.source_id}
                    onClick={() => setActiveReport(report)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs select-none relative ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/60 shadow-sm dark:bg-cyan-950/40'
                        : 'bg-white dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {report.source_id || report.id}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {report.event_type}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold whitespace-nowrap border ${
                        report.verification_status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : report.verification_status === 'LIKELY_MISLEADING' || report.verification_status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                          : report.verification_status === 'DISPATCHED_TO_NDRF'
                          ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                          : report.verification_status === 'RESOLVED'
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      }`}>
                        {report.verification_status || 'UNDER_REVIEW'}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                      {report.text}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span className="truncate">{report.city || 'District'}, {report.state}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {hasPhotos && (
                          <span className="flex items-center gap-0.5 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-200/60 dark:border-cyan-800/50">
                            <Camera className="w-3 h-3" />
                            {report.media_urls.length}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-slate-400">
                          {report.timestamp ? new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Comprehensive Tracking & Operator Action Dossier */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          {activeReport ? (
            <div className="space-y-5">
              
              {/* Dossier Header with Ticket Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block font-bold">
                    Official Incident Verification Ticket
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="text-xl font-black font-mono tracking-tight text-white">
                      {activeReport.source_id || activeReport.id}
                    </h3>
                    <button
                      onClick={() => copyTicketCode(activeReport.source_id || activeReport.id)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy Ticket ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">Logged Timestamp</span>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {activeReport.timestamp ? new Date(activeReport.timestamp).toLocaleString() : 'Recent Submission'}
                  </span>
                </div>
              </div>

              {/* Success Notification Alert */}
              {actionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2 animate-fade-in shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Core Information Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hazard Category</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{activeReport.event_type}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Location</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">
                    {activeReport.city || 'District'}, {activeReport.state}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">AI Trust Score</span>
                  <span className="font-black text-cyan-700 dark:text-cyan-400 font-mono text-sm">
                    {activeReport.credibility_score ? `${activeReport.credibility_score.toFixed(1)}%` : '88.5%'}
                  </span>
                </div>
              </div>

              {/* Submitted Citizen Text Observation */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Citizen Observation Statement
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Author: <strong className="text-slate-700 dark:text-slate-300">{activeReport.author || 'Citizen Reporter'}</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {activeReport.text}
                </p>
                {activeReport.normalized_text && activeReport.normalized_text !== activeReport.text && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <strong className="text-slate-700 dark:text-slate-300">Operator Audit Notes:</strong> {activeReport.normalized_text}
                  </div>
                )}
              </div>

              {/* Uploaded Evidence Gallery (Photos / Videos) */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Attached Media Proof ({activeReport.media_urls?.length || 0})
                  </span>
                </div>

                {activeReport.media_urls && activeReport.media_urls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {activeReport.media_urls.map((url, idx) => {
                      const isVid = url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video');
                      return (
                        <div
                          key={idx}
                          onClick={() => setPreviewMedia(url)}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-black flex items-center justify-center cursor-pointer shadow-xs"
                        >
                          {isVid ? (
                            <video src={url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-5 h-5" />
                          </div>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] font-mono text-cyan-300 px-1.5 py-0.5 rounded">
                            {isVid ? 'Video' : `Photo ${idx + 1}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No media attachments were uploaded with this submission.</p>
                )}
              </div>

              {/* Operator Action Console */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Operational Action &amp; Status Dispatch
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Current: <strong className="text-cyan-700 dark:text-cyan-300">{activeReport.verification_status || 'UNDER_REVIEW'}</strong>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Operator Dispatch Notes (Optional):
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Dispatched Unit 3 to MG Road, pump deployed; verified with IMD radar..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Status Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    onClick={() => handleStatusUpdate('VERIFIED')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>

                  <button
                    onClick={() => handleStatusUpdate('DISPATCHED_TO_NDRF')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Dispatch NDRF</span>
                  </button>

                  <button
                    onClick={() => handleStatusUpdate('LIKELY_MISLEADING')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Flag / Reject</span>
                  </button>

                  <button
                    onClick={() => handleStatusUpdate('RESOLVED')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs">Select a submission from the list or enter a Ticket ID above to view the full dossier.</p>
            </div>
          )}
        </div>

      </div>

      {/* Media Lightbox Modal */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[85vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {previewMedia.startsWith('data:video') || previewMedia.endsWith('.mp4') || previewMedia.includes('video') ? (
              <video src={previewMedia} controls autoPlay className="max-w-full max-h-[80vh] object-contain" />
            ) : (
              <img src={previewMedia} alt="Full Evidence Preview" className="max-w-full max-h-[80vh] object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
