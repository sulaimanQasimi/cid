import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light';

const applyTheme = (appearance: Appearance) => {
    // Force light mode only - remove dark class if present
    document.documentElement.classList.remove('dark');
};

export function initializeTheme() {
    // Always initialize with light mode
    applyTheme('light');
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback((mode: Appearance) => {
        // Only allow light mode
        const lightMode: Appearance = 'light';
        setAppearance(lightMode);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', lightMode);

        // Store in cookie for SSR...
        setCookie('appearance', lightMode);

        applyTheme(lightMode);
    }, []);

    useEffect(() => {
        // Always set to light mode regardless of saved preference
        updateAppearance('light');
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}

// Helper function to set cookie
function setCookie(name: string, value: string) {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=${value}; path=/; max-age=31536000`;
    }
}
