"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  provider: "email" | "google" | "facebook"
}

interface AuthContextType {
  user: User | null
  login: (provider: "email" | "google" | "facebook", credentials?: { email: string; password: string }) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (
    provider: "email" | "google" | "facebook",
    credentials?: { email: string; password: string },
  ) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful login - in real app this would call actual auth service
    if (provider === "facebook") {
      setUser({
        id: "1",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        provider: "facebook",
      })
    } else if (provider === "google") {
      setUser({
        id: "2",
        name: "John Doe",
        email: "john.doe@gmail.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        provider: "google",
      })
    } else if (provider === "email" && credentials) {
      setUser({
        id: "3",
        name: "User Email",
        email: credentials.email,
        provider: "email",
      })
    }

    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  const isAdmin = () => {
    return user?.provider === "facebook"
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, isAdmin }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
