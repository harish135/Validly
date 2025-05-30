import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import ClaimInputForm from '../ClaimInputForm';
import ReportDisplay from '../ReportDisplay';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import ReportCustomizer from './ReportCustomizer';
import type { ReportData, CustomizationSettings } from '../../types';
import { generateValidationReport } from '../../services/geminiService';
import { UserProgressContext } from '../../contexts/UserProgressContext';

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
  const hasInitializedFromPropsRef = useRef(false);

  const [currentClaim, setCurrentClaim] = useState<string>(() => {
    console.log('ValidatorPage: useState for currentClaim, initialValue from prop:', initialClaim ?? '');
    return initialClaim ?? '';
  });

  const [report, setReport] = useState<ReportData | null>(() => {
    console.log('ValidatorPage: useState for report, initialValue from prop:', initialReport);
    return initialReport;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userProgress = useContext(UserProgressContext);
  const submissionInProgressRef = useRef(false);

  // Effect to initialize state from props ONLY ONCE on initial mount
  // or if the component is remounted and props are different.
  useEffect(() => {
    // This log helps see if this effect is running due to a remount
    console.log(`ValidatorPage: Mount/Prop Effect. Initial Report: ${initialReport ? 'Exists' : 'null'}, Initial Claim: "${initialClaim}"`);

    // Only set from props if they haven't been set by this effect before in this instance,
    // OR if the incoming props are genuinely different from the current state
    // (e.g. navigating to view a different report).
    if (!hasInitializedFromPropsRef.current || initialReport !== report || initialClaim !== currentClaim) {
        console.log('ValidatorPage: Applying initial props to state.');
        if (initialReport !== report) setReport(initialReport);
        if (initialClaim !== currentClaim) setCurrentClaim(initialClaim ?? ''); // Ensure currentClaim is also updated
        hasInitializedFromPropsRef.current = true;
    }
  }, [initialReport, initialClaim]); // Re-run if these specific props change after mount.

  const handleClaimSubmit = useCallback(async (submittedClaim: string) => {
    console.log('ENTERED handleClaimSubmit. submissionInProgressRef.current:', submissionInProgressRef.current, 'Claim:', submittedClaim);

    if (submissionInProgressRef.current) {
      console.warn("handleClaimSubmit: Submission already in progress. IGNORING CALL.");
      return;
    }

    console.log('handleClaimSubmit: SETTING submissionInProgressRef to true');
    submissionInProgressRef.current = true;

    console.log('handleClaimSubmit: Calling setCurrentClaim (for this submission):', submittedClaim);
    setCurrentClaim(submittedClaim); // Update current claim based on this submission
    console.log('handleClaimSubmit: Calling setIsLoading: true');
    setIsLoading(true);
    console.log('handleClaimSubmit: Calling setError: null');
    setError(null);
    console.log('handleClaimSubmit: Calling setReport: null');
    setReport(null); // Clear previous report for this new submission

    try {
      console.log('handleClaimSubmit: TRY block - Calling generateValidationReport...');
      const generatedReport = await generateValidationReport(submittedClaim);
      console.log('handleClaimSubmit: TRY block - Generated report:', generatedReport ? 'Exists' : 'null', generatedReport);

      console.log('handleClaimSubmit: TRY block - Calling setReport with generatedReport');
      setReport(generatedReport);
      console.log('handleClaimSubmit: TRY block - Calling onReportGenerated');
      onReportGenerated(generatedReport);
      console.log('handleClaimSubmit: TRY block - Calling userProgress.logAction');
      userProgress?.logAction('validationsPerformed');
      console.log('handleClaimSubmit: TRY block - userProgress.logAction DONE');

    } catch (err) {
      console.error('handleClaimSubmit: CATCH block - Error:', err);
      if (err instanceof Error) {
        console.log('handleClaimSubmit: CATCH block - Calling setError with err.message');
        setError(err.message || 'An unknown error occurred while generating the report.');
      } else {
        console.log('handleClaimSubmit: CATCH block - Calling setError with generic message');
        setError('An unknown error occurred.');
      }
      console.log('handleClaimSubmit: CATCH block - Calling setReport: null');
      setReport(null);
    } finally {
      console.log('handleClaimSubmit: FINALLY block - Calling setIsLoading: false');
      setIsLoading(false);
      console.log('handleClaimSubmit: FINALLY block - SETTING submissionInProgressRef to false');
      submissionInProgressRef.current = false;
    }
    console.log('EXITING handleClaimSubmit');
  }, [onReportGenerated, userProgress]); // Dependencies for useCallback

  console.log(`ValidatorPage RENDER: isLoading: ${isLoading}, report: ${report ? 'Exists' : 'null'}, error: ${error ? 'Exists' : 'null'}, currentClaim: "${currentClaim}"`);

  return (
    <div className="space-y-8">
      <ClaimInputForm
        onSubmit={handleClaimSubmit}
        isLoading={isLoading}
        initialClaim={currentClaim} // Use the internal currentClaim for the form
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

      {error && !isLoading && (
        <div className="mt-8 p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card flex items-start">
          <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-lg">Error Generating Report</h3>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && report && !error && (
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