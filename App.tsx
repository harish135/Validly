import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

  const navigate = useNavigate();
  const location = useLocation();

  // Navigation handler using React Router
  const navigateTo = useCallback((page: Page) => {
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
  }, [navigate]);

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
      console.log('Attempting to sign in with Google...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // Redirect to home page
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Supabase OAuth error:', error);
        throw error;
      }
      
      console.log('Sign in initiated successfully', data);
    } catch (error) {
      console.error('Error during sign in:', error);
      if (error instanceof Error) {
        console.error('Unexpected error during sign-in:', error);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, pageKey]);

  return (
    <UserProgressProvider> 
      <div className="flex flex-col min-h-screen bg-brand-gray-950 font-sans">
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
          currentPage={location.pathname.replace('/', '') || 'home'}
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
