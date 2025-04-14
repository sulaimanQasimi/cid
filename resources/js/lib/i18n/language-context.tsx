import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types for our language context
export type Direction = 'ltr' | 'rtl';
export type LanguageCode = string;

export interface Language {
  code: LanguageCode;
  name: string;
  direction: Direction;
  active: boolean;
}

interface LanguageContextType {
  currentLanguage: Language;
  languages: Language[];
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
  direction: Direction;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default languages
const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', direction: 'ltr', active: true },
  { code: 'ps', name: 'پښتو', direction: 'rtl', active: true },
  { code: 'fa', name: 'دری', direction: 'rtl', active: true },
];

const defaultLanguage = defaultLanguages[0];

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
}

// Translations storage
type TranslationMap = Record<string, Record<string, string>>;
let translations: TranslationMap = {};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage,
}) => {
  // Get initial language from localStorage or use default
  const getInitialLanguage = (): Language => {
    const savedLanguageCode = localStorage.getItem('appLanguage') || initialLanguage || defaultLanguage.code;
    return defaultLanguages.find(lang => lang.code === savedLanguageCode) || defaultLanguage;
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage());
  const [languages, setLanguages] = useState<Language[]>(defaultLanguages);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Function to change the current language
  const setLanguage = (code: LanguageCode) => {
    const newLanguage = languages.find(lang => lang.code === code);
    if (newLanguage) {
      localStorage.setItem('appLanguage', code);
      setCurrentLanguage(newLanguage);

      // Set document direction
      document.documentElement.dir = newLanguage.direction;
      document.documentElement.lang = code;

      // Apply RTL-specific global styles when needed
      if (newLanguage.direction === 'rtl') {
        // Add global RTL fixes for the sidebar if not already present
        if (!document.getElementById('global-rtl-fixes')) {
          const style = document.createElement('style');
          style.id = 'global-rtl-fixes';
          style.textContent = `
            /* Global RTL fixes */
            body[dir="rtl"] .group-data-\\[side\\=left\\]\\:-right-4 {
              right: auto !important;
              left: -1rem !important;
            }

            body[dir="rtl"] [data-slot="sidebar"] {
              right: 0 !important;
              left: auto !important;
            }

            body[dir="rtl"] [data-side="right"] {
              right: 0 !important;
              left: auto !important;
            }

            body[dir="rtl"] .peer-data-\\[variant\\=inset\\]\\:ml-0 {
              margin-left: auto !important;
              margin-right: 0 !important;
            }
          `;
          document.head.appendChild(style);
        }
      }

      // Optional: You can reload translations for the new language here
      loadTranslations(code);
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    // Get translation from the current language or fallback to default
    const translation =
      translations[currentLanguage.code]?.[key] ||
      translations[defaultLanguage.code]?.[key] ||
      key;

    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce(
        (acc, [param, value]) => acc.replace(new RegExp(`{{${param}}}`, 'g'), value),
        translation
      );
    }

    return translation;
  };

  // Load translations for a language
  const loadTranslations = async (languageCode: string) => {
    try {
      // Check if translations for this language are already loaded
      if (!translations[languageCode]) {
        // Initialize with empty object in case API call fails
        translations = {
          ...translations,
          [languageCode]: {},
        };

        // Re-enable API call now that routes are fixed
        const response = await fetch(`/api/translations/lang/${languageCode}`);
        if (response.ok) {
          const data = await response.json();
          translations = {
            ...translations,
            [languageCode]: data.translations || {},
          };
        }
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  // Load all active languages from the server
  const loadLanguages = async () => {
    try {
      // Re-enable API call now that routes are fixed
      const response = await fetch('/api/languages');
      if (response.ok) {
        const data = await response.json();
        if (data.languages && Array.isArray(data.languages)) {
          setLanguages(data.languages);

          // If current language is not in the new list, use default
          if (!data.languages.some((lang: Language) => lang.code === currentLanguage.code)) {
            setCurrentLanguage(data.languages.find((lang: Language) => lang.active) || defaultLanguage);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load languages:', error);
    }
  };

  // Initial setup
  useEffect(() => {
    // Set document direction based on current language
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;

    // Load languages and translations
    loadLanguages();
    loadTranslations(currentLanguage.code);

    setIsLoaded(true);
  }, []);

  // Load translations when language changes
  useEffect(() => {
    if (isLoaded) {
      loadTranslations(currentLanguage.code);
    }
  }, [currentLanguage, isLoaded]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languages,
        setLanguage,
        t,
        direction: currentLanguage.direction,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
