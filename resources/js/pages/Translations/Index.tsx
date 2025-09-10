import React, { useMemo, useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash, Download, Upload, Loader2, Languages, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { useLanguage } from '@/lib/i18n/language-context';
import axios from 'axios';

interface Language {
  id: number;
  code: string;
  name: string;
  direction: string;
  active: boolean;
  default: boolean;
}

interface Translation {
  key: string;
  value: string;
}

interface ApiResponse {
  translations: Translation[];
  message?: string;
}

interface TranslationProps {
  translations: Translation[] | Record<string, any>;
  groups: string[];
  initialLanguage?: string;
  initialGroup?: string;
  filters?: {
    search: string;
    sort: string;
    direction: string;
    per_page: number;
  };
  auth?: {
    permissions: string[];
  };
}

// Add PageProps interface for usePage
interface PageProps {
  csrf_token: string;
  auth: {
    user: any;
  };
  [key: string]: any; // Add index signature
}

const sortOptions = [
  { value: 'key', label: 'Key' },
  { value: 'value', label: 'Value' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function TranslationsIndex({
  translations = [],
  filters = {
    search: '',
    sort: 'key',
    direction: 'asc',
    per_page: 25
  },
  auth = {
    permissions: []
  }
}: TranslationProps) {
  const { t } = useTranslation();
  const { reloadTranslations } = useLanguage();
  const [localTranslations, setLocalTranslations] = useState<Translation[]>([]);
  const [updatingKeys, setUpdatingKeys] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(filters.per_page);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('translations.translations'),
      href: route('translations.index'),
    },
  ];

  // Ensure translations is always an array
  const translationsArray = useMemo(() => {
    if (Array.isArray(translations)) {
      return translations;
    }
    // If it's an object, convert it to an array of key-value pairs
    if (typeof translations === 'object' && translations !== null) {
      return Object.entries(translations).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : String(value)
      }));
    }
    return [];
  }, [translations]);

  // Initialize local translations state
  useEffect(() => {
    setLocalTranslations(translationsArray);
  }, [translationsArray]);

  // Filter translations based on search query
  const filteredTranslations = useMemo(() => {
    if (!searchQuery.trim()) {
      return localTranslations;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return localTranslations.filter(translation => 
      translation.key.toLowerCase().includes(query) || 
      translation.value.toLowerCase().includes(query)
    );
  }, [localTranslations, searchQuery]);

  // Paginate filtered translations
  const paginatedTranslations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTranslations.slice(startIndex, endIndex);
  }, [filteredTranslations, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTranslations.length / itemsPerPage);

  // Generate pagination links
  const generatePaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous page
    if (currentPage > 1) {
      links.push({
        url: null,
        label: 'Previous',
        active: false,
        isPrevious: true
      });
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      links.push({
        url: null,
        label: i.toString(),
        active: i === currentPage,
        page: i
      });
    }

    // Next page
    if (currentPage < totalPages) {
      links.push({
        url: null,
        label: 'Next',
        active: false,
        isNext: true
      });
    }

    return links;
  };

  // Method to update translation value
  const updateTranslation = async (key: string, value: string, language: string = 'fa') => {
    setUpdatingKeys(prev => new Set(prev).add(key));
    
    try {
      const response = await axios.put(`/api/languages/translations/${key}`, {
        value: value,
        language: language
      });

      if (response.data.success) {
        // Update local state
        setLocalTranslations(prev => 
          prev.map(translation => 
            translation.key === key 
              ? { ...translation, value: value }
              : translation
          )
        );
        
        // Reload translations in the language context
        await reloadTranslations();
      }
    } catch (error) {
      console.error('Failed to update translation:', error);
      // You might want to show a toast notification here
    } finally {
      setUpdatingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  // Handle input change
  const handleValueChange = (key: string, newValue: string) => {
    // Update local state immediately for better UX
    setLocalTranslations(prev => 
      prev.map(translation => 
        translation.key === key 
          ? { ...translation, value: newValue }
          : translation
      )
    );
  };

  // Handle input blur (when user finishes editing)
  const handleValueBlur = (key: string, value: string) => {
    updateTranslation(key, value);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    // For now, just sort locally
    const sorted = [...localTranslations].sort((a, b) => {
      if (value === 'key') {
        return filters.direction === 'asc' ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key);
      } else if (value === 'value') {
        return filters.direction === 'asc' ? a.value.localeCompare(b.value) : b.value.localeCompare(a.value);
      }
      return 0;
    });
    setLocalTranslations(sorted);
  };

  // Handle direction change
  const handleDirectionChange = () => {
    // Toggle direction and re-sort
    const newDirection = filters.direction === 'asc' ? 'desc' : 'asc';
    handleSortChange(filters.sort);
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle type filter change (not used for translations)
  const handleTypeChange = (value: string) => {
    // Not applicable for translations
  };

  // Handle category filter change (not used for translations)
  const handleCategoryChange = (value: string) => {
    // Not applicable for translations
  };

  // Handle department filter change (not used for translations)
  const handleDepartmentChange = (value: string) => {
    // Not applicable for translations
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setItemsPerPage(filters.per_page);
    setLocalTranslations(translationsArray);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('translations.translations')} />

      <div className="container px-0 py-6">
        {/* Header Component */}
        <Header
          title={t('translations.translations')}
          description={t('translations.translations')}
          icon={<Languages className="h-6 w-6 text-white" />}
          model="translation"
          routeName="languages.index"
          buttonText={t('languages.manage_languages')}
          theme="purple"
        />

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          searchPlaceholder={t('translations.search_placeholder')}
          filters={{
            sort: filters.sort,
            direction: filters.direction as 'asc' | 'desc',
            per_page: itemsPerPage
          }}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
          onDepartmentChange={handleDepartmentChange}
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={resetFilters}
          types={[]}
          categories={[]}
          departments={[]}
          sortOptions={sortOptions.map(option => ({
            value: option.value,
            label: t(`translations.sort_options.${option.value}`)
          }))}
          perPageOptions={perPageOptions.map(option => ({
            value: option.value,
            label: option.value.toString()
          }))}
          title={t('translations.search_filters')}
          description={t('translations.table.description')}
        />

        {/* Results Table */}
        <div className="mt-8">
          <Header
            title={t('translations.table.title')}
            description={t('translations.table.description')}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            model="translation"
            routeName="languages.index"
            buttonText={t('languages.manage_languages')}
            theme="purple"
          />
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('translations.key')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('translations.value')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTranslations.length > 0 ? (
                      paginatedTranslations.map((translation: Translation, idx: number) => (
                        <TableRow key={`${translation.key}-${idx}`} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-300 border-b border-purple-100 dark:border-purple-800">
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg max-w-[250px]" title={translation.key}>
                            <span className="truncate block">{translation.key}</span>
                          </TableCell>
                          <TableCell className="text-purple-800 dark:text-purple-200 py-6 px-6 max-w-[300px]">
                            <div className="flex items-center gap-2">
                              <Input
                                value={translation.value ?? ''}
                                onChange={(e) => handleValueChange(translation.key, e.target.value)}
                                onBlur={(e) => handleValueBlur(translation.key, e.target.value)}
                                disabled={updatingKeys.has(translation.key)}
                                className="flex-1 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
                              />
                              {updatingKeys.has(translation.key) && (
                                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title={t('translations.actions.edit')}
                                className="h-10 w-10 rounded-xl hover:bg-green-100 dark:hover:bg-green-800 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 hover:scale-110"
                              >
                                <Edit className="h-5 w-5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                            <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-purple-400 dark:text-purple-300" />
                            </div>
                            <p className="text-xl font-bold">{t('translations.no_records')}</p>
                            <p className="text-purple-500 dark:text-purple-400">No translation records found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-purple-50 dark:from-purple-900/20 to-white dark:to-gray-800 p-4 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    Previous
                  </Button>
                )}

                {/* Page Numbers */}
                {generatePaginationLinks().map((link, index) => {
                  if (link.isPrevious || link.isNext) return null;
                  
                  return (
                    <Button
                      key={index}
                      variant={link.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(link.page!)}
                      className={`min-w-[40px] ${
                        link.active
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      }`}
                    >
                      {link.label}
                    </Button>
                  );
                })}

                {/* Next Button */}
                {currentPage < totalPages && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    Next
                  </Button>
                )}
              </div>
              
              {/* Pagination Info */}
              <div className="mt-4 text-center text-sm text-purple-600 dark:text-purple-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTranslations.length)} of {filteredTranslations.length} translations
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
