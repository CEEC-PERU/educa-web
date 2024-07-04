import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
import { useEnterprise } from '../../hooks/useEnterprise';

import './../../app/globals.css';

const StudentProfile: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { enterprise, error, isLoading } = useEnterprise();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let name = '', last_name = '', uri_picture = '', phone, email;
  let userInfo = { id: 0, dni: '' };
  
  if (user) {
    userInfo = user as { id: number, dni: string };
  }
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    last_name = profile.last_name;
    uri_picture = profile.profile_picture!;
    phone = profile.phone;
    email = profile.email;
  }

  console.log("Profile", profileInfo);

  const handleEditClick = () => {
    router.push('/student/edit-profile'); // Adjust the path according to your routing setup
  };

  return (
    <ProtectedRoute>
      <Navbar
        bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
        user={user ? { profilePicture: uri_picture } : undefined}
      />
       <SidebarDrawer isDrawerOpen={isDrawerOpen} />
      <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 pt-16">
        <div className="relative w-full max-w-full lg:max-w-4xl mx-auto mb-8">
          <img
            src={enterprise?.enterprise.image_fondo}
            className="w-full h-auto"
            alt="Imagen descriptiva"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center lg:justify-start lg:items-start p-4">
            <img
              src={uri_picture}
              alt="Profile"
              className="h-40 w-40 rounded-full border-4 border-white"
            />
          </div>
        </div>
        <div className="w-full max-w-full lg:max-w-4xl mx-auto p-4 text-center lg:text-center">
          <h2 className="2xl:text-4xl lg:text-4xl md:text-4xl text-white font-bold mb-3 ">
            {name} {last_name}
          </h2>
        </div>
        <div className="lg:max-w-4xl mx-auto p-4 ">
          <div className="flex justify-between items-center mb-4">
            <p className="2xl:text-xl lg:text-xl md:text-xl text-white font-bold">Datos Personales</p>
            <button 
              onClick={handleEditClick}
              className="bg-brandrosado-800 text-white px-4 py-2 rounded-full hover:bg-brandmorado-700"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-white">Nombres</p>
              <input
                id="nombres"
                type="text"
                value={name}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-white">Apellidos</p>
              <input
                id="apellidos"
                type="text"
                value={last_name}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-white">Email</p>
              <input
                id="email"
                type="text"
                value={email}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-white">Teléfono</p>
              <input
                id="phone"
                type="text"
                value={phone}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-white">Empresa</p>
              <input
                id="empresa"
                type="text"
                value={enterprise?.enterprise.name}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-white">Usuario</p>
              <input
                id="dni"
                type="text"
                value={userInfo.dni}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-white sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default StudentProfile;
