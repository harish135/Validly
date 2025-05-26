export type Page = 
  | 'home' 
  | 'validator' 
  | 'ingredient-analyser'
  | 'ai-news-digest' 
  | 'symptom-analyzer'
  | 'community-forum' 
  | 'achievements' 
  | 'quizzes' 
  | 'challenges' 
  | 'competitor-monitoring' 
  | 'api-access' 
  | 'support'
  | 'consumer-insights'
  | 'compliance-assistant'
  | 'formulation-advisor'
  | 'pricing'
  | 'contact'
  | 'terms-of-service';

// Add type for ImportMeta
declare global {
  interface ImportMeta {
    env: {
      VITE_GOOGLE_CLIENT_ID: string;
      [key: string]: string | boolean | undefined;
    };
  }
} 