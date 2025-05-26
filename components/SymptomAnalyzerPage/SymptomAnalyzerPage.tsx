
import React, { useState, useCallback } from 'react';
import Section from '../shared/Section';
import SymptomInputForm from './SymptomInputForm';
import SymptomAnalysisDisplay from './SymptomAnalysisDisplay';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
// import SparklesIcon from '../icons/SparklesIcon'; // No longer needed for upgrade button
// import IconButton from '../IconButton'; // No longer needed for upgrade button
import { analyzeHealthSymptoms } from '../../services/geminiService';
import type { SymptomAnalysisResponse } from '../../types';

interface SymptomAnalyzerPageProps {
  // onUpgradeProClick: () => void; // Removed
}

const SymptomAnalyzerPage: React.FC<SymptomAnalyzerPageProps> = (/*{ onUpgradeProClick }*/) => {
  const [userInput, setUserInput] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Image by National Cancer Institute on Unsplash: https://unsplash.com/photos/L8tWZT4CcVQ (Generic medical/tech)
  const pageImageUrl = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";


  const handleSubmitSymptom = useCallback(async (symptoms: string) => {
    setUserInput(symptoms);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeHealthSymptoms(symptoms);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred while analyzing symptoms.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Section 
      title="AI Symptom Insights (Informational Tool)"
      subtitle="Describe your health concerns to get AI-generated informational insights and potential specialist recommendations."
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-3xl mx-auto space-y-8 p-2 md:p-4">
        <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={pageImageUrl} 
            alt="Healthcare professional using technology for analysis" 
            className="object-cover w-full h-48 md:h-64 opacity-90"
          />
        </div>

        <div className="p-4 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-lg text-yellow-200">
          <div className="flex items-start">
            <InfoIcon className="w-10 h-10 mr-3 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-yellow-300">Important Disclaimer</h3>
              <p className="text-sm ">
                This tool provides AI-generated information for educational purposes ONLY. It is NOT medical advice,
                cannot diagnose conditions, and should NOT be used for self-treatment. Always consult a qualified
                healthcare professional for any health concerns.
              </p>
            </div>
          </div>
        </div>
        
        {/* "Try for free" button removed
        <div className="text-center mb-6">
            <IconButton
                label="Try Symptom AI Free"
                onClick={onUpgradeProClick}
                variant="ghost"
                size="sm"
                icon={<SparklesIcon className="w-4 h-4 text-yellow-400"/>}
                className="text-yellow-300 hover:text-yellow-200"
            />
        </div>
        */}

        <SymptomInputForm onSubmit={handleSubmitSymptom} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 flex justify-center bg-brand-gray-800 p-6 rounded-lg shadow-card border border-brand-gray-700">
            <LoadingSpinner message="Analyzing your symptoms with AI..." size="lg" />
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card flex items-start">
            <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Error Getting Insights</h3>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && analysisResult && (
          <SymptomAnalysisDisplay result={analysisResult} />
        )}
         {!isLoading && !analysisResult && !error && (
            <div className="mt-12 text-center p-8 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700">
                <InfoIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-brand-gray-100">Get AI-Powered Health Insights</h2>
                <p className="text-brand-gray-400 mt-2 max-w-xl mx-auto">
                    Describe your symptoms or health problem in the form above. Our AI will provide informational insights,
                    potential areas of interest (not diagnoses), and suggest relevant medical specialists to consult.
                </p>
            </div>
        )}
      </div>
    </Section>
  );
};

export default SymptomAnalyzerPage;