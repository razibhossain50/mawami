"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  fullName: string | null
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('admin_user_access_token')
      const userData = localStorage.getItem('user')

      if (token && userData) {
        try {
          // In a real app, you might want to validate the token with the backend
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Failed to parse user data', error)
          logout()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

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

      localStorage.setItem('admin_user_access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    } catch (error) {
      throw error
    }
  }

  // const logout = () => {
  //   localStorage.removeItem('admin_user_access_token')
  //   localStorage.removeItem('user')
  //   setUser(null)
  //   router.push('/admin/login')
  // }
  const logout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_user_access_token')}`,
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('admin_user_access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/admin/login');
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}