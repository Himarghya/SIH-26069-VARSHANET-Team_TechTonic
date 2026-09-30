import { DisasterCategory, LanguageCode, DosDontsData, DISASTER_CATEGORIES } from '../dosAndDontsTypes';
import { englishContent } from './english';
import { hindiContent } from './hindi';
import { bengaliContent } from './bengali';
import { gujaratiContent } from './gujarati';
import { kannadaContent } from './kannada';
import { malayalamContent } from './malayalam';
import { marathiContent } from './marathi';
import { odiaContent } from './odia';
import { punjabiContent } from './punjabi';
import { tamilContent } from './tamil';
import { teluguContent } from './telugu';
import { assameseContent } from './assamese';

const LANGUAGE_CONTENT_MAP: Record<LanguageCode, Record<DisasterCategory, DosDontsData>> = {
  'English': englishContent,
  'हिन्दी': hindiContent,
  'বাংলা': bengaliContent,
  'ગુજરાતી': gujaratiContent,
  'ಕನ್ನಡ': kannadaContent,
  'മലയാളം': malayalamContent,
  'मराठी': marathiContent,
  'ଓଡ଼ିଆ': odiaContent,
  'ਪੰਜਾਬੀ': punjabiContent,
  'தமிழ்': tamilContent,
  'తెలుగు': teluguContent,
  'অসমীয়া': assameseContent
};

// Build DISASTER_CONTENT indexed by [category][language]
export const DISASTER_CONTENT: Record<DisasterCategory, Record<LanguageCode, DosDontsData>> = DISASTER_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = {
    'English': englishContent[cat],
    'हिन्दी': hindiContent[cat],
    'বাংলা': bengaliContent[cat],
    'ગુજરાતી': gujaratiContent[cat],
    'ಕನ್ನಡ': kannadaContent[cat],
    'മലയാളം': malayalamContent[cat],
    'मराठी': marathiContent[cat],
    'ଓଡ଼ିଆ': odiaContent[cat],
    'ਪੰਜਾਬੀ': punjabiContent[cat],
    'தமிழ்': tamilContent[cat],
    'తెలుగు': teluguContent[cat],
    'অসমীয়া': assameseContent[cat]
  };
  return acc;
}, {} as Record<DisasterCategory, Record<LanguageCode, DosDontsData>>);
