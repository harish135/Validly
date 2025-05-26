import React from 'react';
import type { SymptomAnalysisResponse } from '../../types';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import LightBulbIcon from '../icons/LightBulbIcon';
import AcademicCapIcon from '../icons/AcademicCapIcon';
import DocumentTextIcon from '../icons/DocumentTextIcon';

interface SymptomAnalysisDisplayProps {
  result: SymptomAnalysisResponse;
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
    <div className="text-sm text-brand-gray-300 leading-relaxed space-y-1.5">
      {children}
    </div>
  </div>
);

const SymptomAnalysisDisplay: React.FC<SymptomAnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="mt-8 p-4 md:p-6 bg-brand-gray-850 rounded-lg shadow-card space-y-6 border border-brand-gray-700 animate-premium-slide-in-up"> {/* Main container animation */}
      <h2 className="text-2xl font-bold text-brand-gray-50 text-center">AI Informational Insights</h2>
      
      <div className="p-4 bg-red-800 bg-opacity-80 border-2 border-red-600 rounded-lg text-red-100">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-10 h-10 mr-3 text-red-200 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-red-50">VERY IMPORTANT DISCLAIMER</h3>
            <p className="text-sm text-red-100 leading-relaxed">
              {result.criticalDisclaimer || "This AI-generated information is for educational purposes ONLY and is NOT medical advice. It should NOT be used for self-diagnosis or treatment. Always consult a qualified healthcare professional for any health concerns."}
            </p>
          </div>
        </div>
      </div>

      <InfoSection title="AI's Understanding of Your Input" icon={<DocumentTextIcon />} accentBorder animationDelay="100ms">
        <p className="italic">"{result.aiUnderstandingOfProblem}"</p>
      </InfoSection>

      {result.simulatedPotentialAreas && result.simulatedPotentialAreas.length > 0 && (
        <InfoSection title="Simulated Potential Areas of Interest" icon={<InfoIcon />} titleClassName="text-yellow-400" accentBorder animationDelay="200ms">
            <p className="text-xs text-brand-gray-400 mb-2">These are broad, general areas the AI has identified based on patterns and are NOT diagnoses. Many factors influence health.</p>
          <ul>
            {result.simulatedPotentialAreas.map((area, index) => (
              <li key={index} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-yellow-400 mr-2 mt-1 flex-shrink-0">&#8226;</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </InfoSection>
      )}

      {result.generalRecommendations && result.generalRecommendations.length > 0 && (
        <InfoSection title="General Recommendations" icon={<LightBulbIcon />} accentBorder animationDelay="300ms">
           <p className="text-xs text-brand-gray-400 mb-2">These are general, non-prescriptive suggestions.</p>
          <ul>
            {result.generalRecommendations.map((rec, index) => (
              <li key={index} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-green-400 mr-2 mt-1 flex-shrink-0">&#10003;</span>
                <span>{rec}</span>
                </li>
            ))}
          </ul>
        </InfoSection>
      )}

      <InfoSection title="Suggested Specialist for Consultation" icon={<AcademicCapIcon />} className="bg-brand-premium-blue bg-opacity-10 border-brand-premium-blue" accentBorder animationDelay="400ms">
        <h4 className="text-xl font-semibold text-brand-premium-blue">
          {result.recommendedSpecialist.specialistName || result.recommendedSpecialist.departmentName}
        </h4>
        {result.recommendedSpecialist.specialistName && result.recommendedSpecialist.departmentName !== result.recommendedSpecialist.specialistName && (
            <p className="text-sm text-brand-blue-300">({result.recommendedSpecialist.departmentName} Department)</p>
        )}
        <p className="mt-2 text-brand-gray-300">{result.recommendedSpecialist.simulatedReasoning}</p>
        <p className="mt-3 font-semibold text-brand-blue-200">
          Please remember to consult this type of specialist or your general practitioner for an accurate assessment.
        </p>
      </InfoSection>
      
       <div className="mt-6 text-center text-xs text-brand-gray-500">
            <p>This analysis was generated by AI based on the information you provided and general knowledge patterns. It is not exhaustive and does not replace professional medical evaluation.</p>
      </div>
    </div>
  );
};

export default SymptomAnalysisDisplay;