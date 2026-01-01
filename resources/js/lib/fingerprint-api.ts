/**
 * Fingerprint API Client
 * Handles communication with the fingerprint device API
 */

export interface CaptureOptions {
  timeout?: number;
  quality?: number;
}

export interface CaptureResponse {
  success: boolean;
  message: string;
  data?: {
    template: string;
    imageBase64: string;
    quality?: number;
  };
  errorCode?: string;
}

export interface CompareResponse {
  success: boolean;
  message: string;
  data?: {
    match: boolean;
    score?: number;
  };
  errorCode?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    registeredTemplate: string;
  };
  errorCode?: string;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  data?: {
    match: boolean;
    score?: number;
  };
  errorCode?: string;
}

export interface DeviceInfo {
  success: boolean;
  message: string;
  data?: {
    deviceName?: string;
    deviceSerial?: string;
    firmwareVersion?: string;
    [key: string]: any;
  };
}

export type SecurityLevel = 
  | 'LOWEST'
  | 'LOWER'
  | 'LOW'
  | 'BELOW_NORMAL'
  | 'NORMAL'
  | 'ABOVE_NORMAL'
  | 'HIGH'
  | 'HIGHER'
  | 'HIGHEST';

export class FingerprintAPI {
  private apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:8080/api/fingerprint') {
    this.apiUrl = apiUrl;
  }

  /**
   * Check if the fingerprint API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<DeviceInfo> {
    try {
      const response = await fetch(`${this.apiUrl}/device-info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get device info failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Capture a fingerprint
   */
  async capture(options: CaptureOptions = {}): Promise<CaptureResponse> {
    const { timeout = 10000, quality = 50 } = options;

    try {
      const response = await fetch(`${this.apiUrl}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeout,
          quality,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || errorData.Message || `HTTP error! status: ${response.status}`,
          errorCode: errorData.errorCode || errorData.ErrorCode,
        };
      }

      const data = await response.json();
      
      // Normalize response - handle both capitalized and lowercase keys
      const normalized: CaptureResponse = {
        success: data.Success !== undefined ? data.Success : data.success !== undefined ? data.success : false,
        message: data.Message || data.message || '',
        data: data.ImageBase64 || data.Template ? {
          template: data.Template || '',
          imageBase64: data.ImageBase64 || '',
          quality: data.Quality || data.quality,
        } : data.data,
        errorCode: data.ErrorCode || data.errorCode,
      };

      return normalized;
    } catch (error) {
      console.error('Capture failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Compare two templates
   */
  async compare(
    template1: string,
    template2: string,
    securityLevel: SecurityLevel = 'NORMAL'
  ): Promise<CompareResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template1,
          template2,
          securityLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errorCode: errorData.errorCode,
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Compare failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Register two fingerprints
   */
  async register(
    template1: string,
    template2: string,
    securityLevel: SecurityLevel = 'NORMAL'
  ): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template1,
          template2,
          securityLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errorCode: errorData.errorCode,
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Register failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify a fingerprint against a registered template
   */
  async verify(
    registeredTemplate: string,
    verifyTemplate: string,
    securityLevel: SecurityLevel = 'NORMAL'
  ): Promise<VerifyResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registeredTemplate,
          verifyTemplate,
          securityLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `HTTP error! status: ${response.status}`,
          errorCode: errorData.errorCode,
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Verify failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Display a Base64 image in an element
   */
  displayImage(imageBase64: string, elementId: string): void {
    const element = document.getElementById(elementId);
    if (element && imageBase64) {
      // Remove data URL prefix if present
      const base64Data = imageBase64.startsWith('data:image')
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`;
      
      if (element instanceof HTMLImageElement) {
        element.src = base64Data;
      } else {
        element.style.backgroundImage = `url(${base64Data})`;
        element.style.backgroundSize = 'contain';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'center';
      }
    }
  }
}
