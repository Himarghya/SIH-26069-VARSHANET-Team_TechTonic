import React, { useState, useMemo, useEffect } from 'react';
import { Search, Play, X, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, BookOpen, Video, Globe, Sparkles } from 'lucide-react';
import { 
  DisasterCategory, 
  LanguageCode, 
  DosDontsData, 
  DISASTER_CATEGORIES, 
  LANGUAGES, 
  CATEGORY_NAMES, 
  UI_TEXT 
} from './dosAndDontsTypes';
import { useLanguage, LanguageCode as GlobalLanguageCode } from '../../context/LanguageContext';
import { 
  getAllCategories, 
  getGuidelineContent, 
  subscribeToGuidelines 
} from '../../services/dosAndDontsStore';

export const DosAndDontsSection: React.FC = () => {
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  const [categories, setCategories] = useState<string[]>(getAllCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('Cyclones');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);

  // Subscribe to live guideline updates from Admin
  useEffect(() => {
    const unsubscribe = subscribeToGuidelines(() => {
      setCategories(getAllCategories());
    });
    return unsubscribe;
  }, []);

  // Map global language into DosAndDonts language code
  const selectedLanguage: LanguageCode = useMemo(() => {
    if (LANGUAGES.includes(globalLanguage as any)) {
      return globalLanguage as LanguageCode;
    }
    if (globalLanguage === 'संस्कृतम्' || globalLanguage === 'मैथिली' || globalLanguage === 'اردو') {
      return 'हिन्दी';
    }
    return 'English';
  }, [globalLanguage]);

  const handleLanguageChange = (lang: LanguageCode) => {
    setGlobalLanguage(lang as GlobalLanguageCode);
  };

  // Dynamic UI labels based on active language
  const ui = useMemo(() => {
    return UI_TEXT[selectedLanguage] || UI_TEXT['English'];
  }, [selectedLanguage]);

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(cat => {
      const isDefault = (CATEGORY_NAMES as any)[cat];
      const localizedName = isDefault ? (CATEGORY_NAMES[cat as DisasterCategory]?.[selectedLanguage] || cat) : cat;
      return cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
             localizedName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [categories, searchQuery, selectedLanguage]);

  // Current content with fallback & dynamic overrides
  const currentContent = useMemo(() => {
    return getGuidelineContent(selectedCategory, selectedLanguage);
  }, [selectedCategory, selectedLanguage, categories]);

  return (
    <div className="w-full space-y-4 font-sans select-none animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-3.5 px-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              {ui.dosAndDonts}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              NDMA &amp; IMD Standard Operating Procedures (12 Disaster Hazards)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>NDMA Verified Protocol</span>
          </span>
        </div>
      </div>

      {/* 2. Controls Ribbon: Search + Category Pills + Language Selector */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        
        {/* Top Filter Row: Search & Category Pills */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ui.searchPlaceholder}
                className="w-40 sm:w-48 pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Disaster Categories Pills */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const displayName = (CATEGORY_NAMES as any)[cat]?.[selectedLanguage] || cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm font-bold shadow-blue-900/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Language Selector Pills */}
        <div className="flex items-center gap-2 flex-wrap border-t border-slate-200/60 dark:border-slate-800/80 pt-3">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold shrink-0 pr-1">
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Languages:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-slate-900 dark:border-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
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
              <div className="text-center pb-2.5 border-b border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  {currentContent.title}
                </span>
                <h4 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wide text-emerald-950 dark:text-emerald-200 mt-0.5 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{currentContent.beforeTitle || `${ui.beforePrefix} ${((CATEGORY_NAMES as any)[selectedCategory]?.[selectedLanguage] || selectedCategory).toUpperCase()}`}</span>
                </h4>
              </div>

              <div className="pt-1">
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
              <div className="text-center pb-2.5 border-b border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-xl">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block">
                  {currentContent.title}
                </span>
                <h4 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wide text-rose-950 dark:text-rose-200 mt-0.5 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{currentContent.duringAfterTitle || `${ui.duringAfterPrefix} ${((CATEGORY_NAMES as any)[selectedCategory]?.[selectedLanguage] || selectedCategory).toUpperCase()}`}</span>
                </h4>
              </div>

              <div className="pt-1">
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
