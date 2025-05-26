
import React from 'react';
import Section from '../shared/Section';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import LightBulbIcon from '../icons/LightBulbIcon';
import SparklesIcon from '../icons/SparklesIcon';
// TagIcon is no longer explicitly used for "Coming Soon" on these consolidated cards
import type { IconProps } from '../../types';


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode; 
  animationDelay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, animationDelay }) => (
  <div 
    className="relative bg-brand-gray-900 p-6 rounded-xl shadow-card hover:shadow-premium hover:border-brand-premium-blue transition-all duration-300 transform hover:-translate-y-1 h-full border border-brand-gray-700 flex flex-col items-center text-center animate-premium-scale-up"
    style={{ animationDelay }}
  >
    <div className="mb-5">
      {React.cloneElement(icon as React.ReactElement<IconProps>, { className: "w-10 h-10 text-brand-premium-blue"})}
    </div>
    <h3 className="text-xl font-semibold text-brand-gray-100 mb-3">{title}</h3>
    <div className="text-brand-gray-300 text-sm leading-relaxed mb-4 flex-grow text-left px-2 sm:px-0"> {/* Text left for list readability */}
        {description}
    </div>
    <span className="text-brand-premium-blue hover:text-blue-300 text-sm font-medium mt-auto transition-colors">
        Learn more &rarr;
    </span>
  </div>
);

const FeaturesSection: React.FC = () => {
  const consolidatedFeatures = [
    {
      icon: <ShieldCheckIcon />,
      title: 'AI Claim Validation Suite',
      description: (
        <ul className="list-disc list-inside space-y-1.5 marker:text-brand-premium-blue">
          <li>AI-powered analysis of product claims.</li>
          <li>Science-backed summaries of (simulated) research.</li>
          <li>Intuitive confidence scores for claim strength.</li>
          <li>Suggestions for legally-safe marketing phrasing.</li>
          <li>Exportable PDF reports and embeddable trust badges.</li>
        </ul>
      ),
    },
    {
      icon: <LightBulbIcon />,
      title: 'Health & Ingredient Intelligence',
      description: (
        <ul className="list-disc list-inside space-y-1.5 marker:text-brand-premium-blue">
          <li>Explore ingredients for AI-generated (simulated) use summaries.</li>
          <li>Get informational insights on health symptoms.</li>
          <li>Access AI-curated (simulated) news on healthcare.</li>
        </ul>
      ),
    },
    {
      icon: <SparklesIcon />,
      title: 'Advanced Toolkit & Innovations', 
      description: (
         <ul className="list-disc list-inside space-y-1.5 marker:text-brand-premium-blue">
          <li>Consumer Insights Engine.</li>
          <li>Regulatory & Compliance AI Assistant.</li>
          <li>Product Formulation AI Advisor.</li>
          <li>Competitor Claim Monitoring.</li>
          <li>Developer API Access.</li>
          <li>Shopify Integration (Coming Soon).</li>
          <li>Advanced Analytics Dashboard (Coming Soon).</li>
        </ul>
      ),
    },
  ];

  return (
    <Section 
      title="Key Features of Validly" 
      subtitle="Everything you need to build trust and credibility with AI-driven insights." 
      animate={true} 
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-premium" 
      id="features"
    >
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {consolidatedFeatures.map((feature, index) => (
          <FeatureCard 
            key={`feature-pillar-${index}`} 
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            animationDelay={`${index * 150}ms`}
          />
        ))}
      </div>
    </Section>
  );
};

export default FeaturesSection;