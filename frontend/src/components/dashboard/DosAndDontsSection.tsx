import React, { useState, useMemo } from 'react';
import { Search, Play, X, ShieldAlert, CheckCircle2, AlertTriangle, BookOpen, Video, Globe, Sparkles } from 'lucide-react';
import { 
  DisasterCategory, 
  LanguageCode, 
  DosDontsData, 
  DISASTER_CATEGORIES, 
  LANGUAGES, 
  CATEGORY_NAMES, 
  UI_TEXT 
} from './dosAndDontsTypes';
import { DISASTER_CONTENT } from './translations';

export const DosAndDontsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DisasterCategory>('Cyclones');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);

  // Dynamic UI labels based on active language
  const ui = useMemo(() => {
    return UI_TEXT[selectedLanguage] || UI_TEXT['English'];
  }, [selectedLanguage]);

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DISASTER_CATEGORIES;
    return DISASTER_CATEGORIES.filter(cat => {
      const localizedName = CATEGORY_NAMES[cat]?.[selectedLanguage] || cat;
      return cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
             localizedName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, selectedLanguage]);

  // Current content with fallback
  const currentContent = useMemo(() => {
    const categoryData = DISASTER_CONTENT[selectedCategory] || DISASTER_CONTENT['Cyclones'];
    return categoryData[selectedLanguage] || categoryData['English'] || DISASTER_CONTENT['Cyclones']['English'];
  }, [selectedCategory, selectedLanguage]);

  return (
    <div className="w-full space-y-4 font-sans select-none animate-fade-in">
      {/* 1. Header Tab Pill */}
      <div className="flex items-center">
        <div className="bg-[#18447e] text-white px-6 py-2.5 rounded-t-2xl font-black text-sm tracking-wider uppercase font-heading flex items-center gap-2 shadow-sm">
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>{ui.dosAndDonts}</span>
        </div>
      </div>

      {/* 2. Controls Ribbon: Search + Category Pills + Language Selector */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs dark:shadow-xl space-y-4">
        {/* Top Filter Row: Search & Events Pills */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">
              {ui.eventsLabel}
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ui.searchPlaceholder}
                className="w-36 sm:w-44 pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-full text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18447e]"
              />
            </div>
          </div>

          {/* Disaster Categories Pills */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const displayName = CATEGORY_NAMES[cat]?.[selectedLanguage] || cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#1b6b3e] text-white border-[#1b6b3e] shadow-xs'
                      : 'bg-[#1e88e5] text-white border-[#1e88e5] hover:bg-[#1565c0]'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Language Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap border-t border-slate-100 dark:border-slate-800 pt-3">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-0.8 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1b6b3e] text-white border-[#1b6b3e] shadow-xs'
                    : 'bg-[#1e88e5] text-white border-[#1e88e5] hover:bg-[#1565c0]'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Content: Open Booklet Pamphlet (Left) + Video Section (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Official Open Pamphlet Booklet */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs dark:shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Middle Book Binding Spine Line */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Left Page: BEFORE DISASTER */}
            <div className="space-y-3.5 md:pr-4">
              <div className="text-center pb-2 border-b-2 border-slate-300 dark:border-slate-700">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-heading">
                  {currentContent.title}
                </h3>
              </div>

              <div className="pt-1">
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-900 dark:text-white mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                  {currentContent.beforeTitle || `${ui.beforePrefix} ${(CATEGORY_NAMES[selectedCategory]?.[selectedLanguage] || selectedCategory).toUpperCase()}`}
                </h4>

                <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-300 leading-relaxed list-disc list-outside pl-4 font-sans">
                  {currentContent.before.map((point, i) => (
                    <li key={i} className="pl-1">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Page: DURING & AFTER DISASTER */}
            <div className="space-y-3.5 md:pl-4">
              <div className="text-center pb-2 border-b-2 border-slate-300 dark:border-slate-700">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-heading">
                  {currentContent.title}
                </h3>
              </div>

              <div className="pt-1">
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-900 dark:text-white mb-2.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  {currentContent.duringAfterTitle || `${ui.duringAfterPrefix} ${(CATEGORY_NAMES[selectedCategory]?.[selectedLanguage] || selectedCategory).toUpperCase()}`}
                </h4>

                <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-300 leading-relaxed list-disc list-outside pl-4 font-sans">
                  {currentContent.duringAfter.map((point, i) => (
                    <li key={i} className="pl-1">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Video Section */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs dark:shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black tracking-wide text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-600" />
                {ui.videoSection}
              </h3>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {ui.officialSafety}
              </span>
            </div>

            {/* 2x2 Grid of Video Cards matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {currentContent.videos.map((vid, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveVideo({ title: vid.title, youtubeId: vid.youtubeId })}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black aspect-video cursor-pointer shadow-xs hover:shadow-md transition-all flex items-center justify-center"
                >
                  {/* Background Thumbnail Image */}
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-95"
                  />

                  {/* Red Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  {/* Video Title Header Overlay */}
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-2">
                    <p className="text-[10px] text-white font-bold line-clamp-1 leading-tight drop-shadow-xs">
                      {vid.title}
                    </p>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white">
                    {vid.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {ui.footerNotice}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Video Player Modal */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <h4 className="text-xs font-bold truncate pr-4">{activeVideo.title}</h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
