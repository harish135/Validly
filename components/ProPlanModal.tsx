import React from 'react';
import Modal from './Modal';
import IconButton from './IconButton';
import CheckCircleIcon from './icons/CheckCircleIcon'; 
import SparklesIcon from './icons/SparklesIcon';

interface ProPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProPlanModal: React.FC<ProPlanModalProps> = ({ isOpen, onClose }) => {
  const proFeatures = [
    { name: 'AI Claim Validator with Full Reporting Suite', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Ingredient AI Analyser', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Healthcare News AI Aggregator', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Symptom AI Informational Insights', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Personalized Consumer Insights Engine', icon: <CheckCircleIcon className="text-green-400" /> }, // New
    { name: 'Regulatory & Compliance AI Assistant', icon: <CheckCircleIcon className="text-green-400" /> }, // New
    { name: 'Product Formulation AI Advisor', icon: <CheckCircleIcon className="text-green-400" /> }, // New
    { name: 'Detailed Competitor Claim Monitoring', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Developer API Access', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Unlimited Report Storage & History', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Team Collaboration & Sharing Features', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Advanced Export Options (DOCX, JSON)', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Custom Branding on Reports', icon: <CheckCircleIcon className="text-green-400" /> },
    { name: 'Priority Support Channels', icon: <CheckCircleIcon className="text-green-400" /> },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Unlock Validly Pro" 
      size="lg"
      showCloseButton={true} 
    >
      <div className="space-y-5">
        <div className="text-center">
          <SparklesIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <p className="text-brand-gray-300">
            Supercharge your claim validation workflow and gain a competitive edge with our Pro features.
          </p>
        </div>
        
        <ul className="space-y-2.5 columns-1 sm:columns-2 sm:gap-x-6">
          {proFeatures.map((feature, index) => (
            <li key={index} className="flex items-start mb-1 break-inside-avoid-column">
              {React.cloneElement(feature.icon as React.ReactElement<any>, { className: 'w-5 h-5 mr-2.5 mt-0.5 flex-shrink-0' })}
              <span className="text-brand-gray-200">{feature.name}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 text-center">
          <IconButton
            label="Explore Pro Plans (Coming Soon)"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-lg hover:shadow-xl"
            onClick={onClose} 
            icon={<SparklesIcon className="w-5 h-5"/>}
          />
          <p className="text-xs text-brand-gray-500 mt-3">
            Pricing and plan details will be announced shortly.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ProPlanModal;