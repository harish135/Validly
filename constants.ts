

import type { BadgeDefinition } from './types';

export const APP_NAME = "Validly";
export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";

export const MOCK_PDF_MESSAGE = "PDF export functionality is for demonstration. In a full app, a PDF would be generated here, potentially customized with your logo and colors.";
export const MOCK_BADGE_MESSAGE = "Trust badge code copied (simulated)! In a full app, you'd get an embeddable HTML snippet.";
export const MOCK_DOCX_MESSAGE = "DOCX export functionality is for demonstration. In a full app, a DOCX file would be generated here.";
export const MOCK_JSON_EXPORT_MESSAGE = "JSON data export functionality is for demonstration. In a full app, a JSON file with the report data would be provided here.";


export const CONFIDENCE_COLORS: { [key in import('./types').ConfidenceScore]: { bg: string, text: string, border: string, pillBg?: string } } = {
  High: { bg: 'bg-green-800', text: 'text-green-100', border: 'border-green-600', pillBg: 'bg-green-600' }, 
  Medium: { bg: 'bg-yellow-700', text: 'text-yellow-100', border: 'border-yellow-500', pillBg: 'bg-yellow-600' }, 
  Low: { bg: 'bg-red-800', text: 'text-red-100', border: 'border-red-600', pillBg: 'bg-red-600' }, 
  Undetermined: { bg: 'bg-brand-gray-700', text: 'text-brand-gray-100', border: 'border-brand-gray-600', pillBg: 'bg-brand-gray-600' },
};

export const CONFIDENCE_TEXT_COLORS: { [key in import('./types').ConfidenceScore]: string } = {
  High: 'text-green-400', 
  Medium: 'text-yellow-400', 
  Low: 'text-red-400', 
  Undetermined: 'text-brand-gray-400', 
};

export const COMING_SOON_FEATURES: string[] = ['Shopify Integration', 'Advanced Analytics', 'Competitor Claim Monitoring'];
export const DEFAULT_CUSTOM_COLOR = "#2563EB"; 

export const REPORT_CUSTOMIZATION_COLORS = [
  { name: 'Premium Blue', value: '#2563EB' },
  { name: 'Forest Green', value: '#16A34A' },
  { name: 'Ruby Red', value: '#DC2626' },
  { name: 'Goldenrod', value: '#F59E0B' },
  { name: 'Deep Purple', value: '#7C3AED' },
  { name: 'Steel Gray', value: '#64748B' }, 
];

// Gamification Constants
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'firstValidation', name: 'Claim Pioneer', description: 'Validated your first product claim.', iconName: 'ShieldCheckIcon', criteriaText: 'Validate 1 claim' },
  { id: 'fiveValidations', name: 'Validation Virtuoso', description: 'Validated 5 product claims.', iconName: 'ShieldCheckIcon', criteriaText: 'Validate 5 claims' },
  { id: 'tenValidations', name: 'Claim Champion', description: 'Validated 10 product claims.', iconName: 'TrophyIcon', criteriaText: 'Validate 10 claims' },
  { id: 'firstIngredientSearch', name: 'Ingredient Investigator', description: 'Analyzed your first ingredient.', iconName: 'BeakerIcon', criteriaText: 'Analyze 1 ingredient' },
  { id: 'fiveIngredientSearches', name: 'Molecule Explorer', description: 'Analyzed 5 ingredients.', iconName: 'BeakerIcon', criteriaText: 'Analyze 5 ingredients' },
  { id: 'tenIngredientSearches', name: 'Ingredient Guru', description: 'Analyzed 10 ingredients.', iconName: 'TrophyIcon', criteriaText: 'Analyze 10 ingredients' },
  { id: 'quizNovice', name: 'Quiz Novice', description: 'Completed your first wellness quiz.', iconName: 'QuizIcon', criteriaText: 'Complete 1 quiz' },
  { id: 'quizAdept', name: 'Quiz Adept', description: 'Completed 3 wellness quizzes.', iconName: 'QuizIcon', criteriaText: 'Complete 3 quizzes' },
  { id: 'quizMaster', name: 'Quiz Master', description: 'Achieved a perfect score on a quiz.', iconName: 'StarIcon', criteriaText: 'Perfect quiz score' },
  { id: 'challengeConqueror', name: 'Challenge Conqueror', description: 'Successfully completed a Validly challenge.', iconName: 'TargetIcon', criteriaText: 'Complete 1 challenge' },
  { id: 'forumContributor', name: 'Forum Voice', description: 'Posted a question or answer in the community forum.', iconName: 'ChatBubbleLeftRightIcon', criteriaText: 'Post in forum' },
  { id: 'pointsMilestone100', name: 'Centurion Club', description: 'Reached 100 points.', iconName: 'SparklesIcon', criteriaText: 'Earn 100 points' },
  { id: 'pointsMilestone500', name: 'High Scorer', description: 'Reached 500 points.', iconName: 'TrophyIcon', criteriaText: 'Earn 500 points' },
];

// QUIZ_TOPICS removed as it's no longer used for topic selection.
// The quiz is now generated based on user's Field of Study, Year, and Level.

export const QUIZ_LEVELS = [
  { id: 'Beginner', name: 'Beginner' },
  { id: 'Intermediate', name: 'Intermediate' },
  { id: 'Advanced', name: 'Advanced' },
];
