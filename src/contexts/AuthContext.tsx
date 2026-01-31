import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { shopifyAPI } from '../services/shopify';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  accessToken?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string, acceptsEmailMarketing?: boolean) => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isAuthModalOpen: false,
  });

  // Check for saved user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sugrae_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('sugrae_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Call real Shopify Customer API
      const response = await shopifyAPI.customerLogin(email, password);

      const user: User = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        displayName: response.displayName || response.firstName
          ? `${response.firstName} ${response.lastName || ''}`.trim()
          : email.split('@')[0],
        accessToken: response.accessToken,
      };

      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
      }));

      // Save to localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('sugrae_user', JSON.stringify(user));
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    acceptsEmailMarketing?: boolean
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Call real Shopify Customer API to create account
      await shopifyAPI.createCustomerAccount(
        email,
        password,
        firstName,
        lastName,
        acceptsEmailMarketing
      );

      // After creating account, login to get access token
      const loginResponse = await shopifyAPI.customerLogin(email, password);

      const user: User = {
        id: loginResponse.id,
        email: loginResponse.email,
        firstName: loginResponse.firstName,
        lastName: loginResponse.lastName,
        displayName: loginResponse.displayName || firstName
          ? `${firstName} ${lastName || ''}`.trim()
          : email.split('@')[0],
        accessToken: loginResponse.accessToken,
      };

      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
      }));

      // Auto-save after signup
      localStorage.setItem('sugrae_user', JSON.stringify(user));
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
    }));
    localStorage.removeItem('sugrae_user');
  };

  const openAuthModal = () => {
    setState(prev => ({ ...prev, isAuthModalOpen: true }));
  };

  const closeAuthModal = () => {
    setState(prev => ({ ...prev, isAuthModalOpen: false }));
  };

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
