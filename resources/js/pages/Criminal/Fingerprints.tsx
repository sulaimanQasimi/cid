import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Fingerprint, Wifi, WifiOff, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
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

        {/* Connection Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isConnected === null ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-600" dir="rtl">
                      {t('criminal.fingerprints.checking_connection')}
                    </span>
                  </>
                ) : isConnected ? (
                  <>
                    <Wifi className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600" dir="rtl">
                      {t('criminal.fingerprints.connected')}
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-600" dir="rtl">
                      {t('criminal.fingerprints.disconnected')}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {capturedCount} / {FINGER_POSITIONS.length} {t('criminal.fingerprints.captured')}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={checkConnection}
                  disabled={isConnected === null}
                >
                  {t('criminal.fingerprints.refresh_connection')}
                </Button>
              </div>
            </div>

            {deviceInfo?.data && (
              <div className="mt-3 pt-3 border-t text-xs text-gray-500" dir="rtl">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>
                    {deviceInfo.data.deviceName || t('criminal.fingerprints.device_info')}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fingerprint Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2" dir="rtl">
                {t('criminal.fingerprints.right_hand')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                {FINGER_POSITIONS.slice(0, 5).map((position) => (
                  <FingerprintCapture
                    key={position}
                    fingerPosition={position}
                    fingerprintApi={fingerprintApi}
                    onCapture={(template, imageBase64, qualityScore) =>
                      handleCapture(position, template, imageBase64, qualityScore)
                    }
                    onDelete={() => handleDelete(position)}
                    existingImage={
                      fingerprints[position]?.image_base64
                        ? fingerprints[position].image_base64.startsWith('data:image')
                          ? fingerprints[position].image_base64
                          : `data:image/png;base64,${fingerprints[position].image_base64}`
                        : null
                    }
                    disabled={!isConnected}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2" dir="rtl">
                {t('criminal.fingerprints.left_hand')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {FINGER_POSITIONS.slice(5, 10).map((position) => (
                  <FingerprintCapture
                    key={position}
                    fingerPosition={position}
                    fingerprintApi={fingerprintApi}
                    onCapture={(template, imageBase64, qualityScore) =>
                      handleCapture(position, template, imageBase64, qualityScore)
                    }
                    onDelete={() => handleDelete(position)}
                    existingImage={
                      fingerprints[position]?.image_base64
                        ? fingerprints[position].image_base64.startsWith('data:image')
                          ? fingerprints[position].image_base64
                          : `data:image/png;base64,${fingerprints[position].image_base64}`
                        : null
                    }
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
