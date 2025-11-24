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
import { Badge } from '@/components/ui/badge';
import { FileText, MapPin, Save, X, Plus, Tag, Hash, Type, FileText as FileTextIcon, Sparkles } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import { type InfoCategory, type InfoType } from '@/types/info';
import FooterButtons from '@/components/template/FooterButtons';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    infoTypes: InfoType[];
    infoCategories: InfoCategory[];
    typeId?: string | number;
}

export default function InfoCreateModal({ 
    isOpen, 
    onClose, 
    infoTypes, 
    infoCategories, 
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

    const handleFormSubmit = () => {
        post(route('infos.store'), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleCancel = () => {
        onClose();
    };

    // Load map component when needed
    useEffect(() => {
        if (activeTab === 'location') {
            setIsMapTabMounted(true);
        }
    }, [activeTab]);

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
                <DialogHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                    <DialogTitle className="flex items-center gap-4 text-2xl font-bold">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{t('info.create.title')}</div>
                            <div className="text-purple-100 text-sm font-medium">{t('info.create.subtitle')}</div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Selection Fields Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                                    <Type className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {t('info.create.sections.selection')}
                                </h3>
                                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                                    {t('info.create.sections.required')}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                                <div className="space-y-3">
                                    <Label htmlFor="info_type_id" className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        <FileTextIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        {t('info.create.fields.type')}
                                        <span className="text-red-500 text-xs">{t('common.required_field')}</span>
                                    </Label>
                                    <Select value={data.info_type_id} onValueChange={(value) => setData('info_type_id', value)} required>
                                        <SelectTrigger id="info_type_id" className="h-12 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800">
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
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    {t('info.create.no_types_available')}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.info_type_id && <p className="text-sm text-red-500 flex items-center gap-2"><X className="h-4 w-4" />{errors.info_type_id}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="info_category_id" className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        {t('info.create.fields.category')}
                                        <span className="text-red-500 text-xs">{t('common.required_field')}</span>
                                    </Label>
                                    <Select value={data.info_category_id} onValueChange={(value) => setData('info_category_id', value)} required>
                                        <SelectTrigger id="info_category_id" className="h-12 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800">
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
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    {t('info.create.no_categories_available')}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.info_category_id && <p className="text-sm text-red-500 flex items-center gap-2"><X className="h-4 w-4" />{errors.info_category_id}</p>}
                                </div>

                            </div>
                        </div>

                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {t('info.create.sections.basic_info')}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        {t('info.create.fields.name')}
                                    </Label>
                                    <Input 
                                        id="name" 
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-12 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800"
                                        placeholder={t('info.create.placeholders.name')}
                                    />
                                    {errors.name && <p className="text-sm text-red-500 flex items-center gap-2"><X className="h-4 w-4" />{errors.name}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="code" className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        {t('info.create.fields.code')}
                                    </Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder={t('info.create.placeholders.code')}
                                        className="h-12 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800"
                                    />
                                    {errors.code && <p className="text-sm text-red-500 flex items-center gap-2"><X className="h-4 w-4" />{errors.code}</p>}
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                                        <p className="text-sm text-purple-700 dark:text-purple-300">
                                            {t('info.create.code_helper')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    {t('info.create.fields.description')}
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 resize-none bg-white dark:bg-gray-800"
                                    placeholder={t('info.create.placeholders.description')}
                                />
                                {errors.description && <p className="text-sm text-red-500 flex items-center gap-2"><X className="h-4 w-4" />{errors.description}</p>}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {t('info.create.sections.content')}
                                </h3>
                            </div>

                            <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                    <TabsTrigger 
                                        value="basic" 
                                        className="flex items-center gap-2 rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white font-medium text-sm py-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        {t('info.create.content_tabs.basic')}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="location" 
                                        className="flex items-center gap-2 rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white font-medium text-sm py-2"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        {t('info.create.content_tabs.location')}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="pt-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="content" className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            {t('info.create.fields.content')}
                                        </Label>
                                        <Textarea
                                            id="content"
                                            value={data.value.content}
                                            onChange={(e) => setData('value', { ...data.value, content: e.target.value })}
                                            rows={6}
                                            className="border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 resize-none bg-white dark:bg-gray-800"
                                            placeholder={t('info.create.placeholders.content')}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="location" className="pt-6">
                                    <div className="space-y-4">
                                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                                            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                                <MapPin className="h-5 w-5" />
                                                <span className="font-semibold">{t('info.create.location_title')}</span>
                                            </div>
                                            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                                                {t('info.create.location_description')}
                                            </p>
                                        </div>
                                        
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                            {isMapTabMounted ? (
                                                <LocationSelector value={location} onChange={handleLocationChange} />
                                            ) : (
                                                <div className="flex h-[300px] items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                    <div className="text-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-3"></div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('info.create.loading_map')}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {errors.value && <p className="text-sm text-red-500 flex items-center gap-2"><X className="h-4 w-4" />{errors.value}</p>}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
                    <FooterButtons
                        onCancel={handleCancel}
                        onSubmit={handleFormSubmit}
                        processing={processing}
                        cancelText={t('common.cancel')}
                        submitText={t('info.create.save')}
                        savingText={t('info.create.saving')}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
