import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n/translate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, MapPin, Save, X } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import { type InfoCategory, type InfoType } from '@/types/info';

interface Department {
    id: number;
    name: string;
    code: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    infoTypes: InfoType[];
    infoCategories: InfoCategory[];
    departments: Department[];
    typeId?: string | number;
}

export default function InfoCreateModal({ 
    isOpen, 
    onClose, 
    infoTypes, 
    infoCategories, 
    departments,
    typeId 
}: Props) {
    const { t } = useTranslation();
    
    // Content tabs state
    const [activeTab, setActiveTab] = useState<string>('basic');
    const [isMapTabMounted, setIsMapTabMounted] = useState(false);
    
    // Location data state
    const [location, setLocation] = useState<{ lat: number; lng: number; province?: string } | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        description: '',
        info_type_id: typeId ? typeId.toString() : '',
        info_category_id: '',
        department_id: 'none',
        value: {
            content: '',
            location: null as { lat: number; lng: number; province?: string } | null,
        },
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            reset();
            setActiveTab('basic');
            setIsMapTabMounted(false);
            setLocation(null);
            if (typeId) {
                setData('info_type_id', typeId.toString());
            }
        }
    }, [isOpen, typeId, reset]);

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
                onClose();
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="rounded-lg bg-purple-100 p-2">
                            <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        {t('info.create.title')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-none">
                        <CardContent className="space-y-6 p-0">
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
                                                <div className="flex h-[300px] items-center justify-center rounded-md bg-gray-100">
                                                    {t('info.create.loading_map')}
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t bg-gray-50 px-0 py-4">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                type="button"
                                disabled={processing}
                                className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                <X className="mr-2 h-4 w-4" />
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-gradient-to-l from-purple-500 to-purple-600 px-6 font-medium text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? t('info.create.saving') : t('info.create.save')}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </DialogContent>
        </Dialog>
    );
}
