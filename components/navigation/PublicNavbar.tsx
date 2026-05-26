import React from "react";
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
};

export default function PublicNavbar({
  links = [],
  loginHref = "/login",
  className = "",
  variant = "landing",
}: PublicNavbarProps) {
  const bgClass =
    variant === "minimal"
      ? "bg-white border-b border-gray-200"
      : "bg-gradient-to from-brand-mor-600 via-brandfucsia-900 to-brand-800";

  const textClass = variant === "minimal" ? "text-gray-800" : "text-white";

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className={`${bgClass} h-16 fixed top-0 left-0 w-full z-50 ${className}`}
    >
      <div className="container mx-auto flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <img
            src="https://res.cloudinary.com/dk2red18f/image/upload/v1770755434/WEB_EDUCA/LOGO_A365_BLANCO_sin_texto_dnmnm9.png"
            alt="EducaWeb Logo"
            className="h-8 sm:h-10"
          />
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
