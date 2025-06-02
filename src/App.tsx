import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import { Session, AuthChangeEvent, User as SupabaseUser } from '@supabase/supabase-js';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage/HomePage';
import ValidatorPage from './components/ValidatorPage/ValidatorPage';
import Modal from './components/Modal';
import MyReportsModal from './components/MyReportsModal';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { MOCK_PDF_MESSAGE, MOCK_BADGE_MESSAGE, DEFAULT_CUSTOM_COLOR, MOCK_DOCX_MESSAGE, MOCK_JSON_EXPORT_MESSAGE } from './constants';
import type { ReportData, MyReportItem, CustomizationSettings } from './types';
import { UserProgressProvider } from './contexts/UserProgressContext';
import { AppUserProvider } from './contexts/AppUserContext';

// Import Feature Pages
import CompetitorMonitoringPage from './components/ProFeaturePages/CompetitorMonitoringPage';
import ApiAccessPage from './components/ProFeaturePages/ApiAccessPage';
import SupportPage from './components/ProFeaturePages/SupportPage';
import SymptomAnalyzerPage from './components/SymptomAnalyzerPage/SymptomAnalyzerPage';
import HealthcareNewsPage from './components/HealthcareNewsPage/HealthcareNewsPage';
import IngredientAnalyserPage from './components/IngredientAnalyserPage/IngredientAnalyserPage';
import ConsumerInsightsPage from './components/ProFeaturePages/ConsumerInsightsPage';
import ComplianceAssistantPage from './components/ProFeaturePages/ComplianceAssistantPage';
import FormulationAdvisorPage from './components/ProFeaturePages/FormulationAdvisorPage';
import CommunityForumPage from './components/CommunityForumPage/CommunityForumPage';
import AchievementsPage from './components/Gamification/AchievementsPage';
import QuizzesPage from './components/Gamification/QuizzesPage';
import ChallengesPage from './components/Gamification/ChallengesPage';

// Import New Static Pages
import PricingPage from './components/StaticPages/PricingPage';
import ContactPage from './components/StaticPages/ContactPage';
import TermsPage from './components/StaticPages/TermsPage';
import LoadingSpinner from './components/LoadingSpinner';

interface ImportMeta {
  readonly env: {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_APP_BASE_URL?: string;
    readonly MODE: 'development' | 'production' | string;
  };
}

export type Page =
  | 'home' | 'validator' | 'ingredient-analyser' | 'ai-news-digest' | 'symptom-analyzer'
  | 'community-forum' | 'achievements' | 'quizzes' | 'challenges'
  | 'competitor-monitoring' | 'api-access' | 'support' | 'consumer-insights'
  | 'compliance-assistant' | 'formulation-advisor' | 'pricing' | 'contact' | 'terms-of-service';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isInitializingAuth, setIsInitializingAuth] = useState<boolean>(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; message: string }>({ title: '', message: '' });
  const [isSignInPromptOpen, setIsSignInPromptOpen] = useState<boolean>(false);
  const [pendingRedirectPath, setPendingRedirectPath] = useState<string | null>(null);
  const [myReports, setMyReports] = useState<MyReportItem[]>([]);
  const [isMyReportsModalOpen, setIsMyReportsModalOpen] = useState<boolean>(false);
  const [selectedReportForView, setSelectedReportForView] = useState<ReportData | null>(null);
  const [initialClaimForValidator, setInitialClaimForValidator] = useState<string>("");
  const [customizationSettings, setCustomizationSettings] = useState<CustomizationSettings>({
    logoUrl: '',
    primaryColor: DEFAULT_CUSTOM_COLOR,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userUsage, setUserUsage] = useState<{ triesLeft: number | 'Unlimited' | null }>({ triesLeft: null });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const fetchUserUsage = async () => {
      if (appUser && mounted) {
        console.log('App: Fetching user usage for appUser ID:', appUser.id);
        try {
          const { data, error } = await supabase.rpc('get_user_plan_and_usage', { p_user_id: appUser.id });
          if (!mounted) { console.log("App: fetchUserUsage, but unmounted before setting state."); return; }
          console.log('App: Fetched user plan/usage RPC result:', { data, error });
          if (error) {
            console.error('App: Error fetching user usage:', error);
            setUserUsage({ triesLeft: null });
            return;
          }
          if (data && data.length > 0) {
            const usage = data[0];
            const newTriesLeft = usage.is_unlimited ? 'Unlimited' : usage.requests_remaining;
            console.log('App: Setting triesLeft (from fetchUserUsage):', newTriesLeft);
            setUserUsage({ triesLeft: newTriesLeft });
          } else {
            console.warn('App: No usage data returned for user from RPC.');
            setUserUsage({ triesLeft: null });
          }
        } catch(rpcError) {
          console.error('App: Exception during fetchUserUsage RPC call:', rpcError);
          if (mounted) setUserUsage({ triesLeft: null });
        }
      } else if (!appUser) {
        console.log('App: No appUser, clearing userUsage and not fetching.');
        setUserUsage({ triesLeft: null });
      }
    };
    fetchUserUsage();
    return () => { mounted = false; }
  }, [appUser]);

  return (
    <AppUserProvider user={appUser}>
      <UserProgressProvider>
        <div className="flex flex-col min-h-screen bg-white font-sans">
          <Header
            user={appUser}
            onSignIn={handleGoogleSignIn}
            onSignOut={handleGoogleSignOut}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            myReportsCount={myReports.length}
            onToggleMyReports={handleToggleMyReportsModal}
            navigateTo={navigateTo}
            triesLeft={userUsage?.triesLeft}
          />
          {/* Rest of your JSX */}
        </div>
      </UserProgressProvider>
    </AppUserProvider>
  );
};

export default App;