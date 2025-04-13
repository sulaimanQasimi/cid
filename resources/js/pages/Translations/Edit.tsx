import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/translate';

export default function EditTranslation({ translation = {}, languages = [], groups = [] }) {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <Head title="Edit Translation" />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Edit Translation</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Translation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Translation edit form (under construction)</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
