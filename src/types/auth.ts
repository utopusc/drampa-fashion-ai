export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'premium' | 'enterprise';
  avatar: string | null;
  createdAt: string;
} 