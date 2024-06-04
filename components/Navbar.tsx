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
  fontSize = 'text-lg',
  fontFamily = 'font-sans',
  navbarHeight = 'h-35', // altura del navbar
}) => {
  return (
    <nav className={`${bgColor} ${navbarHeight} from-indigo-700 p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className={`${textColor} ${fontSize} ${fontFamily} text-lg font-bold`}>
          EducaWeb
        </div>
        <div className="space-x-4">
          <Link href="/login" className={`${textColor} ${fontSize} ${fontFamily} hover:text-gray-300`}>Inicio de Sesión</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
