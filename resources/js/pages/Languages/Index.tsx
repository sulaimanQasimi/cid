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
    if (confirm('Are you sure you want to delete this language?')) {
      destroy(route('languages.destroy', id));
    }
  };

  return (
    <AppLayout>
      <Head title="Manage Languages" />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Manage Languages</h1>
          <Button asChild>
            <Link href={route('languages.create')}>Add Language</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>
              Manage your application languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No languages found
                    </TableCell>
                  </TableRow>
                ) : (
                  languages.map((language) => (
                    <TableRow key={language.id}>
                      <TableCell className="font-medium">{language.name}</TableCell>
                      <TableCell>{language.code}</TableCell>
                      <TableCell>{language.direction}</TableCell>
                      <TableCell>{language.active ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{language.default ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('translations.index', { language: language.code })}>
                              Translations
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('languages.edit', language.id)}>
                              Edit
                            </Link>
                          </Button>
                          {!language.default && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(language.id)}
                            >
                              Delete
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
