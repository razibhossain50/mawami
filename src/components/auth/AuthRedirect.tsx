"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegularAuth } from '@/context/RegularAuthContext';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { isAuthenticated, isLoading } = useRegularAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}