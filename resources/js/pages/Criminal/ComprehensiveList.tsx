import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, User, Phone, MapPin, Calendar, FileText, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDate } from '@/lib/utils/date';
import { Pagination } from '@/components/pagination';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';

interface Criminal {
  id: number;
  photo: string | null;
  number: string | null;
  name: string;
  father_name: string | null;
  grandfather_name: string | null;
  id_card_number: string | null;
  phone_number: string | null;
  original_residence: string | null;
  current_residence: string | null;
  crime_type: string | null;
  arrest_location: string | null;
  arrested_by: string | null;
  arrest_date: string | null;
  referred_to: string | null;
  final_verdict: string | null;
  notes: string | null;
  department_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface Department {
  id: number;
  name: string;
  code: string;
}

interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface Props {
  criminals: {
    data?: Criminal[];
    links?: PaginationLinks[];
    meta?: PaginationMeta;
  };
  departments: Department[];
  filters: {
    search: string;
    sort: string;
    direction: string;
    per_page: number;
    department_id?: number | string;
  };
}

const sortOptions = [
  { value: 'name', label: 'criminal.comprehensive_list.sort_options.name' },
  { value: 'number', label: 'criminal.comprehensive_list.sort_options.number' },
  { value: 'crime_type', label: 'criminal.comprehensive_list.sort_options.crime_type' },
  { value: 'arrest_date', label: 'criminal.comprehensive_list.sort_options.arrest_date' },
  { value: 'department_id', label: 'criminal.comprehensive_list.sort_options.department_id' },
  { value: 'id_card_number', label: 'criminal.comprehensive_list.sort_options.id_card_number' },
  { value: 'phone_number', label: 'criminal.comprehensive_list.sort_options.phone_number' },
  { value: 'created_at', label: 'criminal.comprehensive_list.sort_options.created_at' },
  { value: 'updated_at', label: 'criminal.comprehensive_list.sort_options.updated_at' },
];

const perPageOptions = [
  { value: 10, label: 'criminal.comprehensive_list.per_page_option' },
  { value: 25, label: 'criminal.comprehensive_list.per_page_option' },
  { value: 50, label: 'criminal.comprehensive_list.per_page_option' },
  { value: 100, label: 'criminal.comprehensive_list.per_page_option' },
];

// Enhanced Card Component with better UX
const CriminalCard = ({ criminal, t }: { criminal: Criminal; t: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="group overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl">
      {/* Header with gradient background */}
      <CardHeader 
        className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 text-white p-4 relative overflow-hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>
        
        <div className="relative flex items-start justify-between gap-3 cursor-pointer">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Photo */}
            {criminal.photo ? (
              <div className="relative flex-shrink-0">
                <img
                  src={`/storage/${criminal.photo}`}
                  alt={criminal.name}
                  className="w-14 h-14 object-cover rounded-xl border-[3px] border-white/30 shadow-xl ring-2 ring-white/20"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            ) : (
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30 shadow-xl ring-2 ring-white/20 flex-shrink-0">
                <User className="h-7 w-7 text-white/90" />
              </div>
            )}
            
            {/* Name and badges */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-white mb-2 truncate leading-tight">
                {criminal.name}
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {criminal.number && (
                  <Badge className="bg-white/25 text-white border-white/40 text-xs font-mono px-2 py-0.5 font-medium backdrop-blur-sm shadow-sm" dir="ltr">
                    #{criminal.number}
                  </Badge>
                )}
                {criminal.crime_type && (
                  <Badge className="bg-red-500/90 text-white border-red-400/50 text-xs px-2 py-0.5 font-medium shadow-sm">
                    {criminal.crime_type}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* ID and expand button */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Badge className="bg-white/25 text-white border-white/40 text-xs font-mono px-2 py-1 font-semibold backdrop-blur-sm shadow-sm" dir="ltr">
              ID: {criminal.id}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="h-7 w-7 p-0 text-white hover:bg-white/25 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        {/* Essential Info - Always Visible */}
        <div className="grid grid-cols-2 gap-3">
          {criminal.father_name && (
            <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-100 dark:border-blue-800/50">
              <p className="text-[10px] font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-1">
                {t('criminal.comprehensive_list.table.father_name')}
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold truncate">{criminal.father_name}</p>
            </div>
          )}
          {criminal.phone_number && (
            <div className="bg-green-50/50 dark:bg-green-900/20 rounded-lg p-2.5 border border-green-100 dark:border-green-800/50">
              <p className="text-[10px] font-medium text-green-700 dark:text-green-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {t('criminal.comprehensive_list.table.phone_number')}
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold" dir="ltr">{criminal.phone_number}</p>
            </div>
          )}
          {criminal.department && (
            <div className="col-span-2 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg p-2.5 border border-purple-100 dark:border-purple-800/50">
              <p className="text-[10px] font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {t('criminal.comprehensive_list.table.department')}
              </p>
              <Badge variant="outline" className="bg-white dark:bg-gray-800 text-xs font-semibold border-purple-200 dark:border-purple-700">
                {criminal.department.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Expandable Details with smooth animation */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {isExpanded && (
            <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              {/* Personal Information */}
              {(criminal.grandfather_name || criminal.id_card_number) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    {t('criminal.comprehensive_list.card.personal_info')}
                  </h4>
                  <div className="grid grid-cols-1 gap-2 pl-8">
                    {criminal.grandfather_name && (
                      <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('criminal.comprehensive_list.table.grandfather_name')}:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold">{criminal.grandfather_name}</span>
                      </div>
                    )}
                    {criminal.id_card_number && (
                      <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('criminal.comprehensive_list.table.id_card_number')}:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold font-mono" dir="ltr">{criminal.id_card_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Residence Information */}
              {(criminal.original_residence || criminal.current_residence) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    {t('criminal.comprehensive_list.card.residence')}
                  </h4>
                  <div className="space-y-2 pl-8">
                    {criminal.original_residence && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-2.5">
                        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          {t('criminal.comprehensive_list.table.original_residence')}
                        </p>
                        <p className="text-xs text-gray-900 dark:text-gray-100">{criminal.original_residence}</p>
                      </div>
                    )}
                    {criminal.current_residence && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-2.5">
                        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          {t('criminal.comprehensive_list.table.current_residence')}
                        </p>
                        <p className="text-xs text-gray-900 dark:text-gray-100">{criminal.current_residence}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Crime Information */}
              {(criminal.arrest_location || criminal.arrested_by || criminal.arrest_date || criminal.referred_to) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <FileText className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    </div>
                    {t('criminal.comprehensive_list.card.crime_info')}
                  </h4>
                  <div className="grid grid-cols-1 gap-2 pl-8">
                    {criminal.arrest_location && (
                      <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('criminal.comprehensive_list.table.arrest_location')}:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold text-right max-w-[60%] truncate">{criminal.arrest_location}</span>
                      </div>
                    )}
                    {criminal.arrested_by && (
                      <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('criminal.comprehensive_list.table.arrested_by')}:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold">{criminal.arrested_by}</span>
                      </div>
                    )}
                    {criminal.arrest_date && (
                      <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {t('criminal.comprehensive_list.table.arrest_date')}:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold">{formatPersianDate(criminal.arrest_date)}</span>
                      </div>
                    )}
                    {criminal.referred_to && (
                      <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('criminal.comprehensive_list.table.referred_to')}:</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold">{criminal.referred_to}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Final Verdict */}
              {criminal.final_verdict && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">{t('criminal.comprehensive_list.table.final_verdict')}</h4>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">{criminal.final_verdict}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {criminal.notes && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">{t('criminal.comprehensive_list.table.notes')}</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                      {criminal.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Footer Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {criminal.creator && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded">
                      <User className="h-3 w-3" />
                    </div>
                    <span className="font-medium">{criminal.creator.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded">
                    <Calendar className="h-3 w-3" />
                  </div>
                  <span className="font-medium">{formatPersianDate(criminal.created_at)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ComprehensiveList({
  criminals,
  departments = [],
  filters,
}: Props) {
  const { t } = useTranslation();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('criminal.comprehensive_list.page_title'),
      href: route('criminals.comprehensive_list'),
    },
  ];

  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(filters.department_id?.toString() || '');

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchQuery });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    applyFilters({ sort: value });
  };

  // Handle direction change
  const handleDirectionChange = () => {
    const newDirection = filters.direction === 'asc' ? 'desc' : 'asc';
    applyFilters({ direction: newDirection });
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    applyFilters({ per_page: parseInt(value) });
  };

  // Handle department filter change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    const deptId = value === '_all' || value === '' ? undefined : parseInt(value);
    applyFilters({ department_id: deptId as any });
  };

  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('criminals.comprehensive_list'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    router.get(route('criminals.comprehensive_list'), {
      search: '',
      sort: 'created_at',
      direction: 'desc',
      per_page: 25,
      page: 1,
      department_id: undefined as any
    });
  };

  // Prepare department options for SearchFilters
  const departmentOptions = [
    { value: '_all', label: t('criminal.all_departments') },
    ...departments.map(dept => ({
      value: dept.id.toString(),
      label: dept.name
    }))
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('criminal.comprehensive_list.page_title')} />

      <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1920px] mx-auto">
        {/* Modern Header */}
        <div className="mb-6">
          <Header
            title={t('criminal.comprehensive_list.page_title')}
            description={t('criminal.comprehensive_list.page_description')}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            model="criminal"
            routeName="criminals.comprehensive_list"
            theme="blue"
            showBackButton={false}
            showButton={false}
            buttonText=""
          />
        </div>

        {/* Search Filters */}
        <div className="mb-6">
          <SearchFilters
            title={t('criminal.comprehensive_list.search_filters')}
            description={t('criminal.comprehensive_list.table.description')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearch}
            searchPlaceholder={t('criminal.comprehensive_list.search_placeholder')}
            filters={{
              sort: filters.sort,
              direction: filters.direction as 'asc' | 'desc',
              per_page: filters.per_page,
              department: selectedDepartment || '_all',
            }}
            onTypeChange={() => {}}
            onCategoryChange={() => {}}
            onDepartmentChange={handleDepartmentChange}
            onSortChange={handleSortChange}
            onDirectionChange={handleDirectionChange}
            onPerPageChange={handlePerPageChange}
            onResetFilters={resetFilters}
            types={[]}
            categories={[]}
            departments={departmentOptions}
            sortOptions={sortOptions.map(option => ({
              value: option.value,
              label: t(option.label)
            }))}
            perPageOptions={perPageOptions.map(option => ({
              value: option.value,
              label: option.value.toString()
            }))}
          />
        </div>

        {/* Results Count */}
        {criminals.meta && (
          <div className="mb-5 px-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t('criminal.comprehensive_list.results_count', {
                  total: criminals.meta.total.toString(),
                  from: criminals.meta.from.toString(),
                  to: criminals.meta.to.toString()
                })}
              </p>
            </div>
          </div>
        )}

        {/* Card View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {criminals.data && criminals.data.length > 0 ? (
            criminals.data.map((criminal) => (
              <CriminalCard key={criminal.id} criminal={criminal} t={t} />
            ))
          ) : (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <CardContent className="flex flex-col items-center justify-center py-20 px-4">
                  <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-6 mb-5 shadow-lg">
                    <AlertTriangle className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t('criminal.comprehensive_list.no_records')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                    {t('criminal.comprehensive_list.no_records_description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Pagination */}
        {criminals && criminals.links && criminals.links.length > 0 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Pagination links={criminals.links} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
