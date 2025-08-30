import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n/translate';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Download, Trash2, Plus, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Backup {
    filename: string;
    size: string;
    size_bytes: number;
    created_at: string;
    created_at_timestamp: number;
}

interface BackupPageProps {
    backups: Backup[];
    backupPath: string;
}

export default function BackupIndex({ backups, backupPath }: BackupPageProps) {
    const { t } = useTranslation();
    const [isCreating, setIsCreating] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        name: '',
    });

    const handleCreateBackup = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        
        post(route('backup.create'), {
            onSuccess: () => {
                toast.success(t('backup.create_success'));
                reset();
                setIsCreating(false);
                // Refresh the page to show new backup
                window.location.reload();
            },
            onError: () => {
                toast.error(t('backup.create_error'));
                setIsCreating(false);
            },
        });
    };

    const handleDownload = (filename: string) => {
        window.open(route('backup.download', { filename }), '_blank');
    };

    const handleDelete = (filename: string) => {
        if (confirm(t('backup.delete_confirm', { filename }))) {
            router.delete(route('backup.delete', { filename }), {
                onSuccess: () => {
                    toast.success(t('backup.delete_success'));
                    window.location.reload();
                },
                onError: () => {
                    toast.error(t('backup.delete_error'));
                },
            });
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        window.location.reload();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fa-IR');
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('backup.page_title')} />

            <div className="container mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{t('backup.page_title')}</h1>
                        <p className="text-muted-foreground">{t('backup.page_description')}</p>
                    </div>
                    <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {t('backup.refresh')}
                    </Button>
                </div>

                {/* Create Backup Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('backup.create_title')}</CardTitle>
                        <CardDescription>{t('backup.create_description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateBackup} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <Label htmlFor="name">{t('backup.name_label')}</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t('backup.name_placeholder')}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing || isCreating}
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {t('backup.name_helper')}
                                    </p>
                                </div>
                                <div className="flex items-end">
                                    <Button 
                                        type="submit" 
                                        disabled={processing || isCreating}
                                        className="w-full"
                                    >
                                        {isCreating ? (
                                            <>
                                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                                                {t('backup.creating')}
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                {t('backup.create_button')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Backups List */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('backup.list_title')}</CardTitle>
                        <CardDescription>{t('backup.list_description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {backups.length === 0 ? (
                            <div className="text-center py-8">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">{t('backup.no_backups')}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {backups.map((backup) => (
                                    <div key={backup.filename} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="font-medium">{backup.filename}</span>
                                                <Badge variant="secondary">{backup.size}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {t('backup.created_at')}: {formatDate(backup.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownload(backup.filename)}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                {t('backup.download')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(backup.filename)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                {t('backup.delete')}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('backup.info_title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">{t('backup.storage_location')}</Label>
                                <p className="text-sm text-muted-foreground">{backupPath}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">{t('backup.total_backups')}</Label>
                                <p className="text-sm text-muted-foreground">{backups.length}</p>
                            </div>
                        </div>
                        <Separator />
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {t('backup.admin_only_warning')}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
