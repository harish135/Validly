import React, { createContext, useContext } from 'react';
import type { AppUser } from '../App';

interface AppUserContextType {
  user: AppUser | null;
}

export const AppUserContext = createContext<AppUserContextType>({ user: null });

export const useAppUser = () => {
  const context = useContext(AppUserContext);
  if (context === undefined) {
    throw new Error('useAppUser must be used within an AppUserProvider');
  }
  return context;
};

export const AppUserProvider: React.FC<{ children: React.ReactNode; user: AppUser | null }> = ({ children, user }) => {
  return (
    <AppUserContext.Provider value={{ user }}>
      {children}
    </AppUserContext.Provider>
  );
}; 