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
import { Save, ArrowLeft } from 'lucide-react';

interface Language {
  id: number;
  code: string;
  name: string;
  direction?: string;
  active?: boolean;
  default?: boolean;
}

interface CreateTranslationProps {
  languages: Language[];
  groups: string[];
}

export default function CreateTranslation({ languages = [], groups = [] }: CreateTranslationProps) {
  const { t } = useTranslation();

  // Initialize with default values
  const { data, setData, errors, post, processing } = useForm({
    language_id: languages[0]?.id?.toString() || '',
    key: '',
    value: '',
    group: 'general',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('translations.store'));
  };

  return (
    <AppLayout>
      <Head title="Create Translation" />

      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Translation</h1>
            <p className="text-muted-foreground">
              Create a new translation entry
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
              <CardTitle>Add Translation</CardTitle>
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
                <Label htmlFor="key">Key</Label>
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
                <Label htmlFor="value">Value</Label>
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
                    <SelectItem value="general">General</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group} value={group || "unnamed-group"}>
                        {group || "Unnamed Group"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.group && (
                  <p className="text-sm text-destructive mt-1">{errors.group}</p>
                )}
              </div>

              {/* Example Usage */}
              {data.key && (
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Example Usage in Code</h3>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
                    {`t('${data.group}.${data.key}')`}
                  </pre>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={route('translations.index')}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                Create Translation
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
