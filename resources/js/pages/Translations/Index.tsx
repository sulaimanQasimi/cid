import React, { useMemo, useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash, Download, Upload, Loader2 } from 'lucide-react';
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
  translations = [],
}: TranslationProps) {
  const { t } = useTranslation();
  const [localTranslations, setLocalTranslations] = useState<Translation[]>([]);
  const [updatingKeys, setUpdatingKeys] = useState<Set<string>>(new Set());

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

  return (
    <AppLayout>
      <Head title={t('translations.translations')} />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">{t('translations.translations')}</h1>

        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('translations.translations')}</CardTitle>
            <CardDescription>
              {t('translations.description')}
            </CardDescription>
          </CardHeader>

          <CardContent>


            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('translations.key')}</TableHead>
                  <TableHead>{t('translations.value')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localTranslations.map((translation: Translation, idx: number) => (
                  <TableRow key={`${translation.key}-${idx}`}>
                    <TableCell className="font-medium max-w-[250px]" title={translation.key}>
                      <span className="truncate block">{translation.key}</span>
                    </TableCell>
                    <TableCell className="max-w-[300px]" title={translation.value}>
                      <div className="flex items-center gap-2">
                        <Input
                          value={translation.value ?? ''}
                          onChange={(e) => handleValueChange(translation.key, e.target.value)}
                          onBlur={(e) => handleValueBlur(translation.key, e.target.value)}
                          disabled={updatingKeys.has(translation.key)}
                          className="flex-1"
                        />
                        {updatingKeys.has(translation.key) && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </CardContent>

          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {t('translations.total_translations', { count: String(localTranslations.length) })}
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
