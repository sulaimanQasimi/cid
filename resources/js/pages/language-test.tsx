import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Language switcher disabled in RTL-only mode

export default function LanguageTest() {
  const { t, currentLanguage, direction, isRtl } = useTranslation();

  return (
    <AppLayout>
      <Head title="Language Test" />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Language Test</h1>
          {/* LanguageSwitcher removed */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Language: {currentLanguage.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p>Code: <strong>{currentLanguage.code}</strong></p>
              <p>Direction: <strong>{direction}</strong> (isRtl: {isRtl ? 'true' : 'false'})</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Common Translations</h3>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">{t('common.save')}</Button>
                <Button size="sm" variant="outline">{t('common.cancel')}</Button>
                <Button size="sm" variant="destructive">{t('common.delete')}</Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Language Management</h3>
              <p>{t('languages.description')}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Translation Management</h3>
              <p>{t('translations.description')}</p>
            </div>

            <div className="border-t pt-4 text-center">
              <p className={`text-lg ${isRtl ? 'font-bold' : ''}`}>
                {t('app.switch_language')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
