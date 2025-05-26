import React, { useState } from 'react';
import Section from '../shared/Section';
import ChevronDownIcon from '../icons/ChevronDownIcon';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'What kind of claims can Validly analyze?',
    answer: 'Validly can analyze a wide range of product claims related to supplements, wellness products, and functional foods. For example, "Supports immune health," "Improves sleep quality," or "Reduces stress." The AI simulates research based on the information provided in the claim.',
  },
  {
    id: 2,
    question: 'Is the research cited by Validly real?',
    answer: 'Validly uses AI to simulate research findings and generate plausible-sounding sources. While the domains for simulated sources (like pubmed.ncbi.nlm.nih.gov) are real, the specific study IDs and detailed content are illustrative examples created by the AI to demonstrate the type of evidence it would look for. It does not access or cite real-time, specific research papers directly for claim validation in this demo version.',
  },
  {
    id: 3,
    question: 'How does the "Confidence Score" work?',
    answer: 'The Confidence Score (High, Medium, Low, Undetermined) is an AI-generated assessment of the general plausibility and typical research support for the type of claim made. It\'s based on patterns learned by the AI and should be considered an initial indicator, not a definitive scientific or legal judgment.',
  },
  {
    id: 4,
    question: 'Can I use Validly for legal or medical advice?',
    answer: 'No. Validly is an informational tool and does NOT provide legal, medical, or regulatory advice. The content generated, including "Safe Phrasing," is for illustrative purposes. Always consult with qualified legal and medical professionals for specific advice.',
  },
   {
    id: 5,
    question: 'What are the "Pro" features?',
    answer: 'Validly Pro (coming soon) will offer enhanced capabilities like unlimited report history, team collaboration, advanced export options (DOCX, JSON), competitor claim monitoring, API access, and priority support. Some current features like Ingredient AI, Health News AI, and Symptom AI are also designated as Pro previews.',
  },
];

const FAQAccordionItem: React.FC<{ item: FAQItem, isOpen: boolean, onClick: () => void, animationDelay: string }> = ({ item, isOpen, onClick, animationDelay }) => {
  return (
    <div 
        className="border-b border-brand-gray-700 animate-premium-slide-in-up"
        style={{ animationDelay }}
    >
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-left text-brand-gray-100 hover:bg-brand-gray-800 transition-colors duration-200"
          onClick={onClick}
          aria-expanded={isOpen}
          aria-controls={`faq-content-${item.id}`}
        >
          <span>{item.question}</span>
          <ChevronDownIcon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </h2>
      {isOpen && (
        <div 
            id={`faq-content-${item.id}`} 
            className="p-5 pt-0 animate-fade-in" // Use a simple fade-in for content
        >
          <p className="text-brand-gray-300 text-sm leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleToggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <Section 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about Validly and its features." 
        animate={true} 
        id="faq"
        className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-3xl mx-auto bg-brand-gray-850 rounded-lg shadow-inner border border-brand-gray-700">
        {faqData.map((item, index) => (
          <FAQAccordionItem
            key={item.id}
            item={item}
            isOpen={openFAQ === item.id}
            onClick={() => handleToggleFAQ(item.id)}
            animationDelay={`${index * 75}ms`}
          />
        ))}
      </div>
    </Section>
  );
};

export default FAQSection;