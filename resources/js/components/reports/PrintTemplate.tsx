import React from 'react';
import { PrintSettings } from './PrintSettings';
import { format } from 'date-fns';
import AppLogo from '@/components/app-logo';

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

interface PrintTemplateProps {
  report: Report;
  settings: PrintSettings;
}

export function PrintTemplate({ report, settings }: PrintTemplateProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy/MM/dd');
    } catch (e) {
      return '';
    }
  };

  // Define margin sizes based on settings
  const getMargins = () => {
    switch (settings.margins) {
      case 'narrow':
        return '0.5cm';
      case 'wide':
        return '2cm';
      default:
        return '1cm';
    }
  };

  return (
    <div
      className="print-template"
      style={{
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize}px`,
        color: settings.textColor,
        backgroundColor: 'white',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Print-specific styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @page {
          size: ${settings.pageSize} ${settings.orientation};
          margin: ${getMargins()};
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-template, .print-template * {
            visibility: visible;
          }
          .print-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-template h2 {
            break-after: avoid;
          }
          .print-template section {
            break-inside: avoid;
          }
          .print-template footer {
            position: fixed;
            bottom: 0;
            width: 100%;
          }
          .page-break {
            page-break-after: always;
          }
          /* Custom background colors for printing */
          .print-template .header-bg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: ${settings.headerColor} !important;
            color: white !important;
          }
          .print-template .accent-color {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: ${settings.accentColor} !important;
          }
          .print-template .border-accent {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            border-color: ${settings.accentColor} !important;
          }
        }
      `
        }}
      />

      {/* Header */}
      <header className="header-bg" style={{ backgroundColor: settings.headerColor, color: 'white', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {settings.showLogo && (
            <div style={{ maxWidth: '150px' }}>
              <AppLogo />
            </div>
          )}
          <div style={{ textAlign: settings.showLogo ? 'right' : 'center', width: settings.showLogo ? 'auto' : '100%' }}>
            <h1 style={{ fontSize: `${settings.fontSize + 8}px`, margin: 0, fontWeight: 'bold' }}>
              Report #{report.code}
            </h1>
            {settings.showDate && (
              <p style={{ marginTop: '5px', fontSize: `${settings.fontSize - 2}px` }}>
                Generated on: {format(new Date(), 'MMMM dd, yyyy')}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 className="accent-color" style={{
            color: settings.accentColor,
            fontSize: `${settings.fontSize + 4}px`,
            borderBottom: `2px solid ${settings.accentColor}`,
            paddingBottom: '8px'
          }}>
            Criminal Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '15px' }}>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '10px'
            }}>
              <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Name</h3>
              <p>{report.properties.criminal_data.name}</p>
            </div>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '10px'
            }}>
              <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Father's Name</h3>
              <p>{report.properties.criminal_data.father_name || 'N/A'}</p>
            </div>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '10px'
            }}>
              <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Grandfather's Name</h3>
              <p>{report.properties.criminal_data.grandfather_name || 'N/A'}</p>
            </div>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '10px'
            }}>
              <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>ID Card Number</h3>
              <p>{report.properties.criminal_data.id_card_number || 'N/A'}</p>
            </div>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '10px'
            }}>
              <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Phone Number</h3>
              <p>{report.properties.criminal_data.phone_number || 'N/A'}</p>
            </div>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '10px'
            }}>
              <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Crime Type</h3>
              <p>{report.properties.criminal_data.crime_type || 'N/A'}</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 className="accent-color" style={{
            color: settings.accentColor,
            fontSize: `${settings.fontSize + 4}px`,
            borderBottom: `2px solid ${settings.accentColor}`,
            paddingBottom: '8px'
          }}>
            Residence
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '15px' }}>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '10px'
            }}>
              <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Original Residence</h3>
              <p>{report.properties.criminal_data.original_residence || 'N/A'}</p>
            </div>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '10px'
            }}>
              <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Current Residence</h3>
              <p>{report.properties.criminal_data.current_residence || 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Optional page break for better printing */}
        {(report.properties.criminal_data.final_verdict || report.properties.criminal_data.notes) &&
          settings.orientation === 'portrait' &&
          <div className="page-break"></div>
        }

        {(report.properties.criminal_data.final_verdict || report.properties.criminal_data.notes) && (
          <section style={{ marginBottom: '30px' }}>
            <h2 className="accent-color" style={{
              color: settings.accentColor,
              fontSize: `${settings.fontSize + 4}px`,
              borderBottom: `2px solid ${settings.accentColor}`,
              paddingBottom: '8px'
            }}>
              Case Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {report.properties.criminal_data.final_verdict && (
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '10px'
                }}>
                  <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Final Verdict</h3>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {report.properties.criminal_data.final_verdict}
                  </div>
                </div>
              )}
              {report.properties.criminal_data.notes && (
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '10px'
                }}>
                  <h3 style={{ fontSize: `${settings.fontSize + 2}px`, margin: '0 0 8px 0', fontWeight: 'bold' }}>Notes</h3>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {report.properties.criminal_data.notes}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      {settings.showFooter && (
        <footer className="border-accent" style={{
          marginTop: '30px',
          padding: '15px 20px',
          borderTop: `1px solid ${settings.headerColor}`,
          textAlign: 'center',
          fontSize: `${settings.fontSize - 2}px`,
          color: '#6b7280'
        }}>
          <p>Report generated on {format(new Date(report.created_at), 'MMMM d, yyyy')}</p>
          <p>Report Code: {report.code}</p>
          <p>© {new Date().getFullYear()} Criminal Information Department</p>
        </footer>
      )}
    </div>
  );
}
