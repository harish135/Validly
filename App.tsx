import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './supabase'; // Path to your supabase.ts
import { Session, AuthChangeEvent, User as SupabaseUser } from '@supabase/supabase-js'; // Import Supabase User type

// Import Components (ensure paths are correct)
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage/HomePage';
import ValidatorPage from './components/ValidatorPage/ValidatorPage';
import Modal from './components/Modal';
import MyReportsModal from './components/MyReportsModal';
import Sidebar from './components/Sidebar';
import { MOCK_PDF_MESSAGE, MOCK_BADGE_MESSAGE, DEFAULT_CUSTOM_COLOR, MOCK_DOCX_MESSAGE, MOCK_JSON_EXPORT_MESSAGE } from './constants';
import type { ReportData, MyReportItem, CustomizationSettings } from './types';
import { UserProgressProvider } from './contexts/UserProgressContext';

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
import LoadingSpinner from './components/LoadingSpinner'; // Assuming you have this component


// Add type for ImportMeta to satisfy TypeScript
interface ImportMeta {
  readonly env: {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_APP_BASE_URL?: string; // Optional for production, required for local dev redirect
    readonly MODE: 'development' | 'production' | string;
  };
}

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

// Define a more specific type for your app's user state, derived from SupabaseUser
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

  const navigate = useNavigate();
  const location = useLocation();

  const appBaseUrl = useMemo(() => {
    if (import.meta.env.MODE === 'production') {
      return `https://validly.pro`;
    }
    return import.meta.env.VITE_APP_BASE_URL || `http://localhost:${window.location.port || '3000'}`;
  }, []);

  // ProtectedRoute component inside App to access session
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!session) {
        setPendingRedirectPath(location.pathname);
        setIsSignInPromptOpen(true);
        navigate('/', { replace: true });
      }
    }, [session, navigate, location]);

    if (!session) {
      return null;
    }

    return <>{children}</>;
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        setSession(currentSession);
        if (currentSession?.user) {
          const supaUser = currentSession.user as SupabaseUser;
          setAppUser({
            id: supaUser.id,
            name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
            email: supaUser.email || '',
            imageUrl: supaUser.user_metadata?.avatar_url || ''
          });

          // Check for redirect after successful initial session load
          const redirectPath = localStorage.getItem('redirectAfterSignIn');
          if (redirectPath && redirectPath !== '/') {
            localStorage.removeItem('redirectAfterSignIn');
            navigate(redirectPath, { replace: true });
          }
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        if (mounted) {
          setIsInitializingAuth(false);
        }
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, currentSession: Session | null) => {
        if (!mounted) return;

        console.log('Auth state changed:', _event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          const supaUser = currentSession.user as SupabaseUser;
          setAppUser({
            id: supaUser.id,
            name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
            email: supaUser.email || '',
            imageUrl: supaUser.user_metadata?.avatar_url || ''
          });

          // Handle redirect after successful sign in
          if (_event === 'SIGNED_IN') {
            const redirectPath = localStorage.getItem('redirectAfterSignIn');
            console.log('Checking redirect path:', redirectPath);
            if (redirectPath && redirectPath !== '/') {
              console.log('Redirecting to:', redirectPath);
              localStorage.removeItem('redirectAfterSignIn');
              navigate(redirectPath, { replace: true });
            }
          }
        } else {
          setAppUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    const redirectUrl = `${appBaseUrl}/auth/callback`;
    console.log('Initiating Google Sign In. Redirect URL:', redirectUrl);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error during Supabase OAuth sign-in:', error.message);
      alert(`Sign-in error: ${error.message}`);
    }
  };

  const handleGoogleSignOut = async () => {
    console.log('Initiating Sign Out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during sign out:', error.message);
      alert(`Sign-out error: ${error.message}`);
    } else {
      // onAuthStateChange will handle setting appUser to null
      console.log('Sign out successful, navigating to home.');
      navigate('/', { replace: true }); // Navigate to a public page after sign out
    }
  };

  const navigateTo = useCallback((page: Page) => {
    // This navigation is now simpler; individual pages or a wrapper can handle auth checks
    const pathMap: Record<Page, string> = {
      'home': '/', 'validator': '/validator', 'ingredient-analyser': '/ingredient-analyser',
      'ai-news-digest': '/ai-news-digest', 'symptom-analyzer': '/symptom-analyzer',
      'community-forum': '/community-forum', 'achievements': '/achievements',
      'quizzes': '/quizzes', 'challenges': '/challenges',
      'competitor-monitoring': '/competitor-monitoring', 'api-access': '/api-access',
      'support': '/support', 'consumer-insights': '/consumer-insights',
      'compliance-assistant': '/compliance-assistant', 'formulation-advisor': '/formulation-advisor',
      'pricing': '/pricing', 'contact': '/contact', 'terms-of-service': '/terms-of-service',
    };
    navigate(pathMap[page] || '/');
    setIsSidebarOpen(false); // Close sidebar on navigation
  }, [navigate]);

  useEffect(() => { // Scroll to top on navigation
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // --- Modal and other UI handlers from your original App ---
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
      const newReportItem: MyReportItem = { id: report.id, claim: report.claim, confidenceScore: report.confidenceScore, timestamp: report.generatedTimestamp, fullReportData: report };
      return [newReportItem, ...prevReports.filter(r => r.id !== report.id).slice(0, 9)];
    });
  }, []);
  const handleToggleMyReportsModal = () => setIsMyReportsModalOpen(prev => !prev);
  const handleSelectMyReportItem = (reportData: ReportData) => {
    setSelectedReportForView(reportData);
    setInitialClaimForValidator(reportData.claim);
    navigate('/validator');
    setIsMyReportsModalOpen(false);
    setIsSidebarOpen(false);
  };
  const handleCustomizationChange = (settings: CustomizationSettings) => setCustomizationSettings(settings);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  // --- End of Modal and other UI handlers ---

  const handleSignInPrompt = () => {
    setIsSignInPromptOpen(false);
    handleGoogleSignIn();
  };

  const handleCloseSignInPrompt = () => {
    setIsSignInPromptOpen(false);
    setPendingRedirectPath(null);
  };

  if (isInitializingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingSpinner message="Initializing application..." />
      </div>
    );
  }

  // The /auth/callback path is effectively handled by the onAuthStateChange listener,
  // which should navigate away once the session is processed.
  // If the user lands here and onAuthStateChange hasn't redirected them yet,
  // showing a brief "processing" message is fine.
  if (location.pathname === '/auth/callback' && !session) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingSpinner message="Processing sign-in..." />
      </div>
    );
  }

  return (
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
        />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          navigateTo={navigateTo}
          currentPage={(location.pathname.substring(1) || 'home') as Page}
        />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-premium-slide-in-up">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage navigateTo={navigateTo} myReportsCount={myReports.length} />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />

            {/* Protected routes */}
            <Route path="/validator" element={
              <ProtectedRoute>
                <ValidatorPage
                  onExportPDF={handleExportPDF}
                  onGenerateBadge={handleGenerateBadge}
                  onExportDocx={handleExportDocx}
                  onExportJson={handleExportJson}
                  onReportGenerated={handleReportGenerated}
                  initialReport={selectedReportForView}
                  initialClaim={initialClaimForValidator}
                  customizationSettings={customizationSettings}
                  onCustomizationChange={handleCustomizationChange}
                />
              </ProtectedRoute>
            } />
            <Route path="/ingredient-analyser" element={
              <ProtectedRoute>
                <IngredientAnalyserPage />
              </ProtectedRoute>
            } />
            <Route path="/ai-news-digest" element={
              <ProtectedRoute>
                <HealthcareNewsPage />
              </ProtectedRoute>
            } />
            <Route path="/symptom-analyzer" element={
              <ProtectedRoute>
                <SymptomAnalyzerPage />
              </ProtectedRoute>
            } />
            <Route path="/community-forum" element={
              <ProtectedRoute>
                <CommunityForumPage />
              </ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute>
                <AchievementsPage navigateTo={navigateTo} />
              </ProtectedRoute>
            } />
            <Route path="/quizzes" element={
              <ProtectedRoute>
                <QuizzesPage />
              </ProtectedRoute>
            } />
            <Route path="/challenges" element={
              <ProtectedRoute>
                <ChallengesPage />
              </ProtectedRoute>
            } />
            <Route path="/competitor-monitoring" element={
              <ProtectedRoute>
                <CompetitorMonitoringPage />
              </ProtectedRoute>
            } />
            <Route path="/api-access" element={
              <ProtectedRoute>
                <ApiAccessPage />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } />
            <Route path="/consumer-insights" element={
              <ProtectedRoute>
                <ConsumerInsightsPage />
              </ProtectedRoute>
            } />
            <Route path="/compliance-assistant" element={
              <ProtectedRoute>
                <ComplianceAssistantPage />
              </ProtectedRoute>
            } />
            <Route path="/formulation-advisor" element={
              <ProtectedRoute>
                <FormulationAdvisorPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer navigateTo={navigateTo} />
        <Modal isOpen={isInfoModalOpen} onClose={closeInfoModal} title={infoModalContent.title}>
          <p>{infoModalContent.message}</p>
        </Modal>
        <Modal 
          isOpen={isSignInPromptOpen} 
          onClose={handleCloseSignInPrompt} 
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
              <button
                onClick={handleSignInPrompt}
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>
              <button
                onClick={handleCloseSignInPrompt}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
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
  );
};

export default App;