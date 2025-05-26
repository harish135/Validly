import React from 'react';
import type { IngredientAnalysisResponse, IngredientBenefitOrUse, IngredientConsideration } from '../../types';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import LightBulbIcon from '../icons/LightBulbIcon'; // For uses/benefits
import DocumentTextIcon from '../icons/DocumentTextIcon'; // For overview
import ListBulletIcon from '../icons/ListBulletIcon'; // For research highlights
import AcademicCapIcon from '../icons/AcademicCapIcon'; // For considerations


interface IngredientAnalysisDisplayProps {
  result: IngredientAnalysisResponse;
}

interface InfoSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  accentBorder?: boolean;
  animationDelay?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, icon, children, className = '', titleClassName = '', accentBorder, animationDelay }) => (
  <div 
    className={`bg-brand-gray-800 p-5 rounded-lg shadow-card border border-brand-gray-700 ${accentBorder ? 'border-t-2 border-t-brand-premium-blue pt-4' : ''} ${className} animate-premium-slide-in-up`}
    style={{ animationDelay }}
  >
    <div className="flex items-center text-brand-gray-300 mb-3">
      {React.cloneElement(icon as React.ReactElement<any>, { className: `w-5 h-5 ${titleClassName || 'text-brand-premium-blue'}` })}
      <h3 className={`ml-2 text-lg font-semibold ${titleClassName || 'text-brand-gray-100'}`}>{title}</h3>
    </div>
    <div className="text-sm text-brand-gray-300 leading-relaxed space-y-2"> {/* Increased space-y */}
      {children}
    </div>
  </div>
);

const getStrengthColor = (strength?: IngredientBenefitOrUse['simulatedEvidenceStrength']): string => {
  switch (strength) {
    case 'Strong': return 'text-green-400';
    case 'Moderate': return 'text-yellow-400';
    case 'Limited': return 'text-orange-400'; 
    case 'Emerging': return 'text-blue-400'; 
    case 'Traditional Use Only': return 'text-purple-400'; 
    default: return 'text-brand-gray-400';
  }
}


const IngredientAnalysisDisplay: React.FC<IngredientAnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="mt-8 p-4 md:p-6 bg-brand-gray-850 rounded-lg shadow-card space-y-6 border border-brand-gray-700 animate-premium-slide-in-up"> {/* Main container animation */}
      <h2 className="text-2xl font-bold text-brand-gray-50 text-center">AI Insights for: <span className="text-brand-premium-blue">{result.ingredientName}</span></h2>
      
      <div className="p-4 bg-red-800 bg-opacity-80 border-2 border-red-600 rounded-lg text-red-100">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-10 h-10 mr-3 text-red-200 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-red-50">VERY IMPORTANT DISCLAIMER</h3>
            <p className="text-sm text-red-100 leading-relaxed">
              {result.criticalDisclaimer || "This AI-generated information is for educational purposes ONLY and is NOT medical advice. It should NOT be used for self-diagnosis, treatment, or as a guide for supplementation. Always consult a qualified healthcare professional or registered dietitian."}
            </p>
          </div>
        </div>
      </div>

      <InfoSection title="Overview" icon={<DocumentTextIcon />} accentBorder animationDelay="100ms">
        <p>{result.overview}</p>
      </InfoSection>

      {result.simulatedCommonUsesOrBenefits && result.simulatedCommonUsesOrBenefits.length > 0 && (
        <InfoSection title="Simulated Common Uses or Benefits" icon={<LightBulbIcon />} accentBorder animationDelay="200ms">
          <ul className="space-y-1.5">
            {result.simulatedCommonUsesOrBenefits.map((item, index) => (
              <li key={index} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-brand-premium-blue mr-2 mt-1 flex-shrink-0">&#8226;</span>
                <span>{item.point} 
                  {item.simulatedEvidenceStrength && 
                    <span className={`ml-1 text-xs font-medium opacity-80 ${getStrengthColor(item.simulatedEvidenceStrength)}`}>
                        (Simulated Strength: {item.simulatedEvidenceStrength})
                    </span>}
                </span>
              </li>
            ))}
          </ul>
        </InfoSection>
      )}

      {result.simulatedResearchHighlights && result.simulatedResearchHighlights.length > 0 && (
        <InfoSection title="Simulated Research Highlights" icon={<ListBulletIcon />} accentBorder animationDelay="300ms">
           <p className="text-xs text-brand-gray-400 mb-2">These are general themes from AI-simulated knowledge, not specific study outcomes.</p>
          <ul className="space-y-1.5">
            {result.simulatedResearchHighlights.map((highlight, index) => (
              <li key={index} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                 <span className="text-green-400 mr-2 mt-1 flex-shrink-0">&#10003;</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </InfoSection>
      )}

      {result.simulatedConsiderations && result.simulatedConsiderations.length > 0 && (
        <InfoSection title="Simulated Considerations & Notes" icon={<AcademicCapIcon />} accentBorder className="bg-brand-gray-850" animationDelay="400ms">
           <p className="text-xs text-brand-gray-400 mb-2">These are general informational points and not exhaustive. Always consult professionals.</p>
            {result.simulatedConsiderations.map((item, index) => (
                 <div key={index} className="p-2 bg-brand-gray-800 rounded border border-brand-gray-700 mt-2 animate-premium-slide-in-left" style={{ animationDelay: `${index * 75}ms` }}>
                    <p className="font-semibold text-brand-gray-100">{item.aspect}:</p>
                    <p className="text-brand-gray-300 ml-2">{item.detail}</p>
                </div>
            ))}
        </InfoSection>
      )}
      
       <div className="mt-6 text-center text-xs text-brand-gray-500">
            <p>This analysis for "{result.ingredientName}" was generated by AI based on general knowledge patterns and is not a substitute for professional advice.</p>
      </div>
    </div>
  );
};

export default IngredientAnalysisDisplay;