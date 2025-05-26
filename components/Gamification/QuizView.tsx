
import React, { useState, useEffect, useCallback } from 'react';
import type { Quiz, QuizQuestion, QuizOption } from '../../types';
import IconButton from '../IconButton';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import CloseCircleIcon from '../icons/CloseCircleIcon'; // Corrected import
import LightBulbIcon from '../icons/LightBulbIcon';
import StarIcon from '../icons/StarIcon';
import ClockIcon from '../icons/ClockIcon'; // For timer

interface QuizViewProps {
  quiz: Quiz;
  onQuizComplete: (score: number, totalQuestions: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes for 10 questions

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const calculateScore = useCallback(() => {
    return selectedAnswers.reduce((acc, answerIdx, qIdx) => {
      if (answerIdx !== null && quiz.questions[qIdx]?.options[answerIdx]?.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [selectedAnswers, quiz.questions]);
  
  // Timer effect
  useEffect(() => {
    if (showResults || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, showResults]);

  // Auto-submit on timer end
  useEffect(() => {
    if (timeLeft <= 0 && !showResults) {
      setShowResults(true);
      const score = calculateScore();
      onQuizComplete(score, quiz.questions.length);
    }
  }, [timeLeft, showResults, quiz.questions.length, onQuizComplete, calculateScore]);


  const handleAnswerSelect = (optionIndex: number) => {
    if (showResults) return; // Don't allow changes after results are shown or timer ends
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      if (!showResults) { // Ensure onQuizComplete is called only once
        setShowResults(true);
        const score = calculateScore();
        onQuizComplete(score, quiz.questions.length);
      }
    }
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  if (showResults) {
    const score = calculateScore();
    const percentage = quiz.questions.length > 0 ? (score / quiz.questions.length) * 100 : 0;

    return (
      <div className="p-6 bg-brand-gray-800 rounded-lg shadow-xl border border-brand-gray-700 animate-fade-in">
        <h3 className="text-2xl font-bold text-brand-premium-blue text-center mb-4">Quiz Results: {quiz.title}</h3>
        <p className="text-3xl font-bold text-center mb-2">
          Your Score: {score} / {quiz.questions.length} ({percentage.toFixed(0)}%)
        </p>
        {timeLeft <=0 && !selectedAnswers.some(ans => ans !== null) && <p className="text-sm text-yellow-400 text-center mb-2">(Time ran out before any answers were submitted)</p>}
        {timeLeft <=0 && selectedAnswers.some(ans => ans !== null) && <p className="text-sm text-yellow-400 text-center mb-2">(Time ran out! Results based on submitted answers.)</p>}
        {percentage === 100 && <p className="text-lg text-yellow-400 text-center font-semibold mb-4">Perfect Score! <StarIcon className="inline w-5 h-5 mb-1" /></p>}
        
        <div className="space-y-4 mt-6 max-h-[50vh] overflow-y-auto pr-2">
            {quiz.questions.map((q, qIdx) => (
                <div key={q.id} className={`p-3 rounded-md border ${selectedAnswers[qIdx] !== null && q.options[selectedAnswers[qIdx]!].isCorrect ? 'bg-green-800 bg-opacity-30 border-green-600' : 'bg-red-800 bg-opacity-30 border-red-600'}`}>
                    <p className="font-semibold text-brand-gray-200 mb-1">{qIdx+1}. {q.questionText}</p>
                    <ul className="text-sm space-y-1">
                        {q.options.map((opt, optIdx) => (
                            <li key={optIdx} className={`flex items-center p-1.5 rounded ${opt.isCorrect ? 'text-green-300' : (selectedAnswers[qIdx] === optIdx ? 'text-red-300' : 'text-brand-gray-300')} ${selectedAnswers[qIdx] === optIdx ? (opt.isCorrect ? 'bg-green-700/30' : 'bg-red-700/30') : ''}`}>
                                {opt.isCorrect ? <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0 text-green-400"/> : (selectedAnswers[qIdx] === optIdx ? <CloseCircleIcon className="w-4 h-4 mr-2 flex-shrink-0 text-red-400"/> : <span className="w-4 h-4 mr-2 flex-shrink-0"></span>)}
                                {opt.text}
                            </li>
                        ))}
                    </ul>
                    { q.options.find(opt => opt.isCorrect)?.explanation && (
                         <p className="text-xs text-brand-gray-400 mt-2 pt-2 border-t border-brand-gray-600 flex items-start">
                            <LightBulbIcon className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-yellow-400 flex-shrink-0" />
                            Explanation: {q.options.find(opt => opt.isCorrect)?.explanation}
                         </p>
                    )}
                </div>
            ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-brand-gray-800 rounded-lg shadow-xl border border-brand-gray-700 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h3 className="text-xl font-semibold text-brand-gray-100 mb-1">{quiz.title}</h3>
            <p className="text-sm text-brand-gray-400">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        </div>
        <div className={`flex items-center p-2 rounded-md text-lg font-semibold ${timeLeft <= 60 ? 'text-red-400 animate-pulse' : 'text-brand-premium-blue'} bg-brand-gray-850 border border-brand-gray-700 shadow-inner`}>
            <ClockIcon className="w-5 h-5 mr-2" />
            {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="bg-brand-gray-850 p-4 rounded-md border border-brand-gray-700 mb-6 min-h-[60px]">
        <p className="text-lg text-brand-gray-200 font-medium">{currentQuestion?.questionText || "Loading question..."}</p>
      </div>

      {currentQuestion && (
        <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
            <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-3 rounded-md border-2 transition-all duration-150
                            ${selectedAnswers[currentQuestionIndex] === index 
                                ? 'bg-brand-premium-blue border-blue-400 text-white ring-2 ring-blue-300 ring-offset-2 ring-offset-brand-gray-800' 
                                : 'bg-brand-gray-700 border-brand-gray-600 hover:border-brand-premium-blue text-brand-gray-200 hover:bg-brand-gray-600'}`}
            >
                {String.fromCharCode(65 + index)}. {option.text}
            </button>
            ))}
        </div>
      )}

      <div className="text-right">
        <IconButton
          label={currentQuestionIndex < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
          onClick={handleNextQuestion}
          variant="primary"
          size="md"
          disabled={selectedAnswers[currentQuestionIndex] === null || !currentQuestion}
        />
      </div>
    </div>
  );
};

export default QuizView;
