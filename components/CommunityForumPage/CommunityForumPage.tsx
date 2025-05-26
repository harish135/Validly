
import React, { useState, useEffect, useCallback, useContext } from 'react'; // Added useContext
import Section from '../shared/Section';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import IconButton from '../IconButton';
import PlusCircleIcon from '../icons/PlusCircleIcon';
import ForumThreadList from './ForumThreadList';
import ForumThreadView from './ForumThreadView';
import NewQuestionForm from './NewQuestionForm';
import { generateSimulatedForumContent } from '../../services/geminiService';
import type { ForumThread, ForumPost, ForumAuthorType } from '../../types';
import { UserProgressContext } from '../../contexts/UserProgressContext'; // New
import ArrowLeftIcon from '../icons/ArrowLeftIcon'; // Import the shared icon

const generateId = () => Math.random().toString(36).substr(2, 9);

const CommunityForumPage: React.FC = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  
  const [currentView, setCurrentView] = useState<'list' | 'thread' | 'new_question'>('list');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userProgress = useContext(UserProgressContext); // New

  // Image by fauxels from Pexels: https://www.pexels.com/photo/group-of-people-in-a-meeting-3184338/
  const pageImageUrl = "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  const fetchInitialContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { threads: fetchedThreads, posts: fetchedPosts } = await generateSimulatedForumContent(7); 
      setThreads(fetchedThreads);
      setPosts(fetchedPosts);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An unknown error occurred while fetching forum content.');
      } else {
        setError('An unknown error occurred.');
      }
      setThreads([]); 
      setPosts([]);   
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialContent();
  }, [fetchInitialContent]);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setCurrentView('thread');
  };

  const handleBackToList = () => {
    setSelectedThreadId(null);
    setCurrentView('list');
  };

  const handleShowNewQuestionForm = () => {
    setCurrentView('new_question');
  };

  const handlePostQuestion = (title: string, content: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const now = Date.now();
      const newThreadId = generateId();
      const questionPostId = generateId();
      const authorName = "CurrentUser123"; 
      const authorType: ForumAuthorType = "User";

      const newQuestionPost: ForumPost = {
        id: questionPostId,
        threadId: newThreadId,
        authorName,
        authorType,
        content,
        timestamp: now,
        isQuestion: true,
      };

      const newThread: ForumThread = {
        id: newThreadId,
        title,
        originalQuestionPostId: questionPostId,
        authorName,
        authorType,
        timestamp: now,
        lastActivityTimestamp: now,
        replyCount: 0,
        tags: title.toLowerCase().split(" ").filter(tag => tag.length > 3).slice(0,3), 
      };

      setThreads(prev => [newThread, ...prev]);
      setPosts(prev => [newQuestionPost, ...prev]);
      userProgress?.logAction('forumPostsMade'); // New: Log action
      setIsSubmitting(false);
      handleSelectThread(newThreadId); 
    }, 700);
  };

  const handlePostAnswer = (content: string) => {
    if (!selectedThreadId) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const now = Date.now();
      const answerPostId = generateId();
      const authorName = "CurrentUser123"; 
      const authorType: ForumAuthorType = "User";

      const newAnswerPost: ForumPost = {
        id: answerPostId,
        threadId: selectedThreadId,
        authorName,
        authorType,
        content,
        timestamp: now,
        isQuestion: false,
      };
      setPosts(prev => [...prev, newAnswerPost]);
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread.id === selectedThreadId 
            ? { ...thread, replyCount: thread.replyCount + 1, lastActivityTimestamp: now }
            : thread
        )
      );
      userProgress?.logAction('forumPostsMade'); // New: Log action
      setIsSubmitting(false);
    }, 700);
  };
  
  const selectedThreadData = threads.find(t => t.id === selectedThreadId);

  return (
    <Section 
      title="Community Q&A Forum"
      subtitle="Engage with a community of users and (simulated) experts. Ask questions, share insights, and learn together. Posting earns you points!"
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-4xl mx-auto space-y-6 p-2 md:p-4">
        <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={pageImageUrl} 
            alt="Diverse group of people collaborating and discussing" 
            className="object-cover w-full h-48 md:h-64 opacity-80"
          />
        </div>

        <div className="p-4 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-lg text-yellow-200">
          <div className="flex items-start">
            <ShieldCheckIcon className="w-10 h-10 mr-3 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg text-yellow-300">Forum Disclaimer & Guidelines</h3>
              <ul className="text-sm list-disc list-inside pl-1 space-y-1 mt-1">
                <li>This forum is for demonstration purposes. Content may be AI-generated or user-submitted within this demo.</li>
                <li>Information shared here does NOT constitute professional medical, legal, or financial advice.</li>
                <li>Interactions are with simulated personas unless otherwise specified. Do not share sensitive personal information.</li>
                <li>All posts are subject to (simulated) moderation and community guidelines. Be respectful and constructive.</li>
              </ul>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-10"><LoadingSpinner message="Loading forum content..." size="lg" /></div>
        )}

        {error && !isLoading && (
          <div className="mt-8 p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card flex items-start">
            <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
            <div><h3 className="font-semibold text-lg">Error Loading Forum</h3><p className="text-sm text-red-200">{error}</p></div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {currentView === 'list' && (
              <>
                <div className="text-right mb-4">
                  <IconButton
                    label="Ask a New Question"
                    icon={<PlusCircleIcon className="w-5 h-5"/>}
                    onClick={handleShowNewQuestionForm}
                    variant="primary"
                    size="md"
                  />
                </div>
                <ForumThreadList threads={threads} onSelectThread={handleSelectThread} />
              </>
            )}

            {currentView === 'new_question' && (
              <>
               <IconButton
                  icon={<ArrowLeftIcon className="w-5 h-5"/>}
                  label="Back to All Questions"
                  onClick={handleBackToList}
                  variant="ghost"
                  size="sm"
                  className="mb-4 text-brand-premium-blue hover:text-blue-300"
                />
                <NewQuestionForm onSubmit={handlePostQuestion} isLoading={isSubmitting} />
              </>
            )}

            {currentView === 'thread' && selectedThreadData && (
              <ForumThreadView 
                thread={selectedThreadData} 
                posts={posts} 
                onPostAnswer={handlePostAnswer} 
                isPostingAnswer={isSubmitting}
                onBackToList={handleBackToList}
              />
            )}
             {!threads.length && currentView === 'list' && (
                <div className="text-center p-10 bg-brand-gray-800 rounded-lg">
                    <InfoIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
                    <h3 className="text-xl text-brand-gray-200 font-semibold">The forum is quiet right now.</h3>
                    <p className="text-brand-gray-400 mt-2">Be the first to spark a discussion by asking a question!</p>
                </div>
            )}
          </>
        )}
      </div>
    </Section>
  );
};

export default CommunityForumPage;
