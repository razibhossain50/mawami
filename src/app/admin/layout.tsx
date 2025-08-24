import { Outfit } from 'next/font/google';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import {AppLayoutContent} from '@/components/layout/AppLayoutContent';
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'



import './globals.css';

const outfit = Outfit({
  subsets: ["latin"],
   display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`${outfit.className} bg-white-100 dark:bg-gray-900`} >
        
        <AuthProvider>
      <ProtectedRoute>
        <ThemeProvider>
          <SidebarProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
          </SidebarProvider>
        </ThemeProvider>
        </ProtectedRoute>
        </AuthProvider>
        </body>
        </html>
      );
}

