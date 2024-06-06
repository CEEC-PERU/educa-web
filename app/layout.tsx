// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footter from '../components/Footter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduStartup Landing Page',
  description: 'Landing page for an educational startup',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 relative">
          <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" /> 
          <main className="z-1">{children}</main>
        </div>
        <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
      </body>
    </html>
  );
}
