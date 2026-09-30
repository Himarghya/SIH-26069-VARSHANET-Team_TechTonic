import { DisasterCategory, LanguageCode, DosDontsData, DISASTER_CATEGORIES, LANGUAGES, CATEGORY_NAMES } from '../components/dashboard/dosAndDontsTypes';
import { DISASTER_CONTENT } from '../components/dashboard/translations';
import { api } from './api';

const STORAGE_KEY = 'varshanet_custom_dos_donts_v1';
const STORE_EVENT = 'varshanet_guidelines_updated';

// In-memory store initialized from localStorage
let customStore: Record<string, Record<string, DosDontsData>> = {};

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    customStore = JSON.parse(saved);
  }
} catch (e) {
  console.warn('Failed to load custom guidelines from localStorage', e);
}

// Fetch any remote server guidelines on startup
export const fetchRemoteGuidelines = async () => {
  try {
    const res = await api.get('/guidelines/dos-donts');
    if (res.data && res.data.guidelines) {
      customStore = { ...customStore, ...res.data.guidelines };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customStore));
      window.dispatchEvent(new CustomEvent(STORE_EVENT));
    }
  } catch (err) {
    // Graceful offline fallback
    console.warn('Could not sync remote guidelines', err);
  }
};

// Initial sync
fetchRemoteGuidelines();

export const getAllCategories = (): string[] => {
  const customCats = Object.keys(customStore);
  const combined = Array.from(new Set([...DISASTER_CATEGORIES, ...customCats]));
  return combined;
};

export const getGuidelineContent = (category: string, language: LanguageCode): DosDontsData => {
  // 1. Check custom overrides
  if (customStore[category]) {
    if (customStore[category][language]) {
      return customStore[category][language];
    }
    if (customStore[category]['English']) {
      return customStore[category]['English'];
    }
    const firstLang = Object.keys(customStore[category])[0];
    if (firstLang) return customStore[category][firstLang];
  }

  // 2. Check standard built-in content
  const builtIn = DISASTER_CONTENT[category as DisasterCategory];
  if (builtIn) {
    return builtIn[language] || builtIn['English'] || DISASTER_CONTENT['Cyclones']['English'];
  }

  // 3. Fallback blank structure for brand new category
  return {
    title: `${category} Safety Protocol`,
    beforeTitle: `BEFORE ${category.toUpperCase()}`,
    duringAfterTitle: `DURING & AFTER ${category.toUpperCase()}`,
    before: [
      `Stay tuned to official weather broadcasts and warning advisories.`,
      `Prepare an emergency kit with essentials, torch, battery radio, and first-aid.`,
      `Identify safe evacuation shelters and structural high grounds.`
    ],
    duringAfter: [
      `Stay indoors away from hazardous areas, unstable structures, and power lines.`,
      `Do not attempt to cross flooded causeways or damaged infrastructure.`,
      `Cooperate with local civil defense and emergency rescue teams.`
    ],
    videos: [
      {
        title: `${category} Safety & Response Guide`,
        duration: "3:15",
        youtubeId: "vB0XfB-aC0g",
        thumbnailUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&q=80"
      }
    ]
  };
};

export const saveGuideline = async (
  category: string,
  language: LanguageCode,
  data: DosDontsData
): Promise<boolean> => {
  const cat = category.trim();
  if (!cat) return false;

  if (!customStore[cat]) {
    customStore[cat] = {};
  }
  customStore[cat][language] = { ...data };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customStore));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }

  // Notify active UI components
  window.dispatchEvent(new CustomEvent(STORE_EVENT));

  // Sync with backend API
  try {
    await api.post('/guidelines/dos-donts', {
      category: cat,
      language: language,
      title: data.title,
      beforeTitle: data.beforeTitle,
      duringAfterTitle: data.duringAfterTitle,
      before: data.before,
      duringAfter: data.duringAfter,
      videos: data.videos
    });
  } catch (e) {
    console.warn('Backend guideline save fallback to local cache', e);
  }

  return true;
};

export const deleteCustomGuideline = async (category: string): Promise<boolean> => {
  if (customStore[category]) {
    delete customStore[category];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customStore));
    } catch (e) {
      console.error(e);
    }
    window.dispatchEvent(new CustomEvent(STORE_EVENT));

    try {
      await api.delete(`/guidelines/dos-donts/${encodeURIComponent(category)}`);
    } catch (e) {
      console.warn('Backend guideline delete error', e);
    }
    return true;
  }
  return false;
};

export const resetAllGuidelinesToDefault = () => {
  customStore = {};
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
};

export const subscribeToGuidelines = (callback: () => void) => {
  window.addEventListener(STORE_EVENT, callback);
  return () => window.removeEventListener(STORE_EVENT, callback);
};
