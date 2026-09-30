import { DisasterCategory, DosDontsData } from '../dosAndDontsTypes';

export const englishContent: Record<DisasterCategory, DosDontsData> = {
  'Cyclones': {
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
  'Floods': {
    title: 'FLOODS',
    beforeTitle: 'BEFORE FLOODS',
    duringAfterTitle: 'DURING & AFTER FLOODS',
    before: [
      'Know the elevation of your property and nearest evacuation high grounds.',
      'Elevate furnace, water heater, and electric panel in your home if feasible.',
      'Seal basement walls with waterproofing compounds to avoid seepage.',
      'Keep battery-operated emergency lights, fresh batteries, and portable chargers ready.'
    ],
    duringAfter: [
      'Do not walk, swim, or drive through flood waters. Turn around, don\'t drown.',
      'Stay off bridges over fast-moving water as foundation collapse risk is high.',
      'Boil municipal tap water or use bottled water until authorities declare supply safe.',
      'Discard food items that have come in contact with floodwater.'
    ],
    videos: [
      {
        title: "#Flood | Do's and Don'ts After Flood | NDMA",
        duration: '1:05',
        youtubeId: 'lJq1FLc5Bqc',
        thumbnailUrl: 'https://img.youtube.com/vi/lJq1FLc5Bqc/hqdefault.jpg'
      },
      {
        title: '#Flood | How To Prepare Before A Flood ? | NDMA',
        duration: '1:24',
        youtubeId: '2KwuqolYLO4',
        thumbnailUrl: 'https://img.youtube.com/vi/2KwuqolYLO4/hqdefault.jpg'
      },
      {
        title: '#Flood | How To Keep Animals Safe During Floods ? | NDMA',
        duration: '0:58',
        youtubeId: 'jWfzk90K8uI',
        thumbnailUrl: 'https://img.youtube.com/vi/jWfzk90K8uI/hqdefault.jpg'
      },
      {
        title: "#Flood | Do's and Don'ts During Floods | NDMA",
        duration: '1:04',
        youtubeId: '0b0yrwHvCdc',
        thumbnailUrl: 'https://img.youtube.com/vi/0b0yrwHvCdc/hqdefault.jpg'
      }
    ]
  },
  'Urban Floods': {
    title: 'URBAN FLOODING & WATERLOGGING',
    beforeTitle: 'BEFORE URBAN FLOODING',
    duringAfterTitle: 'DURING & AFTER URBAN FLOODING',
    before: [
      'Clean rooftop gutters and clear street drainage inlets in front of your premises.',
      'Install check valves in plumbing to prevent floodwater backing up into drains.',
      'Elevate ground-floor electrical appliances, transformers, and power outlets.'
    ],
    duringAfter: [
      'Avoid walking near manholes, storm drains, or submerged electricity poles.',
      'Do not venture into underpasses, low-lying subways, or basements during heavy downpours.',
      'Switch off the main electric circuit if water enters the premises.'
    ],
    videos: [
      {
        title: '#UrbanFlood | What To Do During Urban Floods (Hindi) | NDMA',
        duration: '0:56',
        youtubeId: 'E_hdGy-aelE',
        thumbnailUrl: 'https://img.youtube.com/vi/E_hdGy-aelE/hqdefault.jpg'
      },
      {
        title: '#UrbanFlood | Before Urban Flood | NDMA',
        duration: '0:57',
        youtubeId: 'U214kruEUJA',
        thumbnailUrl: 'https://img.youtube.com/vi/U214kruEUJA/hqdefault.jpg'
      },
      {
        title: '#UrbanFlood | During Urban Flood | NDMA',
        duration: '0:56',
        youtubeId: 'VKzhHC1H8j0',
        thumbnailUrl: 'https://img.youtube.com/vi/VKzhHC1H8j0/hqdefault.jpg'
      },
      {
        title: '#UrbanFlood | After Urban Flood | NDMA',
        duration: '0:56',
        youtubeId: 'spNyX6M5I2A',
        thumbnailUrl: 'https://img.youtube.com/vi/spNyX6M5I2A/hqdefault.jpg'
      }
    ]
  },
  'Lightning': {
    title: 'LIGHTNING & THUNDERSTORMS',
    beforeTitle: 'BEFORE LIGHTNING & THUNDERSTORMS',
    duringAfterTitle: 'DURING & AFTER LIGHTNING',
    before: [
      'Check weather radar and forecasts before planning outdoor sports or farming activities.',
      'Install certified lightning arresters/conductors on tall buildings and farm structures.',
      'Unplug sensitive electronic devices and computers before thunderstorms hit.'
    ],
    duringAfter: [
      'Follow the 30-30 Rule: If time between lightning flash and thunder is < 30s, take shelter immediately.',
      'Never shelter under isolated trees, metal sheds, or open tin roofs.',
      'If caught in the open with no shelter, crouch down low on balls of feet with head tucked in (Lightning Crouch).'
    ],
    videos: [
      {
        title: '#Lightning | Busting Myths & Facts About Lightning | NDMA',
        duration: '0:56',
        youtubeId: 'hH6_HyPHhcc',
        thumbnailUrl: 'https://img.youtube.com/vi/hH6_HyPHhcc/hqdefault.jpg'
      },
      {
        title: '#Lightning | How To Save The Life Of A Victim Struck By Lightning | NDMA',
        duration: '0:52',
        youtubeId: '0oOzPot-kFQ',
        thumbnailUrl: 'https://img.youtube.com/vi/0oOzPot-kFQ/hqdefault.jpg'
      },
      {
        title: '#Lightning | Signs & Symptoms Of Lightning Injuries | NDMA',
        duration: '0:42',
        youtubeId: 'NIOtIQsmUfA',
        thumbnailUrl: 'https://img.youtube.com/vi/NIOtIQsmUfA/hqdefault.jpg'
      },
      {
        title: '#Lightning | What To Do During Lightning & Thunderstorm | NDMA',
        duration: '1:00',
        youtubeId: 't_YKlWDrKcE',
        thumbnailUrl: 'https://img.youtube.com/vi/t_YKlWDrKcE/hqdefault.jpg'
      }
    ]
  },
  'Heat Waves': {
    title: 'HEAT WAVE & SUNSTROKE',
    beforeTitle: 'BEFORE HEAT WAVES',
    duringAfterTitle: 'DURING & AFTER HEAT WAVES',
    before: [
      'Keep hydrated with homemade oral fluids: ORS, buttermilk (Chhaas), lemon water, and coconut water.',
      'Install heat curtains, reflective window coatings, or white lime paint on roofs.',
      'Schedule heavy outdoor manual work for early mornings or late evenings.'
    ],
    duringAfter: [
      'Avoid going outdoors between 12:00 PM and 3:00 PM when solar radiation is peak.',
      'Wear loose, light-coloured cotton clothing, sunglasses, and wide-brimmed hats.',
      'Never leave children, infants, or pets locked inside a parked vehicle.',
      'If feeling dizzy, seek immediate shaded rest, apply cool wet cloth packs, and hydrate.'
    ],
    videos: [
      {
        title: '#Heatwave | How To Keep Your House Cool During Summers? | NDMA',
        duration: '0:54',
        youtubeId: 'PndkLH1tTWQ',
        thumbnailUrl: 'https://img.youtube.com/vi/PndkLH1tTWQ/hqdefault.jpg'
      },
      {
        title: '#Heatwave | How To Reduce The Impact Of A Heatwave In Cities? | NDMA',
        duration: '0:56',
        youtubeId: 'W1iqMZC5gUk',
        thumbnailUrl: 'https://img.youtube.com/vi/W1iqMZC5gUk/hqdefault.jpg'
      },
      {
        title: '#Heatwave | How Nomads And Homeless Can Be Helped During A Heatwave?',
        duration: '0:52',
        youtubeId: 'qBVXhX_xbYQ',
        thumbnailUrl: 'https://img.youtube.com/vi/qBVXhX_xbYQ/hqdefault.jpg'
      },
      {
        title: '#Heatwave | How Can Outdoor Workers & Labourers Protect Themselves? | NDMA',
        duration: '0:47',
        youtubeId: 'WjUrCh3D0yA',
        thumbnailUrl: 'https://img.youtube.com/vi/WjUrCh3D0yA/hqdefault.jpg'
      }
    ]
  },
  'Cold Wave': {
    title: 'COLD WAVE & FROST',
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
        title: '#Coldwave | What To Do and What Not To Do During a Cold Wave',
        duration: '3:15',
        youtubeId: '3dGT8jQQvLw',
        thumbnailUrl: 'https://img.youtube.com/vi/3dGT8jQQvLw/hqdefault.jpg'
      },
      {
        title: '#Coldwave | Do\'s and Don\'ts for Daily Wage Workers & Laborers',
        duration: '3:45',
        youtubeId: 'pl89ipXtGvk',
        thumbnailUrl: 'https://img.youtube.com/vi/pl89ipXtGvk/hqdefault.jpg'
      },
      {
        title: '#Coldwave | Safety Guidelines and Precautions for Farmers',
        duration: '4:10',
        youtubeId: 'JdSYoPPx1io',
        thumbnailUrl: 'https://img.youtube.com/vi/JdSYoPPx1io/hqdefault.jpg'
      },
      {
        title: '#Coldwave | Do\'s and Don\'ts for People Residing in Hilly Regions',
        duration: '3:30',
        youtubeId: 'yYSfPDfIqMg',
        thumbnailUrl: 'https://img.youtube.com/vi/yYSfPDfIqMg/hqdefault.jpg'
      }
    ]
  },
  'Earthquakes': {
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
        title: 'Earthquake - Dost Appu | NDMA',
        duration: '2:38',
        youtubeId: 'FVh_SI_GIqc',
        thumbnailUrl: 'https://img.youtube.com/vi/FVh_SI_GIqc/hqdefault.jpg'
      },
      {
        title: 'Earthquake - Tayyari Mein Hai Samajhdaari | NDMA',
        duration: '0:34',
        youtubeId: 'uxUPDevBkxk',
        thumbnailUrl: 'https://img.youtube.com/vi/uxUPDevBkxk/hqdefault.jpg'
      },
      {
        title: 'NDMA INDIA Earthquake (Dost Appu - Hindi)',
        duration: '2:38',
        youtubeId: 'g4ajSBb1_Ws',
        thumbnailUrl: 'https://img.youtube.com/vi/g4ajSBb1_Ws/hqdefault.jpg'
      },
      {
        title: '#Earthquake | Drop, Cover, Hold (Jhooko Dhako Pakdo) | NDMA',
        duration: '0:45',
        youtubeId: 'U4QLsUNPXnU',
        thumbnailUrl: 'https://img.youtube.com/vi/U4QLsUNPXnU/hqdefault.jpg'
      }
    ]
  },
  'Tsunamis': {
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
  'Avalanches': {
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
  'Landslides': {
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
        title: 'NDMA INDIA Landslide (Dost Appu - English)',
        duration: '2:27',
        youtubeId: '49ZqCiqorcA',
        thumbnailUrl: 'https://img.youtube.com/vi/49ZqCiqorcA/hqdefault.jpg'
      },
      {
        title: 'NDMA INDIA - Landslide (are you ready)',
        duration: '4:49',
        youtubeId: '0M9OMkDV3_k',
        thumbnailUrl: 'https://img.youtube.com/vi/0M9OMkDV3_k/hqdefault.jpg'
      },
      {
        title: 'Video on Landslide, Geologist | NDMA',
        duration: '0:40',
        youtubeId: 'lQViP8bo04M',
        thumbnailUrl: 'https://img.youtube.com/vi/lQViP8bo04M/hqdefault.jpg'
      }
    ]
  },
  'Cloudbursts': {
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
        title: 'NDMA Guidelines & Safety Measures for Cloudbursts',
        duration: '5:30',
        youtubeId: 'DgFFR8i639g',
        thumbnailUrl: 'https://img.youtube.com/vi/DgFFR8i639g/hqdefault.jpg'
      },
      {
        title: 'Uttarakhand Cloudburst & Floods Response | NDMA',
        duration: '3:15',
        youtubeId: 'HPXJ-1kbDsk',
        thumbnailUrl: 'https://img.youtube.com/vi/HPXJ-1kbDsk/hqdefault.jpg'
      }
    ]
  }
};
