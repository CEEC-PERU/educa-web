import React from 'react';
import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

interface StateComponentProps {
  userProfile: {
    name: string;
    uri_picture: string;
  };
  toggleSidebar: () => void;
  isDrawerOpen?: boolean;
}

export const LoadingState: React.FC<StateComponentProps> = ({ 
  userProfile, 
  toggleSidebar, 
  isDrawerOpen = false 
}) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={userProfile.uri_picture ? { profilePicture: userProfile.uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-200"></div>
          </div>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);

interface ErrorStateProps extends StateComponentProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  userProfile, 
  toggleSidebar, 
  isDrawerOpen = false 
}) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={userProfile.uri_picture ? { profilePicture: userProfile.uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error al cargar los resultados</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
              <Link href="/student/evaluaciones">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Volver a Evaluaciones
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);

export const NoResultsState: React.FC<StateComponentProps> = ({ 
  userProfile, 
  toggleSidebar, 
  isDrawerOpen = false 
}) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={userProfile.uri_picture ? { profilePicture: userProfile.uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 mb-4">
              No hay intentos registrados para esta evaluación.
            </p>
            <Link href="/student/evaluaciones">
              <button className="px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors">
                Volver a Evaluaciones
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);