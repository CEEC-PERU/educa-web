import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  ArrowRightStartOnRectangleIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  DocumentIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { useEnterpriseStyles } from '@/context/EnterpriseStylesContext';

const DrawerNavigation: React.FC<{
  isDrawerOpen: boolean;
  toggleSidebar: () => void;
}> = ({ isDrawerOpen, toggleSidebar }) => {
  const router = useRouter();
  const { logout, profileInfo } = useAuth();
  const { styles } = useEnterpriseStyles();

  let name = '';
  let uri_picture = '';
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
    toggleSidebar(); // Close the drawer after navigation
  };

  return (
    <div
      className={`fixed left-0 top-16 h-full z-50 transition-transform transform ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:w-64`}
    >
      <div
        style={{
          backgroundColor: styles?.sidebar?.bgColor || '#0b0c56',
        }}
        className={`h-full rounded-r-lg text-white transition-width transform ${
          isDrawerOpen ? 'w-64' : 'w-16'
        }`}
      >
        <nav className="flex-1">
          <ul>
            <li>
              <button
                onClick={() => handleNavigation('/student')}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white w-full text-left transition-colors hover:bg-[var(--hover-bg)]"
              >
                <HomeIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Home</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/profile')}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white hover:bg-[var(--hover-bg)] w-full text-left"
              >
                <img
                  src={uri_picture}
                  alt="Profile"
                  className="h-6 w-6 rounded-full"
                />
                {isDrawerOpen && <span className="ml-2">{name}</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/cursos')}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white hover:bg-[var(--hover-bg)] w-full text-left"
              >
                <ComputerDesktopIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Cursos</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/evaluaciones')}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white hover:bg-[var(--hover-bg)] w-full text-left"
              >
                <DocumentArrowUpIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Evaluaciones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/certificaciones')}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white hover:bg-[var(--hover-bg)] w-full text-left"
              >
                <DocumentIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Certificaciones</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/notas')}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white hover:bg-[var(--hover-bg)] w-full text-left"
              >
                <DocumentIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Notas</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/student/diplomas')}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white hover:bg-[var(--hover-bg)] w-full text-left"
              >
                <DocumentArrowUpIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Mis Diplomas</span>}
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavigation('/student/juegos')}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white hover:bg-[var(--hover-bg)] w-full text-left"
              >
                <PuzzlePieceIcon className="h-6 w-6" />
                {isDrawerOpen && (
                  <span className="ml-2">Juegos Didácticos</span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={logout}
                style={
                  {
                    '--hover-bg': styles?.sidebar?.hoverColor || '#1e1f72',
                  } as React.CSSProperties
                }
                className="flex items-center p-4 text-white hover:bg-[var(--hover-bg)] w-full text-left"
              >
                <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                {isDrawerOpen && <span className="ml-2">Cerrar Sesión</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DrawerNavigation;
