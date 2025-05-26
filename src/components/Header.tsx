import React from 'react';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { Page } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  myReportsCount: number;
  onToggleMyReports: () => void;
  navigateTo: (page: Page) => void;
  handleGoogleSignIn: () => Promise<void>;
  handleGoogleSignOut: () => Promise<void>;
  user: { name: string; email: string; imageUrl: string } | null;
}

const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  myReportsCount,
  onToggleMyReports,
  navigateTo,
  handleGoogleSignIn,
  handleGoogleSignOut,
  user
}) => {
  return (
    <header className="bg-brand-gray-900 border-b border-brand-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="text-brand-gray-300 hover:text-white focus:outline-none"
            >
              {isSidebarOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
            <div className="ml-4 flex items-center space-x-4">
              {/* Home and Validator buttons removed */}
              {myReportsCount > 0 && (
                <button
                  onClick={onToggleMyReports}
                  className="text-brand-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Reports ({myReportsCount})
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.imageUrl && (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-brand-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={handleGoogleSignOut}
                  className="flex items-center space-x-2 text-brand-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center space-x-2 text-brand-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <FiUser className="h-5 w-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 