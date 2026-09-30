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
  beforeTitle?: string;
  duringAfterTitle?: string;
  before: string[];
  duringAfter: string[];
  videos: {
    title: string;
    duration: string;
    youtubeId: string;
    thumbnailUrl: string;
  }[];
}

const CATEGORY_NAMES: Record<DisasterCategory, Partial<Record<LanguageCode, string>>> = {
  'Cyclones': { 'English': 'Cyclones', 'हिन्दी': 'चक्रवात (Cyclones)', 'বাংলা': 'ঘূর্ণিঝড় (Cyclones)', 'ગુજરાતી': 'વાવાઝોડું', 'मराठी': 'चक्रीवादळ', 'தமிழ்': 'புயல்' },
  'Tsunamis': { 'English': 'Tsunamis', 'हिन्दी': 'सुनामी (Tsunamis)', 'বাংলা': 'সুনামি (Tsunamis)', 'ગુજરાતી': 'સુનામી', 'मराठी': 'सुनामी', 'தமிழ்': 'சுனாமி' },
  'Avalanches': { 'English': 'Avalanches', 'हिन्दी': 'हिमस्खलन (Avalanches)', 'বাংলা': 'হিমবাহ ধস (Avalanches)', 'ગુજરાતી': 'બરફનું સ્ખલન', 'मराठी': 'हिमस्खलन', 'தமிழ்': 'பனிச்சரிவு' },
  'Cold Wave': { 'English': 'Cold Wave', 'हिन्दी': 'शीतलहर (Cold Wave)', 'বাংলা': 'শৈত্যপ্রবাহ (Cold Wave)', 'ગુજરાતી': 'શીત લહેર', 'मराठी': 'थंडीची लाट', 'தமிழ்': 'குளிரலை' },
  'Heat Waves': { 'English': 'Heat Waves', 'हिन्दी': 'लू (Heat Waves)', 'বাংলা': 'তাপপ্রবাহ (Heat Waves)', 'ગુજરાતી': 'ગરમીની લહેર', 'मराठी': 'उष्णतेची लाट', 'தமிழ்': 'வெப்ப அலை' },
  'Lightning': { 'English': 'Lightning', 'हिन्दी': 'आकाशीय बिजली (Lightning)', 'বাংলা': 'বজ্রপাত (Lightning)', 'ગુજરાતી': 'વીજળી', 'मराठी': 'वीज पडणे', 'தமிழ்': 'மின்னல்' },
  'Floods': { 'English': 'Floods', 'हिन्दी': 'बाढ़ (Floods)', 'বাংলা': 'বন্যা (Floods)', 'ગુજરાતી': 'પૂર', 'मराठी': 'पूर', 'தமிழ்': 'வெள்ளம்' },
  'Earthquakes': { 'English': 'Earthquakes', 'हिन्दी': 'भूकंप (Earthquakes)', 'বাংলা': 'ভূমিকম্প (Earthquakes)', 'ગુજરાતી': 'ધરતીકંપ', 'मराठी': 'भूकंप', 'தமிழ்': 'நிலநடுக்கம்' },
  'Urban Floods': { 'English': 'Urban Floods', 'हिन्दी': 'शहरी बाढ़ (Urban Floods)', 'বাংলা': 'শহুরে বন্যা (Urban Floods)', 'ગુજરાતી': 'શહેરી પૂર', 'मराठी': 'शहरी पूर', 'தமிழ்': 'நகர்ப்புற வெள்ளம்' },
  'Landslides': { 'English': 'Landslides', 'हिन्दी': 'भूस्खलन (Landslides)', 'বাংলা': 'ভূমিধস (Landslides)', 'ગુજરાતી': 'જમીન ધસી પડવી', 'मराठी': 'दरड कोसळणे', 'தமிழ்': 'நிலச்சரிவு' },
  'Cloudbursts': { 'English': 'Cloudbursts', 'हिन्दी': 'बादल फटना (Cloudbursts)', 'বাংলা': 'মেঘভাঙা বৃষ্টি (Cloudbursts)', 'ગુજરાતી': 'વાદળ ફાટવું', 'मराठी': 'ढगफुटी', 'தமிழ்': 'மேகவெடிப்பு' }
};

const UI_TEXT: Record<string, {
  dosAndDonts: string;
  eventsLabel: string;
  searchPlaceholder: string;
  beforePrefix: string;
  duringAfterPrefix: string;
  videoSection: string;
  officialSafety: string;
  footerNotice: string;
}> = {
  'English': {
    dosAndDonts: "Dos and Don'ts",
    eventsLabel: "Events:",
    searchPlaceholder: "search disaster...",
    beforePrefix: "BEFORE",
    duringAfterPrefix: "DURING & AFTER",
    videoSection: "Video Section",
    officialSafety: "Official NDMA Safety",
    footerNotice: "National Disaster Management Authority (NDMA) Citizen Safety Guidelines"
  },
  'हिन्दी': {
    dosAndDonts: "क्या करें और क्या न करें (Dos and Don'ts)",
    eventsLabel: "आपदाएं (Events):",
    searchPlaceholder: "आपदा खोजें...",
    beforePrefix: "आपदा से पहले (BEFORE)",
    duringAfterPrefix: "दौरान और बाद में (DURING & AFTER)",
    videoSection: "वीडियो सुरक्षा मार्गदर्शिका (Video Section)",
    officialSafety: "एनडीएमए आधिकारिक सुरक्षा",
    footerNotice: "राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA) नागरिक सुरक्षा दिशानिर्देश"
  },
  'বাংলা': {
    dosAndDonts: "করণীয় ও বর্জনীয় (Dos and Don'ts)",
    eventsLabel: "দুর্যোগসমূহ (Events):",
    searchPlaceholder: "দুর্যোগ অনুসন্ধান করুন...",
    beforePrefix: "দুর্যোগের পূর্বে (BEFORE)",
    duringAfterPrefix: "চলাকালীন ও পরে (DURING & AFTER)",
    videoSection: "ভিডিও সুরক্ষা নির্দেশিকা (Video Section)",
    officialSafety: "সরকারি এনডিএমএ সুরক্ষা",
    footerNotice: "জাতীয় দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষ (NDMA) নাগরিক সুরক্ষা নির্দেশাবলী"
  }
};

const DISASTER_CONTENT: Record<DisasterCategory, Record<string, DosDontsData>> = {
  'Cyclones': {
    'English': {
      title: 'CYCLONE',
      beforeTitle: 'BEFORE CYCLONES',
      duringAfterTitle: 'DURING & AFTER CYCLONES',
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
          title: '#Cyclone | What To Do Before & During A Cyclone ? | NDMA',
          duration: '3:15',
          youtubeId: 'B9qR2e3xyJo',
          thumbnailUrl: 'https://img.youtube.com/vi/B9qR2e3xyJo/hqdefault.jpg'
        },
        {
          title: "#Cyclone | What To Do If You're Outdoors During A Cyclone | NDMA",
          duration: '2:45',
          youtubeId: 'CcvOhT7n3y8',
          thumbnailUrl: 'https://img.youtube.com/vi/CcvOhT7n3y8/hqdefault.jpg'
        },
        {
          title: '#Cyclone | चक्रवात से पहले क्या तैयारी रखें ?',
          duration: '3:30',
          youtubeId: '-vqBNQ0Fhq8',
          thumbnailUrl: 'https://img.youtube.com/vi/-vqBNQ0Fhq8/hqdefault.jpg'
        },
        {
          title: '#Cyclone | Secure Your House | NDMA',
          duration: '4:10',
          youtubeId: 'Gm9c9EehO2g',
          thumbnailUrl: 'https://img.youtube.com/vi/Gm9c9EehO2g/hqdefault.jpg'
        }
      ]
    },
    'हिन्दी': {
      title: 'चक्रवात (CYCLONE)',
      beforeTitle: 'चक्रवात से पहले (BEFORE CYCLONE)',
      duringAfterTitle: 'चक्रवात के दौरान और बाद में (DURING & AFTER CYCLONE)',
      before: [
        'अफवाहों पर ध्यान न दें, शांत रहें और घबराएं नहीं।',
        'आपातकालीन संचार के लिए अपने मोबाइल फोन पूरी तरह से चार्ज रखें; एसएमएस का उपयोग करें।',
        'मौसम की ताजा जानकारी के लिए रेडियो सुनें और टीवी या आधिकारिक समाचार बुलेटिन देखें।',
        'महत्वपूर्ण दस्तावेज और कीमती सामान वाटरप्रूफ बैग या ऊंचे स्थानों पर सुरक्षित रखें।',
        'सूखा भोजन, पीने का पानी, टॉर्च, मोमबत्ती, प्राथमिक चिकित्सा किट और जरूरी दवाएं तैयार रखें।',
        'घर की छतों और खिड़कियों की समय रहते मरम्मत कर सुरक्षित करें; बाहर नुकीली वस्तुएं खुली न छोड़ें।'
      ],
      duringAfter: [
        'पशुओं को खूंटे से खोल दें ताकि खतरे के समय वे सुरक्षित स्थान पर भाग सकें।',
        'तूफानी लहर या बाढ़ की चेतावनी मिलने पर तुरंत निकटतम ऊंचे सुरक्षित स्थान या चक्रवात आश्रय स्थल जाएं।',
        'कम से कम एक सप्ताह के लिए पर्याप्त सूखा भोजन और पीने का साफ पानी पहले से जमा रखें।',
        'परिवार और पड़ोसियों के साथ मिलकर मॉक ड्रिल और सुरक्षा अभ्यास करें।',
        'घर के आसपास के पेड़ों की सूखी और कमजोर टहनियों की समय पर छंटाई करें।',
        'दरवाजे और खिड़कियां कसकर बंद रखें। चक्रवात की आंख गुजरने के शांत समय में भी बाहर न निकलें।',
        'प्रशासन द्वारा निर्देश मिलते ही बिना देरी किए सुरक्षित राहत शिविरों में चले जाएं।'
      ],
      videos: [
        {
          title: '#Cyclone | What To Do Before & During A Cyclone ? | NDMA',
          duration: '3:15',
          youtubeId: 'B9qR2e3xyJo',
          thumbnailUrl: 'https://img.youtube.com/vi/B9qR2e3xyJo/hqdefault.jpg'
        },
        {
          title: "#Cyclone | What To Do If You're Outdoors During A Cyclone | NDMA",
          duration: '2:45',
          youtubeId: 'CcvOhT7n3y8',
          thumbnailUrl: 'https://img.youtube.com/vi/CcvOhT7n3y8/hqdefault.jpg'
        },
        {
          title: '#Cyclone | चक्रवात से पहले क्या तैयारी रखें ?',
          duration: '3:30',
          youtubeId: '-vqBNQ0Fhq8',
          thumbnailUrl: 'https://img.youtube.com/vi/-vqBNQ0Fhq8/hqdefault.jpg'
        },
        {
          title: '#Cyclone | Secure Your House | NDMA',
          duration: '4:10',
          youtubeId: 'Gm9c9EehO2g',
          thumbnailUrl: 'https://img.youtube.com/vi/Gm9c9EehO2g/hqdefault.jpg'
        }
      ]
    },
    'বাংলা': {
      title: 'ঘূর্ণিঝড় (CYCLONE)',
      beforeTitle: 'ঘূর্ণিঝড়ের আগে (BEFORE CYCLONE)',
      duringAfterTitle: 'ঘূর্ণিঝড়ের সময় ও পরে (DURING & AFTER CYCLONE)',
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
          title: '#Cyclone | What To Do Before & During A Cyclone ? | NDMA',
          duration: '3:15',
          youtubeId: 'B9qR2e3xyJo',
          thumbnailUrl: 'https://img.youtube.com/vi/B9qR2e3xyJo/hqdefault.jpg'
        },
        {
          title: "#Cyclone | What To Do If You're Outdoors During A Cyclone | NDMA",
          duration: '2:45',
          youtubeId: 'CcvOhT7n3y8',
          thumbnailUrl: 'https://img.youtube.com/vi/CcvOhT7n3y8/hqdefault.jpg'
        },
        {
          title: '#Cyclone | चक्रवात से पहले क्या तैयारी रखें ?',
          duration: '3:30',
          youtubeId: '-vqBNQ0Fhq8',
          thumbnailUrl: 'https://img.youtube.com/vi/-vqBNQ0Fhq8/hqdefault.jpg'
        },
        {
          title: '#Cyclone | Secure Your House | NDMA',
          duration: '4:10',
          youtubeId: 'Gm9c9EehO2g',
          thumbnailUrl: 'https://img.youtube.com/vi/Gm9c9EehO2g/hqdefault.jpg'
        }
      ]
    }
  },
  'Floods': {
    'English': {
      title: 'RIVERINE FLOODS',
      beforeTitle: 'BEFORE FLOODS',
      duringAfterTitle: 'DURING & AFTER FLOODS',
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
    },
    'हिन्दी': {
      title: 'बाढ़ (FLOODS)',
      beforeTitle: 'बाढ़ से पहले (BEFORE FLOODS)',
      duringAfterTitle: 'बाढ़ के दौरान और बाद में (DURING & AFTER FLOODS)',
      before: [
        'अपने क्षेत्र के बाढ़ इतिहास और सुरक्षित निकासी मार्गों की पूरी जानकारी रखें।',
        'घर के आसपास की नालियों और जल निकासी रास्तों को कचरे व प्लास्टिक से मुक्त रखें।',
        'बिजली के उपकरण, गैस सिलेंडर और जरूरी सामान संभावित बाढ़ स्तर से ऊपर रखें।',
        'पीने का पानी, सूखा राशन, टॉर्च और दवाइयों से युक्त इमरजेंसी बैग तैयार रखें।',
        'मोबाइल फोन और पावर बैंक चार्ज रखें; बैटरी से चलने वाला रेडियो साथ रखें।'
      ],
      duringAfter: [
        'बहते बाढ़ के पानी में चलने, तैरने या गाड़ी चलाने की कोशिश कभी न करें — 6 इंच बहता पानी भी बहा सकता है।',
        'बिजली के खंभों, गिरे तारों और पानी में डूबे ट्रांसफार्मरों से सुरक्षित दूरी बनाए रखें।',
        'जलजनित बीमारियों से बचने के लिए केवल उबला हुआ या क्लोरीनयुक्त पानी ही पिएं।',
        'बाढ़ के पानी के संपर्क में आया भोजन कभी न खाएं।',
        'राहत और बचाव के समय एनडीआरएफ, एसडीआरएफ और स्थानीय प्रशासन का पूरा सहयोग करें।'
      ],
      videos: [
        {
          title: '#बाढ़ | बाढ़ से पहले और दौरान सुरक्षा के उपाय',
          duration: '4:15',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#बाढ़ | जलभराव वाले रास्तों पर गाड़ी न चलाएं',
          duration: '2:30',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#बाढ़ | बाढ़ के बाद स्वच्छता और पेयजल शुद्धिकरण',
          duration: '3:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#बाढ़ | मवेशियों और संपत्ति की सुरक्षा',
          duration: '4:40',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'বন্যা (FLOODS)',
      beforeTitle: 'বন্যার আগে (BEFORE FLOODS)',
      duringAfterTitle: 'বন্যার সময় ও পরে (DURING & AFTER FLOODS)',
      before: [
        'আপনার এলাকার বন্যার ইতিহাস এবং নিরাপদ উঁচু স্থানান্তর পথের সম্পূর্ণ তথ্য জেনে রাখুন।',
        'বাড়ির চারপাশের নিকাশি নালা আবর্জনা ও প্লাস্টিকমুক্ত রাখুন।',
        'বৈদ্যুতিক সরঞ্জাম, রান্নার গ্যাস সিলিন্ডার এবং মূল্যবান জিনিসপত্র সম্ভাব্য জলস্তর থেকে উঁচুতে রাখুন।',
        'বিশুদ্ধ পানীয় জল, শুকনো খাবার, টর্চ এবং প্রয়োজনীয় ওষুধসহ একটি জরুরি ব্যাগ তৈরি রাখুন।',
        'মোবাইল ফোন ও পাওয়ার ব্যাঙ্ক চার্জ রাখুন; ব্যাটারি চালিত রেডিও সঙ্গে রাখুন।'
      ],
      duringAfter: [
        'প্রবাহিত বন্যার জলের মধ্য দিয়ে হাঁটা, সাঁতার কাটা বা গাড়ি চালানোর চেষ্টা করবেন না — মাত্র ৬ ইঞ্চি স্রোতের জল আপনাকে ভাসিয়ে দিতে পারে।',
        'বিদ্যুতের খুঁটি, ছিঁড়ে পড়া তার এবং জলে নিমজ্জিত ট্রান্সফরমার থেকে নিরাপদ দূরত্ব বজায় রাখুন।',
        'জলবাহিত রোগ প্রতিরোধ করতে শুধুমাত্র ফোটানো বা ক্লোরিনযুক্ত বিশুদ্ধ জল পান করুন।',
        'বন্যার জলের সংস্পর্শে আসা কোনো খাদ্যসামগ্রী গ্রহণ করবেন না।',
        'উদ্ধার অভিযানের সময় এনডিআরএফ (NDRF), এসডিআরএফ (SDRF) এবং স্থানীয় প্রশাসনকে পূর্ণ সহযোগিতা করুন।'
      ],
      videos: [
        {
          title: '#বন্যা | বন্যার আগে ও চলাকালীন নাগরিক সুরক্ষাবিধি',
          duration: '4:15',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#বন্যা | প্লাবিত রাস্তায় গাড়ি চালাবেন না',
          duration: '2:30',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#বন্যা | বন্যা পরবর্তী স্বাস্থ্যবিধি ও পানীয় জল বিশুদ্ধকরণ',
          duration: '3:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#বন্যা | গবাদি পশু ও সম্পত্তির সুরক্ষা নির্দেশিকা',
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
      beforeTitle: 'BEFORE URBAN FLOODS',
      duringAfterTitle: 'DURING & AFTER URBAN FLOODS',
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
    },
    'हिन्दी': {
      title: 'शहरी बाढ़ एवं जलभराव (URBAN FLOODS)',
      beforeTitle: 'शहरी बाढ़ से पहले (BEFORE URBAN FLOODS)',
      duringAfterTitle: 'शहरी बाढ़ के दौरान और बाद में (DURING & AFTER URBAN FLOODS)',
      before: [
        'पूरे परिसर को पक्का न करें; प्राकृतिक रूप से पानी रिसने के लिए कच्ची जमीन रखें।',
        'नगर निगम के जल निकासी अपडेट देखें और भारी बारिश के समय अंडरपास से बचें।',
        'बेसमेंट में लगे पानी निकासी पंपों और बैकफ्लो वाल्वों की कार्यप्रणाली जांच लें।',
        'भारी बारिश की चेतावनी के दौरान गाड़ियां बेसमेंट या निचले इलाकों में पार्क न करें।'
      ],
      duringAfter: [
        'जलमग्न सबवे, अंडरपास और बेसमेंट पार्किंग में जाने से बचें।',
        'बाढ़ के पानी के नीचे छिपे खुले मैनहोल और नालों से सावधान रहें।',
        'यदि घर या दुकान में पानी घुसने लगे तो तुरंत मुख्य बिजली स्विच (मेन स्विच) बंद कर दें।',
        'यातायात पुलिस और आपदा प्रबंधन द्वारा सुझाए गए ऊंचे वैकल्पिक रास्तों का ही प्रयोग करें।'
      ],
      videos: [
        {
          title: '#शहरीबाढ़ | मानसून में शहरों में सुरक्षित आवागमन',
          duration: '3:10',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#शहरीबाढ़ | जलभराव में खुले मैनहोल और बिजली के खतरे',
          duration: '2:45',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#शहरीबाढ़ | बेसमेंट जल निकासी और पंप प्रबंधन',
          duration: '4:00',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#शहरीबाढ़ | वर्षा जल संचयन और शहर की जल निकासी',
          duration: '5:20',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'শহুরে বন্যা ও জলমগ্নতা (URBAN FLOODS)',
      beforeTitle: 'শহুরে বন্যার আগে (BEFORE URBAN FLOODS)',
      duringAfterTitle: 'শহুরে বন্যার সময় ও পরে (DURING & AFTER URBAN FLOODS)',
      before: [
        'বাড়ির সম্পূর্ণ প্রাঙ্গণ কংক্রিট করবেন না; ভূগর্ভস্থ জল প্রবেশের জন্য কিছুটা কাঁচা মাটি রাখুন।',
        'পৌরসভার নিকাশি আপডেট লক্ষ্য করুন এবং ভারী বৃষ্টির সময় আন্ডারপাস দিয়ে চলাচল এড়িয়ে চলুন।',
        'বেসমেন্টে থাকা জল নিষ্কাশন পাম্প এবং ব্যাকফ্লো প্রিভেন্টার ভালভ কার্যকর আছে কিনা পরীক্ষা করুন।',
        'ভারী বৃষ্টির সতর্কবার্তা থাকাকালীন আন্ডারগ্রাউন্ড বেসমেন্ট বা নিচু রাস্তায় গাড়ি পার্ক করবেন না।'
      ],
      duringAfter: [
        'জলমগ্ন সাবওয়ে, আন্ডারপাস এবং বেসমেন্ট পার্কিংয়ে যাওয়া থেকে বিরত থাকুন।',
        'বন্যার জলের নিচে লুকানো খোলা ম্যানহোল এবং নর্দমা থেকে সতর্ক থাকুন।',
        'ঘরের ভেতর জল ঢুকতে শুরু করলে অবিলম্বে প্রধান বৈদ্যুতিক সুইচ (Main Switch) বন্ধ করে দিন।',
        'ট্র্যাফিক পুলিশ ও দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষ নির্দেশিত উঁচু বিকল্প পথ ব্যবহার করুন।'
      ],
      videos: [
        {
          title: '#শহুরেবন্যা | বর্ষায় শহরের জলমগ্ন রাস্তায় চলাচলের নিয়ম',
          duration: '3:10',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#শহুরেবন্যা | খোলা ম্যানহোল ও বৈদ্যুতিক বিপদ',
          duration: '2:45',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#শহুরেবন্যা | বেসমেন্ট জল নিষ্কাশন ও পাম্প ব্যবস্থাপনা',
          duration: '4:00',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#শহুরেবন্যা | বৃষ্টির জল সংরক্ষণ ও নিকাশি ব্যবস্থা',
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
      beforeTitle: 'BEFORE LIGHTNING',
      duringAfterTitle: 'DURING & AFTER LIGHTNING',
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
    },
    'हिन्दी': {
      title: 'आकाशीय बिजली (LIGHTNING)',
      beforeTitle: 'वज्रपात से पहले (BEFORE LIGHTNING)',
      duringAfterTitle: 'वज्रपात के दौरान और बाद में (DURING & AFTER LIGHTNING)',
      before: [
        'घर से बाहर निकलने से पहले दामिनी (DAMINI) और वर्षानेट (VARSHANET) बिजली चेतावनी जांचें।',
        'भवनों की सुरक्षा के लिए तड़ित चालक (Lightning Arrester) जरूर लगवाएं।',
        'आंधी-तूफान आने से पहले संवेदनशील बिजली उपकरणों के प्लग निकाल दें।'
      ],
      duringAfter: [
        '30-30 नियम याद रखें: यदि चमक और गड़गड़ाहट के बीच का अंतर 30 सेकंड से कम है, तो तुरंत पक्की छत के नीचे जाएं।',
        'खुले खेतों में अकेले खड़े ऊंचे पेड़ों या टिन शेड के नीचे कभी शरण न लें।',
        'यदि खुले में फंस जाएं, तो पंजों के बल उकड़ू बैठकर कान बंद कर लें (Lightning Crouch)।',
        'तालाबों, नदियों, लोहे की बाड़, ट्रैक्टर और साइकिल से तुरंत दूर हट जाएं।',
        'बिजली गिरने से पीड़ित व्यक्ति को तुरंत प्राथमिक उपचार (CPR) दें; उनके शरीर में कोई करंट नहीं होता।'
      ],
      videos: [
        {
          title: '#आकाशीयबिजली | 30-30 नियम और उकड़ू बैठने की तकनीक',
          duration: '3:20',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#आकाशीयबिजली | ग्रामीण किसानों के लिए खेत में सुरक्षा उपाय',
          duration: '4:10',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#आकाशीयबिजली | पीड़ित के लिए तत्काल सीपीआर और प्राथमिक चिकित्सा',
          duration: '3:40',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#आकाशीयबिजली | तड़ित चालक और घरेलू सुरक्षा',
          duration: '5:00',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'বজ্রপাত ও ঝড়বৃষ্টি (LIGHTNING)',
      beforeTitle: 'বজ্রপাতের আগে (BEFORE LIGHTNING)',
      duringAfterTitle: 'বজ্রপাতের সময় ও পরে (DURING & AFTER LIGHTNING)',
      before: [
        'বাইরে বের হওয়ার আগে দামিনী (DAMINI) ও বর্ষানেট (VARSHANET) বজ্রপাত পূর্বাভাস দেখে নিন।',
        'উঁচু ভবনে সুরক্ষার জন্য বজ্র নিরোধক দণ্ড (Lightning Arrester) স্থাপন করুন।',
        'ঝড়বৃষ্টি শুরু হওয়ার আগেই সংবেদনশীল বৈদ্যুতিক যন্ত্রপাতির প্লাগ খুলে রাখুন।'
      ],
      duringAfter: [
        '৩০-৩০ নিয়ম মেনে চলুন: বিদ্যুৎ চমকানো ও মেঘের গর্জনের ব্যবধান ৩০ সেকেন্ডের কম হলে অবিলম্বে পাকা আশ্রয়ে যান।',
        'খোলা মাঠে একাকী দাঁড়িয়ে থাকা উঁচু গাছ বা টিনের শেডের নিচে কখনোই আশ্রয় নেবেন না।',
        'খোলা জায়গায় আটকা পড়লে পায়ের আঙুলে ভর দিয়ে মাথা নিচু করে কান ঢেকে বসুন (Lightning Crouch)।',
        'পুকুর, নদী, ধাতব বেড়া, ট্র্যাক্টর এবং সাইকেল থেকে অবিলম্বে দূরে সরে যান।',
        'বজ্রাহত ব্যক্তিকে অবিলম্বে কৃত্রিম শ্বাস-প্রশ্বাস (CPR) ও প্রাথমিক চিকিৎসা দিন; তাদের শরীরে কোনো বিদ্যুৎ থাকে না।'
      ],
      videos: [
        {
          title: '#বজ্রপাত | ৩০-৩০ নিয়ম ও বাঁচার সঠিক ভঙ্গি',
          duration: '3:20',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#বজ্রপাত | কৃষকদের জন্য খোলা মাঠে সুরক্ষাবিধি',
          duration: '4:10',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#বজ্রপাত | আহত ব্যক্তির জরুরি প্রাথমিক চিকিৎসা ও সিপিআর',
          duration: '3:40',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#বজ্রপাত | ভবনে বজ্র নিরোধক ব্যবস্থা',
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
      beforeTitle: 'BEFORE HEAT WAVE',
      duringAfterTitle: 'DURING & AFTER HEAT WAVE',
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
    },
    'हिन्दी': {
      title: 'लू / ग्रीष्म लहर (HEAT WAVE)',
      beforeTitle: 'लू से पहले (BEFORE HEAT WAVE)',
      duringAfterTitle: 'लू के दौरान और बाद में (DURING & AFTER HEAT WAVE)',
      before: [
        'मौसम विभाग (IMD) के दैनिक तापमान और लू की चेतावनी पर नजर रखें।',
        'ओआरएस (ORS) और पारंपरिक पेय (छाछ, लस्सी, नींबू पानी, आम पन्ना) तैयार रखें।',
        'धूप वाली खिड़कियों पर पर्दे, खस की टट्टी या रिफ्लेक्टिव शेड लगाएं।'
      ],
      duringAfter: [
        'दोपहर 12:00 बजे से 3:30 बजे के बीच सीधे धूप में निकलने से बचें।',
        'प्यास न लगने पर भी बार-बार भरपूर पानी और तरल पदार्थ पिएं।',
        'हल्के रंग के ढीले सूती कपड़े पहनें और बाहर निकलते समय टोपी, चश्मा या छाते का प्रयोग करें।',
        'बंद गाड़ियों में बच्चों या पालतू जानवरों को कभी अकेला न छोड़ें।',
        'लू लगने पर मरीज को ठंडी छाया में ले जाएं, गीले कपड़े से पोंछें और ओआरएस का घोल दें।'
      ],
      videos: [
        {
          title: '#लू | गर्मियों में सनस्ट्रोक और लू से बचने के उपाय',
          duration: '3:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#लू | पारंपरिक शीतल पेय और काम के दौरान सावधानियां',
          duration: '4:05',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#लू | सनस्ट्रोक होने पर प्राथमिक चिकित्सा प्रोटोकॉल',
          duration: '2:55',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#लू | बुजुर्गों, बच्चों और श्रमिकों की सुरक्षा',
          duration: '4:50',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'তাপপ্রবাহ ও লু (HEAT WAVES)',
      beforeTitle: 'তাপপ্রবাহের আগে (BEFORE HEAT WAVES)',
      duringAfterTitle: 'তাপপ্রবাহের সময় ও পরে (DURING & AFTER HEAT WAVES)',
      before: [
        'আবহাওয়া দপ্তরের দৈনিক তাপমাত্রা এবং তাপপ্রবাহের সতর্কবার্তা নিয়মিত লক্ষ্য করুন।',
        'ওআরএস (ORS) এবং দেশীয় পানীয় (লেবুর জল, ছাতুর শরবত, ডাবের জল, কাঁচা আমের শরবত) মজুত রাখুন।',
        'রোদ আসা জানলায় পর্দা বা তাপ প্রতিরোধী আচ্ছাদন ব্যবহার করুন।'
      ],
      duringAfter: [
        'বেলা ১২:০০ টা থেকে বিকেল ৩:৩০ টা পর্যন্ত সরাসরি তীব্র রোদে বের হওয়া এড়িয়ে চলুন।',
        'তৃষ্ণা না পেলেও ঘন ঘন পর্যাপ্ত জল এবং তরল পানীয় পান করুন।',
        'হালকা রঙের ঢিলেঢালা সুতির পোশাক পরুন এবং বাইরে বের হলে টুপি বা ছাতা ব্যবহার করুন।',
        'বন্ধ গাড়িতে শিশু বা পোষ্যকে কখনোই একা ফেলে রাখবেন না।',
        'সানস্ট্রোক হলে রোগীকে অবিলম্বে ছায়াযুক্ত ঠান্ডা স্থানে নিয়ে যান, ভেজা কাপড়ে গা মুছিয়ে দিন এবং ওআরএস খাওয়ান।'
      ],
      videos: [
        {
          title: '#তাপপ্রবাহ | সানস্ট্রোক প্রতিরোধ ও সুরক্ষাবিধি',
          duration: '3:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#তাপপ্রবাহ | দেশীয় স্বাস্থ্যকর পানীয় ও সতর্কতা',
          duration: '4:05',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#তাপপ্রবাহ | সানস্ট্রোকের জরুরি প্রাথমিক চিকিৎসা',
          duration: '2:55',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#তাপপ্রবাহ | প্রবীণ ও শিশুদের বিশেষ যত্ন',
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
      beforeTitle: 'BEFORE COLD WAVE',
      duringAfterTitle: 'DURING & AFTER COLD WAVE',
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
    },
    'हिन्दी': {
      title: 'शीतलहर एवं पाला (COLD WAVE)',
      beforeTitle: 'शीतलहर से पहले (BEFORE COLD WAVE)',
      duringAfterTitle: 'शीतलहर के दौरान और बाद में (DURING & AFTER COLD WAVE)',
      before: [
        'सर्दियों के लिए पर्याप्त गर्म कपड़े, कंबल और सुरक्षित हीटिंग व्यवस्था तैयार रखें।',
        'पानी की पाइपलाइनों को जमने से बचाने के लिए उचित इन्सुलेशन करें।',
        'खांसी, जुकाम और जरूरी आपातकालीन दवाओं का स्टॉक पहले से रखें।'
      ],
      duringAfter: [
        'एक मोटे कपड़े के बजाय ढीले गर्म कपड़ों की कई परतें (Layers) पहनें।',
        'बाहर निकलते समय सिर, गर्दन, कान, हाथ और पैरों को पूरी तरह ढककर रखें।',
        'कमरे में अंगीठी या हीटर जलाते समय हवा के आवागमन (वेंटिलेशन) का ध्यान रखें ताकि जहरीली गैस न बने।',
        'पालतू जानवरों और मवेशियों को ठंड से बचाने के लिए गर्म शेड और सूखा बिछौना दें।'
      ],
      videos: [
        {
          title: '#शीतलहर | सर्दियों में हाइपोथर्मिया से बचाव और सुरक्षा',
          duration: '3:15',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#शीतलहर | सुरक्षित हीटिंग और अंगीठी से होने वाले खतरे',
          duration: '4:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#शीतलहर | पाले से फसलों और पशुओं का बचाव',
          duration: '3:45',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#शीतलहर | बुजुर्गों और बच्चों के लिए शीतलहर प्रोटोकॉल',
          duration: '5:00',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'শৈত্যপ্রবাহ (COLD WAVE)',
      beforeTitle: 'শৈত্যপ্রবাহের আগে (BEFORE COLD WAVE)',
      duringAfterTitle: 'শৈত্যপ্রবাহের সময় ও পরে (DURING & AFTER COLD WAVE)',
      before: [
        'শীতের জন্য পর্যাপ্ত গরম পোশাক, কম্বল ও নিরাপদ ঘর গরম রাখার ব্যবস্থা প্রস্তুত রাখুন।',
        'জলের পাইপলাইন বরফে জমে যাওয়া থেকে রক্ষা করতে যথাযথ নিরোধক ব্যবস্থা নিন।',
        'ঠান্ডা লাগা, কাশি এবং প্রয়োজনীয় জরুরি ওষুধের মজুত আগে থেকেই রাখুন।'
      ],
      duringAfter: [
        'একটি মোটা কাপড়ের পরিবর্তে একাধিক স্তরের (Layers) ঢিলেঢালা গরম পোশাক পরুন।',
        'বাইরে বের হওয়ার সময় মাথা, কান, গলা, হাত ও পা ভালো করে ঢেকে রাখুন।',
        'ঘরের ভেতর কয়লার উনুন বা হিটার ব্যবহারের সময় পর্যাপ্ত বাতাস চলাচলের ব্যবস্থা রাখুন যাতে বিষাক্ত গ্যাস না জমে।',
        'গৃহপালিত পশু ও পোষ্যদের ঠান্ডার হাত থেকে বাঁচাতে শুকনো ও গরম আশ্রয়ে রাখুন।'
      ],
      videos: [
        {
          title: '#শৈত্যপ্রবাহ | হাইপোথার্মিয়া প্রতিরোধ ও শীতের সুরক্ষা',
          duration: '3:15',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#শৈত্যপ্রবাহ | নিরাপদ হিটিং ও কার্বন মনোক্সাইড বিষক্রিয়া প্রতিরোধ',
          duration: '4:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#শৈত্যপ্রবাহ | ফসল ও গবাদি পশুর সুরক্ষা',
          duration: '3:45',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#শৈত্যপ্রবাহ | প্রবীণ ও শিশুদের বিশেষ সতর্কতা',
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
      beforeTitle: 'BEFORE EARTHQUAKE',
      duringAfterTitle: 'DURING & AFTER EARTHQUAKE',
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
    },
    'हिन्दी': {
      title: 'भूकंप (EARTHQUAKES)',
      beforeTitle: 'भूकंप से पहले (BEFORE EARTHQUAKE)',
      duringAfterTitle: 'भूकंप के दौरान और बाद में (DURING & AFTER EARTHQUAKE)',
      before: [
        'भारी अलमारियों, दर्पणों और वाटर हीटर को दीवारों से मजबूती से बांधें।',
        'घर के हर कमरे में मजबूत मेज के नीचे या भीतरी दीवारों के पास सुरक्षित जगह पहचानें।',
        'परिवार का आपातकालीन मिलन स्थल तय करें और आपदा किट तैयार रखें।'
      ],
      duringAfter: [
        'झुको, ढको और पकड़ो (DROP, COVER & HOLD ON): फर्श पर बैठें, मजबूत मेज के नीचे सिर ढकें और कसकर पकड़ें।',
        'यदि घर के अंदर हैं, तो कंपन रुकने तक वहीं रहें। कभी भी लिफ्ट का उपयोग न करें।',
        'यदि बाहर हैं, तो इमारतों, बिजली के तारों और पेड़ों से दूर खुले मैदान में चले जाएं।',
        'झटकों के बाद (Aftershocks) के लिए तैयार रहें। गैस लीक की जांच करें और मेन बिजली स्विच बंद करें।'
      ],
      videos: [
        {
          title: '#भूकंप | झुको, ढको और पकड़ो (Drop, Cover, Hold On) अभ्यास',
          duration: '2:40',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#भूकंप | घरों की संरचनात्मक और गैर-संरचनात्मक सुरक्षा',
          duration: '4:15',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#भूकंप | भूकंप के बाद गैस और बिजली के खतरों की जांच',
          duration: '3:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#भूकंप | सामुदायिक खोज एवं बचाव प्रोटोकॉल',
          duration: '5:20',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'ভূমিকম্প (EARTHQUAKES)',
      beforeTitle: 'ভূমিকম্পের আগে (BEFORE EARTHQUAKE)',
      duringAfterTitle: 'ভূমিকম্পের সময় ও পরে (DURING & AFTER EARTHQUAKE)',
      before: [
        'ভারী আলমারি, শোকেস ও ওয়াটার হিটার দেওয়ালের সঙ্গে শক্তভাবে বেঁধে রাখুন।',
        'বাড়ির প্রতিটি ঘরে মজবুত টেবিলের নিচে বা ভেতরের দেওয়ালের পাশে নিরাপদ স্থান চিহ্নিত করে রাখুন।',
        'পরিবারের জরুরি মিলনস্থল ঠিক করে রাখুন এবং দুর্যোগকালীন সুরক্ষা কিট তৈরি রাখুন।'
      ],
      duringAfter: [
        'ঝুঁকুন, ঢাকুন ও ধরে রাখুন (DROP, COVER & HOLD ON): মেঝেতে বসে মজবুত টেবিলের নিচে মাথা ঢাকুন এবং শক্ত করে ধরে থাকুন।',
        'ঘরের ভেতর থাকলে কাঁপুনি না থামা পর্যন্ত ভেতরেই থাকুন। কখনোই লিফট ব্যবহার করবেন না।',
        'বাইরে থাকলে বহুতল ভবন, বিদ্যুতের তার এবং বড় গাছপালা থেকে দূরে খোলা মাঠে চলে যান।',
        'পরবর্তী মৃদু কম্পনের (Aftershocks) জন্য প্রস্তুত থাকুন। গ্যাস লিক পরীক্ষা করুন এবং মেইন সুইচ বন্ধ রাখুন।'
      ],
      videos: [
        {
          title: '#ভূমিকম্প | ঝুঁকুন, ঢাকুন ও ধরে রাখুন সঠিক মহড়া',
          duration: '2:40',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ভূমিকম্প | বাড়ির কাঠামো ও আসবাবপত্রের সুরক্ষা',
          duration: '4:15',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ভূমিকম্প | ভূমিকম্প পরবর্তী বিদ্যুৎ ও গ্যাস পরীক্ষা',
          duration: '3:30',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ভূমিকম্প | কমিউনিটি উদ্ধার ও প্রাথমিক চিকিৎসা',
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
      beforeTitle: 'BEFORE TSUNAMIS',
      duringAfterTitle: 'DURING & AFTER TSUNAMIS',
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
          title: '#AapdaKaSaamna | Prevention, Safety & Response When A #Tsunami Strikes',
          duration: '3:45',
          youtubeId: 'qhC1GxLLG-M',
          thumbnailUrl: 'https://img.youtube.com/vi/qhC1GxLLG-M/hqdefault.jpg'
        },
        {
          title: 'NDMA INDIA - Tsunami (are you ready)',
          duration: '2:50',
          youtubeId: 'wCpjaXPc3eI',
          thumbnailUrl: 'https://img.youtube.com/vi/wCpjaXPc3eI/hqdefault.jpg'
        },
        {
          title: 'NDMA INDIA Tsunami (Dost Appu- Hindi)',
          duration: '4:15',
          youtubeId: 'W7GHpxHpnzk',
          thumbnailUrl: 'https://img.youtube.com/vi/W7GHpxHpnzk/hqdefault.jpg'
        }
      ]
    },
    'हिन्दी': {
      title: 'सुनामी (TSUNAMIS)',
      beforeTitle: 'सुनामी से पहले (BEFORE TSUNAMI)',
      duringAfterTitle: 'सुनामी के दौरान और बाद में (DURING & AFTER TSUNAMI)',
      before: [
        'अपने तटीय इलाके के सुनामी संभावित क्षेत्रों और ऊंचे सुरक्षित स्थानों की जानकारी रखें।',
        'प्राकृतिक चेतावनी संकेतों को पहचानें: तेज तटीय भूकंप या समुद्र का तेजी से पीछे हटना।',
        'तट से दूर और समुद्र तल से कम से कम 30 मीटर ऊंचे सुरक्षित रास्तों का नक्शा याद रखें।'
      ],
      duringAfter: [
        'यदि तटीय इलाके में तेज भूकंप महसूस हो, तो बिना चेतावनी का इंतजार किए तुरंत पैदल ऊंचे स्थान पर जाएं।',
        'समुद्र का पानी पीछे हटने का नजारा देखने या मछली पकड़ने समुद्र तट पर कभी न जाएं।',
        'याद रखें: सुनामी कई लहरों की श्रृंखला होती है और पहली लहर सबसे बड़ी नहीं होती।',
        'जब तक इनकोइस (INCOIS) या एनडीएमए द्वारा आधिकारिक ऑल-क्लियर न मिले, ऊंचे स्थान पर ही रहें।'
      ],
      videos: [
        {
          title: '#AapdaKaSaamna | Prevention, Safety & Response When A #Tsunami Strikes',
          duration: '3:45',
          youtubeId: 'qhC1GxLLG-M',
          thumbnailUrl: 'https://img.youtube.com/vi/qhC1GxLLG-M/hqdefault.jpg'
        },
        {
          title: 'NDMA INDIA - Tsunami (are you ready)',
          duration: '2:50',
          youtubeId: 'wCpjaXPc3eI',
          thumbnailUrl: 'https://img.youtube.com/vi/wCpjaXPc3eI/hqdefault.jpg'
        },
        {
          title: 'NDMA INDIA Tsunami (Dost Appu- Hindi)',
          duration: '4:15',
          youtubeId: 'W7GHpxHpnzk',
          thumbnailUrl: 'https://img.youtube.com/vi/W7GHpxHpnzk/hqdefault.jpg'
        }
      ]
    },
    'বাংলা': {
      title: 'সুনামি (TSUNAMIS)',
      beforeTitle: 'সুনামির আগে (BEFORE TSUNAMIS)',
      duringAfterTitle: 'সুনামির সময় ও পরে (DURING & AFTER TSUNAMIS)',
      before: [
        'উপকূলবর্তী এলাকার সুনামি ঝুঁকিপূর্ণ স্থান এবং উঁচু স্থানান্তর পথের তথ্য জেনে রাখুন।',
        'প্রাকৃতিক সতর্ক সংকেত চিনুন: তীব্র উপকূলীয় ভূমিকম্প বা হঠাৎ সমুদ্রের জল অস্বাভাবিকভাবে পিছিয়ে যাওয়া।',
        'সমুদ্র উপকূল থেকে দূরে এবং সমুদ্রপৃষ্ঠ থেকে কমপক্ষে ৩০ মিটার উঁচু নিরাপদ আশ্রয়স্থলের নকশা মনে রাখুন।'
      ],
      duringAfter: [
        'উপকূলবর্তী এলাকায় তীব্র ভূমিকম্প অনুভূত হলে কোনো সতর্কবার্তার অপেক্ষা না করে অবিলম্বে পায়ে হেঁটে উঁচু স্থানে যান।',
        'समुद्रের জল পিছিয়ে যাওয়ার দৃশ্য দেখতে বা মাছ ধরতে কখনোই সমুদ্র সৈকতে যাবেন না।',
        'মনে রাখবেন: সুনামি একাধিক ঢেউয়ের একটি ধারাবাহিক ধারা এবং প্রথম ঢেউটি সবচেয়ে বড় নাও হতে পারে।',
        'যতক্ষণ না ইনকয়েস (INCOIS) বা এনডিএমএ (NDMA) থেকে অল-ক্লিয়ার বার্তা আসে, ততক্ষণ উঁচু নিরাপদ স্থানেই থাকুন।'
      ],
      videos: [
        {
          title: '#AapdaKaSaamna | Prevention, Safety & Response When A #Tsunami Strikes',
          duration: '3:45',
          youtubeId: 'qhC1GxLLG-M',
          thumbnailUrl: 'https://img.youtube.com/vi/qhC1GxLLG-M/hqdefault.jpg'
        },
        {
          title: 'NDMA INDIA - Tsunami (are you ready)',
          duration: '2:50',
          youtubeId: 'wCpjaXPc3eI',
          thumbnailUrl: 'https://img.youtube.com/vi/wCpjaXPc3eI/hqdefault.jpg'
        },
        {
          title: 'NDMA INDIA Tsunami (Dost Appu- Hindi)',
          duration: '4:15',
          youtubeId: 'W7GHpxHpnzk',
          thumbnailUrl: 'https://img.youtube.com/vi/W7GHpxHpnzk/hqdefault.jpg'
        }
      ]
    }
  },
  'Avalanches': {
    'English': {
      title: 'SNOW AVALANCHE',
      beforeTitle: 'BEFORE AVALANCHES',
      duringAfterTitle: 'DURING & AFTER AVALANCHES',
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
          title: '#Avalanche | Early Warning Signs & Mountain Safety Guidelines',
          duration: '3:15',
          youtubeId: 'oJYmZu4Cl_E',
          thumbnailUrl: 'https://img.youtube.com/vi/oJYmZu4Cl_E/hqdefault.jpg'
        },
        {
          title: '#Avalanche | Survival Techniques & Air Pocket Creation if Trapped',
          duration: '2:50',
          youtubeId: '3Q7fYDTL3dM',
          thumbnailUrl: 'https://img.youtube.com/vi/3Q7fYDTL3dM/hqdefault.jpg'
        },
        {
          title: 'How Avalanches Happen | Scientific Causes & Slope Triggers',
          duration: '4:10',
          youtubeId: 'xB5V7Z8C_ik',
          thumbnailUrl: 'https://img.youtube.com/vi/xB5V7Z8C_ik/hqdefault.jpg'
        }
      ]
    },
    'हिन्दी': {
      title: 'हिमस्खलन (AVALANCHES)',
      beforeTitle: 'हिमस्खलन से पहले (BEFORE AVALANCHES)',
      duringAfterTitle: 'हिमस्खलन के दौरान और बाद में (DURING & AFTER AVALANCHES)',
      before: [
        'पहाड़ी यात्रा से पहले सासे (SASE/DGRE) के हिमस्खलन बुलेटिन और चेतावनी जरूर जांचें।',
        'अपने साथ एवलांच बीकन (Transceiver), स्नो प्रोब और पोर्टेबल फावड़ा जरूर रखें।',
        'समूह में यात्रा करें लेकिन खतरनाक बर्फीली ढलानों को एक-एक करके ही पार करें।'
      ],
      duringAfter: [
        'यदि हिमस्खलन की चपेट में आएं, तो स्की और भारी सामान फेंककर बर्फ की सतह पर तैरने जैसी हरकतें करें।',
        'बर्फ रुकने से पहले अपने मुंह के आगे हाथों को रखकर हवा की थैली (Air Pocket) बना लें।',
        'ऑक्सीजन बचाने के लिए शांत रहें; बचाव दल के प्रोब और संकेतों को ध्यान से सुनें।'
      ],
      videos: [
        {
          title: '#Avalanche | जानिए इस वीडियो द्वारा हिमस्खलन के संकेत।',
          duration: '3:15',
          youtubeId: 'oJYmZu4Cl_E',
          thumbnailUrl: 'https://img.youtube.com/vi/oJYmZu4Cl_E/hqdefault.jpg'
        },
        {
          title: '#Avalanche | यदि आप हिमस्खलन में फस जाएँ, घबराएँ नहीं, बचने के लिए यह उपाए अपनाएँ!',
          duration: '2:50',
          youtubeId: '3Q7fYDTL3dM',
          thumbnailUrl: 'https://img.youtube.com/vi/3Q7fYDTL3dM/hqdefault.jpg'
        },
        {
          title: 'कैसे होता है हिमस्खलन [Avalanche]',
          duration: '4:10',
          youtubeId: 'xB5V7Z8C_ik',
          thumbnailUrl: 'https://img.youtube.com/vi/xB5V7Z8C_ik/hqdefault.jpg'
        }
      ]
    },
    'বাংলা': {
      title: 'হিমবাহ ধস ও তুষারধস (AVALANCHES)',
      beforeTitle: 'হিমবাহ ধসের আগে (BEFORE AVALANCHES)',
      duringAfterTitle: 'হিমবাহ ধসের সময় ও পরে (DURING & AFTER AVALANCHES)',
      before: [
        'পার্বত্য অঞ্চলে ভ্রমণের আগে সাসে (SASE/DGRE) বুলেটিন এবং তুষারধসের পূর্বাভাস জেনে নিন।',
        'সঙ্গে অ্যাভালাঞ্চ ট্রান্সিভার বীকন, স্নো প্রোব ও পোর্টেবল বেলচা রাখুন।',
        'দলে ভ্রমণ করুন কিন্তু ঝুঁকিপূর্ণ বরফের ঢাল একজন একজন করে পার হন।'
      ],
      duringAfter: [
        'তুষারধসের কবলে পড়লে স্কি ও ভারী সরঞ্জাম ফেলে বরফের উপর সাঁতার কাটার মতো হাত-পা চালান।',
        'বরফের গতি থামার আগেই মুখের সামনে হাত রেখে একটি ফাঁপা বায়ু পকেট (Air Pocket) তৈরি করুন।',
        'অক্সিজেন বাঁচাতে শান্ত থাকুন এবং উদ্ধারকারী দলের অনুসন্ধান সংকেত শোনার চেষ্টা করুন।'
      ],
      videos: [
        {
          title: '#হিমবাহধস | তুষারধসের প্রাথমিক লক্ষণ ও সংকেত',
          duration: '3:15',
          youtubeId: 'oJYmZu4Cl_E',
          thumbnailUrl: 'https://img.youtube.com/vi/oJYmZu4Cl_E/hqdefault.jpg'
        },
        {
          title: '#হিমবাহধস | তুষারধসে আটকে গেলে বাঁচার গুরুত্বপূর্ণ কৌশল',
          duration: '2:50',
          youtubeId: '3Q7fYDTL3dM',
          thumbnailUrl: 'https://img.youtube.com/vi/3Q7fYDTL3dM/hqdefault.jpg'
        },
        {
          title: 'কীভাবে ঘটে হিমবাহ ধস [Avalanche Causes & Safety]',
          duration: '4:10',
          youtubeId: 'xB5V7Z8C_ik',
          thumbnailUrl: 'https://img.youtube.com/vi/xB5V7Z8C_ik/hqdefault.jpg'
        }
      ]
    }
  },
  'Landslides': {
    'English': {
      title: 'LANDSLIDES & DEBRIS FLOW',
      beforeTitle: 'BEFORE LANDSLIDES',
      duringAfterTitle: 'DURING & AFTER LANDSLIDES',
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
    },
    'हिन्दी': {
      title: 'भूस्खलन (LANDSLIDES)',
      beforeTitle: 'भूस्खलन से पहले (BEFORE LANDSLIDES)',
      duringAfterTitle: 'भूस्खलन के दौरान और बाद में (DURING & AFTER LANDSLIDES)',
      before: [
        'मिट्टी के कटाव को रोकने के लिए पहाड़ी ढलानों पर गहरी जड़ों वाले पेड़ और पौधे लगाएं।',
        'भूस्खलन के पूर्व संकेतों पर ध्यान दें: दरवाजों/खिड़कियों का अटकना, पेड़ों का झुकना या जमीन में नई दरारें आना।',
        'पहाड़ी नालों और तीखी ढलानों के मुहाने पर मकान बनाने से बचें।'
      ],
      duringAfter: [
        'लगातार भारी बारिश के समय सतर्क रहें; गड़गड़ाहट की आवाज या पानी का रंग अचानक मटमैला होने पर ध्यान दें।',
        'मलबा गिरने या भूस्खलन का रास्ता देखते ही तुरंत स्थिर और ऊंची पहाड़ी रिज की ओर भागें।',
        'जब तक बीआरओ (BRO) या प्रशासन सड़क को सुरक्षित घोषित न करे, भूस्खलन वाले रास्तों को पार न करें।'
      ],
      videos: [
        {
          title: '#भूस्खलन | पहाड़ी ढलानों पर भूस्खलन के प्रारंभिक भूगर्भीय संकेत',
          duration: '3:45',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#भूस्खलन | पहाड़ी राजमार्गों पर वाहन चलाते समय सावधानियां',
          duration: '4:10',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#भूस्खलन | ढलानों की बायो-इंजीनियरिंग और मिट्टी स्थिरीकरण',
          duration: '3:20',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#भूस्खलन | भूस्खलन के बाद सुरक्षा और बचाव कार्य',
          duration: '5:00',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'ভূমিধস (LANDSLIDES)',
      beforeTitle: 'ভূমিধসের আগে (BEFORE LANDSLIDES)',
      duringAfterTitle: 'ভূমিধসের সময় ও পরে (DURING & AFTER LANDSLIDES)',
      before: [
        'মাটির ক্ষয়রোধ করতে পাহাড়ের ঢালে গভীর শিকড়যুক্ত গাছপালা রোপণ করুন।',
        'ভূমিধসের পূর্বলক্ষণ লক্ষ্য করুন: জানলা-দরজা আটকে যাওয়া, গাছ হেলে পড়া বা মাটিতে নতুন ফাটল ধরা।',
        'পাহাড়ি নিকাশি খাতের মুখে বা খাড়া ঢালে বাড়ি তৈরি করা থেকে বিরত থাকুন।'
      ],
      duringAfter: [
        'টানা ভারী বৃষ্টির সময় সতর্ক থাকুন; মাটি গর্জন করার শব্দ বা নদীর জল হঠাৎ ঘোলাটে হলে সাবধান হোন।',
        'পাথর বা কাদার স্রোত নামতে দেখলে অবিলম্বে নিরাপদ ও স্থিতিশীল পাহাড়ি রিজের দিকে চলে যান।',
        'বিআরও (BRO) বা প্রশাসনের অনুমতি ছাড়া ধস কবলিত রাস্তা দিয়ে যাতায়াত করবেন না।'
      ],
      videos: [
        {
          title: '#ভূমিধস | পাহাড়ি ঢালে ভূমিধসের আগাম লক্ষণ',
          duration: '3:45',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ভূমিধস | পাহাড়ি রাস্তায় গাড়ি চলাচলের বিশেষ সতর্কতা',
          duration: '4:10',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ভূমিধস | বায়ো-ইঞ্জিনিয়ারিং পদ্ধতিতে ঢাল সুরক্ষা',
          duration: '3:20',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#ভূমিধস | উদ্ধার ও নিরাপত্তা অভিযান',
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
      beforeTitle: 'BEFORE CLOUDBURSTS',
      duringAfterTitle: 'DURING & AFTER CLOUDBURSTS',
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
    },
    'हिन्दी': {
      title: 'बादल फटना एवं फ्लैश फ्लड (CLOUDBURSTS)',
      beforeTitle: 'बादल फटने से पहले (BEFORE CLOUDBURSTS)',
      duringAfterTitle: 'बादल फटने के दौरान और बाद में (DURING & AFTER CLOUDBURSTS)',
      before: [
        'पहाड़ी बरसाती नालों (गदेरों) और नदी के किनारों पर कैंप या अस्थायी ठिकाने न बनाएं।',
        'पहाड़ों की यात्रा के दौरान पहले से ऊंचे सुरक्षित टीलों और आपातकालीन रास्तों की पहचान करें।',
        'आपातकालीन सीटी, टॉर्च और जरूरी सुरक्षा किट हमेशा साथ रखें।'
      ],
      duringAfter: [
        'पहाड़ी घाटी में अत्यधिक मूसलाधार बारिश शुरू होते ही तुरंत नदी-नालों से दूर ऊंची पहाड़ियों की ओर चढ़ें।',
        'उफनते बरसाती नालों को पैदल या गाड़ी से पार करने का प्रयास कभी न करें।',
        'कमजोर और पत्थरों वाली ढलानों से दूर पक्के सुरक्षित ढांचों में शरण लें।'
      ],
      videos: [
        {
          title: '#बादलफटना | पहाड़ी घाटियों में फ्लैश फ्लड सुरक्षा गाइड',
          duration: '4:20',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#बादलफटना | हिमालयी मानसून यात्रा सुरक्षा प्रोटोकॉल',
          duration: '3:40',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#बादलफटना | घाटी से सुरक्षित निकासी और ऊंची रिज सुरक्षा',
          duration: '3:05',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#बादलफटना | सामुदायिक त्वरित प्रतिक्रिया और सीटी संकेत',
          duration: '4:50',
          youtubeId: '3eZ9aXo1n6k',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    'বাংলা': {
      title: 'মেঘভাঙা বৃষ্টি ও আকস্মিক প্লাবন (CLOUDBURSTS)',
      beforeTitle: 'মেঘভাঙা বৃষ্টির আগে (BEFORE CLOUDBURSTS)',
      duringAfterTitle: 'মেঘভাঙা বৃষ্টির সময় ও পরে (DURING & AFTER CLOUDBURSTS)',
      before: [
        'পাহাড়ি মৌসুমি নদীখাত বা ঝর্ণার মুখে কখনোই তাঁবু বা অস্থায়ী ক্যাম্প তৈরি করবেন না।',
        'হিমালয় বা পাহাড়ি অঞ্চলে ভ্রমণের সময় আগেই উঁচু পাথুরে রিজ এবং জরুরি নির্গমন পথ চিনে রাখুন।',
        'জরুরি বাঁশি, টর্চ এবং প্রাথমিক সুরক্ষা কিট সবসময় সঙ্গে রাখুন।'
      ],
      duringAfter: [
        'পাহাড়ি উপত্যকায় অস্বাভাবিক প্রবল বর্ষণ শুরু হলে তৎক্ষণাৎ নদীখাত ছেড়ে ওপরের পাহাড়ের দিকে উঠুন।',
        'পাহাড়ি খরস্রোতা জলস্রোত পায়ে হেঁটে বা গাড়িতে পার হওয়ার চেষ্টা করবেন না।',
        'দুর্বল আলগা পাথুরে ঢাল থেকে দূরে পাকা ও সুরক্ষিত কাঠামোয় আশ্রয় নিন।'
      ],
      videos: [
        {
          title: '#মেঘভাঙাবৃষ্টি | পাহাড়ি উপত্যকায় হড়পা বান থেকে সুরক্ষাবিধি',
          duration: '4:20',
          youtubeId: '43M5mZuz3JA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#মেঘভাঙাবৃষ্টি | পাহাড়ি বর্ষাকালীন ভ্রমণ ও নিরাপত্তা ব্যবস্থা',
          duration: '3:40',
          youtubeId: 'OqjXl4r2GqA',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#মেঘভাঙাবৃষ্টি | উপত্যকা থেকে দ্রুত নির্গমন ও শৈলশিরা সুরক্ষা',
          duration: '3:05',
          youtubeId: 'bA4A-q6u7n4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
        },
        {
          title: '#মেঘভাঙাবৃষ্টি | আকস্মিক দুর্যোগে বাঁশি সংকেত ও উদ্ধার',
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
