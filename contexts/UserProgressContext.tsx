

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { UserProgressState, BadgeId, BadgeDefinition } from '../types';
import { BADGE_DEFINITIONS } from '../constants'; // Will create this file

const LOCAL_STORAGE_KEY = 'validlyUserProgress';

const initialProgressState: UserProgressState = {
  points: 0,
  badgesEarned: new Set<BadgeId>(),
  validationsPerformed: 0,
  ingredientsSearched: 0,
  quizzesCompleted: 0,
  challengesCompleted: 0,
  forumPostsMade: 0,
};

interface UserProgressContextType extends UserProgressState {
  logAction: (actionType: keyof Omit<UserProgressState, 'points' | 'badgesEarned'>, points?: number) => void;
  awardBadge: (badgeId: BadgeId) => void;
  resetProgress: () => void;
}

export const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

interface UserProgressProviderProps {
  children: ReactNode;
}

export const UserProgressProvider: React.FC<UserProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgressState>(() => {
    try {
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        // Convert array of badge IDs back to a Set
        return { ...parsed, badgesEarned: new Set(parsed.badgesEarned || []) };
      }
    } catch (error) {
      console.error("Error loading user progress from localStorage:", error);
    }
    return initialProgressState;
  });

  useEffect(() => {
    try {
      // Convert Set to array for JSON stringification
      const progressToStore = { ...progress, badgesEarned: Array.from(progress.badgesEarned) };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressToStore));
    } catch (error) {
      console.error("Error saving user progress to localStorage:", error);
    }
  }, [progress]);

  const awardBadge = useCallback((badgeId: BadgeId) => {
    setProgress(prev => {
      if (!prev.badgesEarned.has(badgeId)) {
        const newBadges = new Set(prev.badgesEarned);
        newBadges.add(badgeId);
        const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
        const pointsFromBadge = badgeDef ? (badgeDef.id.includes('Milestone') ? 0 : 20) : 0; // Example: 20 points per badge (except milestones)
        // Could show a toast/notification here for a new badge
        console.log(`Badge awarded: ${badgeId}`);
        return { ...prev, badgesEarned: newBadges, points: prev.points + pointsFromBadge };
      }
      return prev;
    });
  }, []);

  const checkAndAwardBadges = useCallback((updatedProgress: UserProgressState) => {
    BADGE_DEFINITIONS.forEach(badge => {
      if (updatedProgress.badgesEarned.has(badge.id)) return; // Already earned

      let criteriaMet = false;
      switch (badge.id) {
        case 'firstValidation': criteriaMet = updatedProgress.validationsPerformed >= 1; break;
        case 'fiveValidations': criteriaMet = updatedProgress.validationsPerformed >= 5; break;
        case 'tenValidations': criteriaMet = updatedProgress.validationsPerformed >= 10; break;
        case 'firstIngredientSearch': criteriaMet = updatedProgress.ingredientsSearched >= 1; break;
        case 'fiveIngredientSearches': criteriaMet = updatedProgress.ingredientsSearched >= 5; break;
        case 'tenIngredientSearches': criteriaMet = updatedProgress.ingredientsSearched >= 10; break;
        case 'quizNovice': criteriaMet = updatedProgress.quizzesCompleted >= 1; break;
        case 'quizAdept': criteriaMet = updatedProgress.quizzesCompleted >= 3; break;
        // quizMaster might be awarded directly after a quiz with perfect score
        case 'challengeConqueror': criteriaMet = updatedProgress.challengesCompleted >= 1; break;
        case 'forumContributor': criteriaMet = updatedProgress.forumPostsMade >=1; break;
        case 'pointsMilestone100': criteriaMet = updatedProgress.points >= 100; break;
        case 'pointsMilestone500': criteriaMet = updatedProgress.points >= 500; break;
      }
      if (criteriaMet) {
        awardBadge(badge.id);
      }
    });
  }, [awardBadge]);


  const logAction = useCallback((
    actionType: keyof Omit<UserProgressState, 'points' | 'badgesEarned'>, 
    pointsAwarded: number = 0
  ) => {
    setProgress(prev => {
      const updatedCount = (prev[actionType] || 0) + 1;
      let actionPoints = 0;
      // FIX: Use plural action types in switch cases
      switch(actionType) {
        case 'validationsPerformed': actionPoints = 10; break;
        case 'ingredientsSearched': actionPoints = 5; break;
        case 'quizzesCompleted': actionPoints = 25; break; // Base points, could be modified by score
        case 'challengesCompleted': actionPoints = 50; break; // If successful
        case 'forumPostsMade': actionPoints = 5; break;
        default: actionPoints = 0;
      }
      
      const newPoints = prev.points + actionPoints + pointsAwarded;
      const newState = { ...prev, [actionType]: updatedCount, points: newPoints };
      checkAndAwardBadges(newState); // Check for badges based on the new state
      return newState;
    });
  }, [checkAndAwardBadges]);


  const resetProgress = () => {
    setProgress(initialProgressState);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <UserProgressContext.Provider value={{ ...progress, logAction, awardBadge, resetProgress }}>
      {children}
    </UserProgressContext.Provider>
  );
};