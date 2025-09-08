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
            <SelectTrigger className={`h-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 rounded-none ${className}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-none">
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
