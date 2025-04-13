import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/translate';
import { AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Language {
  id: number;
  code: string;
  name: string;
}

interface Translation {
  id: number;
  language_id: number;
  key: string;
  value: string;
  group: string;
}

interface EditTranslationProps {
  translation: Translation;
  languages: Language[];
  groups: string[];
}

export default function EditTranslation({ translation, languages = [], groups = [] }: EditTranslationProps) {
  const { t } = useTranslation();
  const { data, setData, errors, put, processing } = useForm({
    language_id: translation.language_id.toString(),
    key: translation.key,
    value: translation.value || '',
    group: translation.group || 'general',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('translations.update', translation.id));
  };

  // Ensure group options include the current translation's group
  const allGroups = [...new Set([...groups, data.group])];

  // Get the language name for display
  const language = languages.find(lang => lang.id.toString() === data.language_id);

  return (
    <AppLayout>
      <Head title="Edit Translation" />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Translation</h1>
            <p className="text-muted-foreground">
              Update an existing translation
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={route('translations.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Translations
            </Link>
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>
                Translation Details
                {language && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    Language: {language.name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label htmlFor="language_id">Language</Label>
                <Select
                  value={data.language_id}
                  onValueChange={(value) => setData('language_id', value)}
                >
                  <SelectTrigger id="language_id">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.id} value={language.id.toString()}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language_id && (
                  <p className="text-sm text-destructive mt-1">{errors.language_id}</p>
                )}
              </div>

              {/* Translation Key */}
              <div className="space-y-2">
                <Label htmlFor="key">Translation Key</Label>
                <Input
                  id="key"
                  value={data.key}
                  onChange={(e) => setData('key', e.target.value)}
                />
                {errors.key && (
                  <p className="text-sm text-destructive mt-1">{errors.key}</p>
                )}
              </div>

              {/* Translation Value */}
              <div className="space-y-2">
                <Label htmlFor="value">Translation Value</Label>
                <Textarea
                  id="value"
                  value={data.value}
                  onChange={(e) => setData('value', e.target.value)}
                  rows={5}
                />
                {errors.value && (
                  <p className="text-sm text-destructive mt-1">{errors.value}</p>
                )}
              </div>

              {/* Translation Group */}
              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Select
                  value={data.group}
                  onValueChange={(value) => setData('group', value)}
                >
                  <SelectTrigger id="group">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {allGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                    <SelectItem value="new-group">Add New Group</SelectItem>
                  </SelectContent>
                </Select>
                {data.group === 'new-group' && (
                  <Input
                    className="mt-2"
                    placeholder="Enter new group name"
                    value=""
                    onChange={(e) => setData('group', e.target.value)}
                  />
                )}
                {errors.group && (
                  <p className="text-sm text-destructive mt-1">{errors.group}</p>
                )}
              </div>

              {/* Example Usage */}
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Example Usage in Code</h3>
                <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
                  {`t('${data.group}.${data.key}')`}
                </pre>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={route('translations.index')}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
