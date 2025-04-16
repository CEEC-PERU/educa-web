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
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
