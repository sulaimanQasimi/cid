import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { LanguageProvider } from './lib/i18n/language-context';
import { Toaster } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Set up global error handler for Inertia router
router.on('error', (errors) => {
  console.error('Inertia navigation error:', errors);
});

// Patch router.get method to handle version issues
const originalGet = router.get;
router.get = function(url, data = {}, options = {}) {
  try {
    return originalGet.call(this, url, data, options);
  } catch (error) {
    console.error('Error in router.get:', error);
    setTimeout(() => {
      originalGet.call(this, url, data, options);
    }, 0);
    return this;
  }
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LanguageProvider>
                <App {...props} />
                <Toaster position="top-right" richColors />
            </LanguageProvider>
        );
    },
    progress: {
        color: '#4B5563',
    }
});

// This will set light / dark mode on load...
initializeTheme();
