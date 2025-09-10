import { useTranslation } from '@/lib/i18n/translate';
import ActionButtons from './ActionButtons';

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
    },
    teal: {
        bg: 'bg-teal-600 dark:bg-teal-700',
        iconBg: 'bg-teal-500 dark:bg-teal-600'
    },
    emerald: {
        bg: 'bg-emerald-600 dark:bg-emerald-700',
        iconBg: 'bg-emerald-500 dark:bg-emerald-600'
    },
    cyan: {
        bg: 'bg-cyan-600 dark:bg-cyan-700',
        iconBg: 'bg-cyan-500 dark:bg-cyan-600'
    },
    rose: {
        bg: 'bg-rose-600 dark:bg-rose-700',
        iconBg: 'bg-rose-500 dark:bg-rose-600'
    },
    pink: {
        bg: 'bg-pink-600 dark:bg-pink-700',
        iconBg: 'bg-pink-500 dark:bg-pink-600'
    },
    violet: {
        bg: 'bg-violet-600 dark:bg-violet-700',
        iconBg: 'bg-violet-500 dark:bg-violet-600'
    },
    fuchsia: {
        bg: 'bg-fuchsia-600 dark:bg-fuchsia-700',
        iconBg: 'bg-fuchsia-500 dark:bg-fuchsia-600'
    },
    sky: {
        bg: 'bg-sky-600 dark:bg-sky-700',
        iconBg: 'bg-sky-500 dark:bg-sky-600'
    },
    lime: {
        bg: 'bg-lime-600 dark:bg-lime-700',
        iconBg: 'bg-lime-500 dark:bg-lime-600'
    },
    amber: {
        bg: 'bg-amber-600 dark:bg-amber-700',
        iconBg: 'bg-amber-500 dark:bg-amber-600'
    },
    slate: {
        bg: 'bg-slate-600 dark:bg-slate-700',
        iconBg: 'bg-slate-500 dark:bg-slate-600'
    },
    zinc: {
        bg: 'bg-zinc-600 dark:bg-zinc-700',
        iconBg: 'bg-zinc-500 dark:bg-zinc-600'
    },
    stone: {
        bg: 'bg-stone-600 dark:bg-stone-700',
        iconBg: 'bg-stone-500 dark:bg-stone-600'
    },
    neutral: {
        bg: 'bg-neutral-600 dark:bg-neutral-700',
        iconBg: 'bg-neutral-500 dark:bg-neutral-600'
    }
};

type ThemeKey = keyof typeof themes;

interface HeaderProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    model: string;
    routeName: string | (() => string);
    buttonText: string;
    theme?: ThemeKey;
    buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
    showBackButton?: boolean;
    backRouteName?: string | (() => string);
    backButtonText?: string;
    showButton?: boolean;
    actionButtons?: React.ReactNode;
}

export default function Header({ title, description, icon, model, routeName, buttonText, theme = 'purple', buttonSize = 'default', showBackButton = false, backRouteName, backButtonText, showButton = true, actionButtons }: HeaderProps) {
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

                    {/* Action Buttons Container */}
                    <div className="flex items-center gap-2">
                        {showButton && (
                            <ActionButtons
                                model={model}
                                routeName={routeName}
                                buttonText={buttonText}
                                buttonSize={buttonSize}
                                showBackButton={showBackButton}
                                backRouteName={backRouteName}
                                backButtonText={backButtonText}
                                theme={theme}
                            />
                        )}
                        {actionButtons && (
                            <div className="flex items-center gap-2">
                                {actionButtons}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
