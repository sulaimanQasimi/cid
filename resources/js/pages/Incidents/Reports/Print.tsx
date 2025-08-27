import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Printer, FileText, AlertTriangle, Calendar, Shield, User, MapPin, ChartBar, Clock, Users, Home, Gavel, FileCheck, BookText, Building2, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n/translate';

interface StatCategory {
  id: number;
  name: string;
  label: string;
  color: string;
  status: string;
}

interface StatCategoryItem {
  id: number;
  name: string;
  label: string;
  color: string;
  category: {
    id: number;
    name: string;
    label: string;
    color: string;
  };
}

interface ReportStat {
  id: number;
  incident_report_id: number;
  stat_category_item_id: number;
  integer_value: number | null;
  string_value: string | null;
  notes: string | null;
  stat_category_item: StatCategoryItem;
}

interface StatsByCategory {
  [key: string]: {
    category: {
      id: number;
      name: string;
      label: string;
      color: string;
    };
    stats: ReportStat[];
  };
}

interface BarcodeData {
  report_number: string;
  report_id: number;
  date: string;
  security_level: string;
}

interface PrintProps {
  report: {
    id: number;
    report_number: string;
    report_date: string;
    report_status: string;
    security_level: string;
    details: string;
    action_taken?: string;
    recommendation?: string;
    source?: string;
    submitted_by: number;
    approved_by?: number;
    created_at: string;
    updated_at: string;
    submitter?: {
      id: number;
      name: string;
    };
    approver?: {
      id: number;
      name: string;
    };
  };
  incidents: Array<{
    id: number;
    title: string;
    incident_date: string;
    description: string;
    severity: string;
    status: string;
    location?: string;
    district?: {
      id: number;
      name: string;
    };
    category?: {
      id: number;
      name: string;
      color: string;
    };
    reporter?: {
      id: number;
      name: string;
    };
  }>;
  reportStats: ReportStat[];
  statsByCategory: StatsByCategory;
  statCategories: StatCategory[];
  barcodeData: BarcodeData;
  isAdmin: boolean;
}

export default function Print({ report, incidents, reportStats, statsByCategory, statCategories, barcodeData, isAdmin }: PrintProps) {
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  function getStatusBadge(status: string) {
    switch (status) {
      case 'closed':
        return <Badge variant="secondary" className="bg-gray-500 text-white border-gray-600 px-2 py-1 text-xs font-medium rounded-lg">{t('incidents.status.closed')}</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500 text-white border-blue-600 px-2 py-1 text-xs font-medium rounded-lg">{t('incidents.status.in_progress')}</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-2 py-1 text-xs font-medium rounded-lg">{status}</Badge>;
    }
  }

  function getSeverityBadge(severity: string) {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive" className="bg-red-500 text-white border-red-600 px-2 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500 text-white border-yellow-600 px-2 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-2 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
    }
  }

  function getStatValue(stat: ReportStat): string {
    return stat.integer_value !== null ? stat.integer_value.toString() : (stat.string_value || '');
  }

  // Generate barcode text
  const barcodeText = `${barcodeData.report_number}|${barcodeData.report_id}|${barcodeData.date}|${barcodeData.security_level}`;

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <>
        <Head title={t('incident_reports.print.access_denied')} />
        <div className="min-h-screen bg-white p-8 flex items-center justify-center" dir="rtl">
          <Card className="border border-red-200 shadow-sm max-w-md">
            <CardHeader className="bg-red-50 border-b border-red-200">
              <CardTitle className="flex items-center gap-3 text-lg text-red-900">
                <Lock className="h-5 w-5" />
                {t('incident_reports.print.access_denied')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">{t('incident_reports.print.admin_only')}</p>
              <Button onClick={handleBack} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title={t('incident_reports.print.page_title', { number: report.report_number })} />
      
      {/* Print Controls */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={handleBack} variant="outline" className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-100 shadow-lg">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
          <Printer className="h-4 w-4 mr-2" />
          {t('common.print')}
        </Button>
      </div>

      {/* Print Content */}
      <div className="min-h-screen bg-white p-8 print:p-0 print:min-h-0" dir="rtl">
        {/* Header with Barcode */}
        <div className="text-center mb-4 print:mb-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('incident_reports.print.title')}</h1>
          </div>
          <div className="text-sm text-gray-600 mb-3">{t('incident_reports.print.subtitle')}</div>
          
          {/* Barcode Section */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 inline-block">
            <div className="text-xs text-gray-500 mb-1">{t('incident_reports.print.barcode_label')}</div>
            <div className="font-mono text-xs bg-white p-1 border border-gray-300 rounded">
              {barcodeText}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {t('incident_reports.print.barcode_info')}
            </div>
          </div>
        </div>

        {/* Report Information */}
        <div className="mb-4 print:mb-3">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-gray-200 py-3">
              <CardTitle className="flex items-center gap-2 text-base text-blue-900">
                <FileText className="h-4 w-4" />
                {t('incident_reports.print.report_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-1 text-sm">
                        {t('incident_reports.show.report_number')}:
                        <FileText className="h-3 w-3" />
                      </span>
                      <span className="text-gray-900 font-bold text-base">{report.report_number}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-1 text-sm">
                        {t('incident_reports.show.report_date_label')}:
                        <Calendar className="h-3 w-3" />
                      </span>
                      <span className="text-gray-900 text-sm">{format(new Date(report.report_date), 'PPP')}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-1 text-sm">
                        {t('incident_reports.show.status')}:
                        <Clock className="h-3 w-3" />
                      </span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 px-2 py-0.5 text-xs font-medium">
                        {t(`incident_reports.status.${report.report_status}`)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-1 text-sm">
                        {t('incident_reports.show.security_level')}:
                        <Shield className="h-3 w-3" />
                      </span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-2 py-0.5 text-xs font-medium">
                        {t(`incident_reports.level.${report.security_level}`)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-1 text-sm">
                        {t('incident_reports.show.submitted_by')}:
                        <User className="h-3 w-3" />
                      </span>
                      <span className="text-gray-900 text-sm">{report.submitter?.name || t('incidents.unknown')}</span>
                    </div>
                    
                    {report.approver && (
                      <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                        <span className="font-semibold text-gray-700 flex items-center gap-1 text-sm">
                          {t('incident_reports.show.approved_by')}:
                          <User className="h-3 w-3" />
                        </span>
                        <span className="text-gray-900 text-sm">{report.approver?.name}</span>
                      </div>
                    )}
                  </div>
              </div>
              
              {report.source && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700 flex items-center gap-1 text-sm">
                      {t('incident_reports.show.source_label')}:
                      <Users className="h-3 w-3" />
                    </span>
                    <span className="text-gray-900 text-sm">{report.source}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report Details */}
        <div className="mb-4 print:mb-3">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-green-50 border-b border-gray-200 py-3">
              <CardTitle className="flex items-center gap-2 text-base text-green-900">
                <BookText className="h-4 w-4" />
                {t('incident_reports.details.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    {t('incident_reports.details.details_label')}
                    <FileText className="h-3 w-3" />
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm">{report.details}</p>
                  </div>
                </div>

                {report.action_taken && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      {t('incident_reports.details.action_taken_label')}
                      <Gavel className="h-3 w-3" />
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm">{report.action_taken}</p>
                    </div>
                  </div>
                )}

                {report.recommendation && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      {t('incident_reports.details.recommendation_label')}
                      <FileCheck className="h-3 w-3" />
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm">{report.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incidents Section */}
        <div className="mb-4 print:mb-3">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-red-50 border-b border-gray-200 py-3">
              <CardTitle className="flex items-center gap-2 text-base text-red-900">
                <AlertTriangle className="h-4 w-4" />
                {t('incidents.page_title')} ({incidents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {incidents.length === 0 ? (
                <div className="text-center py-4">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">{t('incidents.no_incidents')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((incident, index) => (
                    <div key={incident.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base font-semibold text-gray-900">
                          {index + 1}. {incident.title}
                        </h4>
                        <div className="flex gap-1">
                          {getSeverityBadge(incident.severity)}
                          {getStatusBadge(incident.status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-700">{format(new Date(incident.incident_date), 'PPP')}</span>
                        </div>
                        
                        {incident.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700">{incident.location}</span>
                          </div>
                        )}
                        
                        {incident.district && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700">{incident.district.name}</span>
                          </div>
                        )}
                        
                        {incident.category && (
                          <div className="flex items-center gap-1">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: incident.category.color }}
                            ></div>
                            <span className="text-gray-700">{incident.category.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <p className="text-gray-800 leading-relaxed text-sm">{incident.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Section */}
        {Object.keys(statsByCategory).length > 0 && (
          <div className="mb-4 print:mb-3">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-purple-50 border-b border-gray-200 py-3">
                <CardTitle className="flex items-center gap-2 text-base text-purple-900">
                  <ChartBar className="h-4 w-4" />
                  {t('incident_reports.stats.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {Object.entries(statsByCategory).map(([categoryName, categoryData]) => (
                    <div key={categoryName} className="border border-gray-200 rounded-lg p-3">
                      <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-1">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: categoryData.category.color }}
                        ></div>
                        {categoryName}
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {categoryData.stats.map((stat) => (
                          <div key={stat.id} className="flex justify-between items-center border-b border-gray-100 pb-1">
                            <div className="flex items-center gap-1">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: stat.stat_category_item.color || stat.stat_category_item.category.color }}
                              ></div>
                              <span className="text-gray-700 font-medium text-sm">{stat.stat_category_item.label}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-gray-900 font-semibold text-sm">{getStatValue(stat)}</span>
                              {stat.notes && (
                                <div className="text-xs text-gray-500 mt-0.5">{stat.notes}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stamp and Signature Section */}
        <div className="mb-4 print:mb-3">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                <FileCheck className="h-4 w-4" />
                {t('incident_reports.print.approval_section')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 print:grid-cols-2 gap-6">
                {/* Official Stamp */}
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500 mb-1">{t('incident_reports.print.official_stamp')}</div>
                    <div className="text-xs text-gray-400">{t('incident_reports.print.stamp_placeholder')}</div>
                  </div>
                </div>
                
                {/* Signature */}
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500 mb-1">{t('incident_reports.print.authorized_signature')}</div>
                    <div className="text-xs text-gray-400">{t('incident_reports.print.signature_placeholder')}</div>
                  </div>
                </div>
              </div>
              
              {/* Approval Details */}
              <div className="mt-4 grid grid-cols-1 print:grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">{t('incident_reports.print.approved_by')}</div>
                  <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                    {report.approver?.name || t('incident_reports.print.pending_approval')}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">{t('incident_reports.print.approval_date')}</div>
                  <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                    {report.approver ? format(new Date(report.updated_at), 'PPP') : t('incident_reports.print.pending')}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">{t('incident_reports.print.document_status')}</div>
                  <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                    {t(`incident_reports.status.${report.report_status}`)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 print:mt-6 pt-6 border-t-2 border-gray-300">
          <div className="grid grid-cols-1 print:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-2">{t('incident_reports.print.generated_by')}</div>
              <div className="text-sm text-gray-900 font-medium">{report.submitter?.name || t('incidents.unknown')}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-2">{t('incident_reports.print.generated_date')}</div>
              <div className="text-sm text-gray-900 font-medium">{format(new Date(report.created_at), 'PPP')}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-2">{t('incident_reports.print.last_updated')}</div>
              <div className="text-sm text-gray-900 font-medium">{format(new Date(report.updated_at), 'PPP')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              margin: 0.5in;
              size: A4;
            }
            
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              font-size: 10pt;
              line-height: 1.2;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .print\\:mb-3 {
              margin-bottom: 0.75rem !important;
            }
            
            .print\\:mb-6 {
              margin-bottom: 1.5rem !important;
            }
            
            .print\\:mt-6 {
              margin-top: 1.5rem !important;
            }
            
            .print\\:mt-8 {
              margin-top: 2rem !important;
            }
            
            .print\\:p-0 {
              padding: 0 !important;
            }
            
            .print\\:min-h-0 {
              min-height: 0 !important;
            }
            
            h1 {
              font-size: 18pt !important;
              margin-bottom: 0.5rem !important;
            }
            
            h2, h3, h4 {
              font-size: 12pt !important;
              margin-bottom: 0.25rem !important;
            }
            
            p {
              font-size: 10pt !important;
              margin-bottom: 0.25rem !important;
            }
            
            .text-sm {
              font-size: 9pt !important;
            }
            
            .text-xs {
              font-size: 8pt !important;
            }
            
            .p-4 {
              padding: 0.75rem !important;
            }
            
            .p-3 {
              padding: 0.5rem !important;
            }
            
            .p-2 {
              padding: 0.25rem !important;
            }
            
            .mb-4 {
              margin-bottom: 0.75rem !important;
            }
            
            .mb-3 {
              margin-bottom: 0.5rem !important;
            }
            
            .mb-2 {
              margin-bottom: 0.25rem !important;
            }
            
            .space-y-4 > * + * {
              margin-top: 0.75rem !important;
            }
            
            .space-y-3 > * + * {
              margin-top: 0.5rem !important;
            }
          }
        `
      }} />
    </>
  );
}
