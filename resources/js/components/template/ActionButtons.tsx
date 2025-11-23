import { useTranslation } from '@/lib/i18n/translate';
import { Link } from '@inertiajs/react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { CanCreate } from '../ui/permission-guard';

interface ActionButtonsProps {
    model: string;
    routeName: string | (() => string);
    buttonText?: string;
    buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
    showBackButton?: boolean;
    backRouteName?: string | (() => string);
    backButtonText?: string;
    theme?: 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'indigo' | 'teal' | 'emerald' | 'cyan' | 'rose' | 'pink' | 'violet' | 'fuchsia' | 'sky' | 'lime' | 'amber' | 'slate' | 'zinc' | 'stone' | 'neutral';
}

export default function ActionButtons({ 
    model, 
    routeName, 
    buttonText, 
    buttonSize = 'default', 
    showBackButton = false, 
    backRouteName, 
    backButtonText,
    theme = 'purple'
}: ActionButtonsProps) {
    const { t } = useTranslation();
    
    // Helper function to resolve route name
    const resolveRoute = (routeParam: string | (() => string)): string => {
        const resolved = typeof routeParam === 'function' ? routeParam() : routeParam;
        // If the resolved route is already a full URL, return it as is
        // Otherwise, it's a route name that needs to be passed to route()
        return resolved.startsWith('http') ? resolved : route(resolved);
    };
    
    return (
        <div className="flex items-center gap-2">
            {showBackButton && backRouteName && (
                <Button
                    asChild
                    variant="outline"
                    size={buttonSize}
                    className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                    <Link href={resolveRoute(backRouteName)} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        {backButtonText}
                    </Link>
                </Button>
            )}
            {buttonText && (
                <CanCreate model={model}>
                    <Button
                        asChild
                        size={buttonSize}
                        className="bg-white text-gray-900 hover:bg-white/90"
                    >
                        <Link href={resolveRoute(routeName)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            {buttonText}
                        </Link>
                    </Button>
                </CanCreate>
            )}
        </div>
    );
}
