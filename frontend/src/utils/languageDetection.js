/**
 * Simple language detection utility
 * Detects Arabic vs English based on character patterns
 */

/**
 * Detect if text contains Arabic characters
 * @param {string} text - The text to analyze
 * @returns {boolean} - True if text contains Arabic characters
 */
export function containsArabic(text) {
  // Arabic Unicode range: \u0600-\u06FF (Arabic block)
  // Additional Arabic characters: \u0750-\u077F, \uFB50-\uFDFF, \uFE70-\uFEFF
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

/**
 * Detect if text contains English characters
 * @param {string} text - The text to analyze
 * @returns {boolean} - True if text contains English characters
 */
export function containsEnglish(text) {
  // English letters and common punctuation
  const englishRegex = /[a-zA-Z]/;
  return englishRegex.test(text);
}

/**
 * Detect the primary language of a text message
 * @param {string} text - The text to analyze
 * @returns {string} - 'ar' for Arabic, 'en' for English
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') {
    return 'en'; // Default to English for empty or invalid input
  }

  const hasArabic = containsArabic(text);
  const hasEnglish = containsEnglish(text);

  // If text contains Arabic characters, treat as Arabic
  if (hasArabic && !hasEnglish) {
    return 'ar';
  }
  
  // If text contains both Arabic and English, determine by majority
  if (hasArabic && hasEnglish) {
    const arabicChars = (text.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    
    // If more Arabic characters than English, treat as Arabic
    return arabicChars > englishChars ? 'ar' : 'en';
  }

  // If only English or neither, treat as English
  return 'en';
}

/**
 * Get language statistics for a text
 * @param {string} text - The text to analyze
 * @returns {object} - Object with language statistics
 */
export function getLanguageStats(text) {
  if (!text || typeof text !== 'string') {
    return { arabicChars: 0, englishChars: 0, totalChars: 0, detectedLanguage: 'en' };
  }

  const arabicChars = (text.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = text.length;
  
  return {
    arabicChars,
    englishChars,
    totalChars,
    detectedLanguage: detectLanguage(text),
    hasArabic: arabicChars > 0,
    hasEnglish: englishChars > 0
  };
}