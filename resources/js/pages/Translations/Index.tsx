import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash, Download, Upload } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';

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

  return (
    <AppLayout>
      <Head title="Translations" />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Translations</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('translations.export', { language_id: currentLanguage, group: filters.group === "all" ? "" : filters.group })}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('translations.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Translation
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Translations</CardTitle>
            <CardDescription>
              Manage your application translations
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
                    <SelectValue placeholder="Select Language" />
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
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
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
                  placeholder="Search translations..."
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
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTranslations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      {searchQuery ? "No translations match your search" : "No translations found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTranslations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell className="font-medium max-w-[250px] truncate" title={translation.key}>
                        {translation.key}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate" title={translation.value}>
                        {translation.value || <span className="text-muted-foreground italic">Empty</span>}
                      </TableCell>
                      <TableCell>{translation.group}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('translations.edit', translation.id)}>
                              Edit
                            </Link>
                          </Button>
                          <form method="POST" action={route('translations.destroy', translation.id)}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (confirm('Are you sure you want to delete this translation?')) {
                                    e.currentTarget.submit();
                                  }
                                }}>
                            <input type="hidden" name="_method" value="DELETE" />
                            <input type="hidden" name="_token" value={csrf_token} />
                            <Button variant="destructive" size="sm" type="submit">
                              Delete
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {lastPage > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTranslations.length} of {total} translations
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
                    Previous
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
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Total: {total} translations
            </p>

            <Button variant="outline" asChild>
              <Link href={route('languages.index')}>
                Manage Languages
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
