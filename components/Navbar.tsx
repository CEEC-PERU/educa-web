// Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Ensure this import is needed for client-side routing operations
import { AcademicCapIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface NavbarProps {
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  navbarHeight?: string;
  toggleSidebar?: () => void;
  showMenuButton?: boolean;
  borderColor? : string;
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
    <nav className={`${bgColor} ${navbarHeight} fixed top-0 left-0 w-full flex items-center z-50  ${borderColor} `}> {/* Añadir borde blanco */}
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {showMenuButton && toggleSidebar && (
            <button onClick={toggleSidebar} className={`${textColor} p-0 m-0 flex items-center justify-center h-full`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          )}
          <div className={`${textColor} ${fontSize} ${fontFamily} font-bold ${showMenuButton ? 'ml-2' : ''}`}>EducaWeb</div>
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
                  <AcademicCapIcon className="h-6 w-6 mr-2 text-white" /> {/* Añadir text-white para el color */}
                </button>
              </Link>
              <Link href="/student">
                <img src={user.profilePicture} alt="Profile" className="h-16 w-16 p-2 rounded-full cursor-pointer" />
              </Link>
              <Link href="/student">
                <button className="flex items-center p-4 text-white hover:bg-brand-200 w-full text-left">
                  <ChevronDownIcon className="h-6 w-6 mr-2 text-white" /> {/* Añadir text-white para el color */}
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
