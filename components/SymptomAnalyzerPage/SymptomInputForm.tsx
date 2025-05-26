import React, { useState } from 'react';
import IconButton from '../IconButton';
import SendIcon from '../icons/SendIcon';
import InfoIcon from '../icons/InfoIcon';

interface SymptomInputFormProps {
  onSubmit: (symptoms: string) => void;
  isLoading: boolean;
}

const SymptomInputForm: React.FC<SymptomInputFormProps> = ({ onSubmit, isLoading }) => {
  const [symptoms, setSymptoms] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onSubmit(symptoms.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700 space-y-4">
      <div>
        <label htmlFor="symptom-description" className="block text-md font-semibold text-brand-gray-100 mb-2">
          Describe Your Health Problem or Symptoms
        </label>
        <p className="text-xs text-brand-gray-400 mb-3 flex items-start">
            <InfoIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-brand-premium-blue"/>
            <span>Please be as detailed as possible. Include duration, intensity, and any related factors. For example: "Persistent headache on the left side for 2 weeks, worse in the mornings, with some nausea."</span>
        </p>
        <textarea
          id="symptom-description"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., Frequent stomach pain after meals for the last month..."
          className="w-full p-3 h-36 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500 resize-y"
          disabled={isLoading}
          aria-label="Health problem or symptom description"
        />
      </div>
      <div className="text-right">
        <IconButton 
          type="submit" 
          icon={<SendIcon />} 
          label="Get AI Insights"
          disabled={isLoading || !symptoms.trim()}
          variant="primary"
          size="md"
          className="px-6"
        />
      </div>
      {isLoading && <p className="text-sm text-brand-premium-blue mt-2 animate-subtle-pulse text-center">AI is thinking, please wait...</p>}
    </form>
  );
};

export default SymptomInputForm;