import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, Plus, Check, X, Edit, Trash } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';

interface Language {
  id: number;
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  active: boolean;
  default: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  languages: Language[];
}

export default function LanguagesIndex({ languages = [] }: Props) {
  const { t } = useTranslation();
  const { delete: destroy } = useForm();

  const handleDelete = (id: number) => {
    if (confirm(t('languages.confirm_delete'))) {
      destroy(route('languages.destroy', id));
    }
  };

  return (
    <AppLayout>
      <Head title={t('languages.manage_languages')} />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">{t('languages.manage_languages')}</h1>
          <Button asChild>
            <Link href={route('languages.create')}>{t('languages.add_language')}</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('languages.languages')}</CardTitle>
            <CardDescription>
              {t('languages.manage_languages')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('languages.language')}</TableHead>
                  <TableHead>{t('languages.code')}</TableHead>
                  <TableHead>{t('languages.direction')}</TableHead>
                  <TableHead>{t('languages.active')}</TableHead>
                  <TableHead>{t('languages.default')}</TableHead>
                  <TableHead className="text-right">{t('languages.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t('languages.no_languages')}
                    </TableCell>
                  </TableRow>
                ) : (
                  languages.map((language) => (
                    <TableRow key={language.id}>
                      <TableCell className="font-medium">{language.name}</TableCell>
                      <TableCell>{language.code}</TableCell>
                      <TableCell>
                        {language.direction === 'rtl' ? t('languages.right_to_left') : t('languages.left_to_right')}
                      </TableCell>
                      <TableCell>{language.active ? t('common.yes') : t('common.no')}</TableCell>
                      <TableCell>{language.default ? t('common.yes') : t('common.no')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('translations.index', { language: language.code })}>
                              {t('translations.translations')}
                            </Link>
                          </Button>
                          {!language.default && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(language.id)}
                            >
                              {t('common.delete')}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
