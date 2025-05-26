import React from 'react';
import Section from '../shared/Section';
import IconButton from '../IconButton';
import SendIcon from '../icons/SendIcon';

interface CallToActionSectionProps {
  onGetStartedClick: () => void;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ onGetStartedClick }) => {
  return (
    <Section className="bg-brand-premium-blue text-white rounded-xl shadow-premium" animate={true}>
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Validate Your Claims?</h2>
        <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-blue-100">
          Stop guessing and start validating. Use Validly to ensure your product claims are backed by science and build unwavering trust with your customers.
        </p>
        <IconButton
          label="Try the Validator Tool Now"
          onClick={onGetStartedClick}
          variant="custom" 
          customColorClass="bg-white text-brand-premium-blue hover:bg-brand-gray-100 shadow-lg hover:shadow-xl"
          size="lg"
          className="text-lg px-10 py-4 transform hover:scale-105"
          icon={<SendIcon className="w-5 h-5 mr-2.5" />}
        />
      </div>
    </Section>
  );
};

export default CallToActionSection;