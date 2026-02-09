import React from 'react';
import Link from 'next/link';
import {
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

interface NavbarProps {
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  paddingtop?: string;
  navbarHeight?: string;
  toggleSidebar?: () => void;
  showMenuButton?: boolean;
  borderColor?: string;
  links?: { href: string; label: string }[];
  user?: { profilePicture?: string };
}

const Navbar: React.FC<NavbarProps> = ({
  bgColor = 'bg-blue-600',
  textColor = 'text-white',
  fontSize = 'text-2xl',
  fontFamily = 'font-sans',
  paddingtop = 'pt-0',
  navbarHeight = 'h-16',
  toggleSidebar,
  borderColor = '',
  showMenuButton = true,
  links = [],
  user,
}) => {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`bg-white ${navbarHeight} fixed top-0 left-0 w-full z-50 ${borderColor}`}
    >
      <div
        className={`container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 ${paddingtop}`}
      >
        <div className="flex items-center">
          {showMenuButton && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className={`${textColor} p-2 lg:hidden`}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}
          <div className={`ml-2 flex items-center space-x-2`}>
            <img
              //src="https://res.cloudinary.com/dk2red18f/image/upload/v1724273464/WEB_EDUCA/smxqc1j66tbr0dkrxbdt.png"
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1770061358/WEB_EDUCA/Logo_A365_pq8vkk.png"
              alt="EducaWeb Logo"
              className="h-8 sm:h-10"
            />
            {/*
            <span className={`${textColor} font-bold text-base sm:text-lg`}>
              MentorMind
            </span>*/}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Hidden on small screens, shown on medium and above envio datos y envio */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`${textColor} hover:underline cursor-pointer text-sm sm:text-base`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/student">
                <button className="p-2 hover:bg-white/20 rounded-full">
                  <AcademicCapIcon className="h-5 w-5 text-red-500" />
                </button>
              </Link>
              <Link href="/student">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white"
                />
              </Link>
              <Link href="/student">
                <button className="p-2 hover:bg-white/20 rounded-full">
                  <ChevronDownIcon className="h-5 w-5 text-red-500 " />
                </button>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <span
                className={`${textColor} hover:underline cursor-pointer text-sm sm:text-base`}
              >
                LOGIN
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
