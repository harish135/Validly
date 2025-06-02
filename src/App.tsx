import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Session } from '@supabase/supabase-js';

// Import Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../components/HomePage/HomePage';
import ValidatorPage from '../components/ValidatorPage/ValidatorPage';
import Modal from '../components/Modal';
import MyReportsModal from '../components/MyReportsModal';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';
import { MOCK_PDF_MESSAGE, MOCK_BADGE_MESSAGE, DEFAULT_CUSTOM_COLOR, MOCK_DOCX_MESSAGE, MOCK_JSON_EXPORT_MESSAGE } from '../constants';
import type { ReportData, MyReportItem, CustomizationSettings } from '../types';
import { UserProgressProvider } from '../contexts/UserProgressContext';
import { AppUserProvider } from '../contexts/AppUserContext';

// Import Feature Pages
import CompetitorMonitoringPage from '../components/ProFeaturePages/CompetitorMonitoringPage';
import ApiAccessPage from '../components/ProFeaturePages/ApiAccessPage';
import SupportPage from '../components/ProFeaturePages/SupportPage';
import SymptomAnalyzerPage from '../components/SymptomAnalyzerPage/SymptomAnalyzerPage';
import HealthcareNewsPage from '../components/HealthcareNewsPage/HealthcareNewsPage';
import IngredientAnalyserPage from '../components/IngredientAnalyserPage/IngredientAnalyserPage';
import ConsumerInsightsPage from '../components/ProFeaturePages/ConsumerInsightsPage';
import ComplianceAssistantPage from '../components/ProFeaturePages/ComplianceAssistantPage';
import FormulationAdvisorPage from '../components/ProFeaturePages/FormulationAdvisorPage';
import CommunityForumPage from '../components/CommunityForumPage/CommunityForumPage';
import AchievementsPage from '../components/Gamification/AchievementsPage';
import QuizzesPage from '../components/Gamification/QuizzesPage';
import ChallengesPage from '../components/Gamification/ChallengesPage';

// Import Static Pages
import PricingPage from '../components/StaticPages/PricingPage';
import ContactPage from '../components/StaticPages/ContactPage';
import TermsPage from '../components/StaticPages/TermsPage';
import LoadingSpinner from '../components/LoadingSpinner';

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

interface UserUsage {
  planName: string;
  minutesUsed: number;
  dailyLimit: number | null;
  isUnlimited: boolean;
  lastUpdated: number;
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
  const [userUsage, setUserUsage] = useState<UserUsage>({
    planName: 'Free',
    minutesUsed: 0,
    dailyLimit: 20,
    isUnlimited: false,
    lastUpdated: Date.now()
  });

  const navigate = useNavigate();
  const location = useLocation();

  const appBaseUrl = useMemo(() => {
    if (import.meta.env.MODE === 'production') {
      return `https://validly.pro`;
    }
    return import.meta.env.VITE_APP_BASE_URL || `http://localhost:${window.location.port || '3000'}`;
  }, []);

  const fetchUserUsage = useCallback(async () => {
    if (!appUser) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          subscription_plans (
            name,
            daily_time_allowance_minutes
          ),
          feature_usage_tracking (
            usage_count,
            used_at
          )
        `)
        .eq('user_id', appUser.id)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('App: Error fetching user usage:', error);
        return;
      }

      if (data) {
        const plan = data.subscription_plans;
        const usage = data.feature_usage_tracking || [];
        
        // Only count usage from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const minutesUsed = usage
          .filter((record: any) => new Date(record.used_at) >= today)
          .reduce((total: number, record: any) => total + (record.usage_count || 0), 0);

        setUserUsage({
          planName: plan?.name || 'Free',
          minutesUsed: minutesUsed,
          dailyLimit: plan?.daily_time_allowance_minutes ?? 20,
          isUnlimited: plan?.daily_time_allowance_minutes === null,
          lastUpdated: Date.now()
        });
      }
    } catch(error) {
      console.error('App: Exception during fetchUserUsage:', error);
    }
  }, [appUser]);

  useEffect(() => {
    if (!appUser) return;

    fetchUserUsage(); // Initial fetch
    
    const interval = setInterval(() => {
      fetchUserUsage();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [appUser, fetchUserUsage]);

  useEffect(() => {
    let mounted = true;
    console.log("App: Initializing Auth Effect Mounts");
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) { console.log("App: Auth init, but unmounted early."); return; }
        console.log("App: Initial session fetched:", currentSession ? 'Exists' : 'null');
        setSession(currentSession);
        if (currentSession?.user) {
          const supaUser = currentSession.user;
          setAppUser({
            id: supaUser.id,
            name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
            email: supaUser.email || '',
            imageUrl: supaUser.user_metadata?.avatar_url || ''
          });
        }
      } catch (error) {
        console.error("App: Error fetching initial session:", error);
      } finally {
        if (mounted) {
          console.log("App: Initializing Auth Finished.");
          setIsInitializingAuth(false);
        }
      }
    };
    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, currentSession: Session | null) => {
        if (!mounted) { console.log("App: onAuthStateChange, but unmounted."); return; }
        console.log('App: onAuthStateChange event:', _event, 'Session:', currentSession ? 'Exists' : 'null');
        setSession(currentSession);
        if (currentSession?.user) {
          const supaUser = currentSession.user;
          setAppUser({
            id: supaUser.id,
            name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
            email: supaUser.email || '',
            imageUrl: supaUser.user_metadata?.avatar_url || ''
          });
        } else {
          setAppUser(null);
        }
      }
    );
    return () => {
      mounted = false;
      console.log("App: Initializing Auth Effect Unmounts");
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    const currentPathForRedirect = location.pathname === '/' ? '/validator' : location.pathname;
    localStorage.setItem('redirectAfterSignIn', currentPathForRedirect);
    const redirectUrl = `${appBaseUrl}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl, queryParams: { access_type: 'offline', prompt: 'consent' } },
    });
    if (error) console.error('App: Error during Supabase OAuth sign-in:', error.message);
  };

  const handleGoogleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(`App: Sign-out error: ${error.message}`);
    } else {
      setInitialClaimForValidator("");
      setSelectedReportForView(null);
      navigate('/', { replace: true });
    }
  };

  const navigateTo = useCallback((page: Page) => {
    const pathMap: Record<Page, string> = {
      'home': '/',
      'validator': '/validator',
      'ingredient-analyser': '/ingredient-analyser',
      'ai-news-digest': '/ai-news-digest',
      'symptom-analyzer': '/symptom-analyzer',
      'community-forum': '/community-forum',
      'achievements': '/achievements',
      'quizzes': '/quizzes',
      'challenges': '/challenges',
      'competitor-monitoring': '/competitor-monitoring',
      'api-access': '/api-access',
      'support': '/support',
      'consumer-insights': '/consumer-insights',
      'compliance-assistant': '/compliance-assistant',
      'formulation-advisor': '/formulation-advisor',
      'pricing': '/pricing',
      'contact': '/contact',
      'terms-of-service': '/terms-of-service',
    };
    navigate(pathMap[page] || '/');
    setIsSidebarOpen(false);
  }, [navigate]);

  const openInfoModal = (title: string, message: string) => {
    setInfoModalContent({ title, message });
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => setIsInfoModalOpen(false);

  const handleExportPDF = useCallback(() => openInfoModal("Export PDF (Mock)", MOCK_PDF_MESSAGE), []);
  const handleGenerateBadge = useCallback(() => openInfoModal("Generate Trust Badge (Mock)", MOCK_BADGE_MESSAGE), []);
  const handleExportDocx = useCallback(() => openInfoModal("Export as DOCX (Mock)", MOCK_DOCX_MESSAGE), []);
  const handleExportJson = useCallback(() => openInfoModal("Export Data (JSON) (Mock)", MOCK_JSON_EXPORT_MESSAGE), []);

  const handleReportGenerated = useCallback((report: ReportData) => {
    setMyReports(prevReports => {
      const newReportItem: MyReportItem = {
        id: report.id,
        claim: report.claim,
        confidenceScore: report.confidenceScore,
        timestamp: report.generatedTimestamp,
        fullReportData: report
      };
      return [newReportItem, ...prevReports.filter(r => r.id !== report.id).slice(0, 9)];
    });
  }, []);

  const handleSelectMyReportItem = (reportData: ReportData) => {
    setSelectedReportForView(reportData);
    setInitialClaimForValidator(reportData.claim);
    navigate('/validator');
    setIsMyReportsModalOpen(false);
    setIsSidebarOpen(false);
  };

  const handleCustomizationChange = (settings: CustomizationSettings) => setCustomizationSettings(settings);

  const handleToggleMyReportsModal = () => setIsMyReportsModalOpen(!isMyReportsModalOpen);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const validatorPageProps = useMemo(() => ({
    onExportPDF: handleExportPDF,
    onGenerateBadge: handleGenerateBadge,
    onExportDocx: handleExportDocx,
    onExportJson: handleExportJson,
    onReportGenerated: handleReportGenerated,
    initialReport: selectedReportForView,
    initialClaim: initialClaimForValidator,
    customizationSettings,
    onCustomizationChange: handleCustomizationChange
  }), [
    selectedReportForView,
    initialClaimForValidator,
    customizationSettings,
    handleExportPDF,
    handleGenerateBadge,
    handleExportDocx,
    handleExportJson,
    handleReportGenerated,
    handleCustomizationChange
  ]);

  const getTimeDisplay = () => {
    if (userUsage.isUnlimited) {
      return 'Unlimited';
    }
    if (userUsage.dailyLimit) {
      const remaining = Math.max(0, userUsage.dailyLimit - userUsage.minutesUsed);
      return `${remaining} minutes left today`;
    }
    return null;
  };

  if (isInitializingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingSpinner message="Initializing application..." />
      </div>
    );
  }

  return (
    <AppUserProvider user={appUser}>
      <UserProgressProvider>
        <div className="flex flex-col min-h-screen bg-white font-sans">
          <Header
            user={appUser}
            onSignIn={handleGoogleSignIn}
            onSignOut={handleGoogleSignOut}
            onToggleSidebar={handleToggleSidebar}
            isSidebarOpen={isSidebarOpen}
            myReportsCount={myReports.length}
            onToggleMyReports={handleToggleMyReportsModal}
            navigateTo={navigateTo}
            timeLeft={getTimeDisplay()}
            planName={userUsage.planName}
          />
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            navigateTo={navigateTo}
            currentPage={(location.pathname.substring(1) || 'home') as Page}
          />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-premium-slide-in-up">
            <Routes>
              <Route path="/" element={<HomePage navigateTo={navigateTo} myReportsCount={myReports.length} />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms-of-service" element={<TermsPage />} />
              <Route path="/validator" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <ValidatorPage {...validatorPageProps} />
                </ProtectedRoute>
              } />
              <Route path="/ingredient-analyser" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <IngredientAnalyserPage />
                </ProtectedRoute>
              } />
              <Route path="/ai-news-digest" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <HealthcareNewsPage />
                </ProtectedRoute>
              } />
              <Route path="/symptom-analyzer" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <SymptomAnalyzerPage />
                </ProtectedRoute>
              } />
              <Route path="/community-forum" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <CommunityForumPage />
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <AchievementsPage navigateTo={navigateTo} />
                </ProtectedRoute>
              } />
              <Route path="/quizzes" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <QuizzesPage />
                </ProtectedRoute>
              } />
              <Route path="/challenges" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <ChallengesPage />
                </ProtectedRoute>
              } />
              <Route path="/competitor-monitoring" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <CompetitorMonitoringPage />
                </ProtectedRoute>
              } />
              <Route path="/api-access" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <ApiAccessPage />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <SupportPage />
                </ProtectedRoute>
              } />
              <Route path="/consumer-insights" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <ConsumerInsightsPage />
                </ProtectedRoute>
              } />
              <Route path="/compliance-assistant" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <ComplianceAssistantPage />
                </ProtectedRoute>
              } />
              <Route path="/formulation-advisor" element={
                <ProtectedRoute
                  session={session}
                  setPendingRedirectPath={setPendingRedirectPath}
                  setIsSignInPromptOpen={setIsSignInPromptOpen}
                >
                  <FormulationAdvisorPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/\" replace />} />
            </Routes>
          </main>
          <Footer navigateTo={navigateTo} />

          <Modal isOpen={isInfoModalOpen} onClose={closeInfoModal} title={infoModalContent.title}>
            <p>{infoModalContent.message}</p>
          </Modal>

          <Modal 
            isOpen={isSignInPromptOpen} 
            onClose={() => setIsSignInPromptOpen(false)} 
            title="Sign In Required"
          >
            <div className="text-center">
              <p className="mb-4 text-gray-700">
                Please sign in to access this feature. Sign in to continue to:
                <br />
                <span className="font-semibold text-brand-premium-blue">
                  {pendingRedirectPath?.split('/').pop()?.replace(/-/g, ' ').toUpperCase()}
                </span>
              </p>
              <div className="flex justify-center space-x-4">
                <button onClick={handleGoogleSignIn} className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Sign In</button>
                <button onClick={() => setIsSignInPromptOpen(false)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Cancel</button>
              </div>
            </div>
          </Modal>

          <MyReportsModal
            isOpen={isMyReportsModalOpen}
            onClose={handleToggleMyReportsModal}
            myReportItems={myReports}
            onSelectMyReportItem={handleSelectMyReportItem}
          />
        </div>
      </UserProgressProvider>
    </AppUserProvider>
  );
};

export default App;