import { Outfit } from 'next/font/google';
import "../../../admin/globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-white-100 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
