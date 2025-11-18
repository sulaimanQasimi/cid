import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Shield, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 via-blue-50 to-cyan-50">
            <Head title={t('auth.login.page_title')} />
            
            {/* Animated Colorful Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-purple-100/40 via-blue-100/40 to-cyan-100/40"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]"></div>
            </div>

            {/* Modern Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(236,72,153,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>

            {/* Floating Colorful Shapes */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl rotate-12 opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-violet-400 rounded-full opacity-20 blur-xl animate-pulse [animation-delay:1s]"></div>
            <div className="absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl -rotate-12 opacity-20 blur-xl animate-pulse [animation-delay:2s]"></div>

            <div className="relative w-full max-w-lg z-10">
                {/* Header Section */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-2xl shadow-purple-500/50">
                                <Shield className="h-10 w-10 text-white drop-shadow-lg" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 tracking-tight">
                        {t('auth.login.secure_access')}
                    </h1>
                    <p className="text-gray-600 text-lg font-medium">
                        {t('auth.login.enter_credentials')}
                    </p>
                </div>

                {/* Login Card */}
                <Card className="w-full bg-white/80 backdrop-blur-2xl border-2 border-purple-200 shadow-2xl shadow-purple-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:150ms] relative overflow-hidden">
                    {/* Colorful Border Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-50"></div>
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
                    
                    <div className="relative">
                        <CardHeader className="pb-6 pt-8 px-8">
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-center mb-2">
                                {t('auth.login.authentication_required')}
                            </CardTitle>
                            <CardDescription className="text-center text-gray-600 text-sm font-medium">
                                {t('auth.login.multi_factor_verification')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            {status && (
                                <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 p-4 shadow-lg shadow-green-500/10 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <p className="text-sm font-semibold text-green-700">{status}</p>
                                    </div>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={submit}>
                                {/* Email Field */}
                                <div className="space-y-2.5">
                                    <Label htmlFor="email" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-pink-500" />
                                        {t('auth.login.email_address')}
                                    </Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 group-focus-within:text-pink-600 transition-colors duration-200 z-10">
                                            <Mail className="h-5 w-5" />
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
                                            className="pl-12 pr-4 h-14 bg-white/90 border-2 border-pink-200 text-gray-800 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 focus:bg-white transition-all duration-200 placeholder:text-left shadow-sm hover:border-pink-300"
                                            dir="ltr"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <Lock className="h-4 w-4 text-purple-500" />
                                            {t('auth.login.security_code')}
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={route('password.request')}
                                                className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors duration-200 hover:underline"
                                            >
                                                {t('auth.login.reset_access')}
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors duration-200 z-10">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder={t('auth.login.password_placeholder')}
                                            className="pl-12 pr-14 h-14 bg-white/90 border-2 border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white transition-all duration-200 placeholder:text-left shadow-sm hover:border-purple-300"
                                            dir="ltr"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 rounded-lg p-1.5 hover:bg-purple-50"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center gap-3 pt-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        className="h-5 w-5 rounded border-2 border-blue-300 bg-white text-blue-600 focus:ring-4 focus:ring-blue-500/20 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 data-[state=checked]:border-blue-500 transition-all duration-200 shadow-sm"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer font-semibold">
                                        {t('auth.login.maintain_session')}
                                    </Label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold text-lg shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 focus:ring-4 focus:ring-purple-500/30 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={processing || isLoading}
                                    size="lg"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {(processing || isLoading) && (
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                        )}
                                        {processing || isLoading ? t('auth.login.authenticating') : t('auth.login.access_platform')}
                                    </span>
                                </Button>
                            </form>
                        </CardContent>
                    </div>
                </Card>

                {/* Footer */}
                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:300ms]">
                    <p className="text-sm text-gray-600 font-semibold flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        {t('auth.login.secure_connection') || 'Secure connection encrypted'}
                    </p>
                </div>
            </div>
        </div>
    );
}
