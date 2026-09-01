import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Eye, ShieldCheck, AlertTriangle, MapPin, Hash, Calendar, Image as ImageIcon, Video, Tag, Globe, Newspaper, Radio, UserCheck } from 'lucide-react';
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
  const [filterDate, setFilterDate] = useState<'ALL' | 'TODAY' | '24H' | '7D'>('ALL');
  const [selectedHashtag, setSelectedHashtag] = useState('All');

  // Collect all unique hashtags dynamically + standard trending tags
  const dynamicHashtags = Array.from(
    new Set([
      '#IMD', '#Monsoon2026', '#MumbaiRains', '#DelhiWeather', '#Cloudburst', '#FloodAlert', '#HeatwaveWarning', '#CycloneAlert',
      ...reports.flatMap(r => r.hashtags || [])
    ])
  ).slice(0, 10);

  const filtered = reports.filter(r => {
    // 1. Search Query
    const matchesSearch = searchTerm === '' || 
      r.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.city && r.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.source_name && r.source_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // 2. Event Type Filter
    const matchesEvent = filterEvent === 'All' || r.event_type.toLowerCase().includes(filterEvent.toLowerCase());
    
    // 3. Verification Status Filter
    const matchesStatus = filterStatus === 'All' || r.verification_status === filterStatus;
    
    // 4. Source Channel Filter
    const matchesSource = filterSource === 'All' || r.source_type === filterSource;

    // 5. Hashtag Filter
    const matchesHashtag = selectedHashtag === 'All' || 
      (r.hashtags && r.hashtags.some(h => h.toLowerCase() === selectedHashtag.toLowerCase())) ||
      r.text.toLowerCase().includes(selectedHashtag.toLowerCase());

    // 6. Date-wise Filter
    let matchesDate = true;
    if (filterDate !== 'ALL') {
      const repDate = new Date(r.timestamp).getTime();
      const now = new Date().getTime();
      if (filterDate === 'TODAY') {
        const todayStart = new Date().setHours(0, 0, 0, 0);
        matchesDate = repDate >= todayStart;
      } else if (filterDate === '24H') {
        matchesDate = now - repDate <= 24 * 3600 * 1000;
      } else if (filterDate === '7D') {
        matchesDate = now - repDate <= 7 * 24 * 3600 * 1000;
      }
    }

    return matchesSearch && matchesEvent && matchesStatus && matchesSource && matchesHashtag && matchesDate;
  });

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'rss_news': return <Newspaper className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      case 'weather_api': return <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'citizen_report': return <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      default: return <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
      {/* Dynamic AI Weather Hashtags Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 shrink-0">
          <Tag className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Trending Hashtags:</span>
        </div>
        <button
          onClick={() => setSelectedHashtag('All')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 transition-all cursor-pointer border ${
            selectedHashtag === 'All'
              ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          #All
        </button>
        {dynamicHashtags.map((tag) => {
          const isSelected = selectedHashtag.toLowerCase() === tag.toLowerCase();
          return (
            <button
              key={tag}
              onClick={() => setSelectedHashtag(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Main Filter Controls: Date-Wise, Event-Wise, Location-Wise & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search news, publisher, city, state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        {/* Date-wise Filter */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1.5 shrink-0" />
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value as any)}
            className="bg-transparent text-xs text-cyan-300 font-semibold focus:outline-none cursor-pointer w-full"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Dates</option>
            <option value="TODAY" className="bg-slate-900 text-white">Today</option>
            <option value="24H" className="bg-slate-900 text-white">Past 24 Hours</option>
            <option value="7D" className="bg-slate-900 text-white">Past 7 Days</option>
          </select>
        </div>

        {/* Event-wise Filter */}
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Event Types</option>
          <option value="Rainfall">Rainfall / Heavy Rain</option>
          <option value="Thunderstorm">Thunderstorms</option>
          <option value="Flood">Flooding / Waterlogging</option>
          <option value="Heatwave">Heatwaves</option>
          <option value="Fog">Dense Fog</option>
          <option value="Dust">Dust Storms</option>
          <option value="Wind">Strong Winds / Squalls</option>
          <option value="Cloudburst">Cloudbursts</option>
          <option value="Cyclone">Cyclones</option>
        </select>

        {/* Verification Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Verification States</option>
          <option value="VERIFIED">Verified Official</option>
          <option value="LIKELY_AUTHENTIC">Likely Authentic</option>
          <option value="REQUIRES_REVIEW">Requires Review</option>
          <option value="LIKELY_MISLEADING">Likely Misleading</option>
          <option value="UNVERIFIED">Unverified</option>
        </select>

        {/* Source Channel Filter */}
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="All">All Sources</option>
          <option value="rss_news">News Media / Portals</option>
          <option value="weather_api">IMD / Synoptic AWS</option>
          <option value="citizen_report">Citizen Submissions</option>
          <option value="social_media">Social Media (#IMD)</option>
          <option value="government_open_data">Govt Open Data</option>
        </select>
      </div>

      {/* Filter Info Badge */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Showing <strong className="text-white">{filtered.length}</strong> real-time observations across India</span>
        {selectedHashtag !== 'All' && (
          <span className="text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Active Hashtag: {selectedHashtag}
          </span>
        )}
      </div>

      {/* Observation Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Event & Location</th>
              <th className="py-3 px-4">Observation & AI Hashtags</th>
              <th className="py-3 px-4">Source & Website</th>
              <th className="py-3 px-4">AI Trust</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filtered.map((rep) => (
              <tr key={rep.id} className="hover:bg-slate-800/40 transition-colors">
                {/* Event & Location */}
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{rep.event_type}</div>
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3" /> {rep.city || 'District'}, {rep.state}
                  </div>
                </td>

                {/* Text & AI Generated Hashtags */}
                <td className="py-3 px-4 max-w-sm text-slate-300">
                  <p className="line-clamp-2 leading-relaxed">{rep.text}</p>
                  {rep.hashtags && rep.hashtags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-1.5">
                      {rep.hashtags.map(h => (
                        <button
                          key={h}
                          onClick={() => setSelectedHashtag(h)}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/60 hover:text-white transition-all cursor-pointer"
                        >
                          {h.startsWith('#') ? h : `#${h}`}
                        </button>
                      ))}
                    </div>
                  )}
                </td>

                {/* News Website / Source Attribution */}
                <td className="py-3 px-4 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {getSourceIcon(rep.source_type)}
                    <span className="font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {rep.source_name || (rep.source_type === 'rss_news' ? 'National News Agency' : rep.source_type)}
                    </span>
                    {rep.media_urls && rep.media_urls.length > 0 && (
                      <span className="text-cyan-400" title="Photo/Video media attached">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-0.5 uppercase tracking-wider">
                    Channel: {rep.source_type.replace(/_/g, ' ')}
                  </span>
                </td>

                {/* AI Credibility */}
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

                {/* Verification Status */}
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    rep.verification_status === 'VERIFIED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50' :
                    rep.verification_status === 'LIKELY_MISLEADING' ? 'bg-rose-950/80 text-rose-300 border border-rose-700/50' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {rep.verification_status}
                  </span>
                </td>

                {/* Date & Time */}
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  <div className="text-slate-300">{new Date(rep.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                  <div className="text-[10px] text-slate-500">
                    {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onSelectReport(rep)}
                    className="p-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 transition-colors cursor-pointer"
                    title="Deep Inspect with AI & Google Street View"
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