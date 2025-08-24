"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  fullName: string
  email: string
  role: string
}

interface RegularAuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => void
  setUserFromGoogle?: (user: User) => void
  isAuthenticated: boolean
  isLoading: boolean
}

const RegularAuthContext = createContext<RegularAuthContextType | undefined>(undefined)

export const RegularAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('regular_user_access_token')
      const userData = localStorage.getItem('regular_user')

      if (token && userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Failed to parse user data', error)
          // Clear invalid data instead of calling logout
          localStorage.removeItem('regular_user_access_token')
          localStorage.removeItem('regular_user')
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const signup = async (fullName: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, confirmPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      localStorage.setItem('regular_user_access_token', data.access_token)
      localStorage.setItem('regular_user', JSON.stringify(data.user))
      setUser(data.user)
      
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Allow users, but redirect admins to admin panel
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        localStorage.setItem('admin_user_access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/admin')
        return
      }
      
      // Only proceed with regular user flow for 'user' role
      if (data.user.role !== 'user') {
        throw new Error('Access denied. Invalid user role.')
      }

      localStorage.setItem('regular_user_access_token', data.access_token)
      localStorage.setItem('regular_user', JSON.stringify(data.user))
      setUser(data.user)
      
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const setUserFromGoogle = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('regular_user_access_token')}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('regular_user_access_token');
      localStorage.removeItem('regular_user');
      setUser(null);
      router.push('/auth/login');
    }
  };

  return (
    <RegularAuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        setUserFromGoogle,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </RegularAuthContext.Provider>
  )
}

export const useRegularAuth = () => {
  const context = useContext(RegularAuthContext)
  if (context === undefined) {
    throw new Error('useRegularAuth must be used within a RegularAuthProvider')
  }
  return context
}