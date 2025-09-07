import { useTranslation } from '@/lib/i18n/translate';
import { Link } from '@inertiajs/react';
import { FileText, Plus, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { CanCreate } from '../ui/permission-guard';

// Theme configurations
const themes = {
    purple: {
        gradient: 'from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-700 dark:via-indigo-700 dark:to-blue-700',
        border: 'border-white/30 dark:border-gray-600/30',
        bg: 'bg-white/20 dark:bg-gray-800/20',
        hover: 'hover:bg-white/30 dark:hover:bg-gray-700/30'
    },
    blue: {
        gradient: 'from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-700 dark:via-cyan-700 dark:to-teal-700',
        border: 'border-white/30 dark:border-gray-600/30',
        bg: 'bg-white/20 dark:bg-gray-800/20',
        hover: 'hover:bg-white/30 dark:hover:bg-gray-700/30'
    },
    green: {
        gradient: 'from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700',
        border: 'border-white/30 dark:border-gray-600/30',
        bg: 'bg-white/20 dark:bg-gray-800/20',
        hover: 'hover:bg-white/30 dark:hover:bg-gray-700/30'
    },
    red: {
        gradient: 'from-red-600 via-pink-600 to-rose-600 dark:from-red-700 dark:via-pink-700 dark:to-rose-700',
        border: 'border-white/30 dark:border-gray-600/30',
        bg: 'bg-white/20 dark:bg-gray-800/20',
        hover: 'hover:bg-white/30 dark:hover:bg-gray-700/30'
    },
    orange: {
        gradient: 'from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-700 dark:via-amber-700 dark:to-yellow-700',
        border: 'border-white/30 dark:border-gray-600/30',
        bg: 'bg-white/20 dark:bg-gray-800/20',
        hover: 'hover:bg-white/30 dark:hover:bg-gray-700/30'
    },
    indigo: {
        gradient: 'from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700',
        border: 'border-white/30 dark:border-gray-600/30',
        bg: 'bg-white/20 dark:bg-gray-800/20',
        hover: 'hover:bg-white/30 dark:hover:bg-gray-700/30'
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
        <div className={`group relative mb-6 overflow-hidden bg-gradient-to-l ${currentTheme.gradient} p-4 text-white dark:text-gray-100 shadow-lg lg:p-6`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-black/5 dark:bg-black/10"></div>
            <div className="absolute top-0 left-0 h-80 w-80 -translate-x-40 -translate-y-40 rounded-full bg-white/10 dark:bg-white/5 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-32 translate-y-32 rounded-full bg-white/5 dark:bg-white/3 blur-2xl transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-white/5 dark:bg-white/3 blur-xl transition-transform duration-500 group-hover:scale-150"></div>

            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className={`border ${currentTheme.border} ${currentTheme.bg} p-3 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105`}>
                        {icon}
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold tracking-tight text-white dark:text-gray-100 drop-shadow-lg lg:text-3xl">{title}</h2>
                        <div className="text-sm font-medium text-white/90 dark:text-gray-200">
                            {description}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {showBackButton && backRouteName && (
                        <Button
                            asChild
                            variant="outline"
                            size={buttonSize}
                            className={`group/btn border ${currentTheme.border} ${currentTheme.bg} px-4 py-2 text-sm font-medium text-white dark:text-gray-100 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 ${currentTheme.hover}`}
                        >
                            <Link href={route(backRouteName)} className="flex items-center gap-2">
                                <div className={`${currentTheme.bg} p-0.5 transition-transform duration-300 group-hover/btn:scale-110`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </div>
                                {backButtonText}
                            </Link>
                        </Button>
                    )}
                    <CanCreate model={model}>
                        <Button
                            asChild
                            size={buttonSize}
                            className={`group/btn border ${currentTheme.border} ${currentTheme.bg} px-4 py-2 text-sm font-medium text-white dark:text-gray-100 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 ${currentTheme.hover}`}
                        >
                            <Link href={route(routeName)} className="flex items-center gap-2">
                                <div className={`${currentTheme.bg} p-0.5 transition-transform duration-300 group-hover/btn:scale-110`}>
                                    <Plus className="h-4 w-4" />
                                </div>
                                {buttonText}
                            </Link>
                        </Button>
                    </CanCreate>
                </div>
            </div>
        </div>
    );
}
