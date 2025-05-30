import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  session: Session | null;
  setPendingRedirectPath: (path: string | null) => void;
  setIsSignInPromptOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  session,
  setPendingRedirectPath,
  setIsSignInPromptOpen,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  console.log(`ProtectedRoute (${currentPath}): Rendering. Session exists: ${!!session}`);

  useEffect(() => {
    console.log(`ProtectedRoute (${currentPath}): useEffect running. Session exists: ${!!session}`);
    if (!session) {
      console.log(`ProtectedRoute (${currentPath}): No session, setting pending redirect to ${currentPath} and opening sign-in prompt.`);
      setPendingRedirectPath(currentPath);
      setIsSignInPromptOpen(true);
      navigate('/', { replace: true });
    }
  }, [session, navigate, currentPath, setPendingRedirectPath, setIsSignInPromptOpen]);

  if (!session) {
    console.log(`ProtectedRoute (${currentPath}): No session, returning null (unmounting children).`);
    return null;
  }

  console.log(`ProtectedRoute (${currentPath}): Session exists, rendering children.`);
  return <>{children}</>;
};

export default ProtectedRoute; 