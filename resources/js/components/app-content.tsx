import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';
import { useLanguage } from '@/lib/i18n/language-context';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    const { direction } = useLanguage();

    // Apply RTL-specific layout adjustments
    React.useEffect(() => {
        if (variant === 'sidebar') {
            const style = document.createElement('style');
            style.id = 'rtl-content-styles';
            style.textContent = `
                /* RTL Content Positioning */
                [data-slot="sidebar-inset"] {
                    margin-right: 0 !important;
                    margin-left: 0.5rem !important;
                    border-radius: 0.75rem !important;
                }

                .md\\:peer-data-\\[variant\\=inset\\]\\:ml-0 {
                    margin-right: 0 !important;
                }

                .md\\:peer-data-\\[variant\\=inset\\]\\:rounded-xl {
                    border-radius: 0.75rem !important;
                }

                /* Ensure group positioning works correctly */
                .group-data-\\[side\\=right\\]\\:border-l {
                    border-right: none !important;
                    border-left: 1px solid var(--border-color) !important;
                }
            `;
            document.head.appendChild(style);

            return () => {
                const existingStyle = document.getElementById('rtl-content-styles');
                if (existingStyle) {
                    existingStyle.remove();
                }
            };
        }
    }, [variant]);

    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
            {children}
        </main>
    );
}
