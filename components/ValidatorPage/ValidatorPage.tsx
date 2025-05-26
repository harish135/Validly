

import React, { useState, useCallback, useEffect, useContext } from 'react'; // Added useContext
import ClaimInputForm from '../ClaimInputForm';
import ReportDisplay from '../ReportDisplay';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import ReportCustomizer from './ReportCustomizer';
import type { ReportData, CustomizationSettings } from '../../types';
import { generateValidationReport } from '../../services/geminiService';
import { UserProgressContext } from '../../contexts/UserProgressContext'; // New

interface ValidatorPageProps {
  onExportPDF: () => void;
  onGenerateBadge: () => void;
  onExportDocx: () => void; 
  onExportJson: () => void; 
  onReportGenerated: (report: ReportData) => void;
  initialReport?: ReportData | null; 
  initialClaim?: string; 
  customizationSettings: CustomizationSettings;
  onCustomizationChange: (settings: CustomizationSettings) => void;
}

const ValidatorPage: React.FC<ValidatorPageProps> = ({ 
  onExportPDF, 
  onGenerateBadge,
  onExportDocx,
  onExportJson,
  onReportGenerated,
  initialReport = null,
  initialClaim = "",
  customizationSettings,
  onCustomizationChange
}) => {
  const [currentClaim, setCurrentClaim] = useState<string>(initialClaim);
  const [report, setReport] = useState<ReportData | null>(initialReport);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userProgress = useContext(UserProgressContext); // New

  useEffect(() => {
    setReport(initialReport);
  }, [initialReport]);

  useEffect(() => {
    setCurrentClaim(initialClaim);
  }, [initialClaim]);


  const handleClaimSubmit = useCallback(async (submittedClaim: string) => {
    setCurrentClaim(submittedClaim);
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const generatedReport = await generateValidationReport(submittedClaim);
      setReport(generatedReport);
      onReportGenerated(generatedReport); 
      // FIX: Change 'validationPerformed' to 'validationsPerformed'
      userProgress?.logAction('validationsPerformed'); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred while generating the report.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [onReportGenerated, userProgress]);

  return (
    <div className="space-y-8">
      <ClaimInputForm 
        onSubmit={handleClaimSubmit} 
        isLoading={isLoading}
        initialClaim={currentClaim} 
      />

      <ReportCustomizer
        settings={customizationSettings}
        onChange={onCustomizationChange}
        disabled={isLoading}
      />

      {isLoading && (
        <div className="mt-8 flex justify-center bg-brand-gray-900 p-6 rounded-lg shadow-card border border-brand-gray-700">
          <LoadingSpinner message="Generating your validation report..." size="lg" />
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card flex items-start">
          <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-lg">Error Generating Report</h3>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && report && (
        <ReportDisplay
          report={report}
          customizationSettings={customizationSettings}
          onExportPDF={onExportPDF}
          onGenerateBadge={onGenerateBadge}
          onExportDocx={onExportDocx}
          onExportJson={onExportJson}
        />
      )}

      {!isLoading && !report && !error && (
        <div className="mt-12 text-center p-8 bg-brand-gray-900 rounded-lg shadow-card border border-brand-gray-700">
          <InfoIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-brand-gray-100">Welcome to the Validator Tool</h2>
          <p className="text-brand-gray-400 mt-2 max-w-xl mx-auto">
            Enter a product claim above to get started. We'll analyze it using AI to provide insights,
            a confidence score, and marketing suggestions based on simulated research.
            You'll also earn points and badges for using the tool!
          </p>
        </div>
      )}
    </div>
  );
};

export default ValidatorPage;