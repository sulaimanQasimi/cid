import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Fingerprint, Wifi, WifiOff, Loader2, CheckCircle, XCircle, Info, Hand, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { FingerprintAPI, DeviceInfo } from '@/lib/fingerprint-api';
import FingerprintCapture from '@/components/FingerprintCapture';
import Header from '@/components/template/header';
import { toast } from 'sonner';
import axios from 'axios';

interface Criminal {
  id: number;
  name: string;
  number: string | null;
  fingerprints?: CriminalFingerprint[];
}

interface CriminalFingerprint {
  id: number;
  finger_position: string;
  template: string;
  image_base64: string;
  quality_score: number | null;
  captured_at: string;
  captured_by: number | null;
  capturedBy?: {
    id: number;
    name: string;
  };
}

interface Props {
  criminal: Criminal;
}

const FINGER_POSITIONS = [
  'right_thumb',
  'right_index',
  'right_middle',
  'right_ring',
  'right_pinky',
  'left_thumb',
  'left_index',
  'left_middle',
  'left_ring',
  'left_pinky',
];

export default function Fingerprints({ criminal }: Props) {
  const { t } = useTranslation();
  const [fingerprintApi] = useState(() => new FingerprintAPI());
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [fingerprints, setFingerprints] = useState<Record<string, CriminalFingerprint>>({});
  const [loading, setLoading] = useState(true);

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('criminal.page_title'),
      href: route('criminals.index'),
    },
    {
      title: criminal.name,
      href: route('criminals.show', criminal.id),
    },
    {
      title: t('criminal.fingerprints.page_title'),
      href: route('criminals.fingerprints', criminal.id),
    },
  ];

  // Initialize fingerprints from props
  useEffect(() => {
    if (criminal.fingerprints) {
      const fingerprintMap: Record<string, CriminalFingerprint> = {};
      criminal.fingerprints.forEach((fp) => {
        fingerprintMap[fp.finger_position] = fp;
      });
      setFingerprints(fingerprintMap);
    }
    setLoading(false);
  }, [criminal.fingerprints]);

  // Check API connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = await fingerprintApi.healthCheck();
    setIsConnected(connected);

    if (connected) {
      const info = await fingerprintApi.getDeviceInfo();
      setDeviceInfo(info);
    }
  };

  const handleCapture = async (
    fingerPosition: string,
    template: string,
    imageBase64: string,
    qualityScore?: number
  ) => {
    try {
      const response = await axios.post(
        `/api/criminals/${criminal.id}/fingerprints`,
        {
          finger_position: fingerPosition,
          template,
          image_base64: imageBase64,
          quality_score: qualityScore,
        }
      );

      if (response.data.success) {
        const newFingerprint: CriminalFingerprint = response.data.data;
        setFingerprints((prev) => ({
          ...prev,
          [fingerPosition]: newFingerprint,
        }));
        toast.success(t('criminal.fingerprints.capture_success'));
      } else {
        toast.error(response.data.message || t('criminal.fingerprints.save_error'));
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t('criminal.fingerprints.save_error')
      );
    }
  };

  const handleVerify = async (fingerPosition: string) => {
    try {
      // Get stored template from backend
      const templateResponse = await axios.get(
        `/api/criminals/${criminal.id}/fingerprints/${fingerPosition}/template`
      );

      if (!templateResponse.data.success || !templateResponse.data.data.template) {
        toast.error(t('criminal.fingerprints.verify_error'));
        return { match: false };
      }

      const storedTemplate = templateResponse.data.data.template;

      // Capture a new fingerprint for verification
      const captureResponse = await fingerprintApi.capture({
        timeout: 10000,
        quality: 50,
      });

      if (!captureResponse.success || !captureResponse.data?.template) {
        toast.error(captureResponse.message || t('criminal.fingerprints.verify_capture_error'));
        return { match: false };
      }

      const verifyTemplate = captureResponse.data.template;

      // Compare templates using fingerprint API client-side
      const compareResult = await fingerprintApi.compare(
        storedTemplate,
        verifyTemplate,
        'NORMAL'
      );

      console.log('Compare Result:', compareResult);
      
      if (compareResult.success) {
        const match = compareResult.data?.match ?? false;
        const score = compareResult.data?.score;

        console.log('Match value:', match, 'Score:', score);

        if (match === true) {
          toast.success(
            t('criminal.fingerprints.verify_success', { 
              score: String(score || 'N/A')
            })
          );
          return {
            match: true,
            score,
          };
        } else {
          toast.error(t('criminal.fingerprints.verify_no_match'));
          return { match: false, score };
        }
      } else {
        toast.error(compareResult.message || t('criminal.fingerprints.verify_error'));
        return { match: false };
      }
    } catch (error: any) {
      console.error('Verify error:', error);
      toast.error(
        error.response?.data?.message || error.message || t('criminal.fingerprints.verify_error')
      );
      return { match: false };
    }
  };

  const handleDelete = async (fingerPosition: string) => {
    try {
      const response = await axios.delete(
        `/api/criminals/${criminal.id}/fingerprints/${fingerPosition}`
      );

      if (response.data.success) {
        setFingerprints((prev) => {
          const updated = { ...prev };
          delete updated[fingerPosition];
          return updated;
        });
        toast.success(t('criminal.fingerprints.delete_success'));
      } else {
        toast.error(response.data.message || t('criminal.fingerprints.delete_error'));
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t('criminal.fingerprints.delete_error')
      );
    }
  };

  const capturedCount = Object.keys(fingerprints).length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('criminal.fingerprints.page_title')} />

      <div className="container px-0 py-6">
        <Header
          title={t('criminal.fingerprints.title', { name: criminal.name })}
          description={t('criminal.fingerprints.description')}
          icon={<Fingerprint className="h-6 w-6 text-white" />}
          model="criminal"
          routeName={route('criminals.fingerprints', criminal.id)}
          theme="blue"
          showButton={false}
          showBackButton={true}
          backRouteName={() => route('criminals.show', criminal.id)}
          backButtonText={t('common.back')}
          actionButtons={
            <Link
              href={route('criminals.show', criminal.id)}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 group/btn"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-4 w-4" />
                </div>
                {t('common.back')}
              </div>
            </Link>
          }
        />

        {/* Connection Status & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Connection Status Card */}
          <Card className={`border-2 transition-all duration-300 ${
            isConnected === null 
              ? 'border-gray-300 bg-gray-50 dark:bg-gray-800' 
              : isConnected 
                ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
                : 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
          }`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isConnected === null ? (
                    <>
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300" dir="rtl">
                          {t('criminal.fingerprints.checking_connection')}
                        </p>
                      </div>
                    </>
                  ) : isConnected ? (
                    <>
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300" dir="rtl">
                          {t('criminal.fingerprints.connected')}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400" dir="rtl">
                          {deviceInfo?.data?.deviceName || t('criminal.fingerprints.device_info')}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-300" dir="rtl">
                          {t('criminal.fingerprints.disconnected')}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={checkConnection}
                  disabled={isConnected === null}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`h-4 w-4 ${isConnected === null ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300" dir="rtl">
                    {t('criminal.fingerprints.progress')}
                  </p>
                </div>
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  {capturedCount} / {FINGER_POSITIONS.length}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(capturedCount / FINGER_POSITIONS.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2" dir="rtl">
                {Math.round((capturedCount / FINGER_POSITIONS.length) * 100)}% {t('criminal.fingerprints.complete')}
              </p>
            </CardContent>
          </Card>

          {/* Quality Stats Card */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Fingerprint className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300" dir="rtl">
                  {t('criminal.fingerprints.average_quality')}
                </p>
              </div>
              {capturedCount > 0 ? (
                <>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(
                      Object.values(fingerprints).reduce((sum, fp) => sum + (fp.quality_score || 0), 0) / capturedCount
                    )}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1" dir="rtl">
                    {t('criminal.fingerprints.based_on_captured')}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                  {t('criminal.fingerprints.no_data')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fingerprint Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Right Hand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Hand className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200" dir="rtl">
                  {t('criminal.fingerprints.right_hand')}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {FINGER_POSITIONS.slice(0, 5).map((position) => (
                  <FingerprintCapture
                    key={position}
                    fingerPosition={position}
                    fingerprintApi={fingerprintApi}
                    onCapture={(template, imageBase64, qualityScore) =>
                      handleCapture(position, template, imageBase64, qualityScore)
                    }
                    onVerify={() => handleVerify(position)}
                    onDelete={() => handleDelete(position)}
                    existingImage={
                      fingerprints[position]?.image_base64
                        ? fingerprints[position].image_base64.startsWith('data:image')
                          ? fingerprints[position].image_base64
                          : `data:image/png;base64,${fingerprints[position].image_base64}`
                        : null
                    }
                    existingTemplate={fingerprints[position]?.template || null}
                    existingQualityScore={fingerprints[position]?.quality_score || null}
                    disabled={!isConnected}
                  />
                ))}
              </div>
            </div>

            {/* Left Hand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Hand className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200" dir="rtl">
                  {t('criminal.fingerprints.left_hand')}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {FINGER_POSITIONS.slice(5, 10).map((position) => (
                  <FingerprintCapture
                    key={position}
                    fingerPosition={position}
                    fingerprintApi={fingerprintApi}
                    onCapture={(template, imageBase64, qualityScore) =>
                      handleCapture(position, template, imageBase64, qualityScore)
                    }
                    onVerify={() => handleVerify(position)}
                    onDelete={() => handleDelete(position)}
                    existingImage={
                      fingerprints[position]?.image_base64
                        ? fingerprints[position].image_base64.startsWith('data:image')
                          ? fingerprints[position].image_base64
                          : `data:image/png;base64,${fingerprints[position].image_base64}`
                        : null
                    }
                    existingTemplate={fingerprints[position]?.template || null}
                    existingQualityScore={fingerprints[position]?.quality_score || null}
                    disabled={!isConnected}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!isConnected && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1" dir="rtl">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {t('criminal.fingerprints.connection_warning')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
