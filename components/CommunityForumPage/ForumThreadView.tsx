
import React from 'react';
import type { ForumThread, ForumPost } from '../../types';
import ForumPostDisplay from './ForumPostDisplay';
import NewAnswerForm from './NewAnswerForm';
import IconButton from '../IconButton';
import ArrowLeftIcon from '../icons/ArrowLeftIcon'; // Import the shared icon

interface ForumThreadViewProps {
  thread: ForumThread | null;
  posts: ForumPost[];
  onPostAnswer: (content: string) => void;
  isPostingAnswer: boolean;
  onBackToList: () => void;
}

const ForumThreadView: React.FC<ForumThreadViewProps> = ({ thread, posts, onPostAnswer, isPostingAnswer, onBackToList }) => {
  if (!thread) {
    return <p className="text-brand-gray-400 text-center py-6">Thread not found.</p>;
  }

  const questionPost = posts.find(p => p.id === thread.originalQuestionPostId);
  const answerPosts = posts.filter(p => p.threadId === thread.id && !p.isQuestion).sort((a,b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <IconButton
            icon={<ArrowLeftIcon className="w-5 h-5"/>}
            label="Back to All Questions"
            onClick={onBackToList}
            variant="ghost"
            size="sm"
            className="mb-4 text-brand-premium-blue hover:text-blue-300"
        />
        <h2 className="text-2xl md:text-3xl font-bold text-brand-gray-100 mb-2">{thread.title}</h2>
         {thread.tags && thread.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {thread.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 text-xs bg-brand-gray-700 text-brand-gray-300 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
      </div>

      {questionPost && <ForumPostDisplay post={questionPost} />}

      {answerPosts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-brand-gray-700">
          <h3 className="text-xl font-semibold text-brand-gray-200">{answerPosts.length} Answer{answerPosts.length === 1 ? '' : 's'}</h3>
          {answerPosts.map(post => (
            <ForumPostDisplay key={post.id} post={post} />
          ))}
        </div>
      )}
      
      {answerPosts.length === 0 && questionPost && (
         <p className="text-brand-gray-400 text-center py-4 border-t border-brand-gray-700 mt-4">
            No answers yet. Be the first to reply!
          </p>
      )}

      <NewAnswerForm onSubmit={onPostAnswer} isLoading={isPostingAnswer} />
    </div>
  );
};

export default ForumThreadView;
