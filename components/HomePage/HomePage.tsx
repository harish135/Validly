import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import FeaturesSection from './FeaturesSection';
import ReviewsSection from './ReviewsSection'; 
import FAQSection from './FAQSection'; 
import CallToActionSection from './CallToActionSection';
import type { Page } from '../../App';
import Section from '../shared/Section';
import DocumentTextIcon from '../icons/DocumentTextIcon';
import BeakerIcon from '../icons/BeakerIcon';
import NewspaperIcon from '../icons/NewspaperIcon';
import HeartPulseIcon from '../icons/HeartPulseIcon';
import UsersIcon from '../icons/UsersIcon';
import ScaleIcon from '../icons/ScaleIcon';
import PuzzlePieceIcon from '../icons/PuzzlePieceIcon';
import ChatBubbleLeftRightIcon from '../icons/ChatBubbleLeftRightIcon';
import TrophyIcon from '../icons/TrophyIcon'; // New
import QuizIcon from '../icons/QuizIcon'; // New
import TargetIcon from '../icons/TargetIcon'; // New
import type { IconProps } from '../../types';

// Explicitly define types for props and ensure proper JSX typing
interface HomePageProps {
  navigateTo: (page: Page) => void;
  myReportsCount: number;
}

interface QuickAccessCardProps {
  title: string;
  page: Page;
  icon: React.ReactElement<IconProps>;
  navigateTo: (page: Page) => void;
  animationDelay: string;
  description?: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, page, icon, navigateTo, animationDelay, description }) => (
  <button
    onClick={() => navigateTo(page)}
    className="bg-brand-gray-800 p-4 rounded-lg shadow-card border border-brand-gray-700 text-left hover:bg-brand-gray-700 hover:border-brand-premium-blue transition-all duration-200 transform hover:-translate-y-0.5 w-full flex items-start animate-premium-scale-up h-full"
    style={{ animationDelay }}
  >
    {React.cloneElement(icon, { className: 'w-7 h-7 text-brand-premium-blue mr-3 mt-1 flex-shrink-0' })}
    <div>
      <h4 className="font-semibold text-brand-gray-100 text-md mb-0.5">{title}</h4>
      {description && <p className="text-xs text-brand-gray-400 mb-1.5">{description}</p>}
      <p className="text-xs text-brand-premium-blue hover:text-blue-300 font-medium">Go to Tool &rarr;</p>
    </div>
  </button>
);

const HomePage: React.FC<HomePageProps> = ({ navigateTo, myReportsCount }) => {
  const navigate = useNavigate();

  const mainTools = [
    { title: 'Claim Validator', page: 'validator' as Page, icon: <DocumentTextIcon />, description: "Analyze product claims." },
    { title: 'Ingredient AI', page: 'ingredient-analyser' as Page, icon: <BeakerIcon />, description: "Explore ingredient science." },
    { title: 'Consumer Insights', page: 'consumer-insights' as Page, icon: <UsersIcon />, description: "Simulate audience reception." },
    { title: 'Compliance AI', page: 'compliance-assistant' as Page, icon: <ScaleIcon />, description: "Review marketing copy." },
    { title: 'Formulation AI', page: 'formulation-advisor' as Page, icon: <PuzzlePieceIcon />, description: "Spark product ideas." },
    { title: 'Symptom AI', page: 'symptom-analyzer' as Page, icon: <HeartPulseIcon />, description: "Get health insights." },
    { title: 'AI News Digest', page: 'ai-news-digest' as Page, icon: <NewspaperIcon />, description: "Curated news summaries." }, 
    { title: 'Community Q&A', page: 'community-forum' as Page, icon: <ChatBubbleLeftRightIcon />, description: "Ask & discuss." },
  ];

  const engagementTools = [
     { title: 'My Achievements', page: 'achievements' as Page, icon: <TrophyIcon />, description: "Track your progress." },
     { title: 'Wellness Quizzes', page: 'quizzes' as Page, icon: <QuizIcon />, description: "Test your knowledge." },
     { title: 'Challenges', page: 'challenges' as Page, icon: <TargetIcon />, description: "Engage & learn." },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection navigateTo={navigateTo} myReportsCount={myReportsCount} />
      
      <Section 
        title="Quick Access Tools" 
        subtitle="Jump directly into Validly's powerful AI analysis and engagement features." 
        animate={true}
        className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-premium"
        id="quick-access"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {[...mainTools, ...engagementTools].map((tool, index) => (
            <QuickAccessCard 
              key={tool.page}
              title={tool.title}
              page={tool.page}
              icon={tool.icon}
              navigateTo={navigateTo}
              animationDelay={`${index * 40}ms`}
              description={tool.description}
            />
          ))}
        </div>
      </Section>

      <HowItWorksSection />
      <FeaturesSection />
      <ReviewsSection /> 
      <FAQSection />
      <CallToActionSection onGetStartedClick={() => navigateTo('validator')} />
    </div>
  );
};

export default HomePage;
