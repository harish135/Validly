
import React from 'react';
import Section from '../shared/Section';
// import IconButton from '../IconButton'; // No longer needed
// import SparklesIcon from '../icons/SparklesIcon'; // No longer needed

interface ApiAccessPageProps {
  // onUpgradeProClick: () => void; // Removed
}

const ApiAccessPage: React.FC<ApiAccessPageProps> = (/*{ onUpgradeProClick }*/) => {
  // Image by Florian Krumm on Unsplash: https://unsplash.com/photos/code-on-a-screen-WEDfA8232fo
  const imageUrl = "https://images.unsplash.com/photo-1624996752380-8ec242e0f85d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80";

  return (
    <Section 
      title="Developer API Access"
      subtitle="Integrate Validly's Power into Your Workflow"
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="text-center max-w-3xl mx-auto p-2 md:p-4">
         <div className="mb-8 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={imageUrl} 
            alt="Abstract representation of API connections and code" 
            className="object-cover w-full h-64 md:h-80"
          />
        </div>
        <p className="text-lg text-brand-gray-300 mb-6">
          Gain programmatic access to Validly's claim validation engine with our Developer API. Automate your workflows,
          integrate with your existing systems, and build custom solutions on top of our powerful AI.
        </p>
        <ul className="text-left text-brand-gray-300 space-y-2 mb-8 pl-4 list-disc list-inside marker:text-brand-premium-blue">
          <li>Validate claims programmatically for high-volume needs.</li>
          <li>Integrate report generation into your product development lifecycle.</li>
          <li>Pull data for custom dashboards and internal reporting.</li>
          <li>Build custom applications leveraging Validly's core technology.</li>
        </ul>
        <p className="text-md text-brand-gray-100 font-semibold mb-4">
          Access to the Validly Developer API allows for deep integration and customization.
        </p>
        {/* Button removed
        <IconButton
          label="Try API Access Free"
          onClick={onUpgradeProClick}
          variant="primary"
          size="lg"
          icon={<SparklesIcon className="w-5 h-5" />}
        />
        */}
      </div>
    </Section>
  );
};

export default ApiAccessPage;