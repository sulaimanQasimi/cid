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
  onVerify?: (template: string) => Promise<{ match: boolean; score?: number }>;
  existingImage?: string | null;
  existingTemplate?: string | null;
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
      // First capture a new fingerprint for verification
      const response: CaptureResponse = await fingerprintApi.capture({
        timeout: 10000,
        quality: 50,
      });

      console.log('Verify capture response:', response);

      if (response.success && response.data && response.data.template) {
        // Call the verify handler
        const result = await onVerify(response.data.template);
        setVerifyResult(result);
      } else {
        const errorMsg = response.message || t('criminal.fingerprints.verify_capture_error');
        console.error('Verify capture failed:', response);
        setError(errorMsg);
      }
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

  return (
    <Card className="border-2 hover:border-primary transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-sm font-medium text-center" dir="rtl">
            {fingerLabel}
          </div>

          {previewImage ? (
            <>
              <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={previewImage}
                  alt={fingerLabel}
                  className="w-full h-full object-contain"
                />
                {verifyResult && (
                  <div className={`absolute top-1 right-1 p-1 rounded-full ${
                    verifyResult.match ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {verifyResult.match ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <XCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                )}
              </div>
              {verifyResult && (
                <div className={`text-xs text-center px-2 py-1 rounded ${
                  verifyResult.match 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' 
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                }`} dir="rtl">
                  {verifyResult.match 
                    ? t('criminal.fingerprints.verify_match', { score: verifyResult.score || 'N/A' })
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
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <Fingerprint className="h-12 w-12 text-gray-400" />
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
