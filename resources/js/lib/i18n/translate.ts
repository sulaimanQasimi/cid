import { useLanguage } from './language-context';

// Fallback translation function when provider is not available
const fallbackT = (key: string, params?: Record<string, string>): string => {
  // Simple fallback that returns the key or a basic translation
  if (params) {
    return Object.entries(params).reduce(
      (acc, [param, value]) => acc.replace(new RegExp(`{{${param}}}`, 'g'), String(value)),
      key,
    );
  }
  return key;
};

// Hook to use translations within components
export function useTranslation() {
  try {
    const { t, direction, currentLanguage } = useLanguage();
    return { t, direction, currentLanguage, isRtl: true, isLtr: false };
  } catch (error) {
    console.warn('LanguageProvider not available, using fallback translations:', error);
    return { 
      t: fallbackT, 
      direction: 'rtl' as const, 
      currentLanguage: { code: 'fa', name: 'دری', direction: 'rtl', active: true },
      isRtl: true, 
      isLtr: false 
    };
  }
}

// Helper to create a translation namespace
export function createNamespace(namespace: string) {
  return (key: string, params?: Record<string, string>) => {
    const { t } = useLanguage();
    return t(`${namespace}.${key}`, params);
  };
}
