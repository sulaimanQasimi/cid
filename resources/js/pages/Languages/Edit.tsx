import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/translate';

interface Language {
  id: number;
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  active: boolean;
  default: boolean;
}

interface Props {
  language?: Partial<Language>;
}

export default function EditLanguage({ language = {} }: Props) {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <Head title="Edit Language" />

      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Language</h1>
          <p className="text-muted-foreground">
            Edit an existing language
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Language edit form (under construction)</p>
            {language?.name && (
              <p className="mt-4">Editing language: {language.name}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
