import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/translate';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post(route('login'), {
            onFinish: () => {
                reset('password');
                setIsLoading(false);
            },
        });
    };

    return (
        <div className="min-h-screen rounded-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <Head title={t('auth.login.page_title')} />
            
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Shield className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{t('auth.login.secure_access')}</h2>
                    <p className="text-slate-400 text-sm">
                        {t('auth.login.enter_credentials')}
                    </p>
                </div>

                {/* Login Card */}
                <Card className="w-full bg-slate-800/50 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold text-white text-center">
                            {t('auth.login.authentication_required')}
                        </CardTitle>
                        <CardDescription className="text-center text-slate-400">
                            {t('auth.login.multi_factor_verification')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        {status && (
                            <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-400">{status}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={submit}>
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                                    {t('auth.login.email_address')}
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder={t('auth.login.email_placeholder')}
                                        className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 placeholder:text-left"
                                        dir="ltr"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                                        {t('auth.login.security_code')}
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className="text-xs font-medium text-blue-400 hover:text-blue-300"
                                        >
                                            {t('auth.login.reset_access')}
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder={t('auth.login.password_placeholder')}
                                        className="pl-10 pr-10 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 placeholder:text-left"
                                        dir="ltr"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    className="h-4 w-4 rounded border-slate-600 bg-slate-700/50 text-blue-500 focus:ring-blue-500/20"
                                />
                                <Label htmlFor="remember" className="text-sm text-slate-300">
                                    {t('auth.login.maintain_session')}
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                disabled={processing || isLoading}
                                size="lg"
                            >
                                {(processing || isLoading) && (
                                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                )}
                                {processing || isLoading ? t('auth.login.authenticating') : t('auth.login.access_platform')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
