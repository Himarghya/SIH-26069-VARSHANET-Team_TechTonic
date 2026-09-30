import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  MapPin, 
  Phone, 
  Mail, 
  Printer, 
  Users, 
  User, 
  ExternalLink,
  ShieldCheck,
  X,
  HelpCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const OfficialPortalFooter: React.FC = () => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [todayCount, setTodayCount] = useState(482);
  const [totalCount, setTotalCount] = useState(701594);

  // Increment counter slightly to simulate live dynamic traffic
  useEffect(() => {
    const timer = setInterval(() => {
      setTodayCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDigitBoxes = (num: number, padLength: number = 3) => {
    const str = String(num).padStart(padLength, '0');
    return (
      <div className="inline-flex items-center gap-0.5 ml-2">
        {str.split('').map((digit, idx) => (
          <span
            key={idx}
            className="inline-flex items-center justify-center w-5 h-5 bg-white text-[#18447e] font-mono font-black text-xs rounded-xs shadow-xs border border-slate-300"
          >
            {digit}
          </span>
        ))}
      </div>
    );
  };

  return (
    <footer className="relative w-full bg-[#18447e] text-white font-sans mt-8 shadow-2xl border-t-4 border-[#ff9933] select-none">
      {/* Scroll to Top Floating Button (Matching screenshot bottom-left 'TOP' pill) */}
      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-6 w-11 h-11 rounded-full bg-white text-[#18447e] shadow-xl border-2 border-emerald-500 flex flex-col items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform z-30 group"
        title="Scroll to Top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4 text-emerald-600 stroke-[3] group-hover:-translate-y-0.5 transition-transform" />
        <span className="text-[8px] font-black text-slate-800 tracking-tighter leading-none">TOP</span>
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Socials + App Badges + Version + Links */}
          <div className="lg:col-span-7 space-y-4">
            {/* Row 1: Social Media Icons + App Store Badges */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Social Icons */}
              <div className="flex items-center gap-2">
                {/* Facebook Circle */}
                <a
                  href="https://facebook.com/NDMAIndia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center font-bold shadow-md hover:scale-110 transition-transform cursor-pointer text-sm"
                  title="Official Facebook Page"
                >
                  f
                </a>
                {/* YouTube Circle */}
                <a
                  href="https://youtube.com/@NDMAIndia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#ff0000] text-white flex items-center justify-center font-bold shadow-md hover:scale-110 transition-transform cursor-pointer"
                  title="Official YouTube Channel"
                >
                  <span className="text-[10px] tracking-tighter font-black">▶</span>
                </a>
                {/* X / Twitter Circle */}
                <a
                  href="https://twitter.com/ndmaindia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black shadow-md hover:scale-110 transition-transform cursor-pointer text-xs"
                  title="Official X Channel"
                >
                  𝕏
                </a>
              </div>

              {/* Mobile App Download Badges (Exact replica of screenshot) */}
              <div className="flex items-center gap-2">
                {/* Google Play Badge */}
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-lg shadow-md hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-[#34a853]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-.926V2.74a2.001 2.001 0 0 1 .609-.926zm11.604 11.607l2.42 2.42-12.04 6.842 9.62-9.262zm0-2.842L5.593 1.317l12.04 6.842-2.42 2.42zM16.634 12l2.84-2.84c.693-.404 1.157-1.127 1.157-2.004 0-.173-.024-.34-.069-.5L17.72 12l2.842 5.344c.045-.16.069-.327.069-.5 0-.877-.464-1.6-1.157-2.004L16.634 12z"/>
                  </svg>
                  <div className="text-left leading-none">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">GET IT ON</span>
                    <span className="block text-xs font-black tracking-tight text-slate-900 font-heading">Google Play</span>
                  </div>
                </a>

                {/* Apple App Store Badge */}
                <a
                  href="https://apple.com/app-store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-lg shadow-md hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.85-.92.04-2.02.62-2.67 1.37-.56.65-1.06 1.7-1.01 2.72 1.02.08 2.05-.49 2.67-1.24z"/>
                  </svg>
                  <div className="text-left leading-none">
                    <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">Download on the</span>
                    <span className="block text-xs font-black tracking-tight text-slate-900 font-heading">App Store</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Version & Date text (matching screenshot) */}
            <div className="space-y-1 text-xs text-blue-100 font-mono">
              <p className="font-bold text-white text-xs">
                Version : <span className="text-amber-300 font-mono">V 3.2.0</span>
              </p>
              <p className="text-[11px] text-blue-200">
                Last Updated On : <span className="text-white font-semibold">30 September 2026</span>
              </p>
            </div>

            {/* Quick Links Menu Bar (About | FAQs | Help | Help Desk | Website Policy | Feedback) */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-blue-100 pt-1">
              <button
                onClick={() => setActiveModal('about')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                About
              </button>
              <span>|</span>
              <button
                onClick={() => setActiveModal('faqs')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                FAQs
              </button>
              <span>|</span>
              <button
                onClick={() => setActiveModal('help')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Help
              </button>
              <span>|</span>
              <button
                onClick={() => setActiveModal('helpdesk')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Help Desk
              </button>
              <span>|</span>
              <button
                onClick={() => setActiveModal('policy')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Website Policy
              </button>
              <span>|</span>
              <button
                onClick={() => setActiveModal('feedback')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Feedback
              </button>
            </div>

            {/* Developed & Maintained statement */}
            <div className="text-[11px] text-blue-200 leading-relaxed font-sans pt-1">
              Developed and maintained by <strong className="text-white">Team Tech_Tonic (SIH 2026)</strong> in collaboration with <strong className="text-white">C-DOT</strong>, <strong className="text-white">NDMA</strong> &amp; <strong className="text-white">IMD</strong>.
            </div>
          </div>

          {/* Right Column (5 cols): Visitor Counters + NDMA Contact Information */}
          <div className="lg:col-span-5 space-y-3 lg:pl-4 border-t lg:border-t-0 lg:border-l border-blue-400/30 pt-4 lg:pt-0">
            {/* Live Visitor Counters */}
            <div className="space-y-1.5 pb-2 border-b border-blue-400/20">
              <div className="flex items-center text-xs font-bold text-blue-100">
                <User className="w-3.5 h-3.5 text-amber-300 mr-1.5 shrink-0" />
                <span>Today's Visitor Count</span>
                {renderDigitBoxes(todayCount, 3)}
              </div>
              <div className="flex items-center text-xs font-bold text-blue-100">
                <Users className="w-3.5 h-3.5 text-amber-300 mr-1.5 shrink-0" />
                <span>Total Visitor Count</span>
                {renderDigitBoxes(totalCount, 6)}
              </div>
            </div>

            {/* Address and Contact Directory */}
            <div className="space-y-1.5 text-xs text-blue-100 font-sans leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                <span className="text-[11px]">
                  NDMA Bhawan A-1, Safdarjung Enclave New Delhi - 110029
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-[11px]">
                  Control Room: <a href="tel:+911126701728" className="hover:underline text-white font-mono font-bold">+91-11-26701728</a>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-[11px] font-mono">
                  E-mail: <span className="text-white font-bold">controlroom[at]ndma[dot]gov[dot]in</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-[11px] font-mono">
                  Fax: <span className="text-white">+91-11-26701729</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal System for Quick Links */}
      {activeModal && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-slate-900"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="font-heading font-black text-base uppercase tracking-wider text-[#18447e] dark:text-cyan-400">
                {activeModal === 'about' && 'About VARSHANET 2.0 & NDMA'}
                {activeModal === 'faqs' && 'Frequently Asked Questions (FAQs)'}
                {activeModal === 'help' && 'Disaster Relief & Portal Help'}
                {activeModal === 'helpdesk' && '24/7 National Emergency Help Desk'}
                {activeModal === 'policy' && 'Website & Privacy Policy'}
                {activeModal === 'feedback' && 'Citizen Feedback & Grievance'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs leading-relaxed space-y-3 text-slate-700 dark:text-slate-300">
              {activeModal === 'about' && (
                <>
                  <p>
                    <strong>VARSHANET 2.0</strong> is India's next-generation Multi-Source Disaster Intelligence Grid built for Smart India Hackathon (SIH 2026).
                  </p>
                  <p>
                    Integrating real-time Common Alerting Protocol (CAP) feeds from NDMA, radar nowcasting from IMD, social media crowdsourced telemetry, and edge NLP sentiment clustering to provide actionable disaster decisions.
                  </p>
                </>
              )}

              {activeModal === 'faqs' && (
                <div className="space-y-2">
                  <p><strong>Q: How are reports verified?</strong><br />A: Our multi-factor verification pipeline validates geotags, cross-references nearby weather sensors, and correlates citizen observations with NDMA telemetry.</p>
                  <p><strong>Q: What is the emergency hotline?</strong><br />A: Dial <strong>112</strong> nationwide for immediate police, fire, ambulance, and disaster rescue response.</p>
                </div>
              )}

              {activeModal === 'help' && (
                <>
                  <p>For instant disaster relief or medical emergencies, please use the floating red <strong>Dial 112</strong> button located on the right edge of your screen.</p>
                  <p>Citizens can submit ground observations via the <strong>Citizen Portal</strong> to notify regional response authorities.</p>
                </>
              )}

              {activeModal === 'helpdesk' && (
                <div className="space-y-2 font-mono">
                  <p>📍 NDMA Control Room: <strong>+91-11-26701728</strong></p>
                  <p>📞 National Disaster Helpline: <strong>1078</strong></p>
                  <p>✉️ Email: <strong>controlroom@ndma.gov.in</strong></p>
                  <p>⏱️ Operation: <strong>24 Hours x 365 Days</strong></p>
                </div>
              )}

              {activeModal === 'policy' && (
                <>
                  <p>This portal adheres to Open Government Data guidelines and the National Disaster Management Authority safety standards.</p>
                  <p>Crowdsourced submissions undergo automated anonymity sanitization to protect citizen privacy.</p>
                </>
              )}

              {activeModal === 'feedback' && (
                <div className="space-y-3">
                  <p>We welcome feedback to improve disaster early warning systems.</p>
                  <textarea
                    placeholder="Enter your feedback or observation..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-blue-600"
                  />
                  <button
                    onClick={() => {
                      alert('Thank you for your valuable feedback!');
                      setActiveModal(null);
                    }}
                    className="px-4 py-2 bg-[#18447e] text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
