import React, { useState, useEffect } from 'react';
import type { CustomizationSettings } from '../../types';
import IconButton from '../IconButton';
import PaintBrushIcon from '../icons/PaintBrushIcon';
import UploadIcon from '../icons/UploadIcon';
import CloseIcon from '../icons/CloseIcon';
import { REPORT_CUSTOMIZATION_COLORS, DEFAULT_CUSTOM_COLOR } from '../../constants';

interface ReportCustomizerProps {
  settings: CustomizationSettings;
  onChange: (settings: CustomizationSettings) => void;
  disabled?: boolean;
}

const ReportCustomizer: React.FC<ReportCustomizerProps> = ({ settings, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<CustomizationSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSettings = { ...localSettings, [name]: value };
    setLocalSettings(newSettings);
    onChange(newSettings); 
  };

  const handleColorSelect = (colorValue: string) => {
    const newSettings = { ...localSettings, primaryColor: colorValue };
    setLocalSettings(newSettings);
    onChange(newSettings);
  };
  
  const handleResetCustomization = () => {
    const defaultSettings = { logoUrl: '', primaryColor: DEFAULT_CUSTOM_COLOR };
    setLocalSettings(defaultSettings);
    onChange(defaultSettings);
  };

  return (
    <div className={`bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700 transition-all duration-300 ease-in-out ${disabled ? 'opacity-70' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
        aria-expanded={isOpen}
        aria-controls="customization-panel"
        disabled={disabled}
      >
        <div className="flex items-center">
          <PaintBrushIcon className="w-5 h-5 mr-2 text-brand-premium-blue" />
          <span className="font-semibold text-brand-gray-100">Customize Report Appearance</span>
        </div>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-brand-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div id="customization-panel" className="p-4 border-t border-brand-gray-700 space-y-4 animate-fade-in">
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-brand-gray-300 mb-1">
              Company Logo URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UploadIcon className="h-5 w-5 text-brand-gray-400" />
              </div>
              <input
                type="url"
                name="logoUrl"
                id="logoUrl"
                value={localSettings.logoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className="w-full p-2 pl-10 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none placeholder-brand-gray-500"
                disabled={disabled}
              />
            </div>
            {localSettings.logoUrl && (
                <div className="mt-2 flex items-center">
                    <img src={localSettings.logoUrl} alt="Logo Preview" className="h-8 w-auto max-w-xs mr-2 bg-white p-0.5 rounded-sm object-contain" 
                         onError={(e) => (e.currentTarget.style.display = 'none')} 
                         onLoad={(e) => (e.currentTarget.style.display = 'inline-block')}
                    />
                    <span className="text-xs text-brand-gray-400">Logo Preview</span>
                </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-gray-300 mb-1">
              Primary Report Color
            </label>
            <div className="flex flex-wrap gap-2">
              {REPORT_CUSTOMIZATION_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onClick={() => handleColorSelect(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-150
                    ${localSettings.primaryColor === color.value ? 'ring-2 ring-offset-2 ring-offset-brand-gray-800 ring-white' : 'border-transparent'}
                    hover:opacity-80`}
                  style={{ backgroundColor: color.value }}
                  disabled={disabled}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
               <input
                type="color"
                value={localSettings.primaryColor}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="w-8 h-8 rounded-full border-2 border-transparent cursor-pointer p-0 bg-brand-gray-700" // Added bg for empty state
                title="Custom color picker"
                disabled={disabled}
              />
            </div>
          </div>
          <div className="pt-2">
            <IconButton 
                label="Reset Customization"
                icon={<CloseIcon className="w-4 h-4"/>}
                onClick={handleResetCustomization}
                variant="ghost"
                size="sm"
                disabled={disabled}
                className="text-xs text-brand-gray-400 hover:text-red-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCustomizer;