import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Database, Users, AlertTriangle, Building, Lock, Eye } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    
    return (
        <>
            <Head title={t('welcome.page.title')} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Header */}
                <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Shield className="h-8 w-8 text-blue-500" />
                                <span className="text-xl font-bold text-white">{t('welcome.page.title')}</span>
                            </div>
                            
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        {t('welcome.access_dashboard')}
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('login')}
                                            className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            {t('welcome.sign_in')}
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
                            {t('welcome.page.title')}
                            <span className="block text-blue-400 mt-2">{t('welcome.hero.subtitle')}</span>
                        </h1>
                        <p className="text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                            {t('welcome.hero.description')}
                        </p>
                    </div>

                    {/* Core Features */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-20">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                                    <Database className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{t('welcome.features.info_management')}</h3>
                            <p className="text-slate-300 text-sm">
                                {t('welcome.features.info_management_desc')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                                    <Users className="h-6 w-6 text-green-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{t('welcome.features.personnel')}</h3>
                            <p className="text-slate-300 text-sm">
                                {t('welcome.features.personnel_desc')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                                    <AlertTriangle className="h-6 w-6 text-red-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{t('welcome.features.incidents')}</h3>
                            <p className="text-slate-300 text-sm">
                                {t('welcome.features.incidents_desc')}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                                    <Building className="h-6 w-6 text-purple-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{t('welcome.features.departments')}</h3>
                            <p className="text-slate-300 text-sm">
                                {t('welcome.features.departments_desc')}
                            </p>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center">
                        
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center rounded-md bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                <Eye className="mr-2 h-5 w-5" />
                                {t('welcome.cta.access_dashboard')}
                            </Link>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center rounded-md bg-slate-700 px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    <Lock className="mr-2 h-5 w-5" />
                                    {t('welcome.cta.sign_in')}
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-20">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
                        <div className="text-center">
                            <p className="text-slate-400 text-sm">
                                © 2024 {t('welcome.footer.copyright')}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
