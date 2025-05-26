
import React, { useState, useEffect, useCallback } from 'react';
import Section from '../shared/Section';
import NewsItemCard from './NewsItemCard';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import IconButton from '../IconButton'; 
import { generateHealthcareNews } from '../../services/geminiService'; 
import type { HealthcareNewsItem } from '../../types';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import Modal from '../Modal'; // Import Modal

const HealthcareNewsPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<HealthcareNewsItem[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [isFullSummaryModalOpen, setIsFullSummaryModalOpen] = useState<boolean>(false);
  const [selectedNewsItemForSummary, setSelectedNewsItemForSummary] = useState<HealthcareNewsItem | null>(null);

  const pageImageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const GENERIC_NEWS_QUERY = "latest news summaries across diverse topics like technology, science, world events, business, and culture";

  const updateCategories = (newItems: HealthcareNewsItem[]) => {
    setAllCategories(prevCategories => {
      const currentCategories = new Set(prevCategories);
      newItems.forEach(item => currentCategories.add(item.category));
      const sortedCategories = Array.from(currentCategories).sort();
      if (sortedCategories.includes('all')) { 
        return ['all', ...sortedCategories.filter(c => c !== 'all')];
      }
      return ['all', ...sortedCategories];
    });
  };

  const fetchNews = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsLoadMoreLoading(true);
    }
    setError(null);
    try {
      const items = await generateHealthcareNews(GENERIC_NEWS_QUERY);
      if (isInitialLoad) {
        setNewsItems(items);
      } else {
        setNewsItems(prevItems => [...prevItems, ...items]);
      }
      updateCategories(items);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred while fetching news.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
        setInitialLoadDone(true);
      } else {
        setIsLoadMoreLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchNews(true);
  }, [fetchNews]);

  const handleLoadMore = () => {
    fetchNews(false);
  };

  const handleViewFullSummary = (item: HealthcareNewsItem) => {
    setSelectedNewsItemForSummary(item);
    setIsFullSummaryModalOpen(true);
  };

  const handleCloseFullSummaryModal = () => {
    setIsFullSummaryModalOpen(false);
    setSelectedNewsItemForSummary(null);
  };

  const filteredNewsItems = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <>
      <Section 
        title="AI News Digest"
        subtitle="Explore AI-curated (simulated) news summaries across various topics."
        animate={true}
        className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
      >
        <div className="max-w-4xl mx-auto space-y-8 p-2 md:p-4">
          <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
            <img 
              src={pageImageUrl} 
              alt="Abstract representation of global news and information flow" 
              className="object-cover w-full h-48 md:h-64 opacity-90"
            />
          </div>

          <div className="p-4 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-lg text-yellow-200">
            <div className="flex items-start">
              <InfoIcon className="w-8 h-8 mr-3 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg text-yellow-300">Informational Purposes Only</h3>
                <p className="text-sm">
                  The news articles presented here are AI-generated simulations for demonstration purposes. 
                  They do not represent real-time news updates from specific sources and should not be used for making critical decisions. 
                  Always consult trusted, verifiable news outlets and relevant professionals.
                </p>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="mt-8 flex justify-center bg-brand-gray-800 p-6 rounded-lg shadow-card border border-brand-gray-700">
              <LoadingSpinner message="Fetching latest AI-generated news..." size="lg" />
            </div>
          )}

          {error && !isLoading && (
            <div className="mt-8 p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card flex items-start">
              <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Error Fetching News</h3>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && initialLoadDone && newsItems.length > 0 && (
            <>
              <div className="mb-6 p-4 bg-brand-gray-800 rounded-md border border-brand-gray-700">
                <h4 className="text-sm font-semibold text-brand-gray-200 mb-2">Filter by Category:</h4>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map(category => (
                    <IconButton
                      key={category}
                      label={category === 'all' ? 'All News' : category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? 'primary' : 'secondary'}
                      size="sm"
                      className={`${selectedCategory === category ? '' : 'bg-brand-gray-700 border-brand-gray-600 hover:border-brand-premium-blue text-brand-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-1 gap-6">
                {filteredNewsItems.map((item, index) => (
                  <div key={item.id} className="animate-premium-scale-up" style={{ animationDelay: `${index * 50}ms`}}>
                    <NewsItemCard item={item} onViewFullSummary={handleViewFullSummary} />
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <IconButton
                  label={isLoadMoreLoading ? "Loading..." : "Load More News"}
                  onClick={handleLoadMore}
                  variant="primary"
                  size="md"
                  icon={<ChevronDownIcon className="w-5 h-5" />}
                  disabled={isLoadMoreLoading}
                />
              </div>
            </>
          )}
          
          {!isLoading && initialLoadDone && newsItems.length === 0 && !error && (
              <div className="mt-12 text-center p-8 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700">
                  <InfoIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-brand-gray-100">No News Available</h2>
                  <p className="text-brand-gray-400 mt-2 max-w-xl mx-auto">
                      The AI news curator couldn't fetch any news at this moment. Please try again later or click "Load More News".
                  </p>
                  <div className="mt-6">
                    <IconButton
                      label={isLoadMoreLoading ? "Loading..." : "Try Loading News"}
                      onClick={handleLoadMore}
                      variant="primary"
                      size="md"
                      icon={<ChevronDownIcon className="w-5 h-5" />}
                      disabled={isLoadMoreLoading}
                    />
                  </div>
              </div>
          )}
        </div>
      </Section>

      {selectedNewsItemForSummary && (
        <Modal
          isOpen={isFullSummaryModalOpen}
          onClose={handleCloseFullSummaryModal}
          title={selectedNewsItemForSummary.title}
          size="xl" // Use a larger modal for article text
        >
          <div className="text-sm text-brand-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            <p className="text-xs text-brand-gray-400 mb-2">
              Source: {selectedNewsItemForSummary.simulatedSource} | Date: {selectedNewsItemForSummary.publicationDate} | Category: {selectedNewsItemForSummary.category}
            </p>
            <div className="whitespace-pre-wrap">
              {selectedNewsItemForSummary.fullArticleText}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default HealthcareNewsPage;
