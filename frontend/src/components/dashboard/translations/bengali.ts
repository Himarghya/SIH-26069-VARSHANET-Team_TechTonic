import { DisasterCategory, DosDontsData } from '../dosAndDontsTypes';

export const bengaliContent: Record<DisasterCategory, DosDontsData> = {
  'Cyclones': {
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
  },
  'Floods': {
    title: 'বন্যা (FLOODS)',
    beforeTitle: 'বন্যার আগে (BEFORE FLOODS)',
    duringAfterTitle: 'বন্যার সময় ও পরে (DURING & AFTER FLOODS)',
    before: [
      'আপনার এলাকার সম্ভাব্য বন্যার জলস্তর ও নিকটবর্তী নিরাপদ উঁচু স্থান সম্পর্কে জানুন।',
      'বাড়ির ইলেকট্রিক মিটার, হিটার ও সুইচবোর্ড মেঝের থেকে উঁচুতে স্থাপন করুন।',
      'বেসমেন্ট ও একতলার দেওয়ালে জলরোধী প্রলেপ লাগান।',
      'জরুরি বাতি, চার্জড পাওয়ার ব্যাংক ও ফার্স্ট এইড কিট হাতের কাছে রাখুন।'
    ],
    duringAfter: [
      'বন্যার জলে হাঁটা, সাঁতার কাটা বা গাড়ি চালানো থেকে সম্পূর্ণ বিরত থাকুন।',
      'ভেঙে পড়ার ঝুঁকি এড়াতে জলমগ্ন সেতু বা সাঁকো পার হবেন না।',
      'ট্যাপের জল ফুটিয়ে অথবা সুরক্ষিত বোতলজাত জল পান করুন।',
      'বন্যার জলের সংস্পর্শে আসা যেকোনো খাবার ফেলে দিন।'
    ],
    videos: [
      {
        title: '#বন্যা | বন্যা সুরক্ষা ও আগাম স্থানান্তর নির্দেশিকা',
        duration: '3:15',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#বন্যা | বিদ্যুৎ ও জল দূষণ থেকে আত্মরক্ষা',
        duration: '4:00',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#বন্যা | প্লাবিত রাস্তায় নিরাপদ যান চলাচল নিয়মাবলী',
        duration: '2:50',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#বন্যা | বন্যা পরবর্তী ঘরবাড়ি জীবাণুমুক্তকরণ পদ্ধতি',
        duration: '5:10',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Urban Floods': {
    title: 'শহুরে বন্যা ও জলমগ্নতা (URBAN FLOODS)',
    beforeTitle: 'শহুরে বন্যার আগে (BEFORE URBAN FLOODING)',
    duringAfterTitle: 'শহুরে বন্যার সময় ও পরে (DURING & AFTER URBAN FLOODING)',
    before: [
      'বাড়ির ছাদ ও নিকাশি ড্রেনের আবর্জনা নিয়মিত পরিষ্কার করুন।',
      'ড্রেনের জল ঘরে ঢোকা আটকাতে নিকাশি পাইপে নন-রিটার্ন ভালভ লাগান।',
      'একতলার ইলেকট্রিক প্লাগ পয়েন্ট ও যন্ত্রপাতি কিছুটা উঁচুতে রাখুন।'
    ],
    duringAfter: [
      'খোলা ম্যানহোল, ড্রেন এবং জলে নিমজ্জিত বিদ্যুতের খুঁটি থেকে দূরে থাকুন।',
      'টানা বৃষ্টির সময় আন্ডারপাস বা বেসমেন্টে গাড়ি নিয়ে ঢুকবেন না।',
      'বাড়িতে জল ঢুকতে শুরু করলে সঙ্গে সঙ্গে মেইন সুইচ বন্ধ করে দিন।'
    ],
    videos: [
      {
        title: '#শহুরেবন্যা | বর্ষায় ড্রেনেজ ও বেসমেন্ট সুরক্ষা',
        duration: '4:05',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#শহুরেবন্যা | বিদ্যুত্স্পৃষ্ট ও খোলা ড্রেনের বিপদ থেকে সাবধান',
        duration: '3:20',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#শহুরেবন্যা | আন্ডারপাস ও শহরে চলাচলের সুরক্ষা নিয়ম',
        duration: '3:50',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#শহুরেবন্যা | নর্দমার জল উল্টো ঢোকা প্রতিরোধের উপায়',
        duration: '4:45',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Lightning': {
    title: 'বজ্রপাত ও কালবৈশাখী (LIGHTNING)',
    beforeTitle: 'বজ্রপাতের আগে (BEFORE LIGHTNING)',
    duringAfterTitle: 'বজ্রপাতের সময় ও পরে (DURING & AFTER LIGHTNING)',
    before: [
      'মাঠে নামার বা বাইরে যাওয়ার আগে আবহাওয়ার রাডার ও দামিনী (Damini) অ্যাপ দেখুন।',
      'উঁচু বাড়ি ও খামারে গুণমানসম্পন্ন বজ্রনিরোধক দণ্ড (Lightning Conductor) লাগান।',
      'ঝড় শুরু হওয়ার আগে টিভি ও দামি বৈদ্যুতিক সরঞ্জামের প্লাগ খুলে রাখুন।'
    ],
    duringAfter: [
      '৩০-৩০ নিরাপত্তা বিধি: বিদ্যুৎ চমকানো ও মেঘ ডাকার মাঝে ব্যবধান ৩০ সেকেন্ডের কম হলে পাকা ঘরে আশ্রয় নিন।',
      'একক উঁচু গাছ, টিনের ছাউনি বা লোহার পিলারের নিচে কখনোই দাঁড়াবেন না।',
      'খোলা জায়গায় থাকলে উবু হয়ে বসে মাথা দুই হাঁটুর মাঝে গুটিয়ে রাখুন (Lightning Crouch)।'
    ],
    videos: [
      {
        title: '#বজ্রপাত | ৩০-৩০ নিরাপত্তা নিয়ম ও আত্মরক্ষা',
        duration: '2:30',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#বজ্রপাত | বজ্রনিরোধক দণ্ড স্থাপন নির্দেশিকা',
        duration: '3:45',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#বজ্রপাত | কৃষক ও মাঠের সুরক্ষাবিধি',
        duration: '4:10',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#বজ্রপাত | বজ্রাহত ব্যক্তির জরুরি প্রাথমিক চিকিৎসা (CPR)',
        duration: '5:15',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Heat Waves': {
    title: 'তাপপ্রবাহ ও সানস্ট্রোক (HEAT WAVES)',
    beforeTitle: 'তাপপ্রবাহের আগে (BEFORE HEAT WAVE)',
    duringAfterTitle: 'তাপপ্রবাহের সময় ও পরে (DURING & AFTER HEAT WAVE)',
    before: [
      'পর্যাপ্ত ওআরএস (ORS), লেবুর জল, ডাবের জল ও ঘোল পান করে শরীর আর্দ্র রাখুন।',
      'জানলায় ভারী পর্দা লাগান এবং ছাদ চুনকাম করে রোদ প্রতিফলিত করুন।',
      'কঠিন পরিশ্রমের কাজ খুব ভোরে অথবা বিকেলে সম্পন্ন করুন।'
    ],
    duringAfter: [
      'দুপুর ১২টা থেকে বিকেল ৩টে পর্যন্ত চড়া রোদে বের হবেন না।',
      'হালকা রঙের ঢিলেঢালা সুতির পোশাক, সানগ্লাস ও ছাতা/টুপি ব্যবহার করুন।',
      'বন্ধ গাড়ির ভেতর শিশুদের বা পোষ্যদের কখনোই একা ফেলে যাবেন না।',
      'মাথা ঘোরা বা দুর্বল লাগলে সঙ্গে সঙ্গে ছায়াযুক্ত স্থানে বিশ্রাম নিয়ে ভেজা কাপড় লাগান।'
    ],
    videos: [
      {
        title: '#Heatwave | গ্রীষ্মকালে ঘর কীভাবে ঠান্ডা রাখবেন ? | NDMA',
        duration: '0:54',
        youtubeId: 'PndkLH1tTWQ',
        thumbnailUrl: 'https://img.youtube.com/vi/PndkLH1tTWQ/hqdefault.jpg'
      },
      {
        title: '#Heatwave | শহরে তাপপ্রবাহের প্রভাব কীভাবে হ্রাস করবেন ? | NDMA',
        duration: '0:56',
        youtubeId: 'W1iqMZC5gUk',
        thumbnailUrl: 'https://img.youtube.com/vi/W1iqMZC5gUk/hqdefault.jpg'
      },
      {
        title: '#Heatwave | প্রচণ্ড গরমে গৃহহীন ও যাযাবর মানুষদের সহায়তা',
        duration: '0:52',
        youtubeId: 'qBVXhX_xbYQ',
        thumbnailUrl: 'https://img.youtube.com/vi/qBVXhX_xbYQ/hqdefault.jpg'
      },
      {
        title: '#Heatwave | শ্রমিক ও কর্মজীবী মানুষ তাপপ্রবাহ থেকে কীভাবে বাঁচবেন ? | NDMA',
        duration: '0:47',
        youtubeId: 'WjUrCh3D0yA',
        thumbnailUrl: 'https://img.youtube.com/vi/WjUrCh3D0yA/hqdefault.jpg'
      }
    ]
  },
  'Cold Wave': {
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
        title: '#শৈত্যপ্রবাহ | শৈত্যপ্রবাহের সময় কী করবেন এবং কী করবেন না',
        duration: '3:15',
        youtubeId: '3dGT8jQQvLw',
        thumbnailUrl: 'https://img.youtube.com/vi/3dGT8jQQvLw/hqdefault.jpg'
      },
      {
        title: '#শৈত্যপ্রবাহ | শ্রমিক ও কর্মজীবী মানুষের জন্য করণীয় ও বর্জনীয়',
        duration: '3:45',
        youtubeId: 'pl89ipXtGvk',
        thumbnailUrl: 'https://img.youtube.com/vi/pl89ipXtGvk/hqdefault.jpg'
      },
      {
        title: '#শৈত্যপ্রবাহ | শৈত্যপ্রবাহে কৃষকদের করণীয় সুরক্ষা নির্দেশিকা',
        duration: '4:10',
        youtubeId: 'JdSYoPPx1io',
        thumbnailUrl: 'https://img.youtube.com/vi/JdSYoPPx1io/hqdefault.jpg'
      },
      {
        title: '#শৈত্যপ্রবাহ | পাহাড়ি অঞ্চলের বাসিন্দাদের জন্য বিশেষ সতর্কতা',
        duration: '3:30',
        youtubeId: 'yYSfPDfIqMg',
        thumbnailUrl: 'https://img.youtube.com/vi/yYSfPDfIqMg/hqdefault.jpg'
      }
    ]
  },
  'Earthquakes': {
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
  },
  'Tsunamis': {
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
      'সমুদ্রের জল পিছিয়ে যাওয়ার দৃশ্য দেখতে বা মাছ ধরতে কখনোই সমুদ্র সৈকতে যাবেন না।',
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
  },
  'Avalanches': {
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
  },
  'Landslides': {
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
  },
  'Cloudbursts': {
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
};
