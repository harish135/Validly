import React from 'react';
import Section from '../shared/Section';
import StarIcon from '../icons/StarIcon';
import type { IconProps } from '../../types'; // Ensure IconProps is available if not already

interface Review {
  id: number;
  name: string;
  title: string;
  rating: number;
  text: string;
  avatarInitial?: string; // For a simple text avatar
}

const mockReviews: Review[] = [
  { id: 1, name: 'Sarah L.', title: 'Founder, Aura Wellness', rating: 5, text: "Validly has revolutionized how we approach claim validation. The AI insights are incredibly accurate and save us so much time!", avatarInitial: "SL" },
  { id: 2, name: 'Mark B.', title: 'Product Manager, NutriBoost', rating: 4, text: "A fantastic tool for getting a quick, science-backed perspective on potential claims. The safe phrasing suggestions are invaluable.", avatarInitial: "MB" },
  { id: 3, name: 'Jessica P.', title: 'Marketing Lead, Evolve Supplements', rating: 5, text: "We've built so much trust with our customers by using Validly. The reports are professional and easy to understand.", avatarInitial: "JP" },
  { id: 4, name: 'Priya Sharma', title: 'Product Manager', rating: 5, text: "The insights are spot on and the UI is beautiful!", avatarInitial: "P" },
  { id: 5, name: 'Alex Kim', title: 'Startup Founder', rating: 4, text: "Helped us validate our wellness claims quickly.", avatarInitial: "A" },
  { id: 6, name: 'Carlos M.', title: 'Regulatory Affairs', rating: 5, text: "The compliance assistant is a game changer for our documentation process.", avatarInitial: "CM" },
  { id: 7, name: 'Emily R.', title: 'Brand Strategist', rating: 5, text: "Our team loves the easy-to-read reports and actionable insights.", avatarInitial: "ER" },
  { id: 8, name: 'Tom S.', title: 'Quality Lead', rating: 4, text: "The badge generator is a nice touch for our marketing materials.", avatarInitial: "TS" },
  { id: 9, name: 'Nina D.', title: 'Nutritionist', rating: 5, text: "I recommend Validly to all my clients for claim validation.", avatarInitial: "ND" },
];

const overallRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length;

const StarRatingDisplay: React.FC<{ rating: number, starClassName?: string }> = ({ rating, starClassName = "w-5 h-5" }) => (
  <div className="flex items-center" aria-label={`Rated ${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} filled={i < rating} className={`${starClassName} ${i < rating ? 'text-yellow-400' : 'text-brand-gray-600'}`} />
    ))}
  </div>
);

const ReviewCard: React.FC<{ review: Review, animationDelay: string }> = ({ review, animationDelay }) => (
  <div 
    className="bg-brand-gray-900 p-6 rounded-xl shadow-card border border-brand-gray-700 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-200 animate-premium-scale-up"
    style={{ animationDelay }}
  >
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 rounded-full bg-brand-premium-blue flex items-center justify-center text-white font-semibold mr-3">
        {review.avatarInitial || review.name.substring(0,1)}
      </div>
      <div>
        <h4 className="font-semibold text-brand-gray-100">{review.name}</h4>
        <p className="text-xs text-brand-gray-400">{review.title}</p>
      </div>
    </div>
    <StarRatingDisplay rating={review.rating} starClassName="w-4 h-4 mb-3" />
    <p className="text-brand-gray-300 text-sm leading-relaxed flex-grow">"{review.text}"</p>
  </div>
);

const ReviewsSection: React.FC = () => {
  return (
    <Section 
      title="What Our Users Say" 
      subtitle={`Trusted by wellness brands to build credibility and ensure compliance. Average Rating: ${overallRating.toFixed(1)}/5`}
      animate={true}
      id="reviews"
      className="bg-brand-gray-950"
    >
      <div className="flex justify-center mb-8">
        <StarRatingDisplay rating={Math.round(overallRating)} starClassName="w-7 h-7" />
        <span className="ml-2 text-xl font-semibold text-brand-gray-200">{overallRating.toFixed(1)} out of 5</span>
      </div>
      <div className="overflow-x-auto flex flex-nowrap py-2">
        {mockReviews.map((review, index) => (
          <div key={review.id} className="flex-shrink-0 w-80 mx-2">
            <ReviewCard review={review} animationDelay={`${index * 100}ms`} />
          </div>
        ))}
      </div>
    </Section>
  );
};

export default ReviewsSection;