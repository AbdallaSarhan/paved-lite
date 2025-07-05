import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginCredentials {
  user: {
    email: string;
    password: string;
  };
}

export interface SignupCredentials {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
  };
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/login', credentials);
      const { user, token } = response.data;
      
      // Store the JWT token
      localStorage.setItem('jwt_token', token);
      
      // Fetch the complete user profile from the server
      const profileResponse = await api.get('/users/profile');
      const completeUser = profileResponse.data.user;
      
      // Store the complete user object
      localStorage.setItem('user', JSON.stringify(completeUser));
      
      return { user: completeUser, token };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Server unavailable. Please try again later.');
        }
        if (error.response?.status === 401) {
          throw new Error(error.response?.data?.error || 'Incorrect email or password.');
        }
        throw new Error(error.response?.data?.error || 'Login failed.');
      }
      throw error;
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/signup', credentials);
      const { user, token } = response.data;
      
      // Store the JWT token
      localStorage.setItem('jwt_token', token);
      
      // Fetch the complete user profile from the server
      const profileResponse = await api.get('/users/profile');
      const completeUser = profileResponse.data.user;
      
      // Store the complete user object
      localStorage.setItem('user', JSON.stringify(completeUser));
      
      return { user: completeUser, token };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Server unavailable. Please try again later.');
        }
        // Show backend error or fallback
        throw new Error(error.response?.data?.error || 'Signup failed.');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.delete('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove the token and user from localStorage
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async setRole(role: 'publisher' | 'advertiser'): Promise<{ user: { id: number; email: string; role: string } }> {
    const token = this.getToken();
    console.log('setRole: JWT token:', token);
    console.log('setRole: Authorization header:', token ? `Bearer ${token}` : 'None');
    console.log('PATCHing to /users/role', role);
    try {
      const response = await api.patch('/users/role', { role });
      
      // Fetch the complete user profile from the server
      const profileResponse = await api.get('/users/profile');
      const completeUser = profileResponse.data.user;
      
      // Update the user in localStorage with the complete profile
      localStorage.setItem('user', JSON.stringify(completeUser));
      
      return { user: completeUser };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to set role.');
      }
      throw error;
    }
  }

  getUser(): { 
    id: number; 
    email: string; 
    role?: string; 
    name?: string;
    website?: string;
    description?: string;
    newsletter_name?: string;
    subscriber_count?: string;
    category?: string;
    publishing_frequency?: string;
    company_name?: string;
    industry?: string;
    target_audience?: string;
    budget?: string;
  } | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  async getProfile(): Promise<any> {
    const response = await api.get('/users/profile');
    return response.data.user;
  }

  async updateProfile(profile: any): Promise<any> {
    const response = await api.patch('/users/profile', { profile });
    const { user } = response.data;
    // Update the user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async getPublishers(): Promise<any[]> {
    const response = await api.get('/users/publishers');
    return response.data.publishers;
  }

  async sendRequest(publisherId: number, message: string, budget: string): Promise<any> {
    const response = await api.post('/requests', {
      publisher_id: publisherId,
      message,
      budget,
    });
    return response.data.request;
  }

  async getPublisherRequests(): Promise<any[]> {
    const response = await api.get('/requests');
    return response.data.requests;
  }

  async getAdvertiserSentRequests(): Promise<any[]> {
    const response = await api.get('/requests/sent');
    return response.data.requests;
  }

  async updateRequestStatus(requestId: number, status: string): Promise<any> {
    const response = await api.patch(`/requests/${requestId}`, { status });
    return response.data.request;
  }
}

export const authService = new AuthService();
export default authService; 