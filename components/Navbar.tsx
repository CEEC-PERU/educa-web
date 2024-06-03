// app/components/Navbar.tsx

import Link from 'next/link';

interface NavbarProps {
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
}


const Navbar: React.FC<NavbarProps> = ({ bgColor = 'bg-blue-600', textColor = 'text-white' ,   fontSize = 'text-lg',
fontFamily = 'font-sans'}) => {
  return (
    <nav className={`${bgColor } from-indigo-500 p-4 `}>
      <div className="container mx-auto flex justify-between items-center">
        <div className={`${textColor}  ${fontSize} ${fontFamily}  text-lg font-bold`}>
          EducaWeb
        </div>
        <div className="space-x-4">
          <Link href="/" className={`${textColor} ${fontSize} ${fontFamily} hover:text-gray-300`}>Home</Link>
          <Link href="/about" className={`${textColor} ${fontSize} ${fontFamily} hover:text-gray-300`}>About</Link>
          <Link href="/contact" className={`${textColor} ${fontSize} ${fontFamily} hover:text-gray-300`}>Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
