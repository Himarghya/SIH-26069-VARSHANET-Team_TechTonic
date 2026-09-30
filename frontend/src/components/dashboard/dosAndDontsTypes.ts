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

export interface DosDontsData {
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

export const DISASTER_CATEGORIES: DisasterCategory[] = [
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

export const LANGUAGES: LanguageCode[] = [
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

export const CATEGORY_NAMES: Record<DisasterCategory, Record<LanguageCode, string>> = {
  'Cyclones': {
    'English': 'Cyclones',
    'हिन्दी': 'चक्रवात (Cyclones)',
    'বাংলা': 'ঘূর্ণিঝড় (Cyclones)',
    'ગુજરાતી': 'વાવાઝોડું (Cyclones)',
    'ಕನ್ನಡ': 'ಚಂಡಮಾರುತ (Cyclones)',
    'മലയാളം': 'ചുഴലിക്കാറ്റ് (Cyclones)',
    'मराठी': 'चक्रीवादळ (Cyclones)',
    'ଓଡ଼ିଆ': 'ବାତ୍ୟା (Cyclones)',
    'ਪੰਜਾਬੀ': 'ਚੱਕਰਵਾਤ (Cyclones)',
    'தமிழ்': 'புயல் (Cyclones)',
    'తెలుగు': 'తుఫాను (Cyclones)',
    'অসমীয়া': 'ঘূৰ্ণিবতাহ (Cyclones)'
  },
  'Tsunamis': {
    'English': 'Tsunamis',
    'हिन्दी': 'सुनामी (Tsunamis)',
    'বাংলা': 'সুনামি (Tsunamis)',
    'ગુજરાતી': 'સુનામી (Tsunamis)',
    'ಕನ್ನಡ': 'ಸುನಾಮಿ (Tsunamis)',
    'മലയാളം': 'സുനാമി (Tsunamis)',
    'मराठी': 'सुनामी (Tsunamis)',
    'ଓଡ଼ିଆ': 'ସୁନାମି (Tsunamis)',
    'ਪੰਜਾਬੀ': 'ਸੁਨਾਮੀ (Tsunamis)',
    'தமிழ்': 'சுனாமி (Tsunamis)',
    'తెలుగు': 'సునామీ (Tsunamis)',
    'অসমীয়া': 'চুনামী (Tsunamis)'
  },
  'Avalanches': {
    'English': 'Avalanches',
    'हिन्दी': 'हिमस्खलन (Avalanches)',
    'বাংলা': 'হিমবাহ ধস (Avalanches)',
    'ગુજરાતી': 'બરફનું સ્ખલન (Avalanches)',
    'ಕನ್ನಡ': 'ಹಿಮಪಾತ (Avalanches)',
    'മലയാളം': 'ഹിമപാതം (Avalanches)',
    'मराठी': 'हिमस्खलन (Avalanches)',
    'ଓଡ଼ିଆ': 'ହିମପାତ (Avalanches)',
    'ਪੰਜਾਬੀ': 'ਬਰਫੀਲਾ ਤੂਫਾਨ (Avalanches)',
    'தமிழ்': 'பனிச்சரிவு (Avalanches)',
    'తెలుగు': 'హిమపాతం (Avalanches)',
    'অসমীয়া': 'হিমস্খলন (Avalanches)'
  },
  'Cold Wave': {
    'English': 'Cold Wave',
    'हिन्दी': 'शीतलहर (Cold Wave)',
    'বাংলা': 'শৈত্যপ্রবাহ (Cold Wave)',
    'ગુજરાતી': 'શીત લહેર (Cold Wave)',
    'ಕನ್ನಡ': 'ಶೀತ ಮಾರುತ (Cold Wave)',
    'മലയാളം': 'ശീതതരംഗം (Cold Wave)',
    'मराठी': 'थंडीची लाट (Cold Wave)',
    'ଓଡ଼ିଆ': 'ଶୀତ ଲହରୀ (Cold Wave)',
    'ਪੰਜਾਬੀ': 'ਸੀਤ ਲਹਿਰ (Cold Wave)',
    'தமிழ்': 'குளிரலை (Cold Wave)',
    'తెలుగు': 'శీతల గాలులు (Cold Wave)',
    'অসমীয়া': 'শীতপ্ৰবাহ (Cold Wave)'
  },
  'Heat Waves': {
    'English': 'Heat Waves',
    'हिन्दी': 'लू (Heat Waves)',
    'বাংলা': 'তাপপ্রবাহ (Heat Waves)',
    'ગુજરાતી': 'ગરમીની લહેર (Heat Waves)',
    'ಕನ್ನಡ': 'ಬಿಸಿಗಾಳಿ (Heat Waves)',
    'മലയാളം': 'ഉഷ്ണതരംഗം (Heat Waves)',
    'मराठी': 'उष्णतेची लाट (Heat Waves)',
    'ଓଡ଼ିଆ': 'ଗ୍ରୀଷ୍ମ ପ୍ରବାହ (Heat Waves)',
    'ਪੰਜਾਬੀ': 'ਲੂ / ਗਰਮੀ ਦੀ ਲਹਿਰ (Heat Waves)',
    'தமிழ்': 'வெப்ப அலை (Heat Waves)',
    'తెలుగు': 'వడగాల్పులు (Heat Waves)',
    'অসমীয়া': 'তাপপ্ৰবাহ (Heat Waves)'
  },
  'Lightning': {
    'English': 'Lightning',
    'हिन्दी': 'आकाशीय बिजली (Lightning)',
    'বাংলা': 'বজ্রপাত (Lightning)',
    'ગુજરાતી': 'વીજળી પડવી (Lightning)',
    'ಕನ್ನಡ': 'ಮಿಂಚು ಮತ್ತು ಸಿಡಿಲು (Lightning)',
    'മലയാളം': 'മിന്നൽ (Lightning)',
    'मराठी': 'वीज पडणे (Lightning)',
    'ଓଡ଼ିଆ': 'ବଜ୍ରପାତ (Lightning)',
    'ਪੰਜਾਬੀ': 'ਅਸਮਾਨੀ ਬਿਜਲੀ (Lightning)',
    'தமிழ்': 'மின்னல் (Lightning)',
    'తెలుగు': 'పిడుగుపాటు (Lightning)',
    'অসমীয়া': 'বজ্ৰপাত (Lightning)'
  },
  'Floods': {
    'English': 'Floods',
    'हिन्दी': 'बाढ़ (Floods)',
    'বাংলা': 'বন্যা (Floods)',
    'ગુજરાતી': 'પૂર (Floods)',
    'ಕನ್ನಡ': 'ಪ್ರವಾಹ (Floods)',
    'മലയാളം': 'വെള്ളപ്പൊക്കം (Floods)',
    'मराठी': 'पूर (Floods)',
    'ଓଡ଼ିଆ': 'ବନ୍ୟା (Floods)',
    'ਪੰਜਾਬੀ': 'ਹੜ੍ਹ (Floods)',
    'தமிழ்': 'வெள்ளம் (Floods)',
    'తెలుగు': 'వరదలు (Floods)',
    'অসমীয়া': 'বানপানী (Floods)'
  },
  'Earthquakes': {
    'English': 'Earthquakes',
    'हिन्दी': 'भूकंप (Earthquakes)',
    'বাংলা': 'ভূমিকম্প (Earthquakes)',
    'ગુજરાતી': 'ધરતીકંપ (Earthquakes)',
    'ಕನ್ನಡ': 'ಭೂಕಂಪ (Earthquakes)',
    'മലയാളം': 'ഭൂകമ്പം (Earthquakes)',
    'मराठी': 'भूकंप (Earthquakes)',
    'ଓଡ଼ିଆ': 'ଭୂମିକମ୍ପ (Earthquakes)',
    'ਪੰਜਾਬੀ': 'ਭੂਚਾਲ (Earthquakes)',
    'தமிழ்': 'நிலநடுக்கம் (Earthquakes)',
    'తెలుగు': 'భూకంపం (Earthquakes)',
    'অসমীয়া': 'ভূমিকম্প (Earthquakes)'
  },
  'Urban Floods': {
    'English': 'Urban Floods',
    'हिन्दी': 'शहरी बाढ़ (Urban Floods)',
    'বাংলা': 'শহুরে বন্যা (Urban Floods)',
    'ગુજરાતી': 'શહેરી પૂર (Urban Floods)',
    'ಕನ್ನಡ': 'ನಗರ ಪ್ರವಾಹ (Urban Floods)',
    'മലയാളം': 'നഗര വെള്ളപ്പൊക്കം (Urban Floods)',
    'मराठी': 'शहरी पूर (Urban Floods)',
    'ଓଡ଼ିଆ': 'ସହରାଞ୍ଚଳ ବନ୍ୟା (Urban Floods)',
    'ਪੰਜਾਬੀ': 'ਸ਼ਹਿਰੀ ਹੜ੍ਹ (Urban Floods)',
    'தமிழ்': 'நகர்ப்புற வெள்ளம் (Urban Floods)',
    'తెలుగు': 'పట్టణ వరదలు (Urban Floods)',
    'অসমীয়া': 'নগৰীয়া বান (Urban Floods)'
  },
  'Landslides': {
    'English': 'Landslides',
    'हिन्दी': 'भूस्खलन (Landslides)',
    'বাংলা': 'ভূমিধস (Landslides)',
    'ગુજરાતી': 'જમીન ધસી પડવી (Landslides)',
    'ಕನ್ನಡ': 'ಭೂಕುಸಿತ (Landslides)',
    'മലയാളം': 'ഉരുൾപൊട്ടൽ (Landslides)',
    'मराठी': 'दरड कोसळणे (Landslides)',
    'ଓଡ଼ିଆ': 'ଭୂସ୍ଖଳନ (Landslides)',
    'ਪੰਜਾਬੀ': 'ਜ਼ਮੀਨ ਖਿਸਕਣਾ (Landslides)',
    'தமிழ்': 'நிலச்சரிவு (Landslides)',
    'తెలుగు': 'కొండచరియలు (Landslides)',
    'অসমীয়া': 'ভূমিস্খলন (Landslides)'
  },
  'Cloudbursts': {
    'English': 'Cloudbursts',
    'हिन्दी': 'बादल फटना (Cloudbursts)',
    'বাংলা': 'মেঘভাঙা বৃষ্টি (Cloudbursts)',
    'ગુજરાતી': 'વાદળ ફાટવું (Cloudbursts)',
    'ಕನ್ನಡ': 'ಮೇಘಸ್ಫೋಟ (Cloudbursts)',
    'മലയാളം': 'മേഘവിസ്ഫോടനം (Cloudbursts)',
    'मराठी': 'ढगफुटी (Cloudbursts)',
    'ଓଡ଼ିଆ': 'ମେଘ ଫାଟିବା (Cloudbursts)',
    'ਪੰਜਾਬੀ': 'ਬੱਦਲ ਫਟਣਾ (Cloudbursts)',
    'தமிழ்': 'மேகவெடிப்பு (Cloudbursts)',
    'తెలుగు': 'మేఘవిస్ఫోటనం (Cloudbursts)',
    'অসমীয়া': 'মেঘভঙা বৰষুণ (Cloudbursts)'
  }
};

export const UI_TEXT: Record<LanguageCode, {
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
  },
  'ગુજરાતી': {
    dosAndDonts: "શું કરવું અને શું ન કરવું (Dos and Don'ts)",
    eventsLabel: "આપત્તિઓ (Events):",
    searchPlaceholder: "આપત્તિ શોધો...",
    beforePrefix: "આપત્તિ પહેલાં (BEFORE)",
    duringAfterPrefix: "દરમિયાન અને પછી (DURING & AFTER)",
    videoSection: "વિડિઓ સુરક્ષા માર્ગદર્શિકા (Video Section)",
    officialSafety: "સત્તાવાર એનડીએમએ સુરક્ષા",
    footerNotice: "રાષ્ટ્રીય આપત્તિ વ્યવસ્થાપન સત્તામંડળ (NDMA) નાગરિક સુરક્ષા માર્ગદર્શિકા"
  },
  'ಕನ್ನಡ': {
    dosAndDonts: "ಮಾಡಬೇಕಾದ ಮತ್ತು ಮಾಡಬಾರದ ಕೆಲಸಗಳು (Dos and Don'ts)",
    eventsLabel: "ವಿಪತ್ತುಗಳು (Events):",
    searchPlaceholder: "ವಿಪತ್ತನ್ನು ಹುಡುಕಿ...",
    beforePrefix: "ವಿಪತ್ತಿಗೆ ಮುನ್ನ (BEFORE)",
    duringAfterPrefix: "ಸಮಯದಲ್ಲಿ ಮತ್ತು ನಂತರ (DURING & AFTER)",
    videoSection: "ವೀಡಿಯೊ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶಿ (Video Section)",
    officialSafety: "ಅಧಿಕೃತ NDMA ಸುರಕ್ಷತೆ",
    footerNotice: "ರಾಷ್ಟ್ರೀಯ ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ (NDMA) ನಾಗರಿಕ ಸುರಕ್ಷತಾ ಮಾರ್ಗಸೂಚಿಗಳು"
  },
  'മലയാളം': {
    dosAndDonts: "ചെയ്യേണ്ടതും ചെയ്യരുതാത്തതും (Dos and Don'ts)",
    eventsLabel: "ദുരന്തങ്ങൾ (Events):",
    searchPlaceholder: "ദുരന്തം തിരയുക...",
    beforePrefix: "ദുരന്തത്തിന് മുൻപ് (BEFORE)",
    duringAfterPrefix: "സമയത്തും ശേഷവും (DURING & AFTER)",
    videoSection: "വീഡിയോ സുരക്ഷാ മാർഗ്ഗനിർദ്ദേശങ്ങൾ (Video Section)",
    officialSafety: "ഔദ്യോഗിക NDMA സുരക്ഷ",
    footerNotice: "ദേശീയ ദുരന്ത നിവാരണ അതോറിറ്റി (NDMA) പൗര സുരക്ഷാ മാർഗ്ഗനിർദ്ദേശങ്ങൾ"
  },
  'मराठी': {
    dosAndDonts: "काय करावे आणि काय करू नये (Dos and Don'ts)",
    eventsLabel: "आपत्ती (Events):",
    searchPlaceholder: "आपत्ती शोधा...",
    beforePrefix: "आपत्तीपूर्वी (BEFORE)",
    duringAfterPrefix: "दरम्यान आणि नंतर (DURING & AFTER)",
    videoSection: "व्हिडिओ सुरक्षा मार्गदर्शिका (Video Section)",
    officialSafety: "अधिकृत NDMA सुरक्षा",
    footerNotice: "राष्ट्रीय आपत्ती व्यवस्थापन प्राधिकरण (NDMA) नागरिक सुरक्षा मार्गदर्शक तत्त्वे"
  },
  'ଓଡ଼ିଆ': {
    dosAndDonts: "କଣ କରିବେ ଏବଂ କଣ କରିବେ ନାହିଁ (Dos and Don'ts)",
    eventsLabel: "ବିପର୍ଯ୍ୟୟ (Events):",
    searchPlaceholder: "ବିପର୍ଯ୍ୟୟ ଖୋଜନ୍ତୁ...",
    beforePrefix: "ବିପର୍ଯ୍ୟୟ ପୂର୍ବରୁ (BEFORE)",
    duringAfterPrefix: "ସମୟରେ ଏବଂ ପରେ (DURING & AFTER)",
    videoSection: "ଭିଡିଓ ସୁରକ୍ଷା ନିର୍ଦ୍ଦେଶାବଳୀ (Video Section)",
    officialSafety: "ସରକାରୀ NDMA ସୁରକ୍ଷା",
    footerNotice: "ଜାତୀୟ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପ୍ରାଧିକରଣ (NDMA) ନାଗରିକ ସୁରକ୍ଷା ନିର୍ଦ୍ଦେଶାବଳୀ"
  },
  'ਪੰਜਾਬੀ': {
    dosAndDonts: "ਕੀ ਕਰਨਾ ਅਤੇ ਕੀ ਨਹੀਂ ਕਰਨਾ (Dos and Don'ts)",
    eventsLabel: "ਆਫ਼ਤਾਂ (Events):",
    searchPlaceholder: "ਆਫ਼ਤ ਖੋਜੋ...",
    beforePrefix: "ਆਫ਼ਤ ਤੋਂ ਪਹਿਲਾਂ (BEFORE)",
    duringAfterPrefix: "ਦੌਰਾਨ ਅਤੇ ਬਾਅਦ ਵਿੱਚ (DURING & AFTER)",
    videoSection: "ਵੀਡੀਓ ਸੁਰੱਖਿਆ ਗਾਈਡ (Video Section)",
    officialSafety: "ਸਰਕਾਰੀ NDMA ਸੁਰੱਖਿਆ",
    footerNotice: "ਰਾਸ਼ਟਰੀ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਅਥਾਰਟੀ (NDMA) ਨਾਗਰਿਕ ਸੁਰੱਖਿਆ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼"
  },
  'தமிழ்': {
    dosAndDonts: "செய்ய வேண்டியவை மற்றும் செய்யக்கூடாதவை (Dos and Don'ts)",
    eventsLabel: "பேரிடர்கள் (Events):",
    searchPlaceholder: "பேரிடரைத் தேடுங்கள்...",
    beforePrefix: "பேரிடருக்கு முன் (BEFORE)",
    duringAfterPrefix: "பேரிடரின் போதும் அதற்குப் பிறகும் (DURING & AFTER)",
    videoSection: "வீடியோ பாதுகாப்பு வழிகாட்டி (Video Section)",
    officialSafety: "அதிகாரப்பூர்வ NDMA பாதுகாப்பு",
    footerNotice: "தேசிய பேரிடர் மேலாண்மை ஆணையம் (NDMA) குடிமக்கள் பாதுகாப்பு வழிகாட்டுதல்கள்"
  },
  'తెలుగు': {
    dosAndDonts: "చేయవలసినవి మరియు చేయకూడనివి (Dos and Don'ts)",
    eventsLabel: "విపత్తులు (Events):",
    searchPlaceholder: "విపత్తును శోధించండి...",
    beforePrefix: "విపత్తుకు ముందు (BEFORE)",
    duringAfterPrefix: "సమయంలో మరియు తరువాత (DURING & AFTER)",
    videoSection: "వీడియో భద్రతా మార్గదర్శిని (Video Section)",
    officialSafety: "అధికారిక NDMA భద్రత",
    footerNotice: "జాతీయ విపత్తు నిర్వహణ సంస్థ (NDMA) పౌర భద్రతా మార్గదర్శకాలు"
  },
  'অসমীয়া': {
    dosAndDonts: "কৰণীয় আৰু বৰ্জনীয় (Dos and Don'ts)",
    eventsLabel: "দূৰ্যোগসমূহ (Events):",
    searchPlaceholder: "দূৰ্যোগ সন্ধান কৰক...",
    beforePrefix: "দূৰ্যোগৰ পূৰ্বে (BEFORE)",
    duringAfterPrefix: "দূৰ্যোগৰ সময়ত আৰু পিছত (DURING & AFTER)",
    videoSection: "ভিডিঅ' সুৰক্ষা নিৰ্দেশনাৱলী (Video Section)",
    officialSafety: "চৰকাৰী NDMA সুৰক্ষা",
    footerNotice: "ৰাষ্ট্ৰীয় দূৰ্যোগ ব্যৱস্থাপনা প্ৰাধিকৰণ (NDMA) নাগৰিক সুৰক্ষা নিৰ্দেশনাৱলী"
  }
};
