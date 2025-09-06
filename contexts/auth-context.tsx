"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient, type User as ApiUser, type LoginCredentials, type RegisterData } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: "USER" | "ADMIN" | "AGENT"
  is_active: boolean
  is_verified: boolean
}

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: (tokens: any) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAdmin: () => boolean
  updateProfile: (userData: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to convert API user to context user
const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  name: apiUser.full_name,
  email: apiUser.email,
  role: apiUser.role,
  is_active: apiUser.is_active,
  is_verified: apiUser.is_verified,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser()
        setUser(mapApiUserToUser(currentUser))
      } catch (error) {
        // No valid session, user remains null
        console.log('No valid session found')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      await apiClient.login(credentials)
      const currentUser = await apiClient.getCurrentUser()
      setUser(mapApiUserToUser(currentUser))
    } catch (error) {
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
  }

  const loginWithGoogle = async (tokens: any) => {
    console.log('[AUTH-CONTEXT] Starting loginWithGoogle...');
    console.log('[AUTH-CONTEXT] Tokens received:', tokens ? 'Yes' : 'No');
    setIsLoading(true)
    try {
      console.log('[AUTH-CONTEXT] Setting tokens directly...');
      // Store tokens directly since we already have them from the OAuth callback
      apiClient.setAccessToken(tokens.access_token);
      apiClient.setRefreshToken(tokens.refresh_token);
      
      console.log('[AUTH-CONTEXT] Getting current user...');
      const currentUser = await apiClient.getCurrentUser()
      console.log('[AUTH-CONTEXT] Current user retrieved:', currentUser);
      setUser(mapApiUserToUser(currentUser))
      console.log('[AUTH-CONTEXT] User set successfully');
    } catch (error) {
      console.error('[AUTH-CONTEXT] loginWithGoogle error:', error);
      console.error('[AUTH-CONTEXT] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      const newUser = await apiClient.register(userData)
      // After registration, automatically log in
      await login({ email: userData.email, password: userData.password })
    } catch (error) {
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error('No user logged in')
    
    setIsLoading(true)
    try {
      const updatedUser = await apiClient.updateProfile({
        full_name: userData.name,
        ...userData
      })
      setUser(mapApiUserToUser(updatedUser))
    } catch (error) {
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    try {
      await apiClient.changePassword(currentPassword, newPassword)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
  }

  const isAdmin = () => {
    return user?.role === "ADMIN"
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        loginWithGoogle, 
        register, 
        logout, 
        isLoading, 
        isAdmin, 
        updateProfile, 
        changePassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
