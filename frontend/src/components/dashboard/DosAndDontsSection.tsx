import React, { useState, useMemo } from 'react';
import { Search, Play, X, ShieldAlert, CheckCircle2, AlertTriangle, BookOpen, Video, Globe, Sparkles } from 'lucide-react';

export type DisasterCategory = 
  | 'Cyclones'
  | 'Floods'
  | 'Urban Floods'
  | 'Lightning'
  | 'Heat Waves'
  | 'Cold Wave'
  | 'Earthquakes'
  | 'Tsunamis'
  | 'Avalanches'
  | 'Landslides'
  | 'Cloudbursts';

export type LanguageCode = 
  | 'English'
  | 'हिन्दी'
  | 'বাংলা'
  | 'ગુજરાતી'
  | 'ಕನ್ನಡ'
  | 'മലയാളം'
  | 'मराठी'
  | 'ଓଡ଼ିଆ'
  | 'ਪੰਜਾਬੀ'
  | 'தமிழ்'
  | 'తెలుగు'
  | 'অসমীয়া';

interface DosDontsData {
  title: string;
  before: string[];
  duringAfter: string[];
  videos: {
    title: string;
    duration: string;
    youtubeId: string;
    thumbnailUrl: string;
  }[];
}

const DISASTER_CONTENT: Record<DisasterCategory, Record<string, DosDontsData>> = {
  'Cyclones': {
    'English': {
      title: 'CYCLONE',
      before: [
        'Ignore rumours, Stay calm, Don\'t panic.',
        'Keep your mobile phones fully charged for emergency communication; use SMS.',
        'Listen to radio, watch TV, read meteorological bulletins for weather updates.',
        'Keep your documents and valuables in water-proof containers or high shelves.',
        'Prepare an emergency survival kit with non-perishable food, water, torch, first aid, and medicines.',
        'Secure your house, especially the roof; carry out repairs; don\'t leave sharp objects loose outside.'
      ],
      duringAfter: [
        'Keep cattle and animals untied to ensure their safety and survival.',
        'In case of a storm surge/tide warning, know your nearest safe high ground or shelter and the safest access route.',
        'Store adequate ready-to-eat food and clean drinking water to last at least a week.',
        'Conduct mock drills for your family and local community.',
        'Trim treetops and overhanging branches near your house with permission from local authorities.',
        'Close doors and windows securely. Stay indoors until the all-clear is officially sounded.',
        'Evacuate immediately to designated relief shelters when directed by NDMA/SDMA officials.'
      ],
      videos: [
        {
          title: '#Cyclone | What To Do Before & During A Cyclone',
          duration: '3:45',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cyclone | Safety Measures & Evacuation Protocols',
          duration: '4:20',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cyclone | Secure Your Home & Emergency Kit Preparation',
          duration: '2:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cyclone | Community Resilience & Post-Disaster Safety',
          duration: '5:10',
          youtubeId: 'kJQP7kiw5Fk',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'हिन्दी': {
      title: 'चक्रवात (CYCLONE)',
      before: [
        'अफवाहों पर ध्यान न दें, शांत रहें और घबराएं नहीं।',
        'आपातकालीन संचार के लिए अपने मोबाइल फोन पूरी तरह से चार्ज रखें; एसएमएस का उपयोग करें।',
        'मौसम की ताजा जानकारी के लिए रेडियो सुनें और टीवी या समाचार बुलेटिन देखें।',
        'महत्वपूर्ण दस्तावेज और कीमती सामान वाटरप्रूफ बैग में रखें।',
        'सूखा भोजन, पीने का पानी, टॉर्च, प्राथमिक चिकित्सा किट और दवाएं तैयार रखें।',
        'घर की छतों और खिड़कियों की मरम्मत कर सुरक्षित करें; बाहर नुकीली वस्तुएं खुली न छोड़ें।'
      ],
      duringAfter: [
        'पशुओं को खूंटे से खोल दें ताकि वे सुरक्षित स्थान पर जा सकें।',
        'तूफानी लहर या बाढ़ की चेतावनी पर तुरंत निकटतम ऊंचे सुरक्षित स्थान या आश्रय स्थल जाएं।',
        'कम से कम एक सप्ताह के लिए पर्याप्त सूखा भोजन और पीने का साफ पानी जमा रखें।',
        'घर के आसपास के पेड़ों की सूखी टहनियों की समय पर छंटाई करें।',
        'दरवाजे और खिड़कियां कसकर बंद रखें। चक्रवात की आंख गुजरने पर भी बाहर न निकलें।',
        'प्रशासन द्वारा निर्देश मिलते ही तुरंत सुरक्षित राहत शिविरों में जाएं।'
      ],
      videos: [
        {
          title: '#चक्रवात | चक्रवात से पहले और दौरान क्या करें',
          duration: '3:45',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#चक्रवात | सुरक्षा उपाय और बचाव प्रोटोकॉल',
          duration: '4:20',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#चक्रवात | आपातकालीन किट और घर की सुरक्षा',
          duration: '2:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#चक्रवात | आपदा के बाद की सावधानियां',
          duration: '5:10',
          youtubeId: 'kJQP7kiw5Fk',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'ঘূর্ণিঝড় (CYCLONE)',
      before: [
        'গুজবে কান দেবেন না, শান্ত থাকুন ও আতঙ্কিত হবেন না।',
        'জরুরি যোগাযোগের জন্য মোবাইল ফোন ফুল চার্জ রাখুন; এসএমএস ব্যবহার করুন।',
        'রেডিও, টিভি ও সরকারি ওয়েবসাইটে আবহাওয়ার সতর্কবার্তা শুনুন।',
        'জরুরি নথি ও মূল্যবান জিনিসপত্র ওয়াটারপ্রুফ ব্যাগে নিরাপদে রাখুন।',
        'শুকনো খাবার, পানীয় জল, ফার্স্ট এইড কিট, টর্চ ও দরকারি ওষুধ প্রস্তুত রাখুন।',
        'ঘরের ছাদ ও জানলা মেরামত করে শক্ত করুন; বাইরে খোলা জিনিস বাঁধবেন।'
      ],
      duringAfter: [
        'গবাদি পশুকে দড়ি খুলে মুক্ত করে দিন যাতে তারা নিরাপদ আশ্রয়ে যেতে পারে।',
        'জলোচ্ছ্বাস বা প্লাবনের সতর্কবার্তা পেলে অবিলম্বে উঁচু আশ্রয়কেন্দ্রে পৌঁছান।',
        'অন্তত এক সপ্তাহের জন্য পর্যাপ্ত শুকনো খাবার ও বিশুদ্ধ জল মজুত রাখুন।',
        'ঝড়ের সময় ঘরের জানলা ও দরজা শক্ত করে বন্ধ রাখুন এবং ঘরের ভেতরেই থাকুন।',
        'প্রশাসনের নির্দেশ পাওয়ামাত্র দ্রুত নিকটবর্তী সাইক্লোন শেল্টারে চলে যান।'
      ],
      videos: [
        {
          title: '#Cyclone | ঘূর্ণিঝড়ের সময় জরুরি নির্দেশিকা',
          duration: '3:45',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cyclone | সাইক্লোন আশ্রয়কেন্দ্র ও সুরক্ষা বিধি',
          duration: '4:20',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cyclone | জরুরি কিট ও পারিবারিক প্রস্তুতি',
          duration: '2:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cyclone | পুনর্বাসন ও বিদ্যুৎ সুরক্ষা নির্দেশিকা',
          duration: '5:10',
          youtubeId: 'kJQP7kiw5Fk',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Floods': {
    'English': {
      title: 'RIVERINE FLOODS',
      before: [
        'Know the flood-risk history of your locality and designated evacuation routes.',
        'Keep drains and gullies around your house clear of debris and plastic waste.',
        'Elevate electric appliances, gas cylinders, and valuables above expected flood levels.',
        'Keep an emergency survival grab-bag ready with drinking water, dry rations, and ID cards.',
        'Charge mobile phones and power banks; keep battery-operated radios handy.'
      ],
      duringAfter: [
        'Do not walk, swim, or drive through flowing floodwaters — 6 inches of moving water can knock you down.',
        'Stay away from electric poles, fallen wires, and submerged transformer boxes.',
        'Drink only boiled or chlorinated water to prevent water-borne epidemics.',
        'Do not consume food that has come into contact with floodwaters.',
        'Cooperate with NDRF, SDRF, and district administration during evacuation.'
      ],
      videos: [
        {
          title: '#Floods | Safety Precautions Before and During Floods',
          duration: '4:15',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Floods | Do Not Drive Through Flooded Roads (Turn Around Don\'t Drown)',
          duration: '2:30',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Floods | Post-Flood Hygiene & Water Purification Guidelines',
          duration: '3:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Floods | Livestock & Asset Protection in Low-Lying Basins',
          duration: '4:40',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Urban Floods': {
    'English': {
      title: 'URBAN FLOODING & WATERLOGGING',
      before: [
        'Avoid paving entire compound floors; maintain natural soil percolation areas.',
        'Check municipal drainage updates and avoid underpasses during heavy rain alerts.',
        'Ensure basement pumps and backflow preventer valves are fully operational.',
        'Do not park vehicles in underground basements or low-lying road depressions during alerts.'
      ],
      duringAfter: [
        'Avoid flooded subways, underpasses, and basement parkings.',
        'Watch out for open manholes and storm drains hidden beneath floodwater.',
        'Disconnect electrical mains if water enters your premises.',
        'Use designated elevated arterial corridors announced by Traffic Police & SDMA.'
      ],
      videos: [
        {
          title: '#UrbanFloods | Navigating Cities During Monsoon Inundations',
          duration: '3:10',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#UrbanFloods | Electrical & Manhole Hazards in Metro Flooding',
          duration: '2:45',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#UrbanFloods | Basement Water Management & Pump Protocols',
          duration: '4:00',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#UrbanFloods | Rainwater Harvesting & Urban Infiltration Systems',
          duration: '5:20',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Lightning': {
    'English': {
      title: 'LIGHTNING & THUNDERSTORM',
      before: [
        'Follow DAMINI and VARSHANET lightning nowcasts before venturing outdoors.',
        'Install surge protectors and lightning arresters on high buildings.',
        'Unplug sensitive electrical appliances before thunderstorm arrival.'
      ],
      duringAfter: [
        'Remember the 30-30 Rule: If time between flash and thunder is < 30s, take shelter immediately.',
        'NEVER take shelter under isolated tall trees or tin sheds in open fields.',
        'If caught in the open, assume the Lightning Crouch: crouch low on balls of feet with ears covered.',
        'Stay away from water bodies, metal fences, tractors, and bicycles.',
        'Administer CPR immediately to lightning victims; they carry no electrical charge.'
      ],
      videos: [
        {
          title: '#Lightning | The 30-30 Rule & Lightning Crouch Technique',
          duration: '3:20',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Lightning | Rural Farmer Safety & Agricultural Precautions',
          duration: '4:10',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Lightning | First Aid & CPR for Lightning Strike Victims',
          duration: '3:40',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Lightning | Building Surge Arresters & Home Protection',
          duration: '5:00',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Heat Waves': {
    'English': {
      title: 'HEAT WAVE & SUNSTROKE',
      before: [
        'Check IMD temperature forecasts and heat wave alerts for your district.',
        'Keep ORS, homemade drinks (Lassi, Torani, Lemon water, Aam Panna) ready.',
        'Install shades, curtains, or reflective insulation on sunny window exposures.'
      ],
      duringAfter: [
        'Avoid going out in direct sun between 12:00 PM and 3:30 PM.',
        'Drink plenty of water frequently, even if you do not feel thirsty.',
        'Wear lightweight, loose-fitting, light-colored cotton clothes and use hats/umbrellas.',
        'Never leave children or pets inside parked vehicles.',
        'In case of heat exhaustion, move person to shade, apply cold wet towels, and give ORS.'
      ],
      videos: [
        {
          title: '#HeatWave | Preventing Sunstroke & Heat Exhaustion in Summer',
          duration: '3:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#HeatWave | Traditional Hydration Drinks & Work Precautions',
          duration: '4:05',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#HeatWave | First Aid Protocol for Severe Heatstroke',
          duration: '2:55',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#HeatWave | Protecting Elderly, Infants & Outdoor Workers',
          duration: '4:50',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Cold Wave': {
    'English': {
      title: 'COLD WAVE & SEVERE FROST',
      before: [
        'Store adequate warm clothing, blankets, and dry fuel/heating sources safely.',
        'Insulate water pipes to prevent freezing and bursting.',
        'Keep emergency medical supplies and cough/cold remedies at hand.'
      ],
      duringAfter: [
        'Wear multiple layers of loose, warm clothing rather than a single thick layer.',
        'Cover your head, neck, hands, and feet properly before going outdoors.',
        'Ensure proper ventilation if using coal heaters or Angithis to prevent Carbon Monoxide poisoning.',
        'Provide warm shelter and bedding for domestic pets and livestock.'
      ],
      videos: [
        {
          title: '#ColdWave | Winter Safety & Hypothermia Prevention',
          duration: '3:15',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ColdWave | Safe Heating Practices & Carbon Monoxide Hazards',
          duration: '4:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ColdWave | Protecting Crops & Livestock from Frost Bite',
          duration: '3:45',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ColdWave | Cold Wave Protocol for Vulnerable Groups',
          duration: '5:00',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Earthquakes': {
    'English': {
      title: 'EARTHQUAKE',
      before: [
        'Fasten heavy furniture, cupboards, and water heaters firmly to walls.',
        'Identify safe spots in every room: under sturdy tables or against interior walls.',
        'Keep a family emergency meeting plan and disaster supply kit ready.'
      ],
      duringAfter: [
        'DROP, COVER, AND HOLD ON: Drop to hands and knees, cover head under sturdy table, and hold on.',
        'If indoors, stay inside until shaking stops. Do not rush for elevators.',
        'If outdoors, move to an open area away from buildings, electric wires, and trees.',
        'Expect aftershocks. Check for gas leaks and turn off main power switch.'
      ],
      videos: [
        {
          title: '#Earthquake | Drop, Cover & Hold On Drill in Action',
          duration: '2:40',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Earthquake | Home Structural Non-Structural Safety Fixes',
          duration: '4:15',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Earthquake | Post-Earthquake Gas & Electrical Hazard Checks',
          duration: '3:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Earthquake | Community Search & Rescue Protocol',
          duration: '5:20',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Tsunamis': {
    'English': {
      title: 'TSUNAMI',
      before: [
        'Know the tsunami hazard zone of your coastal community and evacuation high-grounds.',
        'Notice natural warning signs: severe earthquake or sudden dramatic sea recession.',
        'Plan evacuation routes that lead inland and at least 30 meters above sea level.'
      ],
      duringAfter: [
        'If you feel a strong coastal earthquake, EVACUATE IMMEDIATELY to high ground on foot.',
        'Never go to the beach to watch a tsunami or ocean withdrawal.',
        'Remember: a tsunami is a series of waves, and the first wave is rarely the largest.',
        'Stay on high ground until official tsunami all-clear is issued by INCOIS/NDMA.'
      ],
      videos: [
        {
          title: '#Tsunami | Coastal Warning Signs & Immediate Evacuation',
          duration: '3:50',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Tsunami | INCOIS Early Warning System & Sirens',
          duration: '4:20',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Tsunami | Maritime & Boat Safety During Tsunami Alerts',
          duration: '3:10',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Tsunami | Coastal Community Drill & Survival Tactics',
          duration: '5:00',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Avalanches': {
    'English': {
      title: 'SNOW AVALANCHE',
      before: [
        'Check SASE (Snow & Avalanche Study Establishment) bulletins before mountain travels.',
        'Carry an avalanche transceiver beacon, probe, and collapsible shovel.',
        'Travel in groups but cross avalanche paths one person at a time.'
      ],
      duringAfter: [
        'If caught in an avalanche, discard skis/poles and make vigorous swimming motions.',
        'Before snow stops moving, cup hands in front of face to create a life-saving air pocket.',
        'Stay calm to conserve oxygen; listen for rescue probe signals from search teams.'
      ],
      videos: [
        {
          title: '#Avalanche | High Altitude Survival & Air Pocket Creation',
          duration: '4:00',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Avalanche | SASE Warning Interpretation & Beacon Protocol',
          duration: '3:30',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Avalanche | Mountain Road Safety & Snow Chains Setup',
          duration: '2:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Avalanche | Probing & Companion Rescue Techniques',
          duration: '5:15',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Landslides': {
    'English': {
      title: 'LANDSLIDES & DEBRIS FLOW',
      before: [
        'Plant deep-rooted vegetation on slopes to prevent soil erosion.',
        'Watch for progressive warning signs: sticking doors/windows, leaning trees, or new cracks in soil.',
        'Avoid building houses near steep slope drainage courses.'
      ],
      duringAfter: [
        'Stay alert during intense continuous rainfall; listen for rumbling sounds or sudden stream color changes.',
        'Move quickly away from the path of landslide or debris flow to stable higher ridge ground.',
        'Do not cross landslide-blocked roads until geological clearance is provided by BRO/SDMA.'
      ],
      videos: [
        {
          title: '#Landslides | Early Geological Warning Signs on Hilly Slopes',
          duration: '3:45',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Landslides | Hill Highway Driving Precautions & Mudflows',
          duration: '4:10',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Landslides | Bio-Engineering Slope Stabilization Methods',
          duration: '3:20',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Landslides | Post-Slide Rescue & Unstable Terrain Safety',
          duration: '5:00',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  },
  'Cloudbursts': {
    'English': {
      title: 'CLOUDBURST & FLASH FLOOD',
      before: [
        'Avoid setting up camps or temporary settlements near seasonal mountain riverbeds (Gadheras).',
        'Identify high rock ridges and escape trails in advance during Himalayan monsoon travel.',
        'Keep emergency whistle, torch, and high-altitude gear ready.'
      ],
      duringAfter: [
        'If torrential rain begins in a mountain valley, immediately ascend the hillside away from riverbeds.',
        'Never attempt to cross swelling mountain torrents on foot or in vehicles.',
        'Seek shelter in reinforced masonry structures away from loose talus slopes.'
      ],
      videos: [
        {
          title: '#Cloudburst | Flash Floods in Mountain Valleys Safety Guide',
          duration: '4:20',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cloudburst | Himalayan Monsoon Travel Protocols',
          duration: '3:40',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cloudburst | Valley Escape Routes & High Ridge Safety',
          duration: '3:05',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#Cloudburst | Rapid Disaster Community Response & Whistle Signals',
          duration: '4:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  }
};

const DISASTER_CATEGORIES: DisasterCategory[] = [
  'Cyclones',
  'Tsunamis',
  'Avalanches',
  'Cold Wave',
  'Heat Waves',
  'Lightning',
  'Floods',
  'Earthquakes',
  'Urban Floods',
  'Landslides',
  'Cloudbursts'
];

const LANGUAGES: LanguageCode[] = [
  'English',
  'हिन्दी',
  'বাংলা',
  'ગુજરાતી',
  'ಕನ್ನಡ',
  'മലയാളം',
  'मराठी',
  'ଓଡ଼ିଆ',
  'ਪੰਜਾਬੀ',
  'தமிழ்',
  'తెలుగు',
  'অসমীয়া'
];

export const DosAndDontsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DisasterCategory>('Cyclones');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null);

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DISASTER_CATEGORIES;
    return DISASTER_CATEGORIES.filter(cat => 
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Current content with fallback to English if chosen language content is pending translation
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
          <span>Dos and Don'ts</span>
        </div>
      </div>

      {/* 2. Controls Ribbon: Search + Category Pills + Language Selector */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs dark:shadow-xl space-y-4">
        {/* Top Filter Row: Search & Events Pills */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">
              Events:
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search"
                className="w-36 sm:w-44 pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-full text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18447e]"
              />
            </div>
          </div>

          {/* Disaster Categories Pills */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
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
                  {cat}
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
                  BEFORE {selectedCategory.toUpperCase()}
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
                  DURING &amp; AFTER {selectedCategory.toUpperCase()}
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
                Video Section
              </h3>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Official NDMA Safety
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-75 group-hover:opacity-90"
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
              National Disaster Management Authority (NDMA) Citizen Safety Guidelines
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
