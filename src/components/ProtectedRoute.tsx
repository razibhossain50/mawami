"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children, requiredRoles = ['admin', 'superadmin'] }: { 
  children: React.ReactNode
  requiredRoles?: string[]
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const hasRequiredRole = user?.role && requiredRoles.includes(user.role)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !hasRequiredRole)) {
      router.push('/auth/admin/login')
    }
  }, [isAuthenticated, isLoading, hasRequiredRole, router])

  if (isLoading || !isAuthenticated || !hasRequiredRole) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}