
import React from 'react';
import { APP_NAME } from '../constants';
import { ValidlyLogo } from './Header'; 
import CloseIcon from './icons/CloseIcon';
import HistoryIcon from './icons/HistoryIcon'; 
import HeartPulseIcon from './icons/HeartPulseIcon';
import NewspaperIcon from './icons/NewspaperIcon';
import HomeIcon from './icons/HomeIcon'; 
import DocumentTextIcon from './icons/DocumentTextIcon'; 
import BeakerIcon from './icons/BeakerIcon';
import UsersIcon from './icons/UsersIcon'; 
import ScaleIcon from './icons/ScaleIcon'; 
import PuzzlePieceIcon from './icons/PuzzlePieceIcon'; 
import SparklesIcon from './icons/SparklesIcon'; 
import ChatBubbleLeftRightIcon from './icons/ChatBubbleLeftRightIcon';
import TrophyIcon from './icons/TrophyIcon'; // New
import QuizIcon from './icons/QuizIcon'; // New
import TargetIcon from './icons/TargetIcon'; // New
import type { IconProps } from '../../types';
import type { Page } from '../App'; 

interface NavLinkDef {
  page: Page;
  label: string;
  iconComponent?: React.FC<IconProps>;
  sectionTitle?: string; // For grouping
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigateTo: (page: Page) => void;
  currentPage: Page;
}

const NavLinkItem: React.FC<{ navLink: NavLinkDef; currentPage: Page; navigateTo: (page: Page) => void; onClose: () => void }> = ({ navLink, currentPage, navigateTo }) => {
  const { page, label, iconComponent: Icon } = navLink;
  const isActive = currentPage === page;
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigateTo(page);
      }}
      className={`font-medium transition-colors duration-150 flex items-center w-full
        ${isActive ? 'text-brand-premium-blue bg-brand-gray-700' : 'text-brand-gray-200 hover:text-brand-premium-blue hover:bg-brand-gray-700'}
        block px-3 py-3.5 rounded-md text-base 
      `} 
      aria-current={isActive ? 'page' : undefined}
    >
      {Icon && <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-brand-premium-blue' : 'text-brand-premium-blue' }`} />}
      <span className="flex-grow">{label}</span>
    </a>
  );
};

const NavSectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="px-3 pt-4 pb-1 text-xs font-semibold uppercase text-brand-gray-500 tracking-wider">{title}</h3> // px-4 to px-3
);


const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, navigateTo, currentPage }) => {
    const navLinks: NavLinkDef[] = [
        { page: 'home', label: 'Home', iconComponent: HomeIcon, sectionTitle: "Main" },
        { page: 'validator', label: 'Claim Validator', iconComponent: DocumentTextIcon },
        { page: 'ingredient-analyser', label: 'Ingredient AI', iconComponent: BeakerIcon },
        { page: 'ai-news-digest', label: 'AI News Digest', iconComponent: NewspaperIcon },
        { page: 'symptom-analyzer', label: 'Symptom AI', iconComponent: HeartPulseIcon },
        { page: 'community-forum', label: 'Community Q&A', iconComponent: ChatBubbleLeftRightIcon }, 
        
        { page: 'achievements', label: 'My Achievements', iconComponent: TrophyIcon, sectionTitle: "Engagement" },
        { page: 'quizzes', label: 'Personalized Quiz', iconComponent: QuizIcon }, // Updated label slightly for consistency
        { page: 'challenges', label: 'Challenges', iconComponent: TargetIcon },

        { page: 'consumer-insights', label: 'Consumer Insights', iconComponent: UsersIcon, sectionTitle: "Pro Tools" },
        { page: 'compliance-assistant', label: 'Compliance AI', iconComponent: ScaleIcon },
        { page: 'formulation-advisor', label: 'Formulation AI', iconComponent: PuzzlePieceIcon },
        { page: 'competitor-monitoring', label: 'Comp. Monitor', iconComponent: SparklesIcon }, 
        { page: 'api-access', label: 'API Access', iconComponent: SparklesIcon }, 
        
        { page: 'support', label: 'Support', iconComponent: HistoryIcon, sectionTitle: "Resources" }, 
    ];
  
    return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        id="sidebar-menu"
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-brand-gray-900 shadow-premium transform transition-transform duration-300 ease-in-out border-r border-brand-gray-700 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-brand-gray-700">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="flex items-center text-brand-gray-50 hover:text-brand-premium-blue transition-colors">
            <ValidlyLogo />
            <span className="ml-3 text-xl font-semibold">{APP_NAME}</span>
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-brand-gray-300 hover:text-brand-premium-blue hover:bg-brand-gray-700 focus:outline-none"
            aria-label="Close menu"
          >
            <CloseIcon className="block h-6 w-6" />
          </button>
        </div>

        <nav className="flex-grow px-2 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(link => (
            <React.Fragment key={link.page}>
              {link.sectionTitle && <NavSectionTitle title={link.sectionTitle} />}
              <NavLinkItem 
                  navLink={link} 
                  currentPage={currentPage} 
                  navigateTo={navigateTo} 
                  onClose={onClose}
              />
            </React.Fragment>
          ))}
        </nav>
        
      </aside>
    </>
  );
};

export default Sidebar;