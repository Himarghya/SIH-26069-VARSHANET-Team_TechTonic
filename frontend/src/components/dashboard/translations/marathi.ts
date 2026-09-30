import { DisasterCategory, DosDontsData } from '../dosAndDontsTypes';

export const marathiContent: Record<DisasterCategory, DosDontsData> = {
  'Cyclones': {
    title: 'चक्रीवादळ (CYCLONE)',
    beforeTitle: 'चक्रीवादळापूर्वी (BEFORE CYCLONE)',
    duringAfterTitle: 'चक्रीवादळादरम्यान आणि नंतर (DURING & AFTER CYCLONE)',
    before: [
      'अफवांवर विश्वास ठेवू नका, शांत राहा आणि घाबरू नका.',
      'आपत्कालीन संपर्कासाठी मोबाईल फोन पूर्ण चार्ज ठेवा; SMS चा वापर करा.',
      'हवामानाच्या ताज्या माहितीसाठी रेडिओ, टीव्ही आणि अधिकृत बुलेटिन पाहा.',
      'महत्त्वाची कागदपत्रे आणि मौल्यवान वस्तू वॉटरप्रूफ पिशवीत किंवा उंचावर ठेवा.',
      'सुका खाऊ, पिण्याचे पाणी, टॉर्च, प्रथमोपचार किट आणि आवश्यक औषधे तयार ठेवा.',
      'घराचे छत आणि खिडक्या दुरुस्त करून सुरक्षित करा; बाहेर टोकदार वस्तू उघड्या ठेवू नका.'
    ],
    duringAfter: [
      'जनावरांना दोरीने बांधून ठेवू नका जेणेकरून संकटाच्या वेळी ते सुरक्षित ठिकाणी पळू शकतील.',
      'वादळी लाटा किंवा पुराचा इशारा मिळताच जवळच्या सुरक्षित वादळ निवारण केंद्रात जा.',
      'किमान आठवडाभर पुरेल एवढे सुके अन्न आणि स्वच्छ पिण्याचे पाणी साठवून ठेवा.',
      'दरवाजे आणि खिडक्या घट्ट बंद ठेवा. वादळाचा डोळा (Eye) शांत असतानाही घराबाहेर पडू नका.',
      'प्रशासनाकडून सूचना मिळेपर्यंत सुरक्षित निवारण केंद्रातच राहा.'
    ],
    videos: [
      {
        title: '#Cyclone | चक्रीवादळादरम्यान काय करावे आणि काय करू नये | NDMA',
        duration: '3:15',
        youtubeId: 'B9qR2e3xyJo',
        thumbnailUrl: 'https://img.youtube.com/vi/B9qR2e3xyJo/hqdefault.jpg'
      },
      {
        title: '#Cyclone | वादळाच्या वेळी घराबाहेर असताना घ्यायची काळजी | NDMA',
        duration: '2:45',
        youtubeId: 'CcvOhT7n3y8',
        thumbnailUrl: 'https://img.youtube.com/vi/CcvOhT7n3y8/hqdefault.jpg'
      },
      {
        title: '#Cyclone | चक्रीवादळापूर्वी कोणती तयारी करावी ?',
        duration: '3:30',
        youtubeId: '-vqBNQ0Fhq8',
        thumbnailUrl: 'https://img.youtube.com/vi/-vqBNQ0Fhq8/hqdefault.jpg'
      },
      {
        title: '#Cyclone | घराची सुरक्षितता आणि छत मजबुतीकरण | NDMA',
        duration: '4:10',
        youtubeId: 'Gm9c9EehO2g',
        thumbnailUrl: 'https://img.youtube.com/vi/Gm9c9EehO2g/hqdefault.jpg'
      }
    ]
  },
  'Floods': {
    title: 'पूर (FLOODS)',
    beforeTitle: 'पुरापूर्वी (BEFORE FLOODS)',
    duringAfterTitle: 'पुरादरम्यान आणि नंतर (DURING & AFTER FLOODS)',
    before: [
      'तुमच्या परिसरातील पूर पातळी आणि जवळच्या उंच सुरक्षित जागांची माहिती ठेवा.',
      'घरातील वीज मीटर, हिटर आणि उपकरणे तळमजल्यापासून उंचावर लावा.',
      'तळघरातील भिंतींना वॉटरप्रूफिंग करून गळती रोखा.',
      'इमर्जन्सी बॅटरी लाईट, पॉवर बँक आणि प्रथमोपचार किट तयार ठेवा.'
    ],
    duringAfter: [
      'पुराच्या वाहत्या पाण्यातून कधीही चालू नका, पोहू नका किंवा गाडी चालवू नका.',
      'वेगाने वाहणाऱ्या पाण्यावरील पुलावरून प्रवास करणे टाळा.',
      'पिण्याचे पाणी नेहमी उकळून प्या किंवा सुरक्षित बाटलीबंद पाणी वापरा.',
      'पुराच्या पाण्याच्या संपर्कात आलेले कोणतेही अन्नपदार्थ खाऊ नका.'
    ],
    videos: [
      {
        title: '#पूर | पूर सुरक्षा आणि तत्काळ स्थलांतर मार्गदर्शक तत्त्वे',
        duration: '3:15',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#पूर | वीज आणि दूषित पाण्यापासून सुरक्षेचे उपाय',
        duration: '4:00',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#पूर | मुसळधार पावसात सुरक्षित वाहन चालवण्याचे नियम',
        duration: '2:50',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#पूर | पुरानंतर स्वच्छता आणि निर्जंतुकीकरण पद्धती',
        duration: '5:10',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Urban Floods': {
    title: 'शहरी पूर आणि पाणी साचणे (URBAN FLOODS)',
    beforeTitle: 'शहरी पुरापूर्वी (BEFORE URBAN FLOODING)',
    duringAfterTitle: 'शहरी पुरादरम्यान आणि नंतर (DURING & AFTER URBAN FLOODING)',
    before: [
      'घराच्या छतावरील नाले आणि समोरील गटारे कचरामुक्त ठेवा.',
      'गटाराचे पाणी घरात परत येऊ नये म्हणून नॉन-रिटर्न व्हॉल्व्ह बसवा.',
      'तळमजल्यावरील इलेक्ट्रिक प्लग पॉईंट्स आणि उपकरणे सुरक्षित उंचीवर ठेवा.'
    ],
    duringAfter: [
      'उघडे मॅनहोल, नाले आणि पाण्यात बुडालेल्या विजेच्या खांबांपासून दूर राहा.',
      'मुसळधार पावसात अंडरपास, सब-वे आणि तळघरात जाऊ नका.',
      'घरात पाणी शिरल्यास मुख्य वीज पुरवठा (Main Switch) त्वरित बंद करा.'
    ],
    videos: [
      {
        title: '#शहरीपूर | पावसाळ्यात ड्रेनेज आणि तळघर सुरक्षा',
        duration: '4:05',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#शहरीपूर | विजेचा धक्का आणि उघड्या गटारांच्या धोक्यांपासून बचाव',
        duration: '3:20',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#शहरीपूर | अंडरपास आणि शहरातील प्रवासाचे सुरक्षा नियम',
        duration: '3:50',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#शहरीपूर | सांडपाणी घरात उलट येण्यापासून रोखण्याची यंत्रणा',
        duration: '4:45',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Lightning': {
    title: 'वीज पडणे आणि मेघगर्जना (LIGHTNING)',
    beforeTitle: 'वीज पडण्यापूर्वी (BEFORE LIGHTNING)',
    duringAfterTitle: 'वीज पडताना आणि नंतर (DURING & AFTER LIGHTNING)',
    before: [
      'शेतात काम करण्यापूर्वी हवामान रडार आणि दामिनी (Damini) ॲप तपासा.',
      'उंच इमारती आणि फार्म शेडवर मानक वीज वाहक (Lightning Conductor) बसवा.',
      'वादळ सुरू होण्यापूर्वी टीव्ही आणि संवेदनशील इलेक्ट्रॉनिक उपकरणे अनप्लग करा.'
    ],
    duringAfter: [
      '३०-३० सुरक्षा नियम: वीज चमकणे आणि गडगडाटातील अंतर ३० सेकंदांपेक्षा कमी असल्यास लगेच पक्क्या इमारतीत आश्रय घ्या.',
      'एकट्या झाडाखाली, तारेच्या कुंपणाजवळ किंवा पत्र्याच्या शेडखाली कधीही थांबू नका.',
      'उघड्यावर अडकल्यास पायाच्या बोटांवर बसून डोके गुडघ्यात लपवा (Lightning Crouch).'
    ],
    videos: [
      {
        title: '#Lightning | वीज पडण्याबाबतचे गैरसमज आणि वस्तुस्थिती | NDMA',
        duration: '0:56',
        youtubeId: 'hH6_HyPHhcc',
        thumbnailUrl: 'https://img.youtube.com/vi/hH6_HyPHhcc/hqdefault.jpg'
      },
      {
        title: '#Lightning | वीज पडलेल्या व्यक्तीचा जीव कसा वाचवावा | NDMA',
        duration: '0:52',
        youtubeId: '0oOzPot-kFQ',
        thumbnailUrl: 'https://img.youtube.com/vi/0oOzPot-kFQ/hqdefault.jpg'
      },
      {
        title: '#Lightning | वीज पडल्यामुळे होणाऱ्या दुखापतींची लक्षणे आणि चिन्हे | NDMA',
        duration: '0:42',
        youtubeId: 'NIOtIQsmUfA',
        thumbnailUrl: 'https://img.youtube.com/vi/NIOtIQsmUfA/hqdefault.jpg'
      },
      {
        title: '#Lightning | वीज आणि वादळादरम्यान काय करावे | NDMA',
        duration: '1:00',
        youtubeId: 't_YKlWDrKcE',
        thumbnailUrl: 'https://img.youtube.com/vi/t_YKlWDrKcE/hqdefault.jpg'
      }
    ]
  },
  'Heat Waves': {
    title: 'उष्णतेची लाट आणि उष्माघात (HEAT WAVES)',
    beforeTitle: 'उष्णतेच्या लाटेपूर्वी (BEFORE HEAT WAVE)',
    duringAfterTitle: 'उष्णतेच्या लाटेदरम्यान आणि नंतर (DURING & AFTER HEAT WAVE)',
    before: [
      'ORS, ताक, लिंबू पाणी, पन्हे आणि नारळ पाणी भरपूर प्रमाणात प्या.',
      'खिडक्यांना पडदे लावा आणि छतावर चुना/पांढरा रंग लावून उष्णता कमी करा.',
      'कष्टाची कामे सकाळी लवकर किंवा संध्याकाळी करा.'
    ],
    duringAfter: [
      'दुपारी १२:०० ते ३:०० या वेळेत कडक उन्हात बाहेर जाणे टाळा.',
      'हलक्या रंगाचे सैल सुती कपडे घाला, सनग्लासेस, टोपी किंवा रुमाल वापरा.',
      'उन्हात पार्क केलेल्या बंद वाहनात मुले किंवा पाळीव प्राण्यांना एकटे सोडू नका.',
      'चक्कर आल्यास लगेच सावलीत विश्रांती घ्या, थंड पाण्याच्या पट्ट्या ठेवा आणि पाणी प्या.'
    ],
    videos: [
      {
        title: '#Heatwave | उन्हाळ्यात आपले घर थंड कसे ठेवावे ? | NDMA',
        duration: '0:54',
        youtubeId: 'PndkLH1tTWQ',
        thumbnailUrl: 'https://img.youtube.com/vi/PndkLH1tTWQ/hqdefault.jpg'
      },
      {
        title: '#Heatwave | शहरांमध्ये उष्णतेच्या लाटेचा प्रभाव कसा कमी करावा ? | NDMA',
        duration: '0:56',
        youtubeId: 'W1iqMZC5gUk',
        thumbnailUrl: 'https://img.youtube.com/vi/W1iqMZC5gUk/hqdefault.jpg'
      },
      {
        title: '#Heatwave | तीव्र उष्णतेत बेघर आणि गरजूंना कशी मदत करावी ?',
        duration: '0:52',
        youtubeId: 'qBVXhX_xbYQ',
        thumbnailUrl: 'https://img.youtube.com/vi/qBVXhX_xbYQ/hqdefault.jpg'
      },
      {
        title: '#Heatwave | कामगार आणि कष्टकरी उन्हापासून स्वतःचे संरक्षण कसे करू शकतात ? | NDMA',
        duration: '0:47',
        youtubeId: 'WjUrCh3D0yA',
        thumbnailUrl: 'https://img.youtube.com/vi/WjUrCh3D0yA/hqdefault.jpg'
      }
    ]
  },
  'Cold Wave': {
    title: 'थंडीची लाट (COLD WAVE)',
    beforeTitle: 'थंडीच्या लाटेपूर्वी (BEFORE COLD WAVE)',
    duringAfterTitle: 'थंडीच्या लाटेदरम्यान आणि नंतर (DURING & AFTER COLD WAVE)',
    before: [
      'हिवाळ्यासाठी उबदार कपडे, ब्लँकेट्स आणि सुरक्षित हीटिंग तयार ठेवा.',
      'पाण्याचे पाईप गोठू नयेत म्हणून योग्य इन्सुलेशन करा.',
      'खोकला, सर्दी आणि आवश्यक औषधांचा साठा आधीच ठेवा.'
    ],
    duringAfter: [
      'एका जाड कपड्याऐवजी सैल उबदार कपड्यांचे अनेक थर (Layers) वापरा.',
      'बाहेर पडताना डोके, कान, मान, हात आणि पाय व्यवस्थित झाकून ठेवा.',
      'खोलीत हीटर किंवा शेकोटी वापरताना विषारी वायू टाळण्यासाठी हवा खेळती ठेवा.',
      'पाळीव प्राण्यांना आणि जनावरांना उबदार शेड आणि कोरडी जागा द्या.'
    ],
    videos: [
      {
        title: '#Coldwave | थंडीच्या लाटेदरम्यान काय करावे आणि काय करू नये',
        duration: '3:15',
        youtubeId: '3dGT8jQQvLw',
        thumbnailUrl: 'https://img.youtube.com/vi/3dGT8jQQvLw/hqdefault.jpg'
      },
      {
        title: '#Coldwave | मजूर आणि कष्टकऱ्यांसाठी थंडीच्या लाटेत सुरक्षा',
        duration: '3:45',
        youtubeId: 'pl89ipXtGvk',
        thumbnailUrl: 'https://img.youtube.com/vi/pl89ipXtGvk/hqdefault.jpg'
      },
      {
        title: '#Coldwave | शेतकऱ्यांसाठी पीक संरक्षण आणि उपाय',
        duration: '4:10',
        youtubeId: 'JdSYoPPx1io',
        thumbnailUrl: 'https://img.youtube.com/vi/JdSYoPPx1io/hqdefault.jpg'
      },
      {
        title: '#Coldwave | डोंगराळ भागातील लोकांसाठी काय करावे - काय करू नये',
        duration: '3:30',
        youtubeId: 'yYSfPDfIqMg',
        thumbnailUrl: 'https://img.youtube.com/vi/yYSfPDfIqMg/hqdefault.jpg'
      }
    ]
  },
  'Earthquakes': {
    title: 'भूकंप (EARTHQUAKES)',
    beforeTitle: 'भूकंपापूर्वी (BEFORE EARTHQUAKE)',
    duringAfterTitle: 'भूकंपादरम्यान आणि नंतर (DURING & AFTER EARTHQUAKE)',
    before: [
      'जड कपाटे, आरसे आणि वॉटर हिटर भिंतींना घट्ट बांधून ठेवा.',
      'घरातील प्रत्येक खोलीत मजबूत टेबलाखाली सुरक्षित जागा निश्चित करा.',
      'कुटुंबाचे आपत्कालीन भेटीचे ठिकाण ठरवा आणि आपत्ती किट तयार ठेवा.'
    ],
    duringAfter: [
      'खाली वाका, झाका आणि पकडा (DROP, COVER & HOLD ON): जमिनीवर बसा, मजबूत टेबलाखाली डोके झाका आणि घट्ट पकडा.',
      'घरात असल्यास हादरे थांबेपर्यंत आतच राहा. लिफ्टचा वापर करू नका.',
      'बाहेर असल्यास उंच इमारती, विजेचे खांब आणि झाडांपासून दूर मोकळ्या मैदानात जा.',
      'धक्क्यानंतरच्या धक्क्यांसाठी (Aftershocks) तयार राहा. मुख्य वीज स्विच बंद करा.'
    ],
    videos: [
      {
        title: '#भूकंप | खाली वाका, झाका आणि पकडा (Drop, Cover, Hold On) सराव',
        duration: '2:40',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#भूकंप | घरांची संरचनात्मक आणि सुरक्षितता व्यवस्था',
        duration: '4:15',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#भूकंप | भूकंपानंतर गॅस आणि विजेच्या धोक्यांची तपासणी',
        duration: '3:30',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#भूकंप | समुदाय शोध आणि बचाव प्रोटोकॉल',
        duration: '5:20',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Tsunamis': {
    title: 'सुनामी (TSUNAMIS)',
    beforeTitle: 'सुनामीपूर्वी (BEFORE TSUNAMIS)',
    duringAfterTitle: 'सुनामीदरम्यान आणि नंतर (DURING & AFTER TSUNAMIS)',
    before: [
      'किनारपट्टीवरील सुनामी प्रवण क्षेत्रे आणि उंच सुरक्षित निवारा ठिकाणे जाणून घ्या.',
      'नैसर्गिक इशारे ओळखा: किनारपट्टीवर जोरदार भूकंप किंवा समुद्राचे पाणी अचानक मागे जाणे.',
      'किनाऱ्यापासून दूर आणि समुद्रसपाटीपासून किमान ३० मीटर उंच सुरक्षित मार्गांचा नकाशा लक्षात ठेवा.'
    ],
    duringAfter: [
      'किनारपट्टीवर जोरदार भूकंप जाणवल्यास इशाऱ्याची वाट न पाहता त्वरित पायी उंच ठिकाणी जा.',
      'समुद्राचे पाणी मागे जाणे पाहण्यासाठी बीचवर कधीही जाऊ नका.',
      'लक्षात ठेवा: सुनामी ही अनेक लाटांची मालिका असते आणि पहिली लाट सर्वात मोठी असणे आवश्यक नाही.',
      'INCOIS किंवा NDMA कडून अधिकृत मंजुरी मिळेपर्यंत उंच ठिकाणीच राहा.'
    ],
    videos: [
      {
        title: '#AapdaKaSaamna | सुनामी आल्यावर घ्यायची काळजी आणि सुरक्षा',
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
    beforeTitle: 'हिमस्खलनापूर्वी (BEFORE AVALANCHES)',
    duringAfterTitle: 'हिमस्खलनादरम्यान आणि नंतर (DURING & AFTER AVALANCHES)',
    before: [
      'डोंगराळ प्रवासापूर्वी SASE/DGRE बुलेटिन आणि हिमस्खलनाचा इशारा तपासा.',
      'ॲव्हलाँच ट्रान्सिव्हर बीकन, स्नो प्रोब आणि पोर्टेबल फावडे सोबत ठेवा.',
      'गटाने प्रवास करा पण धोकादायक बर्फाळ उतार एका वेळी एकानेच पार करा.'
    ],
    duringAfter: [
      'हिमस्खलनात अडकल्यास स्की उपकरणे फेकून बर्फावर पोहण्यासारखी हालचाल करा.',
      'बर्फ थांबण्यापूर्वी तोंडापुढे हात ठेवून श्वास घेण्यासाठी हवेची पोकळी (Air Pocket) तयार करा.',
      'ऑक्सिजन वाचवण्यासाठी शांत राहा आणि बचाव पथकाचे आवाज ऐकण्याचा प्रयत्न करा.'
    ],
    videos: [
      {
        title: '#हिमस्खलन | हिमस्खलनाचे प्राथमिक संकेत आणि डोंगराळ सुरक्षा',
        duration: '3:15',
        youtubeId: 'oJYmZu4Cl_E',
        thumbnailUrl: 'https://img.youtube.com/vi/oJYmZu4Cl_E/hqdefault.jpg'
      },
      {
        title: '#हिमस्खलन | हिमस्खलनात अडकल्यास बचावाचे महत्त्वाचे उपाय',
        duration: '2:50',
        youtubeId: '3Q7fYDTL3dM',
        thumbnailUrl: 'https://img.youtube.com/vi/3Q7fYDTL3dM/hqdefault.jpg'
      },
      {
        title: 'हिमस्खलन कसे होते [Avalanche Causes & Safety]',
        duration: '4:10',
        youtubeId: 'xB5V7Z8C_ik',
        thumbnailUrl: 'https://img.youtube.com/vi/xB5V7Z8C_ik/hqdefault.jpg'
      }
    ]
  },
  'Landslides': {
    title: 'दरड कोसळणे - भूस्खलन (LANDSLIDES)',
    beforeTitle: 'दरड कोसळण्यापूर्वी (BEFORE LANDSLIDES)',
    duringAfterTitle: 'दरड कोसळताना आणि नंतर (DURING & AFTER LANDSLIDES)',
    before: [
      'मातीची धूप रोखण्यासाठी डोंगराळ उतारावर खोल मुळे असलेली झाडे लावा.',
      'पूर्वसंकेतांवर लक्ष ठेवा: खिडक्या-दरवाजे अडकणे, झाडे झुकणे किंवा जमिनीत भेगा पडणे.',
      'डोंगराळ ओढ्यांच्या आणि तीव्र उताराच्या तोंडावर घरे बांधणे टाळा.'
    ],
    duringAfter: [
      'सतत मुसळधार पाऊस असताना सतर्क राहा; गडगडाटाचा आवाज किंवा ओढ्याचे पाणी गढूळ झाल्यास सावध व्हा.',
      'माती किंवा दगड घसरताना दिसताच लगेच सुरक्षित आणि उंच कड्याकडे पळा.',
      'प्रशासनाने रस्ता सुरक्षित घोषित करेपर्यंत दरडग्रस्त रस्त्यांवरून प्रवास करू नका.'
    ],
    videos: [
      {
        title: '#दरडकोसळणे | डोंगराळ उतारांवर दरड कोसळण्याचे प्राथमिक संकेत',
        duration: '3:45',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#दरडकोसळणे | घाट रस्त्यांवर गाडी चालवताना घ्यायची खबरदारी',
        duration: '4:10',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#दरडकोसळणे | उतारांचे बायो-इंजिनिअरिंग आणि माती स्थिरीकरण',
        duration: '3:20',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#दरडकोसळणे | दरड कोसळल्यानंतर बचाव आणि सुरक्षा कार्य',
        duration: '5:00',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  'Cloudbursts': {
    title: 'ढगफुटी आणि अचानक पूर (CLOUDBURSTS)',
    beforeTitle: 'ढगफुटीपूर्वी (BEFORE CLOUDBURSTS)',
    duringAfterTitle: 'ढगफुटीदरम्यान आणि नंतर (DURING & AFTER CLOUDBURSTS)',
    before: [
      'पर्वतीय ओढ्यांच्या आणि नद्यांच्या पात्रात तात्पुरते तंबू किंवा शिबिर उभारू नका.',
      'डोंगराळ प्रवासात आधीच सुरक्षित उंच कडे आणि आपत्कालीन मार्ग ओळखून ठेवा.',
      'आपत्कालीन शिट्टी, टॉर्च आणि गिर्यारोहणाचे आवश्यक साहित्य सोबत ठेवा.'
    ],
    duringAfter: [
      'डोंगराळ दरीत अतिमुसळधार पाऊस सुरू होताच लगेच नद्या-ओढ्यांपासून दूर उंच डोंगरावर चढा.',
      'वेगाने वाहणाऱ्या पर्वतीय पाण्याला पायी किंवा वाहनाने पार करण्याचा प्रयत्न करू नका.',
      'कमकुवत खडकाळ उतारांपासून दूर पक्क्या सुरक्षित बांधकामात आश्रय घ्या.'
    ],
    videos: [
      {
        title: '#ढगफुटी | पर्वतीय दऱ्यांमध्ये अचानक पूर सुरक्षा मार्गदर्शिका',
        duration: '4:20',
        youtubeId: '43M5mZuz3JA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#ढगफुटी | पावसाळी पर्वतीय प्रवास सुरक्षा प्रोटोकॉल',
        duration: '3:40',
        youtubeId: 'OqjXl4r2GqA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#ढगफुटी | दरीतून सुरक्षित बाहेर पडणे आणि उंच कडा सुरक्षा',
        duration: '3:05',
        youtubeId: 'bA4A-q6u7n4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: '#ढगफुटी | समुदाय तत्काळ प्रतिसाद आणि शिट्टी संकेत',
        duration: '4:50',
        youtubeId: '3eZ9aXo1n6k',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
};
