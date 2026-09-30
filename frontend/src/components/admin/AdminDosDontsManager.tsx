import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Video, 
  Save, 
  RotateCcw, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  Layers, 
  Check, 
  X,
  FileText,
  HelpCircle
} from 'lucide-react';
import { DisasterCategory, LanguageCode, DosDontsData, LANGUAGES, CATEGORY_NAMES } from '../dashboard/dosAndDontsTypes';
import { 
  getAllCategories, 
  getGuidelineContent, 
  saveGuideline, 
  deleteCustomGuideline, 
  resetAllGuidelinesToDefault,
  subscribeToGuidelines 
} from '../../services/dosAndDontsStore';

export const AdminDosDontsManager: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(getAllCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('Cyclones');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('English');
  
  // Form state
  const [title, setTitle] = useState('');
  const [beforeTitle, setBeforeTitle] = useState('');
  const [duringAfterTitle, setDuringAfterTitle] = useState('');
  const [beforePoints, setBeforePoints] = useState<string[]>([]);
  const [duringAfterPoints, setDuringAfterPoints] = useState<string[]>([]);
  const [videos, setVideos] = useState<{ title: string; duration: string; youtubeId: string; thumbnailUrl: string }[]>([]);
  
  // Inputs for adding new items
  const [newBeforeInput, setNewBeforeInput] = useState('');
  const [newDuringInput, setNewDuringInput] = useState('');
  
  // New Video Modal / Input
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoUrlOrIdInput, setVideoUrlOrIdInput] = useState('');
  const [videoDurationInput, setVideoDurationInput] = useState('2:45');

  // New Category Modal / Input
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync categories list when store updates
  useEffect(() => {
    const unsubscribe = subscribeToGuidelines(() => {
      setCategories(getAllCategories());
    });
    return unsubscribe;
  }, []);

  // Load content when selectedCategory or selectedLanguage changes
  useEffect(() => {
    const data = getGuidelineContent(selectedCategory, selectedLanguage);
    setTitle(data.title || `${selectedCategory} Safety Protocol`);
    setBeforeTitle(data.beforeTitle || `BEFORE ${selectedCategory.toUpperCase()}`);
    setDuringAfterTitle(data.duringAfterTitle || `DURING & AFTER ${selectedCategory.toUpperCase()}`);
    setBeforePoints([...data.before]);
    setDuringAfterPoints([...data.duringAfter]);
    setVideos([...(data.videos || [])]);
  }, [selectedCategory, selectedLanguage]);

  // Helper to extract YouTube ID from standard URL or direct ID
  const extractYoutubeId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (!trimmed) return 'vB0XfB-aC0g';
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : trimmed;
  };

  // Add Point handlers
  const handleAddBeforePoint = () => {
    if (!newBeforeInput.trim()) return;
    setBeforePoints(prev => [...prev, newBeforeInput.trim()]);
    setNewBeforeInput('');
  };

  const handleAddDuringPoint = () => {
    if (!newDuringInput.trim()) return;
    setDuringAfterPoints(prev => [...prev, newDuringInput.trim()]);
    setNewDuringInput('');
  };

  const handleRemoveBeforePoint = (idx: number) => {
    setBeforePoints(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveDuringPoint = (idx: number) => {
    setDuringAfterPoints(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddVideo = () => {
    if (!videoTitleInput.trim() || !videoUrlOrIdInput.trim()) return;
    const yId = extractYoutubeId(videoUrlOrIdInput);
    const newVid = {
      title: videoTitleInput.trim(),
      duration: videoDurationInput.trim() || '2:30',
      youtubeId: yId,
      thumbnailUrl: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`
    };
    setVideos(prev => [...prev, newVid]);
    setVideoTitleInput('');
    setVideoUrlOrIdInput('');
    setVideoDurationInput('2:45');
    setShowAddVideo(false);
  };

  const handleRemoveVideo = (idx: number) => {
    setVideos(prev => prev.filter((_, i) => i !== idx));
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave: DosDontsData = {
        title: title.trim() || `${selectedCategory} Safety Protocol`,
        beforeTitle: beforeTitle.trim() || `BEFORE ${selectedCategory.toUpperCase()}`,
        duringAfterTitle: duringAfterTitle.trim() || `DURING & AFTER ${selectedCategory.toUpperCase()}`,
        before: beforePoints.length > 0 ? beforePoints : ['Stay alert to local weather alerts.'],
        duringAfter: duringAfterPoints.length > 0 ? duringAfterPoints : ['Follow disaster authority directives.'],
        videos: videos
      };

      await saveGuideline(selectedCategory, selectedLanguage, dataToSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Save guideline error', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset current category
  const handleResetCategory = async () => {
    if (confirm(`Reset guidelines for "${selectedCategory}" back to factory NDMA defaults?`)) {
      await deleteCustomGuideline(selectedCategory);
      const data = getGuidelineContent(selectedCategory, selectedLanguage);
      setTitle(data.title);
      setBeforeTitle(data.beforeTitle || `BEFORE ${selectedCategory.toUpperCase()}`);
      setDuringAfterTitle(data.duringAfterTitle || `DURING & AFTER ${selectedCategory.toUpperCase()}`);
      setBeforePoints([...data.before]);
      setDuringAfterPoints([...data.duringAfter]);
      setVideos([...(data.videos || [])]);
    }
  };

  // Create new custom hazard category
  const handleCreateNewCategory = () => {
    const catName = newCategoryName.trim();
    if (!catName) return;
    if (!categories.includes(catName)) {
      setCategories(prev => [...prev, catName]);
    }
    setSelectedCategory(catName);
    setNewCategoryName('');
    setShowNewCategoryModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 font-bold">
            <BookOpen className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Disaster Safety Guidelines &amp; SOP Manager</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
                Official NDMA Hub
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Create, customize, and publish verified Do's &amp; Don'ts, action protocols, and video tutorials across 16 Indian languages.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowNewCategoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>+ New Hazard Category</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 transition-all cursor-pointer active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Published to Live Portal!</span>
              </>
            ) : isSaving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Guidelines</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selector Ribbon: Category selection + Language switch */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        
        {/* Row 1: Category Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 pr-1">
            Hazard Category:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const isDefault = (CATEGORY_NAMES as any)[cat];
              const displayName = isDefault ? (CATEGORY_NAMES[cat as DisasterCategory]?.[selectedLanguage] || cat) : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm font-bold shadow-blue-900/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{displayName}</span>
                  {!isDefault && <span className="text-[9px] font-mono text-cyan-300 font-bold ml-0.5">• custom</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Language Switcher */}
        <div className="flex items-center gap-2 flex-wrap border-t border-slate-200/60 dark:border-slate-800/80 pt-3">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold shrink-0 pr-1">
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Target Language:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
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

      {/* Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Editable Form */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card 1: Titles Configuration */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Protocol Headers ({selectedCategory} - {selectedLanguage})</span>
              </h3>
              <button
                onClick={handleResetCategory}
                className="text-[11px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                title="Reset this hazard to default NDMA guidelines"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Main Protocol Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cyclones Safety Protocol"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Before Action Subheading</span>
                  </label>
                  <input
                    type="text"
                    value={beforeTitle}
                    onChange={(e) => setBeforeTitle(e.target.value)}
                    placeholder="BEFORE DISASTER"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>During &amp; After Subheading</span>
                  </label>
                  <input
                    type="text"
                    value={duringAfterTitle}
                    onChange={(e) => setDuringAfterTitle(e.target.value)}
                    placeholder="DURING & AFTER DISASTER"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Do's (Before Disaster) List Manager */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-900/50 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Do's Action Items (Before Disaster) — {beforePoints.length} Points</span>
              </h3>
            </div>

            {/* Existing Points */}
            <div className="space-y-2">
              {beforePoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => {
                      const updated = [...beforePoints];
                      updated[idx] = e.target.value;
                      setBeforePoints(updated);
                    }}
                    className="flex-1 bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveBeforePoint(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Before Point Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newBeforeInput}
                onChange={(e) => setNewBeforeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBeforePoint()}
                placeholder="+ Add an action item to DO before disaster..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                onClick={handleAddBeforePoint}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Card 3: Don'ts (During & After) List Manager */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-rose-200/80 dark:border-rose-900/50 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/50 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Don'ts / Hazards (During &amp; After) — {duringAfterPoints.length} Points</span>
              </h3>
            </div>

            {/* Existing Points */}
            <div className="space-y-2">
              {duringAfterPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40 text-xs">
                  <span className="font-mono font-bold text-rose-700 dark:text-rose-400 mt-0.5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => {
                      const updated = [...duringAfterPoints];
                      updated[idx] = e.target.value;
                      setDuringAfterPoints(updated);
                    }}
                    className="flex-1 bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveDuringPoint(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New During Point Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newDuringInput}
                onChange={(e) => setNewDuringInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDuringPoint()}
                placeholder="+ Add a prevention item to NEVER DO during disaster..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-medium"
              />
              <button
                onClick={handleAddDuringPoint}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Card 4: Video Guides Manager */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-600" />
                <span>Safety Video Tutorials ({videos.length} Videos)</span>
              </h3>
              <button
                onClick={() => setShowAddVideo(true)}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Video</span>
              </button>
            </div>

            {/* Video Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videos.map((vid, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-16 h-12 rounded-lg object-cover shrink-0 bg-black"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{vid.title}</p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{vid.duration} • ID: {vid.youtubeId}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveVideo(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Video Form Drawer */}
            {showAddVideo && (
              <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-700 space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Add YouTube Safety Video</span>
                  <button onClick={() => setShowAddVideo(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={videoTitleInput}
                  onChange={(e) => setVideoTitleInput(e.target.value)}
                  placeholder="Video Title (e.g. Cyclone Evacuation & Warning Guide)"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={videoUrlOrIdInput}
                    onChange={(e) => setVideoUrlOrIdInput(e.target.value)}
                    placeholder="YouTube URL or Video ID (e.g. dQw4w9WgXcQ)"
                    className="col-span-2 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={videoDurationInput}
                    onChange={(e) => setVideoDurationInput(e.target.value)}
                    placeholder="Duration (e.g. 2:45)"
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddVideo(false)}
                    className="px-3 py-1 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddVideo}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    Attach Video
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Live Preview of Booklet Pamphlet */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-heading">
                  Citizen Portal Live Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {selectedLanguage}
              </span>
            </div>

            {/* Pamphlet Open Booklet Preview */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              
              {/* Header Title */}
              <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-700 dark:text-cyan-400 font-bold block">
                  Official NDMA Safety SOP
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {title || `${selectedCategory} Safety Protocol`}
                </h4>
              </div>

              {/* Before Disaster Section */}
              <div className="space-y-2">
                <div className="bg-emerald-100/70 dark:bg-emerald-950/40 p-1.5 px-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 text-emerald-950 dark:text-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{beforeTitle || `BEFORE ${selectedCategory.toUpperCase()}`}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-outside pl-4">
                  {beforePoints.map((pt, i) => (
                    <li key={i} className="leading-snug pl-0.5">{pt}</li>
                  ))}
                </ul>
              </div>

              {/* During & After Disaster Section */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="bg-rose-100/70 dark:bg-rose-950/40 p-1.5 px-2.5 rounded-lg border border-rose-300 dark:border-rose-800 flex items-center gap-1.5 text-rose-950 dark:text-rose-200 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{duringAfterTitle || `DURING & AFTER ${selectedCategory.toUpperCase()}`}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-outside pl-4">
                  {duringAfterPoints.map((pt, i) => (
                    <li key={i} className="leading-snug pl-0.5">{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Video preview thumbnail */}
              {videos.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Attached Video Guides ({videos.length})
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {videos.slice(0, 2).map((v, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden bg-black aspect-video">
                        <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover opacity-80" />
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[8px] font-mono text-white">{v.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create New Category */}
      {showNewCategoryModal && (
        <div
          onClick={() => setShowNewCategoryModal(false)}
          className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-600" />
                <span>Create New Disaster Category</span>
              </h4>
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Hazard Name (e.g. Forest Fires, Industrial Chemical Leak, GLOF)
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateNewCategory()}
                placeholder="Enter hazard category name..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewCategory}
                disabled={!newCategoryName.trim()}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-xs"
              >
                Create Hazard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
