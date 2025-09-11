import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, BarChart3, Pencil, X, MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// AM Map Province codes for Afghanistan - same as in Create.tsx
const amMapProvinceCodes = [
  { id: 'AF-BAL', name: 'Balkh' },
  { id: 'AF-BAM', name: 'Bamyan' },
  { id: 'AF-BDG', name: 'Badghis' },
  { id: 'AF-BDS', name: 'Badakhshan' },
  { id: 'AF-BGL', name: 'Baghlan' },
  { id: 'AF-DAY', name: 'Daykundi' },
  { id: 'AF-FRA', name: 'Farah' },
  { id: 'AF-FYB', name: 'Faryab' },
  { id: 'AF-GHA', name: 'Ghazni' },
  { id: 'AF-GHO', name: 'Ghor' },
  { id: 'AF-HEL', name: 'Helmand' },
  { id: 'AF-HER', name: 'Herat' },
  { id: 'AF-JOW', name: 'Jowzjan' },
  { id: 'AF-KAB', name: 'Kabul' },
  { id: 'AF-KAN', name: 'Kandahar' },
  { id: 'AF-KAP', name: 'Kapisa' },
  { id: 'AF-KDZ', name: 'Kunduz' },
  { id: 'AF-KHO', name: 'Khost' },
  { id: 'AF-KNR', name: 'Kunar' },
  { id: 'AF-LAG', name: 'Laghman' },
  { id: 'AF-LOG', name: 'Logar' },
  { id: 'AF-NAN', name: 'Nangarhar' },
  { id: 'AF-NIM', name: 'Nimruz' },
  { id: 'AF-NUR', name: 'Nuristan' },
  { id: 'AF-PAN', name: 'Panjshir' },
  { id: 'AF-PAR', name: 'Parwan' },
  { id: 'AF-PIA', name: 'Paktia' },
  { id: 'AF-PKA', name: 'Paktika' },
  { id: 'AF-SAM', name: 'Samangan' },
  { id: 'AF-SAR', name: 'Sar-e Pol' },
  { id: 'AF-TAK', name: 'Takhar' },
  { id: 'AF-URU', name: 'Uruzgan' },
  { id: 'AF-WAR', name: 'Wardak' },
  { id: 'AF-ZAB', name: 'Zabul' },
];

interface ProvinceData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  governor: string | null;
  capital: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface EditProps {
  province: ProvinceData;
}

export default function Edit({ province }: EditProps) {
  const { canUpdate } = usePermissions();
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('dashboard.page_title'),
      href: route('dashboard'),
    },
    {
      title: t('provinces.page_title'),
      href: route('provinces.index'),
    },
    {
      title: province.name,
      href: route('provinces.show', province.id),
    },
    {
      title: t('provinces.edit.title', { name: province.name }),
      href: '#',
    },
  ];

  const { data, setData, put, processing, errors } = useForm({
    name: province.name || '',
    code: province.code || '',
    description: province.description || '',
    governor: province.governor || '',
    capital: province.capital || '',
    status: province.status || 'active',
  });

  const handleProvinceCodeChange = (code: string) => {
    setData('code', code);
    // If the name is already set to match the previous code's name, update it
    const currentProvinceName = amMapProvinceCodes.find(p => p.id === province.code)?.name;
    if (currentProvinceName && data.name === currentProvinceName) {
      const selectedProvince = amMapProvinceCodes.find(p => p.id === code);
      if (selectedProvince) {
        setData('name', selectedProvince.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('provinces.update', province.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('provinces.edit.title', { name: province.name })} />
      
      <div className="container px-0 py-6">
        {/* Header Component */}
        <Header
          title={t('provinces.edit.title', { name: province.name })}
          description={t('provinces.edit.description')}
          icon={<MapPin className="h-6 w-6" />}
          model="province"
          routeName={() => route('provinces.show', province.id)}
          buttonText={t('common.view')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName={() => route('provinces.show', province.id)}
          backButtonText={t('common.back')}
          showButton={false}
        />

        <CanUpdate model="province">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 dark:bg-white/10 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Pencil className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('provinces.edit.form_title')}</div>
                  <div className="text-purple-100 dark:text-purple-200 text-sm font-medium">{t('provinces.edit.form_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <form>
              <CardContent className="p-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                      {t('provinces.form.name_label')} *
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder={t('provinces.form.name_placeholder')}
                      required
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/50 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg"
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <X className="h-4 w-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="code" className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                      {t('provinces.form.code_label')} *
                    </Label>
                    <Select
                      value={data.code}
                      onValueChange={handleProvinceCodeChange}
                      required
                    >
                      <SelectTrigger className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/50 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg">
                        <SelectValue placeholder={t('provinces.form.code_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {amMapProvinceCodes.map((province) => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.id} - {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.code && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <X className="h-4 w-4" />
                        {errors.code}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="governor" className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                      {t('provinces.form.governor_label')}
                    </Label>
                    <Input
                      id="governor"
                      value={data.governor}
                      onChange={(e) => setData('governor', e.target.value)}
                      placeholder={t('provinces.form.governor_placeholder')}
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/50 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg"
                    />
                    {errors.governor && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <X className="h-4 w-4" />
                        {errors.governor}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="capital" className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                      {t('provinces.form.capital_label')}
                    </Label>
                    <Input
                      id="capital"
                      value={data.capital}
                      onChange={(e) => setData('capital', e.target.value)}
                      placeholder={t('provinces.form.capital_placeholder')}
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/50 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg"
                    />
                    {errors.capital && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <X className="h-4 w-4" />
                        {errors.capital}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    {t('provinces.form.description_label')}
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder={t('provinces.form.description_placeholder')}
                    rows={4}
                    className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/50 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg resize-none"
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <X className="h-4 w-4" />
                      {errors.description}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    {t('provinces.form.status_label')} *
                  </Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                    required
                  >
                    <SelectTrigger className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/50 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg">
                      <SelectValue placeholder={t('provinces.form.status_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('provinces.form.status_active')}</SelectItem>
                      <SelectItem value="inactive">{t('provinces.form.status_inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <X className="h-4 w-4" />
                      {errors.status}
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="px-8 py-6 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/50 dark:to-gray-800">
                <FooterButtons
                  onCancel={() => window.history.back()}
                  onSubmit={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  processing={processing}
                  cancelText={t('common.cancel')}
                  submitText={t('common.save')}
                  savingText={t('common.saving')}
                />
              </div>
            </form>
          </Card>
        </CanUpdate>
      </div>
    </AppLayout>
  );
}
