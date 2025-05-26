
import React from 'react';
import Section from '../shared/Section';
// import IconButton from '../IconButton'; // No longer needed for upgrade
// import SparklesIcon from '../icons/SparklesIcon'; // No longer needed for upgrade

interface SupportPageProps {
  // onUpgradeProClick: () => void; // Removed
}

const SupportPage: React.FC<SupportPageProps> = (/*{ onUpgradeProClick }*/) => {
  // Image by LinkedIn Sales Solutions on Unsplash: https://unsplash.com/photos/people-sitting-by-the-table-using-laptop-computer-pAtA8xe_iVM
  const imageUrl = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80";
  return (
    <Section 
      title="Help & Support"
      subtitle="We're Here to Assist You"
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="text-center max-w-3xl mx-auto p-2 md:p-4">
        <div className="mb-8 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={imageUrl} 
            alt="Support team collaborating and assisting users" 
            className="object-cover w-full h-64 md:h-80"
          />
        </div>
        <p className="text-lg text-brand-gray-300 mb-6">
          Need assistance or have questions about Validly? Our support team is ready to help.
          Browse our FAQs, documentation, or reach out for personalized assistance.
        </p>
        
        <div className="bg-brand-gray-800 p-6 rounded-lg border border-brand-gray-700 mb-8 text-left shadow-md">
            <h3 className="text-xl font-semibold text-brand-gray-100 mb-2">Comprehensive Support</h3>
            <p className="text-brand-gray-300 mb-1">
                All users have access to our comprehensive knowledge base and community forums.
            </p>
            <p className="text-brand-gray-300">
                Email support is available with prompt response times to help you get the most out of Validly. We prioritize all user inquiries to ensure you have a smooth experience.
            </p>
        </div>

        {/* Pro Support section and button removed
        <div className="bg-brand-gray-800 p-6 rounded-lg border border-brand-premium-blue mb-8 shadow-md text-left">
            ...
        </div>
        
        <p className="text-md text-brand-gray-100 font-semibold mb-4">
          Looking for enhanced support and other exclusive benefits?
        </p>
        <IconButton
          label="Try Priority Support Free"
          onClick={onUpgradeProClick}
          variant="primary"
          size="lg"
          icon={<SparklesIcon className="w-5 h-5" />}
        />
        */}
         <p className="text-md text-brand-gray-400 mt-8">
          For specific inquiries, please feel free to contact us via our official channels. We aim to provide helpful and timely support to all our users.
        </p>
      </div>
    </Section>
  );
};

export default SupportPage;