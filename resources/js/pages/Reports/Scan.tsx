import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { FileText, Search, QrCode } from 'lucide-react';

interface ScanProps {}

export default function ReportScan({}: ScanProps) {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a report code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/reports/code/${code.trim()}`);
      if (response.data && response.data.success) {
        // Navigate to the report view page by code
        router.visit(route('reports.view_by_code', { code: code.trim() }));
      } else {
        setError('Report not found');
      }
    } catch (err) {
      setError('Failed to find report. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Scan Report" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Scan Report</h1>
              </div>

              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <QrCode size={40} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Enter Report Code</h2>
                  <p className="text-gray-600 mt-2">
                    Enter the report code to view report details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="mb-4">
                    <div className="flex">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                          type="text"
                          id="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                          placeholder="Enter report code (e.g., ABC12345)"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="p-2.5 ml-2 text-sm font-medium text-white bg-primary rounded-lg border border-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary/50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">
                        {error}
                      </p>
                    )}
                  </div>
                </form>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Enter the unique report code from the printed document</li>
                    <li>Click the search button to retrieve the report</li>
                    <li>If found, you will be redirected to the report details page</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
