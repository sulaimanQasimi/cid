import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n/translate';

export default function View() {
  const { t } = useTranslation();
  return (
    <>
      <Head title={t('reports.view.page_title', { code: '' })} />
    </>
  );
}
