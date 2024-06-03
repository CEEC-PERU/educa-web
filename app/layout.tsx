// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

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
        <Navbar bgColor="bg-gradient-to-r from-sky-600 via-purple-500 to-fuchsia-900"  />
        {children}
      </body>
    </html>
  );
}
