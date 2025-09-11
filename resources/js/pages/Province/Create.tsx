import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
import { Save, FileText, MapPin, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate } from '@/components/ui/permission-guard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// AM Map Province codes for Afghanistan
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

export default function Create() {
  const { canCreate } = usePermissions();
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
      title: t('provinces.create.title'),
      href: '#',
    },
  ];

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    description: '',
    governor: '',
    capital: '',
    status: 'active',
  });

  const handleProvinceCodeChange = (code: string) => {
    setData('code', code);
    // Optionally auto-fill the name field with the province name
    const selectedProvince = amMapProvinceCodes.find(province => province.id === code);
    if (selectedProvince && !data.name) {
      setData('name', selectedProvince.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('provinces.store'));
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleFormSubmit = () => {
    post(route('provinces.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('provinces.create.title')} />
      
      <div className="container px-0 py-6">
        {/* Custom Header Component */}
        <Header
          title={t('provinces.create.title')}
          description={t('provinces.create.description')}
          icon={<MapPin className="h-6 w-6" />}
          model="province"
          routeName={() => ''}
          buttonText=""
          theme="purple"
          showButton={false}
          showBackButton={true}
          backRouteName={() => route('provinces.index')}
          backButtonText={t('common.back')}
        />

        <CanCreate model="province">
         
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <Header
            title={t('provinces.create.form_title')}
            description={t('provinces.create.form_description')}
            icon={<FileText className="h-6 w-6" />}
            model="province"
            routeName={() => ''}
            buttonText=""
            theme="purple"
            showButton={false}
          />
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
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
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
                      <SelectTrigger className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg">
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
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
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
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
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
                    className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg resize-none"
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
                    <SelectTrigger className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg">
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

              <FooterButtons
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                processing={processing}
                cancelText={t('common.cancel')}
                submitText={t('common.save')}
                savingText={t('common.saving')}
              />
            </form>
          </Card>
        </CanCreate>
      </div>
    </AppLayout>
  );
}
