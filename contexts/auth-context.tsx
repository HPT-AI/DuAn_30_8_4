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
  loginWithGoogle: (googleToken: string) => Promise<void>
  loginWithFacebook: (facebookToken: string) => Promise<void>
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
        // Only check for current user if we have a token
        const hasToken = typeof window !== 'undefined' && localStorage.getItem('access_token')
        if (hasToken) {
          console.log('🔐 [AUTH DEBUG] Token found, checking current user...')
          const currentUser = await apiClient.getCurrentUser()
          setUser(mapApiUserToUser(currentUser))
        } else {
          console.log('🔐 [AUTH DEBUG] No token found, user remains null')
          setUser(null)
        }
      } catch (error) {
        // No valid session, user remains null
        console.log('🔐 [AUTH DEBUG] No valid session found:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    console.log("🔐 [AUTH DEBUG] Starting login process with credentials:", { email: credentials.email })
    setIsLoading(true)
    try {
      console.log("🔐 [AUTH DEBUG] Calling apiClient.login...")
      const response = await apiClient.login(credentials)
      console.log("🔐 [AUTH DEBUG] Login response received:", response)
      console.log("🔐 [AUTH DEBUG] Getting current user...")
      const currentUser = await apiClient.getCurrentUser()
      console.log("🔐 [AUTH DEBUG] Current user received:", currentUser)
      const mappedUser = mapApiUserToUser(currentUser)
      console.log("🔐 [AUTH DEBUG] Setting user:", mappedUser)
      setUser(mappedUser)
      console.log("🔐 [AUTH DEBUG] Login completed successfully")
    } catch (error) {
      console.error("🔐 [AUTH DEBUG] Login failed with error:", error)
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
  }

  const loginWithGoogle = async (googleToken: string) => {
    console.log("🔐 [GOOGLE AUTH DEBUG] Starting Google login with token:", googleToken?.substring(0, 20) + "...")
    setIsLoading(true)
    try {
      console.log("🔐 [GOOGLE AUTH DEBUG] Calling apiClient.loginWithGoogle...")
      // Exchange Google token for JWT tokens via backend
      const tokens = await apiClient.loginWithGoogle(googleToken);
      console.log("🔐 [GOOGLE AUTH DEBUG] JWT tokens received from backend:", tokens);
      
      console.log("🔐 [GOOGLE AUTH DEBUG] Getting current user...");
      const currentUser = await apiClient.getCurrentUser()
      console.log("🔐 [GOOGLE AUTH DEBUG] Current user retrieved:", currentUser);
      const mappedUser = mapApiUserToUser(currentUser)
      console.log("🔐 [GOOGLE AUTH DEBUG] Setting user:", mappedUser);
      setUser(mappedUser)
      console.log("🔐 [GOOGLE AUTH DEBUG] Google login completed successfully");
    } catch (error) {
      console.error("🔐 [GOOGLE AUTH DEBUG] Google login failed with error:", error);
      console.error("🔐 [GOOGLE AUTH DEBUG] Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
  }

  const loginWithFacebook = async (facebookToken: string) => {
    console.log("🔐 [FACEBOOK AUTH DEBUG] Starting Facebook login with token:", facebookToken?.substring(0, 20) + "...")
    setIsLoading(true)
    try {
      console.log("🔐 [FACEBOOK AUTH DEBUG] Calling apiClient.loginWithFacebook...")
      // Exchange Facebook token for JWT tokens via backend
      const tokens = await apiClient.loginWithFacebook(facebookToken);
      console.log("🔐 [FACEBOOK AUTH DEBUG] JWT tokens received from backend:", tokens);
      
      console.log("🔐 [FACEBOOK AUTH DEBUG] Getting current user...");
      const currentUser = await apiClient.getCurrentUser()
      console.log("🔐 [FACEBOOK AUTH DEBUG] Current user retrieved:", currentUser);
      const mappedUser = mapApiUserToUser(currentUser)
      console.log("🔐 [FACEBOOK AUTH DEBUG] Setting user:", mappedUser);
      setUser(mappedUser)
      console.log("🔐 [FACEBOOK AUTH DEBUG] Facebook login completed successfully");
    } catch (error) {
      console.error("🔐 [FACEBOOK AUTH DEBUG] Facebook login failed with error:", error);
      console.error("🔐 [FACEBOOK AUTH DEBUG] Error details:", {
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
        loginWithFacebook,
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
