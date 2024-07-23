import React from 'react';
import Link from 'next/link';
import { AcademicCapIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface NavbarProps {
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
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
  navbarHeight = 'h-16',
  toggleSidebar,
  borderColor,
  showMenuButton = true,
  links = [],
  user,
}) => {
  return (
    <nav className={`${bgColor} ${navbarHeight} fixed top-0 left-0 w-full items-center z-50 ${borderColor}`}>
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {showMenuButton && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className={`${textColor} p-0 m-0 flex items-center justify-center h-full lg:hidden`}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}
          <div className={`${showMenuButton ? 'ml-2' : ''} flex items-center`}>
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1721667499/WEB_EDUCA/ygxb9ji1xcpxzv23ovje.png"
              alt="EducaWeb Logo"
              className="h-12"
            />
            <h2 className="text-white font-bold">EducaWeb</h2>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`${textColor} hover:underline cursor-pointer`}>{link.label}</span>
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/student">
                <button className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left">
                  <AcademicCapIcon className="h-6 w-6 mr-2 text-white" />
                </button>
              </Link>
              <Link href="/student">
                <img src={user.profilePicture} alt="Profile" className="h-16 w-16 p-2 rounded-full cursor-pointer" />
              </Link>
              <Link href="/student">
                <button className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left">
                  <ChevronDownIcon className="h-6 w-6 mr-2 text-white" />
                </button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <span className={`${textColor} hover:underline cursor-pointer`}>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
