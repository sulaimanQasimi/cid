import { useTranslation } from '@/lib/i18n/translate';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
}

export default function SearchBar({ 
    placeholder, 
    value, 
    onChange, 
    onSubmit, 
    className = ''
}: SearchBarProps) {
    const { t } = useTranslation();

    return (
        <form onSubmit={onSubmit} className={`relative ${className}`}>
            <div className="relative">
                <Input
                    placeholder={placeholder || t('common.search_placeholder')}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pr-10 pl-4 text-sm shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button
                    type="submit"
                    size="sm"
                    className="absolute top-1/2 right-1 h-8 -translate-y-1/2 bg-blue-600 dark:bg-blue-700 px-3 text-xs text-white dark:text-gray-100 hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                    {t('common.search')}
                </Button>
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
        </form>
    );
}
