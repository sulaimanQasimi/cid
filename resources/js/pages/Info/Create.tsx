import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { type BreadcrumbItem } from '@/types';
import { type InfoCategory, type InfoType } from '@/types/info';
import { Head, useForm } from '@inertiajs/react';
import { FileText, MapPin, Save, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Import the LocationSelector component directly to avoid issues with lazy loading
import LocationSelector from '@/components/LocationSelector';
import Header from '@/components/template/header';

interface Department {
    id: number;
    name: string;
    code: string;
}

interface Props {
    infoTypes?: InfoType[];
    infoCategories?: InfoCategory[];
    departments?: Department[];
}

export default function InfoCreate({ infoTypes = [], infoCategories = [], departments = [] }: Props) {
    const { t } = useTranslation();

    // Generate breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('info.page_title'),
            href: route('infos.index'),
        },
        {
            title: t('info.create.breadcrumb'),
            href: route('infos.create'),
        },
    ];
    // Content tabs state
    const [activeTab, setActiveTab] = useState<string>('basic');

    // Flag to track map mounting
    const [isMapTabMounted, setIsMapTabMounted] = useState(false);

    // Location data state
    const [location, setLocation] = useState<{ lat: number; lng: number; province?: string } | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        info_type_id: '',
        info_category_id: '',
        department_id: 'none',
        value: {
            content: '',
            location: null as { lat: number; lng: number; province?: string } | null,
        },
    });

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'location') {
            setIsMapTabMounted(true);
        }
    };

    // Handle location change
    const handleLocationChange = (newLocation: { lat: number; lng: number; province: string } | null) => {
        setLocation(newLocation);
        setData('value', {
            ...data.value,
            location: newLocation,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('infos.store'), {
            onSuccess: () => {
                // Redirect happens automatically from the controller
            },
        });
    };

    // Load map component when needed
    useEffect(() => {
        if (activeTab === 'location') {
            setIsMapTabMounted(true);
        }
    }, [activeTab]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('info.create.page_title')} />
            <div className="container px-0 py-6">
                {/* Header with gradient background */}
                <Header
                    title={t('info.create.title')}
                    description={t('info.create.description')}
                    buttonText={t('info.create.back_to_list')}
                    icon={<Shield className="h-8 w-8 text-white" />}
                    model="info"
                    routeName="infos.index"
                    theme="purple"
                />
                <form onSubmit={handleSubmit}>
                    <Card className="overflow-hidden border-none bg-gradient-to-bl from-white to-purple-50/30 shadow-xl">
                        <CardHeader className="border-b bg-gradient-to-l from-purple-500 to-purple-600 pb-4 text-white">
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <div className="rounded-lg bg-white/20 p-2">
                                    <FileText className="h-5 w-5" />
                                </div>
                                {t('info.create.form.title')}
                            </CardTitle>
                            <CardDescription className="text-purple-100">{t('info.create.form.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="info_type_id">
                                        {t('info.create.fields.type')} <span className="text-red-500">{t('common.required_field')}</span>
                                    </Label>
                                    <Select value={data.info_type_id} onValueChange={(value) => setData('info_type_id', value)} required>
                                        <SelectTrigger id="info_type_id">
                                            <SelectValue placeholder={t('info.create.placeholders.select_type')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {infoTypes.length > 0 ? (
                                                infoTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-gray-500">{t('info.create.no_types_available')}</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.info_type_id && <p className="text-sm text-red-500">{errors.info_type_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="info_category_id">
                                        {t('info.create.fields.category')} <span className="text-red-500">{t('common.required_field')}</span>
                                    </Label>
                                    <Select value={data.info_category_id} onValueChange={(value) => setData('info_category_id', value)} required>
                                        <SelectTrigger id="info_category_id">
                                            <SelectValue placeholder={t('info.create.placeholders.select_category')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {infoCategories.length > 0 ? (
                                                infoCategories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-gray-500">{t('info.create.no_categories_available')}</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.info_category_id && <p className="text-sm text-red-500">{errors.info_category_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department_id">{t('info.create.fields.department')}</Label>
                                    <Select value={data.department_id} onValueChange={(value) => setData('department_id', value)}>
                                        <SelectTrigger id="department_id">
                                            <SelectValue placeholder={t('info.create.placeholders.select_department')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">{t('common.none')}</SelectItem>
                                            {departments.length > 0 ? (
                                                departments.map((department) => (
                                                    <SelectItem key={department.id} value={department.id.toString()}>
                                                        {department.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-gray-500">{t('info.create.no_departments_available')}</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">{t('info.create.fields.name')}</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="code">{t('info.create.fields.code')}</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder={t('info.create.placeholders.code')}
                                />
                                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                <p className="text-sm text-gray-500">{t('info.create.code_helper')}</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{t('info.create.fields.description')}</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            {/* Content section with tabs */}
                            <div className="space-y-2">
                                <Label>{t('info.create.fields.content')}</Label>

                                <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="basic">{t('info.create.content_tabs.basic')}</TabsTrigger>
                                        <TabsTrigger value="location" className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {t('info.create.content_tabs.location')}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="basic" className="pt-4">
                                        <Textarea
                                            id="content"
                                            value={data.value.content}
                                            onChange={(e) => setData('value', { ...data.value, content: e.target.value })}
                                            rows={5}
                                            placeholder={t('info.create.placeholders.content')}
                                        />
                                    </TabsContent>

                                    <TabsContent value="location" className="pt-4">
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">{t('info.create.location_description')}</p>
                                            {isMapTabMounted && <LocationSelector value={location} onChange={handleLocationChange} />}
                                            {!isMapTabMounted && (
                                                <div className="flex h-[400px] items-center justify-center rounded-md bg-gray-100">
                                                    {t('info.create.loading_map')}
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t bg-gradient-to-l from-purple-50 to-purple-100 px-6 py-5">
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                type="button"
                                disabled={processing}
                                className="rounded-full border-purple-300 text-purple-700 shadow-lg hover:border-purple-400 hover:bg-purple-100"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="rounded-full bg-gradient-to-l from-purple-500 to-purple-600 px-8 font-medium text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? t('info.create.saving') : t('info.create.save')}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
