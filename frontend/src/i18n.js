import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: {
    translation: en
  },
  ar: {
    translation: ar
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    
    // Language detection options
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      
      // Cache user language
      caches: ['localStorage'],
      
      // Check for available languages
      checkWhitelist: true,
    },
    
    // Fallback language if detection fails
    fallbackLng: 'en',
    
    // Available languages
    supportedLngs: ['en', 'ar'],
    
    // Namespace configuration
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Debug mode (set to false in production)
    debug: import.meta.env.DEV,
    
    // Interpolation options
    interpolation: {
      // Not needed for React as it escapes by default
      escapeValue: false,
      
      // Custom formatting for numbers and dates
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (value instanceof Date) {
          if (lng === 'ar') {
            return new Intl.DateTimeFormat('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(value);
          }
          return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(value);
        }
        return value;
      }
    },
    
    // React-specific options
    react: {
      // Use Suspense for loading translations
      useSuspense: false,
      
      // Bind i18n instance
      bindI18n: 'languageChanged',
      
      // Bind i18n store
      bindI18nStore: '',
      
      // Escape passed in values to avoid XSS injection
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      
      // Use i18next-icu for advanced formatting
      transWrapTextNodes: '',
    },
    
    // Backend options (for loading translations dynamically)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/add/{{lng}}/{{ns}}',
    },
    
    // Validation and cleaning
    cleanCode: true,
    
    // Key separator and nesting separator
    keySeparator: '.',
    nsSeparator: ':',
    
    // Pluralization
    pluralSeparator: '_',
    
    // Missing key handler
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (import.meta.env.DEV) {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    
    // Save missing translations
    saveMissing: import.meta.env.DEV,
  });

// Event listeners for language changes
i18n.on('languageChanged', (lng) => {
  // Update document direction for RTL languages
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  
  // Update document title based on language
  const title = i18n.t('app.title', { defaultValue: 'AI Chatbot' });
  document.title = title;
  
  // Store language preference
  localStorage.setItem('i18nextLng', lng);
  
  // Apply language-specific font
  const body = document.body;
  body.classList.remove('font-arabic', 'font-english');
  body.classList.add(lng === 'ar' ? 'font-arabic' : 'font-english');
});

// Initialize language on first load
const currentLng = i18n.language;
if (currentLng) {
  document.documentElement.dir = currentLng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLng;
  const body = document.body;
  body.classList.add(currentLng === 'ar' ? 'font-arabic' : 'font-english');
}

export default i18n;