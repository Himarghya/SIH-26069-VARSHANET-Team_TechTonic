import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Eye, ShieldCheck, AlertTriangle, MapPin, Hash } from 'lucide-react';
import { WeatherReport } from '../../types';

interface ReportTableProps {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({ reports, onSelectReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSource, setFilterSource] = useState('All');

  const filtered = reports.filter(r => {
    const matchesSearch = searchTerm === '' || 
      r.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.city && r.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.state.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesEvent = filterEvent === 'All' || r.event_type === filterEvent;
    const matchesStatus = filterStatus === 'All' || r.verification_status === filterStatus;
    const matchesSource = filterSource === 'All' || r.source_type === filterSource;

    return matchesSearch && matchesEvent && matchesStatus && matchesSource;
  });

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 space-y-4">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords, city, state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Event Types</option>
          <option value="Heavy Rainfall">Heavy Rainfall</option>
          <option value="Urban Flooding">Urban Flooding</option>
          <option value="Flash Flood">Flash Flood</option>
          <option value="Thunderstorm">Thunderstorm</option>
          <option value="Cyclone">Cyclone</option>
          <option value="Heatwave">Heatwave</option>
          <option value="Cloudburst">Cloudburst</option>
          <option value="Landslide">Landslide</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Verification States</option>
          <option value="VERIFIED">Verified</option>
          <option value="LIKELY_AUTHENTIC">Likely Authentic</option>
          <option value="REQUIRES_REVIEW">Requires Review</option>
          <option value="LIKELY_MISLEADING">Likely Misleading</option>
          <option value="UNVERIFIED">Unverified</option>
        </select>

        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Source Channels</option>
          <option value="citizen_report">Citizen Submissions</option>
          <option value="weather_api">Weather APIs</option>
          <option value="rss_news">RSS / News Media</option>
          <option value="social_media">Social Feed (#IMD)</option>
          <option value="government_open_data">Govt Open Data</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Event & Location</th>
              <th className="py-3 px-4">Observation Content</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">AI Credibility</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filtered.map((rep) => (
              <tr key={rep.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{rep.event_type}</div>
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3" /> {rep.city || 'District'}, {rep.state}
                  </div>
                </td>
                <td className="py-3 px-4 max-w-xs truncate text-slate-300">
                  {rep.text}
                </td>
                <td className="py-3 px-4 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    {rep.source_name || rep.source_type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <span className={`text-xs ${
                      rep.credibility_score >= 80 ? 'text-emerald-400' :
                      rep.credibility_score >= 60 ? 'text-cyan-400' :
                      'text-rose-400'
                    }`}>
                      {rep.credibility_score}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    rep.verification_status === 'VERIFIED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50' :
                    rep.verification_status === 'LIKELY_MISLEADING' ? 'bg-rose-950/80 text-rose-300 border border-rose-700/50' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {rep.verification_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onSelectReport(rep)}
                    className="p-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};