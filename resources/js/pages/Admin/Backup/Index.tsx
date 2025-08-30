import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n/translate';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Download, Trash2, Plus, RefreshCw, AlertCircle, CheckCircle, Clock, Database, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { type BreadcrumbItem } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [backupToDelete, setBackupToDelete] = useState<Backup | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'System Administration',
            href: '#',
        },
        {
            title: t('backup.page_title'),
            href: route('backup.index'),
        },
    ];

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
        try {
            const downloadUrl = route('backup.download', { filename });
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(t('backup.download_started'));
        } catch (error) {
            console.error('Download error:', error);
            toast.error(t('backup.download_error'));
        }
    };

    const confirmDelete = (backup: Backup) => {
        setBackupToDelete(backup);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!backupToDelete) return;

        setIsDeleting(true);

        router.delete(route('backup.delete', { filename: backupToDelete.filename }), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setIsDeleting(false);
                toast.success(t('backup.delete_success'));
                window.location.reload();
            },
            onError: () => {
                setIsDeleting(false);
                toast.error(t('backup.delete_error'));
            },
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        window.location.reload();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fa-IR');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('backup.page_title')} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <PageHeader
                    title={t('backup.page_title')}
                    description={t('backup.page_description')}
                    actions={
                        <div className="flex space-x-2">
                            <Button 
                                onClick={handleRefresh} 
                                disabled={isRefreshing} 
                                variant="outline"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {t('backup.refresh')}
                            </Button>
                        </div>
                    }
                />

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
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            {t('backup.filename')}
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            {t('backup.size')}
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            {t('backup.created_at')}
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">
                                            {t('backup.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {backups.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="h-12 px-4 text-center align-middle">
                                                <div className="flex flex-col items-center justify-center py-8">
                                                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                                                    <p className="text-muted-foreground">{t('backup.no_backups')}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        backups.map((backup) => (
                                            <tr
                                                key={backup.filename}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center space-x-2">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        <span className="font-medium">{backup.filename}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant="secondary">{backup.size}</Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {formatDate(backup.created_at)}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownload(backup.filename)}
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            {t('backup.download')}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => confirmDelete(backup)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            {t('backup.delete')}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('backup.delete_confirm_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('backup.delete_confirm_description', { filename: backupToDelete?.filename || '' })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('backup.deleting')}
                                </>
                            ) : (
                                t('backup.delete')
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
