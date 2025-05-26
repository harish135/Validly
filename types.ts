export type ConfidenceScore = 'High' | 'Medium' | 'Low' | 'Undetermined';

export interface SimulatedSource {
  title: string;
  url: string;
  snippet: string;
}

export interface DefinedTerm {
  term: string;
  definition: string;
}

export interface NuanceItem {
  aspect: string;
  detail: string;
}

export interface SimulatedChartData {
  chartTitle: string;
  dataType: string; // e.g., "Search Volume Index", "Estimated Percentage"
  labels: string[]; // e.g., ["Jan", "Feb", "Mar"]
  values: number[]; // e.g., [30, 50, 45]
}

export interface ReportData {
  id: string; // Unique ID for the report
  claim: string;
  confidenceScore: ConfidenceScore;
  summary: string;
  keyFindings: string[];
  safePhrasing: string[];
  simulatedSources: SimulatedSource[];
  definedTerms?: DefinedTerm[];
  nuanceAndConsiderations?: NuanceItem[]; 
  simulatedChartData?: SimulatedChartData;
  generatedTimestamp: number; 
  simulatedConsumerSentimentSnippet?: string; 
  simulatedFormulationAngle?: string;
  simulatedComplianceTip?: string;
}

export type GeminiReportResponse = Omit<ReportData, 'claim' | 'id' | 'generatedTimestamp'>;

export interface IconProps {
  className?: string;
}

export interface MyReportItem { 
  id: string;
  claim: string;
  confidenceScore: ConfidenceScore;
  timestamp: number; 
  fullReportData: ReportData; 
}

export interface CustomizationSettings {
  logoUrl: string;
  primaryColor: string; 
}

export interface RecommendedSpecialistInfo {
  departmentName: string; 
  specialistName?: string; 
  simulatedReasoning: string; 
}

export interface SymptomAnalysisResponse {
  aiUnderstandingOfProblem: string;
  simulatedPotentialAreas: string[]; 
  generalRecommendations: string[]; 
  recommendedSpecialist: RecommendedSpecialistInfo;
  criticalDisclaimer: string; 
}

export interface HealthcareNewsItem {
  id: string;
  title: string;
  simulatedSource: string; 
  publicationDate: string; 
  fullArticleText: string; 
  summary: string; 
  category: string; 
}

export type GeminiHealthcareNewsResponseItem = Omit<HealthcareNewsItem, 'id'>;

export interface IngredientBenefitOrUse {
  point: string; 
  simulatedEvidenceStrength?: 'Strong' | 'Moderate' | 'Limited' | 'Emerging' | 'Traditional Use Only'; 
}

export interface IngredientConsideration {
  aspect: string; 
  detail: string;
}

export interface IngredientInfo {
  ingredientName: string;
  overview: string; 
  simulatedCommonUsesOrBenefits: IngredientBenefitOrUse[]; 
  simulatedResearchHighlights: string[]; 
  simulatedConsiderations: IngredientConsideration[]; 
}

export interface IngredientAnalysisResponse extends IngredientInfo {
  criticalDisclaimer: string; 
}

export type GeminiIngredientAnalysisResponseItem = Omit<IngredientAnalysisResponse, 'ingredientName'>;

export interface ConsumerInsightsResponse {
  productConceptOrClaim: string; 
  targetAudience?: string; 
  aiUnderstanding: string;
  simulatedOverallSentiment: 'Positive' | 'Neutral' | 'Negative' | 'Mixed' | 'Undetermined';
  simulatedPositiveKeywords: string[];
  simulatedNegativeKeywords: string[];
  keyThemesFromSimulatedFeedback: string[];
  potentialResonancePoints: string[];
  potentialHesitationsOrConcerns: string[];
  suggestedMarketingAngles: string[];
  criticalDisclaimer: string;
}

export type GeminiConsumerInsightsResponseItem = Omit<ConsumerInsightsResponse, 'productConceptOrClaim' | 'targetAudience'>;

export interface SimulatedComplianceFlag {
  flag: string; 
  simulatedSeverity: 'High' | 'Medium' | 'Low' | 'Informational'; 
  simulatedExplanation: string; 
}

export interface ComplianceAnalysisResponse {
  analyzedCopy: string;
  aiUnderstanding: string;
  simulatedPotentialComplianceFlags: SimulatedComplianceFlag[];
  simulatedImprovementSuggestions: string[];
  generalSimulatedComplianceConsiderations: string[];
  criticalDisclaimer: string;
}

export type GeminiComplianceAnalysisResponseItem = Omit<ComplianceAnalysisResponse, 'analyzedCopy'>;

export interface KeySimulatedIngredient {
  ingredientName: string;
  simulatedRationale: string; 
  simulatedBenefit?: string; 
}
export interface FormulationIdea {
  ideaTitle: string; 
  conceptDescription: string; 
  keySimulatedIngredients: KeySimulatedIngredient[];
  potentialUniqueSellingPoints: string[];
  simulatedTargetConsumer?: string; 
}

export interface FormulationAdvisorResponse {
  query: string; 
  aiUnderstanding: string;
  simulatedFormulationIdeas: FormulationIdea[];
  generalSimulatedInnovationConsiderations: string[];
  criticalDisclaimer: string;
}

export type GeminiFormulationAdvisorResponseItem = Omit<FormulationAdvisorResponse, 'query'>;

export type ForumAuthorType = 'User' | 'Simulated Healthcare Professional' | 'Simulated Scientist' | 'Simulated Wellness Coach' | 'Moderator (Simulated)';

export interface ForumPost {
  id: string;
  threadId: string;
  authorName: string;
  authorType: ForumAuthorType;
  content: string;
  timestamp: number;
  isQuestion: boolean; 
}

export interface ForumThread {
  id: string;
  title: string; 
  originalQuestionPostId: string;
  authorName: string; 
  authorType: ForumAuthorType; 
  timestamp: number; 
  lastActivityTimestamp: number; 
  replyCount: number;
  isClosed?: boolean; 
  tags?: string[]; 
}

export interface GeminiForumPostSeed {
  authorName: string;
  authorType: ForumAuthorType;
  content: string;
}
export interface GeminiForumThreadSeed {
  threadTitle: string;
  question: GeminiForumPostSeed;
  answers: GeminiForumPostSeed[];
  tags?: string[];
}

// Gamification Types
export type BadgeId = 
  | 'firstValidation' 
  | 'fiveValidations'
  | 'tenValidations'
  | 'firstIngredientSearch'
  | 'fiveIngredientSearches'
  | 'tenIngredientSearches'
  | 'quizNovice' // Completed first quiz
  | 'quizAdept' // Completed 3 quizzes
  | 'quizMaster' // Completed a quiz with perfect score
  | 'challengeConqueror' // Completed a challenge
  | 'forumContributor' // Posted a question or answer
  | 'pointsMilestone100'
  | 'pointsMilestone500';

export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  iconName: 'TrophyIcon' | 'SparklesIcon' | 'ShieldCheckIcon' | 'LightBulbIcon' | 'CheckCircleIcon' | 'StarIcon' | 'BeakerIcon' | 'QuizIcon' | 'TargetIcon' | 'ChatBubbleLeftRightIcon';
  criteriaText: string; 
}

export interface UserProgressState {
  points: number;
  badgesEarned: Set<BadgeId>;
  validationsPerformed: number;
  ingredientsSearched: number;
  quizzesCompleted: number;
  challengesCompleted: number;
  forumPostsMade: number;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation?: string; 
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: QuizOption[];
  // topic: string; // Topic is now part of the parent Quiz object
}

export interface Quiz {
  id: string;
  title: string; // Will be AI-generated or generic
  topic: string; // Will store the AI-generated title or a generic one
  description: string; // AI-generated or generic description
  questions: QuizQuestion[];
  badgeAwarded?: BadgeId; 
}

// For AI to generate quiz questions
export interface PreQuizInfo {
  fieldOfStudy?: string;
  yearOfStudy?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GeminiQuizQuestionSeed {
  question: string;
  options: string[]; 
  correctAnswerIndex: number; 
  explanation?: string; 
}
export interface GeminiQuizResponse {
  quizTitle?: string; // AI can suggest a title for the generated quiz
  questions: GeminiQuizQuestionSeed[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'spotTheClaim'; 
  content: SpotTheClaimChallengeContent;
  badgeAwarded: BadgeId;
}

export interface SpotTheClaimChallengeContent {
  claim: string;
  isDubious: boolean; 
  explanation: string; 
}

export type GeminiSpotTheClaimResponse = SpotTheClaimChallengeContent;

export interface LeaderboardEntry {
  id: string;
  userName: string;
  score: number;
  isCurrentUser?: boolean; 
}

export type GeminiLeaderboardEntrySeed = Omit<LeaderboardEntry, 'id' | 'isCurrentUser'>;

// Define the type for 'import.meta.env' to resolve the TypeScript error.
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add gapi type definitions
declare namespace gapi {
  namespace auth2 {
    interface GoogleUser {
      getBasicProfile(): {
        getId(): string;
        getName(): string;
        getEmail(): string;
        getImageUrl(): string;
      };
    }

    interface AuthInstance {
      signIn(options?: { prompt?: string }): Promise<GoogleUser>;
      signOut(): Promise<void>;
      isSignedIn: {
        get(): boolean;
        listen(listener: (isSignedIn: boolean) => void): void;
      };
      currentUser: {
        get(): GoogleUser;
      };
    }

    function getAuthInstance(): AuthInstance;
  }

  namespace client {
    function init(config: {
      clientId: string;
      scope: string;
      discoveryDocs?: string[];
    }): Promise<void>;
  }

  function load(api: string, callback: () => void): void;
}
