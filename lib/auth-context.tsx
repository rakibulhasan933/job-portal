"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  _id: string
  name: string
  email: string
  role: "seeker" | "employer" | "admin"
  company?: string
  skills?: string[]
  resumeUrl?: string
  isApproved: boolean
  isBlocked: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    name: string
    email: string
    password: string
    role: "seeker" | "employer"
    company?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Login failed" }
      }

      setUser(data)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Failed to connect to server" }
    }
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    role: "seeker" | "employer"
    company?: string
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        return { success: false, error: responseData.error || "Registration failed" }
      }

      setUser(responseData)
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Failed to connect to server" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, refreshUser }}>
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
