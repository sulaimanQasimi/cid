import { useTranslation } from '@/lib/i18n/translate';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterSelectProps {
    placeholder?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: FilterOption[];
    className?: string;
}

export default function FilterSelect({ 
    placeholder, 
    value, 
    onValueChange, 
    options, 
    className = ''
}: FilterSelectProps) {
    const { t } = useTranslation();

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={`h-11 w-full border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-sm shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md transition-all duration-200 ${className}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-slate-900 dark:text-slate-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 dark:focus:from-blue-900/30 dark:focus:to-purple-900/30 hover:text-blue-700 dark:hover:text-blue-300 focus:text-blue-700 dark:focus:text-blue-300 transition-all duration-200 rounded-md mx-1 my-0.5">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
