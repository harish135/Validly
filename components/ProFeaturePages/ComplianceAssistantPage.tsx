
import React, { useState, useCallback } from 'react';
import Section from '../shared/Section';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon'; // General disclaimer icon
import ScaleIcon from '../icons/ScaleIcon'; // Page specific icon
import { analyzeMarketingCopy } from '../../services/geminiService';
import type { ComplianceAnalysisResponse } from '../../types';
import ComplianceInputForm from './ComplianceInputForm';
import ComplianceAnalysisDisplay from './ComplianceAnalysisDisplay';

const ComplianceAssistantPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ComplianceAnalysisResponse | null>(null);

  // Image by Scott Graham on Unsplash (legal books/gavel): https://unsplash.com/photos/OQMZwNd3ThU
  const imageUrl = "https://images.unsplash.com/photo-1589216532372-1c2a36790049?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  const handleAnalyzeCopy = useCallback(async (marketingCopy: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeMarketingCopy(marketingCopy);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred while analyzing marketing copy.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Section 
      title="Regulatory & Compliance AI Assistant"
      subtitle="Navigate Marketing Regulations with AI-Driven (Simulated) Guidance"
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-3xl mx-auto space-y-8 p-2 md:p-4">
        <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          {/* <img 
            src={imageUrl} 
            alt="Gavel and legal books representing compliance and regulation" 
            className="object-cover w-full h-48 md:h-64 opacity-90"
          /> */}
        </div>

        <div className="p-4 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-lg text-yellow-200">
          <div className="flex items-start">
            <ShieldCheckIcon className="w-10 h-10 mr-3 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-yellow-300">Important Disclaimer & Purpose</h3>
              <p className="text-sm">
                This AI tool provides <span className="font-semibold">SIMULATED compliance feedback</span> on marketing copy for informational and brainstorming purposes ONLY.
                It is <span className="font-semibold">NOT legal or regulatory advice</span> and does NOT guarantee compliance with any laws.
                Always consult qualified legal and regulatory professionals.
              </p>
            </div>
          </div>
        </div>
        
        <ComplianceInputForm onSubmit={handleAnalyzeCopy} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 flex justify-center bg-brand-gray-800 p-6 rounded-lg shadow-card border border-brand-gray-700">
            <LoadingSpinner message="AI is analyzing your marketing copy..." size="lg" />
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card flex items-start">
            <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Error Analyzing Copy</h3>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && analysisResult && (
          <ComplianceAnalysisDisplay result={analysisResult} />
        )}

         {!isLoading && !analysisResult && !error && (
            <div className="mt-12 text-center p-8 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700">
                <ScaleIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-brand-gray-100">Get Simulated Compliance Feedback</h2>
                <p className="text-brand-gray-400 mt-2 max-w-xl mx-auto">
                    Paste your marketing copy or product claims into the form above. 
                    Our AI will provide (simulated) feedback on potential compliance flags and offer suggestions for improvement, based on general wellness advertising principles.
                </p>
            </div>
        )}
      </div>
    </Section>
  );
};

export default ComplianceAssistantPage;
