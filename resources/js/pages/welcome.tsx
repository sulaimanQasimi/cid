import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Database, Users, AlertTriangle, Building, Lock, Eye, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    
    return (
        <>
            <Head title={t('welcome.page.title')} />
            
            <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 via-blue-50 to-cyan-50">
                {/* Animated Colorful Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-purple-100/40 via-blue-100/40 to-cyan-100/40"></div>
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
                    <div className="absolute bottom-0 left-1/4 w-[550px] h-[550px] bg-blue-300/30 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-300/30 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]"></div>
                </div>

                {/* Modern Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(236,72,153,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>

                {/* Floating Colorful Shapes */}
                <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl rotate-12 opacity-15 blur-2xl animate-pulse"></div>
                <div className="absolute top-60 right-32 w-48 h-48 bg-gradient-to-br from-purple-400 to-violet-400 rounded-full opacity-15 blur-2xl animate-pulse [animation-delay:1s]"></div>
                <div className="absolute bottom-40 left-32 w-44 h-44 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl -rotate-12 opacity-15 blur-2xl animate-pulse [animation-delay:2s]"></div>

                <div className="relative z-10">
                    {/* Header */}
                    <header className="border-b-2 border-white/30 bg-white/60 backdrop-blur-xl shadow-lg">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-20 items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl blur-lg opacity-50"></div>
                                        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg">
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        {t('welcome.page.title')}
                                    </span>
                                </div>
                                
                                <nav className="flex items-center space-x-4">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-200"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            {t('welcome.access_dashboard')}
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center rounded-xl bg-white/90 backdrop-blur-sm px-6 py-2.5 text-sm font-bold text-purple-600 shadow-md hover:bg-white hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-200 border-2 border-purple-200"
                                        >
                                            {t('welcome.sign_in')}
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                        {/* Hero Section */}
                        <div className="text-center mb-24 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-2xl shadow-purple-500/50 p-4">
                                        <img 
                                            src="/images/logos/logo 2.png" 
                                            alt={t('welcome.page.title')}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {t('welcome.page.title')}
                                </span>
                                <span className="block mt-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {t('welcome.hero.subtitle')}
                                </span>
                            </h1>
                            <p className="text-xl sm:text-2xl leading-8 text-gray-700 max-w-3xl mx-auto font-medium">
                                {t('welcome.hero.description')}
                            </p>
                        </div>

                        {/* Core Features */}
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-24">
                            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-3xl"></div>
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg">
                                            <Database className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{t('welcome.features.info_management')}</h3>
                                <p className="text-gray-600 text-sm text-center leading-relaxed">
                                    {t('welcome.features.info_management_desc')}
                                </p>
                            </div>

                            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:100ms]">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-t-3xl"></div>
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg">
                                            <Users className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{t('welcome.features.personnel')}</h3>
                                <p className="text-gray-600 text-sm text-center leading-relaxed">
                                    {t('welcome.features.personnel_desc')}
                                </p>
                            </div>

                            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:200ms]">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-3xl"></div>
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                                            <AlertTriangle className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{t('welcome.features.incidents')}</h3>
                                <p className="text-gray-600 text-sm text-center leading-relaxed">
                                    {t('welcome.features.incidents_desc')}
                                </p>
                            </div>

                            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:300ms]">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-3xl"></div>
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg">
                                            <Building className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{t('welcome.features.departments')}</h3>
                                <p className="text-gray-600 text-sm text-center leading-relaxed">
                                    {t('welcome.features.departments_desc')}
                                </p>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:400ms]">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-10 py-4 text-lg font-bold text-white shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 transform active:scale-95"
                                >
                                    <Eye className="mr-3 h-6 w-6" />
                                    {t('welcome.cta.access_dashboard')}
                                    <ArrowRight className="ml-3 h-6 w-6" />
                                </Link>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-10 py-4 text-lg font-bold text-white shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 transform active:scale-95"
                                    >
                                        <Lock className="mr-3 h-6 w-6" />
                                        {t('welcome.cta.sign_in')}
                                        <ArrowRight className="ml-3 h-6 w-6" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="border-t-2 border-white/30 bg-white/60 backdrop-blur-xl shadow-lg mt-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                            <div className="text-center">
                                <p className="text-gray-700 text-sm font-semibold">
                                    © 2024 {t('welcome.footer.copyright')}
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
