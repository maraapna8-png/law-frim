import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  lawyerToken: string | null;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string, newPassword: string) => Promise<boolean>;
  verifyLawyerPasscode: (passcode: string) => Promise<boolean>;
  logoutLawyerPortal: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('alf_token'));
  const [lawyerToken, setLawyerToken] = useState<string | null>(() => localStorage.getItem('alf_lawyer_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('alf_token');
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Login failed.');
        setIsLoading(false);
        return false;
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('alf_token', data.token);
      setIsLoading(false);
      return true;
    } catch (err) {
      setAuthError('Connection error. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Registration failed.');
        setIsLoading(false);
        return false;
      }
      setIsLoading(false);
      return true;
    } catch (err) {
      setAuthError('Connection error during registration.');
      setIsLoading(false);
      return false;
    }
  };

  const forgotPassword = async (email: string, newPassword: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Password reset failed.');
        return false;
      }
      return true;
    } catch (err) {
      setAuthError('Failed to reset password.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      // Ignore network errors on logout
    }
    setUser(null);
    setToken(null);
    setLawyerToken(null);
    localStorage.removeItem('alf_token');
    localStorage.removeItem('alf_lawyer_token');
  };

  const verifyLawyerPasscode = async (passcode: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch('/api/lawyer-portal/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Incorrect Passcode.');
        return false;
      }

      setLawyerToken(data.lawyerToken);
      localStorage.setItem('alf_lawyer_token', data.lawyerToken);
      return true;
    } catch (err) {
      setAuthError('Passcode verification failed.');
      return false;
    }
  };

  const logoutLawyerPortal = () => {
    setLawyerToken(null);
    localStorage.removeItem('alf_lawyer_token');
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        lawyerToken,
        isLoading,
        authError,
        login,
        register,
        logout,
        forgotPassword,
        verifyLawyerPasscode,
        logoutLawyerPortal,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
