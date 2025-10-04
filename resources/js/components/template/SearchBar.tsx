import { useTranslation } from '@/lib/i18n/translate';
import { Input } from '../ui/input';

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
}

export default function SearchBar({ 
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
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t('common.search')}
                    className="input shadow-lg focus:border-2 border-gray-300 dark:border-gray-600 px-5 py-3 rounded-xl w-64 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400"
                    name="search"
                    type="search"
                />
            </div>
        </form>
    );
}
