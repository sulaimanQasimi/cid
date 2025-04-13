import React, { useState } from 'react';
import { X, FileText, Palette, Type, Layout } from 'lucide-react';

interface PrintSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: PrintSettings) => void;
  initialSettings?: PrintSettings;
}

export interface PrintSettings {
  headerColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  showLogo: boolean;
  showFooter: boolean;
  showDate: boolean;
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: 'normal' | 'narrow' | 'wide';
}

const defaultSettings: PrintSettings = {
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
};

export function PrintSettings({ isOpen, onClose, onApply, initialSettings = defaultSettings }: PrintSettingsProps) {
  const [settings, setSettings] = useState<PrintSettings>(initialSettings);

  const handleChange = (name: keyof PrintSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApply(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Print Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Colors Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Palette className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-md font-medium">Colors</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Header Color
                </label>
                <div className="flex">
                  <input
                    type="color"
                    value={settings.headerColor}
                    onChange={(e) => handleChange('headerColor', e.target.value)}
                    className="h-10 w-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={settings.headerColor}
                    onChange={(e) => handleChange('headerColor', e.target.value)}
                    className="ml-2 flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex">
                  <input
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="h-10 w-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={settings.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="ml-2 flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accent Color
                </label>
                <div className="flex">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="h-10 w-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="ml-2 flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Type className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-md font-medium">Typography</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="Inter, sans-serif">Inter (Default)</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="10"
                    max="16"
                    value={settings.fontSize}
                    onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="ml-2 text-sm w-10 text-center">
                    {settings.fontSize}pt
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Layout className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-md font-medium">Layout</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Size
                </label>
                <select
                  value={settings.pageSize}
                  onChange={(e) => handleChange('pageSize', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orientation
                </label>
                <select
                  value={settings.orientation}
                  onChange={(e) => handleChange('orientation', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margins
                </label>
                <select
                  value={settings.margins}
                  onChange={(e) => handleChange('margins', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="narrow">Narrow</option>
                  <option value="wide">Wide</option>
                </select>
              </div>
            </div>
          </div>

          {/* Elements Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showLogo"
                  checked={settings.showLogo}
                  onChange={(e) => handleChange('showLogo', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-700">
                  Show Logo
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showFooter"
                  checked={settings.showFooter}
                  onChange={(e) => handleChange('showFooter', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="showFooter" className="ml-2 block text-sm text-gray-700">
                  Show Footer
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showDate"
                  checked={settings.showDate}
                  onChange={(e) => handleChange('showDate', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="showDate" className="ml-2 block text-sm text-gray-700">
                  Show Date
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-md font-medium mb-3">Preview</h3>
            <div
              className="border rounded overflow-hidden"
              style={{
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
                color: settings.textColor
              }}
            >
              <div
                className="p-3 border-b"
                style={{ backgroundColor: settings.headerColor, color: '#fff' }}
              >
                <h4 className="font-bold">Report Title</h4>
              </div>
              <div className="p-3">
                <p className="mb-2">Sample report content showing the selected styles.</p>
                <p
                  className="mb-2"
                  style={{ color: settings.accentColor }}
                >
                  This text shows your accent color.
                </p>
                <div className="text-xs mt-4 text-gray-500">
                  {settings.showFooter && <p>Footer information will appear here</p>}
                  {settings.showDate && <p>Generated on: {new Date().toLocaleDateString()}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t px-4 py-3 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}
