
import React from 'react';
import type { ConsumerInsightsResponse } from '../../types';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import LightBulbIcon from '../icons/LightBulbIcon';
import DocumentTextIcon from '../icons/DocumentTextIcon';
import ListBulletIcon from '../icons/ListBulletIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import QuestionMarkCircleIcon from '../icons/QuestionMarkCircleIcon';
import SparklesIcon from '../icons/SparklesIcon';
import UsersIcon from '../icons/UsersIcon';


interface ConsumerInsightsDisplayProps {
  result: ConsumerInsightsResponse;
}

interface InsightSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  accentBorder?: boolean;
  animationDelay?: string;
}

const InsightSection: React.FC<InsightSectionProps> = ({ title, icon, children, className = '', titleClassName = '', accentBorder, animationDelay }) => (
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

const getSentimentColor = (sentiment: ConsumerInsightsResponse['simulatedOverallSentiment']): string => {
  switch (sentiment) {
    case 'Positive': return 'text-green-400';
    case 'Negative': return 'text-red-400';
    case 'Neutral': return 'text-blue-400';
    case 'Mixed': return 'text-yellow-400';
    default: return 'text-brand-gray-400';
  }
};

const ConsumerInsightsDisplay: React.FC<ConsumerInsightsDisplayProps> = ({ result }) => {
  const sentimentColor = getSentimentColor(result.simulatedOverallSentiment);

  return (
    <div className="mt-8 p-4 md:p-6 bg-brand-gray-850 rounded-lg shadow-card space-y-6 border border-brand-gray-700 animate-premium-slide-in-up">
      <div className="text-center">
        <UsersIcon className="w-10 h-10 text-brand-premium-blue mx-auto mb-2"/>
        <h2 className="text-2xl font-bold text-brand-gray-50">AI Consumer Insights Report</h2>
        <p className="text-md text-brand-gray-400">For: <span className="font-semibold text-brand-gray-200">"{result.productConceptOrClaim}"</span></p>
        {result.targetAudience && <p className="text-sm text-brand-gray-500">Target Audience: {result.targetAudience}</p>}
      </div>
      
      <div className="p-4 bg-red-800 bg-opacity-80 border-2 border-red-600 rounded-lg text-red-100">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-10 h-10 mr-3 text-red-200 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-red-50">CRITICAL DISCLAIMER (SIMULATED INSIGHTS)</h3>
            <p className="text-sm text-red-100 leading-relaxed">
              {result.criticalDisclaimer}
            </p>
          </div>
        </div>
      </div>

      <InsightSection title="AI's Understanding of Your Query" icon={<DocumentTextIcon />} accentBorder animationDelay="100ms">
        <p className="italic">"{result.aiUnderstanding}"</p>
      </InsightSection>

      <InsightSection title="Simulated Overall Sentiment" icon={<InfoIcon />} titleClassName={sentimentColor} accentBorder animationDelay="200ms">
        <p className={`text-2xl font-bold ${sentimentColor}`}>{result.simulatedOverallSentiment}</p>
        <p className="text-xs text-brand-gray-400 mt-1">This is a generalized, simulated sentiment based on the AI's analysis of the concept.</p>
      </InsightSection>

      <div className="grid md:grid-cols-2 gap-6">
        <InsightSection title="Simulated Positive Keywords" icon={<LightBulbIcon className="text-green-400" />} accentBorder animationDelay="300ms">
          {result.simulatedPositiveKeywords.length > 0 ? (
            <ul className="list-disc list-inside marker:text-green-400">
              {result.simulatedPositiveKeywords.map((keyword, index) => (
                <li key={`pos-${index}`} className="animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>{keyword}</li>
              ))}
            </ul>
          ) : <p>No specific positive keywords identified by AI.</p>}
        </InsightSection>

        <InsightSection title="Simulated Negative Keywords" icon={<QuestionMarkCircleIcon className="text-red-400"/>} accentBorder animationDelay="350ms">
          {result.simulatedNegativeKeywords.length > 0 ? (
            <ul className="list-disc list-inside marker:text-red-400">
              {result.simulatedNegativeKeywords.map((keyword, index) => (
                <li key={`neg-${index}`} className="animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>{keyword}</li>
              ))}
            </ul>
          ) : <p>No specific negative keywords identified by AI.</p>}
        </InsightSection>
      </div>

      <InsightSection title="Key Themes from Simulated Feedback" icon={<ListBulletIcon />} accentBorder animationDelay="400ms">
        {result.keyThemesFromSimulatedFeedback.length > 0 ? (
          <ul className="space-y-1.5">
            {result.keyThemesFromSimulatedFeedback.map((theme, index) => (
              <li key={`theme-${index}`} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-brand-premium-blue mr-2 mt-1 flex-shrink-0">&#8226;</span>
                <span>{theme}</span>
              </li>
            ))}
          </ul>
        ) : <p>No specific key themes identified by AI.</p>}
      </InsightSection>

      <InsightSection title="Potential Resonance Points" icon={<CheckCircleIcon className="text-green-400" />} accentBorder animationDelay="500ms">
        {result.potentialResonancePoints.length > 0 ? (
          <ul className="space-y-1.5">
            {result.potentialResonancePoints.map((point, index) => (
              <li key={`res-${index}`} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-green-400 mr-2 mt-1 flex-shrink-0">&#10003;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : <p>No specific resonance points identified by AI.</p>}
      </InsightSection>

      <InsightSection title="Potential Hesitations or Concerns" icon={<QuestionMarkCircleIcon className="text-yellow-400"/>} accentBorder animationDelay="600ms">
        {result.potentialHesitationsOrConcerns.length > 0 ? (
          <ul className="space-y-1.5">
            {result.potentialHesitationsOrConcerns.map((concern, index) => (
              <li key={`concern-${index}`} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-yellow-400 mr-2 mt-1 flex-shrink-0">!</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        ) : <p>No specific hesitations or concerns identified by AI.</p>}
      </InsightSection>

      <InsightSection title="Suggested Marketing Angles (Simulated)" icon={<SparklesIcon className="text-brand-premium-blue" />} accentBorder animationDelay="700ms">
        {result.suggestedMarketingAngles.length > 0 ? (
         <ul className="space-y-1.5">
            {result.suggestedMarketingAngles.map((angle, index) => (
              <li key={`angle-${index}`} className="flex items-start animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-brand-premium-blue mr-2 mt-1 flex-shrink-0">&#10148;</span>
                <span>{angle}</span>
              </li>
            ))}
          </ul>
        ) : <p>No specific marketing angles suggested by AI.</p>}
      </InsightSection>
      
      <div className="mt-6 text-center text-xs text-brand-gray-500">
            <p>This Consumer Insights Report was generated by AI. All findings are simulated and for illustrative purposes only.</p>
      </div>
    </div>
  );
};

export default ConsumerInsightsDisplay;
