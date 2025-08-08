import { User } from '@/types/auth';

const API_BASE_URL = 'http://31.220.81.177';

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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      // Convert credits from backend (10) to cents (1000)
      if (data.success && data.data?.user) {
        data.data.user.credits = (data.data.user.credits || 0) * 100;
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse | ApiError> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      // Convert credits from backend (10) to cents (1000)
      if (data.success && data.data?.user) {
        data.data.user.credits = (data.data.user.credits || 0) * 100;
      }
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  async getProfile(token: string): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await response.json();
      
      // Convert credits from backend to cents
      if (data.success && data.data) {
        data.data.credits = (data.data.credits || 0) * 100;
        return { success: true, data: { user: data.data } };
      }
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Profil bilgileri alınamadı.',
      };
    }
  }

  async updateProfile(token: string, profileData: { name?: string; email?: string; profileImage?: string }): Promise<{ success: boolean; data?: { user: User }; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (data.success && data.data) {
        data.data.credits = (data.data.credits || 0) * 100;
        return { success: true, data: { user: data.data }, message: data.message };
      }
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
      const response = await fetch(`${API_BASE_URL}/api/users/password`, {
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
      // Set cookie for middleware to check (7 days = 604800 seconds)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      // Don't use Secure flag on localhost or HTTP connections
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isHTTPS = window.location.protocol === 'https:';
      const secureFlag = (isLocalhost || !isHTTPS) ? '' : '; Secure';
      document.cookie = `auth-token=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax${secureFlag}`;
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
      // Also remove cookie
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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