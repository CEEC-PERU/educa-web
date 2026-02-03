import React from 'react';
import Link from 'next/link';
import {
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import { useEnterpriseStyles } from '../context/EnterpriseStylesContext';

interface NavbarProps {
  toggleSidebar?: () => void;
  showMenuButton?: boolean;
  links?: { href: string; label: string }[];
  user?: { profilePicture?: string };
}

const Navbar: React.FC<NavbarProps> = ({
  toggleSidebar,
  showMenuButton = true,
  links = [],
  user,
}) => {
  const { styles, loading } = useEnterpriseStyles();
  const bgColor = styles?.navbar?.bgColor || 'transparent';
  const textColor = styles?.navbar?.textColor || '#ffffff';
  const navbarHeight = 'h-16';

  return (
    <nav
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      role="navigation"
      aria-label="Main navigation"
      className={`${navbarHeight} fixed top-0 left-0 w-full z-50`}
    >
      <div
        className={`container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8`}
      >
        <div className="flex items-center">
          {showMenuButton && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-2 lg:hidden hover:bg-white/10 rounded"
              style={{ color: textColor }}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}
          <div className={`ml-2 flex items-center space-x-2`}>
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1770061358/WEB_EDUCA/Logo_A365_pq8vkk.png"
              alt="EducaWeb Logo"
              className="h-8 sm:h-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  style={{ color: textColor }}
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/student">
                <button
                  className="p-2 hover:bg-white/20 rounded-full"
                  style={{ color: textColor }}
                >
                  <AcademicCapIcon className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/student">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2"
                  style={{ borderColor: textColor }}
                />
              </Link>
              <Link href="/student">
                <button
                  className="p-2 hover:bg-white/20 rounded-full"
                  style={{ color: textColor }}
                >
                  <ChevronDownIcon className="h-5 w-5" />
                </button>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <span
                style={{ color: textColor }}
                className="hover:underline cursor-pointer text-sm sm:text-base"
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
