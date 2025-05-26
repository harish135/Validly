
import React, { useState, useCallback } from 'react';
import Section from '../shared/Section';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon'; // General disclaimer icon
import PuzzlePieceIcon from '../icons/PuzzlePieceIcon'; // Page specific icon
import { getFormulationIdeas } from '../../services/geminiService';
import type { FormulationAdvisorResponse } from '../../types';
import FormulationInputForm from './FormulationInputForm';
import FormulationIdeasDisplay from './FormulationIdeasDisplay';

const FormulationAdvisorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formulationResult, setFormulationResult] = useState<FormulationAdvisorResponse | null>(null);

  // Image by Louis Reed on Unsplash (modern lab/innovation): https://unsplash.com/photos/pwcKF7L4-no
  const imageUrl = "https://images.unsplash.com/photo-1532187863486-abf9db50d0d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  const handleGetFormulationIdeas = useCallback(async (query: string, includeIngredients?: string, excludeIngredients?: string) => {
    setIsLoading(true);
    setError(null);
    setFormulationResult(null);

    try {
      const result = await getFormulationIdeas(query, includeIngredients, excludeIngredients);
      setFormulationResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred while generating formulation ideas.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Section 
      title="Product Formulation AI Advisor"
      subtitle="Innovate Your Next Product with AI-Generated (Simulated) Formulation Ideas"
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-3xl mx-auto space-y-8 p-2 md:p-4">
        <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={imageUrl} 
            alt="Modern laboratory setting with beakers, symbolizing product formulation and innovation" 
            className="object-cover w-full h-48 md:h-64 opacity-90"
          />
        </div>

        <div className="p-4 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-lg text-yellow-200">
          <div className="flex items-start">
            <ShieldCheckIcon className="w-10 h-10 mr-3 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-yellow-300">Important Disclaimer & Purpose</h3>
              <p className="text-sm">
                This AI tool generates <span className="font-semibold">SIMULATED formulation ideas</span> for informational and brainstorming purposes ONLY.
                These are <span className="font-semibold">NOT scientifically validated or tested formulations.</span>
                Developing any new product requires extensive R&D, safety testing, and regulatory compliance. Always consult with qualified scientists and experts.
              </p>
            </div>
          </div>
        </div>
        
        <FormulationInputForm onSubmit={handleGetFormulationIdeas} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 flex justify-center bg-brand-gray-800 p-6 rounded-lg shadow-card border border-brand-gray-700">
            <LoadingSpinner message="AI is brainstorming formulation ideas..." size="lg" />
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card flex items-start">
            <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Error Generating Ideas</h3>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && formulationResult && (
          <FormulationIdeasDisplay result={formulationResult} />
        )}

         {!isLoading && !formulationResult && !error && (
            <div className="mt-12 text-center p-8 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700">
                <PuzzlePieceIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-brand-gray-100">Discover AI-Powered Formulation Concepts</h2>
                <p className="text-brand-gray-400 mt-2 max-w-xl mx-auto">
                    Describe a product category, desired health effect, or key ingredients you're interested in. 
                    Our AI will then generate (simulated) novel formulation ideas, ingredient suggestions, and potential unique selling points to inspire your R&D.
                </p>
            </div>
        )}
      </div>
    </Section>
  );
};

export default FormulationAdvisorPage;
