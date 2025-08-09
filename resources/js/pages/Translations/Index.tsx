import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash, Download, Upload } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
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
  id: number;
  language_id: number;
  key: string;
  value: string;
  group: string;
}

interface Pagination {
  data: Translation[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Filters {
  language?: string;
  group?: string;
}

interface TranslationProps {
  languages: Language[];
  translations: Pagination;
  groups: string[];
  filters: Filters;
}

// Add PageProps interface for usePage
interface PageProps {
  csrf_token: string;
  auth: {
    user: any;
  };
  [key: string]: any; // Add index signature
}

export default function TranslationsIndex({
  languages = [],
  translations = { data: [], current_page: 1, last_page: 1, per_page: 15, total: 0 },
  groups = [],
  filters = {}
}: TranslationProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const { auth, csrf_token } = usePage<PageProps>().props;
  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Ensure we have valid language and group values for the selects
  const currentLanguage = filters.language || (languages[0]?.code || "en");
  const currentGroup = filters.group || "all";

  // Pre-process groups to ensure no empty strings
  const safeGroups = groups.map(g => g || "unnamed-group");

  // If no translations data, provide default empty state
  const translationsData = translations?.data || [];
  const currentPage = translations?.current_page || 1;
  const lastPage = translations?.last_page || 1;
  const total = translations?.total || 0;

  // Filter translations by search query
  const filteredTranslations = searchQuery ?
    translationsData.filter(translation =>
      translation.key?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.value?.toLowerCase().includes(searchQuery.toLowerCase())
    ) :
    translationsData;

  const hasEdits = useMemo(() => Object.keys(editedValues).length > 0, [editedValues]);

  const handleValueChange = (key: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleRevert = () => setEditedValues({});

  const handleSave = async () => {
    if (!hasEdits) return;
    try {
      setSaving(true);
      // Group edits by group for efficient import calls
      const keyToGroup: Record<string, string> = {};
      translationsData.forEach(tr => {
        keyToGroup[tr.key] = tr.group || 'general';
      });

      const grouped: Record<string, Record<string, string>> = {};
      Object.entries(editedValues).forEach(([key, value]) => {
        const group = keyToGroup[key] || 'general';
        if (!grouped[group]) grouped[group] = {};
        grouped[group][key] = value;
      });

      // Perform batch import per group via API TranslationController::import
      const groupEntries = Object.entries(grouped);
      for (const [group, payload] of groupEntries) {
        await axios.post('/api/translations/import', {
          language_code: currentLanguage,
          translations: payload,
          group,
        });
      }

      setEditedValues({});
      // Refresh current page
      window.location.href = route('translations.index', {
        page: currentPage,
        language: currentLanguage,
        group: currentGroup === 'all' ? '' : currentGroup,
      });
    } catch (e) {
      console.error('Failed to save translations', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <Head title={t('translations.translations')} />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">{t('translations.translations')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('translations.export', { language_id: currentLanguage, group: filters.group === "all" ? "" : filters.group })}>
                <Download className="mr-2 h-4 w-4" />
                {t('translations.export')}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('translations.export-json')}>
                <Upload className="mr-2 h-4 w-4" />
                {t('translations.export_translations')}
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('translations.create')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('translations.add_translation')}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setEditMode(v => !v)}>
              {t('common.edit')}
            </Button>
            <Button onClick={handleSave} disabled={!hasEdits || saving}>
              {t('common.save')}
            </Button>
            <Button variant="outline" onClick={handleRevert} disabled={!hasEdits}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('translations.translations')}</CardTitle>
            <CardDescription>
              {t('translations.description')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <Select
                  value={currentLanguage}
                  onValueChange={(value) => window.location.href = route('translations.index', { language: value, group: currentGroup === "all" ? "" : currentGroup })}
                >
                    <SelectTrigger>
                      <SelectValue placeholder={t('translations.select_language')} />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-1/3">
                <Select
                  value={currentGroup}
                  onValueChange={(value) => window.location.href = route('translations.index', { language: currentLanguage, group: value === "all" ? "" : value })}
                >
                    <SelectTrigger>
                      <SelectValue placeholder={t('translations.select_group')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('translations.all_groups')}</SelectItem>
                    {safeGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-1/3 relative">
                <Input
                  placeholder={t('translations.filter_translations')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('translations.key')}</TableHead>
                  <TableHead>{t('translations.value')}</TableHead>
                  <TableHead>{t('translations.group')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTranslations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      {searchQuery ? t('common.no_results') : t('translations.no_translations')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTranslations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell className="font-medium max-w-[250px] truncate" title={translation.key}>
                        {translation.key}
                      </TableCell>
                      <TableCell className="max-w-[300px]" title={editedValues[translation.key] ?? translation.value}>
                        {editMode ? (
                          <Input
                            value={editedValues[translation.key] ?? translation.value ?? ''}
                            onChange={(e) => handleValueChange(translation.key, e.target.value)}
                          />
                        ) : (
                          <span className={!(translation.value) ? 'text-muted-foreground italic' : ''}>
                            {translation.value || 'Empty'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{translation.group}</TableCell>
                      <TableCell className="text-right">
                       
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {lastPage > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {t('languages.total_languages', { count: String(total) })}
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => window.location.href = route('translations.index', {
                      page: currentPage - 1,
                      language: currentLanguage,
                      group: currentGroup === "all" ? "" : currentGroup
                    })}
                  >
                    {t('departments.prev')}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= lastPage}
                    onClick={() => window.location.href = route('translations.index', {
                      page: currentPage + 1,
                      language: currentLanguage,
                      group: currentGroup === "all" ? "" : currentGroup
                    })}
                  >
                    {t('departments.next')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {t('translations.total_translations', { count: String(total) })}
            </p>

            <Button variant="outline" asChild>
              <Link href={route('languages.index')}>
                {t('languages.manage_languages')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
