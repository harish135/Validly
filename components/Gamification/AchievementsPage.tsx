import React, { useContext, useEffect, useState } from 'react';
import Section from '../shared/Section';
import { UserProgressContext } from '../../contexts/UserProgressContext';
import { useAppUser } from '../../contexts/AppUserContext';
import type { BadgeDefinition, LeaderboardEntry } from '../../types';
import type { Page as AppPage } from '../../App'; 
import { BADGE_DEFINITIONS } from '../../constants';
import LoadingSpinner from '../LoadingSpinner';
import InfoIcon from '../icons/InfoIcon';
import TrophyIcon from '../icons/TrophyIcon';
import SparklesIcon from '../icons/SparklesIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import LightBulbIcon from '../icons/LightBulbIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import StarIcon from '../icons/StarIcon';
import BeakerIcon from '../icons/BeakerIcon';
import QuizIcon from '../icons/QuizIcon';
import TargetIcon from '../icons/TargetIcon';
import ChatBubbleLeftRightIcon from '../icons/ChatBubbleLeftRightIcon';
import IconButton from '../IconButton';
import ArrowPathIcon from '../icons/ArrowPathIcon';
import { fetchLeaderboardWithUserData, updateUserScore } from '../../services/leaderboard';

const iconMap: { [key: string]: React.FC<any> } = {
  TrophyIcon, SparklesIcon, ShieldCheckIcon, LightBulbIcon, CheckCircleIcon, StarIcon, BeakerIcon, QuizIcon, TargetIcon, ChatBubbleLeftRightIcon
};

const BadgeCard: React.FC<{ badgeDef: BadgeDefinition, earned: boolean }> = ({ badgeDef, earned }) => {
  const IconComponent = iconMap[badgeDef.iconName] || InfoIcon;
  return (
    <div 
      className={`p-4 rounded-lg border transition-all duration-200 transform flex flex-col items-center text-center h-full
                  ${earned 
                    ? 'bg-brand-gray-800 border-brand-premium-blue shadow-premium hover:shadow-xl hover:-translate-y-1' 
                    : 'bg-brand-gray-850 border-brand-gray-700 opacity-60'}`}
      title={earned ? badgeDef.description : `${badgeDef.description} (Not yet earned)`}
    >
      <IconComponent className={`w-10 h-10 mb-3 ${earned ? 'text-brand-premium-blue' : 'text-brand-gray-500'}`} />
      <h4 className={`font-semibold text-md ${earned ? 'text-brand-gray-100' : 'text-brand-gray-400'}`}>{badgeDef.name}</h4>
      <p className={`text-xs mt-1 ${earned ? 'text-brand-gray-300' : 'text-brand-gray-500'}`}>{badgeDef.criteriaText}</p>
      {!earned && <p className="text-xs mt-2 text-yellow-500 italic">Locked</p>}
    </div>
  );
};

const StatDisplay: React.FC<{ label: string, value: string | number, icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-brand-gray-800 p-4 rounded-lg shadow-card border border-brand-gray-700 text-center">
    <div className="flex justify-center items-center mb-2 text-brand-premium-blue">
      {React.cloneElement(icon as React.ReactElement<any>, {className: "w-7 h-7"})}
    </div>
    <p className="text-2xl font-bold text-brand-gray-50">{value}</p>
    <p className="text-sm text-brand-gray-400">{label}</p>
  </div>
);

interface AchievementsPageProps {
  navigateTo: (page: AppPage) => void;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ navigateTo }) => {
  const userProgress = useContext(UserProgressContext);
  const { user: appUser } = useAppUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoadingLeaderboard(true);
      try {
        const data = await fetchLeaderboardWithUserData();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLeaderboard([]);
      }
      setIsLoadingLeaderboard(false);
    };
    fetchLeaderboard();
  }, []);

  // Update user score in Supabase whenever points change
  useEffect(() => {
    if (userProgress && userProgress.points > 0 && appUser) {
      const updateScore = async () => {
        try {
          await updateUserScore(
            appUser.id,
            appUser.name,
            appUser.email,
            userProgress.points
          );
          // Refresh leaderboard after updating score
          const updatedData = await fetchLeaderboardWithUserData();
          setLeaderboard(updatedData);
        } catch (error) {
          console.error('Failed to update user score:', error);
        }
      };
      updateScore();
    }
  }, [userProgress?.points, appUser]);
  
  if (!userProgress || !appUser) {
    return <LoadingSpinner message="Loading user progress..." />;
  }

  const { points, badgesEarned, validationsPerformed, ingredientsSearched, quizzesCompleted, challengesCompleted, forumPostsMade, resetProgress } = userProgress;

  // Mark current user in leaderboard and add if not present
  const displayLeaderboard = [...leaderboard];
  if (points > 0 && !displayLeaderboard.some(e => e.isCurrentUser)) {
    const currentUserEntry: LeaderboardEntry = { 
      id: appUser.id, 
      userName: appUser.name, 
      userEmail: appUser.email, 
      avatarUrl: appUser.imageUrl, 
      score: points, 
      isCurrentUser: true 
    };
    displayLeaderboard.push(currentUserEntry);
  }
  displayLeaderboard.sort((a, b) => b.score - a.score);

  return (
    <Section 
      title="My Achievements & Progress"
      subtitle="Track your journey, earn badges, and compete on the real leaderboard!"
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-4xl mx-auto space-y-10 p-2 md:p-4">
        
        {/* User Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatDisplay label="Total Points" value={points} icon={<SparklesIcon />} />
          <StatDisplay label="Badges Earned" value={`${badgesEarned.size} / ${BADGE_DEFINITIONS.length}`} icon={<TrophyIcon />} />
          <StatDisplay label="Claims Validated" value={validationsPerformed} icon={<ShieldCheckIcon />} />
          <StatDisplay label="Ingredients Searched" value={ingredientsSearched} icon={<BeakerIcon />} />
          <StatDisplay label="Quizzes Completed" value={quizzesCompleted} icon={<QuizIcon />} />
          <StatDisplay label="Challenges Won" value={challengesCompleted} icon={<TargetIcon />} />
        </div>

        {/* Badges Section */}
        <div>
          <h3 className="text-2xl font-semibold text-brand-gray-100 mb-4 flex items-center">
            <TrophyIcon className="w-7 h-7 mr-2 text-yellow-400" /> Your Badges
          </h3>
          {BADGE_DEFINITIONS.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {BADGE_DEFINITIONS.map(badgeDef => (
                <BadgeCard key={badgeDef.id} badgeDef={badgeDef} earned={badgesEarned.has(badgeDef.id)} />
              ))}
            </div>
          ) : (
            <p className="text-brand-gray-400">No badges defined yet.</p>
          )}
        </div>

        {/* Community Leaderboard Section */}
        <div>
          <h3 className="text-2xl font-semibold text-brand-gray-100 mb-4 flex items-center">
            <StarIcon className="w-7 h-7 mr-2 text-yellow-400" /> Community Leaderboard
          </h3>
          {isLoadingLeaderboard ? (
            <LoadingSpinner message="Loading leaderboard..." />
          ) : displayLeaderboard.length > 0 ? (
            <div className="bg-brand-gray-800 p-4 rounded-lg shadow-md border border-brand-gray-700">
              <ol className="space-y-3">
                {displayLeaderboard.slice(0, 10).map((entry, index) => (
                  <li 
                    key={entry.id} 
                    className={`flex justify-between items-center p-3 rounded-md transition-all
                                ${entry.isCurrentUser ? 'bg-brand-premium-blue text-white shadow-lg scale-105' : 'bg-brand-gray-700 hover:bg-brand-gray-600'}`}
                  >
                    <div className="flex items-center">
                      {entry.avatarUrl && (
                        <img src={entry.avatarUrl} alt={entry.userName} className="w-8 h-8 rounded-full mr-3 border-2 border-brand-premium-blue" />
                      )}
                      <div>
                        <span className={`font-semibold w-6 text-center ${entry.isCurrentUser ? 'text-blue-100' : 'text-brand-gray-400'}`}>{index + 1}.</span>
                        <span className={`ml-2 font-medium ${entry.isCurrentUser ? 'text-white' : 'text-brand-gray-200'}`}>
                          {entry.isCurrentUser ? 'You' : entry.userName}
                        </span>
                      </div>
                    </div>
                    <span className={`font-bold ${entry.isCurrentUser ? 'text-yellow-300' : 'text-brand-premium-blue'}`}>{entry.score} pts</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-brand-gray-500 mt-3 text-center">
                Real-time leaderboard powered by Supabase
              </p>
            </div>
          ) : (
            <div className="bg-brand-gray-800 p-6 rounded-lg shadow-md border border-brand-gray-700 text-center">
              <p className="text-brand-gray-400 mb-2">No leaderboard data available yet.</p>
              <p className="text-xs text-brand-gray-500">Start earning points to appear on the leaderboard!</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8 pt-6 border-t border-brand-gray-700">
            <h4 className="text-lg font-semibold text-brand-gray-200 mb-2">Explore More!</h4>
            <p className="text-brand-gray-400 mb-4">Continue exploring Validly's tools to earn more points and badges.</p>
            <div className="flex flex-wrap justify-center gap-3">
                <IconButton label="Validate a Claim" onClick={() => navigateTo('validator')} variant="secondary" icon={<ShieldCheckIcon />} />
                <IconButton label="Take a Quiz" onClick={() => navigateTo('quizzes')} variant="secondary" icon={<QuizIcon />} />
                <IconButton label="Try a Challenge" onClick={() => navigateTo('challenges')} variant="secondary" icon={<TargetIcon />} />
            </div>
        </div>

        <div className="mt-10 text-center">
            <IconButton
                label="Reset My Progress (Demo Only)"
                onClick={() => {
                    if(window.confirm("Are you sure you want to reset all your progress? This is for demo purposes and cannot be undone.")) {
                        resetProgress();
                        // Force re-render or navigate to re-initialize
                        window.location.reload(); // Simplest for demo
                    }
                }}
                variant="danger"
                size="sm"
                icon={<ArrowPathIcon className="w-4 h-4"/>}
            />
            <p className="text-xs text-brand-gray-500 mt-2">Note: Progress is stored locally in your browser, but leaderboard scores are saved to Supabase.</p>
        </div>
      </div>
    </Section>
  );
};

export default AchievementsPage;
