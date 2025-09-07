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
            <SelectTrigger className={`h-10 rounded-md border-gray-300 bg-white text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
