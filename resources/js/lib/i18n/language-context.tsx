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
  isLoading: boolean;
  reloadTranslations: () => Promise<void>;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Force RTL only – single language configuration
const defaultLanguages: Language[] = [
  { code: 'fa', name: 'دری', direction: 'rtl', active: true },
];

const defaultLanguage = defaultLanguages[0];

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
}

// Dynamic translations loaded from API
type TranslationMap = Record<string, Record<string, string>>;

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
  const [languages] = useState<Language[]>(defaultLanguages);
  const [translations, setTranslations] = useState<TranslationMap>({});
  const [isLoading, setIsLoading] = useState(true);

  // Function to load translations from API
  const loadTranslations = async () => {
    try {
      setIsLoading(true);
      const loadedTranslations: TranslationMap = {};

      // Load fa translations from API
      try {
        const faResponse = await fetch('/api/languages/translations?language=fa');
        if (faResponse.ok) {
          const faData = await faResponse.json();
          loadedTranslations.fa = faData.translations || {};
        }
      } catch (error) {
        console.warn('Failed to load fa translations from API:', error);
      }

      // Load en translations as fallback from API
      try {
        const enResponse = await fetch('/api/languages/translations?language=en');
        if (enResponse.ok) {
          const enData = await enResponse.json();
          loadedTranslations.en = enData.translations || {};
        }
      } catch (error) {
        console.warn('Failed to load en translations from API:', error);
      }

      setTranslations(loadedTranslations);
    } catch (error) {
      console.error('Failed to load translations from API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reload translations (useful after updates)
  const reloadTranslations = async () => {
    await loadTranslations();
  };

  // Function to change the current language (no-op in RTL-only app)
  const setLanguage = (_code: LanguageCode) => {};

  // Translation function with params and fallback (fa -> en -> key)
  const t = (key: string, params?: Record<string, string>): string => {
    let result = translations.fa?.[key] ?? translations.en?.[key] ?? key;
    if (params) {
      result = Object.entries(params).reduce(
        (acc, [param, value]) => acc.replace(new RegExp(`{{${param}}}`, 'g'), String(value)),
        result,
      );
    }
    return result;
  };

  // Load translations on component mount
  useEffect(() => {
    loadTranslations();
  }, []);

  // Initial setup
  useEffect(() => {
    // Apply RTL direction and lang
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = defaultLanguage.code;
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languages,
        setLanguage,
        t,
        direction: currentLanguage.direction,
        isLoading,
        reloadTranslations,
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
    console.error('useLanguage called outside of LanguageProvider. Component tree:', {
      documentTitle: document.title,
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
      stack: new Error().stack,
    });
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
