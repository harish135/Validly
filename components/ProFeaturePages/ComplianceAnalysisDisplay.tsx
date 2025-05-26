
import React from 'react';
import type { ComplianceAnalysisResponse, SimulatedComplianceFlag } from '../../types';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import LightBulbIcon from '../icons/LightBulbIcon';
import DocumentTextIcon from '../icons/DocumentTextIcon';
import ScaleIcon from '../icons/ScaleIcon'; // Main icon for display
import CheckCircleIcon from '../icons/CheckCircleIcon'; // For suggestions
import QuestionMarkCircleIcon from '../icons/QuestionMarkCircleIcon'; // For flags

interface ComplianceAnalysisDisplayProps {
  result: ComplianceAnalysisResponse;
}

interface AnalysisSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  accentBorder?: boolean;
  animationDelay?: string;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, icon, children, className = '', titleClassName = '', accentBorder, animationDelay }) => (
  <div 
    className={`bg-brand-gray-800 p-5 rounded-lg shadow-card border border-brand-gray-700 ${accentBorder ? 'border-t-2 border-t-brand-premium-blue pt-4' : ''} ${className} animate-premium-slide-in-up`}
    style={{ animationDelay }}
  >
    <div className="flex items-center text-brand-gray-300 mb-3">
      {React.cloneElement(icon as React.ReactElement<any>, { className: `w-5 h-5 ${titleClassName || 'text-brand-premium-blue'}` })}
      <h3 className={`ml-2 text-lg font-semibold ${titleClassName || 'text-brand-gray-100'}`}>{title}</h3>
    </div>
    <div className="text-sm text-brand-gray-300 leading-relaxed space-y-2">
      {children}
    </div>
  </div>
);

const getSeverityColor = (severity: SimulatedComplianceFlag['simulatedSeverity']): string => {
  switch (severity) {
    case 'High': return 'text-red-400';
    case 'Medium': return 'text-yellow-400';
    case 'Low': return 'text-blue-400';
    default: return 'text-brand-gray-400'; // Informational
  }
};

const ComplianceAnalysisDisplay: React.FC<ComplianceAnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="mt-8 p-4 md:p-6 bg-brand-gray-850 rounded-lg shadow-card space-y-6 border border-brand-gray-700 animate-premium-slide-in-up">
      <div className="text-center">
        <ScaleIcon className="w-10 h-10 text-brand-premium-blue mx-auto mb-2"/>
        <h2 className="text-2xl font-bold text-brand-gray-50">AI Compliance Analysis (Simulated)</h2>
        <p className="text-md text-brand-gray-400">For Copy: <span className="font-semibold text-brand-gray-200 italic">"{result.analyzedCopy.substring(0,100)}{result.analyzedCopy.length > 100 ? '...' : ''}"</span></p>
      </div>
      
      <div className="p-4 bg-red-800 bg-opacity-80 border-2 border-red-600 rounded-lg text-red-100">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-10 h-10 mr-3 text-red-200 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-red-50">CRITICAL DISCLAIMER (SIMULATED ADVICE)</h3>
            <p className="text-sm text-red-100 leading-relaxed">
              {result.criticalDisclaimer}
            </p>
          </div>
        </div>
      </div>

      <AnalysisSection title="AI's Understanding of Your Copy" icon={<DocumentTextIcon />} accentBorder animationDelay="100ms">
        <p className="italic">"{result.aiUnderstanding}"</p>
      </AnalysisSection>

      {result.simulatedPotentialComplianceFlags && result.simulatedPotentialComplianceFlags.length > 0 && (
        <AnalysisSection title="Simulated Potential Compliance Flags" icon={<QuestionMarkCircleIcon className="text-yellow-400"/>} accentBorder animationDelay="200ms">
          <p className="text-xs text-brand-gray-400 mb-2">These are AI-simulated potential issues for consideration and are NOT definitive legal assessments.</p>
          <div className="space-y-3">
            {result.simulatedPotentialComplianceFlags.map((flagItem, index) => (
              <div key={`flag-${index}`} className="p-3 bg-brand-gray-850 rounded-md border border-brand-gray-700 animate-premium-slide-in-left" style={{ animationDelay: `${index * 75}ms` }}>
                <p className="font-semibold text-brand-gray-100">{flagItem.flag}</p>
                <p className={`text-xs font-medium ${getSeverityColor(flagItem.simulatedSeverity)}`}>
                  Simulated Severity: {flagItem.simulatedSeverity}
                </p>
                <p className="text-brand-gray-300 mt-1">{flagItem.simulatedExplanation}</p>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {result.simulatedImprovementSuggestions && result.simulatedImprovementSuggestions.length > 0 && (
        <AnalysisSection title="Simulated Improvement Suggestions" icon={<LightBulbIcon className="text-green-400" />} accentBorder animationDelay="300ms">
          <p className="text-xs text-brand-gray-400 mb-2">These are AI-generated ideas for potential refinement and NOT instructions.</p>
          <ul className="space-y-1.5">
            {result.simulatedImprovementSuggestions.map((suggestion, index) => (
              <li key={`sug-${index}`} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-green-400 mr-2 mt-1 flex-shrink-0">&#10003;</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </AnalysisSection>
      )}
      
      {result.generalSimulatedComplianceConsiderations && result.generalSimulatedComplianceConsiderations.length > 0 && (
        <AnalysisSection title="General Simulated Compliance Considerations" icon={<InfoIcon />} accentBorder animationDelay="400ms">
         <p className="text-xs text-brand-gray-400 mb-2">General (simulated) principles for responsible wellness marketing.</p>
          <ul className="space-y-1.5">
            {result.generalSimulatedComplianceConsiderations.map((consideration, index) => (
              <li key={`con-${index}`} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-brand-premium-blue mr-2 mt-1 flex-shrink-0">&#8226;</span>
                <span>{consideration}</span>
              </li>
            ))}
          </ul>
        </AnalysisSection>
      )}
      
      <div className="mt-6 text-center text-xs text-brand-gray-500">
        <p>This Compliance Analysis was generated by AI. All findings and suggestions are simulated and for illustrative/brainstorming purposes only. Consult qualified legal and regulatory experts.</p>
      </div>
    </div>
  );
};

export default ComplianceAnalysisDisplay;
