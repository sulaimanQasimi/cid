import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/translate';

export default function CreateLanguage() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <Head title="Create Language" />

      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Language</h1>
          <p className="text-muted-foreground">
            Add a new language to your application
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Language</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Language creation form (under construction)</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

