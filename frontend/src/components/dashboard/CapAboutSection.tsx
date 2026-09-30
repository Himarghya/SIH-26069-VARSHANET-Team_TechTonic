import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const CapAboutSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="w-full rounded-2xl bg-gradient-to-br from-[#12396e] via-[#0f2d57] to-[#0a1e3a] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-blue-400/20 relative overflow-hidden font-sans select-none mb-6">
      {/* Background Subtle Radar Wave Ring Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-cyan-400/10 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-cyan-400/10 pointer-events-none" />

      {/* Header Title & Envisioned Mission Statement */}
      <div className="text-center max-w-5xl mx-auto space-y-3.5 relative z-10">
        <div className="inline-flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            <span>🏆 Smart India Hackathon 2026</span>
            <span className="text-blue-300">•</span>
            <span>Team Tech_Tonic</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f5a623] tracking-wide font-serif relative mt-1">
            About VARSHANET
            <span className="block h-1 w-14 bg-[#f5a623] mx-auto mt-1 rounded-full opacity-80" />
          </h2>
        </div>
        <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-medium max-w-4xl mx-auto">
          <strong className="text-white font-bold">VARSHANET</strong> is envisioned and developed by <strong className="text-amber-300 font-bold">Team Tech_Tonic</strong> for <strong className="text-white font-bold">Smart India Hackathon (SIH 2026)</strong>. The platform delivers a robust Big Data Analytics engine, Multimodal AI citizen report credibility scoring, and a CAP-based Integrated Early Warning System designed for Pan-India near real-time disaster alert dissemination using advanced geo-intelligence and multi-channel reach.
        </p>
      </div>

      {/* 4-Step Pan-India Integrated Workflow Diagram with Connecting Arcs */}
      <div className="mt-10 lg:mt-12 relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 items-start relative">
          
          {/* STEP 1: All Natural & Man-made Disasters */}
          <div className="flex flex-col items-center text-center group">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-white p-1.5 shadow-2xl shadow-black/40 ring-4 ring-white/20 overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 flex items-center justify-center">
                {/* Visual Composite: Cyclone Vortex, Floods, Collapsed Structures & Lightning */}
                <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
                  <defs>
                    <radialGradient id="vortexGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#ffffff" />
                      <stop offset="30%" stop-color="#94a3b8" />
                      <stop offset="70%" stop-color="#334155" />
                      <stop offset="100%" stop-color="#0f172a" />
                    </radialGradient>
                    <linearGradient id="floodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#38bdf8" />
                      <stop offset="100%" stop-color="#0369a1" />
                    </linearGradient>
                  </defs>

                  {/* Dark storm sky */}
                  <rect width="200" height="200" fill="#1e293b" />

                  {/* Mountain & Hillside Terrain */}
                  <polygon points="0,110 50,50 110,120 160,60 200,110 200,200 0,200" fill="#475569" />

                  {/* Distressed Houses on Hills */}
                  <polygon points="35,60 55,45 75,60" fill="#b91c1c" />
                  <rect x="40" y="60" width="30" height="20" fill="#e2e8f0" />
                  <rect x="48" y="65" width="8" height="15" fill="#475569" />

                  <polygon points="125,75 145,60 165,75" fill="#c2410c" />
                  <rect x="130" y="75" width="30" height="18" fill="#cbd5e1" />

                  {/* Collapsed / Tilted Building (Earthquake damage) */}
                  <g transform="rotate(18 130 140)">
                    <rect x="110" y="100" width="45" height="50" fill="#94a3b8" stroke="#334155" stroke-width="2" />
                    <rect x="115" y="106" width="10" height="10" fill="#1e293b" />
                    <rect x="130" y="106" width="10" height="10" fill="#1e293b" />
                    <rect x="115" y="122" width="10" height="10" fill="#1e293b" />
                    <rect x="130" y="122" width="10" height="10" fill="#1e293b" />
                    {/* Cracks */}
                    <path d="M 125 100 L 128 115 L 122 128 L 132 145" stroke="#ef4444" stroke-width="2" fill="none" />
                  </g>

                  {/* Giant Swirling Cyclone Eye & Hurricane Spiral */}
                  <g transform="translate(55, 140)">
                    <path d="M 0 0 C -30 -20 -40 -50 -10 -70 C 20 -90 60 -70 70 -40 C 80 -10 60 20 30 30 C 0 40 -30 20 -40 -10 C -50 -40 -20 -60 0 -50" 
                          fill="none" stroke="#e0f2fe" stroke-width="9" stroke-linecap="round" opacity="0.8" />
                    <path d="M -10 -5 C -35 -15 -35 -40 -15 -55 C 10 -70 40 -50 45 -25 C 50 0 30 20 10 15" 
                          fill="none" stroke="#bae6fd" stroke-width="6" stroke-linecap="round" opacity="0.9" />
                    <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="3" />
                  </g>

                  {/* Flood Wave Water Surge */}
                  <path d="M 0 160 Q 50 140 100 165 T 200 150 L 200 200 L 0 200 Z" fill="url(#floodGrad)" opacity="0.9" />
                  <path d="M 0 175 Q 60 160 120 180 T 200 170 L 200 200 L 0 200 Z" fill="#0284c7" opacity="0.8" />

                  {/* Lightning Strike */}
                  <polygon points="100,10 90,40 102,40 88,75 110,35 96,35" fill="#facc15" opacity="0.9" />
                </svg>
              </div>
            </div>
            <p className="mt-3.5 text-sm sm:text-base font-medium text-blue-100 max-w-[200px]">
              For all natural &amp; man-made disasters,
            </p>
          </div>

          {/* DESKTOP CONNECTING ARROW 1 -> 2 */}
          <div className="hidden lg:block absolute left-[22%] top-16 w-[7%] pointer-events-none z-20">
            <svg viewBox="0 0 80 40" className="w-full h-auto">
              <path d="M 5 25 Q 40 -5 75 22" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
              <polyline points="63,22 75,23 74,11" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          {/* STEP 2: Receive alerts in geo-targeted manner */}
          <div className="flex flex-col items-center text-center group">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-white p-1.5 shadow-2xl shadow-black/40 ring-4 ring-white/20 overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-[#f1f5f9] flex items-center justify-center">
                {/* Visual: Smartphone with Alert + Map Road Grid + GEOFENCE Target Pin & Targeted Nodes */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Map Grid Background */}
                  <rect width="200" height="200" fill="#e2e8f0" />
                  {/* Road Network */}
                  <path d="M -10 100 L 210 120" stroke="#cbd5e1" stroke-width="18" fill="none" />
                  <path d="M 120 -10 L 80 210" stroke="#cbd5e1" stroke-width="18" fill="none" />
                  <path d="M 20 20 L 180 180" stroke="#ffffff" stroke-width="12" fill="none" />
                  <path d="M -10 60 Q 90 80 210 50" stroke="#ffffff" stroke-width="10" fill="none" />
                  <path d="M 40 180 Q 140 150 190 70" stroke="#fef08a" stroke-width="8" fill="none" />

                  {/* Geofence Polygon Boundary */}
                  <polygon points="110,60 170,75 180,140 120,165 90,120" fill="#0284c7" fill-opacity="0.2" stroke="#0284c7" stroke-width="2" stroke-dasharray="4,3" />

                  {/* Smartphone Device Mockup on Left */}
                  <g transform="translate(18, 25) rotate(-8)">
                    <rect x="0" y="0" width="62" height="118" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
                    {/* Screen */}
                    <rect x="3" y="10" width="56" height="98" rx="4" fill="#ffffff" />
                    {/* Speaker notch */}
                    <line x1="24" y1="5" x2="38" y2="5" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
                    
                    {/* Alert Card inside Mobile */}
                    <rect x="6" y="16" width="50" height="28" rx="3" fill="#fee2e2" />
                    <rect x="10" y="20" width="20" height="4" rx="1" fill="#dc2626" />
                    <rect x="10" y="27" width="42" height="3" rx="1" fill="#991b1b" />
                    <rect x="10" y="33" width="32" height="3" rx="1" fill="#b91c1c" />

                    {/* Mini Geofence graphic in phone */}
                    <rect x="6" y="48" width="50" height="42" rx="3" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
                    <circle cx="31" cy="65" r="10" fill="#fca5a5" fill-opacity="0.4" stroke="#ef4444" stroke-width="1.5" />
                    <circle cx="31" cy="65" r="3" fill="#dc2626" />

                    {/* OK button */}
                    <rect x="14" y="94" width="34" height="10" rx="2" fill="#16a34a" />
                    <text x="31" y="101" font-size="6" font-family="sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">RECEIVE</text>
                  </g>

                  {/* Map Pin Marker inside Geofence */}
                  <g transform="translate(142, 62)">
                    <path d="M 0 0 C -8 -8 -12 -16 -12 -24 C -12 -34 -6 -40 0 -40 C 6 -40 12 -34 12 -24 C 12 -16 8 -8 0 0 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5" />
                    <circle cx="0" cy="-24" r="5" fill="#ffffff" />
                  </g>

                  {/* GEOFENCE Text Label Badge */}
                  <g transform="translate(108, 114)">
                    <rect x="0" y="0" width="68" height="18" rx="4" fill="#0369a1" />
                    <text x="34" y="12" font-size="9" font-family="monospace" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">GEOFENCE</text>
                  </g>

                  {/* Inside Geofence Phone with Green Checkmark */}
                  <g transform="translate(132, 136)">
                    <rect x="0" y="0" width="18" height="26" rx="2" fill="#334155" />
                    <rect x="2" y="3" width="14" height="20" rx="1" fill="#dcfce7" />
                    <circle cx="9" cy="13" r="5" fill="#16a34a" />
                    <polyline points="7,13 8.5,15 11.5,11" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
                  </g>

                  {/* Outside Geofence Phones with Red Cross (Not Disturbed) */}
                  <g transform="translate(168, 62)">
                    <rect x="0" y="0" width="14" height="20" rx="2" fill="#64748b" />
                    <circle cx="14" cy="0" r="4.5" fill="#ef4444" />
                    <line x1="12" y1="-2" x2="16" y2="2" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
                    <line x1="16" y1="-2" x2="12" y2="2" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
                  </g>
                  <g transform="translate(94, 64)">
                    <rect x="0" y="0" width="14" height="20" rx="2" fill="#64748b" />
                    <circle cx="14" cy="0" r="4.5" fill="#ef4444" />
                    <line x1="12" y1="-2" x2="16" y2="2" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
                    <line x1="16" y1="-2" x2="12" y2="2" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="mt-3.5 text-sm sm:text-base font-medium text-blue-100 max-w-[200px]">
              receive alerts in geo-targeted manner
            </p>
          </div>

          {/* DESKTOP CONNECTING ARROW 2 -> 3 */}
          <div className="hidden lg:block absolute left-[47%] top-16 w-[7%] pointer-events-none z-20">
            <svg viewBox="0 0 80 40" className="w-full h-auto">
              <path d="M 5 25 Q 40 -5 75 22" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
              <polyline points="63,22 75,23 74,11" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          {/* STEP 3: In multiple languages */}
          <div className="flex flex-col items-center text-center group">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-white p-1.5 shadow-2xl shadow-black/40 ring-4 ring-white/20 overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-b from-white via-slate-50 to-blue-50/40 flex items-center justify-center">
                {/* Visual: Indian Multilingual Scripts + Diverse Citizen Avatars + Greetings Speech Bubbles */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Indic Scripts Typography Cloud Header */}
                  <g text-anchor="middle" font-weight="bold">
                    <text x="70" y="32" font-size="16" fill="#e11d48" font-family="'Noto Sans Tamil', sans-serif">தமிழ்</text>
                    <text x="135" y="28" font-size="10" fill="#0d9488" font-family="'Noto Sans Gujarati', sans-serif">ગુજરાતી</text>
                    <text x="50" y="52" font-size="13" fill="#0284c7" font-family="'Noto Sans Bengali', sans-serif">বাংলা</text>
                    <text x="105" y="50" font-size="20" fill="#16a34a" font-family="'Noto Sans Devanagari', sans-serif">हिन्दी</text>
                    <text x="156" y="44" font-size="10" fill="#d97706" font-family="'Noto Sans Devanagari', sans-serif">मराठी</text>
                    <text x="78" y="70" font-size="14" fill="#0284c7" font-family="'Noto Sans Telugu', sans-serif">తెలుగు</text>
                    <text x="140" y="68" font-size="14" fill="#059669" font-family="'Noto Nastaliq Urdu', sans-serif">اردو</text>
                  </g>

                  {/* Speech Bubble 1: 'হ্যালো' (Yellow) */}
                  <g transform="translate(18, 72)">
                    <circle cx="18" cy="18" r="16" fill="#f59e0b" />
                    <text x="18" y="23" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">হ্যালো</text>
                  </g>

                  {/* Speech Bubble 2: 'नमस्ते' (Crimson Red) */}
                  <g transform="translate(68, 70)">
                    <circle cx="22" cy="20" r="18" fill="#991b1b" />
                    <text x="22" y="25" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">नमस्ते</text>
                  </g>

                  {/* Speech Bubble 3: 'hello' (Dark Navy) */}
                  <g transform="translate(126, 73)">
                    <circle cx="18" cy="18" r="16" fill="#1e3a8a" />
                    <text x="18" y="22" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="sans-serif">hello</text>
                  </g>

                  {/* Citizen Avatars Bottom Row */}
                  {/* Person 1: Traditional Male in Kurta with Angavastram (Left) */}
                  <g transform="translate(36, 105)">
                    {/* Head */}
                    <circle cx="20" cy="20" r="13" fill="#fed7aa" />
                    {/* Hair */}
                    <path d="M 7 18 C 7 8 13 6 20 6 C 27 6 33 8 33 18 Z" fill="#1e293b" />
                    {/* Tilak */}
                    <line x1="20" y1="12" x2="20" y2="16" stroke="#ea580c" stroke-width="1.5" stroke-linecap="round" />
                    {/* Smiling Face */}
                    <circle cx="15" cy="19" r="1.5" fill="#1e293b" />
                    <circle cx="25" cy="19" r="1.5" fill="#1e293b" />
                    <path d="M 17 24 Q 20 27 23 24" fill="none" stroke="#1e293b" stroke-width="1.2" stroke-linecap="round" />
                    {/* Kurta Body */}
                    <path d="M 6 34 Q 20 31 34 34 L 38 75 L 2 75 Z" fill="#e2e8f0" />
                    {/* Saffron Angavastram Stole */}
                    <path d="M 8 34 L 14 75 L 21 75 L 14 34 Z" fill="#ea580c" />
                    {/* Hands Folded / Namaste */}
                    <circle cx="20" cy="46" r="5" fill="#fed7aa" />
                  </g>

                  {/* Person 2: Female in Saree with Bindi (Center) */}
                  <g transform="translate(80, 100)">
                    {/* Head */}
                    <circle cx="20" cy="20" r="13" fill="#fed7aa" />
                    {/* Long Hair */}
                    <path d="M 6 22 C 6 6 12 4 20 4 C 28 4 34 6 34 22 L 35 34 L 5 34 Z" fill="#1e293b" />
                    <circle cx="20" cy="20" r="12" fill="#fed7aa" />
                    {/* Red Bindi */}
                    <circle cx="20" cy="15" r="1.8" fill="#dc2626" />
                    {/* Smiling Eyes & Mouth */}
                    <circle cx="15" cy="19" r="1.5" fill="#1e293b" />
                    <circle cx="25" cy="19" r="1.5" fill="#1e293b" />
                    <path d="M 16 25 Q 20 28 24 25" fill="none" stroke="#1e293b" stroke-width="1.2" stroke-linecap="round" />
                    {/* Red Saree with Gold Border */}
                    <path d="M 4 34 Q 20 31 36 34 L 40 80 L 0 80 Z" fill="#dc2626" />
                    <path d="M 4 34 L 32 80 L 38 80 L 10 34 Z" fill="#f59e0b" />
                  </g>

                  {/* Person 3: Modern Youth in Blue Shirt (Right) */}
                  <g transform="translate(124, 105)">
                    {/* Head */}
                    <circle cx="20" cy="20" r="13" fill="#fed7aa" />
                    {/* Modern Spiky Hair */}
                    <path d="M 6 18 C 6 6 15 4 20 4 C 27 4 34 8 34 18 Z" fill="#1e293b" />
                    {/* Eyes & Smile */}
                    <circle cx="15" cy="19" r="1.5" fill="#1e293b" />
                    <circle cx="25" cy="19" r="1.5" fill="#1e293b" />
                    <path d="M 16 24 Q 20 27 24 24" fill="none" stroke="#1e293b" stroke-width="1.2" stroke-linecap="round" />
                    {/* Blue Shirt */}
                    <path d="M 6 34 Q 20 31 34 34 L 38 75 L 2 75 Z" fill="#3b82f6" />
                    {/* Joyful hands up gesture */}
                    <path d="M 3 45 Q 0 35 4 25" stroke="#fed7aa" stroke-width="3.5" stroke-linecap="round" fill="none" />
                    <path d="M 37 45 Q 40 35 36 25" stroke="#fed7aa" stroke-width="3.5" stroke-linecap="round" fill="none" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="mt-3.5 text-sm sm:text-base font-medium text-blue-100 max-w-[200px]">
              in multiple languages
            </p>
          </div>

          {/* DESKTOP CONNECTING ARROW 3 -> 4 */}
          <div className="hidden lg:block absolute left-[72%] top-16 w-[7%] pointer-events-none z-20">
            <svg viewBox="0 0 80 40" className="w-full h-auto">
              <path d="M 5 25 Q 40 -5 75 22" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
              <polyline points="63,22 75,23 74,11" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          {/* STEP 4: Across all media at the same time */}
          <div className="flex flex-col items-center text-center group">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-white p-1.5 shadow-2xl shadow-black/40 ring-4 ring-white/20 overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-white flex items-center justify-center">
                {/* Visual: Central Alert Hazard Symbol Radiating to Multiple Citizens and Media Channels */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Central Node & Connecting Spokes Lines */}
                  <g stroke="#334155" stroke-width="2" stroke-linecap="round">
                    {/* Top Left: Mobile Smartphone Citizen */}
                    <line x1="100" y1="100" x2="52" y2="48" />
                    {/* Top Right: Laptop / Web Portal User */}
                    <line x1="100" y1="100" x2="148" y2="48" />
                    {/* Bottom Left: Radio / Broadcast Receiver */}
                    <line x1="100" y1="100" x2="48" y2="152" />
                    {/* Bottom Right: Citizen with Phone / Tablet */}
                    <line x1="100" y1="100" x2="152" y2="152" />
                    {/* Direct Top: Satellite / Cloud Broadcast */}
                    <line x1="100" y1="100" x2="100" y2="30" />
                    {/* Direct Bottom: Message SMS Push */}
                    <line x1="100" y1="100" x2="100" y2="170" />
                  </g>

                  {/* Top-Left Channel: Female Citizen on Mobile */}
                  <g transform="translate(24, 20)">
                    <circle cx="28" cy="28" r="24" fill="#f1f5f9" />
                    {/* Person */}
                    <circle cx="26" cy="22" r="9" fill="#fed7aa" />
                    <path d="M 17 20 C 17 12 21 10 26 10 C 31 10 35 12 35 20 Z" fill="#0f172a" />
                    <path d="M 14 34 Q 26 31 38 34 L 41 50 L 11 50 Z" fill="#0284c7" />
                    {/* Holding Phone with Alert */}
                    <rect x="36" y="24" width="8" height="14" rx="1.5" fill="#1e293b" />
                    <rect x="37" y="26" width="6" height="10" rx="1" fill="#f87171" />
                    {/* Tower icon near it */}
                    <polygon points="6,20 2,34 10,34" fill="#ea580c" />
                  </g>

                  {/* Top-Right Channel: Citizen on Laptop / Workstation */}
                  <g transform="translate(124, 20)">
                    <circle cx="28" cy="28" r="24" fill="#f1f5f9" />
                    {/* Person */}
                    <circle cx="28" cy="20" r="9" fill="#fed7aa" />
                    <path d="M 19 18 C 19 10 23 8 28 8 C 33 8 37 10 37 18 Z" fill="#1e293b" />
                    <path d="M 16 32 Q 28 29 40 32 L 44 48 L 12 48 Z" fill="#f59e0b" />
                    {/* Laptop with Warning Screen */}
                    <polygon points="8,40 28,40 24,30 12,30" fill="#334155" />
                    <rect x="13" y="31" width="10" height="8" fill="#38bdf8" />
                    {/* RSS badge */}
                    <rect x="42" y="10" width="10" height="10" rx="2" fill="#f97316" />
                    <text x="47" y="18" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">((•))</text>
                  </g>

                  {/* Bottom-Left Channel: Citizen with Transistor Radio & TV */}
                  <g transform="translate(24, 124)">
                    <circle cx="28" cy="28" r="24" fill="#f1f5f9" />
                    {/* Person */}
                    <circle cx="32" cy="22" r="9" fill="#fed7aa" />
                    <path d="M 23 20 C 23 12 28 10 32 10 C 36 10 41 12 41 20 Z" fill="#1e293b" />
                    <path d="M 20 34 Q 32 31 44 34 L 48 50 L 16 50 Z" fill="#1e3a8a" />
                    {/* Radio */}
                    <rect x="4" y="28" width="16" height="12" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1" />
                    <line x1="6" y1="28" x2="2" y2="18" stroke="#78350f" stroke-width="1.5" />
                    <circle cx="12" cy="34" r="3" fill="#78350f" />
                  </g>

                  {/* Bottom-Right Channel: Mobile Notification User */}
                  <g transform="translate(124, 124)">
                    <circle cx="28" cy="28" r="24" fill="#f1f5f9" />
                    {/* Person */}
                    <circle cx="26" cy="22" r="9" fill="#fed7aa" />
                    <path d="M 17 20 C 17 12 21 10 26 10 C 31 10 35 12 35 20 Z" fill="#0f172a" />
                    <path d="M 14 34 Q 26 31 38 34 L 42 50 L 10 50 Z" fill="#10b981" />
                    {/* Mobile with Sound Wave */}
                    <rect x="36" y="22" width="10" height="16" rx="2" fill="#0284c7" />
                    <rect x="38" y="24" width="6" height="12" rx="1" fill="#ffffff" />
                  </g>

                  {/* Peripheral Technology Badges */}
                  {/* Cloud/Satellite Top Node */}
                  <g transform="translate(90, 16)">
                    <rect x="0" y="0" width="20" height="14" rx="3" fill="#0284c7" />
                    <path d="M 4 10 A 3 3 0 0 1 7 6 A 4 4 0 0 1 14 6 A 3 3 0 0 1 16 10 Z" fill="#ffffff" />
                  </g>

                  {/* Message/SMS Bubble Bottom Node */}
                  <g transform="translate(90, 162)">
                    <rect x="0" y="0" width="20" height="14" rx="4" fill="#1e3a8a" />
                    <circle cx="6" cy="7" r="1.5" fill="#ffffff" />
                    <circle cx="10" cy="7" r="1.5" fill="#ffffff" />
                    <circle cx="14" cy="7" r="1.5" fill="#ffffff" />
                  </g>

                  {/* TV Screen Node */}
                  <g transform="translate(56, 172)">
                    <rect x="0" y="0" width="16" height="12" rx="2" fill="#0ea5e9" />
                    <rect x="2" y="2" width="12" height="8" fill="#ffffff" />
                    <line x1="8" y1="12" x2="8" y2="15" stroke="#0ea5e9" stroke-width="1.5" />
                  </g>

                  {/* Sirens / PA Node */}
                  <g transform="translate(126, 172)">
                    <rect x="0" y="0" width="14" height="14" rx="2" fill="#f43f5e" />
                    <polygon points="3,11 7,11 11,14 11,0 7,3 3,3" fill="#ffffff" />
                  </g>

                  {/* Central CAP Alert Hub Badge (Hazard Triangle with exclamation) */}
                  <g transform="translate(100, 100)">
                    <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#0284c7" stroke-width="3" />
                    {/* Yellow Warning Triangle */}
                    <polygon points="0,-16 16,12 -16,12" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" stroke-linejoin="round" />
                    {/* Exclamation point */}
                    <line x1="0" y1="-8" x2="0" y2="4" stroke="#991b1b" stroke-width="2.5" stroke-linecap="round" />
                    <circle cx="0" cy="8" r="1.5" fill="#991b1b" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="mt-3.5 text-sm sm:text-base font-medium text-blue-100 max-w-[200px]">
              across all media at the same time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
