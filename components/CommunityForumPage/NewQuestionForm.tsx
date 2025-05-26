
import React, { useState } from 'react';
import IconButton from '../IconButton';
import SendIcon from '../icons/SendIcon';
import InfoIcon from '../icons/InfoIcon';

interface NewQuestionFormProps {
  onSubmit: (title: string, content: string) => void;
  isLoading: boolean;
}

const NewQuestionForm: React.FC<NewQuestionFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(title.trim(), content.trim());
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-brand-gray-800 rounded-lg shadow-card border border-brand-gray-700 space-y-4">
      <h3 className="text-xl font-semibold text-brand-gray-100 mb-1">Ask a New Question</h3>
      <p className="text-xs text-brand-gray-400 mb-3 flex items-start">
        <InfoIcon className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-brand-premium-blue"/>
        <span>Pose your question to the community. Be clear and concise. All submissions are subject to community guidelines and simulated moderation.</span>
      </p>
      <div>
        <label htmlFor="question-title" className="block text-sm font-medium text-brand-gray-200 mb-1">
          Question Title
        </label>
        <input
          id="question-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Best supplements for joint health?"
          className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500"
          disabled={isLoading}
          maxLength={150}
          required
        />
      </div>
      <div>
        <label htmlFor="question-content" className="block text-sm font-medium text-brand-gray-200 mb-1">
          Your Question Details
        </label>
        <textarea
          id="question-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Provide more details about your question here..."
          className="w-full p-3 h-32 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none transition-all placeholder-brand-gray-500 resize-y"
          disabled={isLoading}
          rows={5}
          required
        />
      </div>
      <div className="text-right">
        <IconButton 
          type="submit" 
          icon={<SendIcon />} 
          label="Post Question"
          disabled={isLoading || !title.trim() || !content.trim()}
          variant="primary"
          size="md"
        />
      </div>
    </form>
  );
};

export default NewQuestionForm;
