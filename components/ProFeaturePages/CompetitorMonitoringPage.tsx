
import React from 'react';
import Section from '../shared/Section';
// import IconButton from '../IconButton'; // No longer needed
// import SparklesIcon from '../icons/SparklesIcon'; // No longer needed

interface CompetitorMonitoringPageProps {
  // onUpgradeProClick: () => void; // Removed
}

const CompetitorMonitoringPage: React.FC<CompetitorMonitoringPageProps> = (/*{ onUpgradeProClick }*/) => {
  // Image by Luke Chesser on Unsplash: https://unsplash.com/photos/JKUTrJ4vK00
  const imageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  return (
    <Section 
      title="Competitor Claim Monitoring"
      subtitle="Stay Ahead with AI-Powered Competitive Intelligence"
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="text-center max-w-3xl mx-auto p-2 md:p-4">
        <div className="mb-8 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={imageUrl} 
            alt="Data analytics dashboard for competitor monitoring" 
            className="object-cover w-full h-64 md:h-80 "
          />
        </div>
        
        <p className="text-lg text-brand-gray-300 mb-6">
          Unlock the ability to monitor your competitors' product claims in real-time. Validly will help you
          understand the landscape, identify opportunities, and ensure your marketing stays sharp and compliant.
        </p>
        <ul className="text-left text-brand-gray-300 space-y-2 mb-8 pl-4 list-disc list-inside marker:text-brand-premium-blue">
          <li>Track new claims made by key competitors.</li>
          <li>Analyze the scientific backing (or lack thereof) of competitor claims.</li>
          <li>Receive alerts on significant changes in the competitive claim landscape.</li>
          <li>Benchmark your claim strategy against others in your niche.</li>
        </ul>
        <p className="text-md text-brand-gray-100 font-semibold mb-4">
          This powerful feature helps you gain a competitive edge.
        </p>
        {/* Button removed
        <IconButton
          label="Try Competitor Monitoring Free"
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

export default CompetitorMonitoringPage;