import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import fa from './translations/fa.json';
import en from './translations/en.json';

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

// Force RTL only – single language configuration
const defaultLanguages: Language[] = [
  { code: 'fa', name: 'دری', direction: 'rtl', active: true },
];

const defaultLanguage = defaultLanguages[0];

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
}

// Static translations (RTL-only app uses fa as primary, en as fallback)
type TranslationMap = Record<string, Record<string, string>>;
const translations: TranslationMap = {
  fa: (fa as unknown as Record<string, string>) || {},
  en: (en as unknown as Record<string, string>) || {},
};

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
