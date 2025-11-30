import React, { useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n/translate';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PersianDatePicker from '@/components/ui/PersianDatePicker';
import { FileText, AlertTriangle, MapPin, Clock, AlertCircle, Building2, BookText, Plus } from 'lucide-react';
import { FormEventHandler } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FooterButtons from '@/components/template/FooterButtons';

interface IncidentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: Array<{
    id: number;
    name: string;
    province: {
      id: number;
      name: string;
    };
  }>;
  categories: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  reportId: number; // Required report ID
}

export default function IncidentCreateModal({ 
  isOpen, 
  onClose, 
  districts, 
  categories, 
  reportId 
}: IncidentCreateModalProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    incident_date: '',
    incident_time: '',
    district_id: '',
    incident_category_id: '',
    location: '',
    coordinates: '',
    incident_type: '',
    is_confirmed: false,
    confirmed_by: null,
    confirmed_at: null,
    confirmation_notes: null,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    
    post(route('incident-reports.incidents.store', reportId), {
      onSuccess: () => {
        onClose();
        // Reload the page to show the new incident
        router.reload({ only: ['incidents'] });
      },
    });
  };

  const handleCancel = () => {
    onClose();
  };

  const handleFormSubmit = () => {
    post(route('incident-reports.incidents.store', reportId), {
      onSuccess: () => {
        onClose();
        // Reload the page to show the new incident
        router.reload({ only: ['incidents'] });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-[90vw] !max-h-[95vh] !w-[90vw] !h-[95vh] overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-2xl"
        style={{ 
          maxWidth: '90vw', 
          maxHeight: '95vh', 
          width: '90vw', 
          height: '95vh'
        }}
      >
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <DialogTitle className="flex items-center gap-4 text-2xl font-bold">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{t('incidents.create_title')}</div>
              <div className="text-blue-100 text-sm font-medium">{t('incidents.create_description')}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-6 py-6">
          <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                      <span className="text-red-500">*</span>
                      {t('incidents.form.title')}
                      <FileText className="h-4 w-4" />
                    </Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={e => setData('title', e.target.value)}
                      placeholder={t('incidents.form.title_placeholder')}
                      required
                      className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right"
                    />
                    {errors.title && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.title}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="incident_type" className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                      <span className="text-red-500">*</span>
                      {t('incidents.form.type')}
                      <AlertCircle className="h-4 w-4" />
                    </Label>
                    <Input
                      id="incident_type"
                      value={data.incident_type}
                      onChange={e => setData('incident_type', e.target.value)}
                      placeholder={t('incidents.form.type_placeholder')}
                      required
                      className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right"
                    />
                    {errors.incident_type && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.incident_type}
                    </p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                    <span className="text-red-500">*</span>
                    {t('incidents.form.description')}
                    <BookText className="h-4 w-4" />
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    placeholder={t('incidents.form.description_placeholder')}
                    rows={5}
                    required
                    className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right"
                  />
                  {errors.description && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.description}
                  </p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <PersianDatePicker
                      id="incident_date"
                      label={t('incidents.form.date')}
                      value={data.incident_date}
                      onChange={(value) => setData('incident_date', value)}
                      placeholder={t('incidents.form.date_placeholder')}
                      required
                      error={errors.incident_date}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="incident_time" className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                      {t('incidents.form.time')}
                      <Clock className="h-4 w-4" />
                    </Label>
                    <div className="relative">
                      <Input
                        id="incident_time"
                        type="time"
                        value={data.incident_time}
                        onChange={e => setData('incident_time', e.target.value)}
                        className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right"
                      />
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400 pointer-events-none" />
                    </div>
                    {errors.incident_time && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.incident_time}
                    </p>}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="district_id" className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                      <span className="text-red-500">*</span>
                      {t('incidents.form.district')}
                      <Building2 className="h-4 w-4" />
                    </Label>
                    <Select
                      value={data.district_id}
                      onValueChange={value => setData('district_id', value)}
                      required
                    >
                      <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right">
                        <SelectValue placeholder={t('incidents.form.select_district')} />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map(district => (
                          <SelectItem key={district.id} value={district.id.toString()}>
                            {district.name} ({district.province?.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.district_id && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.district_id}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="incident_category_id" className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                      <span className="text-red-500">*</span>
                      {t('incidents.form.category')}
                      <AlertCircle className="h-4 w-4" />
                    </Label>
                    <Select
                      value={data.incident_category_id}
                      onValueChange={value => setData('incident_category_id', value)}
                      required
                    >
                      <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right">
                        <SelectValue placeholder={t('incidents.form.select_category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.incident_category_id && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.incident_category_id}
                    </p>}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                      {t('incidents.form.location')}
                      <MapPin className="h-4 w-4" />
                    </Label>
                    <Input
                      id="location"
                      value={data.location}
                      onChange={e => setData('location', e.target.value)}
                      placeholder={t('incidents.form.location_placeholder')}
                      className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right"
                    />
                    {errors.location && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.location}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="coordinates" className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                      {t('incidents.form.coordinates')}
                      <MapPin className="h-4 w-4" />
                    </Label>
                    <Input
                      id="coordinates"
                      value={data.coordinates}
                      onChange={e => setData('coordinates', e.target.value)}
                      placeholder={t('incidents.form.coordinates_placeholder')}
                      className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right"
                    />
                    {errors.coordinates && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.coordinates}
                    </p>}
                  </div>
                </div>

            <div className="pt-4">
              <FooterButtons
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                processing={processing}
                cancelText={t('common.cancel')}
                submitText={t('incidents.save_incident')}
                savingText={t('incidents.saving')}
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

