import React from 'react';
import Section from '../shared/Section';
import CheckCircleIcon from '../icons/CheckCircleIcon'; 
import IconButton from '../IconButton';
import SparklesIcon from '../icons/SparklesIcon';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  priceFrequency: string;
  description: string;
  features: PlanFeature[];
  ctaText: string;
  isHighlighted?: boolean;
  timeLimit: string;
}

const PricingPage: React.FC = () => {
  const tiers: PricingTier[] = [
    {
      name: 'Free',
      price: '$0',
      priceFrequency: '/month',
      description: 'Perfect for exploring core features and occasional use.',
      timeLimit: '20 minutes per day',
      features: [
        { text: 'Claim Validator, Ingredient AI, Symptom AI, Personalized Quiz', included: true },
        { text: 'Basic Community Forum Access', included: true },
        { text: 'Standard Support', included: true },
        { text: 'Limited Report History', included: true },
      ],
      ctaText: 'Get Started for Free',
    },
    {
      name: 'Growth',
      price: '$24.99',
      priceFrequency: '/month',
      description: 'Ideal for regular users and growing brands needing more power.',
      timeLimit: '60 minutes per day',
      features: [
        { text: 'Claim Validator, Ingredient AI, Symptom AI, Personalized Quiz', included: true },
        { text: 'Full Community Forum Access', included: true },
        { text: 'Access to AI News Digest', included: true },
        { text: 'Standard Email Support', included: true },
        { text: 'Extended Report History', included: true },
      ],
      ctaText: 'Choose Growth Plan',
      isHighlighted: true,
    },
    {
      name: 'Pro',
      price: '$39.99',
      priceFrequency: '/month',
      description: 'For professionals and businesses requiring unlimited access and premium features.',
      timeLimit: 'Unlimited usage',
      features: [
        { text: 'Claim Validator, Ingredient AI, Symptom AI, Personalized Quiz', included: true },
        { text: 'All Growth Plan Features', included: true },
        { text: 'API Access (Coming Soon)', included: true },
        { text: 'Advanced Analytics (Coming Soon)', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Early Access to New Features', included: true },
      ],
      ctaText: 'Go Pro',
    },
  ];

  const pageImageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  const handleChoosePlan = (planName: string) => {
    alert(`You've selected the ${planName} plan! (This is a simulated action for demo purposes.)`);
  };

  return (
    <Section
      title="Our Plans & Pricing"
      subtitle="Choose the right plan to unlock AI-powered insights for your brand."
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-5xl mx-auto space-y-12 p-2 md:p-4">
        <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={pageImageUrl} 
            alt="Diverse team collaborating on a project, symbolizing growth and planning" 
            className="object-cover w-full h-48 md:h-72 opacity-80"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 flex flex-col border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-premium-slide-in-up
                ${tier.isHighlighted ? 'bg-brand-premium-blue border-blue-400 text-white' : 'bg-brand-gray-850 border-brand-gray-700 text-brand-gray-100'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {tier.isHighlighted && (
                <div className="absolute top-0 right-0 -mt-3 mr-3">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-semibold bg-yellow-400 text-brand-gray-900 shadow-md">
                    <SparklesIcon className="w-4 h-4 mr-1.5" />
                    Best Value
                  </span>
                </div>
              )}
              <h3 className={`text-2xl font-bold mb-1 ${tier.isHighlighted ? 'text-yellow-300' : 'text-brand-premium-blue'}`}>{tier.name}</h3>
              <div className="mb-4">
                <span className={`text-4xl font-extrabold ${tier.isHighlighted ? 'text-white' : 'text-brand-gray-50'}`}>{tier.price}</span>
                <span className={`text-md font-medium ${tier.isHighlighted ? 'text-blue-100' : 'text-brand-gray-400'}`}>{tier.priceFrequency}</span>
              </div>
              <p className={`text-sm mb-6 flex-grow ${tier.isHighlighted ? 'text-blue-100' : 'text-brand-gray-300'}`}>
                {tier.description}
              </p>
              
              <div className="mb-6">
                <p className={`font-semibold mb-1 ${tier.isHighlighted ? 'text-white' : 'text-brand-gray-100'}`}>Usage Limit:</p>
                <p className={`text-sm ${tier.isHighlighted ? 'text-blue-100' : 'text-brand-gray-300'}`}>{tier.timeLimit}</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-grow">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <CheckCircleIcon className={`w-5 h-5 mr-2 flex-shrink-0 ${tier.isHighlighted ? (feature.included ? 'text-yellow-300' : 'text-blue-200 opacity-50') : (feature.included ? 'text-green-400' : 'text-brand-gray-500 opacity-50')}`} />
                    <span className={`${tier.isHighlighted ? (feature.included ? 'text-blue-50' : 'text-blue-200 opacity-70') : (feature.included ? 'text-brand-gray-200' : 'text-brand-gray-500')}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <IconButton
                label={tier.ctaText}
                onClick={() => handleChoosePlan(tier.name)}
                variant={tier.isHighlighted ? 'custom' : 'primary'}
                customColorClass={tier.isHighlighted ? 'bg-white text-brand-premium-blue hover:bg-blue-100 w-full shadow-lg hover:shadow-xl' : undefined}
                size="lg"
                className={`w-full mt-auto ${!tier.isHighlighted ? 'bg-brand-premium-blue hover:bg-blue-700' : ''}`}
              />
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-brand-gray-400 mt-8">
          All plans include access to our foundational AI models. Usage limits are reset daily at midnight UTC.
          Contact us for enterprise solutions or custom needs.
        </p>
      </div>
    </Section>
  );
};

export default PricingPage;