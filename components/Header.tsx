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
import TrophyIcon from './icons/TrophyIcon';
import QuizIcon from './icons/QuizIcon';
import TargetIcon from './icons/TargetIcon';
import ClockIcon from './icons/ClockIcon';
import type { IconProps } from '../../types';
import type { Page } from '../App';

interface NavLinkDef {
  page: Page;
  label: string;
  iconComponent?: React.FC<IconProps>;
  sectionTitle?: string;
}

interface HeaderProps {
  user: AppUser | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  myReportsCount: number;
  onToggleMyReports: () => void;
  navigateTo: (page: Page) => void;
  timeLeft: string | null;
  planName: string;
}

export const ValidlyLogo: React.FC<{ className?: string }> = ({ className = "h-20 w-auto" }) => (
  <img
    src="/VA-removebg-preview.png"
    alt="Validly Logo"
    className={className}
  />
);

const Header: React.FC<HeaderProps> = ({ 
  user,
  onSignIn,
  onSignOut,
  onToggleSidebar, 
  isSidebarOpen, 
  myReportsCount, 
  onToggleMyReports, 
  navigateTo,
  timeLeft,
  planName
}) => {
  return (
    <header className="bg-brand-gray-900 shadow-premium sticky top-0 z-40 border-b border-brand-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="mr-3 p-2 rounded-md text-brand-gray-300 hover:text-brand-premium-blue hover:bg-brand-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-premium-blue"
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar-menu"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">{isSidebarOpen ? "Close main menu" : "Open main menu"}</span>
              {isSidebarOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="flex items-center text-brand-gray-50 hover:text-brand-premium-blue transition-colors">
              <ValidlyLogo />
              <span className="ml-3 text-xl font-semibold">{APP_NAME}</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {myReportsCount > 0 && (
              <button
                onClick={onToggleMyReports}
                className="p-2 rounded-full text-brand-gray-300 hover:text-brand-premium-blue hover:bg-brand-gray-700 transition-colors duration-150"
                title="View My Reports"
                aria-label="View My Reports"
              >
                <HistoryIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                {timeLeft !== null && (
                  <div className="flex items-center text-sm text-brand-premium-blue bg-brand-gray-800 px-3 py-1.5 rounded-full border border-brand-gray-700">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium text-brand-gray-200 mr-1">{planName}:</span>
                    <span>{timeLeft}</span>
                  </div>
                )}
                <button
                  onClick={onSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;