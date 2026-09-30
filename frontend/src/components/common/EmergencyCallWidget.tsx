import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, X, ShieldAlert, AlertOctagon, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EmergencyCallWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setShowDirectory(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const emergencyNumbers = [
    { number: '112', title: 'National Emergency Helpline (All-in-One)', subtitle: 'Police, Fire, Ambulance, Disaster' },
    { number: '1078', title: 'NDMA Disaster Management Control Room', subtitle: 'National Disaster Relief & Rescue' },
    { number: '1070', title: 'State Disaster Emergency Ops Centre', subtitle: 'State EOC & Evacuation Command' },
    { number: '108', title: 'Emergency Medical & Ambulance', subtitle: '24/7 Critical Trauma Response' },
    { number: '1077', title: 'District Disaster Control Room', subtitle: 'Local Relief & Rehabilitation' }
  ];

  return (
    <div
      ref={widgetRef}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 select-none font-sans transition-all duration-300 ease-out"
    >
      {!isExpanded ? (
        /* Collapsed Blue Call Button Tab (Matches Screenshot 1) */
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center justify-center bg-[#1e88e5] hover:bg-[#1565c0] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-l-3xl shadow-2xl cursor-pointer transition-transform hover:-translate-x-1 active:scale-95"
          title="Emergency Disaster Call - Dial 112"
          aria-label="Open emergency call assistance"
        >
          <div className="relative flex items-center justify-center">
            {/* Soft Ripple effect */}
            <span className="absolute w-10 h-10 rounded-full bg-white/20 animate-ping pointer-events-none" />
            <Phone className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white rotate-[-20deg] drop-shadow-md group-hover:scale-110 transition-transform" />
          </div>
        </button>
      ) : (
        /* Expanded Red Call Box (Matches Screenshot 2) */
        <div className="relative bg-[#cb2a2a] text-white rounded-l-3xl shadow-2xl p-4 sm:p-5 w-60 sm:w-64 flex flex-col items-center text-center transition-all animate-fade-in border-y-2 border-l-2 border-red-700/50">
          {/* Close mini button in corner */}
          <button
            onClick={() => {
              setIsExpanded(false);
              setShowDirectory(false);
            }}
            className="absolute top-2 right-2 p-1 text-white/80 hover:text-white hover:bg-black/20 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Centered White Phone Icon */}
          <a
            href="tel:112"
            className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center mb-3 transition-transform hover:scale-105 active:scale-95 shadow-inner cursor-pointer"
            title="Click to Call 112"
          >
            <Phone className="w-8 h-8 fill-white text-white rotate-[-20deg] drop-shadow-md" />
          </a>

          {/* Text matches screenshot 2 */}
          <a
            href="tel:112"
            className="text-white font-bold text-sm sm:text-base leading-snug tracking-tight hover:underline cursor-pointer block"
          >
            Dial 112 for disaster emergency
          </a>

          {/* Direct Instant Call Button */}
          <div className="mt-3.5 w-full space-y-2">
            <a
              href="tel:112"
              className="w-full py-2 px-3 bg-white text-[#cb2a2a] hover:bg-red-50 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:shadow-xl active:scale-98 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 112 Now</span>
            </a>

            {/* View Full Emergency Helplines Toggle */}
            <button
              onClick={() => setShowDirectory(!showDirectory)}
              className="w-full py-1 text-[11px] text-white/90 hover:text-white font-medium underline cursor-pointer text-center"
            >
              {showDirectory ? 'Hide Helplines' : 'View All Emergency Helplines'}
            </button>
          </div>

          {/* Emergency Directory Popout */}
          {showDirectory && (
            <div className="mt-3 pt-3 border-t border-white/20 w-full text-left space-y-2 max-h-56 overflow-y-auto pr-1">
              {emergencyNumbers.map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="block p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors cursor-pointer text-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs tracking-wider text-amber-300">
                      📞 {item.number}
                    </span>
                    <span className="text-[9px] font-mono bg-white/20 px-1.5 py-0.5 rounded">
                      Call
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-white/95 leading-tight mt-0.5">
                    {item.title}
                  </p>
                  <p className="text-[9px] text-white/70 leading-tight">
                    {item.subtitle}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
