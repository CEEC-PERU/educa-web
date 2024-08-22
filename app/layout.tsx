// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footter from '../components/Footter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MentorMind',
  description: 'MentorMind plataforma educativa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <div >
          <Navbar bgColor="bg-gradient-to from-brand-mor-600 via-brandfucsia-900 to-brand-800 " paddingtop='pt-8' /> 

        
          <main className="z-1">{children}</main>
        </div>
        <Footter footerText="2024 MentorMind. Todos los derechos reservados." />
      </body>
    </html>
  );
}
