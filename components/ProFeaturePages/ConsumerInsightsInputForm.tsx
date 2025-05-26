
import React, { useState } from 'react';
import IconButton from '../IconButton';
import SendIcon from '../icons/SendIcon';
import InfoIcon from '../icons/InfoIcon';

interface ConsumerInsightsInputFormProps {
  onSubmit: (productConceptOrClaim: string, targetAudience?: string) => void;
  isLoading: boolean;
}

const ConsumerInsightsInputForm: React.FC<ConsumerInsightsInputFormProps> = ({ onSubmit, isLoading }) => {
  const [productConceptOrClaim, setProductConceptOrClaim] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productConceptOrClaim.trim()) {
      onSubmit(productConceptOrClaim.trim(), targetAudience.trim() || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700 space-y-4">
      <div>
        <label htmlFor="product-concept" className="block text-md font-semibold text-brand-gray-100 mb-1">
          Product Concept, Claim, or Idea
        </label>
        <p className="text-xs text-brand-gray-400 mb-2 flex items-start">
            <InfoIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-brand-premium-blue"/>
            <span>Describe the product, service, or marketing claim you want to get simulated consumer insights for. Be specific.</span>
        </p>
        <textarea
          id="product-concept"
          value={productConceptOrClaim}
          onChange={(e) => setProductConceptOrClaim(e.target.value)}
          placeholder="e.g., A new organic energy drink with adaptogens for sustained energy without jitters."
          className="w-full p-3 h-32 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500 resize-y"
          disabled={isLoading}
          aria-label="Product concept or claim"
          required
        />
      </div>
      <div>
        <label htmlFor="target-audience" className="block text-md font-semibold text-brand-gray-100 mb-1">
          Target Audience Description (Optional)
        </label>
         <p className="text-xs text-brand-gray-400 mb-2 flex items-start">
            <InfoIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-brand-premium-blue"/>
            <span>Providing details about your intended audience can help the AI generate more relevant simulated insights.</span>
        </p>
        <input
          id="target-audience"
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="e.g., Health-conscious millennials, busy parents, athletes."
          className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500"
          disabled={isLoading}
          aria-label="Target audience description"
        />
      </div>
      <div className="text-right pt-2">
        <IconButton 
          type="submit" 
          icon={<SendIcon />} 
          label="Get AI Insights"
          disabled={isLoading || !productConceptOrClaim.trim()}
          variant="primary"
          size="md"
          className="px-6"
        />
      </div>
      {isLoading && <p className="text-sm text-brand-premium-blue mt-1 animate-subtle-pulse text-center">AI is gathering simulated insights...</p>}
    </form>
  );
};

export default ConsumerInsightsInputForm;
