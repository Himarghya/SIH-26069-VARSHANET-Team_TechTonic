import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Target, 
  AlertTriangle, 
  CloudRain, 
  Search, 
  Activity, 
  Sun, 
  Moon, 
  CloudLightning, 
  Compass, 
  ChevronRight, 
  Flame, 
  ShieldAlert,
  Wind,
  Droplets,
  Calendar,
  Clock,
  ArrowRight,
  List,
  Filter
} from 'lucide-react';
import { IndiaWeatherMap } from '../components/map/IndiaWeatherMap';
import { CapAlertDetailModal, OfficialCapAlert } from '../components/map/CapAlertDetailModal';
import { ForecastWeatherView } from '../components/map/ForecastWeatherView';
import { AllIndiaCapMapView } from '../components/map/AllIndiaCapMapView';
import { EventCluster, WeatherReport, ALL_INDIAN_STATES_UTS, INDIAN_STATE_COORDINATES } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MapPageProps {
  events: EventCluster[];
  reports: WeatherReport[];
  onSelectEvent: (event: EventCluster) => void;
  onSelectReport: (report: WeatherReport) => void;
}

// Recent Earthquakes (National Centre for Seismology - NCS Data)
const RECENT_EARTHQUAKES = [
  {
    magnitude: '4.4',
    location: 'Afghanistan (Tremors in J&K / Punjab)',
    date: '30 Sep 2026',
    time: '13:09:01',
    depth: '120 km',
    colorTheme: 'yellow',
  },
  {
    magnitude: '3.1',
    location: 'Hindu Kush Region, Afghanistan',
    date: '30 Sep 2026',
    time: '11:48:58',
    depth: '85 km',
    colorTheme: 'green',
  },
  {
    magnitude: '3.8',
    location: 'Chamoli, Uttarakhand',
    date: '30 Sep 2026',
    time: '08:22:15',
    depth: '10 km',
    colorTheme: 'yellow',
  }
];

// Official NDMA SACHET Common Alerting Protocol (CAP) Alerts
export const OFFICIAL_CAP_ALERTS: OfficialCapAlert[] = [
  {
    id: 'cap-uttarakhand-1',
    issuedBy: 'Govt. of Uttarakhand',
    state: 'Uttarakhand',
    event: 'Thunderstorm with Lightning',
    warningLevel: 'Low',
    warningColor: 'yellow',
    location: 'Nainital and Almora',
    validUpto: '30 Sep 2026 4:07 PM',
    issuedAt: '2026/09/30 13:07',
    lat: 29.3803,
    lon: 79.4636,
    radiusKm: 30,
    descriptionHi: '[2026/09/30 13:07] अगले 3 घंटो के दौरान, आपके क्षेत्र में, कहीं-कहीं गर्जन के साथ आकाशीय बिजली चमकने/वर्षा के तीव्र दौर होने की संभावना हैं।',
    descriptionEn: '[2026/09/30 13:07] During the next 3 hours, thunderstorm accompanied with lightning and intense spells of rainfall are likely at isolated places over your region.',
    dos: [
      { text: 'Stay Indoors.', icon: '🏠' },
      { text: 'Avoid natural lightning rods.', icon: '🌲' },
      { text: 'Stay away from large groups.', icon: '👥' }
    ],
    donts: [
      { text: 'Do not keep contact with electrical item.', icon: '🔌' },
      { text: 'Do not keep contact with metal surfaces.', icon: '🪟' },
      { text: 'Do not let animals out of control.', icon: '🐕' }
    ]
  },
  {
    id: 'cap-maharashtra-1',
    issuedBy: 'Govt. of Maharashtra',
    state: 'Maharashtra',
    event: 'Low Cloud to Ground Lightning',
    warningLevel: 'Low',
    warningColor: 'yellow',
    location: '7 districts of Maharashtra (Pune, Thane, Raigad, Nashik, Satara, Kolhapur, Ratnagiri)',
    validUpto: '30 Sep 2026 5:30 PM',
    issuedAt: '2026/09/30 13:15',
    lat: 19.0760,
    lon: 72.8777,
    radiusKm: 40,
    descriptionHi: '[2026/09/30 13:15] अगले 4 घंटों में मेघगर्जन एवं बिजली गिरने के साथ मध्यम वर्षा होने की संभावना है। खुले स्थानों में न जाएं।',
    descriptionEn: '[2026/09/30 13:15] Moderate rainfall accompanied by thunderstorm and cloud-to-ground lightning likely during next 4 hours. Stay in safe shelters.',
    dos: [
      { text: 'Unplug sensitive electronics.', icon: '🔌' },
      { text: 'Seek sturdy shelter immediately.', icon: '🏢' },
      { text: 'Keep emergency kit accessible.', icon: '🎒' }
    ],
    donts: [
      { text: 'Do not take shelter under isolated trees.', icon: '🌳' },
      { text: 'Do not use wired landline phones.', icon: '📞' },
      { text: 'Avoid water bodies and open grounds.', icon: '🏊' }
    ]
  },
  {
    id: 'cap-wb-1',
    issuedBy: 'Govt. of West Bengal',
    state: 'West Bengal',
    event: 'Light Thunderstorm with surface wind',
    warningLevel: 'Low',
    warningColor: 'yellow',
    location: 'South 24 Parganas, West Bengal',
    validUpto: '30 Sep 2026 6:00 PM',
    issuedAt: '2026/09/30 13:20',
    lat: 22.1352,
    lon: 88.5434,
    radiusKm: 35,
    descriptionHi: '[2026/09/30 13:20] सुंदरबन एवं तटीय क्षेत्रों में 30-40 किमी/घंटा की गति से तेज हवाओं और गरज के साथ हल्की बारिश का अनुमान।',
    descriptionEn: '[2026/09/30 13:20] Gusty surface winds (30-40 kmph) with light to moderate thunder showers likely over coastal delta areas.',
    dos: [
      { text: 'Secure loose roof sheets and banners.', icon: '🏠' },
      { text: 'Fishermen should heed coastal advisories.', icon: '⛵' },
      { text: 'Keep mobile phones fully charged.', icon: '📱' }
    ],
    donts: [
      { text: 'Do not venture into open sea/creeks.', icon: '🌊' },
      { text: 'Do not park vehicles under unstable trees.', icon: '🚗' },
      { text: 'Do not touch fallen electric wires.', icon: '⚡' }
    ]
  },
  {
    id: 'cap-bihar-1',
    issuedBy: 'CWC',
    state: 'Bihar',
    event: 'Flood',
    warningLevel: 'Low',
    warningColor: 'yellow',
    location: 'Ganga, Bhagalpur, Bhagalpur, Bihar',
    validUpto: '01 Oct 2026 8:00 AM',
    issuedAt: '2026/09/30 12:45',
    lat: 25.2425,
    lon: 86.9842,
    radiusKm: 35,
    descriptionHi: '[2026/09/30 12:45] भागलपुर में गंगा नदी का जलस्तर चेतावनी स्तर से 0.45 मीटर ऊपर प्रवाहित हो रहा है। निचले इलाकों में निगरानी तेज की गई।',
    descriptionEn: '[2026/09/30 12:45] River Ganga at Bhagalpur is flowing 0.45m above Warning Level with steady trend. Low-lying embankments on high alert.',
    dos: [
      { text: 'Move to designated higher relief camps.', icon: '🏕️' },
      { text: 'Keep drinking water in boiled/sealed cans.', icon: '💧' },
      { text: 'Preserve ID cards in waterproof bags.', icon: '📁' }
    ],
    donts: [
      { text: 'Do not cross submerged culverts or bridges.', icon: '🚫' },
      { text: 'Do not consume contaminated flood water.', icon: '🚰' },
      { text: 'Avoid approaching weakening river dykes.', icon: '🌊' }
    ]
  },
  {
    id: 'cap-bihar-2',
    issuedBy: 'CWC',
    state: 'Bihar',
    event: 'Flood',
    warningLevel: 'Low',
    warningColor: 'yellow',
    location: 'Ganga, Kahalgaon, Bhagalpur, Bihar',
    validUpto: '01 Oct 2026 10:00 AM',
    issuedAt: '2026/09/30 12:50',
    lat: 25.2630,
    lon: 87.2340,
    radiusKm: 30,
    descriptionHi: '[2026/09/30 12:50] कहलगांव में गंगा का जलस्तर चेतावनी निशान के करीब। नाव एवं राहत दलों को सतर्क किया गया।',
    descriptionEn: '[2026/09/30 12:50] River Ganga at Kahalgaon approaching Warning Stage. SDRF motorized boats stationed at ghats.',
    dos: [
      { text: 'Listen to district disaster announcements.', icon: '📢' },
      { text: 'Stock essential medications and baby food.', icon: '💊' },
      { text: 'Assist elderly and disabled neighbors.', icon: '🤝' }
    ],
    donts: [
      { text: 'Do not allow children near flood banks.', icon: '🚸' },
      { text: 'Do not spread unverified water-level rumors.', icon: '📵' },
      { text: 'Do not drive vehicles through floodwaters.', icon: '🚙' }
    ]
  },
  {
    id: 'cap-up-1',
    issuedBy: 'Govt. of Uttar Pradesh',
    state: 'Uttar Pradesh',
    event: 'Flood',
    warningLevel: 'Moderate',
    warningColor: 'orange',
    location: 'Ganga, Dabri, Shahjahanpur, Uttar Pradesh',
    validUpto: '01 Oct 2026 12:00 PM',
    issuedAt: '2026/09/30 11:30',
    lat: 27.8805,
    lon: 79.9120,
    radiusKm: 35,
    descriptionHi: '[2026/09/30 11:30] शाहजहांपुर दाबरी क्षेत्र में गंगा का जलस्तर खतरे के निशान के निकट। 12 गांवों में सतर्कता अलर्ट जारी।',
    descriptionEn: '[2026/09/30 11:30] Severe flood alert for Shahjahanpur Dabri corridor. River Ganga nearing danger mark. 12 villages placed on evacuation standby.',
    dos: [
      { text: 'Evacuate immediately if advised by NDRF.', icon: '🏃' },
      { text: 'Disconnect main electrical power switches.', icon: '⚡' },
      { text: 'Untie cattle and move to high ground shelters.', icon: '🐄' }
    ],
    donts: [
      { text: 'Do not stay in dilapidated kachha houses.', icon: '🏚️' },
      { text: 'Do not enter swift water currents.', icon: '🏊' },
      { text: 'Avoid using elevators or basements.', icon: '🏢' }
    ]
  },
  {
    id: 'cap-up-2',
    issuedBy: 'Govt. of Uttar Pradesh',
    state: 'Uttar Pradesh',
    event: 'Flood',
    warningLevel: 'Low',
    warningColor: 'yellow',
    location: 'Ganga, Fatehgarh, Farrukhabad, Uttar Pradesh',
    validUpto: '01 Oct 2026 2:00 PM',
    issuedAt: '2026/09/30 11:45',
    lat: 27.3688,
    lon: 79.6247,
    radiusKm: 25,
    descriptionHi: '[2026/09/30 11:45] फर्रुखाबाद फतेहगढ़ में गंगा का जलस्तर चेतावनी स्तर पर स्थिर। तटवर्ती क्षेत्रों में गश्त जारी।',
    descriptionEn: '[2026/09/30 11:45] Water level at Fatehgarh Farrukhabad steady at warning mark. Constant 24x7 monitoring deployed.',
    dos: [
      { text: 'Keep torches and dry battery cells ready.', icon: '🔦' },
      { text: 'Follow official updates on SACHET / VARSHANET.', icon: '📱' },
      { text: 'Store dry food rations.', icon: '🍞' }
    ],
    donts: [
      { text: 'Do not walk along crumbling river bunds.', icon: '⚠️' },
      { text: 'Do not operate damaged electrical motors.', icon: '⚙️' },
      { text: 'Avoid night travel in submerged roads.', icon: '🌙' }
    ]
  },
  {
    id: 'cap-odisha-1',
    issuedBy: 'IMD Cyclone Warning Centre',
    state: 'Odisha',
    event: 'Cyclonic Storm Advisory',
    warningLevel: 'Moderate',
    warningColor: 'orange',
    location: 'Puri, Jagatsinghpur, Kendrapara, Ganjam',
    validUpto: '01 Oct 2026 6:00 PM',
    issuedAt: '2026/09/30 12:00',
    lat: 19.8135,
    lon: 85.8312,
    radiusKm: 50,
    descriptionHi: '[2026/09/30 12:00] बंगाल की खाड़ी में चक्रवात के प्रभाव से ओडिशा तट पर 80-90 किमी/घंटे की रफ्तार से आंधी और भारी वर्षा की चेतावनी।',
    descriptionEn: '[2026/09/30 12:00] Squally winds speed reaching 80-90 kmph gusting to 100 kmph and heavy to very heavy rainfall along Odisha coast.',
    dos: [
      { text: 'Move to Pucca Cyclone Shelters.', icon: '🏢' },
      { text: 'Board up glass windows and secure roofs.', icon: '🔨' },
      { text: 'Keep first-aid kit and emergency cash.', icon: '🩺' }
    ],
    donts: [
      { text: 'Do not venture into the sea under any circumstance.', icon: '⛵' },
      { text: 'Do not stand near loose electric poles.', icon: '⚡' },
      { text: 'Do not leave shelters until all clear is announced.', icon: '🛑' }
    ]
  }
];

// Helper to generate dynamic Do's & Don'ts based on event type
const getDosAndDontsForEvent = (eventType: string) => {
  const ev = (eventType || '').toLowerCase();
  if (ev.includes('flood') || ev.includes('inundat') || ev.includes('waterlog')) {
    return {
      dos: [
        { text: 'Move immediately to designated higher relief camps.', icon: '🏕️' },
        { text: 'Store drinking water in clean sealed containers.', icon: '💧' },
        { text: 'Preserve ID cards and medicine in waterproof pouches.', icon: '📁' }
      ],
      donts: [
        { text: 'Do not cross submerged roads, culverts, or bridges.', icon: '🚫' },
        { text: 'Do not consume contaminated flood water.', icon: '🚰' },
        { text: 'Avoid approaching weakening river dykes or bunds.', icon: '🌊' }
      ]
    };
  }
  if (ev.includes('lightning') || ev.includes('thunder')) {
    return {
      dos: [
        { text: 'Stay indoors inside a sturdy building.', icon: '🏠' },
        { text: 'Unplug sensitive electrical devices.', icon: '🔌' },
        { text: 'Stay away from open windows and metal fixtures.', icon: '🪟' }
      ],
      donts: [
        { text: 'Do not take shelter under tall or isolated trees.', icon: '🌲' },
        { text: 'Do not use corded landline phones during storm.', icon: '📞' },
        { text: 'Avoid open bodies of water and metal fencing.', icon: '🏊' }
      ]
    };
  }
  if (ev.includes('cyclon') || ev.includes('wind') || ev.includes('storm')) {
    return {
      dos: [
        { text: 'Secure loose roof sheets, solar panels, and banners.', icon: '🏠' },
        { text: 'Fishermen should heed coastal advisories strictly.', icon: '⛵' },
        { text: 'Keep mobile phones and emergency torches fully charged.', icon: '🔦' }
      ],
      donts: [
        { text: 'Do not venture outside during the eye of the storm.', icon: '🛑' },
        { text: 'Do not touch fallen electric wires or poles.', icon: '⚡' },
        { text: 'Avoid parking vehicles under trees.', icon: '🚗' }
      ]
    };
  }
  return {
    dos: [
      { text: 'Follow official updates on SACHET & VARSHANET.', icon: '📱' },
      { text: 'Keep emergency 112 helpline accessible.', icon: '🚨' },
      { text: 'Assist vulnerable elders and children.', icon: '🤝' }
    ],
    donts: [
      { text: 'Do not spread unverified rumors on social media.', icon: '📵' },
      { text: 'Do not ignore official disaster alerts.', icon: '⚠️' },
      { text: 'Avoid unnecessary travel during peak warning hours.', icon: '🚗' }
    ]
  };
};

// Convert live WeatherReport to full OfficialCapAlert format
export const convertReportToCapAlert = (report: WeatherReport): OfficialCapAlert => {
  const safety = getDosAndDontsForEvent(report.event_type || report.text);
  const locationParts = [report.city, report.district, report.state].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : (report.state || 'Pan India');

  const isCritical = report.risk_level === 'CRITICAL';
  const isHigh = report.risk_level === 'HIGH';
  const isMod = report.risk_level === 'MODERATE';

  const warningColor: 'yellow' | 'orange' | 'red' = isCritical ? 'red' : (isHigh || isMod) ? 'orange' : 'yellow';
  const warningLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical' = isCritical ? 'Critical' : isHigh ? 'Severe' : isMod ? 'Moderate' : 'Low';

  let eventTitle = (report.event_type || '').trim().toUpperCase();
  if (!eventTitle || eventTitle === 'WEATHER' || eventTitle === 'OTHER') {
    eventTitle = isCritical ? 'SEVERE FLOOD & CYCLONIC WARNING' : isHigh ? 'HEAVY RAINFALL & THUNDERSTORM' : 'WEATHER ADVISORY';
  } else if (eventTitle === 'RAIN' || eventTitle === 'HEAVY_RAIN') {
    eventTitle = isHigh || isCritical ? 'HEAVY RAINFALL WARNING' : 'LIGHT TO MODERATE RAIN';
  } else if (eventTitle === 'LIGHTNING' || eventTitle === 'THUNDER') {
    eventTitle = 'THUNDERSTORM WITH LIGHTNING';
  } else if (eventTitle === 'FLOOD' || eventTitle === 'INUNDATION') {
    eventTitle = 'FLOOD';
  } else if (eventTitle === 'CYCLONE') {
    eventTitle = 'CYCLONIC STORM ADVISORY';
  }

  // Format valid timestamp
  const dateObj = report.timestamp ? new Date(report.timestamp) : new Date();
  const validDate = new Date(dateObj.getTime() + 4 * 3600 * 1000);
  const validUptoStr = `${validDate.getDate()} ${validDate.toLocaleString('en-US', { month: 'short' })} ${validDate.getFullYear()} ${validDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

  const issuer = report.source_name || (
    report.source_type === 'government_open_data' ? 'IMD / CWC' :
    report.source_type === 'rss_news' ? 'State Disaster Management Authority' :
    report.source_type === 'citizen_report' ? 'Citizen Verified Spotter' :
    `Govt. of ${report.state || 'India'}`
  );

  return {
    id: `report-cap-${report.id}`,
    issuedBy: issuer,
    state: report.state || 'National',
    event: eventTitle,
    warningLevel,
    warningColor,
    location: locationStr,
    validUpto: validUptoStr,
    issuedAt: dateObj.toLocaleString(),
    lat: report.latitude || 20.5937,
    lon: report.longitude || 78.9629,
    radiusKm: isCritical ? 45 : isHigh ? 35 : 25,
    descriptionHi: `[${report.state || 'क्षेत्र'}] ${report.normalized_text || report.text || 'मौसम चेतावनी जारी। सतर्क रहें एवं आपदा प्रबंधन दिशा-निर्देशों का पालन करें।'}`,
    descriptionEn: report.text || report.normalized_text || `Official alert issued for ${locationStr}. Stay indoors and follow safety instructions.`,
    dos: safety.dos,
    donts: safety.donts
  };
};

export const MapPage: React.FC<MapPageProps> = ({
  events = [],
  reports = [],
  onSelectEvent,
  onSelectReport
}) => {
  const { t } = useLanguage();
  const [activeTabMode, setActiveTabMode] = useState<'CURRENT' | 'ALL' | 'STATE' | 'FORECAST'>('ALL');
  const [locationSubTab, setLocationSubTab] = useState<'STATE' | 'LOCATION'>('STATE');
  const [selectedPanState, setSelectedPanState] = useState<string>('PAN INDIA');
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');
  const [searchCity, setSearchCity] = useState('Chakdehi');
  const [selectedCapAlertForModal, setSelectedCapAlertForModal] = useState<OfficialCapAlert | null>(null);

  // Dynamically merge all live WeatherReport items with official CAP seed alerts
  const allCapAlerts = useMemo<OfficialCapAlert[]>(() => {
    const baseAlerts = [...OFFICIAL_CAP_ALERTS];
    const convertedReports = (reports || []).map(convertReportToCapAlert);

    const combined: OfficialCapAlert[] = [...baseAlerts];
    const existingLocations = new Set(baseAlerts.map(a => a.location.toLowerCase().trim()));

    convertedReports.forEach(repAlert => {
      if (!existingLocations.has(repAlert.location.toLowerCase().trim())) {
        combined.push(repAlert);
        existingLocations.add(repAlert.location.toLowerCase().trim());
      }
    });

    return combined;
  }, [reports]);

  // Filtered CAP Alerts for the Table in STATE mode
  const filteredTableAlerts = useMemo(() => {
    return allCapAlerts.filter(alert => {
      // 1. State Filter
      const matchesState = 
        selectedPanState === 'PAN INDIA' || 
        selectedPanState === 'All' || 
        alert.state.toLowerCase() === selectedPanState.toLowerCase();

      // 2. Search query filter (for Location Wise sub-tab)
      const matchesSearch = 
        !searchLocationQuery.trim() ||
        alert.location.toLowerCase().includes(searchLocationQuery.toLowerCase()) ||
        alert.state.toLowerCase().includes(searchLocationQuery.toLowerCase()) ||
        alert.event.toLowerCase().includes(searchLocationQuery.toLowerCase());

      return matchesState && matchesSearch;
    });
  }, [allCapAlerts, selectedPanState, searchLocationQuery]);

  const handleOpenAlertModal = (alertItem: OfficialCapAlert) => {
    setSelectedCapAlertForModal(alertItem);
  };

  const handleAlertFromListClick = (alertItem: any) => {
    const fullCap = OFFICIAL_CAP_ALERTS.find(a => a.id === alertItem.id || a.location.toLowerCase().includes(alertItem.location.toLowerCase()));
    if (fullCap) {
      setSelectedCapAlertForModal(fullCap);
    } else if (alertItem.rawReport && onSelectReport) {
      onSelectReport(alertItem.rawReport);
    } else if (events.length > 0) {
      const match = events.find(e => 
        e.city?.toLowerCase().includes(alertItem.location.toLowerCase()) ||
        alertItem.location.toLowerCase().includes(e.city?.toLowerCase() || '')
      );
      if (match && onSelectEvent) {
        onSelectEvent(match);
      }
    }
  };

  return (
    <div className="space-y-4 font-sans select-none animate-fade-in pr-0 lg:pr-10 xl:pr-12">
      
      {/* 1. Top 4 Action / Filter Cards (Matching Screenshot media_1790758072081.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: CURRENT LOCATION CAP ALERT */}
        <button
          onClick={() => {
            setActiveTabMode('CURRENT');
            navigator.geolocation?.getCurrentPosition(
              (pos) => {
                alert(`GPS Location detected: [${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}]. Filtering nearby local CAP alerts.`);
              },
              () => {
                alert('GPS location permission is required. Showing default regional alerts.');
              }
            );
          }}
          className={`p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group ${
            activeTabMode === 'CURRENT'
              ? 'border-2 border-[#18447e] dark:border-cyan-400 bg-white dark:bg-slate-900 shadow-md shadow-blue-900/15 ring-2 ring-[#18447e]/20 scale-[1.015]'
              : 'border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-[#18447e]/60 hover:shadow-sm shadow-xs'
          }`}
        >
          <div className="w-11 h-11 rounded-full border-2 border-red-500 bg-white dark:bg-slate-950 flex items-center justify-center text-red-600 mb-2 shadow-xs group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5 fill-red-500 text-white" />
          </div>
          <span className={`text-[12px] font-black tracking-wider uppercase font-heading ${
            activeTabMode === 'CURRENT' ? 'text-[#18447e] dark:text-cyan-400 font-extrabold' : 'text-slate-900 dark:text-slate-100 font-extrabold'
          }`}>
            CURRENT LOCATION CAP ALERT
          </span>
        </button>

        {/* Card 2: ALL INDIA CAP ALERT (Matching Screenshot Active State) */}
        <button
          onClick={() => {
            setActiveTabMode('ALL');
            setSelectedPanState('PAN INDIA');
          }}
          className={`p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group ${
            activeTabMode === 'ALL'
              ? 'border-2 border-[#18447e] dark:border-cyan-400 bg-white dark:bg-slate-900 shadow-md shadow-blue-900/15 ring-2 ring-[#18447e]/20 scale-[1.015]'
              : 'border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-[#18447e]/60 hover:shadow-sm shadow-xs'
          }`}
        >
          <div className="w-11 h-11 rounded-full border-2 border-blue-900 dark:border-blue-400 bg-white dark:bg-slate-950 flex items-center justify-center text-blue-900 dark:text-blue-300 mb-2 shadow-xs group-hover:scale-110 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <span className={`text-[12px] font-black tracking-wider uppercase font-heading ${
            activeTabMode === 'ALL' ? 'text-[#18447e] dark:text-cyan-400 font-extrabold' : 'text-slate-900 dark:text-slate-100 font-extrabold'
          }`}>
            ALL INDIA CAP ALERT
          </span>
        </button>

        {/* Card 3: STATE WISE CAP ALERT (Matching Screenshot Active State) */}
        <button
          onClick={() => {
            setActiveTabMode('STATE');
          }}
          className={`p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group ${
            activeTabMode === 'STATE'
              ? 'border-2 border-[#18447e] dark:border-cyan-400 bg-white dark:bg-slate-900 shadow-md shadow-blue-900/15 ring-2 ring-[#18447e]/20 scale-[1.015]'
              : 'border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-[#18447e]/60 hover:shadow-sm shadow-xs'
          }`}
        >
          <div className="w-11 h-11 rounded-full border-2 border-amber-500 bg-white dark:bg-slate-950 flex items-center justify-center text-amber-500 mb-2 shadow-xs group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className={`text-[12px] font-black tracking-wider uppercase font-heading ${
            activeTabMode === 'STATE' ? 'text-[#18447e] dark:text-cyan-400 font-extrabold' : 'text-slate-900 dark:text-slate-100 font-extrabold'
          }`}>
            STATE WISE CAP ALERT
          </span>
        </button>

        {/* Card 4: FORECAST (Matching Screenshot Active State) */}
        <button
          onClick={() => setActiveTabMode('FORECAST')}
          className={`p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group ${
            activeTabMode === 'FORECAST'
              ? 'border-2 border-[#18447e] dark:border-cyan-400 bg-white dark:bg-slate-900 shadow-md shadow-blue-900/15 ring-2 ring-[#18447e]/20 scale-[1.015]'
              : 'border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-[#18447e]/60 hover:shadow-sm shadow-xs'
          }`}
        >
          <div className="w-11 h-11 rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-950 flex items-center justify-center text-emerald-600 mb-2 shadow-xs group-hover:scale-110 transition-transform">
            <CloudRain className="w-5 h-5" />
          </div>
          <span className={`text-[12px] font-black tracking-wider uppercase font-heading ${
            activeTabMode === 'FORECAST' ? 'text-[#18447e] dark:text-cyan-400 font-extrabold' : 'text-slate-900 dark:text-slate-100 font-extrabold'
          }`}>
            FORECAST
          </span>
        </button>
      </div>

      {/* 2. Transition Feedback Breadcrumb Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#18447e]/10 via-[#18447e]/5 to-transparent dark:from-cyan-950/40 dark:via-slate-900 dark:to-transparent rounded-lg border border-[#18447e]/20 dark:border-cyan-800/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Active View:</span>
          <span className="font-black text-[#18447e] dark:text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
            {activeTabMode === 'CURRENT' && '📍 Current Location Live CAP Early Warnings'}
            {activeTabMode === 'ALL' && '🎯 All India Pan-National Integrated CAP Alert Map & Live Feed'}
            {activeTabMode === 'STATE' && '⚠️ State-Wise & Location-Specific CAP Hazard Matrix'}
            {activeTabMode === 'FORECAST' && '🌧️ Synoptic Forecast, Nowcasting & Multiday Meteorology'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Realtime Stream Active</span>
        </div>
      </div>

      {/* 3. CONDITIONAL VIEW: If STATE mode is active -> Show LOCATION SPECIFIC ALERTS Table (Screenshot 1) */}
      {activeTabMode === 'STATE' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
          
          {/* Blue Header: LOCATION SPECIFIC ALERTS (Screenshot 1) */}
          <div className="bg-[#1e5aa8] dark:bg-[#18447e] text-white py-3.5 px-4 text-center font-black text-base sm:text-lg uppercase tracking-wider font-heading shadow-md">
            LOCATION SPECIFIC ALERTS
          </div>

          {/* Sub-Tabs: State Wise vs Location Wise */}
          <div className="flex items-center justify-center border-b border-slate-200 dark:border-slate-800 text-sm font-bold">
            <button
              onClick={() => setLocationSubTab('STATE')}
              className={`flex-1 py-3 px-4 text-center transition-all cursor-pointer ${
                locationSubTab === 'STATE'
                  ? 'text-purple-700 dark:text-purple-400 border-b-2 border-purple-600 bg-purple-50/30 dark:bg-purple-950/20 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              State Wise
            </button>
            <button
              onClick={() => setLocationSubTab('LOCATION')}
              className={`flex-1 py-3 px-4 text-center transition-all cursor-pointer ${
                locationSubTab === 'LOCATION'
                  ? 'text-purple-700 dark:text-purple-400 border-b-2 border-purple-600 bg-purple-50/30 dark:bg-purple-950/20 font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Location Wise
            </button>
          </div>

          {/* Filters Row: State Selector & Search Box */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                value={selectedPanState}
                onChange={(e) => setSelectedPanState(e.target.value)}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-blue-600 dark:border-blue-500 rounded-md px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm cursor-pointer min-w-[150px]"
              >
                <option value="PAN INDIA">PAN INDIA</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Bihar">Bihar</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Odisha">Odisha</option>
                <option value="Assam">Assam</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>

              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                Showing {filteredTableAlerts.length} Official CAP Bulletins
              </span>
            </div>

            {locationSubTab === 'LOCATION' && (
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLocationQuery}
                  onChange={(e) => setSearchLocationQuery(e.target.value)}
                  placeholder="Filter district or city..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          {/* Table Container (Matching Screenshot 1) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-black text-xs uppercase tracking-wider bg-slate-50 dark:bg-slate-950/60">
                  <th className="py-3 px-4">Issued By</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4 text-center">Warning Type</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredTableAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">
                      No active CAP alerts found for this state filter.
                    </td>
                  </tr>
                ) : (
                  filteredTableAlerts.map((alertItem) => (
                    <tr 
                      key={alertItem.id}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenAlertModal(alertItem)}
                    >
                      {/* Issued By */}
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                        {alertItem.issuedBy}
                      </td>

                      {/* State */}
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-bold">
                        {alertItem.state}
                      </td>

                      {/* Event */}
                      <td className="py-3.5 px-4 text-slate-900 dark:text-white font-bold">
                        {alertItem.event}
                      </td>

                      {/* Warning Type Bar (Colored bar with Low/Moderate text underneath) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <div
                            className={`h-3.5 w-28 sm:w-32 rounded-xs shadow-xs ${
                              alertItem.warningColor === 'yellow'
                                ? 'bg-[#ffff00]'
                                : alertItem.warningColor === 'orange'
                                ? 'bg-[#ff9800]'
                                : 'bg-[#f44336]'
                            }`}
                          />
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {alertItem.warningLevel}
                          </span>
                        </div>
                      </td>

                      {/* Action Button: ->= (Clicking opens Detail Modal Screenshot 2) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAlertModal(alertItem);
                          }}
                          className="px-3.5 py-1.5 rounded bg-[#1e70bf] hover:bg-[#155a9e] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 mx-auto transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          title="View complete CAP warning details & actionable safety steps"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          <List className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      ) : activeTabMode === 'FORECAST' ? (
        /* 3. FORECAST VIEW (Matching Screenshot) */
        <ForecastWeatherView />
      ) : (
        /* 4. ALL INDIA CAP ALERT & CURRENT LOCATION VIEW (Matching Screenshot 2-Column Map + Alert List) */
        <AllIndiaCapMapView
          alerts={allCapAlerts}
          onSelectAlert={handleOpenAlertModal}
        />
      )}

      {/* 5. Interactive CAP Alert Detail Action Modal (Matching Screenshot 2) */}
      {selectedCapAlertForModal && (
        <CapAlertDetailModal
          alert={selectedCapAlertForModal}
          onClose={() => setSelectedCapAlertForModal(null)}
        />
      )}

    </div>
  );
};