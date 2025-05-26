import React, { useState } from 'react';
import IconButton from '../IconButton';
import BeakerIcon from '../icons/BeakerIcon'; // Using BeakerIcon for submit button
import InfoIcon from '../icons/InfoIcon';

interface IngredientInputFormProps {
  onSubmit: (ingredientName: string) => void;
  isLoading: boolean;
}

const IngredientInputForm: React.FC<IngredientInputFormProps> = ({ onSubmit, isLoading }) => {
  const [ingredientName, setIngredientName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredientName.trim()) {
      onSubmit(ingredientName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700 space-y-4">
      <div>
        <label htmlFor="ingredient-name" className="block text-md font-semibold text-brand-gray-100 mb-2">
          Enter Supplement Ingredient Name
        </label>
         <p className="text-xs text-brand-gray-400 mb-3 flex items-start">
            <InfoIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-brand-premium-blue"/>
            <span>E.g., "Ashwagandha", "Curcumin", "Melatonin", "Vitamin C".</span>
        </p>
        <input
          id="ingredient-name"
          type="text"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          placeholder="e.g., Ashwagandha"
          className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500"
          disabled={isLoading}
          aria-label="Supplement ingredient name"
        />
      </div>
      <div className="text-right">
        <IconButton 
          type="submit" 
          icon={<BeakerIcon />} 
          label="Analyze Ingredient"
          disabled={isLoading || !ingredientName.trim()}
          variant="primary"
          size="md"
          className="px-6"
        />
      </div>
      {isLoading && <p className="text-sm text-brand-premium-blue mt-2 animate-subtle-pulse text-center">AI is researching, please wait...</p>}
    </form>
  );
};

export default IngredientInputForm;