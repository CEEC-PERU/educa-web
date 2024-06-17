import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import SidebarDrawer from '../../components/DrawerNavigation';
import { HomeIcon } from '@heroicons/react/24/solid';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
const StudentIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  let uri_picture = ''
  if (profileInfo) {
      const profile = profileInfo as Profile
      uri_picture = profile.profile_picture!
  }

  console.log("Profile", profileInfo);
  return (
    <ProtectedRoute>
      <Navbar
        bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
        user={user ? { profilePicture: uri_picture } : undefined}
      />
      <SidebarDrawer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
        <div></div>
        <div className="p-8 rounded-lg shadow-md max-w-md w-full bg-gray-50">
          <div className="flex items-center space-x-2">
            <HomeIcon className="h-6 w-6 text-blue-500" />
            <span>Home</span>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Página principal de Usuario Estudiante
          </h1>
          <button
            onClick={logout}
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default StudentIndex;
