
import React, { useState, useCallback } from 'react';
import Section from '../shared/Section';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import { getConsumerInsights } from '../../services/geminiService';
import type { ConsumerInsightsResponse } from '../../types';
import ConsumerInsightsInputForm from './ConsumerInsightsInputForm'; 
import ConsumerInsightsDisplay from './ConsumerInsightsDisplay'; 


const ConsumerInsightsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [insightsResult, setInsightsResult] = useState<ConsumerInsightsResponse | null>(null);

  // Image by Myriam Jessier on Unsplash (abstract data/network): https://unsplash.com/photos/eveI7MOcSmw
  const imageUrl = "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  const handleGetInsights = useCallback(async (productConceptOrClaim: string, targetAudience?: string) => {
    setIsLoading(true);
    setError(null);
    setInsightsResult(null);

    try {
      const result = await getConsumerInsights(productConceptOrClaim, targetAudience);
      setInsightsResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred while fetching consumer insights.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);


  return (
    <Section 
      title="Personalized Consumer Insights Engine"
      subtitle="Understand Your Audience Deeply with AI-Powered (Simulated) Sentiment Analysis"
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-3xl mx-auto space-y-8 p-2 md:p-4">
        <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={imageUrl} 
            alt="Team collaborating around data visualizations for consumer insights" 
            className="object-cover w-full h-48 md:h-64 opacity-90"
          />
        </div>

        <div className="p-4 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-lg text-yellow-200">
          <div className="flex items-start">
            <ShieldCheckIcon className="w-10 h-10 mr-3 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-yellow-300">Important Disclaimer & Purpose</h3>
              <p className="text-sm">
                This AI tool generates <span className="font-semibold">simulated consumer insights</span> for informational and brainstorming purposes ONLY.
                The analysis is based on general patterns and does <span className="font-semibold">NOT</span> reflect real market research or actual consumer opinions.
                Always conduct thorough, real-world consumer testing and market research for accurate data.
              </p>
            </div>
          </div>
        </div>
        
        <ConsumerInsightsInputForm onSubmit={handleGetInsights} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 flex justify-center bg-brand-gray-800 p-6 rounded-lg shadow-card border border-brand-gray-700">
            <LoadingSpinner message="AI is simulating consumer insights..." size="lg" />
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card flex items-start">
            <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Error Generating Insights</h3>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && insightsResult && (
          <ConsumerInsightsDisplay result={insightsResult} />
        )}

         {!isLoading && !insightsResult && !error && (
            <div className="mt-12 text-center p-8 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700">
                <InfoIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-brand-gray-100">Unlock Simulated Consumer Perspectives</h2>
                <p className="text-brand-gray-400 mt-2 max-w-xl mx-auto">
                    Enter a product concept, claim, or idea above. Optionally, describe your target audience.
                    Our AI will then simulate potential consumer reactions, sentiments, and key discussion points to help spark your marketing and product strategy.
                </p>
            </div>
        )}
      </div>
    </Section>
  );
};

export default ConsumerInsightsPage;
