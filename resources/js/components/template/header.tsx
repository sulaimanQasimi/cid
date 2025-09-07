import { useTranslation } from '@/lib/i18n/translate';
import { Link } from '@inertiajs/react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { CanCreate } from '../ui/permission-guard';

// Simplified theme configurations
const themes = {
    purple: {
        bg: 'bg-purple-600 dark:bg-purple-700',
        iconBg: 'bg-purple-500 dark:bg-purple-600'
    },
    blue: {
        bg: 'bg-blue-600 dark:bg-blue-700',
        iconBg: 'bg-blue-500 dark:bg-blue-600'
    },
    green: {
        bg: 'bg-green-600 dark:bg-green-700',
        iconBg: 'bg-green-500 dark:bg-green-600'
    },
    red: {
        bg: 'bg-red-600 dark:bg-red-700',
        iconBg: 'bg-red-500 dark:bg-red-600'
    },
    orange: {
        bg: 'bg-orange-600 dark:bg-orange-700',
        iconBg: 'bg-orange-500 dark:bg-orange-600'
    },
    indigo: {
        bg: 'bg-indigo-600 dark:bg-indigo-700',
        iconBg: 'bg-indigo-500 dark:bg-indigo-600'
    }
};

type ThemeKey = keyof typeof themes;

interface HeaderProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    model: string;
    routeName: string;
    buttonText: string;
    theme?: ThemeKey;
    buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
    showBackButton?: boolean;
    backRouteName?: string;
    backButtonText?: string;
}

export default function Header({ title, description, icon, model, routeName, buttonText, theme = 'purple', buttonSize = 'default', showBackButton = false, backRouteName, backButtonText }: HeaderProps) {
    const currentTheme = themes[theme];
    
    return (
        <div className={`mb-6 ${currentTheme.bg} shadow-sm`}>
            <div className="px-6 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Title Section */}
                    <div className="flex items-center gap-3">
                        <div className={`${currentTheme.iconBg} p-2 rounded-lg text-white`}>
                            {icon}
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-white sm:text-lg">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-white/80 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {showBackButton && backRouteName && (
                            <Button
                                asChild
                                variant="outline"
                                size={buttonSize}
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                            >
                                <Link href={route(backRouteName)} className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    {backButtonText}
                                </Link>
                            </Button>
                        )}
                        <CanCreate model={model}>
                            <Button
                                asChild
                                size={buttonSize}
                                className="bg-white text-gray-900 hover:bg-white/90"
                            >
                                <Link href={route(routeName)} className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    {buttonText}
                                </Link>
                            </Button>
                        </CanCreate>
                    </div>
                </div>
            </div>
        </div>
    );
}
