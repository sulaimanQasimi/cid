import React, { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { UserRound, FileText, Calendar, Clock, Printer, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { PrintSettings as PrintSettingsModal, PrintSettings } from '@/components/reports/PrintSettings';
import { PrintTemplate } from '@/components/reports/PrintTemplate';

interface Report {
  id: number;
  code: string;
  reportable_type: string;
  reportable_id: number;
  created_by: number;
  properties: {
    date: string;
    criminal_data: {
      name: string;
      father_name: string | null;
      grandfather_name: string | null;
      id_card_number: string | null;
      phone_number: string | null;
      original_residence: string | null;
      current_residence: string | null;
      crime_type: string | null;
      arrest_location: string | null;
      arrest_date: string | null;
      final_verdict: string | null;
      notes: string | null;
    };
  };
  created_at: string;
  updated_at: string;
}

interface ViewProps {
  code: string;
}

export default function ReportView({ code }: ViewProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState<boolean>(false);
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    headerColor: '#1f2937',
    textColor: '#374151',
    accentColor: '#3b82f6',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    showLogo: true,
    showFooter: true,
    showDate: true,
    pageSize: 'a4',
    orientation: 'portrait',
    margins: 'normal'
  });
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);
  const printTemplateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch report by code
    fetchReport();
  }, [code]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports/code/${code}`);
      if (response.data && response.data.report) {
        setReport(response.data.report);
      } else {
        setError('Report not found');
      }
    } catch (err) {
      setError('Failed to load report');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format the date (handling null)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy/MM/dd');
    } catch (e) {
      return '';
    }
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
      setShowPrintPreview(false);
    }, 300);
  };

  const handleOpenPrintSettings = () => {
    setIsPrintSettingsOpen(true);
  };

  const handleClosePrintSettings = () => {
    setIsPrintSettingsOpen(false);
  };

  const handleApplyPrintSettings = (settings: PrintSettings) => {
    setPrintSettings(settings);
  };

  return (
    <>
      <Head title={`Report: ${code}`} />

      {/* Regular view */}
      {!showPrintPreview && (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-8">
              <h2 className="text-2xl font-bold mb-4">Error</h2>
              <p>{error}</p>
            </div>
          ) : report ? (
            <div>
              <div className="mb-6 border-b pb-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-primary">Report Details</h1>
                  <div className="mt-2 flex items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{format(new Date(report.created_at), 'yyyy/MM/dd HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={14} />
                      <span>Code: {report.code}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleOpenPrintSettings}
                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Settings size={16} className="mr-1" />
                    Format
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center px-3 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    <Printer size={16} className="mr-1" />
                    Print
                  </button>
                </div>
              </div>

              {/* Regular content sections */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-primary">Criminal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Name</h3>
                    <p>{report.properties.criminal_data.name}</p>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Father's Name</h3>
                    <p>{report.properties.criminal_data.father_name || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Grandfather's Name</h3>
                    <p>{report.properties.criminal_data.grandfather_name || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">ID Card Number</h3>
                    <p>{report.properties.criminal_data.id_card_number || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Phone Number</h3>
                    <p>{report.properties.criminal_data.phone_number || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Crime Type</h3>
                    <p>{report.properties.criminal_data.crime_type || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Arrest Date</h3>
                    <p>{formatDate(report.properties.criminal_data.arrest_date)}</p>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Arrest Location</h3>
                    <p>{report.properties.criminal_data.arrest_location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-primary">Residence</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Original Residence</h3>
                    <p>{report.properties.criminal_data.original_residence || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-neutral-700">Current Residence</h3>
                    <p>{report.properties.criminal_data.current_residence || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {(report.properties.criminal_data.final_verdict || report.properties.criminal_data.notes) && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 text-primary">Case Details</h2>
                  {report.properties.criminal_data.final_verdict && (
                    <div className="border rounded-lg p-4 shadow-sm mb-4">
                      <h3 className="font-bold text-neutral-700 mb-2">Final Verdict</h3>
                      <div className="whitespace-pre-wrap">
                        {report.properties.criminal_data.final_verdict}
                      </div>
                    </div>
                  )}
                  {report.properties.criminal_data.notes && (
                    <div className="border rounded-lg p-4 shadow-sm">
                      <h3 className="font-bold text-neutral-700 mb-2">Notes</h3>
                      <div className="whitespace-pre-wrap">
                        {report.properties.criminal_data.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 text-center text-sm text-neutral-500">
                <p>Report generated on {format(new Date(report.created_at), 'MMMM d, yyyy')}</p>
              </div>

              {/* Print Settings Modal */}
              <PrintSettingsModal
                isOpen={isPrintSettingsOpen}
                onClose={handleClosePrintSettings}
                onApply={handleApplyPrintSettings}
                initialSettings={printSettings}
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <p>No report found</p>
            </div>
          )}
        </div>
      )}

      {/* Print Preview Template */}
      {showPrintPreview && report && (
        <div ref={printTemplateRef}>
          <PrintTemplate report={report} settings={printSettings} />
        </div>
      )}
    </>
  );
}
