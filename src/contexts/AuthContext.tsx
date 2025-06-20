"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/auth';
import { authService, LoginCredentials, RegisterCredentials } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (profileData: { name?: string; email?: string }) => Promise<{ success: boolean; message?: string }>;
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => Promise<{ success: boolean; message?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = authService.getToken();
      const savedUser = authService.getUser();

      if (token && savedUser) {
        // Verify token is still valid by fetching fresh user data
        const response = await authService.getProfile(token);
        if (response.success && response.data) {
          setUser(response.data.user);
          authService.saveUser(response.data.user);
        } else {
          // Token is invalid, clear local storage
          authService.logout();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success && 'token' in response) {
        authService.saveToken(response.token);
        authService.saveUser(response.data.user);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: 'message' in response ? response.message : 'Giriş başarısız oldu.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Bağlantı hatası. Lütfen tekrar deneyin.' };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authService.register(credentials);
      
      if (response.success && 'token' in response) {
        authService.saveToken(response.token);
        authService.saveUser(response.data.user);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: 'message' in response ? response.message : 'Kayıt başarısız oldu.' 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Bağlantı hatası. Lütfen tekrar deneyin.' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData: { name?: string; email?: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Oturum bulunamadı.' };
      }

      const response = await authService.updateProfile(token, profileData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        authService.saveUser(response.data.user);
        return { success: true, message: 'Profil başarıyla güncellendi.' };
      } else {
        return { 
          success: false, 
          message: response.message || 'Profil güncellenemedi.' 
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Bağlantı hatası. Lütfen tekrar deneyin.' };
    }
  };

  const changePassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Oturum bulunamadı.' };
      }

      const response = await authService.changePassword(token, passwordData);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Bağlantı hatası. Lütfen tekrar deneyin.' };
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await authService.getProfile(token);
      if (response.success && response.data) {
        setUser(response.data.user);
        authService.saveUser(response.data.user);
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 