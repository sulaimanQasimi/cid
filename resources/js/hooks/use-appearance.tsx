import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark';

const applyTheme = (appearance: Appearance) => {
    if (appearance === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

export function initializeTheme() {
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('appearance') as Appearance || 'light';
    applyTheme(savedTheme);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>(() => {
        // Initialize with saved theme or default to light
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('appearance') as Appearance) || 'light';
        }
        return 'light';
    });

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);

        // Store in localStorage for client-side persistence
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR
        setCookie('appearance', mode);

        applyTheme(mode);
    }, []);

    useEffect(() => {
        // Apply the current theme on mount
        applyTheme(appearance);
    }, [appearance]);

    return { appearance, updateAppearance } as const;
}

// Helper function to set cookie
function setCookie(name: string, value: string) {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=${value}; path=/; max-age=31536000`;
    }
}
