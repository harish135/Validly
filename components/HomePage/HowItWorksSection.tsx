
import React from 'react';
import Section from '../shared/Section';
// Numbered icons are no longer used
import DocumentTextIcon from '../icons/DocumentTextIcon';
import LightBulbIcon from '../icons/LightBulbIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import type { IconProps } from '../../types';

interface StepCardProps {
  title: string;
  description: string;
  mainIcon: React.ReactElement<IconProps>;
  animationDelay: string;
}

const StepCard: React.FC<StepCardProps> = ({ title, description, mainIcon, animationDelay }) => (
  <div 
    className="flex flex-col items-center text-center p-6 bg-brand-gray-900 rounded-xl shadow-card h-full border border-brand-gray-700 hover:border-brand-premium-blue transition-all duration-300 transform hover:-translate-y-1 animate-premium-scale-up"
    style={{ animationDelay }}
  >
    <div className="mb-5">
        {React.cloneElement(mainIcon, { className: "w-10 h-10 text-brand-premium-blue"})}
    </div>
    <h3 className="text-xl font-semibold text-brand-gray-100 mb-2">{title}</h3>
    <p className="text-brand-gray-300 text-sm leading-relaxed mb-4 flex-grow">{description}</p>
    <span className="text-brand-premium-blue hover:text-blue-300 text-sm font-medium mt-auto transition-colors">
        Learn more &rarr;
    </span>
  </div>
);

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      mainIcon: <DocumentTextIcon />,
      title: 'Input Your Query',
      description: 'Enter a product claim, ingredient, or health symptom you want to analyze.',
    },
    {
      mainIcon: <LightBulbIcon />,
      title: 'AI Analyzes & Simulates',
      description: 'Validly\'s AI processes your query, referencing simulated research and knowledge.',
    },
    {
      mainIcon: <CheckCircleIcon />,
      title: 'Receive Insights',
      description: 'Get a structured report with confidence scores, key findings, or informational summaries.',
    },
  ];

  return (
    <Section title="How Validly Works" subtitle="Get AI-driven insights in three simple steps." animate={true} id="how-it-works" className="bg-brand-gray-950">
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {steps.map((step, index) => (
          <StepCard 
            key={index} 
            title={step.title}
            description={step.description}
            mainIcon={step.mainIcon}
            animationDelay={`${index * 150}ms`} 
          />
        ))}
      </div>
    </Section>
  );
};

export default HowItWorksSection;
