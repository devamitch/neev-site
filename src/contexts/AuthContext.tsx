import React, { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: 'admin' | 'steward' | 'member' | null;
  familyId: string | null;
  googleAccessToken: string | null;
  setGoogleAccessToken: (token: string | null) => void;
  refreshGoogleToken: () => Promise<string | null>;
  signInAsDemo: () => void;
  signInAsGuest: () => void;
  signOutUser: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  userRole: null,
  familyId: null,
  googleAccessToken: null,
  setGoogleAccessToken: () => {},
  refreshGoogleToken: async () => null,
  signInAsDemo: () => {},
  signInAsGuest: () => {},
  signOutUser: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthContext.Provider value={defaultAuthContext}>{children}</AuthContext.Provider>;
};
