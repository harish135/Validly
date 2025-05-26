import React from 'react';
import { APP_NAME } from '../constants';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import HistoryIcon from './icons/HistoryIcon';
// import SparklesIcon from './icons/SparklesIcon'; // No longer needed for upgrade button
import type { Page } from '../App'; 

interface UserResponse {
  name: string;
  email: string;
  imageUrl: string;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  myReportsCount: number;
  onToggleMyReports: () => void;
  navigateTo: (page: Page) => void; 
}

export const ValidlyLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" />
    <path d="M12 20L18 26L28 16" className="stroke-brand-premium-blue" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  isSidebarOpen, 
  myReportsCount, 
  onToggleMyReports, 
  navigateTo,
}) => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [userName, setUserName] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate checking if the user is signed in and fetching user info
    const user = JSON.parse(localStorage.getItem('user') || 'null'); // Example logic
    if (user) {
      setIsSignedIn(true);
      setUserName(user.name); // Assuming user object has a 'name' property
    }
  }, []);

  const localHandleGoogleSignIn = () => {
    // Redirect to Google Sign-In page
    const googleSignInUrl = "https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=token&scope=email%20profile";
    window.location.href = googleSignInUrl;
  };

  const fakeGoogleSignIn = async (): Promise<UserResponse> => {
    // Simulate a successful Google Sign-In response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'Harish Reddy',
          email: 'harishreddy0701@gmail.com',
          imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKoy1i74FW1fogQuNpfrkCmjhiLKWpj5U8XMPHoHcsWWVAAwg=s96-c',
        });
      }, 1000);
    });
  };

  const localHandleGoogleSignOut = () => {
    localStorage.removeItem('user');
    setIsSignedIn(false);
    setUserName(null);
  };

  return (
    <header className="bg-brand-gray-900 shadow-premium sticky top-0 z-40 border-b border-brand-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
              <span className="ml-3 text-2xl font-semibold ">{APP_NAME}</span>
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
            {/* Upgrade button removed
            <button
                onClick={onUpgradeProClick}
                className="flex items-center px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-yellow-300 bg-yellow-500 bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors duration-150 border border-yellow-500 hover:border-yellow-400"
                title="Upgrade to Pro Plan"
                aria-label="Upgrade to Pro Plan"
            >
                <SparklesIcon className="w-4 h-4 mr-1 sm:mr-1.5 text-yellow-400" />
                Upgrade
            </button>
            */}
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <span className="text-white text-sm font-medium">{userName}</span>
                <button
                  onClick={localHandleGoogleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={localHandleGoogleSignIn}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign In with Google
                </button>
                <button
                  onClick={localHandleGoogleSignIn}
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up with Google
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;