// API client for communicating with User Service via API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'USER' | 'ADMIN' | 'AGENT';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`
        }));
        throw new Error(errorData.detail);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Set access token and store in localStorage
  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  // Set refresh token
  setRefreshToken(token: string | null) {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('refresh_token', token);
      } else {
        localStorage.removeItem('refresh_token');
      }
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    console.log('🌐 [API-CLIENT] Starting login request with credentials:', { email: credentials.email });
    console.log('🌐 [API-CLIENT] API endpoint:', this.baseURL + '/api/v1/auth/login');
    
    try {
      console.log('🌐 [API-CLIENT] Sending POST request to backend...');
      const tokens = await this.request<AuthTokens>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      console.log('🌐 [API-CLIENT] Login response received:', {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        tokenType: tokens.token_type
      });

      // Store tokens
      console.log('🌐 [API-CLIENT] Storing tokens...');
      this.setAccessToken(tokens.access_token);
      this.setRefreshToken(tokens.refresh_token);
      console.log('🌐 [API-CLIENT] Tokens stored successfully');

      return tokens;
    } catch (error) {
      console.error('🌐 [API-CLIENT] Login error:', error);
      console.error('🌐 [API-CLIENT] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  }

  async loginWithGoogle(token: string): Promise<AuthTokens> {
    console.log('[API-CLIENT] Starting loginWithGoogle...');
    console.log('[API-CLIENT] Token received:', token ? 'Yes (length: ' + token.length + ')' : 'No');
    console.log('[API-CLIENT] API endpoint:', this.baseURL + '/api/v1/auth/google/token');
    
    try {
      console.log('[API-CLIENT] Sending POST request to backend...');
      const tokens = await this.request<AuthTokens>('/api/v1/auth/google/token', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      console.log('[API-CLIENT] Backend response received:', {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        tokenType: tokens.token_type
      });

      // Store tokens
      console.log('[API-CLIENT] Storing tokens...');
      this.setAccessToken(tokens.access_token);
      this.setRefreshToken(tokens.refresh_token);
      console.log('[API-CLIENT] Tokens stored successfully');

      return tokens;
    } catch (error) {
      console.error('[API-CLIENT] loginWithGoogle error:', error);
      console.error('[API-CLIENT] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  }

  async loginWithFacebook(token: string): Promise<AuthTokens> {
    console.log('[API-CLIENT] Starting loginWithFacebook...');
    console.log('[API-CLIENT] Token received:', token ? 'Yes (length: ' + token.length + ')' : 'No');
    console.log('[API-CLIENT] API endpoint:', this.baseURL + '/api/v1/auth/facebook/token');
    
    try {
      console.log('[API-CLIENT] Sending POST request to backend...');
      const tokens = await this.request<AuthTokens>('/api/v1/auth/facebook/token', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      console.log('[API-CLIENT] Backend response received:', {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        tokenType: tokens.token_type
      });

      // Store tokens
      console.log('[API-CLIENT] Storing tokens...');
      this.setAccessToken(tokens.access_token);
      this.setRefreshToken(tokens.refresh_token);
      console.log('[API-CLIENT] Tokens stored successfully');

      return tokens;
    } catch (error) {
      console.error('[API-CLIENT] loginWithFacebook error:', error);
      console.error('[API-CLIENT] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<User> {
    return this.request<User>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        role: 'USER',
        is_active: true
      }),
    });
  }

  async getCurrentUser(): Promise<User> {
    console.log('🌐 [API-CLIENT] Getting current user...');
    console.log('🌐 [API-CLIENT] API endpoint:', this.baseURL + '/api/v1/users/me');
    console.log('🌐 [API-CLIENT] Access token available:', !!this.accessToken);
    
    try {
      const user = await this.requestWithRetry<User>('/api/v1/users/me');
      console.log('🌐 [API-CLIENT] Current user retrieved:', user);
      return user;
    } catch (error) {
      console.error('🌐 [API-CLIENT] getCurrentUser error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokens = await this.request<AuthTokens>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    // Update stored tokens
    this.setAccessToken(tokens.access_token);
    this.setRefreshToken(tokens.refresh_token);

    return tokens;
  }

  async logout() {
    // Clear tokens
    this.setAccessToken(null);
    this.setRefreshToken(null);
  }

  // User management endpoints
  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.requestWithRetry<User>('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.requestWithRetry('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify({ 
        password: newPassword 
      }),
    });
  }

  // Auto-refresh token on 401 errors
  async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      return await this.request<T>(endpoint, options);
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        try {
          await this.refreshToken();
          return await this.request<T>(endpoint, options);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          this.logout();
          throw new Error('Session expired. Please login again.');
        }
      }
      throw error;
    }
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);