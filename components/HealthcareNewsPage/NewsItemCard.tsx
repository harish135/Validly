
import React from 'react';
import type { HealthcareNewsItem } from '../../types';
import NewspaperIcon from '../icons/NewspaperIcon'; 
import IconButton from '../IconButton';
import DocumentTextIcon from '../icons/DocumentTextIcon';

interface NewsItemCardProps {
  item: HealthcareNewsItem;
  onViewFullSummary: (item: HealthcareNewsItem) => void; // New prop
}

const NewsItemCard: React.FC<NewsItemCardProps> = ({ item, onViewFullSummary }) => {
  return (
    <article className="bg-brand-gray-800 p-5 rounded-lg shadow-card border border-brand-gray-700 hover:border-brand-premium-blue transition-colors duration-200 ease-in-out transform hover:-translate-y-0.5 flex flex-col h-full">
      <div className="flex items-start mb-3">
        <NewspaperIcon className="w-6 h-6 text-brand-premium-blue mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-brand-gray-50 hover:text-brand-premium-blue transition-colors">
            {item.title}
          </h3>
          <div className="text-xs text-brand-gray-400 mt-1 space-x-2">
            <span>Source: <span className="font-medium text-brand-gray-300">{item.simulatedSource}</span></span>
            <span>&bull;</span>
            <span>Date: <span className="font-medium text-brand-gray-300">{item.publicationDate}</span></span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-brand-gray-300 leading-relaxed mb-3 flex-grow">
        {item.summary}
      </p>
      
      <div className="mt-auto pt-3 border-t border-brand-gray-700 flex justify-between items-center">
        {item.category && (
          <span className="inline-block bg-brand-premium-blue bg-opacity-10 text-brand-premium-blue text-xs font-medium px-2.5 py-1 rounded-full">
            Category: {item.category}
          </span>
        )}
        <IconButton
            icon={<DocumentTextIcon className="w-4 h-4"/>}
            label="Full Summary"
            onClick={() => onViewFullSummary(item)}
            variant="ghost"
            size="sm"
            className="text-xs text-brand-gray-300 hover:text-brand-premium-blue"
        />
      </div>
    </article>
  );
};

export default NewsItemCard;
