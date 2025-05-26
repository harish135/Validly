

import React, { useState, useContext, useCallback } from 'react';
import Section from '../shared/Section';
import { UserProgressContext } from '../../contexts/UserProgressContext';
import type { Quiz, GeminiQuizResponse, PreQuizInfo } from '../../types';
import { generateQuizContent } from '../../services/geminiService';
import { QUIZ_LEVELS } from '../../constants'; // QUIZ_TOPICS removed
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import QuizIcon from '../icons/QuizIcon';
import IconButton from '../IconButton';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import SendIcon from '../icons/SendIcon';
import QuizView from './QuizView'; 

const generateId = () => Math.random().toString(36).substr(2, 9);

type QuizViewMode = 'initial_customization' | 'quiz_taking' | 'error_loading';


const QuizzesPage: React.FC = () => {
  const userProgress = useContext(UserProgressContext);
  
  const [currentView, setCurrentView] = useState<QuizViewMode>('initial_customization');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  
  const [fieldOfStudyInput, setFieldOfStudyInput] = useState('');
  const [yearOfStudyInput, setYearOfStudyInput] = useState('');
  const [levelInput, setLevelInput] = useState<PreQuizInfo['level']>('Beginner');

  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleStartTailoredQuiz = async () => {
    setIsLoadingQuiz(true);
    setError(null);
    setCurrentQuiz(null);

    const preQuizData: PreQuizInfo = {
        fieldOfStudy: fieldOfStudyInput.trim() || undefined,
        yearOfStudy: yearOfStudyInput.trim() || undefined,
        level: levelInput,
    };

    try {
      const quizData: GeminiQuizResponse = await generateQuizContent(preQuizData);
      if (!quizData.questions || quizData.questions.length === 0) {
        throw new Error("AI failed to generate quiz questions based on your inputs. Please try adjusting them or try again later.");
      }
      const newQuiz: Quiz = {
        id: generateId(),
        title: quizData.quizTitle || `Personalized Quiz for ${preQuizData.level} Level`,
        topic: quizData.quizTitle || `Personalized Quiz (${preQuizData.level}, ${preQuizData.fieldOfStudy || 'General'})`,
        description: `A quiz tailored to your background: ${preQuizData.level}${preQuizData.fieldOfStudy ? `, focusing on aspects related to ${preQuizData.fieldOfStudy}` : ''}.`,
        questions: quizData.questions.map(qSeed => ({
          id: generateId(),
          questionText: qSeed.question,
          options: qSeed.options.map((optText, idx) => ({
            text: optText,
            isCorrect: idx === qSeed.correctAnswerIndex,
            explanation: idx === qSeed.correctAnswerIndex ? qSeed.explanation : undefined,
          })),
        })),
        badgeAwarded: 'quizNovice', 
      };
      setCurrentQuiz(newQuiz);
      setCurrentView('quiz_taking');
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message || `Failed to load your personalized quiz.`);
        } else {
            setError(`An unknown error occurred while loading the quiz.`);
        }
        setCurrentView('error_loading');
    } finally {
      setIsLoadingQuiz(false);
    }
  };
  
  const handleQuizComplete = (score: number, totalQuestions: number) => {
    userProgress?.logAction('quizzesCompleted', score * 2.5); 
    if (score === totalQuestions && totalQuestions > 0) { 
        userProgress?.awardBadge('quizMaster');
    }
     if (userProgress) {
        if (userProgress.quizzesCompleted === 0) { 
          userProgress.awardBadge('quizNovice');
        } else if (userProgress.quizzesCompleted === 2) { 
          userProgress.awardBadge('quizAdept');
        }
    }
  };

  const handleBackToCustomization = () => {
    setCurrentQuiz(null);
    setError(null);
    setCurrentView('initial_customization');
  };

  const renderContent = () => {
    if (isLoadingQuiz && currentView === 'initial_customization') { 
        return <div className="text-center py-10"><LoadingSpinner message="Preparing your quiz..." size="lg"/></div>;
    }

    if (currentView === 'error_loading' && error) {
        return (
            <div className="p-4 bg-red-700 bg-opacity-80 border border-red-600 text-red-100 rounded-lg shadow-card">
                <div className="flex items-start mb-3">
                    <InfoIcon className="h-6 w-6 mr-3 text-red-300 flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-lg">Error Loading Quiz</h3>
                </div>
                <p className="text-sm text-red-200 mb-4">{error}</p>
                <IconButton 
                    label="Back to Customization"
                    onClick={handleBackToCustomization}
                    variant="secondary"
                    icon={<ArrowLeftIcon />}
                />
            </div>
        );
    }
    
    if (currentView === 'quiz_taking' && currentQuiz) {
        return (
          <>
            <IconButton 
                label="Back to Quiz Setup"
                onClick={handleBackToCustomization}
                variant="ghost"
                size="sm"
                icon={<ArrowLeftIcon className="w-5 h-5"/>}
                className="mb-4 text-brand-premium-blue hover:text-blue-300"
            />
            <QuizView quiz={currentQuiz} onQuizComplete={handleQuizComplete} />
          </>
        );
    }

    // Default: Show initial customization form (currentView === 'initial_customization')
    return (
      <div className="animate-fade-in">
        <form onSubmit={(e) => { e.preventDefault(); handleStartTailoredQuiz(); }} className="p-6 bg-brand-gray-800 rounded-lg shadow-xl border border-brand-gray-700 space-y-5">
          <div className="text-center">
            <QuizIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-brand-premium-blue mb-1">Personalized Quiz</h3>
            <p className="text-sm text-brand-gray-300 mb-4">
              Tell us a bit about your background to get a tailored quiz with 10 AI-generated questions and a timer.
            </p>
          </div>
          
          <div>
            <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-brand-gray-200 mb-1">
              Your Field of Study (Optional)
            </label>
            <input
              id="fieldOfStudy"
              type="text"
              value={fieldOfStudyInput}
              onChange={(e) => setFieldOfStudyInput(e.target.value)}
              placeholder="e.g., Biology, Nutrition, Engineering, Arts"
              className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none placeholder-brand-gray-500"
              disabled={isLoadingQuiz}
            />
             <p className="text-xs text-brand-gray-500 mt-1 italic">
             Enter your field (e.g., Engineering, History, Math, Science) or leave blank for a general knowledge quiz.
              </p>
          </div>

          <div>
            <label htmlFor="yearOfStudy" className="block text-sm font-medium text-brand-gray-200 mb-1">
              Your Year/Level of Study or Experience (Optional)
            </label>
            <input
              id="yearOfStudy"
              type="text" 
              value={yearOfStudyInput}
              onChange={(e) => setYearOfStudyInput(e.target.value)}
              placeholder="e.g., 1st Year, Postgraduate, 5+ Years Professional"
              className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none placeholder-brand-gray-500"
              disabled={isLoadingQuiz}
            />
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-brand-gray-200 mb-1">
              Your General Knowledge Level
            </label>
            <select
              id="level"
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value as PreQuizInfo['level'])}
              className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue focus:border-transparent outline-none"
              disabled={isLoadingQuiz}
            >
              {QUIZ_LEVELS.map(lvl => (
                <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-3">
            <IconButton 
              type="submit" 
              icon={<SendIcon />} 
              label={isLoadingQuiz ? "Preparing Quiz..." : "Start Personalized Quiz"}
              disabled={isLoadingQuiz}
              variant="primary"
              size="md"
              className="px-5 w-full sm:w-auto"
            />
          </div>
          {isLoadingQuiz && <p className="text-sm text-brand-premium-blue mt-1 animate-subtle-pulse text-center">AI is crafting your questions...</p>}
        </form>
      </div>
    );
  };

  return (
    <Section 
      title="Personalized Quiz" // Updated title
      subtitle="Tell us your field and level to get a personalized 10-question quiz on almost any topic! Earn points and badges." // Updated subtitle
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-xl mx-auto space-y-8 p-2 md:p-4">
        {renderContent()}
      </div>
    </Section>
  );
};

export default QuizzesPage;