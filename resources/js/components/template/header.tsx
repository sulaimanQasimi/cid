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
                </div>
            </div>
        </div>
    );
}
