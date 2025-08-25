"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'
import { authService } from '@/lib/api-services'
import { handleApiError } from '@/lib/error-handler'
import { User, LoginResponse } from '@/types/api'

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
          const appError = handleApiError(error, 'RegularAuthContext')
          logger.error('Failed to parse user data', appError, 'RegularAuthContext')
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
      logger.info('Attempting user signup', { email }, 'RegularAuthContext')
      
      const data = await authService.signup({ 
        fullName, 
        email, 
        password, 
        confirmPassword 
      })

      localStorage.setItem('regular_user_access_token', data.access_token)
      localStorage.setItem('regular_user', JSON.stringify(data.user))
      setUser(data.user)
      
      logger.info('User signup successful', { userId: data.user.id }, 'RegularAuthContext')
      router.push('/dashboard')
    } catch (error) {
      const appError = handleApiError(error, 'RegularAuthContext')
      logger.error('User signup failed', appError, 'RegularAuthContext')
      throw appError
    }
  }

  const login = async (email: string, password: string) => {
    try {
      logger.info('Attempting user login', { email }, 'RegularAuthContext')
      
      const data = await authService.login({ email, password })

      // Allow users, but redirect admins to admin panel
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        localStorage.setItem('admin_user_access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        logger.info('Admin user redirected to admin panel', { userId: data.user.id, role: data.user.role }, 'RegularAuthContext')
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
      
      logger.info('User login successful', { userId: data.user.id }, 'RegularAuthContext')
      router.push('/dashboard')
    } catch (error) {
      const appError = handleApiError(error, 'RegularAuthContext')
      logger.error('User login failed', appError, 'RegularAuthContext')
      throw appError
    }
  }

  const setUserFromGoogle = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      logger.info('User logout initiated', { userId: user?.id }, 'RegularAuthContext')
      await authService.logout();
      logger.info('User logout successful', undefined, 'RegularAuthContext')
    } catch (error) {
      const appError = handleApiError(error, 'RegularAuthContext')
      logger.error('Logout error', appError, 'RegularAuthContext')
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