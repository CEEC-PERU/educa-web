import Link from 'next/link';

interface NavbarProps {
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  navbarHeight?: string;
  toggleSidebar?: () => void; // Nueva prop opcional para manejar el toggle del sidebar
  showMenuButton?: boolean; // Nueva prop para controlar la visibilidad del botón
}

const Navbar: React.FC<NavbarProps> = ({
  bgColor = 'bg-blue-600',
  textColor = 'text-white',
  fontSize = 'text-2xl',
  fontFamily = 'font-sans',
  navbarHeight = 'h-16',
  toggleSidebar,
  showMenuButton = true, // Por defecto, el botón se muestra
}) => {
  return (
    <nav className={`${bgColor} ${navbarHeight} fixed top-0 left-0 w-full flex items-center z-50`}>
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
