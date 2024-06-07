import React, { useEffect } from 'react';
import Link from 'next/link';

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ showSidebar, setShowSidebar }) => {
  useEffect(() => {
    setShowSidebar(true);
  }, [setShowSidebar]);

  return (
    <div className={`fixed inset-y-0 left-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-900 text-white w-64 z-40`}>
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <h2 className="text-lg font-bold">Menú</h2>
        <button onClick={() => setShowSidebar(false)} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link href="/contenido">
              <span className="block px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Cursos</span>
            </Link>
          </li>
          <li>
            <Link href="/contenido/categorias">
              <span className="block px-4 py-2 rounded hover:bg-gray-700 cursor-pointer">Categorías</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
