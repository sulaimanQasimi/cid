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
router.get = function(url: string | URL, data: any = {}, options: any = {}) {
  try {
    return originalGet.call(this, url, data, options);
  } catch (error) {
    console.error('Error in router.get:', error);
    // Retry with basic options if it fails
    try {
      const retryOptions = { 
        preserveState: false,
        preserveScroll: false
      };
      return originalGet.call(this, url, data, retryOptions);
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      // Fallback to basic navigation
      setTimeout(() => {
        if (typeof url === 'string') {
          window.location.href = url;
        } else {
          window.location.href = url.toString();
        }
      }, 0);
      return this;
    }
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

// Keyboard shortcuts protection
const disableKeyboardShortcuts = () => {
  // Disable Ctrl+U (view source)
  document.addEventListener('keydown', (e) => {
    // Disable Ctrl+U
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Disable Ctrl+Shift+I (developer tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Disable Ctrl+Shift+J (console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Disable Ctrl+Shift+C (element selector)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Disable F12 (developer tools)
    if (e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Disable F1-F11 function keys
    if (e.key.startsWith('F') && e.key.length <= 3) {
      const fKeyNumber = parseInt(e.key.substring(1));
      if (fKeyNumber >= 1 && fKeyNumber <= 11) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    
    // Disable Ctrl+Shift+K (Firefox console)
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Disable Ctrl+Shift+E (Firefox network tab)
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });
  
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
  
  // Disable drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
  
  // Disable text selection (optional - uncomment if needed)
  // document.addEventListener('selectstart', (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   return false;
  // });
  
  // Additional protection against common developer shortcuts
  document.addEventListener('keydown', (e) => {
    // Disable Ctrl+S (save page)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Disable Ctrl+A (select all)
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Disable Ctrl+P (print)
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });
};

// Initialize keyboard protection when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', disableKeyboardShortcuts);
} else {
  disableKeyboardShortcuts();
}
