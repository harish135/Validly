

import React, { useState, useContext, useEffect, useCallback } from 'react';
import Section from '../shared/Section';
import { UserProgressContext } from '../../contexts/UserProgressContext';
import type { Challenge, SpotTheClaimChallengeContent } from '../../types';
import { generateSpotTheClaimChallenge } from '../../services/geminiService';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import TargetIcon from '../icons/TargetIcon';
import IconButton from '../IconButton';
import LightBulbIcon from '../icons/LightBulbIcon'; // For explanation
import ShieldCheckIcon from '../icons/ShieldCheckIcon'; // For sound claim
import QuestionMarkCircleIcon from '../icons/QuestionMarkCircleIcon'; // For dubious claim
import ArrowPathIcon from '../icons/ArrowPathIcon'; // Corrected import
// FIX: Import BADGE_DEFINITIONS
import { BADGE_DEFINITIONS } from '../../constants';

const generateId = () => Math.random().toString(36).substr(2, 9);

const ChallengesPage: React.FC = () => {
  const userProgress = useContext(UserProgressContext);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userChoice, setUserChoice] = useState<'sound' | 'dubious' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const fetchChallenge = useCallback(async () => {
    setIsLoadingChallenge(true);
    setError(null);
    setUserChoice(null);
    setShowFeedback(false);
    try {
      const challengeContent: SpotTheClaimChallengeContent = await generateSpotTheClaimChallenge();
      setCurrentChallenge({
        id: generateId(),
        title: "Spot the Dubious Claim!",
        description: "Analyze the following product claim. Is it sound, or potentially dubious? Make your choice and see the AI's assessment!",
        type: 'spotTheClaim',
        content: challengeContent,
        badgeAwarded: 'challengeConqueror',
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load the challenge.');
      } else {
        setError('An unknown error occurred while loading the challenge.');
      }
    } finally {
      setIsLoadingChallenge(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleChoice = (choice: 'sound' | 'dubious') => {
    if (!currentChallenge) return;
    setUserChoice(choice);
    setShowFeedback(true);

    const correctChoice = currentChallenge.content.isDubious ? 'dubious' : 'sound';
    if (choice === correctChoice) {
      // FIX: Change 'challengeCompleted' to 'challengesCompleted'
      userProgress?.logAction('challengesCompleted'); 
      userProgress?.awardBadge(currentChallenge.badgeAwarded);
    }
  };
  
  if (isLoadingChallenge) {
    return (
      <Section title="Daily Challenge" subtitle="Sharpen your critical thinking skills!">
        <div className="text-center py-10"><LoadingSpinner message="Loading new challenge..." size="lg" /></div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section title="Challenge Error" subtitle="Oops!">
        <div className="max-w-md mx-auto p-6 bg-red-800 bg-opacity-30 border border-red-600 rounded-lg text-red-100 text-center">
          <InfoIcon className="w-10 h-10 mx-auto mb-3 text-red-300" />
          <h3 className="font-semibold text-lg mb-2">Could Not Load Challenge</h3>
          <p className="text-sm mb-4">{error}</p>
          <IconButton label="Try Again" onClick={fetchChallenge} variant="secondary" icon={<ArrowPathIcon />} />
        </div>
      </Section>
    );
  }

  if (!currentChallenge) {
     return (
      <Section title="No Challenge Available" subtitle="Please check back later.">
        <div className="max-w-md mx-auto p-6 bg-brand-gray-800 border border-brand-gray-700 rounded-lg text-center">
            <InfoIcon className="w-10 h-10 mx-auto mb-3 text-brand-premium-blue" />
            <p className="text-brand-gray-300">The AI couldn't prepare a challenge right now.</p>
            <IconButton className="mt-4" label="Try to Load Challenge" onClick={fetchChallenge} variant="primary" icon={<ArrowPathIcon />} />
        </div>
      </Section>
    );
  }

  const { content } = currentChallenge;
  const isCorrect = userChoice === (content.isDubious ? 'dubious' : 'sound');

  return (
    <Section 
      title={currentChallenge.title}
      subtitle={currentChallenge.description}
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-6">
        <div className="bg-brand-gray-800 p-6 rounded-lg shadow-xl border border-brand-gray-700 text-center animate-premium-scale-up">
          <TargetIcon className="w-12 h-12 text-brand-premium-blue mx-auto mb-4" />
          <p className="text-sm text-brand-gray-400 mb-2">Today's Claim to Analyze:</p>
          <blockquote className="text-xl font-semibold text-brand-gray-100 p-4 border-l-4 border-brand-premium-blue bg-brand-gray-850 rounded-r-md shadow-inner">
            "{content.claim}"
          </blockquote>
        </div>

        {!showFeedback && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            <IconButton
              label="Seems Sound / Reasonable"
              onClick={() => handleChoice('sound')}
              variant="custom"
              customColorClass="bg-green-600 hover:bg-green-500 text-white border border-green-500"
              size="lg"
              icon={<ShieldCheckIcon className="w-5 h-5"/>}
              className="flex-1"
            />
            <IconButton
              label="Potentially Dubious / Misleading"
              onClick={() => handleChoice('dubious')}
              variant="custom"
              customColorClass="bg-yellow-500 hover:bg-yellow-400 text-brand-gray-900 border border-yellow-400"
              size="lg"
              icon={<QuestionMarkCircleIcon className="w-5 h-5"/>}
              className="flex-1"
            />
          </div>
        )}

        {showFeedback && (
          <div className={`p-5 rounded-lg border-2 animate-fade-in-up shadow-lg
                          ${isCorrect ? 'bg-green-800 bg-opacity-40 border-green-500' 
                                       : 'bg-red-800 bg-opacity-40 border-red-500'}`}
          >
            <h4 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {isCorrect ? "Correct!" : "Not Quite!"}
            </h4>
            <p className="text-sm text-brand-gray-200 mb-1">
              Your choice: <span className="font-semibold">{userChoice === 'sound' ? "Seems Sound" : "Potentially Dubious"}</span>.
            </p>
            <p className="text-sm text-brand-gray-200 mb-3">
              AI Assessment: This claim is considered <span className="font-semibold">{content.isDubious ? "Potentially Dubious" : "Reasonable"}</span>.
            </p>
            <div className="p-3 bg-brand-gray-800 rounded-md border border-brand-gray-600">
                <p className="text-sm font-semibold text-brand-gray-100 mb-1 flex items-center">
                    <LightBulbIcon className="w-4 h-4 mr-2 text-yellow-400"/> AI's Explanation:
                </p>
                <p className="text-sm text-brand-gray-300">{content.explanation}</p>
            </div>
            {isCorrect && <p className="text-sm text-yellow-400 mt-3 font-semibold">You've earned {currentChallenge.badgeAwarded === 'challengeConqueror' ? '50' : ''} points and the "{BADGE_DEFINITIONS.find(b => b.id === currentChallenge.badgeAwarded)?.name || 'Challenge'}" badge!</p>}
            
            <div className="mt-5 text-center">
                 <IconButton label="Try Another Challenge" onClick={fetchChallenge} variant="primary" icon={<ArrowPathIcon className="w-4 h-4"/>}/>
            </div>
          </div>
        )}
         <div className="text-center text-xs text-brand-gray-500 pt-4 border-t border-brand-gray-700">
            <p>Challenges are AI-generated and for educational & engagement purposes. Assessments are based on common marketing principles and not legal/medical advice.</p>
         </div>
      </div>
    </Section>
  );
};

// Removed inline ArrowPathIcon definition

export default ChallengesPage;
