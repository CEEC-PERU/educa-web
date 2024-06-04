// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footter from "../components/Footter"; // Importa el componente Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduStartup Landing Page",
  description: "Landing page for an educational startup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar bgColor="bg-gradient-to-r from-cyan-900 to-emerald-900"  />
        {children}
        <Footter  footerText="2024 EducaWeb. Todos los derechos reservados."/> {/* Agrega el componente Footer aquí */}
      </body>
    </html>
  );
}
