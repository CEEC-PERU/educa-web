"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type PublicNavbarLink = {
  href: string;
  label: string;
};

type PublicNavbarProps = {
  links?: PublicNavbarLink[];
  loginHref?: string;
  className?: string;
  variant?: "landing" | "minimal";
  lightSectionId?: string;
};

export default function PublicNavbar({
  links = [],
  loginHref = "/login",
  className = "",
  variant = "landing",
  lightSectionId = "hero-section",
}: PublicNavbarProps) {
  const [overDarkBackground, setOverDarkBackground] = useState(false);

  useEffect(() => {
    const navHeight = 64;
    const handleScroll = () => {
      const lightSection = document.getElementById(lightSectionId);
      if (!lightSection) {
        setOverDarkBackground(false);
        return;
      }
      const { bottom } = lightSection.getBoundingClientRect();
      setOverDarkBackground(bottom <= navHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lightSectionId]);

  const bgClass = "bg-transparent";

  const textClass = overDarkBackground
    ? "text-white"
    : "text-gray-800";
  const logoTextClass = overDarkBackground ? "text-white" : "text-black";

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className={`${bgClass} h-16 fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${className}`}
    >
      <div className="container mx-auto flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          {/*
          <img
            src="https://res.cloudinary.com/dk2red18f/image/upload/v1770755434/WEB_EDUCA/LOGO_A365_BLANCO_sin_texto_dnmnm9.png"
            alt="EducaWeb Logo"
            className="h-8 sm:h-10"
          />*/}
          <img
            src="https://res.cloudinary.com/dk2red18f/image/upload/v1724273464/WEB_EDUCA/smxqc1j66tbr0dkrxbdt.png"
            alt="EducaWeb Logo"
            className="h-8 sm:h-10"
          />
          <span
            className={`${logoTextClass} font-bold text-base sm:text-lg transition-colors duration-300`}
          >
            MentorMind
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {links.length > 0 && (
            <div className="hidden md:flex items-center space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${textClass} hover:underline text-sm sm:text-base`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <Link
            href={loginHref}
            className={`${textClass} hover:underline text-sm sm:text-base font-medium`}
          >
            LOGIN
          </Link>
        </div>
      </div>
    </nav>
  );
}
