// components/SidebarDrawer.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const DrawerNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); // Cerrar el drawer después de la navegación
  };

  return (
    <div className="fixed  h-96 z-50">
      <div
        className={`bg-gradient-to-r h-dvh rounded-r-lg bg-brandmorado-700  text-white transition-transform transform ${isOpen ? 'w-64' : 'w-16'}`}
        style={{ transition: 'width 0.3s' }}
      >
        <button
          className="p-4 focus:outline-none"
          onClick={handleToggle}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
        <nav className={`flex-1 ${isOpen ? 'block' : 'hidden'}`}>
          <ul>
            <li>
              <button
                onClick={() => handleNavigation('/student')}
                className="block p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/profile')}
                className="block p-4 text-white hover:bg-brand-200 w-full text-left"
              >
                Profile
              </button>
            </li>
           
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DrawerNavigation;
