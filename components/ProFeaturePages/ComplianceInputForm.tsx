
import React, { useState } from 'react';
import IconButton from '../IconButton';
import SendIcon from '../icons/SendIcon';
import InfoIcon from '../icons/InfoIcon';

interface ComplianceInputFormProps {
  onSubmit: (marketingCopy: string) => void;
  isLoading: boolean;
}

const ComplianceInputForm: React.FC<ComplianceInputFormProps> = ({ onSubmit, isLoading }) => {
  const [marketingCopy, setMarketingCopy] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (marketingCopy.trim()) {
      onSubmit(marketingCopy.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700 space-y-4">
      <div>
        <label htmlFor="marketing-copy" className="block text-md font-semibold text-brand-gray-100 mb-1">
          Marketing Copy or Product Claims
        </label>
        <p className="text-xs text-brand-gray-400 mb-2 flex items-start">
            <InfoIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-brand-premium-blue"/>
            <span>Paste the text you want the AI to analyze for (simulated) compliance considerations. The more complete the copy, the better the (simulated) feedback.</span>
        </p>
        <textarea
          id="marketing-copy"
          value={marketingCopy}
          onChange={(e) => setMarketingCopy(e.target.value)}
          placeholder="e.g., Our new SuperBoost supplement cures fatigue and enhances energy levels naturally!"
          className="w-full p-3 h-40 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500 resize-y"
          disabled={isLoading}
          aria-label="Marketing copy or product claims"
          required
        />
      </div>
      
      <div className="text-right pt-2">
        <IconButton 
          type="submit" 
          icon={<SendIcon />} 
          label="Analyze Copy"
          disabled={isLoading || !marketingCopy.trim()}
          variant="primary"
          size="md"
          className="px-6"
        />
      </div>
      {isLoading && <p className="text-sm text-brand-premium-blue mt-1 animate-subtle-pulse text-center">AI is reviewing your copy...</p>}
    </form>
  );
};

export default ComplianceInputForm;
