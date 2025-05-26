import React, { useState, useEffect } from 'react';
import SendIcon from './icons/SendIcon';
import IconButton from './IconButton';

interface ClaimInputFormProps {
  onSubmit: (claim: string) => void;
  isLoading: boolean;
  initialClaim?: string; // For pre-filling from history
}

const ClaimInputForm: React.FC<ClaimInputFormProps> = ({ onSubmit, isLoading, initialClaim = '' }) => {
  const [claim, setClaim] = useState<string>(initialClaim);

  useEffect(() => {
    setClaim(initialClaim);
  }, [initialClaim]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim()) {
      onSubmit(claim.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-brand-gray-900 rounded-lg shadow-card border border-brand-gray-700">
      <h2 className="text-xl font-semibold text-brand-gray-100 mb-2">Validate Your Product Claim</h2>
      <p className="text-sm text-brand-gray-400 mb-4">
        Enter a product claim (e.g., "Ashwagandha reduces stress") to generate a science-backed validation report.
      </p>
      <div className="flex items-stretch space-x-3">
        <input
          type="text"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="e.g., Vitamin C boosts immunity"
          className="flex-grow p-3 bg-brand-gray-800 border border-brand-gray-700 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500"
          disabled={isLoading}
          aria-label="Product claim input"
        />
        <IconButton 
          type="submit" 
          icon={<SendIcon />} 
          label="Validate"
          disabled={isLoading || !claim.trim()}
          variant="primary"
          size="md"
          className="px-6 h-auto" // Ensure button height matches input
        />
      </div>
      {isLoading && <p className="text-sm text-brand-premium-blue mt-3 animate-subtle-pulse">Analyzing your claim, please wait...</p>}
    </form>
  );
};

export default ClaimInputForm;