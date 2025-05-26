
import React from 'react';
import type { ForumPost, ForumAuthorType } from '../../types';
import UserCircleIcon from '../icons/UserCircleIcon'; // General user
import AcademicCapIcon from '../icons/AcademicCapIcon'; // Scientist, Professional
import ShieldCheckIcon from '../icons/ShieldCheckIcon'; // Moderator

interface ForumPostDisplayProps {
  post: ForumPost;
}

const AuthorIcon: React.FC<{ type: ForumAuthorType, className?: string }> = ({ type, className = "w-5 h-5" }) => {
  switch (type) {
    case 'Simulated Healthcare Professional':
    case 'Simulated Scientist':
      return <AcademicCapIcon className={`${className} text-blue-400`} />;
    case 'Moderator (Simulated)':
      return <ShieldCheckIcon className={`${className} text-yellow-400`} />;
    case 'Simulated Wellness Coach':
      return <UserCircleIcon className={`${className} text-green-400`} />; // Example different color for coach
    case 'User':
    default:
      return <UserCircleIcon className={`${className} text-brand-gray-400`} />;
  }
};

const getAuthorColor = (type: ForumAuthorType): string => {
  switch (type) {
    case 'Simulated Healthcare Professional': return 'text-blue-300';
    case 'Simulated Scientist': return 'text-teal-300';
    case 'Moderator (Simulated)': return 'text-yellow-300 font-semibold';
    case 'Simulated Wellness Coach': return 'text-green-300';
    case 'User':
    default: return 'text-brand-gray-200';
  }
};

const ForumPostDisplay: React.FC<ForumPostDisplayProps> = ({ post }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const cardBaseClass = "p-4 rounded-lg shadow-md border";
  const questionClass = post.isQuestion ? "bg-brand-gray-850 border-brand-premium-blue" : "bg-brand-gray-800 border-brand-gray-700 ml-0 md:ml-8";

  return (
    <div className={`${cardBaseClass} ${questionClass} animate-fade-in-up`}>
      <div className="flex items-center mb-2">
        <AuthorIcon type={post.authorType} className="w-6 h-6 mr-2 flex-shrink-0" />
        <div>
          <span className={`font-semibold text-sm ${getAuthorColor(post.authorType)}`}>{post.authorName}</span>
          {post.authorType !== 'User' && <span className="text-xs text-brand-gray-500 ml-1">({post.authorType.replace('Simulated ', '')})</span>}
          <p className="text-xs text-brand-gray-500">{formatDate(post.timestamp)}</p>
        </div>
      </div>
      <div className="text-brand-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
        {post.content}
      </div>
    </div>
  );
};

export default ForumPostDisplay;
