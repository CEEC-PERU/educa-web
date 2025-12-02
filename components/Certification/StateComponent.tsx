import React from 'react';
import Navbar from '../../components/Navbar';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/24/solid';

interface StateComponentProps {
  userProfile: {
    name: string;
    uri_picture: string;
  };
  toggleSidebar: () => void;
  isDrawerOpen?: boolean;
}

interface ErrorStateProps extends StateComponentProps {
  error: string;
}

export const LoadingStateCertification: React.FC<StateComponentProps> = ({
  userProfile,
  toggleSidebar,
  isDrawerOpen = false,
}) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={
            userProfile.uri_picture
              ? { profilePicture: userProfile.uri_picture }
              : undefined
          }
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer
          isDrawerOpen={isDrawerOpen}
          toggleSidebar={toggleSidebar}
        />
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

export const ErrorStateCertification: React.FC<ErrorStateProps> = ({
  error,
  userProfile,
  toggleSidebar,
  isDrawerOpen = false,
}) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={
            userProfile.uri_picture
              ? { profilePicture: userProfile.uri_picture }
              : undefined
          }
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer
          isDrawerOpen={isDrawerOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">
              Error al cargar los resultados
            </h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300"
              >
                Reintentar
              </button>
              <Link href="/student/certificaciones">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                  Volver a Certificaciones
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);

export const NoResultsStateCertification: React.FC<StateComponentProps> = ({
  userProfile,
  toggleSidebar,
  isDrawerOpen = false,
}) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={
            userProfile.uri_picture
              ? { profilePicture: userProfile.uri_picture }
              : undefined
          }
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer
          isDrawerOpen={isDrawerOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No hay resultados de certificación
            </h2>
            <p className="text-gray-600">
              Parece que aún no has realizado ninguna certificación.
            </p>
            <Link href="/student/certificaciones">
              <button className="mt-6 px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200">
                Volver a Certificaciones
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </ProtectedRoute>
);
