"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'
import { handleApiError } from '@/lib/error-handler'
import { authService } from '@/lib/api-services'
import { User, LoginResponse } from '@/types/api'

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
          logger.debug('User data loaded from localStorage', { userId: JSON.parse(userData).id }, 'AuthContext')
        } catch (error) {
          const appError = handleApiError(error, 'AuthContext')
          logger.error('Failed to parse user data', appError, 'AuthContext')
          logout()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      logger.info('Admin login attempt', { email }, 'AuthContext')
      
      const data = await authService.adminLogin({ email, password })

      localStorage.setItem('admin_user_access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      
      logger.info('Admin login successful', { userId: data.user.id, role: data.user.role }, 'AuthContext')
    } catch (error) {
      const appError = handleApiError(error, 'AuthContext')
      logger.error('Admin login failed', appError, 'AuthContext')
      throw appError
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
      logger.info('Admin logout initiated', { userId: user?.id }, 'AuthContext')
      await authService.logout()
      logger.info('Admin logout successful', undefined, 'AuthContext')
    } catch (error) {
      const appError = handleApiError(error, 'AuthContext')
      logger.error('Logout API call failed', appError, 'AuthContext')
    } finally {
      localStorage.removeItem('admin_user_access_token')
      localStorage.removeItem('user')
      setUser(null)
      router.push('/admin/login')
    }
  }

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