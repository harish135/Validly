

import React, { useState, useCallback, useContext } from 'react'; // Added useContext
import Section from '../shared/Section';
import IngredientInputForm from './IngredientInputForm';
import IngredientAnalysisDisplay from './IngredientAnalysisDisplay';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import { analyzeIngredient } from '../../services/geminiService';
import type { IngredientAnalysisResponse } from '../../types';
import BeakerIcon from '../icons/BeakerIcon';
import { UserProgressContext } from '../../contexts/UserProgressContext'; // New

interface IngredientAnalyserPageProps {
  // onUpgradeProClick: () => void; // Removed
}

const IngredientAnalyserPage: React.FC<IngredientAnalyserPageProps> = () => {
  const [analysisResult, setAnalysisResult] = useState<IngredientAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userProgress = useContext(UserProgressContext); // New

  // Image by Chyl Lo on Unsplash: https://unsplash.com/photos/green-leafed-plant-in-clear-glass-beaker-YJAfKZyHq3w (Subtle lab/nature vibe)
  const pageImageUrl = "https://im  ages.unsplash.com/photo-1611243058639-359904cf435d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1033&q=80";


  const handleSubmitIngredient = useCallback(async (ingredientName: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeIngredient(ingredientName);
      setAnalysisResult(result);
      // FIX: Change 'ingredientSearched' to 'ingredientsSearched'
      userProgress?.logAction('ingredientsSearched'); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred while analyzing the ingredient.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userProgress]);

  return (
    <Section 
      title="AI Ingredient Analyser (Informational Tool)"
      subtitle="Enter a supplement ingredient to get AI-generated (simulated) overview, common uses, research highlights, and considerations."
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-3xl mx-auto space-y-8 p-2 md:p-4">
        <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          {/* <img 
            src={pageImageUrl} 
            alt="Abstract representation of ingredient analysis or lab research" 
            className="object-cover w-full h-48 md:h-64 opacity-90"
          /> */}
        </div>

        <div className="p-4 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-lg text-yellow-200">
          <div className="flex items-start">
            <InfoIcon className="w-10 h-10 mr-3 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-yellow-300">Important Disclaimer</h3>
              <p className="text-sm">
                This tool provides AI-generated information for educational purposes ONLY. It is NOT medical advice,
                cannot diagnose or treat conditions, and should NOT be used to guide supplementation or health decisions. 
                Always consult a qualified healthcare professional or registered dietitian.
              </p>
            </div>
          </div>
        </div>
        
        <IngredientInputForm onSubmit={handleSubmitIngredient} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 flex justify-center bg-brand-gray-800 p-6 rounded-lg shadow-card border border-brand-gray-700">
            <LoadingSpinner message="AI is analyzing the ingredient..." size="lg" />
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
          <IngredientAnalysisDisplay result={analysisResult} />
        )}

         {!isLoading && !analysisResult && !error && (
            <div className="mt-12 text-center p-8 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700">
                <BeakerIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-brand-gray-100">Explore Supplement Ingredients</h2>
                <p className="text-brand-gray-400 mt-2 max-w-xl mx-auto">
                    Enter an ingredient name (e.g., "Ashwagandha", "Curcumin", "Vitamin D3") in the form above. 
                    Our AI will provide a (simulated) informational summary. You'll earn points for each search!
                </p>
            </div>
        )}
      </div>
    </Section>
  );
};

export default IngredientAnalyserPage;