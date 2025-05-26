
import React, { useState } from 'react';
import IconButton from '../IconButton';
import SendIcon from '../icons/SendIcon';
import InfoIcon from '../icons/InfoIcon';
import PlusCircleIcon from '../icons/PlusCircleIcon'; // For optional fields
import MinusCircleIcon from '../icons/MinusCircleIcon'; // For optional fields

interface FormulationInputFormProps {
  onSubmit: (query: string, includeIngredients?: string, excludeIngredients?: string) => void;
  isLoading: boolean;
}

const FormulationInputForm: React.FC<FormulationInputFormProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState<string>('');
  const [includeIngredients, setIncludeIngredients] = useState<string>('');
  const [excludeIngredients, setExcludeIngredients] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim(), includeIngredients.trim() || undefined, excludeIngredients.trim() || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700 space-y-5">
      <div>
        <label htmlFor="formulation-query" className="block text-md font-semibold text-brand-gray-100 mb-1">
          Product Category, Desired Effect, or Core Concept
        </label>
        <p className="text-xs text-brand-gray-400 mb-2 flex items-start">
            <InfoIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-brand-premium-blue"/>
            <span>Be specific about what you're looking for. E.g., "Natural sleep aid", "Energy booster for athletes", "Cognitive enhancer with nootropics", "Anti-aging skin serum".</span>
        </p>
        <input
          id="formulation-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Natural supplement for stress relief"
          className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500"
          disabled={isLoading}
          aria-label="Product category, desired effect, or core concept"
          required
        />
      </div>
      
      <div>
        <label htmlFor="include-ingredients" className="block text-md font-semibold text-brand-gray-100 mb-1">
            Key Ingredients to Include (Optional)
        </label>
        <p className="text-xs text-brand-gray-400 mb-2 flex items-start">
            <PlusCircleIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-green-400"/>
            <span>List any specific ingredients you'd like the AI to consider incorporating (comma-separated). E.g., "Ashwagandha, L-Theanine, Magnesium".</span>
        </p>
        <input
          id="include-ingredients"
          type="text"
          value={includeIngredients}
          onChange={(e) => setIncludeIngredients(e.target.value)}
          placeholder="e.g., Rhodiola, Vitamin B complex"
          className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500"
          disabled={isLoading}
          aria-label="Key ingredients to include"
        />
      </div>

      <div>
        <label htmlFor="exclude-ingredients" className="block text-md font-semibold text-brand-gray-100 mb-1">
            Ingredients to Exclude (Optional)
        </label>
        <p className="text-xs text-brand-gray-400 mb-2 flex items-start">
            <MinusCircleIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-red-400"/>
            <span>List any ingredients the AI should try to avoid (comma-separated). E.g., "Caffeine, Sugar, Artificial sweeteners".</span>
        </p>
        <input
          id="exclude-ingredients"
          type="text"
          value={excludeIngredients}
          onChange={(e) => setExcludeIngredients(e.target.value)}
          placeholder="e.g., Gluten, Soy, Common allergens"
          className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500"
          disabled={isLoading}
          aria-label="Ingredients to exclude"
        />
      </div>
      
      <div className="text-right pt-2">
        <IconButton 
          type="submit" 
          icon={<SendIcon />} 
          label="Get Formulation Ideas"
          disabled={isLoading || !query.trim()}
          variant="primary"
          size="md"
          className="px-6"
        />
      </div>
      {isLoading && <p className="text-sm text-brand-premium-blue mt-1 animate-subtle-pulse text-center">AI is crafting formulation concepts...</p>}
    </form>
  );
};

export default FormulationInputForm;
