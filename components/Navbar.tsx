// app/components/Navbar.tsx

import Link from 'next/link';

interface NavbarProps {
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  navbarHeight?: string; // Nueva prop para controlar la altura del navbar
}

const Navbar: React.FC<NavbarProps> = ({
  bgColor = 'bg-blue-600',
  textColor = 'text-white',
  fontSize = 'text-2xl',
  fontFamily = 'font-sans',
  navbarHeight = 'h-16', // altura del navbar ajustada
}) => {
  return (
    <nav className={`${bgColor} ${navbarHeight} fixed top-0 left-0 w-full flex items-center z-50`}>
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className={`${textColor} ${fontSize} ${fontFamily} font-bold`}>
          EducaWeb
        </div>
        <div className="space-x-4">
          <Link href="/login" className={`${textColor} ${fontSize} ${fontFamily} hover:text-gray-300 font-bold`}>
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
