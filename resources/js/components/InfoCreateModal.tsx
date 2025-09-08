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
import { FileText, MapPin, Save, X, Plus, Building2, Tag, Hash, Type, FileText as FileTextIcon, Sparkles } from 'lucide-react';
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
            <DialogContent 
                className="!max-w-[95vw] !max-h-[98vh] !w-[95vw] !h-[98vh] !min-w-[95vw] !min-h-[98vh] overflow-hidden bg-gradient-to-br from-white via-cyan-50/40 via-purple-50/40 to-pink-50/40 dark:from-slate-900 dark:via-cyan-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-0 shadow-2xl backdrop-blur-xl"
                style={{ 
                    maxWidth: '95vw', 
                    maxHeight: '98vh', 
                    width: '95vw', 
                    height: '98vh',
                    minWidth: '95vw',
                    minHeight: '98vh'
                }}
            >
                <DialogHeader className="relative pb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 via-pink-500/20 to-orange-400/20 rounded-t-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/10 via-purple-400/10 via-pink-400/10 to-orange-300/10 rounded-t-lg animate-pulse"></div>
                    <DialogTitle className="relative flex items-center gap-6 text-3xl font-bold">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 via-pink-500 to-orange-400 rounded-2xl blur-lg opacity-40 animate-pulse"></div>
                            <div className="relative rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 via-pink-500 to-orange-400 p-4 shadow-2xl">
                                <Sparkles className="h-8 w-8 text-white animate-pulse" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="bg-gradient-to-r from-cyan-600 via-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent text-4xl font-extrabold">
                                {t('info.create.title')}
                            </span>
                            <span className="text-lg font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-cyan-500/80 via-purple-500/80 via-pink-500/80 to-orange-500/80 bg-clip-text text-transparent">
                                {t('info.create.subtitle')}
                            </span>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(98vh-200px)] px-4">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Main Form Card */}
                        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-10 space-y-10">
                                {/* Selection Fields Section */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-30"></div>
                                            <div className="relative rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-3 shadow-lg">
                                                <Type className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            {t('info.create.sections.selection')}
                                        </h3>
                                        <Badge variant="outline" className="bg-gradient-to-r from-cyan-50 to-pink-50 dark:from-cyan-900/30 dark:to-pink-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700 px-4 py-2 text-sm font-medium rounded-full">
                                            {t('info.create.sections.required')}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                        <div className="space-y-4 group">
                                            <Label htmlFor="info_type_id" className="flex items-center gap-3 text-base font-semibold text-gray-800 dark:text-gray-200">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur-sm opacity-30"></div>
                                                    <div className="relative rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-2 shadow-lg">
                                                        <FileTextIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                                {t('info.create.fields.type')}
                                                <span className="text-red-500 text-sm font-bold">{t('common.required_field')}</span>
                                            </Label>
                                            <Select value={data.info_type_id} onValueChange={(value) => setData('info_type_id', value)} required>
                                                <SelectTrigger id="info_type_id" className="h-14 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                                                    <SelectValue placeholder={t('info.create.placeholders.select_type')} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
                                                    {infoTypes.length > 0 ? (
                                                        infoTypes.map((type) => (
                                                            <SelectItem key={type.id} value={type.id.toString()} className="rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-200">
                                                                {type.name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                                            <div className="text-4xl mb-2">📝</div>
                                                            {t('info.create.no_types_available')}
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.info_type_id && <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800"><X className="h-4 w-4" />{errors.info_type_id}</p>}
                                        </div>

                                        <div className="space-y-4 group">
                                            <Label htmlFor="info_category_id" className="flex items-center gap-3 text-base font-semibold text-gray-800 dark:text-gray-200">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur-sm opacity-30"></div>
                                                    <div className="relative rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 p-2 shadow-lg">
                                                        <Tag className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                                {t('info.create.fields.category')}
                                                <span className="text-red-500 text-sm font-bold">{t('common.required_field')}</span>
                                            </Label>
                                            <Select value={data.info_category_id} onValueChange={(value) => setData('info_category_id', value)} required>
                                                <SelectTrigger id="info_category_id" className="h-14 border-2 border-gray-200 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all duration-300 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                                                    <SelectValue placeholder={t('info.create.placeholders.select_category')} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
                                                    {infoCategories.length > 0 ? (
                                                        infoCategories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id.toString()} className="rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/30 dark:hover:to-blue-900/30 transition-all duration-200">
                                                                {category.name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                                            <div className="text-4xl mb-2">🏷️</div>
                                                            {t('info.create.no_categories_available')}
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.info_category_id && <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800"><X className="h-4 w-4" />{errors.info_category_id}</p>}
                                        </div>

                                        <div className="space-y-4 group">
                                            <Label htmlFor="department_id" className="flex items-center gap-3 text-base font-semibold text-gray-800 dark:text-gray-200">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur-sm opacity-30"></div>
                                                    <div className="relative rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-2 shadow-lg">
                                                        <Building2 className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                                {t('info.create.fields.department')}
                                            </Label>
                                            <Select value={data.department_id} onValueChange={(value) => setData('department_id', value)}>
                                                <SelectTrigger id="department_id" className="h-14 border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                                                    <SelectValue placeholder={t('info.create.placeholders.select_department')} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
                                                    <SelectItem value="none" className="rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/30 dark:hover:to-slate-900/30 transition-all duration-200">{t('common.none')}</SelectItem>
                                                    {departments.length > 0 ? (
                                                        departments.map((department) => (
                                                            <SelectItem key={department.id} value={department.id.toString()} className="rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-all duration-200">
                                                                {department.name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                                            <div className="text-4xl mb-2">🏢</div>
                                                            {t('info.create.no_departments_available')}
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.department_id && <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800"><X className="h-4 w-4" />{errors.department_id}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Information Section */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-rose-400 rounded-2xl blur-sm opacity-30"></div>
                                            <div className="relative rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 p-3 shadow-lg">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-orange-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                                            {t('info.create.sections.basic_info')}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
                                        <div className="space-y-4 group">
                                            <Label htmlFor="name" className="flex items-center gap-3 text-base font-semibold text-gray-800 dark:text-gray-200">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl blur-sm opacity-30"></div>
                                                    <div className="relative rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-2 shadow-lg">
                                                        <FileText className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                                {t('info.create.fields.name')}
                                            </Label>
                                            <Input 
                                                id="name" 
                                                value={data.name} 
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="h-14 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl text-base"
                                                placeholder={t('info.create.placeholders.name')}
                                            />
                                            {errors.name && <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800"><X className="h-4 w-4" />{errors.name}</p>}
                                        </div>

                                        <div className="space-y-4 group">
                                            <Label htmlFor="code" className="flex items-center gap-3 text-base font-semibold text-gray-800 dark:text-gray-200">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur-sm opacity-30"></div>
                                                    <div className="relative rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-2 shadow-lg">
                                                        <Hash className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                                {t('info.create.fields.code')}
                                            </Label>
                                            <Input
                                                id="code"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value)}
                                                placeholder={t('info.create.placeholders.code')}
                                                className="h-14 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-300 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl text-base"
                                            />
                                            {errors.code && <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800"><X className="h-4 w-4" />{errors.code}</p>}
                                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800">
                                                <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                                                    <span className="text-lg">💡</span>
                                                    {t('info.create.code_helper')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 group">
                                        <Label htmlFor="description" className="flex items-center gap-3 text-base font-semibold text-gray-800 dark:text-gray-200">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl blur-sm opacity-30"></div>
                                                <div className="relative rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 p-2 shadow-lg">
                                                    <FileText className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            {t('info.create.fields.description')}
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={5}
                                            className="border-2 border-gray-200 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-300 rounded-2xl resize-none bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl text-base"
                                            placeholder={t('info.create.placeholders.description')}
                                        />
                                        {errors.description && <p className="text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800"><X className="h-4 w-4" />{errors.description}</p>}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 rounded-2xl blur-sm opacity-30"></div>
                                            <div className="relative rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-3 shadow-lg">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                                            {t('info.create.sections.content')}
                                        </h3>
                                    </div>

                                    <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-2 shadow-lg">
                                            <TabsTrigger 
                                                value="basic" 
                                                className="flex items-center gap-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 font-semibold text-base py-3"
                                            >
                                                <FileText className="h-5 w-5" />
                                                {t('info.create.content_tabs.basic')}
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="location" 
                                                className="flex items-center gap-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 font-semibold text-base py-3"
                                            >
                                                <MapPin className="h-5 w-5" />
                                                {t('info.create.content_tabs.location')}
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="basic" className="pt-8">
                                            <div className="space-y-4">
                                                <Label htmlFor="content" className="flex items-center gap-3 text-base font-semibold text-gray-800 dark:text-gray-200">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-xl blur-sm opacity-30"></div>
                                                        <div className="relative rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 p-2 shadow-lg">
                                                            <FileText className="h-5 w-5 text-white" />
                                                        </div>
                                                    </div>
                                                    {t('info.create.fields.content')}
                                                </Label>
                                                <Textarea
                                                    id="content"
                                                    value={data.value.content}
                                                    onChange={(e) => setData('value', { ...data.value, content: e.target.value })}
                                                    rows={8}
                                                    className="border-2 border-gray-200 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500 focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300 rounded-2xl resize-none bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl text-base"
                                                    placeholder={t('info.create.placeholders.content')}
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="location" className="pt-8">
                                            <div className="space-y-6">
                                                <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-2 border-cyan-200 dark:border-cyan-800 rounded-2xl p-6 shadow-lg">
                                                    <div className="flex items-center gap-3 text-cyan-700 dark:text-cyan-300">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg blur-sm opacity-30"></div>
                                                            <div className="relative rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-2 shadow-lg">
                                                                <MapPin className="h-5 w-5 text-white" />
                                                            </div>
                                                        </div>
                                                        <span className="text-lg font-bold">{t('info.create.location_title')}</span>
                                                    </div>
                                                    <p className="text-base text-cyan-600 dark:text-cyan-400 mt-3 leading-relaxed">
                                                        {t('info.create.location_description')}
                                                    </p>
                                                </div>
                                                
                                                <div className="border-2 border-dashed border-cyan-300 dark:border-cyan-600 rounded-2xl overflow-hidden shadow-xl">
                                                    {isMapTabMounted ? (
                                                        <LocationSelector value={location} onChange={handleLocationChange} />
                                                    ) : (
                                                        <div className="flex h-[400px] items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20">
                                                            <div className="text-center">
                                                                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-cyan-500 mx-auto mb-4"></div>
                                                                <p className="text-lg text-cyan-600 dark:text-cyan-400 font-medium">{t('info.create.loading_map')}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    {errors.value && <p className="text-sm text-red-500 flex items-center gap-1"><X className="h-3 w-3" />{errors.value}</p>}
                                </div>
                        </CardContent>

                        <CardFooter className="flex justify-between items-center border-t-2 border-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 dark:from-cyan-800 dark:via-purple-800 dark:to-pink-800 bg-gradient-to-r from-cyan-50 via-purple-50 via-pink-50 to-orange-50 dark:from-cyan-900/20 dark:via-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 px-10 py-8">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                type="button"
                                disabled={processing}
                                className="h-14 px-8 rounded-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl"
                            >
                                <X className="mr-3 h-5 w-5" />
                                {t('common.cancel')}
                            </Button>
                            
                            <div className="flex items-center gap-4">
                                {processing && (
                                    <div className="flex items-center gap-3 text-base text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-4 py-2 rounded-xl border border-cyan-200 dark:border-cyan-800">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
                                        <span className="font-medium">{t('info.create.saving')}...</span>
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-14 px-10 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 via-pink-500 to-orange-500 font-bold text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:from-cyan-600 hover:via-purple-600 hover:via-pink-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                >
                                    <Save className="mr-3 h-5 w-5" />
                                    {processing ? t('info.create.saving') : t('info.create.save')}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
