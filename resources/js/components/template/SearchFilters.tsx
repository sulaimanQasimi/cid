import { useTranslation } from '@/lib/i18n/translate';
import { ArrowUpDown, ChevronDown, FilterX, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import FilterSelect from './FilterSelect';
import SearchBar from './SearchBar';

interface FilterOption {
    value: string;
    label: string;
}

interface SortOption {
    value: string;
    label: string;
}

interface PerPageOption {
    value: number;
    label: string;
}

interface SearchFiltersProps {
    // Search
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    searchPlaceholder?: string;
    
    // Filters
    filters: {
        type?: string;
        category?: string;
        department?: string;
        sort: string;
        direction: 'asc' | 'desc';
        per_page: number;
    };
    
    // Filter handlers
    onTypeChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onDepartmentChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onDirectionChange: () => void;
    onPerPageChange: (value: string) => void;
    onResetFilters: () => void;
    
    // Options
    types: FilterOption[];
    categories: FilterOption[];
    departments: FilterOption[];
    sortOptions: SortOption[];
    perPageOptions: PerPageOption[];
    
    // Customization
    title?: string;
    description?: string;
    className?: string;
}

export default function SearchFilters({
    searchQuery,
    onSearchChange,
    onSearchSubmit,
    searchPlaceholder,
    filters,
    onTypeChange,
    onCategoryChange,
    onDepartmentChange,
    onSortChange,
    onDirectionChange,
    onPerPageChange,
    onResetFilters,
    types,
    categories,
    departments,
    sortOptions,
    perPageOptions,
    title,
    description,
    className = ''
}: SearchFiltersProps) {
    const { t } = useTranslation();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    return (
        <Card className={`border border-gray-200 bg-white shadow-sm ${className}`}>
            <CardHeader
                className="cursor-pointer border-b border-gray-200 bg-gray-50 py-3"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
                <CardTitle className="flex items-center justify-between text-base font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="rounded-md bg-blue-100 p-2">
                            <Search className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-base font-medium">{title || t('common.search_filters')}</div>
                            <div className="text-xs text-gray-500">{description || t('common.find_and_filter')}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-gray-600 hover:bg-gray-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                onResetFilters();
                            }}
                        >
                            <FilterX className="mr-1 h-3 w-3" />
                            {t('common.reset_filters')}
                        </Button>
                        <div className={`transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`}>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>

            <div className={`overflow-hidden transition-all duration-200 ${isFiltersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Search Bar */}
                        <div className="md:col-span-2">
                            <SearchBar
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={onSearchChange}
                                onSubmit={onSearchSubmit}
                            />
                        </div>

                        {/* Type Filter */}
                        {types.length > 0 && (
                            <div>
                                <FilterSelect
                                    placeholder={t('common.filter_by_type')}
                                    value={filters.type || '_all'}
                                    onValueChange={onTypeChange}
                                    options={types}
                                />
                            </div>
                        )}

                        {/* Category Filter */}
                        {categories.length > 0 && (
                            <div>
                                <FilterSelect
                                    placeholder={t('common.filter_by_category')}
                                    value={filters.category || '_all'}
                                    onValueChange={onCategoryChange}
                                    options={categories}
                                />
                            </div>
                        )}

                        {/* Department Filter */}
                        {departments.length > 0 && (
                            <div>
                                <FilterSelect
                                    placeholder={t('common.filter_by_department')}
                                    value={filters.department || '_all'}
                                    onValueChange={onDepartmentChange}
                                    options={departments}
                                />
                            </div>
                        )}

                        {/* Sort Options */}
                        <div>
                            <FilterSelect
                                placeholder={t('common.sort_by')}
                                value={filters.sort}
                                onValueChange={onSortChange}
                                options={sortOptions}
                            />
                        </div>

                        {/* Direction & Per Page Row */}
                        <div className="grid grid-cols-3 gap-3 md:col-span-2 lg:col-span-4">
                            {/* Direction Button */}
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={onDirectionChange}
                                    title={t(`common.sort_${filters.direction === 'asc' ? 'ascending' : 'descending'}`)}
                                    className="h-10 w-full border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <ArrowUpDown className={`mr-2 h-4 w-4 ${filters.direction === 'asc' ? '' : 'rotate-180 transform'}`} />
                                    {filters.direction === 'asc' ? t('common.sort_ascending') : t('common.sort_descending')}
                                </Button>
                            </div>

                            {/* Per Page Options */}
                            <div>
                                <FilterSelect
                                    placeholder={t('common.items_per_page')}
                                    value={filters.per_page.toString()}
                                    onValueChange={onPerPageChange}
                                    options={perPageOptions}
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onResetFilters}
                                    className="h-10 border-gray-300 px-3 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <FilterX className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}