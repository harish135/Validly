
import React, { useState } from 'react';
import IconButton from '../IconButton';
import SendIcon from '../icons/SendIcon';
import InfoIcon from '../icons/InfoIcon';

interface NewAnswerFormProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

const NewAnswerForm: React.FC<NewAnswerFormProps> = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-brand-gray-850 rounded-lg shadow-md border border-brand-gray-700 space-y-3">
      <h4 className="text-lg font-semibold text-brand-gray-100">Post Your Answer</h4>
        <p className="text-xs text-brand-gray-400 flex items-start">
            <InfoIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-brand-premium-blue"/>
            <span>Share your knowledge or experience. Remember to be respectful and constructive. All submissions are subject to community guidelines and simulated moderation.</span>
        </p>
      <div>
        <label htmlFor="answer-content" className="sr-only">Your Answer</label>
        <textarea
          id="answer-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 h-28 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500 resize-y"
          disabled={isLoading}
          rows={4}
          required
        />
      </div>
      <div className="text-right">
        <IconButton 
          type="submit" 
          icon={<SendIcon />} 
          label="Submit Answer"
          disabled={isLoading || !content.trim()}
          variant="primary"
          size="md"
        />
      </div>
    </form>
  );
};

export default NewAnswerForm;
