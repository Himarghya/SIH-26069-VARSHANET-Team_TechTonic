import { DisasterCategory, DosDontsData } from '../dosAndDontsTypes';

export const hindiContent: Record<DisasterCategory, DosDontsData> = {
  'Cyclones': {
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
  'Floods': {
    title: 'बाढ़ (FLOODS)',
    beforeTitle: 'बाढ़ से पहले (BEFORE FLOODS)',
    duringAfterTitle: 'बाढ़ के दौरान और बाद में (DURING & AFTER FLOODS)',
    before: [
      'अपने इलाके के संभावित बाढ़ स्तर और निकटतम सुरक्षित ऊंचे स्थानों की जानकारी रखें।',
      'घर के बिजली के मीटर, हीटर और महत्वपूर्ण उपकरणों को भूतल से ऊपर स्थापित करें।',
      'तहखाने और बेसमेंट की दीवारों पर वॉटरप्रूफिंग रसायन लगाकर रिसाव रोकें।',
      'आपातकालीन बैटरी लाइट, चार्ज पावर बैंक और जरूरी दवाएं तैयार रखें।'
    ],
    duringAfter: [
      'बाढ़ के बहते पानी में कभी न चलें, न तैरें और न ही वाहन चलाएं।',
      'तेज बहाव वाले पुलों और जलमग्न रास्तों से दूर रहें क्योंकि नींव ढहने का खतरा होता है।',
      'पीने का पानी हमेशा उबालकर पिएं या सुरक्षित सीलबंद पानी का उपयोग करें।',
      'बाढ़ के पानी के संपर्क में आए किसी भी खाद्य पदार्थ का सेवन न करें।'
    ],
    videos: [
      {
        title: '#बाढ़ | बाढ़ सुरक्षा एवं प्रारंभिक निकासी प्रोटोकॉल',
        duration: '3:15',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#बाढ़ | बिजली एवं जल संदूषण सुरक्षा सावधानियां',
        duration: '4:00',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#बाढ़ | जलभराव के दौरान सुरक्षित ड्राइविंग नियम',
        duration: '2:50',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#बाढ़ | बाढ़ के बाद सफाई एवं कीटाणुशोधन के उपाय',
        duration: '5:10',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Urban Floods': {
    title: 'शहरी बाढ़ एवं जलभराव (URBAN FLOODS)',
    beforeTitle: 'शहरी बाढ़ से पहले (BEFORE URBAN FLOODING)',
    duringAfterTitle: 'शहरी बाढ़ के दौरान और बाद में (DURING & AFTER URBAN FLOODING)',
    before: [
      'घर की छतों के परनाले और सामने की नालियों की कचरे से सफाई सुनिश्चित करें।',
      'सीवेज बैकफ्लो रोकने के लिए घर के प्लंबिंग में नॉन-रिटर्न चेक वाल्व लगाएं।',
      'ग्राउंड फ्लोर पर लगे इलेक्ट्रिक बोर्ड और प्लग पॉइंट को सुरक्षित ऊंचाई पर रखें।'
    ],
    duringAfter: [
      'खुले मैनहोल, नालों और पानी में डूबे बिजली के खंभों के पास कभी न जाएं।',
      'भारी बारिश के दौरान अंडरपास, सब-वे और बेसमेंट में जाने से बचें।',
      'यदि घर में पानी भरने लगे, तो मुख्य बिजली स्विच (Main Board) तुरंत बंद कर दें।'
    ],
    videos: [
      {
        title: '#शहरीबाढ़ | मानसून जल निकासी एवं बेसमेंट सुरक्षा',
        duration: '4:05',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#शहरीबाढ़ | करंट लगने और खुले नालों के खतरों से बचाव',
        duration: '3:20',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#शहरीबाढ़ | अंडरपास एवं शहर में आवागमन सुरक्षा नियम',
        duration: '3:50',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#शहरीबाढ़ | सीवेज बैकफ्लो रोकथाम प्रणाली',
        duration: '4:45',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Lightning': {
    title: 'आकाशीय बिजली एवं तड़ित (LIGHTNING)',
    beforeTitle: 'बिजली गिरने से पहले (BEFORE LIGHTNING)',
    duringAfterTitle: 'बिजली गिरने के दौरान और बाद में (DURING & AFTER LIGHTNING)',
    before: [
      'खेतों में काम करने या बाहर जाने से पहले मौसम रडार और दामिनी (Damini) ऐप देखें।',
      'ऊंची इमारतों और फार्म शेड पर मानक तड़ित चालक (Lightning Arrester) लगवाएं।',
      'तूफान आने से पहले टीवी, कंप्यूटर और संवेदनशील इलेक्ट्रॉनिक उपकरण अनप्लग करें।'
    ],
    duringAfter: [
      '30-30 सुरक्षा नियम: बिजली चमकने और गड़गड़ाहट में 30 सेकंड से कम अंतर हो तो तुरंत पक्के आश्रय में जाएं।',
      'अकेले खड़े पेड़ों, लोहे के खंभों या खुली टिन की छतों के नीचे कभी शरण न लें।',
      'यदि खुले में फंस जाएं, तो पंजों के बल बैठकर सिर घुटनों में छिपा लें (Lightning Crouch)।'
    ],
    videos: [
      {
        title: '#आकाशीयबिजली | 30-30 सुरक्षा नियम और खुले में बचाव',
        duration: '2:30',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#आकाशीयबिजली | तड़ित चालक (Lightning Conductor) स्थापना गाइड',
        duration: '3:45',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#आकाशीयबिजली | किसानों एवं ग्रामीण क्षेत्रों के लिए सुरक्षा नियम',
        duration: '4:10',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#आकाशीयबिजली | बिजली गिरने पर प्राथमिक उपचार (CPR विधि)',
        duration: '5:15',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Heat Waves': {
    title: 'लू एवं अत्यधिक गर्मी (HEAT WAVES)',
    beforeTitle: 'लू से पहले (BEFORE HEAT WAVE)',
    duringAfterTitle: 'लू के दौरान और बाद में (DURING & AFTER HEAT WAVE)',
    before: [
      'ओआरएस (ORS), छाछ, नींबू पानी, आम पन्ना और नारियल पानी जैसे तरल पदार्थ पर्याप्त मात्रा में पिएं।',
      'कमरों में पर्दे लगाएं, खिड़कियों पर रिफ्लेक्टिव शेड लगाएं या छतों पर चूना/सफेद पेंट करवाएं।',
      'कड़ी धूप और भारी शारीरिक मेहनत वाले काम सुबह जल्दी या शाम को करें।'
    ],
    duringAfter: [
      'दोपहर 12:00 बजे से 3:00 बजे के बीच तेज धूप में बाहर जाने से बचें।',
      'हल्के रंग के ढीले सूती कपड़े पहनें, धूप का चश्मा और टोपी/गमछा जरूर लगाएं।',
      'खड़ी धूप में बंद गाड़ी के अंदर बच्चों या पालतू जानवरों को कभी अकेला न छोड़ें।',
      'चक्कर आने या कमजोरी पर तुरंत छांव में बैठें, ठंडी पट्टी लगाएं और पानी पिएं।'
    ],
    videos: [
      {
        title: '#Heatwave | गर्मियों में अपने घर को ठंडा कैसे रखें ? | NDMA',
        duration: '0:54',
        youtubeId: 'PndkLH1tTWQ',
        thumbnailUrl: 'https://img.youtube.com/vi/PndkLH1tTWQ/hqdefault.jpg'
      },
      {
        title: '#Heatwave | शहरों में लू के प्रभाव को कैसे कम करें ? | NDMA',
        duration: '0:56',
        youtubeId: 'W1iqMZC5gUk',
        thumbnailUrl: 'https://img.youtube.com/vi/W1iqMZC5gUk/hqdefault.jpg'
      },
      {
        title: '#Heatwave | भीषण गर्मी में बेघर और जरूरतमंदों की मदद कैसे करें ?',
        duration: '0:52',
        youtubeId: 'qBVXhX_xbYQ',
        thumbnailUrl: 'https://img.youtube.com/vi/qBVXhX_xbYQ/hqdefault.jpg'
      },
      {
        title: '#Heatwave | मजदूर और कामकाजी व्यक्ति लू से अपना बचाव कैसे करें ? | NDMA',
        duration: '0:47',
        youtubeId: 'WjUrCh3D0yA',
        thumbnailUrl: 'https://img.youtube.com/vi/WjUrCh3D0yA/hqdefault.jpg'
      }
    ]
  },
  'Cold Wave': {
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
        title: '#Coldwave | शीतलहर के दौरान क्या करें - क्या ना करें',
        duration: '3:15',
        youtubeId: '3dGT8jQQvLw',
        thumbnailUrl: 'https://img.youtube.com/vi/3dGT8jQQvLw/hqdefault.jpg'
      },
      {
        title: '#Coldwave | मजदूर और कामकाजी व्यक्ति शीतलहर के दौरान क्या करें - क्या न करें।',
        duration: '3:45',
        youtubeId: 'pl89ipXtGvk',
        thumbnailUrl: 'https://img.youtube.com/vi/pl89ipXtGvk/hqdefault.jpg'
      },
      {
        title: '#Coldwave | शीतलहर से पहले और उसके दौरान किसान क्या करें - क्या ना करें',
        duration: '4:10',
        youtubeId: 'JdSYoPPx1io',
        thumbnailUrl: 'https://img.youtube.com/vi/JdSYoPPx1io/hqdefault.jpg'
      },
      {
        title: '#Coldwave | Do\'s and don\'ts of a cold wave for people residing in hilly regions',
        duration: '3:30',
        youtubeId: 'yYSfPDfIqMg',
        thumbnailUrl: 'https://img.youtube.com/vi/yYSfPDfIqMg/hqdefault.jpg'
      }
    ]
  },
  'Earthquakes': {
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
  'Tsunamis': {
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
  'Avalanches': {
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
  'Landslides': {
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
  'Cloudbursts': {
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
  }
};
