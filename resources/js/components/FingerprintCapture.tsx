import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Fingerprint, Loader2, CheckCircle, XCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { FingerprintAPI, CaptureResponse } from '@/lib/fingerprint-api';
import { useTranslation } from '@/lib/i18n/translate';

interface FingerprintCaptureProps {
  fingerPosition: string;
  fingerprintApi: FingerprintAPI;
  onCapture: (template: string, imageBase64: string, qualityScore?: number) => Promise<void>;
  onVerify?: () => Promise<{ match: boolean; score?: number }>;
  existingImage?: string | null;
  existingTemplate?: string | null;
  existingQualityScore?: number | null;
  onDelete?: () => Promise<void>;
  disabled?: boolean;
}

export default function FingerprintCapture({
  fingerPosition,
  fingerprintApi,
  onCapture,
  onVerify,
  existingImage,
  existingTemplate,
  existingQualityScore,
  onDelete,
  disabled = false,
}: FingerprintCaptureProps) {
  const { t } = useTranslation();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<{ match: boolean; score?: number } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(existingImage || null);

  const handleCapture = async () => {
    setIsCapturing(true);
    setError(null);

    try {
      const response: CaptureResponse = await fingerprintApi.capture({
        timeout: 10000,
        quality: 50,
      });

      console.log('Capture response:', response);

      if (response.success && response.data && response.data.template && response.data.imageBase64) {
        const imageData = response.data.imageBase64.startsWith('data:image')
          ? response.data.imageBase64
          : `data:image/png;base64,${response.data.imageBase64}`;
        
        setPreviewImage(imageData);
        
        await onCapture(
          response.data.template,
          response.data.imageBase64,
          response.data.quality
        );
      } else {
        const errorMsg = response.message || t('criminal.fingerprints.capture_error');
        console.error('Capture failed:', response);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Capture exception:', err);
      setError(err instanceof Error ? err.message : t('criminal.fingerprints.capture_error'));
    } finally {
      setIsCapturing(false);
    }
  };

  const handleVerify = async () => {
    if (!onVerify) return;

    setIsVerifying(true);
    setError(null);
    setVerifyResult(null);

    try {
      // Call the verify handler (which handles everything client-side)
      const result = await onVerify();
      setVerifyResult(result);
    } catch (err) {
      console.error('Verify exception:', err);
      setError(err instanceof Error ? err.message : t('criminal.fingerprints.verify_error'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    if (!confirm(t('criminal.fingerprints.delete_confirm'))) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    setVerifyResult(null);

    try {
      await onDelete();
      setPreviewImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('criminal.fingerprints.delete_error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const fingerLabel = t(`criminal.fingerprints.positions.${fingerPosition}`) || fingerPosition;

  const hasFingerprint = !!previewImage;

  return (
    <Card className={`border-2 transition-all duration-300 hover:shadow-lg ${
      hasFingerprint 
        ? 'border-green-300 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10' 
        : 'border-gray-200 hover:border-primary bg-white dark:bg-gray-800'
    }`}>
      <CardContent className="p-5">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm font-semibold text-center text-gray-700 dark:text-gray-300" dir="rtl">
            {fingerLabel}
          </div>

          {previewImage ? (
            <>
              <div className="relative w-36 h-36 border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 shadow-inner">
                <img
                  src={previewImage}
                  alt={fingerLabel}
                  className="w-full h-full object-contain p-2"
                />
                {verifyResult && (
                  <div className={`absolute top-2 right-2 p-1.5 rounded-full shadow-lg ${
                    verifyResult.match ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}>
                    {verifyResult.match ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <XCircle className="h-5 w-5 text-white" />
                    )}
                  </div>
                )}
                {hasFingerprint && !verifyResult && (
                  <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              {existingQualityScore !== null && existingQualityScore !== undefined && (
                <div className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  existingQualityScore >= 70 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                    : existingQualityScore >= 40 
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`} dir="rtl">
                  {t('criminal.fingerprints.quality')}: {existingQualityScore}%
                </div>
              )}
              {verifyResult && (
                <div className={`text-xs font-medium text-center px-3 py-1.5 rounded-lg shadow-sm ${
                  verifyResult.match 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300' 
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-300'
                }`} dir="rtl">
                  {verifyResult.match 
                    ? t('criminal.fingerprints.verify_match', { score: String(verifyResult.score || 'N/A') })
                    : t('criminal.fingerprints.verify_no_match')
                  }
                </div>
              )}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCapture}
                    disabled={isCapturing || disabled}
                    className="flex items-center gap-1 flex-1"
                  >
                    {isCapturing ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {t('criminal.fingerprints.capturing')}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3" />
                        {t('criminal.fingerprints.recapture')}
                      </>
                    )}
                  </Button>
                  {onVerify && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleVerify}
                      disabled={isVerifying || disabled}
                      className="flex items-center gap-1 flex-1"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {t('criminal.fingerprints.verifying')}
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3 w-3" />
                          {t('criminal.fingerprints.verify')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting || disabled}
                    className="flex items-center gap-1 w-full"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {t('criminal.fingerprints.deleting')}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        {t('criminal.fingerprints.delete')}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="w-36 h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 transition-all duration-300 hover:border-primary hover:bg-gray-100 dark:hover:bg-gray-700">
                <Fingerprint className="h-16 w-16 text-gray-400 dark:text-gray-500" />
              </div>
              <Button
                size="sm"
                onClick={handleCapture}
                disabled={isCapturing || disabled}
                className="flex items-center gap-1"
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {t('criminal.fingerprints.capturing')}
                  </>
                ) : (
                  <>
                    <Fingerprint className="h-3 w-3" />
                    {t('criminal.fingerprints.capture')}
                  </>
                )}
              </Button>
            </>
          )}

          {error && (
            <div className="text-xs text-destructive text-center" dir="rtl">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
