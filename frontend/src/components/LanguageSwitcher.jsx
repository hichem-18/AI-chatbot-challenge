import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LanguageSwitcher Component
 * Allows users to toggle between English and Arabic languages
 * Includes RTL/LTR support and proper font switching
 */
const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      dir: 'ltr'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      dir: 'rtl'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    // Change language
    i18n.changeLanguage(languageCode);
    
    // Update document direction
    const selectedLang = languages.find(lang => lang.code === languageCode);
    if (selectedLang) {
      document.documentElement.dir = selectedLang.dir;
      document.documentElement.lang = languageCode;
      
      // Update body classes for font switching
      document.body.classList.remove('font-arabic', 'font-english');
      document.body.classList.add(languageCode === 'ar' ? 'font-arabic' : 'font-english');
      
      // Save preference to localStorage
      localStorage.setItem('preferredLanguage', languageCode);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div className="group">
        {/* Current Language Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          id="language-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span className="mr-2 text-lg">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
          <svg
            className="-mr-1 ml-2 h-4 w-4 transform group-hover:rotate-180 transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu-button">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`
                  group flex items-center w-full px-4 py-2 text-sm transition-colors duration-200
                  ${currentLanguage.code === language.code
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                role="menuitem"
                dir={language.dir}
              >
                <span className="mr-3 text-lg">{language.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.nativeName}</span>
                  {language.nativeName !== language.name && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {language.name}
                    </span>
                  )}
                </div>
                {currentLanguage.code === language.code && (
                  <svg
                    className="ml-auto h-4 w-4 text-primary-600 dark:text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact Language Switcher for mobile/small spaces
 */
export const CompactLanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    
    // Update document direction
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    
    // Update font classes
    document.body.classList.remove('font-arabic', 'font-english');
    document.body.classList.add(newLang === 'ar' ? 'font-arabic' : 'font-english');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`
        inline-flex items-center justify-center rounded-md p-2 
        text-gray-600 dark:text-gray-300 
        hover:text-gray-900 dark:hover:text-white 
        hover:bg-gray-100 dark:hover:bg-gray-700 
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
        transition-colors duration-200
        ${className}
      `}
      title={i18n.language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <span className="text-sm font-medium">
        {i18n.language === 'en' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;