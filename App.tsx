import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import Header from './src/components/Header';
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

// Add type for ImportMeta
interface ImportMeta {
  env: {
    VITE_FIREBASE_API_KEY: string;
    VITE_FIREBASE_AUTH_DOMAIN: string;
    VITE_FIREBASE_PROJECT_ID: string;
    VITE_FIREBASE_STORAGE_BUCKET: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_FIREBASE_APP_ID: string;
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

const App: React.FC = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; message: string }>({ title: '', message: '' });
  const [user, setUser] = useState<{ name: string; email: string; imageUrl: string } | null>(null);
  const [myReports, setMyReports] = useState<MyReportItem[]>([]);
  const [isMyReportsModalOpen, setIsMyReportsModalOpen] = useState<boolean>(false);
  const [selectedReportForView, setSelectedReportForView] = useState<ReportData | null>(null);
  const [initialClaimForValidator, setInitialClaimForValidator] = useState<string>("");
  const [customizationSettings, setCustomizationSettings] = useState<CustomizationSettings>({
    logoUrl: '',
    primaryColor: DEFAULT_CUSTOM_COLOR, 
  });
  const [pageKey, setPageKey] = useState<string>(Date.now().toString());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Navigation handler using React Router
  const navigateTo = useCallback((page: Page) => {
    if (!user) {
      window.alert("Please sign in to use this feature.");
      handleGoogleSignIn();
      return;
    }
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'validator':
        navigate('/validator');
        break;
      case 'ingredient-analyser':
        navigate('/ingredient-analyser');
        break;
      case 'ai-news-digest':
        navigate('/ai-news-digest');
        break;
      case 'symptom-analyzer':
        navigate('/symptom-analyzer');
        break;
      case 'community-forum':
        navigate('/community-forum');
        break;
      case 'achievements':
        navigate('/achievements');
        break;
      case 'quizzes':
        navigate('/quizzes');
        break;
      case 'challenges':
        navigate('/challenges');
        break;
      case 'competitor-monitoring':
        navigate('/competitor-monitoring');
        break;
      case 'api-access':
        navigate('/api-access');
        break;
      case 'support':
        navigate('/support');
        break;
      case 'consumer-insights':
        navigate('/consumer-insights');
        break;
      case 'compliance-assistant':
        navigate('/compliance-assistant');
        break;
      case 'formulation-advisor':
        navigate('/formulation-advisor');
        break;
      case 'pricing':
        navigate('/pricing');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'terms-of-service':
        navigate('/terms-of-service');
        break;
      default:
        navigate('/');
    }
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [navigate, user]);

  const openInfoModal = (title: string, message: string) => {
    setInfoModalContent({ title, message });
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  const handleExportPDF = useCallback(() => {
    openInfoModal("Export PDF (Mock)", MOCK_PDF_MESSAGE);
  }, []);

  const handleGenerateBadge = useCallback(() => {
    openInfoModal("Generate Trust Badge (Mock)", MOCK_BADGE_MESSAGE);
  }, []);

  const handleExportDocx = useCallback(() => {
    openInfoModal("Export as DOCX (Mock)", MOCK_DOCX_MESSAGE);
  }, []);

  const handleExportJson = useCallback(() => {
    openInfoModal("Export Data (JSON) (Mock)", MOCK_JSON_EXPORT_MESSAGE);
  }, []);

  const handleReportGenerated = useCallback((report: ReportData) => {
    setMyReports(prevReports => {
      const newReportItem: MyReportItem = {
        id: report.id,
        claim: report.claim,
        confidenceScore: report.confidenceScore,
        timestamp: report.generatedTimestamp,
        fullReportData: report,
      };
      const existingIds = new Set(prevReports.map(item => item.id));
      if (existingIds.has(newReportItem.id)) { 
        return prevReports.map(r => r.id === newReportItem.id ? newReportItem : r);
      }
      return [newReportItem, ...prevReports.slice(0, 9)]; 
    });
  }, []);

  const handleToggleMyReportsModal = () => {
    setIsMyReportsModalOpen(prev => !prev);
  };

  const handleSelectMyReportItem = (reportData: ReportData) => {
    setSelectedReportForView(reportData);
    setInitialClaimForValidator(reportData.claim);
    navigate('/validator');
    setPageKey(Date.now().toString()); 
    setIsMyReportsModalOpen(false);
    setIsSidebarOpen(false); 
  };
  
  const handleCustomizationChange = (settings: CustomizationSettings) => {
    setCustomizationSettings(settings);
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else if (session?.user) {
          console.log('Initial session found:', {
            name: session.user.user_metadata?.full_name,
            email: session.user.email,
            avatar_url: session.user.user_metadata?.avatar_url
          });
          
          setUser({
            name: session.user.user_metadata?.full_name || '',
            email: session.user.email || '',
            imageUrl: session.user.user_metadata?.avatar_url || ''
          });
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session ? 'User signed in' : 'No user');
      
      if (session?.user) {
        console.log('User details:', {
          name: session.user.user_metadata?.full_name,
          email: session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url
        });
        
        setUser({
          name: session.user.user_metadata?.full_name || '',
          email: session.user.email || '',
          imageUrl: session.user.user_metadata?.avatar_url || ''
        });
      } else {
        console.log('User signed out, clearing user state');
        setUser(null);
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    console.log('Starting Google sign in process...');
    try {
      // Use the preferred redirect URL format (no trailing slash or hash)
      const redirectUrl = 'https://validly.pro/auth/callback';
      console.log('Redirect URL:', redirectUrl);
      console.log('Current window location:', window.location.href);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Supabase OAuth error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        throw error;
      }
      
      if (data?.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No redirect URL received from Supabase');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      if (error instanceof Error) {
        console.error('Unexpected error during sign-in:', {
          message: error.message,
          stack: error.stack
        });
      }
    }
  };

  const handleGoogleSignOut = async () => {
    console.log('Starting sign out process...');
    try {
      console.log('Calling Supabase signOut...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Sign out successful');
      setUser(null);
      console.log('User state cleared');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Handle auth callback at the app level (before routing)
  useEffect(() => {
    const handleDirectAuthCallback = async () => {
      // Check if we're on the auth callback path
      if (location.pathname === '/auth/callback') {
        console.log('Direct auth callback handling...');
        
        try {
          // Handle hash fragment if present
          if (window.location.hash.startsWith('#access_token')) {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            
            if (accessToken) {
              console.log('Setting session from hash params...');
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
              });
              
              if (error) {
                console.error('Error setting session:', error);
              } else {
                console.log('Session set successfully');
              }
            }
          }

          // Wait for session to be established
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Clean URL and navigate to home
          window.history.replaceState({}, '', '/');
          navigate('/', { replace: true });
          
        } catch (error) {
          console.error('Error in direct auth callback:', error);
          // Still navigate to home
          window.history.replaceState({}, '', '/');
          navigate('/', { replace: true });
        }
      }
    };

    if (!isInitializing) {
      handleDirectAuthCallback();
    }
  }, [location.pathname, navigate, isInitializing]);

  // Handle scroll to top on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, pageKey]);

  // Show loading state while initializing or processing auth callback
  if (isInitializing || location.pathname === '/auth/callback') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8 rounded-lg shadow-lg border border-blue-100" style={{ maxWidth: 340 }}>
          <div className="flex justify-center mb-4">
            {/* Healthcare icon (stethoscope) */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#e0f7fa" />
              <path d="M8 10V14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14V10" stroke="#26a69a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18V21" stroke="#26a69a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="3" stroke="#26a69a" strokeWidth="2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2 font-sans">Validly Health</h2>
          <p className="text-blue-700 mb-4 font-sans">
            {location.pathname === '/auth/callback' ? 'Signing you in to your wellness dashboard...' : 'Loading your healthcare experience...'}
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserProgressProvider> 
      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
          myReportsCount={myReports.length}
          onToggleMyReports={handleToggleMyReportsModal}
          navigateTo={navigateTo}
          handleGoogleSignIn={handleGoogleSignIn}
          handleGoogleSignOut={handleGoogleSignOut}
          user={user}
        />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          navigateTo={navigateTo} 
          currentPage={(location.pathname.replace('/', '') || 'home') as Page}
        />
        <main key={pageKey} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-premium-slide-in-up">
          <Routes>
            <Route path="/" element={<HomePage navigateTo={navigateTo} myReportsCount={myReports.length} />} />
            <Route path="/validator" element={<ValidatorPage 
              onExportPDF={handleExportPDF} 
              onGenerateBadge={handleGenerateBadge}
              onExportDocx={handleExportDocx}
              onExportJson={handleExportJson}
              onReportGenerated={handleReportGenerated}
              initialReport={selectedReportForView}
              initialClaim={initialClaimForValidator}
              customizationSettings={customizationSettings}
              onCustomizationChange={handleCustomizationChange}
            />} />
            <Route path="/ingredient-analyser" element={<IngredientAnalyserPage />} />
            <Route path="/ai-news-digest" element={<HealthcareNewsPage />} />
            <Route path="/symptom-analyzer" element={<SymptomAnalyzerPage />} />
            <Route path="/community-forum" element={<CommunityForumPage />} />
            <Route path="/achievements" element={<AchievementsPage navigateTo={navigateTo}/>} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/competitor-monitoring" element={<CompetitorMonitoringPage />} />
            <Route path="/api-access" element={<ApiAccessPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/consumer-insights" element={<ConsumerInsightsPage />} />
            <Route path="/compliance-assistant" element={<ComplianceAssistantPage />} />
            <Route path="/formulation-advisor" element={<FormulationAdvisorPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer navigateTo={navigateTo} />
        <Modal isOpen={isInfoModalOpen} onClose={closeInfoModal} title={infoModalContent.title}>
          <p>{infoModalContent.message}</p>
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