// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footter from '../components/Footter';
import Head from 'next/head';
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
        <Head>
        <title>MentorMind | Cursos de Liderazgo y Desarrollo Profesional</title>
        <meta name="description" content="Programas de formación en soft skills, gestión del cambio y liderazgo transformacional para profesionales y empresas." />
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="MentorMind | Cursos de Liderazgo" />
        <meta property="og:description" content="Desarrolla habilidades clave con nuestros programas de formación profesional." />
        <meta property="og:image" content="https://res.cloudinary.com/dk2red18f/image/upload/v1724273464/WEB_EDUCA/smxqc1j66tbr0dkrxbdt.png" />
        <meta property="og:url" content="https://mentormind.com.pe" />
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className={inter.className}>{children}</body>
  
    </html>
  );
}
