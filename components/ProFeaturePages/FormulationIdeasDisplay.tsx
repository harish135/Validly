
import React from 'react';
import type { FormulationAdvisorResponse, FormulationIdea, KeySimulatedIngredient } from '../../types';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import LightBulbIcon from '../icons/LightBulbIcon'; // For ideas
import DocumentTextIcon from '../icons/DocumentTextIcon'; // For AI understanding
import PuzzlePieceIcon from '../icons/PuzzlePieceIcon'; // Main icon for display
import BeakerIcon from '../icons/BeakerIcon'; // For ingredients
import UserCircleIcon from '../icons/UserCircleIcon'; // For target consumer
import SparklesIcon from '../icons/SparklesIcon'; // For USP

interface FormulationIdeasDisplayProps {
  result: FormulationAdvisorResponse;
}

interface IdeaSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  accentBorder?: boolean;
  animationDelay?: string;
}

const IdeaSection: React.FC<IdeaSectionProps> = ({ title, icon, children, className = '', titleClassName = '', accentBorder, animationDelay }) => (
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

const FormulationIdeaCard: React.FC<{ idea: FormulationIdea, index: number }> = ({ idea, index }) => (
  <div className="bg-brand-gray-850 p-4 rounded-lg border border-brand-gray-700 space-y-3 animate-premium-scale-up" style={{animationDelay: `${index * 150}ms`}}>
    <h4 className="text-xl font-semibold text-brand-premium-blue">{idea.ideaTitle}</h4>
    <p className="italic text-brand-gray-300">{idea.conceptDescription}</p>
    
    <div>
      <h5 className="text-md font-semibold text-brand-gray-100 flex items-center mb-1">
        <BeakerIcon className="w-4 h-4 mr-2 text-brand-blue-300" /> Key Simulated Ingredients:
      </h5>
      <ul className="list-disc list-inside pl-2 space-y-1 marker:text-brand-blue-300">
        {idea.keySimulatedIngredients.map((ing, i) => (
          <li key={i}>
            <span className="font-medium text-brand-gray-200">{ing.ingredientName}:</span> {ing.simulatedRationale}
            {ing.simulatedBenefit && <span className="block text-xs text-brand-gray-400 pl-4"> &rarr; Simulated Benefit: {ing.simulatedBenefit}</span>}
          </li>
        ))}
      </ul>
    </div>

    {idea.potentialUniqueSellingPoints && idea.potentialUniqueSellingPoints.length > 0 && (
      <div>
        <h5 className="text-md font-semibold text-brand-gray-100 flex items-center mb-1">
          <SparklesIcon className="w-4 h-4 mr-2 text-yellow-400" /> Potential Unique Selling Points (Simulated):
        </h5>
        <ul className="list-disc list-inside pl-2 space-y-1 marker:text-yellow-400">
          {idea.potentialUniqueSellingPoints.map((usp, i) => <li key={i}>{usp}</li>)}
        </ul>
      </div>
    )}

    {idea.simulatedTargetConsumer && (
      <div>
        <h5 className="text-md font-semibold text-brand-gray-100 flex items-center mb-1">
          <UserCircleIcon className="w-4 h-4 mr-2 text-green-400" /> Simulated Target Consumer:
        </h5>
        <p className="text-brand-gray-300 pl-2">{idea.simulatedTargetConsumer}</p>
      </div>
    )}
  </div>
);


const FormulationIdeasDisplay: React.FC<FormulationIdeasDisplayProps> = ({ result }) => {
  return (
    <div className="mt-8 p-4 md:p-6 bg-brand-gray-900 rounded-lg shadow-card space-y-6 border border-brand-gray-700 animate-premium-slide-in-up"> {/* Outer container with slightly darker bg */}
      <div className="text-center">
        <PuzzlePieceIcon className="w-10 h-10 text-brand-premium-blue mx-auto mb-2"/>
        <h2 className="text-2xl font-bold text-brand-gray-50">AI Formulation Advisor Ideas (Simulated)</h2>
        <p className="text-md text-brand-gray-400">For Query: <span className="font-semibold text-brand-gray-200 italic">"{result.query}"</span></p>
      </div>
      
      <div className="p-4 bg-red-800 bg-opacity-80 border-2 border-red-600 rounded-lg text-red-100">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-10 h-10 mr-3 text-red-200 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-red-50">CRITICAL DISCLAIMER (SIMULATED IDEAS)</h3>
            <p className="text-sm text-red-100 leading-relaxed">
              {result.criticalDisclaimer}
            </p>
          </div>
        </div>
      </div>

      <IdeaSection title="AI's Understanding of Your Query" icon={<DocumentTextIcon />} accentBorder animationDelay="100ms" className="bg-brand-gray-850">
        <p className="italic">"{result.aiUnderstanding}"</p>
      </IdeaSection>

      {result.simulatedFormulationIdeas && result.simulatedFormulationIdeas.length > 0 && (
        <IdeaSection title="Simulated Formulation Ideas" icon={<LightBulbIcon />} accentBorder animationDelay="200ms" className="bg-brand-gray-850">
          <p className="text-xs text-brand-gray-400 mb-3">The following are AI-generated conceptual ideas for brainstorming. They require rigorous scientific validation.</p>
          <div className="space-y-4">
            {result.simulatedFormulationIdeas.map((idea, index) => (
              <FormulationIdeaCard key={index} idea={idea} index={index} />
            ))}
          </div>
        </IdeaSection>
      )}
      
      {result.generalSimulatedInnovationConsiderations && result.generalSimulatedInnovationConsiderations.length > 0 && (
        <IdeaSection title="General Simulated Innovation Considerations" icon={<InfoIcon />} accentBorder animationDelay="300ms" className="bg-brand-gray-850">
         <p className="text-xs text-brand-gray-400 mb-2">Broad (simulated) points to keep in mind when developing new wellness products.</p>
          <ul className="list-disc list-inside space-y-1 marker:text-brand-premium-blue">
            {result.generalSimulatedInnovationConsiderations.map((consideration, index) => (
              <li key={`con-${index}`} className="animate-premium-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                {consideration}
              </li>
            ))}
          </ul>
        </IdeaSection>
      )}
      
      <div className="mt-6 text-center text-xs text-brand-gray-500">
        <p>These Formulation Ideas were generated by AI. All concepts are simulated and for illustrative/brainstorming purposes only. Consult qualified scientists and experts for actual product development.</p>
      </div>
    </div>
  );
};

export default FormulationIdeasDisplay;
