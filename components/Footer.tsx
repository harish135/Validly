
import React from 'react';
import { APP_NAME } from '../constants';
import type { Page } from '../App'; // Import Page type

interface FooterLink {
  name: string;
  page: Page; // Use Page type for internal navigation
}

interface FooterProps {
  navigateTo: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const footerLinks: FooterLink[] = [
    { name: 'Pricing', page: 'pricing' },
    { name: 'API Docs', page: 'api-access' },
    { name: 'Contact Us', page: 'contact' },
    { name: 'Terms of Service', page: 'terms-of-service' },
  ];

  return (
    <footer className="bg-brand-gray-950 border-t border-brand-gray-700 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2 mb-6" aria-label="Footer">
          {footerLinks.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.page);
                }}
                className="text-sm text-brand-gray-400 hover:text-brand-premium-blue transition-colors"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <p className="text-center text-sm text-brand-gray-500">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p className="text-center text-xs text-brand-gray-600 mt-1">
          AI-powered insights for your wellness brand. Built for demonstration.
        </p>
      </div>
    </footer>
  );
};

export default Footer;