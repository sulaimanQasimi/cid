import { useLanguage } from './language-context';

// Hook to use translations within components
export function useTranslation() {
  const { t, direction, currentLanguage } = useLanguage();

  return {
    t,
    direction,
    currentLanguage,
    isRtl: direction === 'rtl',
    isLtr: direction === 'ltr'
  };
}

// Helper to create a translation namespace
export function createNamespace(namespace: string) {
  return (key: string, params?: Record<string, string>) => {
    const { t } = useLanguage();
    return t(`${namespace}.${key}`, params);
  };
}
