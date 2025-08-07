import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Database, Users, FileText, MapPin, AlertTriangle, Building, Globe, Lock, Eye } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Intelligence Department - Secure Information Management">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Header */}
                <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-8 w-8 text-blue-500" />
                                    <span className="text-xl font-bold text-white">Intelligence Department</span>
                                </div>
                            </div>
                            
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Access Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('login')}
                                            className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            <Lock className="mr-2 h-4 w-4" />
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Secure Information
                            <span className="block text-blue-400">Management System</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-slate-300 max-w-3xl mx-auto">
                            Advanced intelligence gathering, analysis, and reporting platform designed for 
                            secure data management and operational excellence.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                        <div className="relative overflow-hidden rounded-lg bg-slate-800/50 p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                    <Database className="h-6 w-6 text-blue-400" />
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Information Management</h3>
                            </div>
                            <p className="text-slate-300">
                                Comprehensive database for storing, categorizing, and retrieving intelligence data 
                                with advanced search and filtering capabilities.
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-lg bg-slate-800/50 p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                    <Users className="h-6 w-6 text-green-400" />
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Personnel Tracking</h3>
                            </div>
                            <p className="text-slate-300">
                                Monitor and manage personnel records, assignments, and operational activities 
                                with detailed reporting and analytics.
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-lg bg-slate-800/50 p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                                    <AlertTriangle className="h-6 w-6 text-red-400" />
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Incident Reports</h3>
                            </div>
                            <p className="text-slate-300">
                                Document and track incidents with detailed categorization, location mapping, 
                                and automated alert systems.
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-lg bg-slate-800/50 p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                                    <MapPin className="h-6 w-6 text-purple-400" />
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Geographic Intelligence</h3>
                            </div>
                            <p className="text-slate-300">
                                Advanced mapping and location-based intelligence with interactive visualizations 
                                and spatial analysis tools.
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-lg bg-slate-800/50 p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                                    <Building className="h-6 w-6 text-yellow-400" />
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Department Management</h3>
                            </div>
                            <p className="text-slate-300">
                                Organize and manage departmental structures, hierarchies, and operational 
                                workflows with role-based access control.
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-lg bg-slate-800/50 p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                                    <FileText className="h-6 w-6 text-indigo-400" />
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Comprehensive Reporting</h3>
                            </div>
                            <p className="text-slate-300">
                                Generate detailed reports and analytics with customizable dashboards, 
                                export capabilities, and real-time data visualization.
                            </p>
                        </div>
                    </div>

                    {/* Security Features */}
                    <div className="rounded-lg bg-slate-800/30 border border-slate-700/50 p-8 mb-16">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Security & Compliance</h2>
                            <p className="text-slate-300 max-w-2xl mx-auto">
                                Built with enterprise-grade security features to ensure data protection and regulatory compliance.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Lock className="h-8 w-8 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Encrypted Data</h3>
                                <p className="text-slate-300 text-sm">
                                    All sensitive information is encrypted at rest and in transit using industry-standard protocols.
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Shield className="h-8 w-8 text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Access Control</h3>
                                <p className="text-slate-300 text-sm">
                                    Role-based permissions and multi-factor authentication ensure secure access to sensitive data.
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <Globe className="h-8 w-8 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Audit Trail</h3>
                                <p className="text-slate-300 text-sm">
                                    Comprehensive logging and monitoring for complete accountability and compliance tracking.
                                </p>
                            </div>
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
                                Access Secure Dashboard
                            </Link>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center rounded-md bg-slate-700 px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    <Lock className="mr-2 h-5 w-5" />
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center rounded-md bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    <Shield className="mr-2 h-5 w-5" />
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <p className="text-slate-400 text-sm">
                                © 2024 Intelligence Department. All rights reserved. Secure • Confidential • Professional
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
