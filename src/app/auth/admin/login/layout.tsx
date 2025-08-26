import { Outfit } from 'next/font/google';
import type { Metadata } from 'next';
import "../../../admin/globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mawami',
  description: 'Your Story Begins Here',
  openGraph: {
    title: 'Mawami',
    description: 'Your Story Begins Here',
    siteName: 'Mawami',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mawami',
    description: 'Your Story Begins Here',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-white-100 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
