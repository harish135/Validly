import React from 'react';
import { APP_NAME } from '../constants';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import HistoryIcon from './icons/HistoryIcon';
import ClockIcon from './icons/ClockIcon';
import type { Page, AppUser } from '../App';

interface HeaderProps {
  user: AppUser | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  myReportsCount: number;
  onToggleMyReports: () => void;
  navigateTo: (page: Page) => void;
  triesLeft?: string | number | null;
}

export const ValidlyLogo: React.FC<{ className?: string }> = ({ className = "h-20 w-auto" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" />
    <path d="M12 20L18 26L28 16" className="stroke-brand-premium-blue" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
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
  triesLeft
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
          
          <div className="flex items-center space-x-2 sm:space-x-3">
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
                {/* Show time remaining if available */}
                {triesLeft !== null && triesLeft !== undefined && (
                  <div className="flex items-center text-xs text-brand-premium-blue bg-brand-gray-800 px-3 py-1.5 rounded-full border border-brand-gray-700">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {triesLeft === 'Unlimited' ? (
                      <span>Unlimited Access</span>
                    ) : (
                      <span>{triesLeft} minutes left today</span>
                    )}
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