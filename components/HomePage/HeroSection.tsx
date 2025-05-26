
import React from 'react';
import DocumentTextIcon from '../icons/DocumentTextIcon';
import BeakerIcon from '../icons/BeakerIcon';
import NewspaperIcon from '../icons/NewspaperIcon';
import HeartPulseIcon from '../icons/HeartPulseIcon';
import type { Page } from '../../App';
import type { IconProps } from '../../types';

interface HeroSectionProps {
  navigateTo: (page: Page) => void;
  myReportsCount: number; // New prop
}

interface HeroLevelsCardProps {
  title: string;
  description: string;
  page: Page;
  icon: React.ReactElement<IconProps>;
  navigateTo: (page: Page) => void;
  isAccent?: boolean;
  animationDelay?: string;
}

const HeroLevelsCard: React.FC<HeroLevelsCardProps> = ({ title, description, page, icon, navigateTo, isAccent, animationDelay }) => {
  const cardBgColor = isAccent ? 'bg-brand-premium-blue' : 'bg-gradient-to-br from-brand-gray-900 to-brand-gray-850'; // Subtle gradient for non-accent
  const textColor = isAccent ? 'text-white' : 'text-brand-gray-100';
  const descriptionColor = isAccent ? 'text-blue-100' : 'text-brand-gray-300';
  const iconColor = isAccent ? 'text-white' : 'text-brand-premium-blue';
  const learnMoreColor = isAccent ? 'text-blue-200 hover:text-white' : 'text-brand-premium-blue hover:text-blue-300';

  return (
    <button
      onClick={() => navigateTo(page)}
      className={`${cardBgColor} p-6 rounded-xl shadow-card border ${isAccent ? 'border-brand-premium-blue' : 'border-brand-gray-700'} text-center hover:shadow-premium transition-all duration-200 transform hover:-translate-y-1 w-full flex flex-col items-center animate-premium-scale-up h-full`}
      style={{ animationDelay }}
    >
      <div className="mb-4">
        {React.cloneElement(icon, { className: `w-8 h-8 ${iconColor}` })}
      </div>
      <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{title}</h3>
      <p className={`${descriptionColor} text-sm mb-4 flex-grow`}>{description}</p>
      <span className={`${learnMoreColor} text-sm font-medium mt-auto`}>
        Explore Tool &rarr;
      </span>
    </button>
  );
};


const HeroSection: React.FC<HeroSectionProps> = ({ navigateTo, myReportsCount }) => {
  const hasReports = myReportsCount > 0;

  return (
    <section className="text-center py-16 md:py-20 bg-brand-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase text-brand-premium-blue tracking-wider mb-3 animate-premium-slide-in-up" style={{ animationDelay: '0ms' }}>
          {hasReports ? "CONTINUE YOUR JOURNEY" : "UNLOCK YOUR PRODUCT'S POTENTIAL"}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-gray-50 mb-6 animate-premium-slide-in-up" style={{ animationDelay: '100ms' }}>
          {hasReports ? "Welcome Back to " : "What is "} 
          <span className="text-brand-premium-blue">Validly</span>?
        </h1>
        <p className="text-lg sm:text-xl text-brand-gray-300 max-w-3xl mx-auto mb-12 animate-premium-slide-in-up" style={{ animationDelay: '200ms' }}>
          {hasReports 
            ? "Dive back into your analyses or explore new insights. Validly is here to support your brand's growth with powerful AI tools."
            : "Validly helps you unlock product truth by analyzing claims, ingredient science, and health news, translating that data into actionable, real-world guidance. It's the research partner in your pocket."
          }
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          <HeroLevelsCard
            title="Claim Validator"
            description="Analyze product claims for scientific backing and get marketing suggestions."
            page="validator"
            icon={<DocumentTextIcon />}
            navigateTo={navigateTo}
            isAccent={true}
            animationDelay="300ms"
          />
          <HeroLevelsCard
            title="Ingredient AI"
            description="Explore ingredients to understand their (simulated) uses and research."
            page="ingredient-analyser"
            icon={<BeakerIcon />}
            navigateTo={navigateTo}
            animationDelay="400ms"
          />
          <HeroLevelsCard
            title="AI News Digest" // Changed
            description="Access AI-curated (simulated) news across various topics." // Changed
            page="ai-news-digest" // Changed
            icon={<NewspaperIcon />}
            navigateTo={navigateTo}
            animationDelay="500ms"
          />
           <HeroLevelsCard
            title="Symptom AI"
            description="Get informational insights on health symptoms."
            page="symptom-analyzer"
            icon={<HeartPulseIcon />}
            navigateTo={navigateTo}
            animationDelay="600ms"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
