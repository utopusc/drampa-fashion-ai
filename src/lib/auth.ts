import { User } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Demo user credentials
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || 'demo@drampa.ai';
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'DrampaDemo2024!';

// Demo user object
const DEMO_USER: User = {
  id: 'demo-user-1',
  name: 'Demo User',
  email: DEMO_EMAIL,
  role: 'user',
  plan: 'free',
  avatar: null,
  createdAt: new Date().toISOString(),
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    user: User;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
  }>;
}

class AuthService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse | ApiError> {
    try {
      // Check for demo user credentials first
      if (credentials.email === DEMO_EMAIL && credentials.password === DEMO_PASSWORD) {
        return {
          success: true,
          token: 'demo-token-' + Date.now(),
          data: {
            user: DEMO_USER,
          },
        };
      }

      // If not demo user, try API (fallback for real backend)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Geçersiz email veya şifre.',
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse | ApiError> {
    try {
      // For demo purposes, always return success with demo user
      const demoUser = {
        ...DEMO_USER,
        name: credentials.name,
        email: credentials.email,
      };

      return {
        success: true,
        token: 'demo-token-' + Date.now(),
        data: {
          user: demoUser,
        },
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Kayıt işlemi başarısız oldu.',
      };
    }
  }

  async getProfile(token: string): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    try {
      // For demo purposes, return demo user if token starts with 'demo-token-'
      if (token.startsWith('demo-token-')) {
        return {
          success: true,
          data: {
            user: DEMO_USER,
          },
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Profil bilgileri alınamadı.',
      };
    }
  }

  async updateProfile(token: string, profileData: { name?: string; email?: string }): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Profil güncellenemedi.',
      };
    }
  }

  async changePassword(token: string, passwordData: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Şifre değiştirilemedi.',
      };
    }
  }

  // Token management utilities
  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drampa_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('drampa_token');
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('drampa_token');
    }
  }

  // User management utilities
  saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drampa_user', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('drampa_user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('drampa_user');
    }
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 