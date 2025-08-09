import React, { FormEvent } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/lib/i18n/translate';

interface Language {
  id?: number;
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  active: boolean;
  default: boolean;
  [key: string]: any;
}

interface LanguageFormProps {
  language?: Language;
  isEditing?: boolean;
}

export default function LanguageForm({ language, isEditing = false }: LanguageFormProps) {
  const { t } = useTranslation();

  const { data, setData, post, put, processing, errors } = useForm<Language>({
    code: language?.code || '',
    name: language?.name || '',
    direction: language?.direction || 'ltr',
    active: language?.active ?? true,
    default: language?.default ?? false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && language?.id) {
      put(route('languages.update', language.id));
    } else {
      post(route('languages.store'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? t('languages.edit_language') : t('languages.add_language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            name="code"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="code">{t('languages.code')}</FormLabel>
                <FormControl>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={e => setData('code', e.target.value)}
                    placeholder="en"
                    required
                  />
                </FormControl>
                <FormDescription>
                  {t('languages.code_description')}
                </FormDescription>
                {errors.code && <FormMessage>{errors.code}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="name">{t('languages.name')}</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="English"
                    required
                  />
                </FormControl>
                {errors.name && <FormMessage>{errors.name}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="direction"
            render={() => (
              <FormItem className="space-y-3">
                <FormLabel>{t('languages.direction')}</FormLabel>
                <RadioGroup
                  value={data.direction}
                  onValueChange={(value) => setData('direction', value as 'ltr' | 'rtl')}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ltr" id="ltr" />
                    </FormControl>
                    <FormLabel htmlFor="ltr" className="font-normal cursor-pointer">
                      {t('languages.left_to_right')}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="rtl" id="rtl" />
                    </FormControl>
                    <FormLabel htmlFor="rtl" className="font-normal cursor-pointer">
                      {t('languages.right_to_left')}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
                {errors.direction && <FormMessage>{errors.direction}</FormMessage>}
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <FormField
              name="active"
              render={() => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={data.active}
                      onCheckedChange={(checked) => setData('active', !!checked)}
                      id="active"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="active">
                      {t('languages.active')}
                    </FormLabel>
                    <FormDescription>
                      {t('languages.active_description')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              name="default"
              render={() => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={data.default}
                      onCheckedChange={(checked) => setData('default', !!checked)}
                      id="default"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="default">
                      {t('languages.default')}
                    </FormLabel>
                    <FormDescription>
                      {t('languages.default_description')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.visit(route('languages.index'))}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={processing}>
            {isEditing ? t('common.update') : t('common.create')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
