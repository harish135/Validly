
import React from 'react';
import type { ForumThread } from '../../types';
import ChatBubbleLeftRightIcon from '../icons/ChatBubbleLeftRightIcon';
import UserCircleIcon from '../icons/UserCircleIcon';
import ClockIcon from '../icons/ClockIcon';

interface ForumThreadListProps {
  threads: ForumThread[];
  onSelectThread: (threadId: string) => void;
}

const ForumThreadList: React.FC<ForumThreadListProps> = ({ threads, onSelectThread }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (threads.length === 0) {
    return <p className="text-brand-gray-400 text-center py-6">No questions asked yet. Be the first!</p>;
  }

  return (
    <div className="space-y-3">
      {threads.sort((a,b) => b.lastActivityTimestamp - a.lastActivityTimestamp).map((thread, index) => (
        <button
          key={thread.id}
          onClick={() => onSelectThread(thread.id)}
          className="w-full text-left bg-brand-gray-800 p-4 rounded-lg shadow-card border border-brand-gray-700 hover:border-brand-premium-blue transition-all duration-200 transform hover:-translate-y-px animate-premium-slide-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
          aria-label={`View thread: ${thread.title}`}
        >
          <h3 className="text-lg font-semibold text-brand-premium-blue hover:text-blue-400 transition-colors mb-1 truncate" title={thread.title}>
            {thread.title}
          </h3>
          <div className="flex flex-wrap items-center text-xs text-brand-gray-400 space-x-3">
            <span className="flex items-center" title={`Asked by ${thread.authorName} (${thread.authorType.replace('Simulated ','')})`}>
              <UserCircleIcon className="w-3.5 h-3.5 mr-1 text-brand-gray-500" /> 
              {thread.authorName}
            </span>
            <span className="flex items-center" title="Replies">
              <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 mr-1 text-brand-gray-500" /> 
              {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
            </span>
            <span className="flex items-center" title={`Last activity: ${new Date(thread.lastActivityTimestamp).toLocaleString()}`}>
               <ClockIcon className="w-3.5 h-3.5 mr-1 text-brand-gray-500" />
              {formatDate(thread.lastActivityTimestamp)}
            </span>
          </div>
          {thread.tags && thread.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {thread.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-brand-gray-700 text-brand-gray-300 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ForumThreadList;
