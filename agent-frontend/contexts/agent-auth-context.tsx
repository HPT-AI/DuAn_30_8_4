"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Agent {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: "pending" | "approved" | "suspended"
  bankInfo?: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }
}

interface AgentAuthContextType {
  agent: Agent | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: RegisterData) => Promise<boolean>
  updateProfile: (data: Partial<Agent>) => Promise<boolean>
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  bankInfo: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }
  companyInfo?: {
    name: string
    taxCode: string
  }
}

const AgentAuthContext = createContext<AgentAuthContextType | undefined>(undefined)

export function AgentAuthProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedAgent = localStorage.getItem("agent")
    if (savedAgent) {
      setAgent(JSON.parse(savedAgent))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - replace with actual API call
      const mockAgent: Agent = {
        id: "1",
        name: "Nguyễn Văn A",
        email: email,
        phone: "0123456789",
        status: "approved",
        bankInfo: {
          bankName: "Vietcombank",
          accountNumber: "1234567890",
          accountHolder: "Nguyễn Văn A",
        },
      }

      setAgent(mockAgent)
      localStorage.setItem("agent", JSON.stringify(mockAgent))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    setAgent(null)
    localStorage.removeItem("agent")
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Mock registration - replace with actual API call
      console.log("Registering agent:", data)
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const updateProfile = async (data: Partial<Agent>): Promise<boolean> => {
    try {
      if (agent) {
        const updatedAgent = { ...agent, ...data }
        setAgent(updatedAgent)
        localStorage.setItem("agent", JSON.stringify(updatedAgent))
      }
      return true
    } catch (error) {
      console.error("Profile update failed:", error)
      return false
    }
  }

  return (
    <AgentAuthContext.Provider
      value={{
        agent,
        isLoading,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AgentAuthContext.Provider>
  )
}

export function useAgentAuth() {
  const context = useContext(AgentAuthContext)
  if (context === undefined) {
    throw new Error("useAgentAuth must be used within an AgentAuthProvider")
  }
  return context
}
